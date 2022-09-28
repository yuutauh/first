import React, { useState, useEffect } from "react";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import { db } from "../../firebase";
import { Link } from "react-router-dom";


const Followed = ({ name, followed }) => {
	return (
		<div className="follow-container">
			<div><strong>{name}</strong>さんのフォロワー</div>
			{followed.length === 0  ? (
				<div>フォロワーがいません</div>
			) : (
				followed.map((id, i) => (
					<User  key={i} userId={id.following}  />
				))
			)

			}
        </div>
  );
};

const User = ({ userId }) => {
  const [user, setUser] = useState({});
  useEffect(() => {
	db.collection("users")
	  .doc(userId)
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
	}}>
	     <div className="user-list">
		    <div className="bubble-profile-circle">
                <img src={user.photoURL} alt="profile" />
                <CircleIcon />
            </div>
		    <div className="profile-text-container">
			  <div>{user.displayName}</div>
			  <div className="profile-text">{user.profile}</div> 
		    </div>
	     </div>
　　</Link>
  )
};

export default Followed;