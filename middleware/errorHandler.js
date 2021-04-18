const handleError = (err, res) => {
	if (err.code === 11000) {
		console.log('Email is already registered');
		res.json({ status: 'that email is already registered' });
	}

	if (err.message.includes('no permission')) {
		console.log('No permission to access Resource');
		res.status(401).json({ status: 'No Permission' });
	}

	if (err.message.includes('missing token')) {
		console.log('Missing Token');
		res.status(401).json({ status: 'No Permission' });
	}

	if (err.message.includes('invalid token')) {
		console.log('Invalid Token');
		res.status(401).json({ status: 'Invalid Token' });
	}
};
