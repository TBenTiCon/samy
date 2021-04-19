module.exports.preventInjection = (msg) => {
	let cleanMsg = msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');

	return cleanMsg;
};
