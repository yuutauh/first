import React, { useState } from "react";
import { db } from "../../firebase";
import { Link } from 'react-router-dom';
import "./Search.css";

const SearchTags = ({ index, setIndex }) => {
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

      db.collection("tags")
        .where("name", ">=", searchTerm)
        .where("name", "<", endCode)
        .limit(10)
        .get()
        .then((docs) => {
          if (docs.size == 0) {
            setError("該当するタグがありません...");
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

  return (
    <>
      <div className="search-input-c">
        <input
		  placeholder="tags を検索"
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
      <div className="search-tags-c">
	  <div className='tagindex-c'>
			{result &&
			 result.map((tag, i) => (
				 <Link
				 className='tagindex-row'
				 key={i} 
				 to={{
					 pathname: `/tags/${tag.name}`,
					 state: { fromDashboard: true }
					}}>
				<div className='tag'>{tag.name}</div>
				<div className='tagindex-row-right'>
					<span><i className='uil uil-comment'></i></span>
					<div className='tagindex-title'>投稿</div>
					<div className='tagindex-numbar'>{tag.threadId.length}</div>
					<span><i className='uil uil-user'></i></span>
					<div className='tagindex-title'>フォロワー</div>
					<div className='tagindex-numbar'>{tag.userId.length}</div>					
				</div>
			  </Link>
			 ))
	    }
		</div>
		<p className="text-smaller">{error}</p>
	  </div>
    </>
  );
};

export default SearchTags;
