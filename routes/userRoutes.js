const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')
const auth = require('../auth/auth')

const router = express.Router()

//register @route GET
router.get('/', (req, res) => {

    res.render(('register'))
})

//register @route POST
router.post('/', async(req, res) => {

    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 8)

    try {

        const user = new User({
            name,
            email,
            password : hashedPassword
        })

        await user.save()
  
        req.flash('success', 'Account successfully created now you can login')
   
        res.redirect('/login')

    }catch(error) {
        if(error.code === 11000){
            req.flash('error', 'That email already exist')
        }else {
            req.flash('error', 'invalid credentials try  diffrent ')
        }
       
       res.redirect('/')
    }
})

//login @route GET
router.get('/login', (req, res) => {
    res.render('login')
})

//login @route POST
router.post('/login', async(req, res) => {

    const  { email, password } = req.body

    try{

        const user = await User.findOne({email : email})

        if(!user) {
            req.flash('error', 'invalid email')
            return res.redirect('/login')
        }
            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                req.flash('error', 'invalid password')
               return  res.redirect('/login')
            }

            const token = jwt.sign({id : user.id}, 'secret token')

            res.cookie('jwt', token, {httpOnly : true})

            res.redirect('/dashboard')

        
    }catch(error) {
  
        req.flash('error', 'Cannot find any user with these credentials')
        res.redirect('/login')
    }

})

//logout @route GET
router.get('/logout', auth, (req, res) => {

    res.cookie('jwt', '', {httpOnly : true})

    req.flash('success', 'you are now logout')

    res.redirect('/login')

})

module.exports = router