/* eslint-disable */
/*
const submitLogin = async function (e) {
  try {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    //console.log(email, password);

    const res = await axios({
      method: 'POST',
      url: '/submitLogin',
      data: {
        email,
        password,
      },
    });
  } catch (error) {}
};

if (document.querySelector('#loginForm')) {
  document.querySelector('.form-row .button-secondary').addEventListener('click', submitLogin);
}
*/
const submtiRegistration = async function (e) {
  try {
    e.preventDefault();

    if (document.querySelector('#registrationForm div.text-color-error')) {
      document.querySelector('#registrationForm div.text-color-error').parentNode.removeChild(document.querySelector('#registrationForm div.text-color-error'));
    }

    e.target.innerHTML = `<img src='/img/layout/spinner.gif'>`;

    //Read form values
    const fullname = document.querySelector('#fullname').value;
    const email = document.querySelector('#email').value;
    const mobile = document.querySelector('#mobile').value;

    //console.log(fullname, email, mobile, password);
    const res = await axios({
      method: 'POST',
      url: '/submitRegistration',
      data: {
        fullname,
        email,
        mobile,
      },
    });

    if (res.data.status === 'success') {
      console.log(res);
      const html = `
        <div style='background: #7fd4aa; padding:15px; color: #fff'>
          <i class='fas fa-check'></i> ${res.data.message}
      `;
      document.querySelector('#registrationForm').insertAdjacentHTML('afterbegin', html);

      document.querySelector('#fullname').value = '';
      document.querySelector('#email').value = '';
      document.querySelector('#mobile').value = '';

      e.target.innerHTML = 'Redirecting ...';
      //Redirect page
      window.setTimeout(() => {
        location.assign('/thank-you');
      }, 1500);
    }
  } catch (error) {
    const html = `
      <div class='text-color-error' style='background: pink; padding:15px'>
        <i class='fas fa-exclamation-circle icon-left'> ${error.response.data.message}
    `;
    document.querySelector('#registrationForm').insertAdjacentHTML('afterbegin', html);
  }
  e.target.innerHTML = '<i class="fas fa-lock icon-left"></i>Agree & Signup';
};

if (document.querySelector('#registrationForm')) {
  document.querySelector('.form-row .button-secondary').addEventListener('click', submtiRegistration);
}
