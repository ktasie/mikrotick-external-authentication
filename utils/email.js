const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'noreply@galaxybackbone.com.ng',
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  //Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
