import React, { useState, useCallback, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../Auth/Auth';
import { db, fb } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import InputText from './InputText';
import InputTag from './InputTag';

const Container = styled.div`
width: 90%;
margin: 0 auto;
`;

const H3 = styled.h3`
width: fit-content;
padding: 5px;
border-bottom: #aaa solid 2px;
`;

const P = styled.p`
width: fit-content;
padding: 2px;
border-bottom: #aaa solid 2px;
`;

const Button = styled.button`
padding: 10px 20px;
background-color: #e0e0e0;
margin: 20px;
font-family: inherit;
border-radius: 20px;
border: none;
letter-spacing: 0.3rem;
cursor: pointer;
`;


const Input = () => {
	const { currentUser }  = useContext(AuthContext);
	const [text, setText] = useState("");
	const [textError, setTextError] = React.useState("");
	const [tags, setTags] = useState([]);
	const [onTags, setOnTags] = useState([]);
	const [tagError, setTagError] = useState("");
	const inputText = useCallback((e) => { setText(e.target.value) }, [setText])
	const inputTags = useCallback((tags) => { setTags(tags) }, [setTags])


	const addThread = () => {
		const id = uuidv4();
		if (currentUser === null || currentUser.isAnonymous) {
		  return false;
		} else {
		  const thread = {
			body: text,
			id: id,
			created: fb.firestore.FieldValue.serverTimestamp(),
			uid: currentUser.uid,
			username: currentUser.displayName,
			userimage: currentUser.photoURL,
			favorites: [],
		  };
	
		  db.collection("threads").doc(id).set(thread);
	
	
		  onTags.forEach((doc) => {
			db.collection("tags")
			  .doc(doc)
			  .update({
				threadId: fb.firestore.FieldValue.arrayUnion(id),
			  });
		  });
	
		  tags.forEach((doc) => {
			const tagId = uuidv4();
			db.collection("tags")
			  .doc(tagId)
			  .set({
				name: doc,
				id: tagId,
				threadId: fb.firestore.FieldValue.arrayUnion(id),
				created: fb.firestore.FieldValue.serverTimestamp(),
			  });
		  });
	    }
	}
	
	return (
		<Container>
			<H3>「言葉」をとうこうする</H3>
			<InputText
			text={text}
			textError={textError}
			inputText={inputText}
			setTextError={setTextError}
			/>
			<P>タグをつける</P>
			<p>◎つけられるタグは新しく作るタグとあわせて「５つ」までです</p>
			<p>◎検索機能がよろしくないので困ったら「さらに検索」ボタンをおしてみてください＜(_ _)＞</p>
			<InputTag 
			tags={tags}
			onTags={onTags}
			setOnTags={setOnTags}
			inputTags={inputTags}
			tagError={tagError}
			setTagError={setTagError}
			/>
			<Button>「言葉」をとうこうする</Button>
		</Container>
	)
}

export default Input
