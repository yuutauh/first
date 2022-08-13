import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  
  align-items: center;
  padding: 0 1rem;
`;

const UserImage = styled.img`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 0.5rem;
  border: 2px solid gray ;
  padding: 2px;
`;

const Avatar = (props) => {
  return (
    <Link
      to={{
        pathname: `/profile/${props.user.uid}`,
        state: { fromDashboard: true },
      }}
      style={{
        textDecoration: "none",
        color: 'black',
      }}
    >
      <Wrapper>
        <UserImage src={props.user.photoURL} height={props.height} width={props.width} />
        <>{props.user.displayName}</>
      </Wrapper>
    </Link>
  );
};

export default Avatar;
