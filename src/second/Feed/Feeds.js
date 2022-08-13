import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../components/Auth/Auth';
import { db } from '../../firebase';
import Feed from './Feed';
import Btn from '../Parts/Btn';
import ProflePhoto from '../Parts/ProflePhoto';
import './Feed.css';

const Feeds = () => {
	const [threads, setThreads] = useState([]);
	const [lastDoc, setLastDoc] = useState("");
	const [isEmpty, setIsEmpty] = useState(false);
	const { currentUser }  = useContext(AuthContext);
	const useLocalStorage = (localItem) => {
		const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
		const setLoc = (newItem) => {
		  localStorage.setItem(localItem, JSON.stringify(newItem));
		  setState(newItem);
		};
		return [loc, setLoc];
	};
	const [reorder, setReorder] = useLocalStorage("fruit");

	const observer = React.useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if (first.isIntersecting) {fetcher.current()}
	},{ threshold: 1 }));

	useEffect(() => {
		if(reorder === null){
		  setReorder({order: "created", by: "desc"})
		}
		db.collection("threads")
		  .orderBy(reorder.order,reorder.by)
		  .limit(5)
		  .get()
		  .then((res) => {
			const items = [];
			const lastDoc = res.docs[res.docs.length - 1];
			res.forEach((doc) => {
			  items.push(doc.data());
			});
			setThreads(items);
			setLastDoc(lastDoc);
		});
	}, [reorder]);
	
	const [elment, setElment] = useState(null);

	useEffect(() => {
		const currentElement = elment;
	
		const currentObserver = observer.current;
	
		if (currentElement) {
		  currentObserver.observe(currentElement);
		}
	
		return () => {
		  if (currentElement) {
			currentObserver.unobserve(currentElement);
		  }
		};
	}, [elment,reorder]);

	const Fetchmore = () => {
		if(reorder === null){
		  setReorder({order: "created", by: "desc"})
		}
		if (lastDoc !== "")
		db.collection("threads")
		  .orderBy(reorder.order,reorder.by)
		  .startAfter(lastDoc)
		  .limit(3)
		  .get()
		  .then((res) => {
			const size = res.size === 0;
			if (!size) {
			  const items = [];
			  const lastDoc = res.docs[res.docs.length - 1];
			  res.forEach((doc) => {
				items.push(doc.data());
			  });
			  setThreads((prev) => [...prev, ...items]);
			  setLastDoc(lastDoc);
			} else {
			  setIsEmpty(true); 
			}
		});
	};
	
	const fetcher = React.useRef(Fetchmore);
	
	React.useEffect(() => {
	   fetcher.current = Fetchmore;
	}, [Fetchmore]);

	return (
		<div>
			{currentUser && (
			<div className="create-post">
				<div className="post-container">
					<ProflePhoto photo={currentUser.photoURL} />
					<div className="post-body">
					    <div className="post-name">{currentUser.displayName}</div>
						<input type="text" placeholder="なにかつたえましょう" id="create-post" />
					</div>
				</div>
				<div className="btn-end">
					<Btn word={'送信'}/>
				</div>
			</div>
			)}
		    <span><i className="uil uil-sort-amount-down"></i></span>
			{threads &&
			 threads.map((thread , i) => (
				 <Feed 
				 key={i}
				 body={thread.body}
				 created={thread.created}
				 id={thread.id}
				 tagname={thread.tagname}
				 userimage={thread.userimage}
				 username={thread.username} 
				 />
			 ))}
			 {isEmpty && <p>これ以上ありません</p>}
			<button
			ref={setElment}
			onClick={Fetchmore}
			className="loadButton"
			>
			</button>
		</div>
	)
}

export default Feeds
