const errorHandler = (err, req, res, next) => {
	console.error(err.stack);

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const errors = Object.values(err.errors).map((val) => val.message);
		return res.status(400).json({
			success: false,
			message: "Validation Error",
			errors,
		});
	}

	// Mongoose duplicate error
	if (err.code === 11000) {
		return res.status(400).json({
			success: false,
			message: "Duplicate field value entered",
			field: Object.keys(err.keyValue)[0],
		});
	}

	//JWT Errors
	if (err.name === "JsonWebTokenError") {
		return res.status(401).json({
			success: false,
			message: "Invalid Token",
		});
	}
	if (err.name === "TokenExpiredError") {
		return res.status(401).json({
			success: false,
			message: "Token Expired",
		});
	}

	// Default to 500 server error
	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Server Error",
		error: process.env.NODE_ENV === "development" ? err : {},
	});
};

module.exports = errorHandler;
