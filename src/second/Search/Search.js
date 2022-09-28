import React, { useState } from "react";
import "./Search.css";
import SearchSpeech from "./SearchSpeech";
import SearchTags from "./SearchTags";
import SearchProfile from "./SearchProfile";
import LeftArrow from "../Parts/LeftArrow";

const Search = () => {
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(1);

  return (
    <div>
      <LeftArrow />
      <div className="search-w">
        <div className="search-c">
          <h2>onlytext</h2>
        </div>
        {index == 1 && <SearchSpeech index={index} setIndex={setIndex} />}
        {index == 2 && <SearchTags index={index} setIndex={setIndex} />}
        {index == 3 && <SearchProfile index={index} setIndex={setIndex} />}
      </div>
    </div>
  );
};

export default Search;
