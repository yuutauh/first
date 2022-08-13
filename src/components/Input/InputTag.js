import React from 'react';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; 
import TagList from './TagList';

const P = styled.p`
width: fit-content;
padding: 2px;
border-bottom: #aaa solid 2px;
`;

const InputTag = React.memo(({tags, setTags ,inputTags, onTags, setOnTags}) => {

	return (
		<div>
			<TagList 
			onTags={onTags} 
			setTags={setTags}
			setOnTags={setOnTags} 
			tags={tags}
			inputTags={inputTags} 
			/>
			<P>{tags + onTags}</P>
		</div>
	)
})

export default InputTag
