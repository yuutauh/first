import React from "react";
import Bubble from "../Feed/Bubble";

const ProfileBubble = ({
  name,
  threads,
  isEmpty,
  setElement,
  setReorder,
  setFavoriteIndex,
}) => {
  return (
    <>
      <div className="search-nav">
        <div
          onClick={() => {
            setReorder({ order: "created", by: "desc" });
			setFavoriteIndex({ order: "created", by: "desc" });
          }}
        >
          新しい順
        </div>
        <div
          onClick={() => {
            setReorder({ order: "created", by: "asc" });
			setFavoriteIndex({ order: "created", by: "asc" });
          }}
        >
          古い順
        </div>
        <div
          onClick={() => {
            setReorder({ order: "favoriteCount", by: "desc" });
			setFavoriteIndex({ order: "favoriteCount", by: "desc" });
          }}
        >
          いいねが多い順
        </div>
      </div>
      <div>
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
        {isEmpty && <li>no more</li>}
        <button style={{ visibility: "hidden" }} ref={setElement}>
          load
        </button>
      </div>
    </>
  );
};

export default ProfileBubble;
