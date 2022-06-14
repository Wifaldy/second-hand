const handleError = (err, req, res, next) => {
      if (err.status != undefined) {
        res.status(err.status).json({
            status: err.status,
          message: err.message,
        });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
      });
    };
    
    module.exports = handleError;
  