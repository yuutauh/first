import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

const LoginMsg = () => {
	const params = useParams();
	const history = useHistory();
	const msg = params.login
    let decoded = decodeURI(msg);
	console.log(decoded)

	return (
		<div className="loginmsg-container">
			<h2>{decoded}</h2>
			<p onClick={() => { history.push('/') }}>ホームへ</p>
		</div>
	)
}

export default LoginMsg
