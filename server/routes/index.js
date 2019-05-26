
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')


// API routes
const userRoutes = require('./api/user')
const contactsRoutes = require('./api/contacts')




module.exports = function (app) {


    var whitelist = ['http://localhost:3000', 'https://wafaphonebook.netlify.com']
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true
    }

    var corsOptionsDelegate = function (req, callback) {
        var corsOptions;
        if (whitelist.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
        } else {
            corsOptions = { origin: false, credentials: true } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser());
    app.use(cors(corsOptionsDelegate))

    app.get('/', (req, res) => {

        res.json({ message: 'Contact App server running' })



    }
    )

    // api middlewares 
    app.use('/api/v1/users', userRoutes)
    app.use('/api/v1/contacts', contactsRoutes)


}