const fetch = require('node-fetch');

export async function sendWebhookMessage(message, webhook) {
  try {
    const response = await fetch(webhook, {
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
};