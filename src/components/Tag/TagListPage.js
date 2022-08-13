import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';


const Container = styled.div`
width: 95%;
padding: 20px 5%;
margin: 0 auto;
background-color: white;
`;

const H3 = styled.h3`
　width: fit-content;
　padding: 5px;
　border-bottom: #aaa solid 2px;
`;

const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 10px;
  
`;

const Form = styled.div`
position: relative;
height: 50px;
border: #e0e0e0 solid 2px;
border-radius: 50px;
margin-top: 100px ;

input {
  position: absolute;
  width: 70%;
  height: 100%;
  outline: none;
  border: none;
  left: 40px;
}

button {
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  background-color: #e0e0e0;
  font-family: inherit;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
`;

const Span = styled.span`
position: absolute;
top: 50%;
left: 7px;
transform: translateY(-50%)
`;

const TagIcon = styled.span`
  margin: 0 auto;
  font-size: 60px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  span {
	  font-size: 12px ;
  }

  div {
	  white-space: nowrap; 
	  font-family: inherit;
	  font-size: 12px ;
  }
`;

const TagListPage = () => {
	const [tagList, setTagList] = useState([]);
	const [element, setElement] = useState(null);
	const [lastDoc, setLastDoc] = React.useState("");
	const [isEmpty, setIsEmpty] = React.useState(false);
	const [search, setSearch] = useState('');

	const observer = React.useRef(
		new IntersectionObserver((entries) => {
			const first = entries[0];
			if(first.isIntersecting) {
				loader.current()
			}
		},{ threshold: 1 })
	)

	const firstLoad = () => {
		db.collection('tags')
		  .orderBy('created', 'desc')
		  .limit(20)
		  .get()
		  .then((res) => {
			 const items = [];
			 const lastDoc = res.docs[res.docs.length - 1]
			 res.forEach((doc) => {
			   items.push(doc.data())
			 })
			 setTagList(items)
			 setLastDoc(lastDoc)
		})
	}

	React.useEffect(() => {
		db.collection('tags')
		  .orderBy('created', 'desc')
		  .limit(20)
		  .get()
		  .then((res) => {
			 const items = [];
			 const lastDoc = res.docs[res.docs.length - 1]
			 res.forEach((doc) => {
			   items.push(doc.data())
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
	}, [element]);

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
				  setTagList(prev => [...prev, ...items])
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

	const inputSearch = (term) => {
		if(term == ""){
			firstLoad()
		}

		if(typeof term == "string"){
			const searchTerm = term.toLowerCase();
			const strlength = searchTerm.length;
			const strFrontCode = searchTerm.slice(0, strlength-1);
			const strEndCode = searchTerm.slice(strlength-1, searchTerm.length);
			const endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

			db
			.collection('tags')
			.where('name', '>=', searchTerm)
			.where('name', '<', endCode)
			.limit(10)
			.get()
			.then((docs) => {
			  if(docs.size == 0){
				
			  } else{
				const items = []
				docs.forEach((doc) => {
				  items.push(doc.data())
				})
				setTagList(items)
			  }
			})
		}
	}

	console.log(tagList)

	return (
		<>
		    <Container>
			<H3>タグの一覧</H3>
			  <div>
				<p>検索ワード: {search}</p>
			  </div>
	        <Form>
		      <input  
			  type="text" 
			  placeholder="入力したら検索ボタンをおしてください"
			  onChange={(e) => setSearch(e.target.value)} 
			  />
		      <Span className="material-icons">search</Span>
		      <button onClick={() => {inputSearch(search)}}>検索</button>
	        </Form>
			<TagsContainer>
			  <>
			  {tagList && 
			  tagList
			  .map((tag, i) => (
				<Link 
				to={{
				  pathname: `/tags/${tag.name}`,
				  state: { fromDashboard: true },
				}} 
				style={{ 
				  textDecoration: 'none',
				  color: "black",
				  fontSize: "16px",
				  margin: "10px 20px"
				}}
				key={i}
				>
				  <Wrapper>
				    <span className="material-icons">tag</span>
					<div>
						{tag.name}
					({tag.threadId.length})
					</div>
				  </Wrapper>
			    </Link>
			  ))}
			  </>
			  {isEmpty && <p>no more</p>}
			</TagsContainer>
		    </Container>
		    <button ref={setElement} onClick={load}>more</button>
		</>
	)
}

export default TagListPage
