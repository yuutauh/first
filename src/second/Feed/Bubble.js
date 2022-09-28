import React from 'react';
import { ReactComponent as BadIcon } from "../Icons/BadIcon.svg";
import { ReactComponent as LoveIcon } from "../Icons/LoveIcon.svg";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Link } from 'react-router-dom';

const Bubble = ({
	body, 
	userimage,
	created,
	id,
	favoriteCount,
	badCount
}) => {
  return (
	<div className='bubble-c-c'>
		<div className='bubble-c'>
			<div>
			  <img src={userimage} alt="userimage" className='mosaic' /> 
			</div>
			<div className='bubble'>
				<Link
				to={{
					pathname: `/body/${id}`,
					state: { fromDashboard: true },
				}}>
				<div className='bubble-msg'>
					{body}
					<div className="bubble-action-buttons">
						<div className="bubble-action-button text-muted">
					        {formatDistanceToNow(created.toDate()) + "ago"}
						</div>
						<div className='bubble-action-button'>
							<LoveIcon />
							<span className='bubble-numbar text-muted'>
								{favoriteCount}
							</span>
						</div>
						<div className='bubble-action-button'>
							<BadIcon />
							<span className='bubble-numbar text-muted'>
								{badCount}
							</span>
						</div>
						{/* <div className='bubble-action-button'>
							<span><i className="uil uil-comment"></i></span>
							<span className='bubble-numbar text-muted'>6</span>
						</div> */}
					</div>
				</div>
				</Link>
			</div>
		</div>
	</div>
  )
}

export default Bubble

