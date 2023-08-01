const JWT = require('jsonwebtoken');

const JwtAuth = (req, res, next) => {
  const token = (req.cookies && req.cookies.token) || null;
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token does not exist',
    });
  }
  try {
    const payload = JWT.verify(token, process.env.SECRET, {
      algorithms: ['HS256'], // Specify the algorithm used to sign the token (e.g., HS256)
    });
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = JwtAuth;
