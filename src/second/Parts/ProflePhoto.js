import React from 'react';
import './Parts.css';

const ProflePhoto = ({photo , open, setOpen}) => {
	return (
		 <div className="profile-photo" onClick={() => {setOpen((prev) => !prev)}}>
			 <img src={photo} alt="profile" />
		 </div>
	)
}

export default ProflePhoto
