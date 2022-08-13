import React, { useState, useCallback, useContext } from 'react';
import { AuthContext } from '../Auth/Auth';
import { CSSTransition } from 'react-transition-group';
import FormBody from './FormBody';
import FormCanvas from './FormCanvas';
import FormComplete from './FormComplete';
import FormTag from './FormTag';
import './form.css';

const FormContainer = () => {
	const { currentUser }  = useContext(AuthContext);
	const [DisplayBody, setDisplayBody] = useState(true);
	const [DisplayCanvas, setDisplayCanvas] = useState(false);
	const [DisplayTag, setDisplayTag] = useState(false);
	const [DisplayComplete, setDisplayComplete] = useState(false);
	const [body, setBody] = useState("");
	const [trends, setTrends] = useState([]);
	const [tags, setTags] = useState([]);
	const [onTags, setOnTags] = useState([])
	const inputBody = useCallback((e) => { setBody(e.target.value) }, [setBody])
	const inputTags = useCallback((tags) => { setTags(tags) }, [setTags])

	const show = () => {
		return (
			<div>
			<CSSTransition
			in={DisplayBody}
			timeout={500}
			classNames={'form-body'}
			appear={true}
			unmountOnExit
			>
				<FormBody 
				body={body} 
				inputBody={inputBody} 
				DisplayBody={DisplayBody}
				DisplayCanvas={DisplayCanvas}
				setDisplayBody={setDisplayBody}
				setDisplayCanvas={setDisplayCanvas}
				/>
			</CSSTransition>

			<CSSTransition
			in={DisplayCanvas}
			timeout={500}
			classNames={'form-canvas'}
			unmountOnExit
			mountOnEnter={true}
			>
				<FormCanvas 
				body={body}
				trends={trends} 
				setTrends={setTrends}
				DisplayBody={DisplayBody}
				DisplayCanvas={DisplayCanvas}
				DisplayTag={DisplayTag}
				setDisplayBody={setDisplayBody}
				setDisplayCanvas={setDisplayCanvas}
				setDisplayTag={setDisplayTag}
				/>
			</CSSTransition>

			<CSSTransition
			in={DisplayTag}
			timeout={500}
			classNames={'form-tag'}
			unmountOnExit
			mountOnEnter={true}
			>
				<FormTag
				tags={tags}
				onTags={onTags}
				inputTags={inputTags}
				DisplayCanvas={DisplayCanvas}
				DisplayTag={DisplayTag} 
				DisplayComplete={DisplayComplete}
				setOnTags={setOnTags}
				setDisplayCanvas={setDisplayCanvas}
				setDisplayTag={setDisplayTag}
				setDisplayComplete={setDisplayComplete}
				/>
			</CSSTransition>
			
			<CSSTransition
			in={DisplayComplete}
			timeout={500}
			classNames={'form-complete'}
			unmountOnExit
			mountOnEnter={true}
			>
				<FormComplete
				body={body}
				trends={trends}
				tags={tags}
				onTags={onTags}
				/>
			</CSSTransition>
			</div>
		)
	}

	return (
		<>
		{currentUser ? (
			<>
			{currentUser.isAnonymous ? (
				<div>ppp</div>
			) : (
				<>{show()}</>
			)}
			</>
		) : (<div>pppnologin</div>)}
		</>
	)
}

export default FormContainer
