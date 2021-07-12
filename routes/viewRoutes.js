const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

//Endpoints to display webforms
router.get('/', viewsController.loginForm);
router.post('/', viewsController.loginForm);
router.get('/registration', viewsController.registrationForm);
router.get('/account/confirm-email/:token', viewsController.createPassword);
router.get('/confirm-email', viewsController.confirmEmail);
router.get('/thank-you', viewsController.thankYou);

//Endpoints to submit forms
router.post('/submitRegistration', authController.submitRegistration);
router.post('/confirm-email', authController.confirmEmail);
//router.get('/account/confirm-email/:token', authController.confirmEmail);

module.exports = router;
