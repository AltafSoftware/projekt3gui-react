// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // Ensure axios is imported

// Create an instance of express application
const app = express();
const PORT = process.env.PORT || 3001; // Port for the frontend server
const BACKEND_HOSTNAME = '172.20.10.10'; // IP address for the C++ backend
const BACKEND_PORT = 8080; // Port for the C++ backend

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

let gameStatus = 0; // Variable to keep track of game status

// Function to send game status to the backend using axios
const sendGameStatus = async (status) => {
    const postData = { status }; // Create post data

    try {
        const response = await axios.post(`http://${BACKEND_HOSTNAME}:${BACKEND_PORT}/`, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(`Backend received data! ${response.data}`);
    } catch (error) {
        console.error(`Problem with request: ${error.message}`);
    }
};

// Route to handle incoming game status updates
app.post('/game-status', async (req, res) => {
    const { status } = req.body; // Extract status from request body

    if (status === 0) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL IKKE STARTET!`); // Log game not started
    } else if (status === 1) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL STARTET!`); // Log game started
    } else {
        return res.status(400).json({ message: 'Invalid status' });
    }

    // Send game status to backend
    await sendGameStatus(gameStatus);

    // Respond back to the client with the current game status
    res.status(200).json({ message: 'Status received successfully', currentStatus: gameStatus });
});

// New route to fetch player times from the backend
app.get('/player-times', async (req, res) => {
    try {
        const response = await axios.get(`http://${BACKEND_HOSTNAME}:${BACKEND_PORT}/times`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.status(200).json(response.data); // Send the times back to the client
    } catch (error) {
        console.error(`Problem with request: ${error.message}`);
        res.status(500).json({ message: 'Error fetching player times' });
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
