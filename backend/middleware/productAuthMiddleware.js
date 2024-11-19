const jwt = require('jsonwebtoken');

const productAuthMiddleware = (optional = false) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token && !optional) {
        return res.status(403).json({ msg: 'No token, authorization denied' });
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            req.user = decoded;
        });
    }

    next();
};

module.exports = productAuthMiddleware;
