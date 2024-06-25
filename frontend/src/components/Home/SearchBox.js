import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 3) {
        console.log('Searching for:', searchTerm);
        onSearch(searchTerm).then((results) => {
          if (results.length === 0) {
            setNoResults(true);
          } else {
            setNoResults(false);
          }
        });
      } else {
        setNoResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <div>
      <input
        id="search-box"
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control"
      />
      {noResults && (
        <div id="empty" className="scolding-message">
          Try searching for something else!
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  onSearch: (searchTerm) =>
    agent.Items.all(0, searchTerm).then((payload) => {
      dispatch({ type: 'SEARCH_ITEMS', payload });
      return payload.items; // Ensure to return the items for the then() chain
    })
});

export default connect(null, mapDispatchToProps)(SearchBox);