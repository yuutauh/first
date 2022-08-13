import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  cursor: pointer;
`;

const OnWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  color: brown;
  cursor: pointer;
`;
  
const Span = styled.span`
  font-size: 12px;
`;

const Div = styled.div`
  white-space: nowrap;  
  margin-right: 3rem;
`;

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
					<Wrapper onClick={() => {toggleTag(tag)}}>
						<Span className="material-icons">tag</Span>
						<Div>
						  {tag.data.name}
						</Div>
					</Wrapper>
					) : (
					<OnWrapper onClick={() => {offtoggleTag(tag)}}>
						<Span className="material-icons">tag</Span>
						<Div>
						  {tag.data.name}
						</Div>
						<Div>選択されています...</Div>
					</OnWrapper>
				)}
			</>
		)
})
	

export default Tag
