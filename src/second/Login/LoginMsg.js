import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

const LoginMsg = () => {
	const params = useParams();
	const history = useHistory();
	const msg = params.login
    let decoded = decodeURI(msg);
	

	return (
		<div className="loginmsg-container">
			<p>ようこそ</p>
			<h2>{decoded}</h2>
			<button onClick={() => { history.push('/') }}>ホームへ</button>
		</div>
	)
}

export default LoginMsg
