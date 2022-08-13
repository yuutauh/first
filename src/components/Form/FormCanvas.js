import React from 'react';
import axios from 'axios';

const FormCanvas = ({
	 body,
	 trends, 
	 setTrends, 
	 DisplayBody, 
	 DisplayCanvas, 
	 DisplayTag,
	 setDisplayBody, 
	 setDisplayCanvas,
   setDisplayTag
	}) => {

  const key = process.env.REACT_APP_NATURAL_LANGUAGE_API_KEY
	const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`;

  const getEntities = () => {
    axios.post(url, 
      {
        "document": {
          "type": "PLAIN_TEXT",
          "language": "JA",
          "content": body
      }
    }).then((res) => {
       const p =  res.data.entities.map((i) => (i.name))
       setTrends(p)
    })
  }
  
  console.log(trends)

	return (
		<div>
      <p onClick={() => {
        // getEntities()
        setDisplayCanvas(!DisplayCanvas)
        setDisplayTag(!DisplayTag)
      }}>trends</p>
    </div>
	)
}

export default FormCanvas
