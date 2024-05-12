const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Use a variable to keep track of the game status
let gameStatus = 0; // Default to 0 indicating 'not started'

app.post('/game-status', (req, res) => {
    const { status } = req.body;

    // Update the game status based on the received status
    if (status === 0) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL IKKE STARTET!`);
    }
    if (status === 1) {
        gameStatus = status;
        console.log(`${gameStatus} = SPIL STARTET!`);
    }
    
    // Respond back with the current game status
    res.status(200).json({ message: 'Status received successfully', currentStatus: gameStatus });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
