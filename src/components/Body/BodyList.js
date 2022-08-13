import React, { useState, useEffect } from "react";
import { ReactComponent as DropdownIcon } from "../../Icons/DropdownIcon.svg";
import styled from "styled-components";
import { db, functions } from "../../firebase";
import Tagrating from "../../Parts/Tagrating";
import Userrating from "../../Parts/Userrating";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import "./Body.css";

const H3 = styled.h3`
  width: fit-content;
  padding: 5px;
  border-bottom: #aaa solid 2px;
`;

const BodyContainer = styled.div`
  width: 95%;
  padding: 20px 5%;
  margin: 0 auto;
  background-color: white;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  :hover {
    .dropdown-contents {
      display: block;
    }
  }

  .dropdown-contents {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .content {
    color: black;
    padding: 8px 12px;
    text-decoration: none;
    display: block;

    :hover {
      background-color: #ddd;
    }
  }
`;

const DropdownSVG = styled(DropdownIcon)`
  color: rgb(83, 100, 113);
  width: 25px;
  height: 25px;
  margin-left: 10px;
`;

const DisplayBody = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BodyText = styled.div`
  margin: 0 auto;
  word-break: break-all;
`;

const BodyList = (props) => {
  const [threads, setThreads] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const useLocalStorage = (localItem) => {
    const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
    const setLoc = (newItem) => {
      localStorage.setItem(localItem, JSON.stringify(newItem));
      setState(newItem);
    };
    return [loc, setLoc];
  };
  const [reorder, setReorder] = useLocalStorage("fruit");

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
    // var getRanking = functions.httpsCallable("getRanking");
    // getRanking().then((res) => { console.log(res) })
    //             .catch(err => console.log(err))
    if(reorder === null){
      setReorder({order: "created", by: "desc"})
    }
    db.collection("threads")
      .orderBy(reorder.order,reorder.by)
      .limit(5)
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
  }, [reorder]);

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
  }, [elment,reorder]);

  const Fetchmore = () => {
    if(reorder === null){
      setReorder({order: "created", by: "desc"})
    }
    if (lastDoc !== "")
    db.collection("threads")
      .orderBy(reorder.order,reorder.by)
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
  };

  const fetcher = React.useRef(Fetchmore);

  React.useEffect(() => {
    fetcher.current = Fetchmore;
  }, [Fetchmore]);

  return (
    <>
      <BodyContainer>
        <Tagrating />
        <Userrating />
        <Flex>
          <H3>みんなの投稿</H3>
          <Dropdown>
            <DropdownSVG />
            <div className="dropdown-contents">
              <div
                className="content"
                onClick={() => {
                  setReorder({"order": "created", "by": "desc"});
                }}
              >
                新しい順
              </div>
              <div
                className="content"
                onClick={() => {
                  setReorder({"order": "created", "by": "asc"});
                }}
              >
                古い順
              </div>
              <div
                className="content"
                onClick={() => {
                  setReorder({"order": "favoriteCount", "by": "desc"});
                }}
              >
                人気順
              </div>
              <div
                className="content"
                onClick={() => {
                  setReorder({"order": "badCount", "by": "desc"});
                }}
              >
                不人気順
              </div>
            </div>
          </Dropdown>
          <div>
            {reorder && reorder.order}
          </div>
        </Flex>
        {threads &&
          threads.map((thread, i) => <BodyWrapper key={i} thread={thread} />)}
        {isEmpty && <p>これ以上ありません</p>}
      </BodyContainer>
      <button
        ref={setElment}
        onClick={Fetchmore}
        style={{
          margin: "10px",
          visibility: "hidden",
        }}
      >
        これ以上ありません
      </button>
    </>
  );
};

const BodyWrapper = (props) => {
  return (
    <DisplayBody>
      <Link
        to={{
          pathname: `/body/${props.thread.id}`,
          state: { fromDashboard: true },
        }}
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <BodyText>
          <p>{props.thread.body}</p>
          <div style={{ textAlign: "end" }}>
            {format(props.thread.created.toDate(), "yyyy-MM-dd HH:mm", {
              locale: ja,
            })}
          </div>
        </BodyText>
      </Link>
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle circle-2"></div>
        <div className="arrow">
          <div className="arrow_line"></div>
          <div className="arrow_tip-wrapper">
            <div className="arrow_tip left"></div>
            <div className="arrow_tip right"></div>
          </div>
        </div>
      </div>
    </DisplayBody>
  );
};

export default BodyList;
