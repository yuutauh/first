import React, { useState, useCallback, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from '../../components/Auth/Auth';
import { db, fb } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import InputText from './InputText';
import InputTag from './InputTag';
import './Input.css'; 
import LeftArrow from '../Parts/LeftArrow';


export const Input = ({ history }) => {
	const { currentUser }  = useContext(AuthContext);
	const [text, setText] = useState("");
	const [textError, setTextError] = React.useState("");
	const [tags, setTags] = useState([]);
	const [onTags, setOnTags] = useState([]);
	const [onTagDatas, setOnTagDatas] = useState([]);
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
						userId: [],
						threadCount: 1,
						userCount: 0,
					})
				})
			).then(
				onTagDatas.forEach((doc) => {
					db.collection("tags")
					.doc(doc.id)
					.update({
						threadId: fb.firestore.FieldValue.arrayUnion(id),
						threadCount: fb.firestore.FieldValue.increment(1)
					})
				})
			)
			.then(() => { toast("投稿しました") })
			.then(() => { history.goBack() })
	    }
	}

	return (
		<div className="input-container">
			<LeftArrow />
			<h4>投稿</h4>
			<InputTag 
			tags={tags}
			setTags={setTags}
			onTags={onTags}
			setOnTags={setOnTags}
			inputTags={inputTags}
			tagError={tagError}
			setTagError={setTagError}
			onTagDatas={onTagDatas}
			setOnTagDatas={setOnTagDatas}
			/>
			<InputText
			currentUser={currentUser}
			text={text}
			tags={tags}
			onTags={onTags}
			textError={textError}
			inputText={inputText}
			setTextError={setTextError}
			/>
			{textError && <p className="error">{textError}</p> }
			<button
			className='input-button' 
			onClick={() => {
				const Validate = validate()
				if(Validate) {
					addThread()
				} else {
					return false
				}
			}}>
				投稿
			</button>
		</div>
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