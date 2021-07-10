const crypto = require('crypto');
//const axios = require('axios');
const RouterOSClient = require('routeros-client').RouterOSClient;

const sendEmail = require('./../utils/email');
const User = require('./../models/userModel');
//const app = require('../app');
const AppError = require('./../utils/appError');

exports.submitLogin = async (req, res, next) => {
  /*
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const res = await axios({
      method: 'POST',
      url: 'http://hotspot.wifi/login',
      data: {
        username: email,
        password,
      },
    });

    console.log(res.data);
  } catch (err) {
    console.log(err.message);
  }
  */

  const api = new RouterOSClient({
    host: 'router.lan',
    user: 'admin',
    password: 'Admin@123',
  });

  //console.log(api);
  api
    .connect()
    .then((client) => {
      // After connecting, the promise will return a client class so you can start using it

      // You can either use spaces like the winbox terminal or
      // use the way the api does like "/system/identity", either way is fine
      // client
      //   .menu('/tool')
      //   .get()
      //   .then((result) => {
      //     console.log(result);
      //   });
      console.log(client);
      /*
      client
        .menu('/system/identity')
        .getOnly()
        .then((result) => {
          console.log(result); // Mikrotik
          api.close();
        })
        .catch((err) => {
          console.log(err); // Some error trying to get the identity
        });
        */
    })
    .catch((err) => {
      // Connection error
      console.log(err);
    });
};

// Password Generator
const generatePassword = () => {
  const pwdChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@?';
  const pwdLen = 10;
  const randPassword = Array(pwdLen)
    .fill(pwdChars)
    .map((x) => x[Math.floor(Math.random() * x.length)])
    .join('');
  return randPassword;
};

exports.submitRegistration = async (req, res, next) => {
  try {
    //let firstName, lastName;
    const { fullname, email, mobile } = req.body;

    const lastName = fullname.split(' ')[0];
    const firstName = fullname.split(' ')[1];

    console.log(lastName, firstName, email, mobile);

    if (!fullname || !email || !mobile) {
      throw new AppError('All fields are required', 400);
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
    });

    const registerToken = user.createRegistrationToken();
    await user.save({ validateBeforeSave: false });

    const message = `
    Hey ${firstName},

    Thanks for signing up for Galaxy Backbone hotspot.
    To finish registration, please click the link below to verify your account.

    ${req.protocol}://${req.get('host')}/account/confirm-email/${registerToken}

    Once verified, you can then browse the web. If you have any problems,
    please constact us: servicedesk@galaxybackbone.com.ng

    - GalaxyBackbone Team
    `;

    await sendEmail({
      to: email,
      subject: '[GBB HotSpot] Please confirm your email address',
      message,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Pre-registration successful. Please wait while you are been redirected...',
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

exports.confirmEmail = async (req, res, next) => {
  try {
    //Read url token variable
    const urlToken = req.params.token;
    const urlHashedToken = crypto.createHash('sha256').update(urlToken).digest('hex');

    //Query database for the required token
    const account = await User.findOne({ registerToken: urlHashedToken, active: false });
    //console.log(account);

    if (account) {
      const password = generatePassword();

      //Connect to routerOS
      const api = await new RouterOSClient({
        host: process.env.ROUTEROS_HOST,
        user: process.env.ROUTEROS_USERNAME,
        password: process.env.ROUTEROS_PASSWORD,
        keepalive: true,
      }).connect();

      console.log(api);
      if (!api) {
        console.log(api);
        throw new AppError('Mikrotik Connection error');
      }

      const result = await api.menu('/tool/user-manager/user/').add({
        customer: process.env.ROUTEROS_RADIUS_CUSTOMER,
        disabled: 'no',
        password,
        sharedUsers: process.env.ROUTEROS_RADIUS_SHAREDUSERS,
        username: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        phone: account.mobile,
      });

      await api.menu('/tool/user-manager/user').exec('create-and-activate-profile', {
        customer: process.env.ROUTEROS_RADIUS_CUSTOMER,
        profile: process.env.ROUTEROS_RADIUS_PROFILE,
        id: `${result.id}`,
      });

      await sendEmail({
        to: account.email,
        subject: '[GBB HotSpot] Login Credentials',
        message: `
        Hey ${account.firstName},

        Please find below your hotspot Login

        username: ${account.email}
        Password: ${password}

        -GalaxyBackbone Team
        `,
      });

      res.status(200).render('confirm-email', {
        login: false,
        email: account.email,
        password,
        pretty: true,
      });
      //console.log('done');
    } else {
      throw new AppError('Token already verified or incorrect');
    }
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
