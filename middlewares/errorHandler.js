const errorHandler = (err, req, res, next) => {
    console.log("Error", err);
  
    //default error message and status code
    const statusCode = err.status || 500;
    const message = err.message || "Internal server error";
  
    //send response
    res.status(statusCode).json({ success: false, message });
  };
  
  module.exports = errorHandler;