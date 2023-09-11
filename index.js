const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const schema = require("./middleware/schema");
const stripe = require('stripe')(process.env.STRIPE_KEY);
const mongoose = require('mongoose')
const md5hash = require('./middleware/md5hash');
const sanitizeInput = require('./middleware/sanitizeInput');
const sendWebhookMessage = require('./middleware/webhook');
//const verifyCaptcha = require('./middleware/captcha');

const app = express()
const PORT = process.env.PORT || 3000

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

schema.index({ email: 1 }, { unique: true });
// Create a model based on the schema
//const User = mongoose.model('User', userSchema);

app.all('/', (req, res) => {
  console.log("Just got a request!")
  res.send('Yo!')
})


app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log("async_payment_failed");
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      console.log("async_payment_succeeded");
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      console.log("checkout.session.completed");
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      console.log("checkout.session.expired");
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});




app.use(express.json());


// Create a POST endpoint for /signup
/*app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      dateSignedUp: new Date(),
      username: 'User1234',
      wagers: [],
      wagered: 0,
      wagersCount: 0,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});*/


app.post('/signup', async (req, res) => {
  try {
    
    const { email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      dateSignedUp: new Date(),
      username: 'User1234',
      wagers: [],
      wagered: 0,
      wagersCount: 0,
    });

    // Save the user to the database
    await newUser.save();

    console.log('User created successfully.');

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    if (error.message.includes('E11000 duplicate key error')) {
      if (error.message.includes('email')) {
        // Duplicate key error for the email field
        console.error('Email address is already in use.');
      } else {
        console.error('An error occurred:', error);
      }
    }
  }
});

app.get('/get-users', async (req,res)=> {

  const book = await schema.find();

  if (book) {
    res.json(book)
  } else {
    res.send("Something went wrong.");
  }
  
});

app.post('/user', async (req,res) => {
  try {

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await schema.insertMany([
      {
        email, 
        password: hashedPassword,
        dateSignedUp: new Date(),
        username: 'User1234',
        wagers: [],
        wagered: 0,
        wagersCount: 0,
      }
    ]);
    res.json({"Data":"Added"})
  } catch (error) {
    console.log("err", + error);
  }
})



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


//app.listen(process.env.PORT || 3000)

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})