import React, { useEffect, useRef, useState, useCallback } from 'react';
import { db } from '../../firebase';
import styled from 'styled-components';
import TagsInput from 'react-tagsinput';
import TagList from './TagList';
import 'react-tagsinput/react-tagsinput.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NGwords from './ngwords';
import { validate } from 'uuid';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f3e9d7;
`;

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90%;
`;

const MContainer = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f3e9d7;
`;

const TagContainer = styled.div`
  width: 60%;
  height: 50%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
	display: none;
  }
`;

const Button = styled.button`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  border: 1px solid rgba(255,255,255,0.4);
  border-right: 1px solid rgba(255,255,255,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(2px);
  transition: 0.5s;
  margin: 0 1rem;

 
`;


const FormTag = ({
	tags,
	inputTags,
	onTags,
	DisplayCanvas,
	DisplayTag, 
	DisplayComplete,
  setOnTags,
	setDisplayCanvas,
	setDisplayTag,
	setDisplayComplete
}) => {
  const [tagError, setTagError] = useState("");

  const validate = () => {
    let tagError = "";
    tags.forEach((tag) => {
      NGwords.data.forEach((word) => {
        if(tag.indexOf(word) !== -1) {
          tagError = "不適切な表現が含まれています"
        }
      })
    })

    if( tags.length + onTags.length > 4 ) {
      tagError = "付けられるタグは４つまでです"
    }

    if(tagError) {
      setTagError(tagError)
      return false
    }

    return true
  }

	return (
		<Container>
			<TextContainer>
			  <Button
				  onClick={() => {
					setDisplayCanvas(!DisplayCanvas)
					setDisplayTag(!DisplayTag)
				}}
				>
          <span className="material-icons">navigate_before</span> 
        </Button>
				<MContainer>
					<TagsInput value={tags} onChange={inputTags} />
          <div>{tagError}</div>
					<TagContainer>
						<TagList onTags={onTags} setOnTags={setOnTags} />
					</TagContainer>
				</MContainer>
				<Button
				onClick={() => {
          const isValidate = validate()
          if (isValidate) {
            setDisplayTag(!DisplayTag)
            setDisplayComplete(!DisplayComplete)
            console.log("問題なし")
          } else {
            console.log("validate")
          }
				}}
				>
				  <span className="material-icons">
                    navigate_next
          </span>
		 		</Button>
			</TextContainer>
		</Container>
	)
}

export default FormTag
