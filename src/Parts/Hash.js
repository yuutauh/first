import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  `;
  
  const Span = styled.span`
  font-size: 12px;
`;

const Div = styled.div`
  white-space: nowrap; 
  
`;

const Hash = (props) => {

  return (
    <>
      <Link
        to={{
          pathname: `/tags/${props.tag.id}`,
          state: { fromDashboard: true },
        }}
		style={{ 
			textDecoration: 'none',
      color: "rgb(29, 155, 240)",
		}}
      >
	    <Wrapper>
          <Span className="material-icons">tag</Span>
			<Div>
			  {props.tag.name}({props.tag.threadId.length})
			</Div>
		</Wrapper>
      </Link>
    </>
  );
};

export default Hash;
