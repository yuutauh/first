import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { Link } from "react-router-dom";


const Followed = React.memo(({ name, followed }) => {
	return (
		<div className="follow-container">
			<div><strong>{name}</strong>さんのフォロワー</div>
			{followed &&
			 followed.map((id, i) => (
				 <User  key={i} userId={id.following}  />
			 ))
			}
        </div>
  );
});

const User = React.memo(({ userId }) => {
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
		    <div className="profile-photo linear-border">
		        <img src={user.photoURL} alt="image" />
			</div>
		    <div className="profile-text-container">
			  <div>{user.displayName}</div>
			  <div className="profile-text">{user.profile}</div> 
		    </div>
	     </div>
　　</Link>
  )
});

export default Followed;