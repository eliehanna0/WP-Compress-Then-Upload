import React from 'react';
import {
	Box,
	CircularProgress,
	Fab,
	Typography,
	Card,
	CardMedia,
	CardContent,

	Grid
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';


function thumbs(props) {
	const { files } = props;


	
	
	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Upload Progress ({files.filter(f => f.status === 'done').length}/{files.length})
			</Typography>
			<Grid container spacing={2}>
				{files.map((file) => (
					<Grid item xs={12} sm={6} md={4} lg={3} key={file.name}>
						<Card
							sx={{
								position: 'relative',
								height: 200,
								display: 'flex',
								flexDirection: 'column'
							}}
						>
							<CardMedia
								component="img"
								image={file.url}
								alt={file.name}
								sx={{
									height: 140,
									objectFit: 'cover',
									opacity: file.status === 'uploading' ? 0.6 : 1
								}}
							/>
							<CardContent sx={{ flexGrow: 1, p: 1 }}>
								<Typography variant="caption" noWrap>
									{file.name}
								</Typography>
								<Box sx={{ position: 'absolute', top: 8, right: 8 }}>
									{file.status === 'done' && (
										<Fab
											size="small"
											sx={{
												bgcolor: 'success.main',
												color: 'white',
												width: 32,
												height: 32
											}}
										>
											<CheckIcon fontSize="small" />
										</Fab>
									)}
									{file.status === 'error' && (
										<Fab
											size="small"
											sx={{
												bgcolor: 'error.main',
												color: 'white',
												width: 32,
												height: 32
											}}
										>
											<ErrorIcon fontSize="small" />
										</Fab>
									)}
									{file.status === 'uploading' && (
										<Box sx={{ position: 'relative', display: 'inline-flex' }}>
											<CircularProgress
												variant="determinate"
												value={file.progress || 0}
												size={32}
												sx={{ color: 'primary.main' }}
											/>
											<Box
												sx={{
													top: 0,
													left: 0,
													bottom: 0,
													right: 0,
													position: 'absolute',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Typography
													variant="caption"
													component="div"
													color="text.secondary"
													sx={{ fontSize: '0.7rem' }}
												>
													{`${file.progress || 0}%`}
												</Typography>
											</Box>
										</Box>
									)}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default thumbs;
