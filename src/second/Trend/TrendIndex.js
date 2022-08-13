import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { AuthContext } from "../../components/Auth/Auth";
import { ReactComponent as FireIcon } from "../Icons/FireIcon.svg";
import './Trend.css';
import { v4 as uuidv4 } from "uuid";
import { Link } from 'react-router-dom';

const TrendIndex = () => {
	const { currentUser } = useContext(AuthContext);
	const [trendIndex ,setTrendIndex] = useState([]);
	const uid = currentUser ? currentUser.uid : "";

	useEffect(() => {
		db.collection("trends")
		  .limit(30)
		  .get()
		  .then((docs) => {
			const count = {};
			const items = [];
			docs.forEach((doc) => {
			  const name = doc.exists ? doc.data().name : "no data";
			  const threadId = doc.exists ? doc.data().threadId : [];
			  count[name] = (count[name] || "") + "," + threadId;
			});
			for (const [key, value] of Object.entries(count)) {
			  const id = uuidv4();
			  items.push({
				name: key,
				no: value.split(","),
				id: id,
			  });
			}
			items.sort((a, b) => {
			  if (a.no.length > b.no.length) {
				return -1;
			  }
			  if (a.no.length < b.no.length) {
				return 1;
			  } else {
				return 0;
			  }
			});
			setTrendIndex(items.slice(0,15));
		  });
	  }, []);

	return (
		<div className="trend-container">
			<div className="trend-heading">
				<FireIcon />
				<h3>トレンド</h3>
			</div>
				{trendIndex.map((trend, i) => (
					<Link 
					key={i}
					to={{
						state: { fromDashboard: true },
						pathname  :`/trends/${trend.name}`
					}}>
							<div className="name">
							   <span>{i}.</span>
						       {trend.name}
							</div>
							<div className="text-smaller">
						       ({trend.no.length - 1}件の投稿)
							</div>
					    
					</Link>
				))}
		</div>
	)
}

export default TrendIndex
