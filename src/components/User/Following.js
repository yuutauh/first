import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
display: flex;
align-items: center;
margin: 10px 0;
padding: 0.5rem 0;
border-bottom: #aaa solid 1px;
`;

const Avator = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  padding: 2px;
  border: #e0e0e0 solid;
  margin-right: 20px ;
`;

const Following = React.memo(({ name, following }) => {
	return (
		<div>
			<div>{name}さんのフォロー</div>	
			{following &&
			 following.map((follow, i) => (
				 <User userId={follow.followed} key={i} />
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
	<>
		<Link
		to={{
		pathname: `/profile/${user.uid}`,
		state: { fromDashboard: true },
		}}
		style={{
		textDecoration: "none",
		color: 'black',
		}}>
		<Wrapper>
			<Avator src={user.photoURL} alt="image" />
			<div>
				<div>{user.displayName}</div>
				<div style={{fontSize: '9px', color: "rgb(48 ,47, 47)"}}>--{user.profile}</div> 
			</div>
		</Wrapper>
		</Link>
	</>
  )
});

export default Following;
