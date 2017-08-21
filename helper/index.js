
const db = require('../db/index');




function randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

let findbyID = function (id) {
    console.log("in helpers...finding by id");
    console.log(id);
    return new Promise(function (resolve, reject) {
        db.siteUserModel.findById(id, function (error, user) {
            if(error){
                reject(error)
            }
            else {
                resolve(user)
            }
        })
    })
};
let findOne = function (profileID) {
    return db.siteUserModel.findOne({'profileID': profileID}); // this returns a promise
};
let createNewUser = function (profile) {

    console.log("creating new user, loggin profile as recieved by facebook");
    console.log(profile);

    //new Model({data}) doesnt retuerns the promise => we have to create by ourself
    return new Promise(function(resolve, reject){
        let newSiteUser = new db.siteUserModel({

            profileID:profile.id,
            fullName: profile.displayName,
            profilePicURL: profile.photos[0].value || ''
        });
        newSiteUser.save(function (error) {
            if(error){
                console.log("some error occured");
                reject(error);
            }else {
                resolve(newSiteUser);
            }
        });
    });
};

function queryBuilder(searchQuery){
    if(searchQuery) {

        let tempArray = searchQuery.split(' ');
        for(let i=0;i<tempArray.length;++i){
            tempArray[i] = "(.*"+tempArray[i] + ".*)";
        }
        queryRegex= new RegExp(tempArray.toString().replace(',','|'),'i');
        return query = {$or:[{imageName:queryRegex}, {imageTags:queryRegex}]};
    }
    else
        return query={};
}




module.exports = {
    randomString,
    findOne,
    createNewUser,
    findbyID,
    queryBuilder
};