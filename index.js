const express = require('express')
const md5hash = require('./middleware/md5hash');
const sendWebhookMessage = require('./middleware/webhook');
const sanitizeInput = require('./middleware/sanitizeInput');

const app = express()


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

app.use(express.json()); // Assuming you're using JSON requests

// Apply the md5Middleware to a specific POST route
app.post('/hash', md5hash);

app.post('/message', async (req, res) => {
  const { message } = req.body;
//  const message = { /* Your message data */ };
  const webhookUrl = "https://discord.com/api/webhooks/1148881222261547018/eLk0DyWLT9b0GpWUQIosRwPFEfg15LZr5py5BYICP5WpNyTgJRKZXpuFd5EOXCpdmD8H";
  sendWebhookMessage(message, webhookUrl);
});

app.listen(process.env.PORT || 3000)