import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


const largeColumn = {
  width: '40%'
}

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
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    /**
     * this == the component App class
     * if you use 'this' in a function, it doesn't know what this is
     * you have to bind the function to the class component
     */
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  /**
   * isNotID defines an arrow (anonymous) function that returns true if param's ID is not the ID of object calling function
   * updated list is defined by filtering the current state's list property by applying the isNotID function
   */
  onDismiss(id) {
    const isNotID = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotID);
    this.setState({
      result: {
        ...this.state.result,
        hits: updatedHits
      }
    });
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
    const { searchTerm, result } = this.state;

    if (!result) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <h2>mike learns react</h2>
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search&nbsp;
          </Search>
        </div>
        <Table
          list={result.hits}
          pattern={searchTerm}
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

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
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

export default App;
