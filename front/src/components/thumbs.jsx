import React from 'react';

function thumbs(props) {
	const { files } = props;
	return (
		<aside className="thumbs_container">
			{files.map((file) => (
				<div className="thumb" key={file.name}>
					<div>
						<img src={file.url} />
					</div>
				</div>
			))}
		</aside>
	);
}

export default thumbs;
