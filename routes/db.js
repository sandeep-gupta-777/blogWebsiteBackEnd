
const db = require('../db');
const mongoose = require('../db').Mongoose;

let saveImageInDB =  function (tempImageName,tempImageURL,imageAuthor,imageAuthor_id) {
    let tempImageNameOnly = tempImageName.split(".")[0];
    let tempImageExtnOnly = tempImageName.split(".")[tempImageName.split(".").length-1];//last element of array
    let tagsArray = tempImageNameOnly.split(" ");
    // console.log(tagsArray);
    tagsArray.push(tempImageExtnOnly);
    // console.log(tagsArray);
    let imageContainerItem = new db.imageContainerModel({
            imageId: tempImageName,
            imageName: tempImageName,
            imageURL:tempImageURL,
            imageAuthor:imageAuthor,
            imageAuthor_id:imageAuthor_id,
            // imageTags:[],
            imageTags:tagsArray,
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

        // console.log(result+"======================================");
    });
};
let getCommentsFromDB = function (criteriaObject,skip,limit) {
    // console.log(resultCountli    mit);
    return db.commentModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

        // console.log(result+"======================================");
    });
};
let getBlogPostsFromDB = function (criteriaObject,skip,limit) {
    return db.blogPostModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

    });
};
let getResultsFromDB = function (criteriaObject,skip,limit) {
    //TODO: Criteria object should also consider date
    return db.blogPostModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

    });
};

let getUsersFromDB = function (criteriaObject,skip,limit) {
    // console.log(resultCountlimit);
    return db.siteUserModel.find(criteriaObject).skip(skip).limit(limit).exec(function (err, result) {

    });
};

let updateVoteCount_inImageContainer = function (image_Id,res) {

    db.imageContainerModel.update({_id: image_Id}, {$inc: { imageVoteCount: +1}}, function (err, numAffected) {
        // console.log("vote updated in ", count, "+_results");
        // console.log("count");
        if(err) {
            // return res.json({errorMessage: ' server cant connect to databse'});
        }
    });
};
let toggleLike_inBlogPost= function (blog_id, user_id, operation) {

    if(operation==="push")
    db.blogPostModel.update({_id: blog_id}, {$push: { blogLikes: user_id}}, function (err, numAffected) {//TODO: make it shorter...pull and push in one
        // console.log("vote updated in ", count, "+_results");
        // console.log("count");
        if(err) {
            // return res.json({errorMessage: ' server cant connect to databse'});
        }
    });
    else
    db.blogPostModel.update({_id: blog_id}, {$pull: { blogLikes: user_id}}, function (err, numAffected) {
        // console.log("vote updated in ", count, "+_results");
        // console.log("count");
        if(err) {
            // return res.json({errorMessage: ' server cant connect to databse'});
        }
    });

};
let updateImageContainer = function (imageContainer) {

    db.imageContainerModel.update({_id: imageContainer._id}, imageContainer, function (err, numAffected) {
        console.log(err);
        // console.log("count");
        console.log('vote updated in',numAffected.nModified, 'images');
    });
};

let updateVoteCount_inSiteUser = function (blog_id, user_id, operation) {

    if(operation==="push")
        db.siteUserModel.update({_id: user_id}, {$push: {votes:blog_id}}, function (err, numAffected) {
            console.log(err);
            console.log('vote updated in',numAffected.nModified, 'users');
        });
    else {
        db.siteUserModel.update({_id: user_id}, {$pull: {votes: blog_id}}, function (err, numAffected) {
            console.log(err);
            console.log('vote updated in', numAffected.nModified, 'users');
        });
    }
};



let updateCommentCount_blogPost= function (blog_Id,commentCount) {

    db.blogPostModel.update({_id: blog_Id}, { blogCommentsCount: commentCount}, function (err, numAffected) {
        // console.log("vote updated in ", count, "+_results");
        if(err) {
            // return res.json({errorMessage: ' server cant connect to databse'});
        }
    });
};


module.exports =  {
    saveImageInDB,
    getImagesContainersFromDB,
    updateVoteCount_inImageContainer,
    updateVoteCount_inSiteUser,
    getUsersFromDB,
    updateImageContainer,
    getResultsFromDB,
    getBlogPostsFromDB,
    getCommentsFromDB,
    toggleLike_inBlogPost,
    updateCommentCount_blogPost

};

