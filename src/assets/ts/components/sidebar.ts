class Sidebar {
  private isOpen: boolean;
  private sidebar: HTMLElement;
  private mainLayout: HTMLElement;
  private sidebarToggleBtn: HTMLElement;
  private sidebarToggleBtnIcon: SVGUseElement;
  private pathSprite: string;

  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.mainLayout = document.getElementById('layout');
    this.sidebarToggleBtn = document.getElementById('toggle-sidebar');
    this.sidebarToggleBtnIcon = this.sidebarToggleBtn.querySelector('use');
    this.pathSprite = this.sidebarToggleBtnIcon
      .getAttribute('xlink:href')
      .split('#')[0];

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
    this.isOpen ? this.close() : this.open();
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
    this.isOpen = window.innerWidth > 640 ? true : false;
    this.isOpen ? this.open() : this.close();
  }
}

export default Sidebar;
