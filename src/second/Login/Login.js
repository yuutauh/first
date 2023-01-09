import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as GoogleIcon } from "../../Icons/GoogleIcon.svg";
import { ReactComponent as TwitterIcon } from "../../Icons/TwitterIcon.svg";
import { ReactComponent as MainIcon } from "../Icons/MainIcon.svg";
import { auth, fb, db } from "../../firebase";
import LeftArrow from "../Parts/LeftArrow";
import MetaDecorator from "../Meta/MetaDecorator";
import "./Login.css";


const Login = () => {
  const history = useHistory();
  const [Currentuser, setCurrentUser] = useState();
  const googleProvider = new fb.auth.GoogleAuthProvider();
  const twitterProvider = new fb.auth.TwitterAuthProvider();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  const pageTransition = (msg) => {
    history.push(`/login/${msg}`);
  };

  const authWithGoogle = () => {
    let p = "";
    fb.auth()
      .signInWithPopup(googleProvider)
      .then((user) => {
        if (!user) {
          return;
        }
        const o = {
          uid: user.user.uid,
          displayName: user.user.displayName,
          photoURL: user.user.photoURL,
        };
        p = user.user.displayName

        db.collection("users").doc(user.user.uid).set(o, { merge: true });
      })
      .then(() => {
        pageTransition(p);
      });
  };

  const authWithTwitter = () => {
    let p = "";
    fb.auth()
      .signInWithPopup(twitterProvider)
      .then((user) => {
        if (!user) {
          return;
        }
        const o = {
          uid: user.user.uid,
          displayName: user.user.displayName,
          photoURL: user.user.photoURL,
        };

        p = user.user.displayName
        db.collection("users").doc(user.user.uid).set(o, { merge: true });
      })
      .then(() => {
        pageTransition(p);
      });
  };

  
  const authWithAnonymous = () => {
    fb.auth()
      .signInAnonymously()
      .then((user) => {
        if(!user) {
          return
        } else {
          history.push(`/login/welcome`);
        }
      })

  }
	

  const logout = () => {
    let p = "ログアウトしました";
    auth.signOut().then(() => {
      pageTransition(p);
    });
  };

  return (
    <>
      <LeftArrow />
      <MetaDecorator
      title={"Login - onlytext"}
      description={"only text をはじめましょう。googleもしくはtwitterアカウントでログインできます。"}
      />
      <div className="main-container">
        <div className="login-container">
          <h1>Log in</h1>
          <button onClick={authWithGoogle}>
            <GoogleIcon />
            Sign in with Google
          </button>
          <button onClick={authWithTwitter}>
            <TwitterIcon />
            Sign in with Twitter
          </button>
          <div className="logout" onClick={logout}>
            <span>
              <i className="uil uil-sign-out-alt"></i>
            </span>
            log-out
          </div>
          {/* <button onClick={authWithAnonymous}>anonymous</button> */}
          <p className="text-muted">
            <Link
            to={{
              pathname: `/tos`,
              state: { fromDashboard: true },
            }}
            >
              利用規約
            </Link>
            ・
            <Link
            to={{
              pathname: `/privacy`,
              state: { fromDashboard: true },
            }}
            >
              プライバシーポリシー
            </Link>
          </p>
          <p>&copy; 2022 y</p>
        </div>
      </div>
    </>
  );
};

export default Login;
