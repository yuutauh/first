import React, { useState, useCallback, useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import styled from 'styled-components';
import { AuthContext } from '../Auth/Auth';
import { db, fb } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import Login from '../Auth/Login';
import InputText from './InputText';
import InputTag from './InputTag';

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

const P = styled.p`
width: fit-content;
padding: 2px;
border-bottom: #aaa solid 2px;
`;

const Esg = styled.p`
font-family: inherit;
color: red;
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

export const Input = ({ history }) => {
	const { currentUser }  = useContext(AuthContext);
	const [text, setText] = useState("");
	const [textError, setTextError] = React.useState("");
	const [tags, setTags] = useState([]);
	const [onTags, setOnTags] = useState([]);
	const [tagError, setTagError] = useState("");
	const inputText = useCallback((e) => { setText(e.target.value) }, [setText])
	const inputTags = useCallback((tags) => { setTags(prev => [prev, tags]) }, [setTags])

	const validate = () => {
		let textError = "";

		if(text == "") {
		textError = "入力必須です"
		}

		if(text.length > 400) {
		textError = "400字より多く入力できません"
		}

		if(tags.length + onTags.length > 5){
			textError = "付けられるタグは５つまでです"
		}

		if(textError) {
		setTextError(textError)
		return false
		}

		setTextError("")
		return true
	}
	
	const addThread = () => {
		const id = uuidv4();
		if (currentUser === null) {
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
				bads: [],
				favoriteCount: 0,
				badCount: 0,
				tagname: [...tags, ...onTags]
			};
			
			db
			.collection("threads")
			.doc(id)
			.set(thread).then(
				tags.forEach((doc) => {
					const tagId = uuidv4();
					db.collection("tags")
					.doc(tagId)
					.set({
						name: doc,
						id: tagId,
						threadId: fb.firestore.FieldValue.arrayUnion(id),
						created: fb.firestore.FieldValue.serverTimestamp(),
						userId: []
					})
				})
			).then(
				onTags.forEach((doc) => {
					db.collection("tags")
					.doc(doc)
					.update({
						threadId: fb.firestore.FieldValue.arrayUnion(id),
					})
				})
			)
			.then(() => { history.goBack() })
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
			<InputTag 
			tags={tags}
			setTags={setTags}
			onTags={onTags}
			setOnTags={setOnTags}
			inputTags={inputTags}
			tagError={tagError}
			setTagError={setTagError}
			/>
			{textError && <Esg>{textError}</Esg> }
			<Button onClick={() => {
				const Validate = validate()
				if(Validate) {
					addThread()
				} else {
					return false
				}
			}} >
				「言葉」をとうこうする
			</Button>
		</Container>
	)
}

export const InputRouter = ({...props}) => {
	const { currentUser }  = useContext(AuthContext);
	return(
		<>
		{currentUser ? (
			<Route {...props} />
		) : (
			<Redirect to="/login" />
		)}
		</>
	)
}

