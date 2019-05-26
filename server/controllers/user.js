const { User } = require('../models/User');
const { getAccountkitData } = require('../services/facebookAccountkit')


const accountkitLogin = function (req, res) {



    // call accountkit service function and get phonenumber and access token


    getAccountkitData(req.body.code, (phone) => {




        User.findOne({ 'phone.email': phone }, (err, user) => {

            if (!user) {

                const user = new User({

                    phone: {
                        email: phone

                    }

                })

                user.save((err, userDoc) => {
                    if (err) { return res.json({ success: false, errors: true }) }

                    // res.status(200).json({ success: true })
                    userDoc.generateToken((err, user) => {


                        if (err) {
                            return res.status(400).send(err)
                        }


                        res.send({ loginSuccess: true, token: user.token })

                    })
                })
            } else {
                res.send({ loginSuccess: true, token: user.token })
            }









        })





    })




}

const register = function (req, res) {

    let { email, password, username } = req.body;

    if (!email || !password) {
        return res.status(422).send({ errors: [{ title: 'Data missing!', detail: 'Provide email and password!' }] });
    }

    const user = new User({

        local: {
            username: username,
            email: email,
            password: password
        }

    })

    user.save((err, userDoc) => {
        if (err) { return res.json({ success: false, errors: {} }) }

        res.status(500).json({ success: true })

    })
}






const login = function (req, res) {


    User.findOne({ 'local.email': req.body.email }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, message: 'Auth Failed , user not found ' })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: 'Wrong password' })
            }


            user.generateToken((err, user) => {
                if (err) { return res.status(400).send(err) }


                res.send({ loginSuccess: true, token: user.token })

            })

        })


    })



}


const fbLogin = function (req, res) {

    const { email, name, accessToken } = req.body;

    // TO-DO
    // what if user change email in facebook ?? 
    // check accessToken and it matches but no email , we would replace token and give access to it .



    User.findOne({ 'phone.email': email }, (err, user) => {


        let errors = {}
        if (!user) {
            const user = new User({

                phone: {
                    username: name,
                    email: email,
                    accessToken: accessToken
                }

            })

            user.save((err, userDoc) => {
                if (err) {
                    errors.notUser = 'something wrong with user'
                    return res.json({ success: false, errors: errors })

                }

                // res.status(500).json({ success: true })
                userDoc.generateToken((err, user) => {


                    if (err) {
                        return res.status(400).send(err)
                    }


                    res.send({ loginSuccess: true, token: user.token })

                })
            })
        } else {
            res.send({ loginSuccess: true, token: user.token })
        }

    })

}



const auth = function (req, res) {



    res.status(200).json({
        user: req.user,
        isAuth: true
    })

}


const logout = function (req, res) {

    User.findByIdAndUpdate(req.user._id, { token: '' }, { new: true }, (err, updateUser) => {
        console.log(updatedUser)

        if (err) {

            res.json({ success: false, err })

        } else {

            res.status(200).send({
                success: true
            })
        }



    })




}


module.exports = {
    logout,
    auth,
    fbLogin,
    register,
    login,
    accountkitLogin

}