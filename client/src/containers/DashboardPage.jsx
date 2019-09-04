import React from 'react';
import Auth from '../modules/Auth';
import Dashboard from '../components/Dashboard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import UserAbout from '../components/UserAbout.jsx';
import UserOverview from '../components/UserOverview.jsx';
import Words from '../components/Words.jsx';
import Lines from '../components/Lines.jsx';
import Spinner from '../components/Spinner.jsx';
import axios from 'axios';

import logo from './Reddit.png';
import './app.css';

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
const sw = require('stopword')

var dataFunctions = require("./data-functions.js");





class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);
    

    this.state = {
      secretData: '',
      user: {},
      userAbout: {},
      userComments: [],
      userPosts: [],
      showResults: false,
      showSpinner: false,
      mostUpvotedComment: {},
      mostDownvotedComment: {},
      mostUpvotedPost: {},
      mostDownvotedPost: {},
      avgKarmaComment: 0,
      avgKarmaPost: 0,
      worddata:[],
      points:[],
      useremail:window.email
    };
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
      
    this.setState({ showResults: false });
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message,
          user: xhr.response.user
        });
      }
    });
    xhr.send();
  }

  generatePDF() {
    const input = document.getElementById('toPrint'); // element with this id will be selected to print in pdf

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("reddit_report.pdf");
      });
  }

  async sendReportByEmail() {
    try{
        let bd = [{
        email: window.email,
        username:this.state.userAbout.name,
        mostUpvotedCommentText: this.state.mostUpvotedComment.body,
        mostUpvotedCommentCount: this.state.mostUpvotedComment.ups,
        mostDownvotedCommentText: this.state.mostDownvotedComment.body,
        mostDownvotedCommentCount: this.state.mostDownvotedComment.score,
        mostUpvotedPostText: this.state.mostUpvotedPost.title,
        mostUpvotedPostCount: this.state.mostUpvotedPost.ups,
        mostDownvotedPostText: this.state.mostDownvotedPost.title,
        mostDownvotedPostCount: this.state.mostDownvotedPost.score
        }];
      
      
        await axios.post(`/reddit/sendEmail`,bd,{headers: {
            'Content-Type': 'application/json',
        }});
    
    alert(`Report successfully sent to your Email`);

    }catch(error){
      console.log({ error: error })
    }
  }



async handleSearchUser(searchQuery) {

    this.setState({ showResults: false })
    this.setState({ showSpinner: true })

  let data = [];
  let comments = {};
  let counter = {};
  let years = {};
  

  
  
  try {
    var searchResults_userAbout = await fetch(`/reddit/about/${searchQuery}`);
    searchResults_userAbout = await searchResults_userAbout.json();
    this.setState({ userAbout: searchResults_userAbout });
  }
  catch (error) {
    alert(`No reddit user by the name of ${searchQuery}! `);
    this.setState({ showResults: false })
    this.setState({ showSpinner: false })
  }

  // fetch user's comments and set state
  try {
    var searchResults_userComments = await fetch(`/reddit/comments/${searchQuery}`);
    searchResults_userComments = await searchResults_userComments.json();
    this.setState({ userComments: searchResults_userComments });

    var commentStats = dataFunctions.getVotesStats(searchResults_userComments)
    this.setState({ mostUpvotedComment: commentStats.upvoted })
    this.setState({ mostDownvotedComment: commentStats.downvoted })
    this.setState({ avgKarmaComment: commentStats.avg_karma })    


    // fetch user's posts and set state
    var searchResults_userPosts = await fetch(`/reddit/posts/${searchQuery}`);
    searchResults_userPosts = await searchResults_userPosts.json();
    this.setState({ userPosts: searchResults_userPosts });
    

    let postStats = dataFunctions.getVotesStats(searchResults_userPosts)
    this.setState({ mostUpvotedPost: postStats.upvoted })
    this.setState({ mostDownvotedPost: postStats.downvoted })
    this.setState({ avgKarmaPost: postStats.avg_karma })
    

    //Data Generation from Graph

    for(let i =0 ;i<searchResults_userComments.length;i++)
            {
                

                let element = searchResults_userComments[i];
                let oldwords = String(element.data.body).toLowerCase().replace(/ +(?= )/g,'').trim().split(' ');
                let words = sw.removeStopwords(oldwords)

                for(let j=0;j<words.length;j++)
                {
                    if(words[j] in counter)
                    {
                        counter[words[j]] = counter[words[j]] + 10
                    }
                    else
                    {
                        counter[words[j]] = 10
                    }
                }

                let utcSeconds  = searchResults_userComments[i].data.created_utc;
                let d = new Date(0);
                d.setUTCSeconds(utcSeconds);
                let y = d.getFullYear();
                if(y in years)
                {
                    years[y] = years[y] + 1;
                }
                else
                {
                    years[y] = 1;
                }

            }

            
            
            let keysSorted = Object.keys(counter).sort(function(a,b){return counter[b]-counter[a]})
            
            if( counter.lenght < 100)
            {
                
                for(let i=0;i<keysSorted.length;i++)
                {
                    let word = {
                        text:keysSorted[i],
                        value:counter[keysSorted[i]]
                    };
                    data.push(word);
                }
            }
            else
            {
                for(let i=0;i<500;i++)
                {
                    let word = {
                        text:keysSorted[i],
                        value:counter[keysSorted[i]]
                    };
                    data.push(word);
                }
            }
            
            this.setState({worddata: data});
            
            let pyears = {}
            for(let i =0 ;i<searchResults_userPosts.length;i++)
            {

                let utcSeconds  = searchResults_userPosts[i].data.created_utc;
                let d = new Date(0);
                d.setUTCSeconds(utcSeconds);
                let y = d.getFullYear();
                if(y in pyears)
                {
                    pyears[y] = pyears[y] + 1;
                }
                else
                {
                    pyears[y] = 1;
                }

            }

            let pointyears = [];

            for(let y in years)
            {
                let p;
                if(y in pyears)
                {
                p = {
                    x:parseInt(y),
                    y:years[y],
                    z:pyears[y]
                }
            }
            else{
                p = {
                    x:parseInt(y),
                    y:years[y],
                    z:0
                }
            }
                pointyears.push(p);
            }
            this.setState({ points: pointyears});
            this.setState({ showResults: true })
            this.setState({ showSpinner: false })

  } catch (error) {
    console.log("ERROR HERE: " + error);
  }
}


render() {
return (
  <div className="container">
  <div className="logo"><img src={logo}  alt='logo' /></div>
  <SearchBar searchUser={this.handleSearchUser.bind(this)}/>
  {this.state.showSpinner? <Spinner />: null}
  {this.state.showResults? <UserAbout userAboutData={this.state. userAbout} />: null}
  {this.state.showResults? <UserOverview
        userOverviewData_Comments={this.state.userComments}
        userOverviewData_Posts={this.state.userPosts}
        userOverviewData_most_downvoted_comment={this.state.mostDownvotedComment}
        userOverviewData_most_upvoted_comment={this.state.mostUpvotedComment}
        userOverviewData_most_downvoted_post={this.state.mostDownvotedPost}
        userOverviewData_most_upvoted_post={this.state.mostUpvotedPost}
        userOverviewData_avg_karma_post={this.state.avgKarmaPost}
        userOverviewData_ave_karma_comment={this.state.avgKarmaComment}/> : null}
  {this.state.showResults ? <Words data={this.state.worddata}/>: null}
  {this.state.showResults ? <Lines points={this.state.points}/>: null}
  {this.state.showResults ? <button className='Email-btn' type='button' onClick={this.sendReportByEmail.bind(this)}>Email Report</button> : null}
</div>
);
}
}


export default DashboardPage;
