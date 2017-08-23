const express=  require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const db = require('../db');
const dbHelper = require('./db');
const jwt = require('jsonwebtoken');
// require('')

router.post('/signup', function (req,res,next) {

    //check if we already have a user with this email address
    db.siteUserModel.findOne({email:req.body.email}, function (err,user) {
        //TODO: ALSO CHECK FOR UNIQUE USERNAME
        if(user){
            res.json({problem_message:'Email already taken'});
        }
        else if(err){
            res.json({problem_message:'We are experiencing server issue. Please try again later.'});
        }
        else {
            let user = new db.siteUserModel({
                userName: req.body.userName,
                fullName:req.body.fullName,
                email:req.body.email,
                password:bcrypt.hashSync(req.body.password,10)//salt = 10 how strong this encryption is
            });
            console.log(user);
            user.save(function (err, result) {
                if(err){
                    return res.status(500).json({title:'error occurred', error:err});
                }
                res.status(201).json({message:'user created',obj:result});
            });
        }
    });



});

router.post('/saveEditedImageContainer', function (req,res,next) {
    let imageContainer = req.body.imageContainer;
    dbHelper.updateImageContainer(imageContainer).then(function (result) {
        console.log(result);
    });

});


router.post('/login',function (req,res,next) {

    //TODO: use user name for sign in as well
    console.log(req.body);

   db.siteUserModel.findOne({email:req.body.email}, function (err,user) {
       if(err){
           return res.status(500).json({problem_message:'DB error occurred', error:err});
       }
       if(!user){
           console.log('No user found');
           return res.status(500).json({problem_message:'No user found'});
       }
       if(!bcrypt.compareSync(req.body.password, user.password))
       {
           return res.status(500).json({problem_message:'Wrong password'});
       }
       //password is correct; create jwt
        let token = jwt.sign({user:user},'secret',{expiresIn:7200});
        res.status('200').json({massage:'successfully logged in',token,user_details:user});
   });
});


router.post('/liked_images',function (req,res,next) {

    dbHelper.getUsersFromDB({_id:req.body.user_id},0,1).then(function (results) {
        console.log(results[0].votes);
        console.log(results[0]._doc.votes);
        //making an array of {_id:...}, this _id is image_id
        tempArray = [];
        for(let i=0;i<results[0].votes.length;i++){
            console.log('hi');
            tempArray.push({_id:results[0].votes[i]})
        }
        if(tempArray.length===0){
            res.json([]);
        }
        else {
            dbHelper.getImagesContainersFromDB({$or: tempArray}).then(function (value) {
                console.log('----------------------=========================');
                console.log(value);
                res.status(200).send(value);
            });
        }
        }


        ,
        (err)=> {
            return res.status(500).json({problem_message:'DB error occurred', error:err});
        }
        );


});

router.post('/uploaded',function (req,res,next) {
    console.log(req.body.user_id);
    //if user_id = undefined => return 501
    dbHelper.getImagesContainersFromDB({ imageAuthor_id: req.body.user_id }).then(function (value) {
            console.log(value);
            res.status(200).send(value);
        },
        (err)=> {res.status(500).send({message:'some DB error'});}
    );
});

router.post('/user_details',function (req,res,next) {
    console.log(req.body.user_id);
    dbHelper.getUsersFromDB({ _id: req.body.user_id }).then(function (value) {
            console.log(value);
            res.status(200).send(value);
        },
        (err)=> {
            console.log('helllllllllo');
            res.status(500).send({message:'some DB error'});
        }
    );
});

module.exports = router;