const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors()); // Ensure CORS is properly configured to accept requests from your React app's domain

app.post('/game-status', (req, res) => {
    const { status } = req.body;
    console.log(`Received status: ${status}`);
    res.status(200).json({ message: 'Status received successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
