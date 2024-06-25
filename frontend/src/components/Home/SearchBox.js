import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 3) {
        console.log('Searching for:', searchTerm);
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  return (
    <input
      id="search-box"
      type="text"
      placeholder="Search items..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="form-control"
    />
  );
};

const mapDispatchToProps = dispatch => ({
  onSearch: (searchTerm) =>
    dispatch({ type: 'SEARCH_ITEMS', payload: agent.Items.all(0, searchTerm) })
});

export default connect(null, mapDispatchToProps)(SearchBox);