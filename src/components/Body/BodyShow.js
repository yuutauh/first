import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import CommentList from "./Comment/CommentList";
import { ReactComponent as BubbleIcon } from "../../Icons/BubbleIcon.svg";
import { ReactComponent as LoveIcon } from "../../Icons/LoveIcon.svg";
import { ReactComponent as DeleteIcon } from "../../Icons/DeleteIcon.svg";
import { ReactComponent as BadIcon } from "../../Icons/BadIcon.svg";
import { ReactComponent as TimeIcon } from "../../Icons/TimeIcon.svg";
import Hash from "../../Parts/Hash";
import { db } from "../../firebase";
import { AuthContext } from "../Auth/Auth";
import "./Body.css";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const BodyContainer = styled.div`
  width: 95%;
  padding: 20px 5%;
  margin: 0 auto;
  background-color: white;
`;

const DisplayBody = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BodyText = styled.div`
  margin: 0 auto;
`;

const Pt = styled.div`
  border-top: 1px solid rgb(239, 243, 244);
  border-bottom: 1px solid rgb(239, 243, 244);
  padding: 10px 0;
  margin: 0;
  margin-top: 20px;
`;

const Avator = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  padding: 2px;
  border: #e0e0e0 solid;
  margin-right: 20px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  border-bottom: 1px solid rgb(239, 243, 244);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 0.5rem 0;
  border-bottom: #aaa solid 1px;
`;

const Strong = styled.strong`
  font-size: 1rem;
`;

const TimeSVG = styled(TimeIcon)`
  color: rgb(83, 100, 113);
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;

const BadSVG = styled(BadIcon)`
  width: 35px;
  height: 35px;
  margin-right: 10px;
  fill: ${({isbads}) => isbads === 0 ? '#f3aa1f' : 'white'};
  cursor: pointer;
`;

const BubbleSVG = styled(BubbleIcon)`
  color: rgb(83, 100, 113);
  width: 30px;
  height: 30px;
  margin-right: 10px;
  cursor: pointer;
`;

const LoveSVG = styled(LoveIcon)`
  color: rgb(83, 100, 113);
  width: 30px;
  height: 30px;
  margin-right: 10px;
  fill :${({isfavorites}) => isfavorites === 0 ? 'red' : 'white' };
  cursor: pointer;
`;

const DeleteSVG = styled(DeleteIcon)`
  color: rgb(83, 100, 113);
  width: 30px;
  height: 30px;
  margin-right: 10px;
  cursor: pointer;
`;

const BodyShow = () => {
  const [thread, setThread] = useState("");
  const [comments, setComments] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [isFavorites, setIsFavorites] = useState(1);
  const [isBads, setIsBads] = useState(1);
  const [index, setIndex] = useState(1);
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  let id = window.location.pathname.split("/body/")[1];

  useEffect(() => {
    db.collection("threads")
      .doc(id)
      .onSnapshot((doc) => {
        setThread(doc.data());
        if (currentUser !== null) {
          const iF =  doc.data().favorites.some((item) => item == currentUser.uid)
          const iB =  doc.data().bads.some((item) => item == currentUser.uid )
          setIsFavorites(iF ? 0 : 1);
          setIsBads(iB ? 0 : 1)
        }
      });

    db.collection("threads")
      .doc(id)
      .collection("comments")
      .onSnapshot((docs) => {
        const items = [];
        docs.forEach((doc) => {
          items.push(doc.data());
        });
        setComments(items);
      });

    db.collection("tags")
      .where("threadId", "array-contains", id)
      .get()
      .then((docs) => {
        const items = [];
        docs.forEach((doc) => {
          items.push(doc.data());
        });
        setTagList(items);
      });
  }, [id]);

  const onFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous) {
      console.log("asdc");
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
          setIsFavorites(0);
        })
    }
  };

  const offFavorites = () => {
    if (currentUser == null || currentUser.isAnonymous) {
      console.log("asdc");
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
      setIsFavorites(!isFavorites);
      db.collection("threads")
        .doc(id)
        .update(os)
        .then(() => {
          setIsFavorites(1);
        })
    }
  };

  const onBads = () => {
    if(currentUser == null) {
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
          setIsBads(0)
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
        setIsBads(1)
      })
    }
  }

  const deleteBody = () => {
    if (thread.uid == currentUser.uid) {
      db.collection("threads")
        .doc(id)
        .delete()
        .then(() => history.goBack());
    }
  };

  return (
    <BodyContainer>
      <BodyWrapper thread={thread} />
      {tagList && tagList.map((tag, i) => <Hash key={i} tag={tag} />)}
      <Pt>
        <Wrapper>
          <div onClick={() => setIndex(2)} style={{ marginRight: "1rem", cursor: 'pointer' }}>
            <Strong>{thread && thread.favorites.length}</Strong>
            件のおきにいり
          </div>
          <div>
            <Strong>{thread && thread.bads.length}</Strong>件のいやだ
          </div>
          <div onClick={() => setIndex(1)} style={{cursor: 'pointer'}}>
            <Strong>{comments && comments.length}</Strong>件のコメント
          </div>
        </Wrapper>
      </Pt>
      <IconWrapper>
        {isFavorites == 0 && <LoveSVG onClick={offFavorites} isfavorites={isFavorites} /> }
        {isFavorites == 1 && <LoveSVG onClick={onFavorites} isfavorites={isFavorites} />}
        <BubbleSVG onClick={() => setIndex(1)} />
        {isBads == 0 && <BadSVG onClick={offBads} isbads={isBads} />}
        {isBads == 1 && <BadSVG onClick={onBads} isbads={isBads} />}
        {thread && currentUser !== null && thread.uid == currentUser.uid ? (
          <DeleteSVG />
        ) : (
          <></>
        )}
      </IconWrapper>
      {index == 1 &&
        <CommentList thread={thread} comments={comments} currentUser={currentUser} />
      }
      {index == 2 &&
        <>
          <p>おきにいりしたユーザー</p>
          {thread &&
            thread.favorites.map((t, i) => (
              <FavoritesUserList key={i} favorites={t} />
            ))}
        </>
      }
      <p>投稿者の情報</p>
      <Link
        to={{
          pathname: `/profile/${thread.uid}`,
        }}
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <img src={thread.userimage} alt="image" width="60px" height="60px" />
        <p>{thread.username}</p>
        <p>サブのアカウントです。</p>
      </Link>
    </BodyContainer>
  );
};

const FavoritesUserList = ({ favorites }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    db.collection("users")
      .doc(favorites)
      .get()
      .then((doc) => {
        setUser(doc.data());
      });
  }, []);
  return (
    <Link
      to={{
        pathname: `/profile/${user.uid}`,
        state: { fromDashboard: true },
      }}
      style={{
        textDecoration: "none",
        color: "black",
      }}
    >
      <UserWrapper>
        <Avator src={user.photoURL} alt="image" />
        <div>
          <div>{user.displayName}</div>
          <div style={{ fontSize: "9px", color: "rgb(48 ,47, 47)" }}>
            --{user.profile}
          </div>
        </div>
      </UserWrapper>
    </Link>
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
          <div style={{ textAlign: "end", color: "rgb(83, 100, 113)" }}>
            <TimeSVG />
            {props.thread &&
              format(props.thread.created.toDate(), "yyyy-MM-dd HH:mm", {
                locale: ja,
              })}
          </div>
        </BodyText>
      </Link>
    </DisplayBody>
  );
};

export default BodyShow;
