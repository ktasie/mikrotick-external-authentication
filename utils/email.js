const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.NODE_ENV === 'development' ? process.env.SMTP_HOST : process.env.SMTP_HOST_PROD,
    port: process.env.NODE_ENV === 'development' ? process.env.SMTP_PORT : process.env.SMTP_PORT_PROD,
    auth: {
      user: process.env.NODE_ENV === 'development' ? process.env.SMTP_USERNAME : process.env.SMTP_USERNAME_PROD,
      pass: process.env.NODE_ENV === 'development' ? process.env.SMTP_PASSWORD : process.env.SMTP_PASSWORD_PROD,
    },
  });

  const mailOptions = {
    from: 'gzone@galaxybackbone.com.ng',
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  //Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
