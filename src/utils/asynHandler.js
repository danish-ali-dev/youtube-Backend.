const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);        // wraper function to handle async errors
    } catch (error) {                      // catch any error and send response with error message and status code
        res.status(error.code || 500).json({
             success: false, 
             message: error.message
            });
    }
};

export { asyncHandler };

// (func) => () => {}
// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)). 
//         catch((error) => next(error))
//     }
// } 