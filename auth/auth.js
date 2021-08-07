const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = (req, res, next) => {

    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, 'secret token', async(error, decodedToken) => {

            if(error) {
                res.redirect('/login')
            }
            else {

                const id = decodedToken.id
                 const user = await User.findById(id)
                req.user = user

                next()
            }

        })
    }else{
        res.redirect('/login')
    }

}

module.exports = auth