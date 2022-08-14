import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as GoogleIcon } from "../../Icons/GoogleIcon.svg";
import { ReactComponent as TwitterIcon } from "../../Icons/TwitterIcon.svg";
import { ReactComponent as MainIcon } from "../Icons/MainIcon.svg";
import { auth, fb, db } from '../../firebase';
import './Login.css';

const Login = () => {
	const history = useHistory()
	const [Currentuser,setCurrentUser] = useState()
	const googleProvider = new fb.auth.GoogleAuthProvider()
	const twitterProvider = new fb.auth.TwitterAuthProvider();
  
	useEffect(() => {
	  auth.onAuthStateChanged((user) => {
		setCurrentUser(user)
	  })
	}, [])

	const pageTransition = (msg) => {
		history.push(`/login/${msg}`)
	}

	const authWithGoogle = () => {
		const p = "ログインしました"
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
		}).then(() => {
			pageTransition()
		})
	}
	
	const authWithTwitter = () => {
		const p = "ログインしました"
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
		}).then(() => {
			pageTransition(p)
		})
	}
		
	const logout = () => {
		const p = "ログアウトしました"
		auth.signOut().then(() => {
			pageTransition(p)
		})
	}

	return (
		<div className="main-container">
			<div className="login-container">
				<h1>Logggg in</h1>
					<button onClick={authWithGoogle}>
						<GoogleIcon />
						Sign in with Google
					</button>
					<button onClick={authWithTwitter}>
						<TwitterIcon />
						Sign in with Twitter
					</button>
					<div className="logout" onClick={logout}>
						<span><i className="uil uil-sign-out-alt"></i></span>
						log-out
					</div>
					<p className="text-muted">
						利用規約・プライバシーポリシー
					</p>
			</div>
			<div className="right">
                <MainIcon />
			</div>
		</div>
	)
}

export default Login
