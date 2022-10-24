import React from 'react';
import MetaDecorator from '../Meta/MetaDecorator';

const ErrorPage = () => {
	return (
		<div>
			<MetaDecorator 
			title={ "404 - onlytext"} 
			description={"error"} 
			/>
			<h2>404</h2>
			<p>Sorry, the page you're looking con not found.</p>
		</div>
	)
}

export default ErrorPage
