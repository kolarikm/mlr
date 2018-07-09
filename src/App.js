import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  }, {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }, {
    title: 'Vue',
    url: 'https://github.com/vuejs/vue',
    author: 'Evan You(尤雨溪)',
    num_comments: 5,
    points: 4,
    objectID: 2,
  }, {
    title: 'Angular',
    url: 'https://angular.io',
    author: 'Google',
    num_comments: 6,
    points: 2,
    objectID: 3
  }
];

/**
 * Higher order function - exists outside the component
 */
function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: ''
    };

    /**
     * this == the component App class
     * if you use 'this' in a function, it doesn't know what this is
     * you have to bind the function to the class component
     */
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  /**
   * isNotID defines an arrow (anonymous) function that returns true if param's ID is not the ID of object calling function
   * updated list is defined by filtering the current state's list property by applying the isNotID function
   */
  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotID);
    this.setState({ list: updatedList });
  }

  /**
   * Any function used as a callback gets a copy of the synthetic React event
   */
  onSearchChange(event) {
    this.setState( {searchTerm: event.target.value} );
  }

  /**
   * Arrow functions are autobound to the component
   * Therefore they don't need to be bound in the constructor of the component
   */
  logMyName = () => {
    console.log("Michael autobound a function");
  }

  render() {
    //const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <h2>mike learns react</h2>
          <Search 
            value={this.state.searchTerm}
            onChange={this.onSearchChange}
          >
            Search&nbsp;
          </Search>
        </div>
        <Table
          list={list}
          pattern={this.state.searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    )
  }
}

// Functional stateless component
// Doesn't alter state or use lifecycle therefore doesn't need to extend component
const Search = ({ searchTerm, onChange, children }) => {
  return (
    <form>
      {children} <input
        type="text"
        value={searchTerm}
        onChange={onChange}
      />
      <br /><br />
    </form>
  );
}

class Button extends Component {
  render () {
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    )
  }
}

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{width:"40%"}}>
            <a href={item.url}>{item.title}</a>
          </span>&nbsp;
          <span style={{width:"30%"}}>{item.author}</span>&nbsp;
          <span style={{width:"10%"}}>{item.num_comments}</span>&nbsp;
          <span style={{width:"10%"}}>{item.points}</span>&nbsp;
          <span style={{width:"10%"}}>
            <Button 
              onClick={() => onDismiss(item.objectID)}
              className="button-inline">
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
  )
}

export default App;