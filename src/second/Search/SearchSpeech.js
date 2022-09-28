import React, { useState } from "react";
import { db } from "../../firebase";
import { Link } from 'react-router-dom';
import "./Search.css";
import Bubble from "../Feed/Bubble";

const SearchSpeech = ({ index, setIndex }) => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");

  const SearchTag = (term) => {
    if (typeof term == "string") {
      const searchTerm = term.toLowerCase();
      const strlength = searchTerm.length;
      const strFrontCode = searchTerm.slice(0, strlength - 1);
      const strEndCode = searchTerm.slice(strlength - 1, searchTerm.length);
      const endCode =
        strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

      db.collection("threads")
        .where("body", ">=", searchTerm)
        .where("body", "<", endCode)
        .limit(10)
        .get()
        .then((docs) => {
          if (docs.size == 0) {
            setError("該当するものがありません...");
            setResult([]);
          } else {
            const items = [];
            docs.forEach((doc) => {
              items.push(doc.data());
            });
            setResult(items);
            setError("");
          }
        });
    }
  };

  console.log(result)

  return (
    <>
      <div className="search-input-c">
        <input
		  placeholder="speech bubble を検索"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button onClick={() => SearchTag(search)}>
          <i className="uil uil-search"></i>
        </button>
      </div>
      <div className="search-nav">
        <div
          onClick={() => {
            setIndex(1);
          }}
        >
          speech bubble
        </div>
        <div
          onClick={() => {
            setIndex(2);
          }}
        >
          tags
        </div>
        <div
          onClick={() => {
            setIndex(3);
          }}
        >
          user
        </div>
      </div>
      <div className="search-speech-bubble-c">
		{result &&
		 result.map((r, i) => (
			<Bubble 
			key={i}
            body={r.body}
            userimage={r.userimage}
            created={r.created}
            id={r.id}
            favoriteCount={r.favoriteCount}
            badCount={r.badCount}
			/>
		 ))
		}
	    <p className="text-smaller">{error}</p>
	  </div>
    </>
  );
};

export default SearchSpeech;
