import React, { useState, useEffect, useContext } from "react";
import { ReactComponent as DropdownIcon } from "../../Icons/DropdownIcon.svg";
import styled from 'styled-components';
import TagBody from "./TagBody";
import { db, fb } from "../../firebase";
import { AuthContext } from "../Auth/Auth";

const Container = styled.div`
width: 95%;
padding: 20px 5%;
margin: 0 auto;
background-color: white;
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
margin: 20px 0;
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

// const ThreadContainer = styled.div`
// height: 70vh;
// scroll-snap-type: y mandatory;
// overflow-y: scroll;
// `;

// const Section = styled.section`
// display: flex;
// justify-content: center;
// align-items: center;
// width: 100%;
// height: 50vh;
// padding: 30px;
// scroll-snap-align: start;
// `;

const Button = styled.button`
margin-left: auto;
display: flex;
align-items: center;
font-family: inherit;
padding: 5px 10px;
border: none ;
border-radius: 10px;
`;

const TagBodyList = () => {
  const [tag, setTag] = useState("");
  const [threads, setThreads] = useState([]);
  const [IsFavorite, setIsFavorite] = useState(false);
  const { currentUser } = useContext(AuthContext);
  let id = window.location.pathname.split("/tags/")[1];
  const uid = currentUser ? currentUser.uid : "";
  const [isEmpty, setIsEmpty] = useState(false);
  const [count, setCount] = useState(0);

  const useLocalStorage = (localItem) => {
    const [loc, setState] = useState(JSON.parse(localStorage.getItem(localItem)));
    const setLoc = (newItem) => {
      localStorage.setItem(localItem, JSON.stringify(newItem));
      setState(newItem);
    } ;
    return [loc, setLoc];
  };

  const [reorder, setReorder] = useLocalStorage("tagList");
 
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

  const sliceByNumber = (array, number) => {
    const length = Math.ceil(array.length / number)
    return new Array(length).fill().map((_, i) =>
      array.slice(i * number, (i + 1) * number)
    )
  }

  useEffect(() => {
    db.collection("tags")
      .doc(id)
      .get()
      .then((doc) => {
        setTag(doc.data());
        const items = [];
        const ids = sliceByNumber(doc.data().threadId, 5)
        ids.forEach((element) => {
          items.push(element);
        });
        setThreads(ids[count]);
        setCount(prev => prev + 1)
      });
  }, [reorder]);

  const Fetchmore = () => {
    if(tag) {
      const ids = sliceByNumber(tag.threadId, 5)
      const items = []
      ids.forEach((element) => {
        items.push(element);
      });
      const size = tag.threadId.length / count
      if(Math.ceil(size) > 5) {
        // setThreads(prev => prev.concat(...items));
        setThreads(prev => prev.concat(ids[count]))
        setCount(prev => prev + 1);
      } else {
        setIsEmpty(true)
      }
    }
  }
  
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

  const fetcher = React.useRef(Fetchmore);

  React.useEffect(() => {
    fetcher.current = Fetchmore;
  }, [Fetchmore]);

  useEffect(() => {
	if(tag.userId){
		setIsFavorite(tag.userId.some((items) => items === uid));
	}
  }, [tag]);


  const addFavorites = () => {
    if (currentUser === null || currentUser.isAnonymous) {
      return;
    } else {
      db.collection("tags")
        .doc(id)
        .update({
          userId: fb.firestore.FieldValue.arrayUnion(uid),
        })
	  setIsFavorite(true)
    }
  };

  const removeFavorites = () => {
    if (currentUser === null) {
      return;
    } else {
      const updatedId = tag.userId.filter(
        (before) => before !== uid
      );
      db.collection("tags").doc(id).update({
        userId: updatedId,
      });
	  setIsFavorite(false)
    }
  };

  console.log(threads)

  return (
    <Container>
      <Wrapper>
        {tag && 
        <>
          <h1 style={{marginRight: '1rem'}}>{tag.name}</h1>
          <h4>{tag.threadId.length}件の投稿</h4>
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
          {reorder && reorder.order}
        </>
        }
        <>{IsFavorite ? (
        <Button onClick={removeFavorites}>
          お気に入り解除
      　</Button>
        ) : (
        <Button onClick={addFavorites}>
          お気に入り
        </Button>
        )}</>
      </Wrapper>
        {threads && threads.map((t, i) => (
            <TagBody key={i} t={t}  />
        ))}
        {isEmpty && <p>no more</p>}
        <button ref={setElment} onClick={Fetchmore} style={{ margin: "10px" }}>load</button>
    </Container>
  );
};

export default TagBodyList;
