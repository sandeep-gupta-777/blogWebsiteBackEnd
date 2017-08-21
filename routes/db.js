
const db = require('../db');
const mongoose = require('../db').Mongoose;

let saveImageInDB =  function (tempImageName,imageAuthor,imageAuthor_id) {
    let imageContainerItem = new db.imageContainerModel({
            imageId: tempImageName,
            imageName: tempImageName,
            imageURL:"hello",
            imageAuthor:imageAuthor,
            imageAuthor_id:imageAuthor_id,
            imageTags:[],
            imageVoteCount: 0
        });
    imageContainerItem.save(function (err,savedImageContainer) {
        console.log(savedImageContainer);
    });
    // imageContainerItem.create();
};


let getImagesContainersFromDB = function (criteriaObject,skip,limit) {
    // console.log(resultCountli    mit);
    return db.imageContainerModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

        console.log(result+"======================================");
    });
};

let getUsersFromDB = function (criteriaObject,skip,limit) {
    // console.log(resultCountlimit);
    return db.siteUserModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

        // console.log(result);
    });
};

let updateVoteCount_inImageContainer = function (image_Id) {
    console.log(image_Id );

    db.imageContainerModel.update({_id: image_Id}, {$inc: { imageVoteCount: +1}}, function (err, numAffected) {
        // console.log("vote updated in ", count, "+_results");
        // console.log("count");
        console.log('vote updated in',numAffected.nModified, 'images');
    });
};
let updateImageContainer = function (imageContainer) {

    db.imageContainerModel.update({_id: imageContainer._id}, imageContainer, function (err, numAffected) {
        console.log("changed in ", "results");
        console.log(err);
        // console.log("count");
        console.log('vote updated in',numAffected.nModified, 'images');
    });
};

let updateVoteCount_inSiteUser = function (user_id,image_id) {
    console.log( user_id);
    let count = db.siteUserModel.update({_id: user_id}, {$push: {votes:image_id}}, function (err, numAffected) {
        console.log('vote updated in',numAffected.nModified, 'users');
    });
};


module.exports =  {
    saveImageInDB,
    getImagesContainersFromDB,
    updateVoteCount_inImageContainer,
    updateVoteCount_inSiteUser,
    getUsersFromDB,
    updateImageContainer

};

