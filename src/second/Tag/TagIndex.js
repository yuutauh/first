import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase';
import { AuthContext } from "../../components/Auth/Auth";
import { ReactComponent as HashIcon } from "../Icons/HashIcon.svg";
import './Tag.css';
import { Link } from 'react-router-dom';
import LeftArrow from '../Parts/LeftArrow';
import MetaDecorator from '../Meta/MetaDecorator';

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

	React.useEffect(() => {
		if (reorder == null) {
			setReorder({ order: "created", by: "desc" });
			db.collection('tags')
			.orderBy("created", "desc")
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
		  } else {
			  db.collection('tags')
				.orderBy(reorder.order, reorder.by)
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
	}, [reorder]);
	
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
			.orderBy(reorder.order, reorder.by)
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
		<>
		<LeftArrow />
		<MetaDecorator 
          title={"tag一覧 - onlytext"} 
          description={"onlytext tagの一覧"} 
        />
		<div className='tagindex-c'>
			<div className="tagindex-h">
			   <h4>tags</h4>
			   <div className="taglist-order-nav">
                  <div
				    className={reorder?.order == "created" ? "active-taglist-order-nav" : ""}
                    onClick={() => {
						setReorder({ order: "created", by: "desc" });
                    }}
					>
                    新しい順
                  </div>
                  <div
				  className={reorder?.order == "threadCount" ? "active-taglist-order-nav" : ""}
				  onClick={() => {
					  setReorder({ order: "threadCount", by: "desc" });
                    }}
					>
                    投稿が多い順
                  </div>
                  <div
				  className={reorder?.order == "userCount" ? "active-taglist-order-nav" : ""}
				  onClick={() => {
					  setReorder({ order: "userCount", by: "desc" });
                    }}
					>
                    フォロワー順
                  </div>
                </div>
			</div>
			{tagIndex &&
			 tagIndex.map((tag, i) => (
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
			{isEmpty && <p className="text-smaller">これ以上ありません</p>}
			<button ref={setElment}></button>
		</div>
		</>
	)
}

export default TagIndex
