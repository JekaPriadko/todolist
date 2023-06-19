class Sidebar {
  private isOpen: boolean;
  private sidebar: HTMLElement;
  private sidebarToggleBtn: HTMLElement;
  private sidebarToggleBtnIcon: SVGUseElement;
  private pathSprite: String;

  constructor() {
    this.isOpen = true;

    this.sidebar = document.getElementById('sidebar');
    this.sidebarToggleBtn = document.getElementById('toggle-sidebar');
    this.sidebarToggleBtnIcon = this.sidebarToggleBtn.querySelector('use');
    this.pathSprite = this.sidebarToggleBtnIcon
      .getAttribute('xlink:href')
      .split('#')[0];

    this.sidebarToggleBtn.addEventListener('click', () => {
      this.toggle();
    });
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    this.sidebar.style.display = 'block';
    this.sidebarToggleBtnIcon.setAttribute(
      'xlink:href',
      `${this.pathSprite}#sidebar-collapse`
    );
    this.isOpen = true;
  }

  private close(): void {
    this.sidebar.style.display = 'none';
    this.sidebarToggleBtnIcon.setAttribute(
      'xlink:href',
      `${this.pathSprite}#sidebar-expand`
    );
    this.isOpen = false;
  }
}

export default Sidebar;
