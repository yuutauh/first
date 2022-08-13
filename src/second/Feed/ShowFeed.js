import React, { useState, useEffect, useContext } from "react";
import { db } from '../../firebase';
import { AuthContext } from '../../components/Auth/Auth';
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import './Feed.css';
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const ShowFeed = () => {
	const [thread, setThread] = useState('');
	const [comments, setComments] = useState([]);
 	let id = window.location.pathname.split("/body/")[1];
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
	  db
	  .collection("threads")
      .doc(id)
      .onSnapshot((doc) => {
        setThread(doc.data());
        if (currentUser !== null) {
          const iF =  doc.data().favorites.some((item) => item == currentUser.uid)
          const iB =  doc.data().bads.some((item) => item == currentUser.uid )
        }
      });

	  db
	  .collection('threads')
	  .doc(id)
	  .collection('comments')
	  .get()
	  .then((docs) => {
		  const items = []
		  docs.forEach((doc) => {
			  items.push(doc.exists ? doc.data() : {comment: "no commments"})
		  })
		  setComments(items)
	  })
	},[])

	console.log(comments)

	return(
		<>
		{ thread ? (
			<>
			<div className="feed show">
				<div className="head mosaic">
					<div className="profile-photo">
						<img src={thread.userimage} alt="unsplash" />
					</div>
					<div className="ingo">
						<h3>{thread.username}</h3>
					</div>
				</div>
				<div className="tags">
					{thread.tagname.map((tag,i) => (
						<div className="tag" key={i}>{tag}</div>
					))}
				</div>
				<div className="show-msg-container">
					<p className="msg">
					{thread.body}
					</p>
				</div>
				<small>
				  {format(thread.created.toDate(), "yyyy-MM-dd HH:mm", {locale: ja})}
				</small>
				<div className="show-action-buttons">
					<span><i className="uil uil-heart"></i></span>
					<BadIcon />
					<span><i className="uil uil-comment"></i></span>
					<span><i className="uil uil-trash"></i></span>
				</div>
				<div className="show-count-msg">
					<p>{thread.favoriteCount}件のおきにいり</p>
					<p>{thread.badCount}件のいやだ</p>
					<p>{thread.badCount}件のコメント</p>
				</div>
			</div>
			{comments &&
			 comments.map((comment) => (
				 <div className="comment">
					<div className="comment-head">
						<div className="user">
							<div className="profile-photo comment-image">
								<img src={comment.userimage} />
							</div>
							<h3>
								{comment.username}
							</h3>
						</div>
						<small>
							{format(comment.created.toDate(), "yyyy-MM-dd HH:mm", {locale: ja})}
						</small>
					</div>
					<p>
					   {comment.comment}
					</p>
					<div className="show-action-buttons">
						<span><i className="uil uil-heart"></i></span>
						<span>{comment.favoriteCount}</span>
						<span><BadIcon /></span>
						<span>{comment.badCount}</span>
						<span><i className="uil uil-trash"></i></span>
					</div>		
				 </div>
			 ))
			}
			</>
			) : (
				<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>	
			)}
		</>
	)
}

export default ShowFeed;