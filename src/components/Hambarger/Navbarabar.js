import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../Auth/Auth';
import { Link } from 'react-router-dom';
import Burger from './Burger';

const Nav = styled.nav`
  position: fixed;
  width: 100%;
  height: 10vh;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  z-index: 20;

  .title {
	padding: 14px 0px;  
	font-family: 'Raleway', sans-serif;
	font-size: 2rem;
	letter-spacing: 1rem;
  @media(max-width: 450px) {
	  font-size: 1rem;
	  letter-spacing: 0.5rem;
  }
  }  
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;


const Navbarabar = () => {
  const { currentUser }  = useContext(AuthContext);

	return (
		<Nav>
			<div className="title">amo emo</div>
      {currentUser ? (
        <>
          <Burger />
        </>
      ) : (
        <span className="material-icons">
          <Link 
          to={{
            pathname: `/login`,
            state: { fromDashboard: true }
          }}
          style={{
            color: 'black',
            textDecoration: 'none',
          }}>
            login
          </Link>
        </span>
      )}
		</Nav>
	)
}

export default Navbarabar
