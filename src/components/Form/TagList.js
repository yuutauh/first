import React from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import Tag from './Tag';

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 100%;
`;

const TagList = ({onTags, setOnTags}) => {
	const [tagList, setTagList] = React.useState([]);
	const [lastDoc, setLastDoc] = React.useState("");
	const [isEmpty, setIsEmpty] = React.useState(false);
	const [element, setElement] = React.useState(null);
	const [search, setSearch] =  React.useState("");
	const [toggle, setToggle] = React.useState(true);
	const inputRef = React.useRef(null);
	const observer = React.useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if(first.isIntersecting) {
				loader.current()
			}
		},{ threshold: 1 })
	)

    React.useEffect(() => {
	   db.collection('tags')
	     .orderBy('created', 'desc')
	     .limit(7)
	     .get()
	     .then((res) => {
		    const items = [];
			const lastDoc = res.docs[res.docs.length - 1]
		    res.forEach((doc) => {
		      items.push({
				  data: doc.data(),
				  toggle: toggle
			  })
		    })
		    setTagList(items)
			setLastDoc(lastDoc)
	    })
	}, []);

	React.useEffect(() => {
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
	}, [element])

	const load = () => {
		if(lastDoc !== "") {

			db.collection('tags')
			.orderBy('created', 'desc')
			.startAfter(lastDoc)
			.limit(4)
			.get()
			.then((res) => {
				const size = res.size === 0;
			  if(!size) {
				  const items = []
				  const lastDoc = res.docs[res.docs.length - 1]
				  res.forEach((doc) => {
					items.push({
						data: doc.data(),
						toggle: toggle
					})
				  })
				  setTagList(prev => [...prev, ...items])
				  setLastDoc(lastDoc)
			  } else {
				  setIsEmpty(true)
			  } 
		  })
		}
	}

	const inputSearch = React.useCallback((e) => {
		setSearch(inputRef.current.value)
	}, [search])

	const loader = React.useRef(load);

	React.useEffect(() => {
		loader.current = load
	}, [load])


	return (
		<div>
			<p>search: {search}</p>
			<input ref={inputRef} type="text" />
            <button onClick={inputSearch}>search</button>
			{tagList && 
			tagList.filter(({data}) => data.name.toLowerCase().search(search.toLowerCase()) !== -1)
			       .map((tag, i) => (
					    <Tag tag={tag} key={i} onTags={onTags} setOnTags={setOnTags} />
			))}
			{isEmpty && <p>no more</p>}
			<button ref={setElement} onClick={load}>more</button>
		</div>
	)
}

export default TagList
