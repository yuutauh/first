import React, { useState, useEffect } from 'react';
import { ReactComponent as GoogleIcon } from "../../Icons/GoogleIcon.svg";
import { ReactComponent as TwitterIcon } from "../../Icons/TwitterIcon.svg";
import { auth, fb, db } from '../../firebase';
import styled from 'styled-components';

const H3 = styled.h3`
width: fit-content;
padding: 5px;
border-bottom: #aaa solid 2px;
margin-left: 10%;
`;


const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  width: 220px;
  min-height: 40px;
  padding: 8px 16px;
  margin: 0 auto;
  border: none;
  border-radius: 2px;
  color: #000;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  cursor:pointer;
`;

const TButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  width: 220px;
  min-height: 40px;
  padding: 8px 16px;
  margin: 0 auto;
  border: none;
  border-radius: 2px;
  color: #fff;
  background-color: rgb(29, 155, 240);
  box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
  cursor:pointer;
`;



const Span = styled.span`
  word-wrap: break-word;
  font-size: 1rem;
  letter-spacing: 0.2rem;
`;

const GoogleSVG = styled(GoogleIcon)`
width: 20px;
height: 20px;
margin-right: 10px;
`;

const TwitterSVG = styled(TwitterIcon)`
width: 20px;
height: 20px;
margin-right: 10px;
fill: white;
`;

const Login = () => {
  const [Currentuser,setCurrentUser] = useState()
  const googleProvider = new fb.auth.GoogleAuthProvider()
  const twitterProvider = new fb.auth.TwitterAuthProvider();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])


  const authWithGoogle = () => {
    fb.auth().signInWithPopup(googleProvider).then((user) => {
      if(!user) {
        return
      }
      const o = {
        uid: user.user.uid,
        displayName: user.user.displayName,
        photoURL: user.user.photoURL,
      }

      db.collection('users').doc(user.user.uid).set(o, { merge: true})
    })
  }

  const authWithTwitter = () => {
    fb.auth().signInWithPopup(twitterProvider).then((user) => {
      if(!user) {
        return
      }
      const o = {
        uid: user.user.uid,
        displayName: user.user.displayName,
        photoURL: user.user.photoURL,
      }

      db.collection('users').doc(user.user.uid).set(o, { merge: true})
    })
  }

  const authWithAnonymous = () => {
    console.log("anonymous")
  }
	
  const logout = () => {
    auth.signOut().then(() => {
      console.log("logout")
    })
  }

	return (
		<div>
      <H3>ログインする</H3>
      <div style={{textAlign: 'center', margin: '20px'}}>
				<Button onClick={authWithGoogle}>
			    	<GoogleSVG />
			    	<Span>googleログイン</Span>
				</Button>
			</div>

      <div style={{textAlign: 'center', margin: '20px'}}>
				<TButton onClick={authWithTwitter}>
			    	<TwitterSVG />
			    	<Span>twitterログイン</Span>
				</TButton>
			</div>
			
      <div style={{textAlign: 'center'}} >
        <Button onClick={logout}>
			    	<span style={{marginRight: '10px'}} className="material-icons">logout</span>
			    	<Span>ログアウト</Span>
			  </Button>
      </div>
      <button onClick={authWithAnonymous}>anonymous</button>
		</div>
	)
}

export default Login
