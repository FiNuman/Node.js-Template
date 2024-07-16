const mongoose = require('mongoose');
let socket;
function setSocketIO(socketIO) {
    socket = socketIO;
}



const connectToDatabase = async () => {

     
    let test_sch = new mongoose.Schema({

        name: String,
    });

    let test = mongoose.model('test_sch', test_sch);
    global.test = test

}

module.exports = {
    connectToDatabase, setSocketIO
};
