/* eslint-disable */

const arrayTab = document.querySelectorAll('#tab');

const showTab = (index, arrayTab) => {
  arrayTab[index].style.display = 'block';
  arrayTab[index + 1].style.display = 'none';
};

const submtiRegistration = async function (e) {
  try {
    e.preventDefault();

    if (document.querySelector('#registrationForm div.text-color-error')) {
      document.querySelector('#registrationForm div.text-color-error').parentNode.removeChild(document.querySelector('#registrationForm div.text-color-error'));
    }

    e.target.innerHTML = `<img src='/img/layout/spinner.gif'>`;

    //Read form values
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const email = document.querySelector('#email').value;
    const mobile = document.querySelector('#mobile').value;

    //console.log(fullname, email, mobile, password);
    const res = await axios({
      method: 'POST',
      url: '/submitRegistration',
      data: {
        firstName,
        lastName,
        email,
        mobile,
      },
    });

    if (res.data.status === 'success') {
      //console.log(res);
      const html = `
        <div style='background: #7fd4aa; padding:15px; color: #fff'>
          <i class='fas fa-check'></i> ${res.data.message}
      `;
      document.querySelector('#registrationForm').insertAdjacentHTML('afterbegin', html);

      //document.querySelector('#firstName').value = '';
      //document.querySelector('#email').value = '';
      //document.querySelector('#mobile').value = '';

      e.target.innerHTML = 'Redirecting ...';
      //Redirect page
      window.setTimeout(() => {
        location.assign('/thank-you');
      }, 1500);
    }
  } catch (error) {
    const html = `
      <div class='text-color-error' style='background: pink; padding:15px; margin-bottom: 15px'>
        <i class='fas fa-exclamation-circle icon-left'> ${error.response.data.message}
    `;
    // Display error on page
    document.querySelector('#registrationForm').insertAdjacentHTML('afterbegin', html);
    // Reset to default tab
    showTab(0, arrayTab);
  }
  e.target.innerHTML = '<i class="fas fa-lock icon-left"></i>Agree & Signup';
};

if (document.querySelector('#registrationForm')) {
  showTab(0, arrayTab);
  // Event Listeners
  document.querySelector('#nextBtn').addEventListener('click', function (e) {
    e.preventDefault();
    arrayTab[1].style.display = 'block';
    arrayTab[0].style.display = 'none';

    // clear any error splash on page
    if (document.querySelector('#registrationForm div.text-color-error')) {
      document.querySelector('#registrationForm div.text-color-error').parentNode.removeChild(document.querySelector('#registrationForm div.text-color-error'));
    }
  });
  document.querySelector('#createAccount').addEventListener('click', submtiRegistration);
  document.querySelector('#cancel').addEventListener('click', function (e) {
    e.preventDefault();
    showTab(0, arrayTab);
  });
}

const verifyEmail = async function (e) {
  try {
    e.preventDefault();

    if (document.querySelector('#createPasswordForm div.text-color-error')) {
      document.querySelector('#createPasswordForm div.text-color-error').parentNode.removeChild(document.querySelector('#createPasswordForm div.text-color-error'));
    }

    // Read form variables
    const password = document.querySelector('#password').value;
    const token = document.querySelector('#token').value;

    console.log(password, token);
    e.target.innerHTML = `<img src='/img/layout/spinner.gif'>`;

    // Send request to backend route
    const res = await axios({
      method: 'POST',
      url: '/confirm-email/',
      data: {
        token,
        password,
      },
    });

    if (res.data.status === 'success') {
      console.log(res);
      const html = `
        <div style='background: #7fd4aa; padding:15px; color: #fff'>
          <i class='fas fa-check'></i> ${res.data.message}
      `;
      document.querySelector('#createPasswordForm').insertAdjacentHTML('afterbegin', html);

      document.querySelector('#password').value = '';

      e.target.innerHTML = 'Redirecting ...';
      //Redirect page
      window.setTimeout(() => {
        location.assign('/confirm-email');
      }, 1500);
    }
  } catch (error) {
    const html = `
      <div class='text-color-error' style='background: pink; padding:15px; margin-bottom: 15px'>
        <i class='fas fa-exclamation-circle icon-left'> ${error.response.data.message}
    `;
    // Display error on page
    document.querySelector('#createPasswordForm').insertAdjacentHTML('afterbegin', html);
  }
  e.target.innerHTML = '<i class="fas fa-lock icon-left"></i>Create Password & Verify Email';
};

if (document.querySelector('#createPasswordForm')) {
  document.querySelector('#verifyEmail').addEventListener('click', verifyEmail);
}
