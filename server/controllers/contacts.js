const { Contact } = require('../models/Contact')
const { User } = require('../models/User')
const cloudinary = require('cloudinary');
const config = require('../config/index')



cloudinary.config({
    cloud_name: config.CD_CLOUD_NAME,
    api_key: config.CD_CLOUD_API_KEY,
    api_secret: config.CD_CLOUD_API_SECRET
});



const CDphotoupload = async function (req, res) {


    // uploading all images at once
    let filesForUpload = []
    for (const key in req.files) {
        if (req.files.hasOwnProperty(key)) {
            const element = req.files[key];
            filesForUpload.push(element)
        }
    }
    // res_promises will be an array of promises
    let res_promises = filesForUpload.map(file => new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(file.path, { use_filename: true, unique_filename: false, timeout: 120000 }, function (error, result) {

            if (error) reject(error)
            else resolve({ public_id: result.public_id, url: result.secure_url })
        })
    })
    )
    // Promise.all will fire when all promises are resolved 
    Promise.all(res_promises)
        .then((results) => {

            res.status(200).send({
                success: true,
                results: results
            })

        })
        .catch((err) => {
            console.log(err)
        })



}



const CDimagedelete = (req, res) => {

    const { imageId, contactId } = req.params;

    Contact.findOneAndUpdate({ _id: contactId }, { $pull: { 'images': { public_id: imageId } } }, { upsert: true, new: true }, (err, updatedContact) => {

        if (err) return res.json({ succes: false });
        res.status(200).send({ success: true, contact: updatedContact });

    })
    cloudinary.uploader.destroy(imageId, (error, result) => {
        if (error) {
            console.log(error)
        }

    })



}



const getSingleContact = (req, res) => {



    Contact.findOne({ user: req.user._id, _id: req.params.contactId })
        .then((contact) => {
            res.status(200).json({
                success: true,
                contact: contact
            })

        })


}

const createContact = (req, res) => {

    const { number, name, description = "no description", lastname = "no lastname", email = "no email", address = "no address", company = "no company", twitter = "no twitter", images } = req.body;

    const newContact = new Contact({
        number,
        name,
        lastname,
        description,
        email,
        address,
        company,
        twitter,
        images,
        user: req.user._id
    })


    newContact.save((err, contact) => {


        res.status(200).send({
            success: true,
            contact: contact
        })


    })





}

const editContact = (req, res) => {

    const { contactId, data } = req.body;


    Contact.findOneAndUpdate({ user: req.user._id, _id: contactId }, { $set: data }, { new: true }, (err, updated) => {

        res.status(200).send({
            success: true
        })
    })



}
const deleteContact = (req, res) => {

    const { contactId } = req.body;

    Contact.findOneAndDelete({ _id: contactId, user: req.user._id }, (err) => {

        res.status(200).send({
            success: true
        })
    })




}
const getContacts = async function (req, res) {

    const { filters = {} } = req.body;


    let ITEMS_PER_PAGE = 15;
    let page = req.body.page || 1;
    let totalItems;
    let findArgs = {}
    let sortArgs = {
        createdAt: 1,
        name: 1
    }


    if (filters.name) {

        findArgs = {
            // $text: {
            //     $search: filters.name,
            //     $caseSensitive: false
            // },
            'name': { '$regex': new RegExp('^' + filters.name + '$', "i"), '$options': 'i' }

        }

    }

    for (let key in filters) {
        if (filters.hasOwnProperty(key)) {
            const element = filters[key];

            if (key === 'date') {
                sortArgs.createdAt = element
            }

            if (key === 'sortName') {
                sortArgs.name = element
            }

        }
    }



    Contact
        .countDocuments()
        .then((count) => {

            totalItems = count
            return Contact
                .find({ ...findArgs, user: req.user._id })
                .populate('user')
                .sort(sortArgs)
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)


        })

        .then((contacts) => {


            res.status(200).json({
                success: true,
                totalItems: contacts.length,
                contacts: contacts,
                currentPage: page,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                hasPreviousPage: page > 1,
                hasNextPage: ITEMS_PER_PAGE * page < contacts.length

            })

        })

}

module.exports = {
    createContact,
    deleteContact,
    CDphotoupload,
    CDimagedelete,
    editContact,
    getSingleContact,
    getContacts
}