import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import RatingThread from './RatingThread';

const H3 = styled.h3`
margin: 0;
`;

const UiContainer = styled.div`
height: 60vh;
`;

const Ul = styled.ul`
    height: 100%;
	overflow-x: auto;
	white-space: nowrap;
	-ms-overflow-style: none;  
    scrollbar-width: none; 

	&::-webkit-scrollbar { 
		display:none;
	}
`;

const Li = styled.li`
display: inline-block;
width: 60%;
margin: 16px;
white-space: break-spaces;
vertical-align: middle;
`;

const More = styled.div` 
  margin-left: auto;
  color: blue;
  white-space: nowrap;
  cursor: pointer;
`

const RatingList = ({ tag }) => {
	const ratings = tag.threadId.slice(0, 10)

	return (
		<UiContainer>
			<H3>{tag.name}({tag.threadId.length})</H3>
			<Ul>
			{ratings.map((thread, i) => (
				  <RatingThread key={i} id={thread} />
			))}
			<Li>
				<More>
					<Link
				    to={{
					  pathname: `/tags/${tag.id}`,
					  state: { fromDashboard: true },
					}}
					style={{
						textDecoration: "none",
						color: "blue"
					}}>
					すべて見る
					</Link>
				</More>
			</Li>
			</Ul>
		</UiContainer>
	)
}

export default RatingList
