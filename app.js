const express = require('express');
const cors = require('cors');
const axios = require('axios');
const os = require('os');

const app = express();

app.use(cors());

// Function to get the local IP address
const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

// Function to get system details
const getSystemDetails = () => {
    return {
        osType: os.type(),
        osPlatform: os.platform(),
        osRelease: os.release(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus().map(cpu => cpu.model).join(', '),
    };
};

app.get('/api/ip', async (req, res) => {
    try {
        const publicIpResponse = await axios.get('https://api.ipify.org?format=json');
        const publicIp = publicIpResponse.data.ip;
        const ipApiResponse = await axios.get(`http://ip-api.com/json/${publicIp}`);
        const publicIpDetails = ipApiResponse.data;
        const localIp = getLocalIpAddress();
        const systemDetails = getSystemDetails();
        res.json({ publicIp, publicIpDetails, localIp, systemDetails });
    } catch (error) {
        console.error('Error fetching IP address:', error);
        res.status(500).send('Error fetching IP address');
    }
});

// Use a specific port or let the OS choose an available port
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
});
