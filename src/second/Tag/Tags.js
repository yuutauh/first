import React, { useState, useEffect, useContext } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../components/Auth/Auth";
import { useLocation } from "react-router-dom";
import Bubble from "../Feed/Bubble";
import Follower from "./Follower";
import LeftArrow from "../Parts/LeftArrow";
import { Link } from "react-router-dom";
import MetaDecorator from "../Meta/MetaDecorator";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Feed/Feed.css";
import "./Tag.css";

const Tags = () => {
  const [tag, setTag] = useState("");
  const [threads, setThreads] = useState([]);
  const [IsFavorite, setIsFavorite] = useState(false);
  const [index, setIndex] = useState(1);
  const { currentUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  let id = window.location.pathname.split("/tags/")[1];
  let decoded = decodeURI(id);
  const uid = currentUser ? currentUser.uid : "";
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDoc, setLastDoc] = useState("");

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

  const [reorder, setReorder] = useLocalStorage("tags");

  const observer = React.useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetcher.current();
        }
      },
      { threshold: 1 }
    )
  );
  const [elment, setElment] = useState(null);

  useEffect(() => {
    if (reorder === null) {
      setReorder({ order: "created", by: "desc" });
      db.collection("threads")
        .where("tagname", "array-contains", decoded)
        .orderBy("created", "desc")
        .limit(8)
        .get()
        .then((docs) => {
          const size = docs.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = docs.docs[docs.docs.length - 1];
            docs.forEach((doc) => {
              items.push(doc.exists ? doc.data() : { body: "no data" });
            });
            setThreads(items);
            setLastDoc(lastDoc);
          }
        })
    } else {
      db.collection("threads")
        .where("tagname", "array-contains", decoded)
        .orderBy(reorder.order, reorder.by)
        .limit(8)
        .get()
        .then((docs) => {
          const size = docs.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = docs.docs[docs.docs.length - 1];
            docs.forEach((doc) => {
              items.push(doc.exists ? doc.data() : { body: "no data" });
            });
            setThreads(items);
            setLastDoc(lastDoc);
          }
        })

  
    } 

    db.collection("tags")
      .where("name", "==", decoded)
      .onSnapshot((docs) => {
        const i = [];
        docs.forEach((doc) => {
          i.push(doc.data());
          setIsFavorite(doc.data().userId.some((items) => items === uid));
        });
        setTag(i[0]);
      });

  }, [reorder, pathname]);

  const Fetchmore = () => {
    if (reorder === null) {
      setReorder({ order: "created", by: "desc" });
    }

    if (tag || lastDoc != "") {
      db.collection("threads")
        .where("tagname", "array-contains", decoded)
        .orderBy(reorder.order, reorder.by)
        .startAfter(lastDoc)
        .limit(8)
        .get()
        .then((docs) => {
          const size = docs.size === 0;
          if (!size) {
            const items = [];
            const lastDoc = docs.docs[docs.docs.length - 1];
            docs.forEach((doc) => {
              items.push(doc.exists ? doc.data() : { body: "no data" });
            });
            setThreads((prev) => [...prev, ...items]);
            setLastDoc(lastDoc);
          } else {
            setIsEmpty(true);
          }
        });
    } 
  };

  useEffect(() => {
    const currentElement = elment;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [elment, reorder]);

  const fetcher = React.useRef(Fetchmore);

  React.useEffect(() => {
    fetcher.current = Fetchmore;
  }, [Fetchmore]);

  const ChangeIndex = (i) => {
    setIndex(i);
  };

  const onFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      toast("ログインしてください")
    } else {
      const count = tag.userCount + 1;
      const o = {
        userId: [currentUser.uid, ...tag.userId],
        userCount: count,
      };
      db.collection("tags")
        .doc(tag.id)
        .update(o)
        .then(() => {
          setIsFavorite(true);
        });
    }
  };

  const offFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous == true) {
      toast("ログインしてください")
    } else {
      const o = tag.userId.filter((favorite) => favorite !== currentUser.uid);
      const count = tag.userCount - 1;
      const os = {
        userId: o,
        userCount: count,
      };

      db.collection("tags")
        .doc(tag.id)
        .update(os)
        .then(() => {
          setIsFavorite(false);
        });
    }
  };

  return (
    <>
      <div>
        {tag ? (
          <>
            <LeftArrow />
            <ToastContainer />
            <MetaDecorator 
              title={ tag.name + "- tag - onlytext"} 
              description={"onlytext" + tag.name} 
            />
            <div className="taglist-h">
              <h4>topic</h4>
              <div className="taglist-i">
                <div className="tag">{tag.name}</div>
                {IsFavorite ? (
                  <button
                    className="taglist-button-on"
                    onClick={() => {
                      offFavorites();
                    }}
                  >
                    <span><i className="uil uil-minus"></i></span>
                    フォロー中
                  </button>
                ) : (
                  <button
                    className="taglist-button"
                    onClick={() => {
                      onFavorites();
                    }}
                  >
                    <span><i className="uil uil-check"></i></span>
                    フォローする
                  </button>
                )}
              </div>
              <div className="taglist-j">
                <div
                  onClick={() => {
                    ChangeIndex(1);
                  }}
                >
                  <span>
                    <i className="uil uil-comment"></i>
                  </span>
                  <span className="taglist-num">{threads.length}</span>
                  <span className="taglist-title">投稿</span>
                </div>
                <div
                  onClick={() => {
                    ChangeIndex(2);
                  }}
                >
                  <span>
                    <i className="uil uil-user"></i>
                  </span>
                  <span className="taglist-num">{tag.userId.length}</span>
                  <span className="taglist-title">フォロワー</span>
                </div>
              </div>
            </div>
            {index == 1 && (
              <div>
                <div className="search-nav">
                  <div
                    className={
                      reorder?.order == "created" && 
                      reorder?.by == "desc" 
                    ? "active-taglist-order-nav" : ""}
                    onClick={() => {
                      setReorder({ order: "created", by: "desc" })
                    }}
                  >
                    新しい順
                  </div>
                  <div
                    className={
                      reorder?.order == "created" && 
                      reorder?.by == "asc" 
                    ? "active-taglist-order-nav" : ""}
                    onClick={() => {
                      setReorder({ order: "created", by: "asc" });
                    }}
                  >
                    古い順
                  </div>
                  <div
                    className={
                      reorder?.order == "favoriteCount" 
                    ? "active-taglist-order-nav" : ""}
                    onClick={() => {
                      setReorder({ order: "favoriteCount", by: "desc" });
                    }}
                  >
                    いいねが多い順
                  </div>
                </div>
                {threads &&
                  threads.map((thread, i) => (
                    <Bubble
                      key={i}
                      body={thread.body}
                      userimage={thread.userimage}
                      created={thread.created}
                      id={thread.id}
                      favoriteCount={thread.favoriteCount}
                      badCount={thread.badCount}
                    />
                  ))}
                {isEmpty && <p className="text-smaller">これ以上ありません</p>}
                <button
                  ref={setElment}
                  onClick={Fetchmore}
                  className="loadButton"
                ></button>
              </div>
            )}
            {index == 2 && (
              <div className="tags-follower">
                <Follower userId={tag.userId} />
              </div>
            )}
            <Link
              className="float"
              to={{
              pathname: `/input`,
              state: { fromDashboard: true },
              }}>
                  <span
                  data-tooltip="投稿" 
                  data-flow="top" 
                  className="my-float">
                    <i className="uil uil-plus"></i>
                  </span>
            </Link>
          </>
        ) : (
          <p>話題が見つかりません</p>
        )}
      </div>
    </>
  );
};

export default Tags;
