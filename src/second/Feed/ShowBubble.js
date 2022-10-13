import React, { useState, useEffect, useContext, useRef } from "react";
import { db, fb } from "../../firebase";
import { AuthContext } from "../../components/Auth/Auth";
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import { ReactComponent as LoveIcon } from "../Icons/LoveIcon.svg";
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
    if (currentUser == null) {
      toast("ログインしてください");
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
          toast("いいねしました");
        })
    }
  };

  const offFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous) {
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
          toast("いいねを解除しました");
        })
    }
  };

  const onBads = () => {
    if(currentUser == null) {
      toast("ログインしてください");
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
          toast("いやだねしました");
        })
    }
  }

  const offBads = () => {
    if(currentUser == null) {
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
        toast("いやだねを解除しました");
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
        .then(() => {
          toast("commentを投稿しました!");
          setComment("")
          textareaRef.current.value = ""
        })
		} else {
      setCommentError('ログインしてください')
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
      <LeftArrow />
      {thread && (
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
                    <h6>プロフィールへ</h6>
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
              <p>いいね</p>
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
              <p>いやだね</p>
              <div className="bubble-show-number">
                {thread.badCount}
              </div>
            </div>
            <div className="bubble-show-action-button">
              <span>
                <i className="uil uil-comment"></i>
              </span>
              <p>コメント</p>
              <div className="bubble-show-number">
                {comments.length}
              </div>
            </div>
          </div>
          <ToastContainer />
          {currentUser && (
            <div className="bubble-show-comment-textarea-wraper">
            <div className="bubble-profile-circle">
              <img src={currentUser.photoURL} alt="profile" />
            </div>
            <div className="bubble-show-textarea-c">
              <textarea
                placeholder="コメントをかく"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                ref={textareaRef}
              ></textarea>
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
      )}
    </>
  );
};

export default ShowBubble;
