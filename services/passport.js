const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});


passport.deserializeUser((id, done) =>{
    User.findById(id)
    .then(user=>{
        done(null, user);
    });
});

passport.use(new GoogleStrategy(
    {
        clientID:keys.googleClientID,
        clientSecret: keys.gooleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, 
    (accessToken, refeshToken, profile, done)=>{
        User.findOne({googleID:profile.id})
        .then(existingUser=>{
            if(existingUser){
                //already signedup
                done(null, existingUser);
            } else {
                //is new user
                new User({googleID: profile.id})
                .save()
                .then(user=>{
                    done(null, user);
                });

            }
        });
    }
));   