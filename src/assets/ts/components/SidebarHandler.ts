class SidebarHandler {
  private isOpen: boolean;

  private readonly sidebar: HTMLElement;

  private readonly mainLayout: HTMLElement;

  private readonly sidebarToggleBtn: HTMLElement;

  private readonly sidebarToggleBtnIcon: SVGUseElement;

  private readonly pathSprite: string;

  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.mainLayout = document.getElementById('layout');
    this.sidebarToggleBtn = document.getElementById('toggle-sidebar');
    this.sidebarToggleBtnIcon = this.sidebarToggleBtn.querySelector('use');
    // eslint-disable-next-line
    this.pathSprite = this.sidebarToggleBtnIcon
      .getAttribute('xlink:href')
      .split('#')[0];
  }

  public run() {
    this.sidebarToggleBtn.addEventListener('click', () => {
      this.toggle();
    });

    this.mainLayout.addEventListener('click', () => {
      this.close();
    });

    window.addEventListener('resize', () => this.init());
    this.init();
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    this.sidebar.classList.add('active');

    this.sidebarToggleBtnIcon.setAttribute(
      'xlink:href',
      `${this.pathSprite}#sidebar-collapse`
    );
    this.isOpen = true;

    if (window.innerWidth < 640) this.mainLayout.classList.add('active');
  }

  public close(): void {
    this.sidebar.classList.remove('active');

    this.sidebarToggleBtnIcon.setAttribute(
      'xlink:href',
      `${this.pathSprite}#sidebar-expand`
    );
    this.isOpen = false;
    this.mainLayout.classList.remove('active');
  }

  private init(): void {
    this.sidebar.classList.remove('active');
    this.isOpen = window.innerWidth > 640;
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }
}

export default SidebarHandler;
