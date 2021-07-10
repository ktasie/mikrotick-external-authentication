const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

//Endpoints to display webforms
router.get('/', viewsController.loginForm);
router.post('/', viewsController.loginForm);
router.get('/registration', viewsController.registrationForm);
router.get('/thank-you', viewsController.thankYou);

//Endpoints to submit forms
router.post('/submitLogin', authController.submitLogin);
router.post('/submitRegistration', authController.submitRegistration);
router.get('/account/confirm-email/:token', authController.confirmEmail);

module.exports = router;
