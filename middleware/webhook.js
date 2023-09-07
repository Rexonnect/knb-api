// webhookUtils.js

import fetch from 'node-fetch';

export async function sendWebhookMessage(message) {
  const webhookUrl = "https://discord.com/api/webhooks/1128580834698477669/3fhD8kuEH0xVJz9flUCIn5tWnOmnDWJRt9M-JybgrhEh857gBk7-C4XE0attUxkPUEgr";

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
