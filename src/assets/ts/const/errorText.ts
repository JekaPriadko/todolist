const errorsTest: Record<string, string> = {
  'auth/user-not-found': 'Email or password incorrect',
  'auth/wrong-password': 'Email or password incorrect',
  'auth/email-already-in-use': 'User already exists',
  'auth/invalid-email': 'Email not valid',
  'auth/weak-password': 'Weak password',
};

export default function getErrorText(code: string): string {
  return errorsTest[code] || 'Unknown error';
}
