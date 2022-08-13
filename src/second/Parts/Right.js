import React from 'react';

const Right = ({title, svg, items}) => {
	return (
		<div className="trends">
			<div className="heading">
				{svg}
				<h3>{title}</h3>
			</div>
			<div className="trends-body">
				{items.map((item) => (
					<div className="trend">
						<h4>
							{item.name}
						</h4>
                        <p className="text-muted text-smaller">
							{item.no.length - 1}件の投稿
						</p>
					</div>
				))}
			</div>
            <p className="text-smaller">さらに表示する</p>
		</div>
	)
}

export default Right
