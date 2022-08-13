import React from 'react';
import './Parts.css';

const ProflePhoto = ({photo}) => {
	return (
		 <div className="profile-photo">
			 <img src={photo} alt="profile" />
		 </div>
	)
}

export default ProflePhoto
