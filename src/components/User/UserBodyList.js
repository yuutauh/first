import React from "react";
import { ReactComponent as BadIcon } from "../../Icons/BadIcon.svg";


const UserBodyList = React.memo(
  ({ name, threads, isEmpty, setElement, setReorder, setFavoriteIndex }) => {
    return (
      <>
        <div className="gallery-c">
          {threads.map((thread, i) => (
            <div key={i} className="gallery">
              <div className="gallery-item">
                <div className="speech-bubble-c">
                  <div className="speech-bubble">
                    <div>
                      <p>{thread.body}</p>
                      <ul>
                        <li className="gallery-item-likes">
                          <i className="ui uil-heart" aria-hidden="true"></i> 56
                        </li>
                        <li className="gallery-item-bads">
                          <BadIcon />8
                        </li>
                        <li className="gallery-item-comments">
                          <i className="uil uil-comment" aria-hidden="true"></i> 2
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isEmpty && <li>no more</li>}
        <button style={{ visibility: "hidden" }} ref={setElement}>
          load
        </button>
      </>
    );
  }
);

export default UserBodyList;
