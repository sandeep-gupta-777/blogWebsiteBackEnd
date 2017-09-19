'use strict';
const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURL);

Mongoose.connection.on('error', error => {
    // logger.log('error', 'Mongoose connection error: ' + error);
});

// Create a Schema that defines the structure for storing user data
const imageContainerSchema = new Mongoose.Schema({

    imageId: String,
    imageName: String,
    imageTags: [String],
    imageURL: String,
    imageAuthor: String,
    imageAuthor_id: String,
    imageVoteCount: Number,
    imagePublishDate: String,
    imageComments: String

});

const siteUserSchema = new Mongoose.Schema({
    userName: String,
    fullName: String,
    email: String,
    password: String,
    profileID : String,
    profilePicURL: String,
    votes: [String],
    comments: [{comment: String, image: String}],//array of an object
    // uploaded: [String],
    writtenBlogs: [String],//blog's _id sring
    dateOfSignup: Date,
    lastLogin: Date
});

const BlogPostSchema = new Mongoose.Schema({
    blogTitle:String,
    blogHTML:String,
    blogDraftHTML:String,
    blogIsDirty:Boolean,
    blogText:String,
    blogAuthor_id:String,
    blogAuthor_fullName:String,
    blogCreationDate:Date,
    blogLastUpdatedDate:Date,
    blogLikes:[String],
    blogViews:Number,
    blogComments:[],
    blogCommentsCount:Number,
    blogTags:[String],
    blogRelevency:Number,
    blogImageURL: String
});

const threadSchema = new Mongoose.Schema({
    _id: String,
    threadComment_idArray: [String],
    threadDate: Date
});


const commentSchema = new Mongoose.Schema({

    commentText: String,
    commentHTML: String,
    commentAuthor_FullName:String,
    commentAuthor_PicURL:String,


    commentBlog_id:String,//
    commentParent_id:String,
    commentParentLevel:Number,
    commentChild_idArray:[String],
    commentLevel:Number,
    commentRankCode:String,

    commentDate: Date,
    commentLikes: [String],
});



// Turn the schema into a usable model
let imageContainerModel = Mongoose.model('imageContainer', imageContainerSchema);
let siteUserModel = Mongoose.model('siteUser', siteUserSchema);
let blogPostModel = Mongoose.model('blogPost', BlogPostSchema);

//following is related to comments
let threadModel = Mongoose.model('thread', threadSchema);
let commentModel = Mongoose.model('comment', commentSchema);



module.exports = {
    Mongoose,
    imageContainerModel,
    siteUserModel,
    blogPostModel,
    commentModel
};

