const express = require('express')
const md5hash = require('./middleware/md5hash');

const app = express()

async function sendWebhookMessage(message) {
    const { default: fetch } = await import('node-fetch');
    const webhookUrl = "https://discord.com/api/webhooks/1148881222261547018/eLk0DyWLT9b0GpWUQIosRwPFEfg15LZr5py5BYICP5WpNyTgJRKZXpuFd5EOXCpdmD8H";
  
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });
  
      if (response.ok) {
        console.log('Message sent to the webhook successfully.');
      } else {
        console.error('Error sending message to the webhook:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to the webhook:', error);
    }
}

app.post('/hash', md5Middleware);


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

app.listen(process.env.PORT || 3000)