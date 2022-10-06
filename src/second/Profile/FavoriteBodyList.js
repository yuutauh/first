import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import ProfileBubble from "./ProfileBubble";

const FavoriteBodyList = React.memo(({ 
  name, 
  id,
  reorder,
  setReorder,
  favoriteIndex,
  setFavoriteIndex 
}) => {
  const [threads, setThreads] = useState([]);
  const [lastDoc, setLastDoc] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
 
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
  }, [element, favoriteIndex]);

  useEffect(() => {
    if (favoriteIndex === null) {
      setFavoriteIndex({ order: "created", by: "desc" });
    }
    db.collection("threads")
      .where("favorites", "array-contains", id)
      .orderBy(favoriteIndex.order, favoriteIndex.by)
      .limit(3)
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
  }, [id, favoriteIndex]);

  const load = () => {
    if (favoriteIndex === null) {
      setFavoriteIndex({ order: "created", by: "desc" });
    }
    if (lastDoc !== "") {
      db.collection("threads")
        .where("favorites", "array-contains", id)
        .orderBy(favoriteIndex.order, favoriteIndex.by)
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

  const fetcher = React.useRef(load);

  React.useEffect(() => {
    fetcher.current = load;
  }, [load]);

  return (
    <div className="favoritebody-c">      
      <ProfileBubble
        name={name}
        threads={threads}
        isEmpty={isEmpty}
        favoriteIndex={favoriteIndex}
        setElement={setElement}
        reorder={reorder}
        setReorder={setReorder}
        setFavoriteIndex={setFavoriteIndex}
      />
    </div>
  );
});

export default FavoriteBodyList;
