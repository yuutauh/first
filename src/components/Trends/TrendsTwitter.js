import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { functions } from "../../firebase";
import { ReactComponent as TwitterIcon } from "../../Icons/TwitterIcon.svg";

const Container = styled.div`
width: 95%;
padding: 20px;
margin: 0 auto;
background-color: white;
display: flex;
align-items: center;
justify-content: center;
`;

const TrendsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  transform: translateY(10%);
  z-index: 1;

  p {
    font-family: "Sawarabi Mincho";
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin-bottom: 2rem;
  }
`;

const TwitterSVG = styled(TwitterIcon)`
margin: 0 auto;
width: 60px;
height: 60px;
`;

const TrendsTwitter = () => {
	const [trends, setTrends] = useState([]);

	useEffect(() => {
		var gettwitter = functions.httpsCallable("getTwitter");

		gettwitter()
		  .then((res) => {
			setTrends(res.data.trends[0].trends.slice(0, 20))
		  })
		  .catch((err) => console.log(err));		
	}, [])

	console.log(trends)

	return (
		<Container>
			<TrendsContainer>
			<p>twitterのトレンド</p>
			<TwitterSVG />
			<ol>
				{trends && trends.map((t, i) => (
					<li>
						<a href={t.url} target="_blank">
							{t.name}
						</a>
					</li>
				))}
			</ol>
			</TrendsContainer>
		</Container>
	)
}

export default TrendsTwitter
