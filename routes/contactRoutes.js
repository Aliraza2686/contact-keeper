const express = require('express')
const auth = require('../auth/auth')
const Contact = require('../models/contactModel')

const router = express.Router()

//add contact @route GET
router.get('/add/contact', (req, res) => {
    res.render('addContact')
})

//add contact @route POST
router.post('/add/contact', auth, async(req, res) => {

    const { name, email, phone, type } = req.body

    try {
         const contact = new Contact({
             name,
             email,
             phone,
             type,
             user : req.user.id
         })

         await contact.save()

         req.flash('success', 'Contact has been added')
         res.redirect('/dashboard')

    }catch(error) {

        req.flash('error', `Cannot add contact because`)

        res.redirect('/add/contact')

    }

})


//dashboard @route GET
router.get('/dashboard', auth, async(req, res) => {

     const contacts = await Contact.find({user : req.user.id}).sort({
         createdAt : -1
     })

     //finding personal contacts
     const personalContacts = await Contact.find({user : req.user.id, type : 'personal'})

     const personal = personalContacts.length

     //finnding proffessional contacts
     const profContacts = await Contact.find({user : req.user.id, type : 'proffessional'})

     const proffessional = profContacts.length

     const total = contacts.length

    res.render('dashboard', {
        user : req.user,
        contacts,
        total,
        personal,
        proffessional
    })
})

//delete contact @route DELETE
router.delete('/delete/contact/:id', auth, async(req, res) => {

    const id = req.params.id

    try {

        const contact = await Contact.findByIdAndDelete(id)

        req.flash('success', 'Contact has been deleted')

        res.redirect('/dashboard')

    }catch(error) {

       req.flash('error', 'Cannot delete the contact')

       res.redirect('/dashboard')

    }

})

//update contact @route GET
router.get('/update/contact/:id', auth, async(req, res) => {
    const contact = await Contact.findById(req.params.id)

    res.render('updateContact', {
        user : req.user,
        contact
    })
})

//update contact @route PUT
router.put('/update/:id', auth, async(req, res) => {

    const id = req.params.id

    try {

         const contact = await Contact.findByIdAndUpdate(id, req.body, {
             new : true,
             runValidators : true
         })

         await contact.save()

         req.flash('success', 'Contact has been updated')

         res.redirect('/dashboard')
    }catch(error) {

        req.flash('error', 'Cannot update this contact')

        res.redirect('/dashboard')
    }

})
module.exports = router