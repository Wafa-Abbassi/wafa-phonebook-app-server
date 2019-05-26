const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactSchema = new Schema({


    number: {
        type: Number
    },
    description: {
        type: String
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    twitter: {
        type: String
    },
    address: {
        type: String
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    images: {
        type: Array,
        default: []
    }

}, { timestamps: true })


contactSchema.index({ '$**': 'text' })

const Contact = mongoose.model('Contact', contactSchema);
module.exports = {
    Contact
}
