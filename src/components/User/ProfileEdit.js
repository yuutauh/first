import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { validate } from 'uuid';
import { db } from '../../firebase';

const Container = styled.div`
width: 90%;
margin: 0 auto;
`;

const H3 = styled.h3`
width: fit-content;
padding: 5px;
border-bottom: #aaa solid 2px;
`;

const Textarea = styled.textarea`
font-family: inherit;
border: 2px solid #e0e0e0;
outline: none;
resize: none;
width: 100%;
border-radius: 10px;
height: 30vh;
}
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

const ProfileEdit = ({ history }) => {
	const id = window.location.pathname.split("/")[2];
	const [body, setBody] = useState("");
	const [error, setError] = useState("");

	const addProfile = () => {
		db.collection('users').doc(id).update({
			profile: body
		}).then(() => { history.goBack() })
	}

	const validate = () => {
		let bodyerror = "";
		if(body.length > 200) {
			bodyerror = "２００字より多く入力できません"
		}
		if(bodyerror) {
			setError(bodyerror)
			return false
		}
		setError("")
		return true
	}

	const inputBody = useCallback((e) => { setBody(e.target.value) }, [setBody]) 

	console.log(body)

	return (
		<Container>
			<H3>プロフィール</H3>
			<Textarea 
			value={body} 
			onChange={inputBody}
			placeholder='自己紹介をしましょう（空欄可）'
			/>
			<div>{error}</div>
			<Button onClick={() => {
				const IsValidate = validate()
				if(IsValidate) {
					addProfile()
				}
			}}>
				送信する
			</Button>
		</Container>
	)
}

export default ProfileEdit
