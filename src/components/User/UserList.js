import React, { useState, useEffect } from 'react';
import User from './User'

const UserList = ({following, followed}) => {
	const [userIds, setUserIds] = useState([])

	useEffect(() => {
		if(following) {
			const items = [];
			following.forEach((fo) => {
				items.push(fo.followed)
			})
			setUserIds(items)
		}
	}, [following])

	useEffect(() => {
		if(followed){
			const items = [];
			followed.forEach((fo) => {
				items.push(fo.following)
			})
			setUserIds(items)
		}
	}, [followed])

	return(
		<div>
			{userIds && userIds.map((userId, i) => (
				<User key={i} userId={userId} />
			))}
		</div>
	)
}

export default UserList;