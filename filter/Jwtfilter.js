const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken) {
        const token = authToken.split(' ')[1];
        jwt.verify(token, process.env.PASSPHRASE, (err, user) => {
            if (err) return res.status(403).json('Token is invalid');
            req.user = user;
            next();
        });
    } else {
        res.status(401).json('You are not logged in');
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('FORBIDDEN');
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('Permission Denied');
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyAdmin };
