/* eslint-disable */
import * as httpx from './httpx';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const deleteUser = document.querySelector('.card-container');
const showAddFormBtn = document.querySelector('.btn__showAddForm');
const addContentForm = document.querySelector('.add__content');
const companyDataForm = document.querySelector('.form-company-data');
const brandDataForm = document.querySelector('.form-brand-data');
const requestReset = document.querySelector('.form--requestReset');
const resetPassword = document.querySelector('.form--resetPassword');

if (resetPassword)
  resetPassword.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const resetPasswordIndex = urlParts.indexOf('resetPassword');
    const token = urlParts[resetPasswordIndex + 1];
    httpx.resetPassword(password, passwordConfirm, token);
  });

if (requestReset)
  requestReset.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    httpx.requestReset(email);
  });

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    httpx.login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', httpx.logout);

// remove or show add user/brand/color menu
if (showAddFormBtn)
  showAddFormBtn.addEventListener('click', () => {
    addContentForm.classList.toggle('hidden');
  });

// User managmet delete user button
if (deleteUser) {
  deleteUser.addEventListener('click', function (event) {
    const targetButton = event.target.closest('.btn__userDelete');
    if (targetButton) {
      const userID = targetButton.getAttribute('userID');
      httpx.softDelete(userID);
    }
  });
}

// submit user data
if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/users/updateMe';
    const method = 'PATCH';
    const form = new FormData();
    form.append('userName', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    httpx.updateSettings(form, url, method, 'User');
  });

// submit pwd change
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = '/api/v1/users/updateMyPassword';
    const method = 'PATCH';
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await httpx.updateSettings(
      { passwordCurrent, password, passwordConfirm },
      url,
      method,
      'Password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

// submit comapnay data
if (companyDataForm)
  companyDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = '/api/v1/companies/updateMy';
    const method = 'PATCH';
    const form = new FormData();
    form.append('companyName', document.getElementById('name').value);
    form.append('adress', document.getElementById('adress').value);
    form.append('photo', document.getElementById('photo').files[0]);
    httpx.updateSettings(form, url, method, 'Company');
  });

// load companies for adding brand owner
function populateDropdown(elementId, companies) {
  const element = document.getElementById(elementId);
  companies.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.text = item.name;
    element.appendChild(option);
  });
}

// add brand owner company lists
if (brandDataForm) {
  const companies = JSON.parse(brandDataForm.getAttribute('companies'));
  populateDropdown('selectBrandManagers', companies);
  populateDropdown('selectSuppliers', companies);

  // handle form submission
  brandDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create a FormData object
    const form = new FormData();
    const url = '/api/v1/brands/createMy';
    const method = 'POST';

    // Append other form fields
    form.append('brandName', document.getElementById('name').value);
    form.append('productGroup', document.getElementById('group').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // Append selected brand managers
    const selectedBrandManagerDropdown = document.getElementById(
      'selectBrandManagers',
    );
    const selectedBrandManagerIds = Array.from(
      selectedBrandManagerDropdown.selectedOptions,
    ).map((option) => option.value);
    form.append('brandManagers', selectedBrandManagerIds);

    // Append selected brand suppliers
    const selectedSupplierDropdown = document.getElementById('selectSuppliers');
    const selectedSupplierIds = Array.from(
      selectedSupplierDropdown.selectedOptions,
    ).map((option) => option.value);
    form.append('brandSuppliers', selectedSupplierIds);

    // Log the selected values (optional)
    console.log('Selected Brand Manager IDs:', selectedBrandManagerIds);
    console.log('Selected Supplier IDs:', selectedSupplierIds);

    // Perform your form submission logic (e.g., updateSettings)
    httpx.createRecord(form, url, method, 'Brand');
  });
}
