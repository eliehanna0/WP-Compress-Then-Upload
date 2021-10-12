import React from 'react';
import { Box, CircularProgress, Fab, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

function thumbs(props) {
	const { files } = props;

	return (
		<aside className="thumbs_container">
			{files.map((file) => (
				<div key={file.name}>
					<div className="thumb">
						<div className="loader">
							<Box position="relative" display="inline-flex">
								{file.status === 'done' && (
									<Fab className="success_check" size="small">
										<CheckIcon />
									</Fab>
								)}

								{file.status === 'uploading' && (
									<span>
										<CircularProgress
											variant="determinate"
											value={file.progress}
											size={60}
										/>
										<Box
											top={0}
											left={0}
											bottom={0}
											right={0}
											position="absolute"
											display="flex"
											alignItems="center"
											justifyContent="center"
										>
											<Typography
												variant="caption"
												component="div"
												color="textSecondary"
											>
												{`${
													file.progress
														? file.progress
														: 0
												}%`}
											</Typography>
										</Box>
									</span>
								)}
							</Box>
						</div>

						<div>
							{file.url && <img src={file.url} alt={file.name} />}
						</div>
					</div>
				</div>
			))}
		</aside>
	);
}

export default thumbs;
