//handles FileStorage
const multer = require('multer');

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/upload/img');
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split('/')[1];
		cb(null, `${file.fieldname} - ${Date.now()}.${ext}`);
	},
});

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new Error('Not an image! Please upload an image.', 400), false);
	}
};

module.exports = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
