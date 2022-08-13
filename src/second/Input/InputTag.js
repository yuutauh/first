import React, { useState } from 'react';
import 'react-tagsinput/react-tagsinput.css'; 
import TagList from './TagList';


const InputTag = React.memo(({
	tags, 
	setTags ,
	inputTags, 
	onTags, 
	setOnTags, 
	tagError,
	setTagError 
}) => {

	return (
		<div className="inputTag-container">
			<TagList 
			onTags={onTags} 
			setTags={setTags}
			setOnTags={setOnTags} 
			tags={tags}
			inputTags={inputTags}
			tagError={tagError}
			setTagError={setTagError} 
			/>
		</div>
	)
})

export default InputTag
