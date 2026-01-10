export const validateLogin = (formData) => {
  const errors = {};
 

  const email = formData.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  const password = formData.password?.trim();
  const passwordMinLength = 6;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < passwordMinLength) {
    errors.password = `Password must be at least ${passwordMinLength} characters`;
  } else if (!passwordRegex.test(password)) {
    errors.password =
      "Password must contain at least one letter and one number";
  }

  return errors;
};

export const validateSignup = (values) => {
  const errors = {};

  const name = values.name?.trim();
  if (!name) {
    errors.name = "Username is required";
  }

  const email = values.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email) {
    errors.email = "email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  const password = values.password?.trim();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = "password is required";
  } else if (password.length < 6) {
    errors.password = "password must be at least 6 characters";
  } else if (!passwordRegex.test(password)) {
    errors.password = "Password must contain letters and numbers";
  }

  // const confirm = values.ConfirmPassword?.trim();
  // if (confirm !== password) {
  //   errors.ConfirmPassword = "Passwords do not match";
  // }

  return errors;
};

export const validateOTP = (otp ) => {
  const errors = {};

  if (!otp || otp.length !== 6) {
    errors.otp = "OTP must be 6 characters.";
 
  }

  return errors;
};

export const validateForgetPassword = (email) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email";
  }

  return errors;
};

export const validateResetPassword = (values) => {
  const errors = {};

  const password = values.password?.trim();
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  if (!password) {
    errors.password = "password is required";
  } else if (password.length < 6) {
    errors.password = "password must be at least 6 characters";
  } else if (!passwordRegex.test(password)) {
    errors.password = "Password must contain letters and numbers";
  }

  const confirm = values.confirmPassword?.trim();
  if (confirm !== password) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};
