import React, { useState, useEffect} from 'react';
import { db } from '../../firebase';
import UserBodyList from './UserBodyList';

const FavoriteBodyList = React.memo(({name, id}) => {
	const [threads, setThreads] = useState([]);
	const [lastDoc, setLastDoc] = useState('');
	const [isEmpty, setIsEmpty] = useState(false);
	const [reorder, setReorder] = useState({});
	const useLocalStorage = (localItem) => {
		const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
		const setLoc = (newItem) => {
		  localStorage.setItem(localItem, JSON.stringify(newItem));
		  setState(newItem);
		};
		return [loc, setLoc];
	  };
	
	const [favoriteIndex, setFavoriteIndex] = useLocalStorage("favoriteprofile");
	const [element, setElement] = useState(null);
	const observer = React.useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if(first.isIntersecting) {
				fetcher.current()
			}
		})
	)

	useEffect(() => {
		const currentElement = element;
		const currentObserver = observer.current;
		
		if(currentElement) {
		  currentObserver.observe(currentElement)
		}
		
		return () => {
		  if(currentElement) {
			currentObserver.unobserve(currentElement)
		  }
		} 
	}, [element, favoriteIndex])

	useEffect(() => { 
		if(favoriteIndex === null){
			setFavoriteIndex({order: "created", by: "desc"})
		}  
		db.collection('threads')
		    .where('favorites', 'array-contains', id)
			.orderBy(favoriteIndex.order, favoriteIndex.by)
			.limit(3)
			.get()
			.then((res) => {
			  const items = []
			  const lastDoc = res.docs[res.docs.length - 1]
			  res.forEach((doc) => {
				items.push(doc.data())
			  })
			  setThreads(items)
			  setLastDoc(lastDoc)
		})
	}, [id, favoriteIndex])

	const load = () => {
		if(favoriteIndex === null){
			setFavoriteIndex({order: "created", by: "desc"})
		  }
		if(lastDoc !== "") {
		  db.collection('threads')
		    .where('favorites', 'array-contains', id)
			.orderBy(favoriteIndex.order, favoriteIndex.by)
			.startAfter(lastDoc)
			.limit(3)
			.get()
			.then((res) => {
				const size = res.size === 0;
				if(!size){
					const items = [];
					const lastDoc = res.docs[res.docs.length - 1]
					res.forEach((doc) => {
						items.push(doc.data())
					})
					setThreads(prev => [...prev, ...items])
					setLastDoc(lastDoc)
				} else {
					setIsEmpty(true)
				}
			})
		}
	}

	const fetcher = React.useRef(load);

	React.useEffect(() => {
			fetcher.current = load
	}, [load])

	console.log(favoriteIndex)

	return (
		<>
		   <button onClick={() => { setFavoriteIndex({"order": "created", "by": "desc"})} }>desc</button>
    <button onClick={() => { setFavoriteIndex({"order": "created", "by": "asc"})} }>asc</button>
   
		   <UserBodyList 
		   name={name}
		   threads={threads} 
		   isEmpty={isEmpty} 
		   setElement={setElement}
		   setReorder={setReorder}
		   setFavoriteIndex={setFavoriteIndex} 
		   />
		</>
	)
})

export default FavoriteBodyList
