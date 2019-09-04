import React, { Component } from 'react';
import './styles.css';


class SearchBar extends Component {
  constructor(){
    super();
    this.state = {
      newSearch:{}
    }
  }
     handleKeyPress(e){
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit(e){
    if(this.refs.searchQuery.value === ''){
      alert('Cannot search for empty search query!');
    } else {
      this.setState({searchQuery:{searchQuery: this.refs.searchQuery.value,}}, function(){
        this.props.searchUser(this.state.searchQuery.searchQuery);
      });
    }
    e.preventDefault();
  }  

  render() {
    return (
      <div className="container-fluid">
        <div>
        <h1>Search Reddit User</h1>
        </div>
          <div>
            <div className='pre-input'>
              <span>/u/</span>
            </div>
            <input size="70" placeholder="Username" aria-label="Username" type="text" ref="searchQuery" className="userInput"
                   onKeyPress={this.handleKeyPress.bind(this)  }  />
            <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>
              Search
            </button>
          </div>
          <br />
      </div>
    );
  }
}

SearchBar.propTypes = {
  searchUser: React.PropTypes.func
}

export default SearchBar;
