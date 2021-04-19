module.exports.sanitize = (msg) => {
	if (msg === undefined) return msg;
	if (typeof msg === 'number') return msg;

	if (typeof msg === 'object') {
		const keys = Object.keys(msg);

		keys.forEach((key, i) => {
			if (msg[key] === undefined) {
				return {};
			}

			if (i != 0) {
				msg[key] = msg[key].replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
		});
	} else {
		let cleanMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');

		return cleanMsg;
	}
};
