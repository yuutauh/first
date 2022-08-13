import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
// import { ReactComponent as SendIcon } from '../../Icons/SendIcon.svg';
// import AddBody from '../method/AddBody';



// const StyledIcon = styled(SendIcon)`
//   position: relative;
//   width: 80px;
//   height: 80px;
//   margin: 10px;
//   border-radius: 10px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border: 1px solid rgba(0, 0, 0, 0.4);
//   border-right: 1px solid rgba(0, 0, 0, 0.2);
//   border-bottom: 1px solid rgba(0, 0, 0, 0.2);
//   box-shadow: 0 5px 45px rgba(0, 0, 0, 0.1);
//   backdrop-filter: blur(2px);
//   transition: 0.5s;

//   &:hover {
// 	  transform: translateY(-10%);
//   }

//   &:before {
// 	  content: '';
// 	  position: absolute;
// 	  top: 0;
// 	  left: 0;
// 	  width: 50px;
// 	  height: 100%;
// 	  background: rgba(255,255,255,0.5);
//   }
// `;

const FormSubmit = () => {
	const [body, setBody] = useState("");

	const inputBody = useCallback((e) => { setBody(e.target.value) }, [])
	
	return (
		<div>
			
			{/* <StyledIcon  onClick={() => {AddBody(body)} }/>  */}
		</div>
	)
}

export default FormSubmit
