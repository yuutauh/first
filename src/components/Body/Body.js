import React from "react";
import styled from "styled-components";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { ja } from "date-fns/locale";

const P = styled.p`
  margin-bottom: 28px;
  text-align: center;
  color: black;
`;

const Body = ({ thread }) => {
  return (
    <div>
      <P>{thread.body}</P>
      {/* {formatDistanceToNow(thread.created.toDate(), {locale: ja})} */}
    </div>
  );
};

export default Body;
