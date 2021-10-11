import React from 'react';

function thumbs(props) {
	const { files } = props;

	const progress = (file) => (
		<p>
			<span> </span>
			{file.progress + '%'}
		</p>
	);

	return (
		<aside className="thumbs_container">
			{files.map((file) => (
				<div key={file.name}>
					<div className="thumb">
						<div>
							{file.url && <img src={file.url} alt={file.name} />}
						</div>
					</div>
					<p>{file.status}</p>
					{file.progress < 100 && progress(file)}
				</div>
			))}
		</aside>
	);
}

export default thumbs;
