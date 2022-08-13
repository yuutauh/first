import React, { useState, useEffect} from 'react';
import { ReactComponent as TimeIcon } from "../Icons/TimeIcon.svg";
import { db } from '../firebase';
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import styled from "styled-components";

const Li = styled.li`
display: inline-block;
height: 80%;
width: 80%;
padding: 30px;
margin-right: 16px;
white-space: break-spaces;
vertical-align: middle;
`;

const Center = styled.div`
width: 100%;
height: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const TimeSVG = styled(TimeIcon)`
  color: rgb(83, 100, 113);
  width: 15px;
  height: 15px;
  margin-right: 10px;
`;

const RatingThread = ({ id }) => {
	const [thread, setThread] = useState({});

	useEffect(() => {
		db.collection('threads').doc(id).get()
		  .then((doc) => {
			setThread(doc.exists ? doc.data() : {body: "no data"})
		  })
	}, [])

	return (
		<>
		{thread.id && 
		　<Li>
			<Center>
			  <div>
				<Link
				to={{
					pathname: `/body/${thread.id}`,
					state: { fromDashboard: true },
				}}
				style={{
					textDecoration: "none",
					color: "black",
				}}
				>
					{thread.body}
					<div style={{
						textAlign: "end", 
						color: "rgb(83, 100, 113)",
						marginTop: "20px" 
					}}>
						<TimeSVG />
						{format(thread.created.toDate(), "yyyy-MM-dd HH:mm", {
							locale: ja,
						})}
					</div>
				</Link>
			  </div>
			</Center>
		　</Li>	
		}
		</>
	)
}

export default RatingThread
