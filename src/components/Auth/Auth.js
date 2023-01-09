import React, { useState, useEffect} from 'react';
import { auth,fb } from '../../firebase';

export const AuthContext = React.createContext();
 
export const Auth = ({children}) => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) =>{
			if(!user) {
				fb
				.auth()
				.signInAnonymously()
				.then((user) => {
					setCurrentUser(user);
					setLoading(false)
					console.clear()
				})
			} else {
				setCurrentUser(user);
				setLoading(false)
				console.clear()
			}
		})

		return unsubscribe
	}, []);

	return (
		<AuthContext.Provider value={{currentUser}}>
			{ !loading &&  children }
		</AuthContext.Provider>
	)
}

