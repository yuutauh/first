import React, { useState, useEffect} from 'react';
import { auth } from '../../firebase';

export const AuthContext = React.createContext();
 
export const Auth = ({children}) => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) =>{
			setCurrentUser(user);
			setLoading(false)
		})

		return unsubscribe
	}, []);

	return (
		<AuthContext.Provider value={{currentUser}}>
			{ !loading &&  children }
		</AuthContext.Provider>
	)
}

