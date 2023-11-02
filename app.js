
//========================================================================================
//                                Import File
//========================================================================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require('path')

const bcrypt = require('bcrypt');
const saltRounds = 10;
global.bcrypt = bcrypt;
global.saltRounds = saltRounds;


app.set('trust proxy', true);


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");


const cors = require('cors');
const corsOrigins = JSON.parse(process.env.corsOrigins);
app.use(cors({ origin: corsOrigins, credentials: true }));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

const io = new Server(server, {
    cors: {
        origin: corsOrigins, // Allow requests from this origin
        methods: ['GET', 'POST', 'PATCH'], // Allowed HTTP methods
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    },
});




//========================================================================================
//                                Express File
//========================================================================================
app.use('/static', express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({
    limit: '150mb',
    extended: true
}));

 
const db = mongoose.connection;

// Event: When the MongoDB connection is opened
db.on('connected', () => {
    console.log('Connected to MongoDB');
});

// Event: When the MongoDB connection is disconnected
db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Event: When the MongoDB connection is reconnected
db.on('reconnected', () => {
    console.log('MongoDB reconnected');
});

 
mongoose.connect('mongodb://127.0.0.1/Rupom_Diamonds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Initial MongoDB connection established');
}).catch((error) => {
    handleTimeoutError(error);
});



//when get mongoose timeout error 
// Function to handle a timeout error and attempt reconnection
function handleTimeoutError(error) {
    if (error.name === 'MongoNetworkTimeoutError') {
        console.error('MongoDB connection timeout error. Reconnecting...');
        mongoose.connection.close(() => {
            // Attempt to reconnect after a short delay
            setTimeout(() => {
                mongoose.connect(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }).then(() => {
                    console.log('Reconnected to MongoDB');
                }).catch((reconnectError) => {
                    console.error('Failed to reconnect to MongoDB:', reconnectError);
                });
            }, 1000 * 5 * 60); // Adjust the delay as needed
        });
    } else {
        console.error('MongoDB error:', error);
    }
}



//========================================================================================
//                                 Data base schema
//========================================================================================

const profile = require('./database/admin');
profile.connectToDatabase();
 
 

//========================================================================================
//                                 Route
//========================================================================================


const clientdataretrive = require('./routes/admin/adminLogin.js');
app.use('/admin', clientdataretrive);

 


//========================================================================================
//                                Request and Responsse
//========================================================================================
// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });





//========================================================================================
//                                Server Start
//========================================================================================
server.listen(3000, () => {
    console.log(`Server is running on port`, 3000);
});

