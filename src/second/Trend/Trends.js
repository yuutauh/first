import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ReactComponent as FireIcon } from "../Icons/FireIcon.svg";
import Feed from "../Feed/Feed";

const Trends = () => {
	const [tags, setTags] = useState([]);
	let id = window.location.pathname.split("/trends/")[1];
	let decoded = decodeURI(id);
	useEffect(() => {
		db.collection("trends")
		.where("name", "==", decoded)
		.get()
		.then((docs) => {
			const items = [];
			docs.forEach((doc) =>
			items.push(doc.exists ? doc.data() : { body: "sakujo" })
			);
			setTags(items);
		});
	}, []);
	console.log(tags)

	return (
		<div className="trends-container">
			<div className="heading">
				<FireIcon />
				<p>トレンド</p>
			</div>
            <div className="trends-title">
				<h2>{decoded}</h2>
				<h5 className="text-muted">{tags.length}件の投稿</h5>
			</div>
			{tags.map(({threadId}, i) => (
				<List key={i} id={threadId} />
			))}
		</div>
	)
}

const List = ({ id }) => {
	const [thread, setThread] = useState({});
	useEffect(() => {
	  db.collection("threads")
		.doc(id)
		.get()
		.then((res) => {
		  setThread(res.exists ? res.data() : { body: "削除されています、、" });
		});
	}, []);
  
	return (
	  <div>
		{thread.id ? (
		   <Feed 
		   body={thread.body}
		   created={thread.created}
		   id={thread.id}
		   tagname={thread.tagname}
		   userimage={thread.userimage}
		   username={thread.username} 
		   />
		) : (
			<p className="text-muted text-smaller">
			 {thread.body}
			</p>
		)}
	  </div>
	);
};

export default Trends
