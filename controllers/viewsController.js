//const axios = require('axios');
//const app = require('../app');
//const AppError = require('../utils/appError');

/* eslint-disable */
exports.loginForm = (req, res) => {
  //console.log(req.body);
  res.status(200).render('login', {
    mac: req.body.mac,
    ip: req.body.ip,
    username: req.body.username,
    'link-login': `${req.body['link-login']}`,
    'link-orig': req.body['link-origin'],
    error: req.body.error,
    login: true,
    pretty: true,
  });
};

exports.registrationForm = (req, res) => {
  res.status(200).render('registration', {
    login: false,
    pretty: true,
  });
};

exports.createPassword = (req, res) => {
  const { token } = req.params;
  res.status(200).render('create-password', {
    token,
    pretty: true,
  });
};

exports.thankYou = (req, res) => {
  res.status(200).render('thank-you', {
    pretty: true,
  });
};

exports.confirmEmail = (req, res) => {
  res.status(200).render('confirm-email', {
    login: false,
    pretty: true,
  });
};
