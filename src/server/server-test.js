// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

// Create an instance of express application
const app = express();
const PORT = process.env.PORT || 3001; // Port for the frontend server
const BACKEND_HOSTNAME = '192.168.59.128'; // IP address for the C++ backend
const BACKEND_PORT = 8080; // Port for the C++ backend

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

let gameStatus = 0; // Variable to keep track of game status

// Function to send game status to the backend
const sendGameStatus = (status) => {
    const postData = JSON.stringify({ status }); // Convert status to JSON string

    const options = {
        hostname: BACKEND_HOSTNAME,
        port: BACKEND_PORT,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set content type to JSON
            'Content-Length': Buffer.byteLength(postData) // Set content length
        }
    };

    const request = http.request(options, (response) => {
        response.setEncoding('utf8'); // Set response encoding to UTF-8
        response.on('data', (chunk) => {
            console.log(`Response from backend: ${chunk}`); // Log response from backend
        });
    });

    // Handle any errors in the request
    request.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    request.write(postData); // Write the data to request body
    request.end(); // End the request
};

// Function to check if the backend is running
const checkBackendStatus = (callback) => {
    const options = {
        hostname: BACKEND_HOSTNAME,
        port: BACKEND_PORT,
        path: '/',
        method: 'HEAD' // Use HEAD method to check backend status
    };

    const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
            callback(true); // Backend is running
        } else {
            callback(false); // Backend is not running
        }
    });

    req.on('error', () => {
        callback(false); // Backend is not running
    });

    req.end(); // End the request
};

// Route to handle incoming game status updates
app.post('/game-status', (req, res) => {
    const { status } = req.body; // Extract status from request body

    if (status === 0) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL IKKE STARTET!`); // Log game not started
    } else if (status === 1) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL STARTET!`); // Log game started
    }

    // Check if the backend is running before sending the game status
    checkBackendStatus((isRunning) => {
        if (isRunning) {
            sendGameStatus(gameStatus); // Send game status if backend is running
        } else {
            console.error('Backend not running'); // Log backend not running
        }
    });

    // Respond back to the client with the current game status
    res.status(200).json({ message: 'Status received successfully', currentStatus: gameStatus });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
