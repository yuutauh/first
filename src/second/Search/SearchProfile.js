import React, { useState } from "react";
import { db } from "../../firebase";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import { Link } from 'react-router-dom';
import "./Search.css";

const SearchProfile = ({ index, setIndex }) => {
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

      db.collection("users")
        .where("displayName", ">=", searchTerm)
        .where("displayName", "<", endCode)
        .limit(10)
        .get()
        .then((docs) => {
          if (docs.size == 0) {
            setError("該当するユーザーがいません...");
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
		  placeholder="user を検索"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button onClick={() => { SearchTag(search) }}>
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
      <div className="search-profile-c">
		<div className="search-profile">
			{result &&
			 result.map((r, i) => (
				<div key={i} className="search-profile-item">
					<div className="bubble-profile-circle">
						<img src={r.photoURL} alt="profile" />
						<CircleIcon />
					</div>
					<div className="profile-text-container">
						<p>{r.displayName}</p>
						<div className="profile-text">--{r.profile}</div> 
					</div>
				</div>
			 ))
			}
		</div>
	  </div>
    </>
  );
};

export default SearchProfile;
