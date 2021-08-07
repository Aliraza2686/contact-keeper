const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name : {
      type : String,
      required : true,
      trim : true
  },
  email : {
     type : String,
     trim : true,
     required : true
  },
  phone : {
      type : String,
      trim : true,
      required : true
  },
  type : {
      type : String,
      default : 'personal'
  },
  createdAt : {
      type : Date,
      default : Date.now
  },
  user : {
      type : mongoose.Schema.Types.ObjectId,
      required : true
  }  
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact