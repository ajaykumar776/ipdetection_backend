const express = require('express');
const cors = require('cors');
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

app.get('/api/ip', (req, res) => {
    const localIp = getLocalIpAddress();
    const systemDetails = getSystemDetails();
    res.json({ localIp, systemDetails });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
