const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });
const router = express.Router();

//Middleware to handle csrf protection

//Endpoints to display webforms
router.get('/', viewsController.loginForm);
router.post('/', viewsController.loginForm);
router.get('/registration', csrfProtection, viewsController.registrationForm);
router.get('/account/confirm-email/:token', viewsController.createPassword);
router.get('/confirm-email', viewsController.confirmEmail);
router.get('/thank-you', viewsController.thankYou);

//Endpoints to submit forms
router.post('/submitRegistration', csrfProtection, authController.submitRegistration);
router.post('/confirm-email', authController.confirmEmail);
//router.get('/account/confirm-email/:token', authController.confirmEmail);

module.exports = router;
