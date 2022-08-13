import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const TrendBody = () => {
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


  return (
    <>
	<p>トレンド</p>
	<h2>{decoded}</h2>
	<h5>{tags.length}件の投稿</h5>
      {tags.map((tag) => (
        <>
          <List id={tag.threadId} />
        </>
      ))}
    </>
  );
};

const List = ({ id }) => {
  const [thread, setThread] = useState({});
  useEffect(() => {
    db.collection("threads")
      .doc(id)
      .get()
      .then((res) => {
        setThread(res.exists ? res.data() : { body: "no data" });
      });
  }, []);

  return (
    <div>
	  {thread.id ? (
		<Link 
		to={{ pathname: `/body/${thread.id}`,
				state: {
					fromDashboard: true
				}}}
		style={{ 
			textDecoration: "none", color: "black" 
		}}>
			{thread.body}
		</Link>
	  ) : (
		  <>
		   {thread.body}
		  </>
	  )}
    </div>
  );
};
export default TrendBody;
