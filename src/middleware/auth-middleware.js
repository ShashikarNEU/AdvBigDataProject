const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
  });
};

const verifyToken = async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "Failed to validate user", status: "Failed" });

      const token = authHeader.split(" ")[1];

      jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
          if (err) return res.status(401).json({ message: "Invalid token" });
          req.user = decoded;
          next();
      });
  } catch (error) {
      res.status(500).json({ message: "Auth error", error });
  }
};

module.exports = { verifyToken };
