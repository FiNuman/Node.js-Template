
//========================================================================================
//                                Import File
//========================================================================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require('path')
const jwt = require('jsonwebtoken');
const { exec, spawn } = require('child_process');

const bcrypt = require('bcrypt');
const saltRounds = 10;
global.bcrypt = bcrypt;
global.saltRounds = saltRounds;


app.set('trust proxy', 1);


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
        methods: ['GET', 'POST', 'websocket'], // Allowed HTTP methods
        allowedHeaders: ["X-Requested-With", "content-type"],
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
        rejectUnauthorized: false
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

mongoose.set('strictQuery', true); // Set strictQuery to true

mongoose.connect('mongodb://127.0.0.1/test?replicaSet=rs0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Initial MongoDB connection established');
}).catch((error) => {
    handleTimeoutError(error);
});

// mongoose.connect(`mongodb://server:server@127.0.0.1/DMS-WMS?replicaSet=rs0`, {
// mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@127.0.0.1/DMS-WMS?replicaSet=rs0`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log('Initial MongoDB connection established');
// }).catch((error) => {
//     handleTimeoutError(error);
// });



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
            }, 1000 * 1 * 60); // Adjust the delay as needed
        });
    } else {
        console.error('MongoDB error:', error);
    }
}




//========================================================================================
//                                 Data base schema
//========================================================================================

const testDB = require('./DataBase/test/test');
testDB.setSocketIO(io);
testDB.connectToDatabase();




//========================================================================================
//                                 Route
//========================================================================================
app.use('/testRoute', require('./routes/test'));





//========================================================================================
//                                Request and Responsse
//========================================================================================
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});




//========================================================================================
//                                socket IO
//========================================================================================

// Middleware to check user authentication before allowing socket connection
// io.use((socket, next) => {
//     // Extract the authentication token from the socket's handshake 
//     socketAuthentication(socket.handshake.auth.token)
//         .then((isAuthenticated) => {
//             if (isAuthenticated) {
//                 return next();
//             }
//         }).catch((error) => {
//             console.log(error)
//             // If authentication fails, reject the socket connection
//             return next(new Error('Authentication failed. Socket connection rejected.'));
//         })
// });

io.on('connection', (socket) => {
    console.log('Socket connected.');

    // Set the CORS headers when the connection is established
    socket.emit('connectAck', { origin: corsOrigins });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    socket.on("reconciliationStateSave", (data) => {
        socket.broadcast.emit(`${data.id}reconciliationStateSave`, data);
    })
});



//========================================================================================
//                                Server Start
//========================================================================================
server.listen(3000, () => {
    console.log(`Server is running on port`, 3000);
});
