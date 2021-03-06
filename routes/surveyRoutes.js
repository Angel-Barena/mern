const mongoose = require('mongoose');
const router =  require('express').Router(['strict']);
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Survey = mongoose.model('surveys');

router.post('/surveys', requireLogin, requireCredits, (req, res)=>{
    const {title, subject, body, recipients} = req.body;
    const survey = new Survey({
        title,
        subject,
        body,
        recipients: recipients.split(',').map(email=>({email:email.trim()})),
        _user: req.user.id,
        dateSent: Date.now()
    });
    const newSurvey = survey.save();
});

module.exports=router;