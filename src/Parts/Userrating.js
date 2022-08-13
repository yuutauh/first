import React, { useState, useEffect} from 'react';
import { db } from "../firebase";
import Avatar from './Avatar';
import styled from "styled-components";

const H3 = styled.h3`
  width: fit-content;
  padding: 5px;
  border-bottom: #aaa solid 2px ;
`;

const Wrapper = styled.div` 
  display: flex;
  flex-wrap: wrap;
`

const More = styled.div` 
  color: blue;
  margin-left: auto;
  cursor: pointer;
`

const Userrating = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    db.collection("users")
      .limit(6)
      .get()
      .then((docs) => {
        const items = [];
        docs.forEach((doc) => {
          items.push(doc.data());
        });
        setUsers(items);
      });
  }, []);


  return (
    <div>
      <H3>おすすめユーザー</H3>
      <Wrapper>
      {users &&
        users.map((user, i) => (
           <Avatar key={i} user={user} width={50} height={50} />
        ))}
      <More>もっとユーザーをみる</More>
      </Wrapper>
    </div>
  );
};

export default Userrating;
