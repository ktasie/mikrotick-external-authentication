const crypto = require('crypto');
//const axios = require('axios');
const RouterOSClient = require('routeros-client').RouterOSClient;
const validator = require('validator');

const sendEmail = require('./../utils/email');
const User = require('./../models/userModel');
//const app = require('../app');
const AppError = require('./../utils/appError');

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
    const { firstName, lastName, email, mobile } = req.body;
    //const csrfToken = req.csrfToken();

    //console.log(lastName, firstName, email, mobile);

    if (!firstName || !lastName || !email || !mobile) {
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
    please contact us: servicedesk@galaxybackbone.com.ng

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
    //const urlToken = req.params.token;
    const { token, password } = req.body;

    if (!token || !password) {
      throw new AppError('Password or email token cannot be blank', 500);
    }

    if (!validator.isStrongPassword(password, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      throw new AppError('Please refer to password criteria. It is not complex enough', 400);
    }

    //console.log(token, password);
    const urlHashedToken = crypto.createHash('sha256').update(token).digest('hex');

    //Query database for the required token
    const account = await User.findOne({ registerToken: urlHashedToken, active: false });
    //console.log(account);

    if (account) {
      //const password = generatePassword();

      //Connect to routerOS
      const api = await new RouterOSClient({
        host: process.env.ROUTEROS_HOST,
        user: process.env.ROUTEROS_USERNAME,
        password: process.env.ROUTEROS_PASSWORD,
        keepalive: true,
      }).connect();
      //console.log(api);

      api.on('error', (err) => {
        console.log(err); // Some error that ocurred when already connected
      });

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
        subject: '[GBB HotSpot] Thank you for registering',
        message: `
        Hey ${account.firstName},

        You have been successfully registered on Galaxy's hotspot.
        
        Enjoy your browsing

        -GalaxyBackbone Team
        `,
      });

      await User.findByIdAndUpdate(account._id, { active: true });

      return res.status(201).json({
        status: 'success',
        message: 'Account Registered successfully. Please wait while you are been redirected...',
      });
      //console.log('done');
    } else {
      throw new AppError('Token already verified or incorrect');
    }
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
};
