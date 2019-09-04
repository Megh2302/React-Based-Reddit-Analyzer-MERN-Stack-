const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

const mySmtp = require('./server/smtp_worker')
const redisConnection = require("./server/redis-connection");
const nrpSender = require("./server/nrp-sender-shim");
var API_helper_Reddit = require("./server/API-helper-reddit.js");

require('dotenv').config()

var bluebird = require('bluebird');
var redis = bluebird.Promise.promisifyAll(require('redis'));

let redisClient = redis.createClient();
redisClient.on('connect', function () {
  console.log('Redis connected on port:6379 ...');
});
// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Set Port, hosting services will look for process.env.PORT
app.set('port', (process.env.PORT || 3000));



// this route serves reddit user's About
app.get("/reddit/about/:username", async (req, res) => {
  try {
    let found = false;
    var result;

    // first, search redis cache for this username's About
    await redisClient.lrange('about', 0, 4, async function (err, redisHistory) {
      if (err) {
        res.status(500).send(error.message);
      } else {
        for (let i = 0; i < redisHistory.length; i++) {
          let obj = JSON.parse(redisHistory[i]);
          if (obj.name.toLowerCase() == req.params.username.toLowerCase()) {
            found = true;
            res.send(obj);
          }
        }
        // if user entry not found in cache, fetch data from reddit and add a new entry in cache
        if (!found) {
          try {
            result = await API_helper_Reddit.getUserAbout(req.params.username);
            await redisClient.lpush("about", JSON.stringify(result.data.data));
            ///\cite https://stackoverflow.com/a/12060069
            ///\remark How to limit redis list size
            await redisClient.ltrim("about", 0, 4); // cache only upto 5 recent entries
            res.send(result.data.data);
          } catch (error) {
            res.status(500).send(error.message);
          }
        }
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  };
});

// this route serves reddit user's comment history
app.get("/reddit/comments/:username", async (req, res) => {
  try {
    let found = false;
    var result;

    // first, search redis cache for this username's Comments
    await redisClient.lrange('comments', 0, 4, async function (err, redisHistory) {
      if (err) {
      }
      else {
        for (let i = 0; i < redisHistory.length; i++) {
          let userHistory = await JSON.parse(redisHistory[i]);
          for (let j = 0; j < userHistory.length; j++) {
            let obj = userHistory[j];
            if (obj.data.author.toLowerCase() == req.params.username.toLowerCase()) {
              //console.log(`User ${req.params.username} found in cache`);
              found = true;
              res.send(userHistory);
              break;
            }
          }
        }

        if (!found) {
          //console.log(`User ${req.params.username} not found in cache`);
          try {
            result = await API_helper_Reddit.getUserComments(req.params.username);
            await redisClient.lpush("comments", await JSON.stringify(result));
            ///\cite https://stackoverflow.com/a/12060069
            ///\remark How to limit redis list size
            await redisClient.ltrim("comments", 0, 4); // cache only upto 5 recent entries
            res.send(result);
          } catch (error) {
          }
        }
      }
    });
  } catch (error) {
    console.log(error.message)
  };
});

// this route serves reddit user's post history
app.get("/reddit/posts/:username", async (req, res) => {
  try {
    let found = false;
    var result;

    // first, search redis cache for this username's Comments
    await redisClient.lrange('posts', 0, 4, async function (err, redisHistory) {
      if (err) {
      }
      else {
        for (let i = 0; i < redisHistory.length; i++) {
          let userHistory = await JSON.parse(redisHistory[i]);
          for (let j = 0; j < userHistory.length; j++) {
            let obj = userHistory[j];
            if (obj.data.author.toLowerCase() == req.params.username.toLowerCase()) {
              //console.log(`User ${req.params.username} found in cache`);
              found = true;
              res.send(userHistory);
              break;
            }
          }
        }

        if (!found) {
          //console.log(`User ${req.params.username} not found in cache`);
          try {
            result = await API_helper_Reddit.getUserPosts(req.params.username);
            await redisClient.lpush("posts", await JSON.stringify(result));
            ///\cite https://stackoverflow.com/a/12060069
            ///\remark How to limit redis list size
            await redisClient.ltrim("posts", 0, 4); // cache only upto 5 recent entries
            res.send(result);
          } catch (error) {
          }
        }
      }
    });
  } catch (error) {
    console.log(error.message)
  };
});

app.get('/reddit/sendEmail', async (req, res) => {

  try {
   
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "sendEmail",
      
    })

    res.json(response)

  } catch (e) {
    res.json({ error: e.message });
  }
});

app.post('/reddit/sendEmail', async (req, res) => {

  try {
    
    let response = await nrpSender.sendMessage({
      redis: redisConnection,
      eventName: "sendEmail",
      data:req.body
    })

    res.json(response)

  } catch (e) {
    res.json({ error: e.message });
  }
});


app.get("*", (req, res) => {
  res.redirect('/');
});
// start the server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
