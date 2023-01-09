import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from "../../components/Auth/Auth";
import { db, storage } from "../../firebase";
import Bubble from "./Bubble";
import WelcomeModal from "./WelcomeModal";
import "./Feed.css";
import { Link } from "react-router-dom";

const Feeds = () => {
  const [threads, setThreads] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const { currentUser } = useContext(AuthContext);

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

  useEffect(() => {
    db.collection("threads")
      .orderBy("created", "desc")
      .limit(10)
      .get()
      .then((res) => {
        const items = [];
        const lastDoc = res.docs[res.docs.length - 1];
        res.forEach((doc) => {
          items.push(doc.data());
        });
        setThreads(items);
        setLastDoc(lastDoc);
      });
    const keyName = "visited";
    const keyValue = true;

    if (!localStorage.getItem(keyName)) {
      localStorage.setItem(keyName, keyValue);
      setIsModal(true);
    } else {
      setIsModal(false);
    }

    return () => { console.clear() }
  }, []);

  const [elment, setElment] = useState(null);

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
  }, [elment]);

  const Fetchmore = () => {
    if (lastDoc !== "")
      db.collection("threads")
        .orderBy("created", "desc")
        .startAfter(lastDoc)
        .limit(10)
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
  };

  const fetcher = React.useRef(Fetchmore);

  React.useEffect(() => {
    fetcher.current = Fetchmore;
  }, [Fetchmore]);

  return (
    <>
      <ToastContainer />
      <WelcomeModal isModal={isModal} setIsModal={setIsModal} />
      <div className="feeds-c">
        <div className="home-header">
          <h1>only text</h1>
          <p className="bubble-subtitle">
            なにか投稿してみましょう！
            <br />
            文字だけで思いをつたえてみましょう
          </p>
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

        <Link
          className="float"
          to={{
            pathname: `/input`,
            state: { fromDashboard: true },
          }}
        >
          <span data-tooltip="投稿" data-flow="top" className="my-float">
            <i className="uil uil-plus"></i>
          </span>
        </Link>
        {isEmpty && <p className="text-smaller">これ以上ありません</p>}
        <button
          ref={setElment}
          onClick={Fetchmore}
          className="loadButton"
        ></button>
      </div>
    </>
  );
};

export default Feeds;
