import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { AuthContext } from "../../components/Auth/Auth";
import { ReactComponent as HashIcon } from "../Icons/HashIcon.svg";
import './Tag.css';
import { Link } from 'react-router-dom';

const TagIndex = () => {
	const { currentUser } = useContext(AuthContext);
	const [tagIndex ,setTagIndex] = useState([]);
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
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if(first.isIntersecting) {
				loader.current()
			}
		},{ threshold: 1 })
	)

	const [elment, setElment] = useState(null);

	const firstLoad = () => {
		db.collection('tags')
		  .orderBy('created', 'desc')
		  .limit(10)
		  .get()
		  .then((res) => {
			 const items = [];
			 const lastDoc = res.docs[res.docs.length - 1]
			 res.forEach((doc) => {
			   items.push(doc.data())
			 })
			 setTagIndex(items)
			 setLastDoc(lastDoc)
		})
	}

	React.useEffect(() => {
		db.collection('tags')
		  .orderBy('created', 'desc')
		  .limit(10)
		  .get()
		  .then((res) => {
			 const items = [];
			 const lastDoc = res.docs[res.docs.length - 1]
			 res.forEach((doc) => {
			   items.push(doc.data())
			 })
			 setTagIndex(items)
			 setLastDoc(lastDoc)
		})
	}, []);
	
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
	
	const load = () => {
		if(lastDoc !== "") {
			db.collection('tags')
			.orderBy('created', 'desc')
			.startAfter(lastDoc)
			.limit(20)
			.get()
			.then((res) => {
				const size = res.size === 0;
			  if(!size) {
				  const items = []
				  const lastDoc = res.docs[res.docs.length - 1]
				  res.forEach((doc) => {
					items.push(doc.data())
				  })
				  setTagIndex(prev => [...prev, ...items])
				  setLastDoc(lastDoc)
			  } else {
				  setIsEmpty(true)
			  } 
		  })
		}
	}

	const loader = React.useRef(load);

	React.useEffect(() => {
		loader.current = load
	}, [load])
	
	return (
		<div className="tagindex-container">
			<div className="tagindex-title">
				<HashIcon />
				<h3>話題</h3>
			</div>
			{tagIndex &&
			 tagIndex.map((tag, i) => (
			  <Link
			  key={i} 
			  to={{
					pathname: `/tags/${tag.name}`,
					state: { fromDashboard: true }
			  }}>
				<div className="text-smaller name">{tag.name}</div>
				<div className="right-side">
					<div>
						<div className="text-muted text-smaller">投稿</div>
						<div>{tag.threadId.length}
						<span className="text-muted text-smaller">件</span>
						</div>
					</div>
					<div>
						<div className="text-muted text-smaller">フォロワー</div>
						<div>{tag.userId.length}
						<span className="text-muted text-smaller">人</span>
						</div>
					</div>
					<div className="text-smaller">フォローする</div>
				</div>
			  </Link>
			 ))
			}
			{isEmpty && <p className="text-smaller">これ以上ありません</p>}
			<button ref={setElment}></button>
		</div>
	)
}

export default TagIndex
