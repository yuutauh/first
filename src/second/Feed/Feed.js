import React from 'react';
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import { Link, useParams } from 'react-router-dom';
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const Feed = ({ 
	i,
	body, 
	created,
	id, 
	tagname, 
	userimage, 
	username 
}) => {
	
	return (
		<div key={i} className="feed">
			<div className="head mosaic">
				<div className="profile-photo">
                    <img src={userimage} alt="unsplash" />
                </div>
                <div className="ingo">
                    <h3>{username}</h3>
                </div>
			</div>
			<div className="tags">
				{tagname.map((tag,i) => (
					<Link 
					key={i}
					to={{
						pathname: `/tags/${tag}`,
						state: { fromDashboard: true }
					}}>
					   <div className="tag">{tag}</div>
					</Link>
				))}
			</div>
			<div className="msg-container">
				<Link
				to={{
					pathname: `/body/${id}`,
					state: { fromDashboard: true },
				}}>
					<p className="msg">
					{body}
					</p>
				</Link>
			</div>
			<small>
			  {format(created.toDate(), "yyyy-MM-dd HH:mm", {locale: ja})}
			</small>
			<div className="action-buttons">
			    <span><i className="uil uil-heart"></i></span>
				<BadIcon />
				<span><i className="uil uil-comment"></i></span>
			</div>
			<div className="comments text-muted">コメントをみる</div>
		</div>
	)
}

export default Feed
