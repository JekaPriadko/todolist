const errorsTest = {
  'auth/user-not-found': 'Email or password incorect',
  'auth/wrong-password': 'Email or password incorect',
  'auth/email-already-in-use': 'User already exists',
  'auth/invalid-email': 'Email not valid',
};

export default function getErrorText(code) {
  return errorsTest[code] || 'Unknown error';
}
