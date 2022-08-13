import React, { useContext } from "react";
import { AuthContext } from '../../components/Auth/Auth';


const InputText = React.memo(({tags, onTags, text, inputText}) => {
	const { currentUser }  = useContext(AuthContext);

		return (
			<div className="inputtext-container">
				<div className="head">
					<div className="profile-photo">
						<img src={currentUser.photoURL} alt="unsplash" />
					</div>
					<div className="ingo">
						<h3>{currentUser.displayName}</h3>
					</div>
				</div>
				<div className="tags">
					{[...tags, ...onTags].slice(0,5).map((tag,i) => (
						<div key={i} className="tag">{tag}</div>
					))}
				</div>
				<div className="msg-container">
					<textarea
					placeholder="「言葉」をかく"
					value={text}
					onChange={inputText}
					/>
				</div>
			</div>
		)
	}
)


export default InputText
