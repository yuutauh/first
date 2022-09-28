import React from 'react';
  

const Tag = React.memo(({ 
	tag, 
	onTags, 
	setOnTags, 
	onTagDatas,
	setOnTagDatas
}) => {
		const toggleTag = (tag) => {
			tag.toggle = false
			setOnTags(prev => [...prev, tag.data.name])
			setOnTagDatas(prev => [...prev, tag.data])
		}
	
		const offtoggleTag = (tag) => {
			tag.toggle = true
			setOnTags(onTags.filter(onTag => onTag !== tag.data.name))
			setOnTagDatas(onTagDatas.filter(onTagData => onTagData !== tag.data))
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
