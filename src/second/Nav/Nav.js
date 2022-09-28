import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../components/Auth/Auth";
import { Link } from "react-router-dom";
import { ReactComponent as MainIcon } from "../Icons/MainIcon.svg";
import { ReactComponent as CircleIcon } from "../Icons/CircleIcon.svg";
import ProfilePhoto from "../Parts/ProflePhoto";
import ClickAwayListener from '@mui/material/ClickAwayListener';

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
            <MainIcon />
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
                      pathname: `/login`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list"
                    >
                    <span><i className="uil uil-sign-out-alt"></i></span>
                    <p>logout</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to={{
                      pathname: `/tagindex`,
                      state: { fromDashboard: true },
                    }}
                    className="dropdown__list"
                    >
                    <span><i className="uil uil-list-ul"></i></span>
                    <p>taglist</p>
                  </Link>
                </li>
            </ul> 
          </>          
        ) : (
          <Link
          to={{
            pathname: `/login`,
            state: { fromDashboard: true },
          }}
          >
            <i className="uil uil-user"></i>
          </Link>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
