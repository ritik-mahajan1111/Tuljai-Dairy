import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search Customer..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBar;