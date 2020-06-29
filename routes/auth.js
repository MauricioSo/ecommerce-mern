const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// validation
const Joi = require('@hapi/joi');

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});
const schemaLogin = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});
router.post('/register', async (req, res) => {
    //validation of data

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    //check if the user email already exists

    const emailExists = await User.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).send('email already exists');


    //hash passwords

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    const { errorLogin } = schemaLogin.validate(req.body);
    if (errorLogin) return res.status(400).send(error.details[0].message);
    //checking if the email exists
    const userExists = await User.findOne({ email: req.body.email });

    if (!userExists) return res.status(400).send('email does not exists');

    //check if password is correct
    const validPass = await bcrypt.compare(req.body.password, userExists.password);
    if (!validPass) return res.status(400).send('invalid password');

    //create token and assign it 

    const token = await jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);
    res.send('Log in')
})

module.exports = router;