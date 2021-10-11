import React from 'react';

function thumbs(props) {
	const { files } = props;

	const progress = (file) => (
		<p>
			{file.status}
			<span> </span>
			{file.progress < 100 && file.progress + '%'}
		</p>
	);

	return (
		<aside className="thumbs_container">
			{files.map((file) => (
				<div key={file.name}>
					<div className="thumb">
						<div>
							<img src={file.url} alt={file.name} />
						</div>
					</div>
					{progress(file)}
				</div>
			))}
		</aside>
	);
}

export default thumbs;
