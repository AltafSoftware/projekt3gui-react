// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const fetch = require('node-fetch');  // Include node-fetch for HTTP requests

// const app = express();
// const PORT = process.env.PORT || 3001;
// const CPP_BACKEND_URL = 'http://localhost:8080';  // URL of the C++ server

// app.use(bodyParser.json());
// app.use(cors());

// // Use a variable to keep track of the game status
// let gameStatus = 0; // Default to 0 indicating 'not started'

// app.post('/game-status', (req, res) => {
//     const { status } = req.body;

//     // Update the game status based on the received status
//     if (status === 0 || status === 1) {
//         gameStatus = status;
//         console.log(`${gameStatus} = ${gameStatus === 0 ? 'SPIL IKKE STARTET' : 'SPIL STARTET'}`);

//         // Send the status to the C++ backend server
//         fetch(CPP_BACKEND_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ status })
//         })
//         .then(cppResponse => cppResponse.text())  // Assuming the C++ server might not return a JSON response
//         .then(text => {
//             console.log('Response from C++ server:', text);
//             // Respond back to the original requester with the game status and the response from the C++ server
//             res.status(200).json({ message: 'Status received successfully', currentStatus: gameStatus, cppResponse: text });
//         })
//         .catch(error => {
//             console.error('Error communicating with C++ backend:', error);
//             // Still respond back to the original requester with the game status
//             res.status(500).json({ message: 'Failed to communicate with C++ backend', currentStatus: gameStatus });
//         });
//     } else {
//         // Handle unexpected status values
//         res.status(400).json({ message: 'Invalid status value received' });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
