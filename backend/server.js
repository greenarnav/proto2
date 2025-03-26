

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const axios = require('axios'); // Added axios to fetch data from API

const app = express();
const port = 3000;

app.use(cors({
      origin: 'http://localhost:8080',
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

// Fetch data from API and print side by side
async function fetchAndPrintData() {
    try {
        const response = await axios.get('http://3.85.90.14/sentiments');
        const data = response.data;
        
        if (Array.isArray(data)) {
            data.forEach(item => {
                console.log(
                    `ID: ${item.id} | Sentiment: ${item.sentiment_value} | Confidence: ${item.confidence} | ` +
                    `Latitude: ${item.latitude} | Longitude: ${item.longitude} | ` +
                    `Description: ${item.location_description} | Reason: ${item.reason}`
                );
            });
        } else {
            console.log(
                `ID: ${data.id} | Sentiment: ${data.sentiment_value} | Confidence: ${data.confidence} | ` +
                `Latitude: ${data.latitude} | Longitude: ${data.longitude} | ` +
                `Description: ${data.location_description} | Reason: ${data.reason}`
            );
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch and print data every 10 seconds (for continuous monitoring)
// setInterval(fetchAndPrintData, 10000);
app.get('/sentiments/near', async (req, res) => {
    const { lat, lng, radius=1000 } = req.query;
    try {
        const apiUrl = `http://3.85.90.14/sentiments/near?lat=${lat}&lng=${lng}&radius=${radius}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching nearby sentiments:", error);``
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


// Endpoint to receive user location from frontend
app.post('/location', (req, res) => {
    const { latitude, longitude } = req.body;
    console.log(`User's Location: Latitude = ${latitude}, Longitude = ${longitude}`);
    res.send({ message: "Location received" });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // fetchAndPrintData(); Fetch data once on server start
});
