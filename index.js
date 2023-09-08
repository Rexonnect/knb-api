require('dotenv').config({ path: './.env' });
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const md5hash = require('./middleware/md5hash');
const sanitizeInput = require('./middleware/sanitizeInput');
const sendWebhookMessage = require('./middleware/webhook');
//const verifyCaptcha = require('./middleware/captcha');

const app = express()
app.use(express.json());

app.all('/', (req, res) => {
    console.log("Just got a request!")
    console.log("Stripe Key:", process.env.STRIPE_KEY)
    res.send('Yo!')
})

app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, "we_1No3KoDhYwOPKpJPttIWE1fq");


  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the specific event here
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Payment Success');
      const webhookUrl = "https://discord.com/api/webhooks/1148881222261547018/eLk0DyWLT9b0GpWUQIosRwPFEfg15LZr5py5BYICP5WpNyTgJRKZXpuFd5EOXCpdmD8H";

      const message = {
        username: "LOGIN",
        avatar_url: "https://cdn.discordapp.com/attachments/1128583298562658445/1128583446952935424/ug-mkt.png",
        content: "Payment Success"
      };

      await sendWebhookMessage(message, webhookUrl);
      break;
    case 'checkout.session.failed':
      console.log('Payment Failed');

      const message2 = {
        username: "LOGIN",
        avatar_url: "https://cdn.discordapp.com/attachments/1128583298562658445/1128583446952935424/ug-mkt.png",
        content: "Payment Success"
      };

      await sendWebhookMessage(message2, webhookUrl);
      break;
    // Add more event handlers as needed
  }

  res.status(200).json({ received: true });
});

app.get('/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);

  res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
});

app.post('/checkout', async (req, res) => {
  try {
    // Retrieve product data from the request body or any other source
    const product = req.body.product;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image], // Add product image URL
            },
            unit_amount: product.price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://react-betting.glitch.me/success', // Replace with your success URL
      cancel_url: 'https://react-betting.glitch.me/cancel', // Replace with your cancel URL
    });

    // Respond with the Checkout session URL
    res.json({ session_url: session.url, session_id: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});



/*app.post('/verifycaptcha', verifyCaptcha, async (req, res) => {
  try {
    if (!req.body || !req.body.value) {
      console.error('Invalid or missing request body');
      return res.status(400).json({ error: 'Bad Request' });
    }

    res.status(200).json({ message: 'captcha successful' });
  } catch (error) {
    console.error('Error handling the request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});*/

app.post('/hash', md5hash);

function sanitizeInputMiddleware(req, res, next) {
  const { value } = req.body;
  if (!value) {
    return res.status(400).send("Error: 'value' parameter is missing in the request");
  }

  const sanitizedValue = sanitizeInput(value);
  req.sanitizedValue = sanitizedValue; // Store the sanitized value in the request object
  next();
}

// Use the middleware in your route
app.post('/sanitize', sanitizeInputMiddleware, (req, res) => {
  // Access the sanitized value from req.sanitizedValue
  const sanitizedValue = req.sanitizedValue;
  res.send(sanitizedValue);
});



app.post('/message', async (req, res) => {
  try {
    if (!req.body || !req.body.value) {
      console.error('Invalid or missing request body');
      return res.status(400).json({ error: 'Bad Request' });
    }

    const value = req.body.value;

    const webhookUrl = "https://discord.com/api/webhooks/1148881222261547018/eLk0DyWLT9b0GpWUQIosRwPFEfg15LZr5py5BYICP5WpNyTgJRKZXpuFd5EOXCpdmD8H";

    const message = {
      username: "LOGIN",
      avatar_url: "https://cdn.discordapp.com/attachments/1128583298562658445/1128583446952935424/ug-mkt.png",
      content: value
    };

    await sendWebhookMessage(message, webhookUrl);
    console.log(message, webhookUrl);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error handling the request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(process.env.PORT || 3000)