var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    db = require('../config/db').db;

autoIncrement.initialize(db);

/**
 * @module  User
 * @description contain the details of Attribute
 */

var User = new Schema({

    /** 
      userName. It can only contain valid email id, should be unique, is required and indexed.
    */
    username: {
        type: String,
        unique: true,
        required: true
    },

    /** 
      password. It can only contain string, is required field.
    */
    password: {
        type: String,
        required: true
    },

 
    /** 
      propertyId. It can only contain string.
    */
    isVerified: {
        type: Boolean,
        default: false
    }


});

User.plugin(autoIncrement.plugin, {
    model: 'user',
    field: '_id'
});

User.statics = {
    saveUser: function(requestData, callback) {
        this.create(requestData, callback);
    },
    findUserUpdate: function(query, user, callback) {
        this.findOneAndUpdate(query, user, callback);
    },
    updateUser: function(user, callback) {
        user.save(callback);
    },

    findUser: function(username, callback) {
        this.findOne({username: username}, callback);
    },

    findUserByIdAndUserName: function(id, username, callback) {
        this.findOne({ username: username, _id: id }, callback);
    }
}

var user = mongoose.model('user', User);

/** export schema */
module.exports = {
    User: user
};
