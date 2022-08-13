import React, { useState, useRef } from 'react';
import { ReactComponent as DropdownIcon } from "../../Icons/DropdownIcon.svg";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Feed from '../../second/Feed/Feed'

const Container = styled.div`
width: 100%;
height: 70vh;
display: flex;
align-items: center;
justify-content: center;
position: relative;
`;

const Flex = styled.div`
display: flex;
align-items: center;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  :hover {
    .dropdown-contents {
      display: block;
    }
  }

  .dropdown-contents {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .content {
    color: black;
    padding: 8px 12px;
    text-decoration: none;
    display: block;

    :hover {
      background-color: #ddd;
    }
  }
`;

const DropdownSVG = styled(DropdownIcon)`
  color: rgb(83, 100, 113);
  width: 25px;
  height: 25px;
  margin-left: 10px;
`;

const BodyText = styled.div`
  margin: 0 auto;
  word-break: break-all;
`;
 
const UserBodyList = React.memo(({
	name, 
	threads, 
	isEmpty, 
	setElement,  
	setReorder,
	setFavoriteIndex
}) => {
		return (
			<>
			
			<ul style={{
				listStyleType: "none"
			}}>
			  {threads.map((thread, i) => (
			     <Feed 
				 key={i}
				 body={thread.body}
				 created={thread.created}
				 id={thread.id}
				 tagname={thread.tagname}
				 userimage={thread.userimage}
				 username={thread.username} 
				 />
				))}
				{isEmpty &&  <li>no more</li> }
			</ul>
			<button style={{visibility: "hidden"}} ref={setElement}>
				load
			</button>
			</>
		)
	}
)	

export default UserBodyList
