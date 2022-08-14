import React, { useState, useContext } from 'react';
import { AuthContext } from '../../components/Auth/Auth';
import { Link } from 'react-router-dom';
import { ReactComponent as MainIcon } from "../Icons/MainIcon.svg";
import ProfilePhoto from '../Parts/ProflePhoto';

const Nav = () => {
	const [open ,setOpen] = useState(false);
	const { currentUser }  = useContext(AuthContext);

	// const addOpen = () => {
	// 	setOpen(!open)
	// }

	return (
		<nav>
			<div 
			className={open ? "container nav-container nav-container-open" : "container nav-container"}
			>
			  <div className="title">
			      <MainIcon />
				  <div>ano emo</div>
			  </div>
			  <div  className="search-bar">
					<i className="uil uil-search"></i>
					<input type="search" placeholder="検索" />
			  </div>
			  {currentUser ? (
			      <ProfilePhoto photo={currentUser.photoURL} />
			  ) : (
                  <Link
				  to={{
					pathname: `/login`,
					state: { fromDashboard: true }
				  }}>
				    <i className="uil uil-user"></i>
				  </Link>
			  )}
			</div>
		</nav>
	)
}

export default Nav
