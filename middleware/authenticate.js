const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if (req.headers.hasOwnProperty('token')) {
        jwt.verify(req.headers.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    msg: err.message
                })
            } else {
                console.log(decoded);
                req.loggedUser = decoded
                next()
            }
        })
    } else {
        res.status(401).json({
            msg: 'you have to login first'
        })
    }
}