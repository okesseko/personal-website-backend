const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const bearerToken = req.header("authorization") || "";
  const token = bearerToken.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Failed to authenticate token.",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send("No token");
  }
}

module.exports = authMiddleware;
