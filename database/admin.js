const mongoose = require('mongoose');

const connectToDatabase = async () => {

    // cutomer schema 
    let loginsch = new mongoose.Schema({ 
        userID: String,
        userPass: String,
        userType: String, //owner,member 
        userPermissions: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission'
        }
    });

    let login = mongoose.model('login', loginsch);
    global.login = login
 


    //userpermissions
    let Permissionsch = new mongoose.Schema({
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'login'
        },
        removeUser: Boolean,
        message: Boolean,
        updateUser: Boolean,
        userCreate: {
            type: Boolean,
            default:false,
        },
    });

    let Permission = mongoose.model('Permission', Permissionsch);
    global.Permission = Permission


}

module.exports = {
    connectToDatabase,
};