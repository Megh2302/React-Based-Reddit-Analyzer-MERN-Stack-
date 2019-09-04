const nodemailer = require('nodemailer');
const redisConnection = require("./redis-connection")
require('dotenv').config()
/*import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'*/

let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'apikey',
        pass: process.env.SG_API_M
    }
});

// setup email data with unicode symbols


redisConnection.on("sendEmail:request:*", async(message,channel) => {
    

    let requestId = message.requestId;
    let eventName = message.eventName;
    var response;

    let userdata = message.data[0]
  

    let group_name = 'Programming Teletubbies'
    let text1 = '<br><b> Most Upvotes for a comment </b>: '+userdata.mostUpvotedCommentCount+' <br> <b>Comment</b> - '+userdata.mostUpvotedCommentText;
    let text2 = '<br><br> <b>Most Downvotes for a comment </b>: '+userdata.mostDownvotedCommentCount+' <br> <b>Comment</b> - '+userdata.mostDownvotedCommentText;
    let text3 = '<br><br> <b>Most Upvotes for a post </b>: '+userdata.mostUpvotedPostCount+' <br> <b>Post</b> - '+userdata.mostUpvotedPostText;
    let text4 = '<br><br> <b>Most Downvotes for a post </b>: '+userdata.mostDownvotedPostCount+' <br> <b>Post</b> - '+userdata.mostDownvotedPostText;
    

    let mailOptions = {
        from: group_name+' pkulkar2@stevens.edu', // sender address
        to: userdata.email, // list of receivers
        subject: 'Reddit Analyzer | User Report', // Subject laine
        html: '<b>Hello,</b> <br><br> Reddit Analyzer User Report for: '+ 
        '<b>'+userdata.username+'</b></br>'
        + text1 + text2 + text3 + text4+
       ' <br><br> Thank you,<br>'+group_name+'<br>',
        
        /*headers:{
            'X-SMTPAPI': {"send_at": 1525516800}    // Isn't working as of now..
        }*/
    };

    let successEvent = `${eventName}:success:${requestId}`;

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            response = { error: error }
        }

       console.log(info)
        response = { message: "Email sent from the app"}
    });
    //console.log('Email sent to '+userdata.email)

    redisConnection.emit(successEvent, {
        requestId: requestId,
        data:response,
        eventName: eventName
    });
})