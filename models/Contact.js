const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name:  {type:String,required:true},
    last_name:  {type:String,required:true},
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    mobile_number:{
        type:String,
        required:true,
        unique:true,
        match:/^(\+\d{1,3}[- ]?)?\d{10}$/
    },
    password:{type:String,required:true},
    createdAt: Date,

});

module.exports = mongoose.model('Contact',contactSchema)
