import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db, functions } from "../../firebase";
import TrendBody from "./TrendBody";
import TrendsTwitter from "./TrendsTwitter";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as FireIcon } from "../../Icons/FireIcon.svg";

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

const AirIcon = styled.span`
  margin: 0 auto;
  font-size: 60px;
`;

const FireSVG = styled(FireIcon)`
width: 60px;
height: 60px;
margin: 0 auto;
`;

const TrendsTable = () => {
  const [trends, setTrends] = useState([]);
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    db.collection("trends")
      .limit(30)
      .get()
      .then((docs) => {
        const count = {};
        const items = [];
        docs.forEach((doc) => {
          const name = doc.exists ? doc.data().name : "no data";
          const threadId = doc.exists ? doc.data().threadId : [];
          count[name] = (count[name] || "") + "," + threadId;
        });
        for (const [key, value] of Object.entries(count)) {
          const id = uuidv4();
          items.push({
            name: key,
            no: value.split(","),
            id: id,
          });
        }
        items.sort((a, b) => {
          if (a.no.length > b.no.length) {
            return -1;
          }
          if (a.no.length < b.no.length) {
            return 1;
          } else {
            return 0;
          }
        });
        setCounts(items);
      });
  }, []);

  

  return (
    <Container>
      <TrendsContainer>
        <p>ここ最近の投稿</p>
        <FireSVG />
        <p>
          trends
          <br />
          <strong>amoemo</strong> のトレンド
        </p>
        <ol>
          {counts &&
            counts.map((trend, i) => (
              <li key={i}>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/trends/${trend.name}`}
                >
                  {trend.name}({trend.no.length - 1}件の投稿)
                </Link>
              </li>
            ))}
        </ol>
      </TrendsContainer>
    </Container>
  );
};

export default TrendsTable;
