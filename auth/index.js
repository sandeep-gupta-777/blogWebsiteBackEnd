'use strict';
const passport = require('passport');
const config = require('../config/index');
const FacebookStrategy = require('passport-facebook').Strategy;
const h = require('../helper');

module.exports = function () {

    passport.serializeUser(function (user, done) {
        console.log("in serializeUser");
        done(null, user.id);
        //serialized method in \passport\lib\authenticator.js
        //by invoking the done method => we are creating the session and storing user id in req object
    });
    /* passport.serializeUser() runs when authorization process ends, after done method
     * passport.serializeUser() creates a session and by passing user.id, we only store user _id from db in the session */


    passport.deserializeUser(function (id, done) {

        console.log("in deserializeUser");
        //find the user data using _id
        h.findbyID(id).then(function (user) {
            done(null,user)// now this data is made available in request stream as req.user

        }).catch(function (error) {
            console.log("some error");
        })
    });

    let authProcessor = function (acessToken, refreshToken, profile, done) {
        //acessToken and refreshToken are provided by facebook as a part of OAuth process

        /*find user in local db using profile.id
        if user is found =>no need to get it from facebook, return the user data using done method
        if not found => create a new user profile and store it in DB*/
        console.log("facebookStratagy...authProcessor");
        h.findOne(profile.id)
            .then(function (result) {
                if(result) {
                    done(null,result);
                    // now this data is avaibale to use to our app
                }
                else {
                    //create new user and return
                    h.createNewUser(profile)
                        .then(function (newSiteUser) {
                            done(null, newSiteUser);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
            });
        //if the user is found => return the user data useing done()
        //if user is not found => create one in local db and return
    };
    passport.use(new FacebookStrategy(config.fb,authProcessor) );
};