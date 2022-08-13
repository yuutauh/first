import React, { useState ,useEffect, useContext} from 'react';
import { db } from '../../firebase';
import { AuthContext } from "../../components/Auth/Auth";
import { useLocation } from "react-router-dom";
import Btn from '../Parts/Btn';
import './Tag.css';
import Feed from '../Feed/Feed';
import Follower from './Follower';

const Tags = () => {
	const [tag, setTag] = useState("");
	const [threads, setThreads] = useState([]);
	const [IsFavorite, setIsFavorite] = useState(false);
	const [index, setIndex] = useState(1)
	const { currentUser } = useContext(AuthContext);
	const { pathname } = useLocation();
	let id = window.location.pathname.split("/tags/")[1];
	let decoded = decodeURI(id);
	const uid = currentUser ? currentUser.uid : "";
	const [isEmpty, setIsEmpty] = useState(false);
	const [lastDoc, setLastDoc] = useState("");

	const useLocalStorage = (localItem) => {
		const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
		const setLoc = (newItem) => {
		  localStorage.setItem(localItem, JSON.stringify(newItem));
		  setState(newItem);
		} ;
		return [loc, setLoc];
	};
	
	const [reorder, setReorder] = useLocalStorage("tagList");

	const observer = React.useRef(
		new IntersectionObserver(
		  (entries) => {
			const first = entries[0];
			if (first.isIntersecting) {
			  fetcher.current()
			}
		  },
		  { threshold: 1 }
		)
	  );
	const [elment, setElment] = useState(null);

	useEffect(() => {
		if(reorder === null){
		  setReorder({order: "created", by: "desc"})
		}
	
		db
		.collection("tags")
		.where('name', '==', decoded)
		.get()
		.then((docs) => {
		  const i = [];
		  docs.forEach((doc) => i.push(doc.data()))
		  setTag(i[0])
		});
	
		  db
		  .collection("threads")
		  .where('tagname', 'array-contains', decoded)
		  .orderBy(reorder.order, reorder.by)
		  .limit(8)
		  .get()
		  .then((docs) => {
			const size = docs.size === 0
			if(!size){
				const items = [];
				const lastDoc = docs.docs[docs.docs.length - 1]
				docs.forEach((doc) => {
				 items.push(doc.exists ? doc.data() : {body: "no data"})
				})
				setThreads(items)
				setLastDoc(lastDoc)
			}
		  })
		
	}, [reorder, pathname]);
	
	const Fetchmore = () => {
		if(reorder === null){
		  setReorder({order: "created", by: "desc"})
		}
	
		if(tag || lastDoc != "") {
		  db
		  .collection('threads')
		  .where('tagname', 'array-contains', decoded)
		  .orderBy(reorder.order, reorder.by)
		  .startAfter(lastDoc)
		  .limit(8)
		  .get()
		  .then((docs) => {
			const size = docs.size === 0
			if(!size) {
			  const items = []
			  const lastDoc = docs.docs[docs.docs.length - 1];
			  docs.forEach((doc) => {
				items.push(doc.exists ? doc.data() : {body: "no data"});
			  });
			  setThreads((prev) => [...prev, ...items]);
			  setLastDoc(lastDoc);
			} else {
			  setIsEmpty(true)
			}
		  })
		} else {
			console.log("lastDoc is empty")
		}
	}
	
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
	
	const fetcher = React.useRef(Fetchmore);
	
	React.useEffect(() => {
	   fetcher.current = Fetchmore;
	}, [Fetchmore]);
	
	useEffect(() => {
		if(tag){
			setIsFavorite(tag.userId.some((items) => items === uid));
		}
	}, [tag]);

	const ChangeIndex = (i) => {
		setIndex(i)
	}


	return (
		<div className="taglist">
			{tag ? (

			<>
				<div className="heading">
					<h3>{tag.name}</h3>
					<Btn word={"フォローする"} />
					<div className="taglist-follow">
						<div onClick={() => {ChangeIndex(1)}}>
							<h2>{tag.threadId.length}</h2>
							<p>件の投稿</p>
						</div>
						<div onClick={() => {ChangeIndex(2)}}>
							<h2>{tag.userId.length}</h2>
							<p>人からのフォロー</p>
						</div>
					</div>
				</div>
				{index == 1 &&
				<div className="tags">
					{threads &&
					threads.map((thread, i) => (
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
				}
				{index == 2 &&
				    <Follower userId={tag.userId} /> 
				}
			</>
			) : (
				<p>話題が見つかりません</p>
			) 
			}
		</div>
	)
}

export default Tags
