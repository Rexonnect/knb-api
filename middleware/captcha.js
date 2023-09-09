const axios = require('axios');

// Replace with your hCaptcha secret key
const hCaptchaSecretKey = 'YOUR-SECRET-KEY';

async function verifyCaptcha(req, res, next) {
  const { response } = req.body;

  try {
    const responseFromhCaptcha = await axios.post('https://hcaptcha.com/siteverify', {
      response,
      secret: hCaptchaSecretKey,
    });

    if (responseFromhCaptcha.data.success) {
      // The captcha was completed successfully
      next();
    } else {
      // The captcha verification failed
      res.status(400).json({ error: 'Captcha verification failed' });
    }
  } catch (error) {
    console.error('Error verifying captcha:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = verifyCaptcha;
