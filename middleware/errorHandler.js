module.exports.handleError = (err, res) => {
	console.log('error handler reached!');

	try {
		//check if Email already exists
		if (err.code === 11000) {
			console.log('Email is already registered');
			res.json({ status: 'that email is already registered' });
		}

		//check for hashing Problems
		else if (err.message.includes('hashingError')) {
			console.log('Failed to hash Password');
			res.status(401).json({ status: 'hashingFailed' });
		}

		//check for incorrect password
		else if (err.message.includes('incorrect password')) {
			console.log('incorrect password');
			res.status(401).json({ status: 'incorrect password' });
		}

		//check for valid email
		else if (err.message.includes('user validation failed: email')) {
			console.log('invalid email');
			res.status(401).json({ status: 'invalid email' });
		}

		//check for incorrect email
		else if (err.message === 'incorrect email') {
			res.status(401).json({ error: 'incorrect email' });
		}

		//check for permission & Token validation
		else if (err.message.includes('no permission')) {
			console.log('No permission to access Resource');
			res.status(401).json({ status: 'No Permission' });
		} else if (err.message.includes('missing token')) {
			console.log('Missing Token');
			res.status(401).json({ status: 'No Permission' });
		} else if (err.message.includes('invalid token')) {
			console.log('Invalid Token');
			res.status(401).json({ status: 'Invalid Token' });
		} else if (err.message.includes('invalid signature')) {
			console.log('Invalid Signature');
			res.status(401).json({ status: 'Invalid Token' });
		}

		//search User error
		else if (err.message.includes('findUserErr')) {
			console.log('Could not find User in DB');
			res.status(401).json({ status: 'Could not find User in DB' });
		}

		//token format error
		else if (err.message.includes('jwt malformed')) {
			console.log('jwt malformed');
			res.status(401).json({ status: 'wrong token format' });
		}

		//token format error
		else if (err.message.includes('Unexpected token')) {
			console.log('Unexpected token');
			res.status(401).json({ status: 'wrong token format' });
		}

		//token format error
		else if (err.message.includes('jwt must be provided')) {
			console.log('jwt must be provided');
			res.status(401).json({ status: 'Invalid Token' });
		}

		//check for permission
		else {
			console.log(err);
			res.status(401).json({ status: err.message });
		}
	} catch (err) {
		console.log('preventing double Header');
	}
};
