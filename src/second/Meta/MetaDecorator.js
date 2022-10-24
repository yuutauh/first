import React from "react";
import {Helmet} from "react-helmet";
import metaImage from "./twitter-card.png";

const MetaDecorator = ({title, description}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title}/>
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={window.location.pathname + window.location.search}/>
      <meta name="twitter:card" content="summary"/>
    </Helmet>
  );
};
export default MetaDecorator;
