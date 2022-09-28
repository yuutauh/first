import React, { useState, useEffect } from "react";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const Following = ({ name, following }) => {
	
	return (
		<div className="follow-container">
			<p><strong>{name}</strong>さんのフォロー</p>	
			    {following.length === 0 ? (
				<div>フォローしてみましょう</div>
			) : (
				following.map((follow, i) => (
					<User userId={follow.followed} key={i} />
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
	<>
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
				<p>{user.displayName}</p>
				<div　className="profile-text">--{user.profile}</div> 
			</div>
		</div>
		</Link>
	</>
  )
};

export default Following;
