import React, { Component } from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
const fontSizeMapper = word => Math.log2(word.value) * Math.log2(word.value)
const rotate = word => word.value % Math.floor(Math.random() * 360);
import randomColor from 'randomcolor';

class Words extends Component {
 
    constructor(props) {
        super(props);
      }
 
render(){
  return (
    <div className="user-info">
    <h2>Wordcloud</h2>
    <div className="card text-center">
  <WordCloud
    style={{
      fontFamily: 'sans-serif',
      fontSize: 30,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: () => randomColor(),
      padding: 5,
      width: '100%',
      height: '100%'
    }}
    data={this.props.data}
    fontSizeMapper={fontSizeMapper}
   // rotate={rotate}
  />
  </div>
  </div>);
}
}

export default Words;