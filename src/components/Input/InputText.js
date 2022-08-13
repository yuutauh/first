import React, { useState } from 'react';
import styled from "styled-components";

const Textarea = styled.textarea`
font-family: inherit;
border: 2px solid #e0e0e0;
outline: none;
resize: none;
width: 100%;
border-radius: 10px;
height: 30vh;
`;

const InputText = React.memo(({text, inputText}) => {
		return (
			<div>
				<Textarea
				placeholder="「言葉」をかく"
				value={text}
				onChange={inputText}
				/>
			</div>
		)
	}
)


export default InputText
