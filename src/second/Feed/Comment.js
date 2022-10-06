import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import { ReactComponent as LoveIcon } from "../Icons/LoveIcon.svg";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Comment = ({
  comment,
  id,
  currentUser
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBad, setIsBad] = useState(false);

  useEffect(() => {
    if(currentUser !== null) {
      const iF = comment.favorites.some((item) => item === currentUser.uid);
      const iB = comment.bads.some((item) => item === currentUser.uid);

      setIsFavorite(iF)
      setIsBad(iB)
    }
  },[])

  const onFavorites = (commentId) => {
    if (currentUser == null) {
      console.log("asdc");
      return false;
    } else {
      const count = comment.favoriteCount + 1
      const o = { 
        favorites: [currentUser.uid, ...comment.favorites],
        favoriteCount: count
      };
      db.collection("threads")
        .doc(id)
        .collection("comments")
        .doc(commentId)
        .update(o)
        .then(() => {
          setIsFavorite(true);
          toast("いいねしました!");
        })
    }
  };

  const offFavorites = (commentId) => {
    if (currentUser == null) {
      console.log("asdc");
      return false;
    } else {
      const count = comment.favoriteCount - 1
      const o = comment.favorites.filter(
        (favorite) => favorite !== currentUser.uid
      );
      const os = { 
        favorites: o ,
        favoriteCount: count
      };
      setIsFavorite(!isFavorite);
      db.collection("threads")
        .doc(id)
        .collection("comments")
        .doc(commentId)
        .update(os)
        .then(() => {
          setIsFavorite(false);
          toast("いいねを解除しました!");
        })
    }
  };

  const onBads = (commentId) => {
    if(currentUser == null) {
      return false
    } else {
      const count = comment.badCount + 1
      const b = { 
        bads: [currentUser.uid, ...comment.bads ],
        badCount: count
      }
      db.collection('threads')
        .doc(id)
        .collection("comments")
        .doc(commentId)
        .update(b)
        .then(() => {
          setIsBad(true)
          toast("いやだねしました!");
        })
    }
  }

  const offBads = (commentId) => {
    if(currentUser == null) {
      return null
    } else {
      const count = comment.badCount - 1 
      const b = comment.bads.filter((bad) =>  bad !== currentUser.uid )
      const bs = { 
        bads: b,
        badCount: count 
      }
      db.collection('threads')
      .doc(id)
      .collection('comments')
      .doc(commentId)
      .update(bs)
      .then(() => {
        setIsBad(false)
        toast("いやだねを解除しました!");
      })
    }
  }

  return (
    <>
    {comment && (
    <div className="comment">
      <div className="bubble-show-comment-content">
        <div className="bubble-show-user-c">
          <div className="bubble-profile-circle">
            <img src={comment.userimage} alt="profile" />
            <CircleIcon />
          </div>
        </div>
        <div>
          <p>{comment.username}</p>
          <div className="bubble-show">
              <div className="bubble-msg-comment">
                {comment.comment}
              <div className="bubble-comment-action-buttons">
                <div className="bubble-action-button text-muted">
                  {comment.created && (
                    <>
                      {formatDistanceToNow(comment.created.toDate()) + "ago"}
                    </>
                  )}
                </div>
                <div className="bubble-action-button">
                <LoveIcon 
                  className={isFavorite ? "on" : ""}
                  onClick={() => {
                    if(isFavorite) {
                      offFavorites(comment.id)
                    } else {
                      onFavorites(comment.id)
                    }
                  }}
                />
                  <span className="bubble-numbar text-muted">
                    {comment.favoriteCount}
                  </span>
                </div>
                <div className="bubble-action-button">
                <BadIcon 
                  className={isBad ? "popon" : ""}
                  onClick={() => {
                    if(isBad) {
                      offBads(comment.id)
                    } else {
                      onBads(comment.id)
                    }
                  }}
                  />
                  <span className="bubble-numbar text-muted">
                    {comment.badCount}
                  </span>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Comment;
