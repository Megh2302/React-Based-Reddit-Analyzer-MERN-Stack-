import React, { Component } from 'react';
import './UserOverview.css';
class UserOverview extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <div className="user-info">
            <h2>User Comment Overview</h2>
        <div className="card text-center">
            <br />
            <br />
            <div className="user-row">
            <div className="user-circle1">
            <div className="comment-info">{this.props.userOverviewData_Comments.length}</div>
        <span>Total Comments</span>
        </div>
        <div className="user-circle1">
            <div className="comment-info">{this.props.userOverviewData_Posts.length}</div>
        <span>Total Posts</span>
        </div>
        </div>
        <br />  
        <div className="user-row">
            <div className="user-circle1">
            <div className="comment-info">{this.props.userOverviewData_ave_karma_comment}</div>
        <span>Avg Comments Karma</span>
        </div>
        <div className="user-circle1">
            <div className="comment-info">{this.props.userOverviewData_avg_karma_post}</div>
        <span>Avg Posts Karma</span>
        </div>
        </div>

        <br />
        <h2 className="stats-title">Most Upvotes & Upvoted Comment</h2>
        <br />
        <div className="user-row">
            <div className="user-circle">
            <div className="comment-info">{this.props.userOverviewData_most_upvoted_comment.ups}</div>
        <span>Most Upvotes</span>
        </div >
        <div >
        <div ><span className="upvoted-comment">{this.props.userOverviewData_most_upvoted_comment.body}</span></div>
        </div>
        </div>
        <br />
        <h2 className="stats-title">Most Downvotes & Downvoted Comment</h2>
        <br />
        <div className="user-row">
            <div className="user-circle">
            <div className="comment-info">{this.props.userOverviewData_most_downvoted_comment.score}</div>
        <span>Most Downvote</span>
        </div >
        <div>
        <div><span className="downvoted-comment">{this.props.userOverviewData_most_downvoted_comment.body}</span></div>
        </div>
        </div>
        <br />
        <h2 className="stats-title"> Most Upvotes & Upvoted Post</h2>
        <br />
        <div className="user-row">
            <div className="user-circle">
            <div className="comment-info">{this.props.userOverviewData_most_upvoted_post.ups}</div>
        <span>Most Upvotes</span>
        </div >
        <div>
        <div><span className="upvoted-post">{this.props.userOverviewData_most_upvoted_post.title}</span></div>
        </div>
        </div>
        <br />
        <h2 className="stats-title">Most Downvotes & Downvoted Post</h2>
        <br />
        <div className="user-row">
            <div className="user-circle">
            <div className="comment-info">{this.props.userOverviewData_most_downvoted_post.score}</div>
        <span>Most Downvote</span>
        </div>
        <div>
        <div><span className="downvoted-post">{this.props.userOverviewData_most_downvoted_post.title}</span></div>
        </div>
        </div>
        </div>
        </div>
        );
        this.props.userOverviewData_Posts=null;
    }
}

UserOverview.propTypes = {
    userOverviewData_Comments: React.PropTypes.array,
    userOverviewData_Posts: React.PropTypes.array,
    // userOverviewData_Upvotes: React.PropTypes.array
}

export default UserOverview;
