const form = document.getElementById('candidateForm');
const saveBtn = document.getElementById('saveBtn');
const phoneToggle = document.getElementById('phoneToggle');
const phoneGroup = document.getElementById('phoneGroup');
const successMsg = document.getElementById('successMsg');

// Validation functions
function validateName(name) {
  return /^[A-Za-z\s]{2,}$/.test(name.trim());
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return phone.trim() === '' || /^\d{10}$/.test(phone);
}

function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(password);
}

function validateAbout(about) {
  const length = about.trim().length;
  return length >= 50 && length <= 500;
}

function updateSaveButtonState() {
  const isFormValid = 
    validateName(form.fullName.value) &&
    validateEmail(form.email.value) &&
    (phoneToggle.checked ? validatePhone(form.phone.value) : true) &&
    validatePassword(form.password.value) &&
    form.lang.value &&
    validateAbout(form.about.value);

  saveBtn.disabled = !isFormValid;
}

function showError(inputId, message) {
  document.getElementById(inputId + 'Error').innerText = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.innerText = '');
}

// Phone toggle behavior
phoneToggle.addEventListener('change', () => {
  phoneGroup.style.display = phoneToggle.checked ? 'block' : 'none';
  updateSaveButtonState();
});

// Validate fields on input
form.addEventListener('input', () => {
  clearErrors();

  if (!validateName(form.fullName.value)) {
    showError('fullName', 'Full Name must be at least 2 letters (letters only).');
  }
  if (!validateEmail(form.email.value)) {
    showError('email', 'Enter a valid email address.');
  }
  if (phoneToggle.checked && !validatePhone(form.phone.value)) {
    showError('phone', 'Phone must be exactly 10 digits.');
  }
  if (!validatePassword(form.password.value)) {
    showError('password', 'Password must be 8+ chars, 1 upper, 1 lower, 1 number, 1 special.');
  }
  if (!form.lang.value) {
    showError('lang', 'Please select a language.');
  }
  if (!validateAbout(form.about.value)) {
    showError('about', 'About must be 50–500 characters.');
  }

  updateSaveButtonState();
});

// Submit form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = {
    name: form.fullName.value.trim(),
    email: form.email.value.trim(),
    phone: phoneToggle.checked ? form.phone.value.trim() : '',
    password: form.password.value.trim(),
    lang: form.lang.value,
    about: form.about.value.trim()
  };

  console.log('Form Data:', formData);

  try {
    const res = await fetch('https://admin-staging.whydonate.dev/whydonate/assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.status === 200) {
        successMsg.innerText = "Save successful!";
        successMsg.style.color = 'green';
        form.reset();
        phoneGroup.style.display = 'block';
        saveBtn.disabled = true;
      } else {
        successMsg.innerText = "Something went wrong. Please try again.";
        successMsg.style.color = 'red'; 
      }
  } catch (error) {
    console.error('Error submitting form:', error);
    successMsg.innerText = "Error connecting to server.";
    successMsg.style.color = 'red';
  }
});