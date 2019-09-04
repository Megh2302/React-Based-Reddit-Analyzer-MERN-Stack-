import React, { Component } from 'react';
//import PropTypes from 'prop-types';
//import moment from 'moment';

import './UserAbout.css';
class UserAbout extends Component {
  constructor() {
    super();
    this.state = {
      userAboutData: {}
    }
  }
    
  render() {
    
    return (
      <div className="user-info">
          <h2>User Profile</h2>
        <div className="card text-center">
          <br />
          <div className="user-img"><img height="270" width="270" src={this.props.userAboutData.icon_img} role="presentation" alt='Profile Picture'/></div>
          <br />
          <div className="card-text">{this.props.userAboutData.name}</div>
          <br />
        </div>
      </div>
    );
  }
}

UserAbout.propTypes =
    {
  userAboutData: React.PropTypes.object,
}

export default UserAbout;
