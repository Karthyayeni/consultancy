const nodemailer = require('nodemailer');

const sendOrderEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kavikrithi0605@gmail.com',
      pass: 'ybxvdynsydlfeeeb', 
    },
  });

  const mailOptions = {
    from: 'kavikrithi0605@gmail.com',
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOrderEmail;
