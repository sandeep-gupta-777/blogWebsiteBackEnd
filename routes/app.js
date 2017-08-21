const express = require('express');
const router = express.Router();
const multer = require('multer');
const aws = require('./aws');
const helperDB  =  require('./db');
const helper = require('../helper');
const userRoutes = require('./user');
const passport = require('passport');
console.log("in app.js file");

// set the directory for the uploads to the uploaded to
let DIR = './uploads/';
// debugger;
//http://valor-software.com/ng2-file-upload/
//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
let upload = multer({dest: DIR}).single('photo');


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

//our file upload function.
router.post('/upload', function (req, res, next) {
    let temppathOfUploadedFile = '';
    let rString = helper.randomString(24, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return res.status(422).send("an Error occured");
        }
        //when No error occurs.
        temppathOfUploadedFile = req.file.path;

        console.log(req.body);
        console.log(req.file);
        console.log(req.file.originalname,'==================================');
         // res.json("Upload Completed for "+temppathOfUploadedFile);
         res.json(temppathOfUploadedFile);
        aws(temppathOfUploadedFile, rString);//DO NOT DELETE
        helperDB.saveImageInDB(rString,req.body.imageAuthor,req.body.imageAuthor_id);

    });

});
//like
router.post('/increaseVoteCount', function (req, res, next) {

    //update the votecount of this perticular id
    console.log(req.body);
    helperDB.updateVoteCount_inImageContainer( req.body.image_id);
    helperDB.updateVoteCount_inSiteUser(req.body.user_id, req.body.image_id);
    res.send({messge :"Vote count updated"});

});

router.get('/auth/facebook', passport.authenticate('facebook'));//this kickstarts the auth process

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/icons',
    failureRedirect: '/'
}));



router.post('/loadMore', function (req,res) {
    let skip = req.body.previouslyLoadedImagesCount;
    // let demanded = req.body.newImagesToBeLoadedCount;
    let demanded = 10;
    let query = helper.queryBuilder(req.body.searchQuery);
    let results = helperDB.getImagesContainersFromDB(query,skip,demanded).then((value)=> {
        res.send(value)});
});
router.post('/AllIcons', function (req, res) {
    //find all the image names in the database
    let query = helper.queryBuilder(req.body.searchQuery);
    // if(req.body.searchQuery) {
    //
    //     let tempArray = req.body.searchQuery.split(' ');
    //     for(let i=0;i<tempArray.length;++i){
    //         tempArray[i] = "(.*"+tempArray[i] + ".*)";
    //     }
    //     queryRegex= new RegExp(tempArray.toString().replace(',','|'),'i');
    //     query = {$or:[{imageName:queryRegex}, {imageTags:queryRegex}]};
    // }
    // else
    //     query={};
    let results = helperDB.getImagesContainersFromDB(query ,0,10).then((value)=>
    {
        console.log("fetched value=>",value);
        res.send(value)
    }
    );

});


router.get("/getcolor", function (req,res, next) {
    res.send("my fav color is:" + req.session.color);
});
router.get("/setcolor", function (req,res, next) {
    req.session.color  = "red";
    res.send("fav color set");

});


module.exports = router;
