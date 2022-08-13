import React from 'react';


const Tag = ({ tag, onTags, setOnTags }) => {
	const toggleTag = (tag) => {
		tag.toggle = false
		setOnTags(prev => [...prev, tag.data.id])
	}

	const offtoggleTag = (tag) => {
		tag.toggle = true
		setOnTags(onTags.filter(onTag => onTag !== tag.data.id))
	}
	
	return (
		<>
			{tag.toggle ? (
				<p onClick={() => {toggleTag(tag)}}>
					{tag.data.name}
				</p>
				) : (
			    <p style={{color: "blue"}} onClick={() => {offtoggleTag(tag)}}>
					{tag.data.name}
				</p>
			)}
		</>
	)
}

export default Tag
