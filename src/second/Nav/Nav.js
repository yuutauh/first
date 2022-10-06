import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/Auth/Auth";
import { Link } from "react-router-dom";
import { ReactComponent as OnlytextIcon } from "../Icons/Onlytext.svg";
import ProfilePhoto from "../Parts/ProflePhoto";


const Nav = () => {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <nav>
      <div className={"container nav-container"}>
        <div className="title">
          <Link
          to={{
            pathname: `/`,
            state: { fromDashboard: true }
          }} 
          >
            <OnlytextIcon />
          </Link>
          <div>only text</div>
        </div>
        <div className="nav-login-c">
        <Link
        to={{
          pathname: `/search`,
					state: { fromDashboard: true }
        }}
        >
          <i className="uil uil-search"></i>
        </Link>
        {currentUser ? (
          <>
            <ProfilePhoto 
            open={open} 
            photo={currentUser.photoURL}
            setOpen={setOpen} 
            />
            <ul 
            onClick={() => { setOpen(false) }}
            className={open ? "open__dropdown__lists" : "dropdown__lists"}
            >
                <li>
                  <Link
                    to={{
                      pathname: `/profile/${currentUser.uid}`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list"
                    >
                    <div className="nav-profile-circle">
                      <img src={currentUser.photoURL} alt="profile" />
                    </div>
                    <h5>{currentUser.displayName}</h5>
                  </Link>
                </li>
                <li>
                  <Link
                    to={{
                      pathname: `/tagindex`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list">
                      <span><i className="uil uil-list-ul"></i></span>
                      <p>taglist</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to={{
                      pathname: `/login`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list"
                    >
                    <span><i className="uil uil-sign-out-alt"></i></span>
                    <p>logout</p>
                  </Link>
                </li>
            </ul> 
          </>          
        ) : (
          <>
            <i 
            open={open}
            onClick={() => { setOpen(prev => !prev) }}
            className="uil uil-user"></i>
            <ul
            onClick={() => { setOpen(false) }}
            className={open ? "open__dropdown__lists" : "dropdown__lists"}>
                <li>
                  <Link
                    to={{
                      pathname: `/tagindex`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list">
                      <span><i className="uil uil-list-ul"></i></span>
                      <p>taglist</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to={{
                      pathname: `/login`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list"
                    >
                    <span><i className="uil uil-user-plus"></i></span>
                    <p>login</p>
                  </Link>
                </li>
            </ul>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
