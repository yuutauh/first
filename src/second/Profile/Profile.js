import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../components/Auth/Auth";
import { db } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import AnonymousImage from'../Parts/anonymous.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Profile.css";
import Btn from "../Parts/Btn";
import Following from "./Following";
import Followed from "./Followed";
import UserBodyList from "../../components/User/UserBodyList";
import FavoriteBodyList from "./FavoriteBodyList";
import LeftArrow from "../Parts/LeftArrow";
import ProfileBubble from "./ProfileBubble";
import MetaDecorator from "../Meta/MetaDecorator";


const Profile = () => {
  const [displayUser, setDisplayUser] = useState({});
  const [threads, setThreads] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [IsFollowing, setIsFollowing] = useState(false);
  const [IsCurrentUser, setIsCurrentUser] = useState(false);
  const [index, setIndex] = useState(1);
  const [tags, setTags] = useState([]);
  const [editText, setEditText] = useState("");
  const [isEdit, setIsEdit] = useState(false)
  const [editError, setEditError] = useState("");
  const { currentUser } = useContext(AuthContext);
  const params = useParams()
  let id = params.profile
  const uid = currentUser ? currentUser.uid : "";

  const useLocalStorage = (localItem) => {
    const [loc, setState] = useState(
      JSON.parse(localStorage.getItem(localItem))
    );
    const setLoc = (newItem) => {
      localStorage.setItem(localItem, JSON.stringify(newItem));
      setState(newItem);
    };
    return [loc, setLoc];
  };

  const [reorder, setReorder] = useLocalStorage("profile");
  const [favoriteIndex, setFavoriteIndex] = useLocalStorage("favoriteprofile");

  const [element, setElement] = useState(null);
  const observer = React.useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        fetcher.current();
      }
    })
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element, reorder]);

  useEffect(() => {
      db.collection("users")
        .doc(id)
        .get()
        .then((doc) => setDisplayUser(doc.data()));

      db.collection("tags")
        .where("userId", "array-contains", id)
        .get()
        .then((docs) => {
          const i = [];
          docs.forEach((doc) => i.push(doc.data()));
          setTags(i);
        });
      db.collection("followings")
        .where("following", "==", id)
        .get()
        .then((docs) => {
          const items = [];
          docs.forEach((doc) => {
            items.push(doc.data());
          });
          setFollowing(items);
        });
      db.collection("followings")
        .where("followed", "==", id)
        .onSnapshot((docs) => {
          const items = [];
          const size = docs.size;
          docs.forEach((doc) => {
            items.push(doc.data());
            if (doc.data().following === uid) {
              setIsFollowing(true);
            }
          });
          setFollowed(items);
        });
      setIndex(1);

    if (id === uid) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }

    return () => { setIsEdit(false) }
  }, [id]);

  useEffect(() => {
    if (reorder === null) {
      setReorder({ order: "created", by: "asc" });
      db.collection("threads")
        .where("uid", "==", id)
        .orderBy("created", "asc")
        .limit(3)
        .get()
        .then((docs) => {
          const items = [];
          const lastDoc = docs.size === 0 ? "" : docs.docs[docs.docs.length - 1];
          docs.forEach((doc) => {
            items.push(doc.data());
          });
          setThreads(items);
          setLastDoc(lastDoc);
        });
    } else {
        db.collection("threads")
        .where("uid", "==", id)
        .orderBy(reorder.order, reorder.by)
        .limit(3)
        .get()
        .then((docs) => {
          const items = [];
          const lastDoc = docs.size === 0 ? "" : docs.docs[docs.docs.length - 1];
          docs.forEach((doc) => {
            items.push(doc.data());
          });
          setThreads(items);
          setLastDoc(lastDoc);
        });
    }
  }, [id, reorder]);

  const load = () => {
    if (reorder === null) {
      setReorder({ order: "created", by: "desc" });
    }
    if (lastDoc !== "" && reorder !== null) {
      db.collection("threads")
        .where("uid", "==", id)
        .orderBy(reorder.order, reorder.by)
        .startAfter(lastDoc)
        .limit(3)
        .get()
        .then((res) => {
          const size = res.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = res.docs[res.docs.length - 1];
            res.forEach((doc) => {
              items.push(doc.data());
            });
            setThreads((prev) => [...prev, ...items]);
            setLastDoc(lastDoc);
          } else {
            setIsEmpty(true);
          }
        });
    }
  };

  const follow = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      toast("ログインしてください")
      return false;
    }
    db.collection("followings")
      .doc(`${id}` + `${uid}`)
      .set({
        following: uid,
        followed: id,
      }).then(() => {
        setIsFollowing(true)
      })
  };

  const unfollow = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      return false;
    }
    db.collection("followings")
      .doc(`${id}` + `${uid}`)
      .delete()
      .then(() => { setIsFollowing(false) })
  };

  const show = () => {
    return (
      <>
        {IsFollowing ? (
          <button className="unfollow follow-button" onClick={unfollow}>
            <span><i className="uil uil-user-minus"></i></span>
            フォロー解除
          </button>
        ) : (
          <button className="follow-button" onClick={follow}>
            <span><i className="uil uil-user-plus"></i></span>
            フォローする
          </button>
        )}
      </>
    );
  };

  const fetcher = React.useRef(load);

  React.useEffect(() => {
    fetcher.current = load;
  }, [load]);

  const ChangeIndex = (i) => {
    setIndex(i);
  };

  const EditProfileText = () => {
    db.collection('users').doc(uid).update({
			profile: editText
		}).then(() => { 
      setIsEdit(false)
      setEditText("") 
    })
  }

  const validate = () => {
		let bodyerror = "";
		if(editText.length > 200) {
			bodyerror = "２００字より多く入力できません"
		}
		if(bodyerror) {
			setEditError(bodyerror)
			return false
		}
		setEditError("")
		return true
	}

  return (
    <>
      {displayUser ? (
        <div>
          <MetaDecorator 
          title={displayUser.displayName + "- onlytext"} 
          description={displayUser.profile} 
          />
          <LeftArrow />
          <ToastContainer />
          <div className="profile-container">
          <h4>profile</h4>
            <div className="bubble-profile-circle">
              <img src={displayUser.photoURL} alt="profile" />
              <CircleIcon />
            </div>
            <h3>{displayUser.displayName}</h3>
            {isEdit ? (
              <>
                <h5>自己紹介</h5>
                <div className="input-textarea-c">
                  <textarea
                  value={editText}
                  onChange={(e) => {setEditText(e.target.value)}}
                  placeholder="自己紹介"
                  />
                </div>
                <div className="profile-text-edit-input">
                  <span 
                  data-tooltip="変更を適応する" 
                  data-flow="top"
                  onClick={() => {
                    const IsValidate = validate()
                    if(IsValidate){
                      EditProfileText()
                    }
                  }}
                  >
                    <i className="uil uil-pen"></i>
                  </span>
                  <span onClick={() => { setIsEdit(!isEdit) }}>
                    <i className="uil uil-multiply"></i>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-muted profile-text">{displayUser.profile}</p>
            )}
            {IsCurrentUser ? (
                <span onClick={() => { setIsEdit(!isEdit) }}>
                  <i className="uil uil-edit"></i>
                </span>
            ) : (
              <>{show()}</>
            )}
            <div className="follow">
              {following && (
                <div onClick={() => ChangeIndex(3)}>
                  <h2>{following.length}</h2>
                  <p>following</p>
                </div>
              )}
              {followed && (
                <div onClick={() => ChangeIndex(4)}>
                  <h2>{followed.length}</h2>
                  <p>follower</p>
                </div>
              )}
            </div>
            <div className="tags">
              {tags &&
                tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={{
                      pathname: `/tags/${tag.name}`,
                      state: { fromDashboard: true },
                    }}
                  >
                    <div className="tag">{tag.name}</div>
                  </Link>
                ))}
            </div>
            <div className="action-button">
              <div
                className={index === 1 ? "tab_active" : "tab"}
                onClick={() => {
                  ChangeIndex(1);
                }}
              >
                <span>
                  <i className="uil uil-table"></i>
                </span>
                <small>一覧</small>
              </div>
              <div
                className={index == 2 ? "tab_active" : "tab"}
                onClick={() => {
                  ChangeIndex(2);
                }}
              >
                <span>
                  <i className="uil uil-heart"></i>
                </span>
                <small>おきにいり</small>
              </div>
            </div>
          </div>
          {index == 1 && (
            <ProfileBubble
              name={displayUser.displayName}
              threads={threads}
              isEmpty={isEmpty}
              lastDoc={lastDoc}
              setElement={setElement}
              reorder={reorder}
              setReorder={setReorder}
              favoriteIndex={favoriteIndex}
              setFavoriteIndex={setFavoriteIndex}
            />
          )}
          {index == 2 && (
            <FavoriteBodyList 
            name={displayUser.displayName} 
            id={id} 
            reorder={reorder}
            setReorder={setReorder}
            favoriteIndex={favoriteIndex}
            setFavoriteIndex={setFavoriteIndex}
            />
          )}
          {index == 3 && (
            <Following
              id={id}
              name={displayUser.displayName}
              following={following}
            />
          )}
          {index == 4 && (
            <Followed
              id={id}
              name={displayUser.displayName}
              followed={followed}
            />
          )}
        </div>
      ) : (
        <div className="anonymous-profile">
          <LeftArrow />
          <div className="profile-container">
            <div className="bubble-profile-circle">
                <img src={AnonymousImage} alt="profile" />
                <CircleIcon />
              </div>
            <p>このユーザーは匿名でログインしています</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
