import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Auth from '../modules/Auth';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

class HomePage extends React.Component {
  constructor(props) {
    super(props);}
  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <Card className="container1">
        <CardTitle title="Reddit Analyzer" />
          {Auth.isUserAuthenticated() ? (
            <CardText style={{ fontSize: '20px', color: 'green' }}>Welcome! You are logged in.  
            {this.state}
              <Link to="/dashboard"><span className="lgn">Goto Dashboard</span></Link>
            </CardText>
          ) : (
            <CardText style={{ fontSize: '20px', color: 'red' }}>You are logged out.
            <Link to="/login"><span className="lgn">Click Here to Login</span></Link>
            </CardText>
          )}
      </Card>
    )
  }
};

export default HomePage;

