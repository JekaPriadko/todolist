import closePreloader from './components/loader';
import errorText from './const/errorText';

import firebase from './firebase';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

class AuthUser {
  private authForms: HTMLElement | null;
  private authFormToggle: HTMLElement | null;
  private authFormSignIn: HTMLElement | null;
  private authFormSignUp: HTMLElement | null;
  private authBtnSignOut: HTMLElement | null;
  private authFormSignInError: HTMLElement | null;
  private authFormSignUpError: HTMLElement | null;

  private user: any;

  private stateAuthForm: 'signin' | 'signup';

  constructor() {
    this.authForms = null;
    this.authFormToggle = null;
    this.authFormSignIn = null;
    this.authFormSignUp = null;
    this.authBtnSignOut = null;
    this.authFormSignInError = null;
    this.authFormSignUpError = null;
    this.user = null;
    this.stateAuthForm = 'signin';
    this.checkAuthUser();
  }

  private checkAuthUser(): void {
    const auth = getAuth(firebase);
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.authViewHandler();
    });
  }

  private authViewHandler(): void {
    if (this.user) {
      if (this.authForms) this.removeAuthForm();

      this.authBtnSignOut = document.querySelector('.sign-out-js');
      if (this.authBtnSignOut) {
        this.authBtnSignOut.addEventListener(
          'click',
          () => {
            this.signOutUser();
          },
          { once: true }
        );
      }
    } else {
      if (!this.authForms) {
        this.showAuthForm();
      }
    }

    setTimeout(() => {
      closePreloader();
    }, 1000);
  }

  private showAuthForm(): void {
    if (!this.authForms) {
      document.body.insertAdjacentHTML('beforeend', this.getAuthForm());
      this.authForms = document.getElementById('auth');

      this.authFormToggle = this.authForms.querySelector(
        '.auth-form-toggle-js'
      ) as HTMLElement;
      this.authFormToggle.addEventListener('click', () => {
        this.toggleAuthForm();
      });

      this.authFormSignIn = this.authForms.querySelector(
        '.signin-form-js'
      ) as HTMLFormElement;
      this.authFormSignIn.addEventListener('submit', (e) =>
        this.authSignInHandler(e)
      );

      this.authFormSignUp = this.authForms.querySelector(
        '.signup-form-js'
      ) as HTMLFormElement;
      this.authFormSignUp.addEventListener('submit', (e) =>
        this.authSignUpHandler(e)
      );
    }
  }

  private removeAuthForm(): void {
    if (this.authForms) {
      this.authForms.remove();
      this.authForms = null;
    }
  }

  private signOutUser(): void {
    const auth = getAuth(firebase);
    try {
      signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }

  private async authSignInHandler(e: Event): Promise<void> {
    e.preventDefault();

    const auth = getAuth(firebase);

    const target = e.target as HTMLFormElement;
    const email = target.querySelector('.auth__email') as HTMLInputElement;
    const password = target.querySelector('.auth__pass') as HTMLInputElement;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    } catch (error) {
      const errorCode = error.code;
      console.log(errorCode);
      this.authFormSignInError = target.querySelector('.auth__error');
      this.authFormSignInError.innerHTML = errorText(errorCode);
    }
  }

  private async authSignUpHandler(e: Event): Promise<void> {
    e.preventDefault();

    const auth = getAuth(firebase);

    const target = e.target as HTMLFormElement;
    const email = target.querySelector('.auth__email') as HTMLInputElement;
    const password = target.querySelector('.auth__pass') as HTMLInputElement;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    } catch (error) {
      const errorCode = error.code;
      this.authFormSignUpError = target.querySelector('.auth__error');
      this.authFormSignUpError.innerHTML = errorText(errorCode);
    }
  }

  private toggleAuthForm(): void {
    if (this.authForms) {
      switch (this.stateAuthForm) {
        case 'signup': {
          this.stateAuthForm = 'signin';
          this.authForms.classList.add('signin');
          this.authForms.classList.remove('signup');
          this.authFormToggle.textContent = 'Register';
          break;
        }

        case 'signin': {
          this.stateAuthForm = 'signup';
          this.authForms.classList.add('signup');
          this.authForms.classList.remove('signin');
          this.authFormToggle.textContent = 'Login';
          break;
        }

        default:
          break;
      }
    }
  }

  private getAuthForm(): string {
    return `<div class="auth signin" id="auth">
    <div class="auth__wrap">
      <div class="auth__content">

        <div class="auth__signin">
          <form action="#" class="auth__form signin-form-js">
            <input type="email" class="auth__input auth__email" placeholder="Email" id="email-signin">
            <input type="password" class="auth__input auth__pass" placeholder="Password" id="password-signin">
            <div class="auth__error"></div>
            <button type="submit" class="auth__submit">Sign In</button>
          </form>
        </div>

        <div class="auth__signup">
          <form action="#" class="auth__form signup-form-js">
            <input type="email" class="auth__input auth__email" placeholder="Email" id="email-signup">
            <input type="password" class="auth__input auth__pass" placeholder="Password" id="password-signup">
            <div class="auth__error"></div>
            <button type="submit" class="auth__submit">Sign Up</button>
          </form>
        </div>

        <button type="button" class="auth__toggle auth-form-toggle-js">Register</button>
      </div>
    </div>
  </div>`;
  }
}

export default AuthUser;
