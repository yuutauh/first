import React, { useState, useEffect} from 'react';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import Hash from './Hash';

const H3 = styled.h3`
  width: fit-content;
  padding: 5px;
  border-bottom: #aaa solid 2px ;
`;

const Wrapper = styled.div` 
  display: flex;
  flex-wrap: wrap;
`


const More = styled.div` 
  margin-left: auto;
  color: blue;
  white-space: nowrap;
  cursor: pointer;
`

const Tagrating = () => {
	const [tags, setTags] = useState([])

	useEffect(() => {
		db.collection('tags').orderBy('threadId', 'desc').limit(10)
		  .get().then((docs) => {
			  const items = []
			  docs.forEach((doc) => { items.push(doc.data()) })
			  setTags(items)
		  })
	}, [])

	return (
		<>
			<H3>おすすめタグ</H3>
			<Wrapper>
			{tags && tags.map((tag, i) => (
				<Hash key={i} tag={tag} />
			))}
			<More>
			    <Link
				to={{
					pathname: `/tagsrecommend`,
					state: { fromDashboard: true },
				}}
				style={{
					textDecoration: "none"
				}}>
				  もっとタグをみる
				</Link>
			</More>
			</Wrapper>
		</>
	)
}

export default Tagrating
