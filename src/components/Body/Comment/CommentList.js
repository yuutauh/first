import React, { useState, useCallback, useContext } from 'react';  
import styled from 'styled-components';
import Comment from './Comment';
import { db, fb } from '../../../firebase';
import { v4 as uuidv4 } from "uuid";
import '../Body.css';

const InputWrapper = styled.div`
display: flex;
align-items: center;
margin-top: 20px;
margin-bottom: 20px;

  .avator {
	width: 30px;
	height: 30px;
	border-radius: 50%;
	object-fit: cover;
	padding: 1px;
	border: #e0e0e0 solid;
	margin-right: 10px ;
  } 

  input {
	width: 80%;
	font-family: inherit;
	border: none;
	border-bottom: 2px solid #e0e0e0;
	outline: none;
	resize: none;
  }
`;

const Esg = styled.p`
	font-family: inherit;
	color: red;
`;

const CommentList = React.memo(({ thread, comments, currentUser }) => {
	const [comment, setComment] = useState("");
	const [commentError, setCommentError] = useState("");

	const inputComment = useCallback((e) => {
		setComment(e.target.value)
	}, [setComment])

	const addComment = () => {
		if(currentUser !== null) {
			const id = uuidv4();
			const co = {
				comment: comment,
				id: id,
				created: fb.firestore.FieldValue.serverTimestamp(),
				uid: currentUser.uid,
				username: currentUser.displayName,
				userimage: currentUser.photoURL ,
				favorites: [],
				bads: [],
				favoriteCount: 0,
                badCount: 0,
			}
			db.collection('threads').doc(thread.id)
			  .collection('comments').doc(id).set(co)
		} else {
			console.log("asdf")
			return null
		}
	}

	const validate = () => {
		let error = "";
		if(comment == "") {
			error = "入力必須です"
		}

		if(comment.length > 200) {
			error = "200文字までです"
		}

		if(error) {
			setCommentError(error)
			return false
		}

		return true
	}

	return (
		<>
		  {currentUser &&
		  <InputWrapper>
		    <img src={currentUser.photoURL} alt="image" className="avator" />
		    <input 
			value={comment}
			onChange={inputComment}
			type="text" 
			placeholder="...コメントをかく" 
			/>
			<span 
			className="material-icons"
			onClick={() => {
					const isValidate = validate()
					if(isValidate) {
						addComment()
					} else {
						return false
					}
					}}
			>
				send
		    </span> 
		  </InputWrapper>
		  }
		    {commentError && <Esg>{commentError}</Esg> }
			<div>コメント</div>
			{comments && comments.map((c, i) => (
			   <Comment key={i} c={c} thread={thread} currentUser={currentUser} />
			))}
		</>
	)
})

export default CommentList
