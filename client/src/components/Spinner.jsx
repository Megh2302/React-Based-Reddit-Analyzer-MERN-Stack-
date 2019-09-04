import React, { Component } from 'react';
import { render } from 'react-dom';
import './Spinner.css';


class Spinner extends Component {
 
    constructor(props) {
        super(props);
      }
 
render(){
  return (
    <div className='spinner'>
    <div className='double-bounce1' />
    <div className='double-bounce2' />
  </div>
  );
}
}

export default Spinner;