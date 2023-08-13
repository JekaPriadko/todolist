import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';

import errorText from '../../const/errorText';
import firebase from '../../firebase';

type StateAuthForm = 'signin' | 'signup';

class AuthUser {
  private authForms: HTMLElement | null;

  private authFormToggle: HTMLElement | null;

  private authFormSignIn: HTMLElement | null;

  private authFormSignUp: HTMLElement | null;

  private authBtnSignOut: HTMLElement | null;

  private user: User;

  private stateAuthForm: StateAuthForm;

  // eslint-disable-next-line
  private readyResolver: any;

  private readonly readyPromise: Promise<void>;

  constructor() {
    this.authForms = null;
    this.authFormToggle = null;
    this.authFormSignIn = null;
    this.authFormSignUp = null;
    this.authBtnSignOut = null;
    this.user = null;
    this.stateAuthForm = 'signin';
    this.readyPromise = new Promise((resolve) => {
      this.readyResolver = resolve;
    });

    this.checkAuthUser();
  }

  public isReadyUser() {
    return this.readyPromise;
  }

  public isAuth() {
    return !!this.getUser();
  }

  public getUser() {
    return this.user;
  }

  private checkAuthUser(): void {
    const auth = getAuth(firebase);
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.authViewHandler();
      document.dispatchEvent(new Event('changeAuthState'));
      this.readyResolver();
    });
  }

  private async authViewHandler(): Promise<void> {
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
      if (this.authForms) return;
      this.showAuthForm();
    }
  }

  private showAuthForm(): void {
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

  private removeAuthForm(): void {
    if (this.authForms) {
      this.authForms.remove();
      this.authForms = null;
    }
  }

  private async signOutUser(): Promise<void> {
    const auth = getAuth(firebase);

    try {
      await signOut(auth);
      const domainURL = window.location.origin;
      window.location.href = domainURL;
    } catch (error) {
      console.log(error);
    }
  }

  private authSignInHandler(e: Event): Promise<void> {
    return this.handleAuthAction(e, 'signIn');
  }

  private authSignUpHandler(e: Event): Promise<void> {
    return this.handleAuthAction(e, 'signUp');
  }

  private async handleAuthAction(
    e: Event,
    action: 'signIn' | 'signUp'
  ): Promise<void> {
    e.preventDefault();

    const auth = getAuth(firebase);

    const target = e.target as HTMLFormElement;
    const email = target.querySelector('.auth__email') as HTMLInputElement;
    const password = target.querySelector('.auth__pass') as HTMLInputElement;
    const authFormError = target.querySelector('.auth__error');

    try {
      if (action === 'signIn') {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        authFormError.innerHTML = '';
      } else {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        authFormError.innerHTML = '';
      }
    } catch (error) {
      const errorCode = error.code;
      if (authFormError) {
        console.log(errorCode);
        authFormError.innerHTML = errorText(errorCode);
      }
    }
  }

  private toggleAuthForm(): void {
    if (this.authForms) {
      this.stateAuthForm =
        this.stateAuthForm === 'signin' ? 'signup' : 'signin';
      this.authForms.classList.toggle(
        'signin',
        this.stateAuthForm === 'signin'
      );
      this.authForms.classList.toggle(
        'signup',
        this.stateAuthForm === 'signup'
      );

      this.authFormToggle.textContent =
        this.stateAuthForm === 'signin' ? 'Register' : 'Login';
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
