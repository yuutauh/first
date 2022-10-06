import React from "react";
import { AuthContext } from '../../components/Auth/Auth';


const InputText = React.memo(({
	currentUser,
	tags, 
    onTags, 
	text, 
	inputText
	}) => {

		return (
			<div className="inputtext-container">
				<div className="tags">
					{[...tags, ...onTags].slice(0,5).map((tag,i) => (
						<div key={i} className="tag">{tag}</div>
					))}
				</div>
				<div className="textarea-c">
                    <img src={currentUser.photoURL} alt="profile-image" />
					<div className="input-textarea-c">
						<textarea
						placeholder="文字だけで思いを伝えてみましょう"
						value={text}
						onChange={inputText}
						/>
					</div>
				</div>
			</div>
		)
	}
)


export default InputText
