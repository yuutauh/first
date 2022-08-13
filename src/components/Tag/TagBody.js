import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const DisplayBody = styled.div`
margin-top: 40px;
margin-bottom: 40px;
`;

const BodyText = styled.div`
  margin: 0 auto;
  word-break: break-all;
`;


const TagBody = React.memo(({thread}) => {
		
	return (
		<div>
	      <DisplayBody>
			<Link  
			to={{
			  pathname: `/body/${thread.id}`,
			  state: { fromDashboard: true }
			}} 
			style={{
			  textDecoration: 'none',
		      color: 'black',
			}}>
			<BodyText>
			  <p>{thread.body}</p>	
			  <div style={{ textAlign: "end" }}>
				{format(thread.created.toDate(), "yyyy-MM-dd HH:mm", {locale: ja,})}
			  </div>	
			</BodyText>
			</Link>
	      </DisplayBody>
		</div>
	)
}) 

export default TagBody
