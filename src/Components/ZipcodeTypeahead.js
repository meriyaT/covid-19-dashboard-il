import "./TypeaheadDropdown.css";
import React, { useState, useEffect } from "react";

const ZipcodeTypeaheadDropdown = ({ zipcodeCityCountyList, onSelected }) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownValues, setDropdownValues] = useState([]);

  useEffect(() => {
    let dropdownValues = zipcodeCityCountyList.map((value) => {
      let { zip, city, county } = value;
      return `${zip} ${city} ${county}`;
    });
    setDropdownValues(dropdownValues);
  }, []);

  const suggestionSelected = (zipcode) => {
    setText(zipcode);
    setSuggestions([]);
    let zipcodeCityCountyArray = zipcode.split(" ");
    let zipcodeCityCountyObject = {
      zipcode: zipcodeCityCountyArray[0],
      city: zipcodeCityCountyArray[1],
      county: zipcodeCityCountyArray[2],
    };
    onSelected(zipcodeCityCountyObject);
  };

  const handleOnChange = (e) => {
    let suggestions = [];
    const value = e.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`${value}`, `i`);
      suggestions = dropdownValues.sort().filter((v) => regex.test(v));
    }
    setSuggestions(suggestions);
    setText(value);
  };

  return (
    <div className="TypeAheadDropDown">
      <input
        onChange={handleOnChange}
        placeholder="Seach for zip code to see the covid trend"
        value={text}
        type="text"
      />
      <ul>
        {suggestions.map((zipcode) => (
          <li key={zipcode} onClick={(e) => suggestionSelected(zipcode)}>
            {zipcode}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZipcodeTypeaheadDropdown;
