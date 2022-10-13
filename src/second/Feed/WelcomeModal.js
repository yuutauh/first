import React from 'react';
import { ReactComponent as OnlytextIcon } from "../Icons/Onlytext.svg";
import { Modal } from '@mui/material';
import Box from '@mui/material/Box';
import './Modal.css';

const modalContainer = {
	width: '100%',
	height: '100%',
	bgcolor: '#e0e0e0',
}

const modalContent = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	maxWidth: '90%',
	height: '90%',
	bgcolor: '#e0e0e0',
	border: '1px solid #e0e0e0',
	boxShadow: "inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #fff",
	p: 4,
	borderRadius: '10px'
};


const WelcomeModal = ({isModal, setIsModal}) => {
  return (
	<>
	{isModal ? (
		<Modal
		open={isModal}
		onClose={setIsModal}
		>
			<Box sx={modalContainer}>
				<Box sx={modalContent}>
					<div className='modal-msg'>
                        <OnlytextIcon className='modal-icon'/>
						<h2>only text へようこそ!</h2>
						<h4>? only text とは ?</h4>
						<p className="modal-p">
							文字のみの掲示板です。<br />
							♡いいねしないと投稿者がわかりません。<br />
							誰が投稿したか、ではなく内容で評価しましょう!
						</p>
					    <button 
						className='modal-button'
						onClick={() => { setIsModal(false) }}
						>
							start!
						</button>
					</div>
				</Box>
			</Box>
		</Modal>
	) : (
		<></>
	)}
	</>
  )
}

export default WelcomeModal