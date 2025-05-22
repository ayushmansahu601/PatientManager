const twilio = require('twilio');
const accountSid = 'your_sid';
const authToken = 'your_token';
const client = twilio(accountSid, authToken);

const sendTwilioMessage = (to, body) => {
  return client.messages.create({
    body,
    from: 'your_twilio_number',
    to
  });
};
