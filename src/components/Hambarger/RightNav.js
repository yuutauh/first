import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as HomeIcon } from "../../Icons/HomeIcon.svg";
import { ReactComponent as PersonIcon } from "../../Icons/PersonIcon.svg";
import { ReactComponent as FireIcon } from "../../Icons/FireIcon.svg";
import { ReactComponent as TagIcon } from "../../Icons/TagIcon.svg";
import { ReactComponent as PenIcon } from "../../Icons/PenIcon.svg";

const Ul = styled.ul`
    padding: 0;
	margin: 0;
	list-style: none;
	display: flex;

	li {
		font-family: 'Raleway', sans-serif;
		padding: 18px 10px;
	}

	a {
		color: black;
	}

	@media (max-width: 768px) {
		flex-flow: column nowrap;
		background-color: #0e0e0e;
		position: fixed;
		top: 0;
		right: 0;
		width: 300px;
		height: 100vh;
		padding-top: 3.5rem;
		transition: 0.3s;
		transform: ${({open}) => open ? 'translateX(0%)' : 'translateX(120%)' } ;

		li {
			font-family: 'Raleway', sans-serif;
		}

		a {
			color: #fff;
		}
	}
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
`;

const HomeSVG = styled(HomeIcon)`
width: 20px;
height: 20px;
color: black;
margin-right: 0.5rem ;
  @media(max-width: 768px) {
	  color: #fff;
  }
`;

const PersonSVG = styled(PersonIcon)`
width: 20px;
height: 20px;
color: black;
margin-right: 0.5rem ;
  @media(max-width: 768px) {
	  color: #fff;
  }
`;

const FireSVG = styled(FireIcon)`
width: 20px;
height: 20px;
color: black;
margin-right: 0.5rem ;
  @media(max-width: 768px) {
	  color: #fff;
  }
`;

const TagSVG = styled(TagIcon)`
width: 20px;
height: 20px;
color: black;
margin-right: 0.5rem ;
  @media(max-width: 768px) {
	  color: #fff;
  }
`;

const PenSVG = styled(PenIcon)`
width: 20px;
height: 20px;
color: black;
margin-right: 0.5rem ;
  @media(max-width: 768px) {
	  color: #fff;
  }
`;

const RightNav = ({open , setOpen, uid}) => {
	return (
		<>
			<Ul open={open} onClick={() => {setOpen(!open)}}>
			   <li>
				<Link  
				to={{
					pathname: `/`,
					state: { fromDashboard: true }
				}} 
				style={{
					textDecoration: 'none',
				}}>
					<Wrapper>
						<HomeSVG />
						home
					</Wrapper>  
				</Link>
				</li>
				<li>
				<Link  
				to={{
					pathname: `/profile/${uid}`,
					state: { fromDashboard: true }
				}} 
				style={{
					textDecoration: 'none',
				}}>
					<Wrapper>
						<PersonSVG />
						person
					</Wrapper>  
				</Link>
				</li>
				<li>
				<Link  
				to={{
					pathname: `/trends`,
					state: { fromDashboard: true }
				}} 
				style={{
					textDecoration: 'none',
				}}>
					<Wrapper>
						<FireSVG />
						trends
					</Wrapper>  
				</Link>
				</li>
				<li>
				<Link  
				to={{
					pathname: `/tags`,
					state: { fromDashboard: true }
				}} 
				style={{
					textDecoration: 'none',
				}}>
					<Wrapper>
						<TagSVG />
					    tag   
					</Wrapper>
				</Link>
				</li>
				<li>
				<Link  
				to={{
					pathname: `/input`,
					state: { fromDashboard: true }
				}} 
				style={{
					textDecoration: 'none',
				}}>
					<Wrapper>
						<PenSVG />
						send
					</Wrapper>  
				</Link>
				</li>
				<li>
					<div style={{width: '70px'}}></div>
				</li>
			</Ul>
		</>
	)
}

export default RightNav
