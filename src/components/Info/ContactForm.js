import React, { useState } from "react";
import './Info.css';

const ContactForm = () => {
  const [element, setElement] = useState("")
  console.log(element)
  
  return (
    <div>
       <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLScCuAp53_K5qT68PEHhvVvCY25umALi1mwBSzBDfcKD4u9uvg/viewform?embedded=true"
        width="100%"
        height="709"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
		ref={setElement}
      ></iframe> 
	  <style>
	  
      
	  </style>
    </div>
  );
};

export default ContactForm;
