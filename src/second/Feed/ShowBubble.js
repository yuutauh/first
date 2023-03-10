import React, { useState, useEffect, useContext, useRef } from "react";
import { db, fb } from "../../firebase";
import { AuthContext } from "../../components/Auth/Auth";
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import { ReactComponent as LoveIcon } from "../Icons/LoveIcon.svg";
import { ReactComponent as TwitterIcon } from "../Icons/TwitterIcon.svg";
import { TwitterShareButton } from 'react-share';
import AnonymousImage from'../Parts/anonymous.png';
import { v4 as uuidv4 } from "uuid";
import {Link} from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import Comment from "./Comment";
import LeftArrow from "../Parts/LeftArrow";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Feed.css";
import "./ShowBubble.css";

const ShowBubble = () => {
  const [thread, setThread] = useState("");
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([]);
  const [commentError, setCommentError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBad, setIsBad] = useState(false);
  let id = window.location.pathname.split("/body/")[1];
  const { currentUser } = useContext(AuthContext);
  const textareaRef = useRef();


  useEffect(() => {
    db.collection("threads")
      .doc(id)
      .onSnapshot((doc) => {
        setThread(doc.data());
        if (currentUser !== null) {
          const iF = doc.data().favorites.some((item) => item == currentUser.uid);
          const iB = doc.data().bads.some((item) => item == currentUser.uid);
          setIsFavorite(iF)
          setIsBad(iB)
        }
      });

    db.collection("threads")
      .doc(id)
      .collection("comments")
      .onSnapshot((docs) => {
        const items = [];
        docs.forEach((doc) => {
          items.push(doc.exists ? doc.data() : { comment: "no commments" });
        });
        setComments(items);
      });
  }, []);

  const onFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      toast("??????????????????????????????");
      return false;
    } else {
      const count = thread.favoriteCount + 1
      const o = { 
        favorites: [currentUser.uid, ...thread.favorites],
        favoriteCount: count
      };
      db.collection("threads")
        .doc(id)
        .update(o)
        .then(() => {
          setIsFavorite(true);
          toast("?????????????????????");
        })
    }
  };

  const offFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      return false;
    } else {
      const count = thread.favoriteCount - 1
      const o = thread.favorites.filter(
        (favorite) => favorite !== currentUser.uid
      );
      const os = { 
        favorites: o ,
        favoriteCount: count
      };
      setIsFavorite(!isFavorite);
      db.collection("threads")
        .doc(id)
        .update(os)
        .then(() => {
          setIsFavorite(false);
          toast("??????????????????????????????");
        })
    }
  };

  const onBads = () => {
    if(currentUser == null || currentUser.isAnonymous == true) {
      toast("??????????????????????????????");
      return false
    } else {
      const count = thread.badCount + 1
      const b = { 
        bads: [currentUser.uid, ...thread.bads ],
        badCount: count
      }
      db.collection('threads')
        .doc(id)
        .update(b)
        .then(() => {
          setIsBad(true)
          toast("????????????????????????");
        })
    }
  }

  const offBads = () => {
    if(currentUser == null || currentUser.isAnonymous == true) {
      return null
    } else {
      const count = thread.badCount - 1 
      const b = thread.bads.filter((bad) =>  bad !== currentUser.uid )
      const bs = { 
        bads: b,
        badCount: count 
      }
      db.collection('threads')
      .doc(id)
      .update(bs)
      .then(() => {
        setIsBad(false)
        toast("?????????????????????????????????");
      })
    }
  }

  const addComment = () => {
		if(currentUser !== null) {
			const id = uuidv4();
			const co = {
				comment: comment,
				id: id,
				created: fb.firestore.FieldValue.serverTimestamp(),
				uid: currentUser.isAnonymous == true ? "anonymous" : currentUser.uid,
				username: currentUser.isAnonymous == true ? '??????????????????' : currentUser.displayName,
				userimage: currentUser.isAnonymous == true ? AnonymousImage : currentUser.photoURL ,
				favorites: [],
				bads: [],
				favoriteCount: 0,
        badCount: 0,
			}
			db.collection('threads').doc(thread.id)
			  .collection('comments').doc(id).set(co)
        .then(() => {
          toast("comment?????????????????????!");
          setComment("")
          textareaRef.current.value = ""
        })
		} else {
      setCommentError('??????????????????????????????')
			return null
		}
	}

  const validate = () => {
		let error = "";
		if(comment == "") {
			error = "??????????????????"
		}

		if(comment.length > 200) {
			error = "200??????????????????"
		}

		if(error) {
			setCommentError(error)
			return false
		}

		return true
	}

  return (
    <>
      <LeftArrow />
      {thread && (
        <>
        <div className="bubble-show-c">
          {isFavorite ? (
            <div className="bubble-show-poster">
              <h4>poster</h4>
              <div className="bubble-show-poster-h">
                <img src={thread.userimage} alt="profile" />
                <h5>{thread.username}</h5>
                <Link
                to={{
                  pathname: `/profile/${thread.uid}`,
                  state: { fromDashboard: true },
                }}
                >
                    <h6>?????????????????????</h6>
                </Link>
              </div>
            </div>
          ) : (
            <></>
          )}
          <h4>speech bubble</h4>
          <div className="bubble-show-content">
            <div>
              <div className="bubble-show">
                <div className="bubble-show-msg">
                  {thread.body
                    .split("\\n")
                    .map((t, i) =>
                      t !== " " ? <div key={i}>{t}</div> : <br />
                    )}
                </div>
              </div>
              <div className="bubble-show-created text-muted">
                {format(thread.created.toDate(), "yyyy-MM-dd HH:mm", {
                  locale: ja,
                })}
              </div>
            </div>
          </div>
          <div className="bubble-show-taglist">
            {thread.tagname &&
              thread.tagname.map((tag, i) => (
                <Link
                  key={i}
                  to={{
                    pathname: `/tags/${tag}`,
                    state: { fromDashboard: true },
                  }}
                >
                  <div className="tag">{tag}</div>
                </Link>
              ))}
          </div>
          <div className="bubble-show-action-buttons">
            <div className="bubble-show-action-button">
              <LoveIcon 
              className={isFavorite ? "on" : ""}
              onClick={() => {
                if(isFavorite) {
                  offFavorites()
                } else {
                  onFavorites()
                }
              }}
              />
              <p>?????????</p>
              <div className="bubble-show-number">
                {thread.favoriteCount}
              </div>
            </div>
            <div className="bubble-show-action-button">
              <BadIcon 
              className={isBad ? "popon" : ""}
              onClick={() => {
                if(isBad) {
                  offBads()
                } else {
                  onBads()
                }
              }}
              />
              <p>????????????</p>
              <div className="bubble-show-number">
                {thread.badCount}
              </div>
            </div>
            <div className="bubble-show-action-button">
              <span>
                <i className="uil uil-comment"></i>
              </span>
              <p>????????????</p>
              <div className="bubble-show-number">
                {comments.length}
              </div>
            </div>
            <div className="bubble-show-action-button">
              <TwitterShareButton 
              url={"https://onlytext.net"}
              resetButtonStyle={false}
              title={thread.body}
              className="twitter-share-button" 
              >
                <TwitterIcon />
              </TwitterShareButton>
            </div>
          </div>
          <ToastContainer />
          {currentUser && (
            <div className="bubble-show-comment-textarea-wraper">
            <div className="bubble-profile-circle">
              <img src={currentUser.isAnonymous == true ? AnonymousImage :currentUser.photoURL} alt="profile" />
            </div>
            <div className="bubble-show-textarea-c">
              <p>{currentUser.isAnonymous == true ? "??????????????????" :currentUser.displayName}</p>
              <div>
                <textarea
                  placeholder="?????????????????????"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  ref={textareaRef}
                ></textarea>
              </div>
            </div>
            <button 
            className="bubble-show-comment-button"
            onClick={() => {
              const isValidate = validate()
              if(isValidate) {
                 addComment()
                } else {
                  return false
                }
              }}
            >
              <span><i className="uil uil-plus"></i></span>
            </button>
            </div>
          )}
          <p className="error text-smaller">{commentError}</p>
          <h4>comments</h4>
          <div className="comments">
            {comments !== [] ? (
              <>
              {comments.map((comment, i) => (
                <Comment 
                key={i} 
                comment={comment}
                id={id} 
                currentUser={currentUser}
                />
              ))}
              </>
            ) : (
              <div>no comment</div>
            )}
          </div>
        </div>
      </>
      )}
    </>
  );
};

export default ShowBubble;
