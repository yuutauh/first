import React from 'react';
import { useHistory } from "react-router-dom";

const LeftArrow = () => {
  const history = useHistory();
  return (
	<span onClick={() => { history.goBack() }}>
        <i className="uil uil-arrow-left"></i>
  </span>
  )
}

export default LeftArrow