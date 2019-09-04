///\desc This file contains functions to send/recieve data from Reddit
var bluebird = require('bluebird');
var axios = bluebird.promisifyAll(require('axios'));

module.exports = {
    ///\brief This function fetches a user's About
    getUserAbout: function (username) {
        return new Promise(async (resolve, reject) => {
            try {
                var response = await axios.get(`https://www.reddit.com/user/${username}/about/.json`);
            } catch (error) {
                
                reject(new Error("Failed to fetch data"));
            }
            resolve(response);
        });
    },

    ///\brief This function fetches a user's entire comment history
    getUserComments: function (username, after = '') {
        return new Promise(async (resolve, reject) => {
            var response = await axios.get(`https://www.reddit.com/user/${username}/comments.json?limit=100&after=${after}`);
            let data = response.data.data.children;

            if (data.length < 100) {
                resolve(data);
            }

            else if (data.length === 100) {
                // recursively fetch user's entire comment history
                resolve(data.concat(await this.getUserComments(username, data[99].data.name)));
            }

            else {
                reject(new Error("Data fetch failed (Comments)"));
            }
        });
    },

    getUserPosts: function (username, after = '') {
        return new Promise(async (resolve, reject) => {
            var response = await axios.get(`https://www.reddit.com/user/${username}/submitted.json?limit=100&after=${after}`);
            let data = response.data.data.children;

            if (data.length < 100) {
                resolve(data);
            }

            else if (data.length === 100) {
                // recursively fetch user's entire post history
                resolve(data.concat(await this.getUserPosts(username, data[99].data.name)));
            }

            else {
                reject(new Error("Data fetch failed (Posts)"));
            }
        });
    }
}