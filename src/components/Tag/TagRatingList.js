import React, { useState, useEffect} from 'react';
import { db } from '../../firebase';
import styled from "styled-components";
import RatingList from '../../Parts/RatingList';

const H3 = styled.h3`
  width: fit-content;
  padding: 5px;
  border-bottom: #aaa solid 2px;
`;

const Container = styled.div`
  width: 95%;
  padding: 20px 5%;
  margin: 0 auto;
  background-color: white;
`;

const TagRatingList = () => {
	const [tags,setTags] = useState([]);

	useEffect(() => {
		db.collection('tags').limit(5)
		  .get().then((docs) => {
			  const items = [];
			  docs.forEach((doc) => { items.push(doc.data()) })
			  setTags(items)
		  })
	}, [])

	return (
		<Container>
		  <H3>おすすめタグ</H3>
		  {tags &&
		   tags.map((tag, i) => (
			   <RatingList key={i} tag={tag} />
		   )) 
		  }
		</Container>
	)
}

export default TagRatingList
