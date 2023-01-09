import React from "react";
import AnonymousImage from'../Parts/anonymous.png';


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
                    <img src={currentUser.isAnonymous == true ? AnonymousImage : currentUser.photoURL} alt="profile-image" />
					<div>
						<p>{currentUser.isAnonymous == true ? 'とくめいさん' : currentUser.displayName}</p>
						<div className="input-textarea-c">
							<textarea
							placeholder="文字だけで思いを伝えてみましょう"
							value={text}
							onChange={inputText}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
)


export default InputText
