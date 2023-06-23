import closePreloader from './loader';

class AuthUser {
  private root: HTMLElement | null;
  private authBlock: HTMLElement | null;
  private authFormToggle: HTMLElement | null;
  private authFormSignIn: HTMLElement | null;
  private authFormSignUp: HTMLElement | null;

  private stateAuthForm: 'signin' | 'signup';

  constructor() {
    this.root = document.getElementById('root');
    // need check auth
    const isAuth = false;

    if (!isAuth) {
      this.showAuthForm();
      this.authBlock = document.getElementById('auth');

      this.authFormToggle = this.authBlock.querySelector(
        '.auth-form-toggle-js'
      ) as HTMLElement;
      this.authFormToggle.addEventListener('click', () => {
        this.toggleAuthForm();
      });

      this.authFormSignIn = document.querySelector(
        '.signin-form-js'
      ) as HTMLFormElement;
      this.authFormSignIn.addEventListener('submit', (e) =>
        this.authSignInHandler(e)
      );

      this.authFormSignUp = document.querySelector(
        '.signup-form-js'
      ) as HTMLFormElement;
      this.authFormSignUp.addEventListener('submit', (e) =>
        this.authSignUpHandler(e)
      );
    }

    // need load info

    setTimeout(() => {
      closePreloader();
    }, 1000);
  }

  private showAuthForm(): void {
    this.stateAuthForm = 'signin';

    this.root.style.display = 'none';

    const div = document.createElement('div');
    div.className = 'auth signin';
    div.id = 'auth';
    div.innerHTML = this.renderAuthForm();

    document.body.append(div);
  }

  private authSignInHandler(e: Event): void {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const email = target.querySelector('.auth__email') as HTMLInputElement;
    const password = target.querySelector('.auth__pass') as HTMLInputElement;

    console.log(email.value, password.value);
  }
  private authSignUpHandler(e: Event): void {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const email = target.querySelector('.auth__email') as HTMLInputElement;
    const password = target.querySelector('.auth__pass') as HTMLInputElement;

    console.log(email.value, password.value);
    // Perform the sign-up request here
  }

  private toggleAuthForm(): void {
    if (this.stateAuthForm === 'signup') {
      this.stateAuthForm = 'signin';
      if (this.authBlock) {
        this.authBlock.classList.add('signin');
        this.authBlock.classList.remove('signup');
      }
    } else if (this.stateAuthForm === 'signin') {
      this.stateAuthForm = 'signup';
      if (this.authBlock) {
        this.authBlock.classList.add('signup');
        this.authBlock.classList.remove('signin');
      }
    }
  }

  private renderAuthForm(): string {
    return ` <div class="auth__wrap">
    <div class="auth__content">

      <div class="auth__signin">
        <form action="#" class="auth__form signin-form-js">
          <input type="email" class="auth__input auth__email" placeholder="Email" id="email-signin">
          <input type="password" class="auth__input auth__pass" placeholder="Password" id="password-signin">
          <button type="submit" class="auth__submit">Sign In</button>
        </form>
      </div>

      <div class="auth__signup">
        <form action="#" class="auth__form signup-form-js">
          <input type="email" class="auth__input auth__email" placeholder="Email" id="email-signup">
          <input type="password" class="auth__input auth__pass" placeholder="Password" id="password-signup">
          <button type="submit" class="auth__submit">Sign Up</button>
        </form>
      </div>

      <button type="button" class="auth__toggle auth-form-toggle-js">Register</button>
    </div>
  </div>`;
  }
}

export default AuthUser;
