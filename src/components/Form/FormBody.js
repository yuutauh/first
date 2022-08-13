import React from 'react';
import styled from 'styled-components';
import NGwords from './ngwords';

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
  
const Textarea = styled.textarea`
  background-color:transparent;
  border: none;
  resize: none;
  outline: none;
  width: 90%;
  height: 90%;
  font-family: "Sawarabi Mincho"; 
  letter-spacing: 0.5rem;
  font-size: 1.5rem;
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

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    height: 100%;
    background: rgba(255,255,255,0.5);
    transform: skewX(45deg) translateX(150px);
    transition: 0.5s;  
  }
`;


const FormBody = ({ body, 
                    inputBody,
                    DisplayBody, 
                    DisplayCanvas, 
                    setDisplayBody, 
                    setDisplayCanvas
  }) => {
  const [bodyError, setBodyError] = React.useState("");

  const validate = () => {
    let bodyError = "";
    NGwords.data.forEach((word) => {
      if(body.indexOf(word) != -1) {
        bodyError = "不適切な表現が含まれています"
      }
    })

    if(body == "") {
      bodyError = "入力必須です"
    }

    if(body.length > 200) {
      bodyError = "200字より多く入力できません"
    }

    if(bodyError) {
      setBodyError(bodyError)
      return false
    }

    setBodyError("")
    return true
  }
  
	return (
		<Container>
			<TextContainer>
				<Button>
          <span className="material-icons">navigate_before</span> 
        </Button>
				<Textarea
        placeholder="なにかつぶやいてみましょう(250字まで)"
        value={body}
        onChange={inputBody}
        />
        <div>{bodyError}</div>
        <Button  onClick={() => {
          const isValidate = validate()
          if(isValidate) {
            setDisplayBody(!DisplayBody)
            setDisplayCanvas(!DisplayCanvas)
          } else {
            return false
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

export default FormBody
