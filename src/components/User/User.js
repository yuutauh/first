import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';

const User = ({id}) => {
	const [user, setUser] = useState({})

	useEffect(() => {
		db.collection('users').doc(id).get()
		  .then((doc) => {setUser(doc.data())})
	},[])

	return (
		<div>
			{user && user.displayName}
		</div>
	)
}

export default User
