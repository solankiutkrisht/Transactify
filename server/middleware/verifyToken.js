const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.cookie;
  if (!authHeader) {
    res.status(401).send({ error: "Unauthorized Access!" });
  }
  const token = authHeader.split("=")[1];
  await jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      res.status(403).send({ error: "Access is Forbidden!" });
    }
    req.user = user.id;
  });
  next();
};

module.exports = verifyToken;
