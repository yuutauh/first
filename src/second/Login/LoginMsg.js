import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

const LoginMsg = () => {
	const params = useParams();
	const history = useHistory();
	const msg = params.loginmsg
    let decoded = decodeURI(msg);

	return (
		<div className="loginmsg-container">
			<h2>{decoded}</h2>
			<p onClick={() => { history.push('/') }}>ホームへ</p>
		</div>
	)
}

export default LoginMsg
