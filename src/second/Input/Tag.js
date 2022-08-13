import React from 'react';
import styled from 'styled-components';
  

const Tag = React.memo(({ tag, onTags, setOnTags, add, clear, untags }) => {
		const toggleTag = (tag) => {
			tag.toggle = false
			setOnTags(prev => [...prev, tag.data.name])
		}
	
		const offtoggleTag = (tag) => {
			tag.toggle = true
			setOnTags(onTags.filter(onTag => onTag !== tag.data.name))
		}
		
		return (
			<>
				{tag.toggle ? (
					<div  className="unselected tag" onClick={() => {toggleTag(tag)}}>
						  {tag.data.name}
					</div>
					) : (
					<div className="tag" onClick={() => {offtoggleTag(tag)}}>
						  {tag.data.name}
					</div>
				)}
			</>
		)
})
	

export default Tag
