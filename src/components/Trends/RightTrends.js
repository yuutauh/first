import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as FireIcon } from "../../Icons/FireIcon.svg";
import Right from '../../second/Parts/Right';

const RightTrends = () => {
	const [counts, setCounts] = useState([]);

	useEffect(() => {
		db
		.collection('trends')
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
			})}
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
			setCounts(items.slice(0, 6));
		})
	},[])

	return (
		<>
		  <Right
		   title={"トレンド"}
		   svg={<FireIcon />}
		   items={counts}
		  />
		</>
	)
}

export default RightTrends
