class DraggerHandler {
  private content: HTMLElement | null;

  private sidebar: HTMLElement | null;

  private details: HTMLElement | null;

  private sidebarDragger: HTMLElement | null;

  private detailsDragger: HTMLElement | null;

  private isResizingSidebar: boolean;

  private isResizingDetails: boolean;

  private lastDownX: number;

  private readonly minW: number;

  private readonly maxWSidebar: number;

  private minWContent: number;

  constructor() {
    this.content = document.getElementById('main');
    this.sidebar = document.getElementById('sidebar');
    this.details = document.getElementById('details');
    this.sidebarDragger = document.getElementById('dragger-sidebar');
    this.detailsDragger = document.getElementById('dragger-details');

    this.isResizingSidebar = false;
    this.isResizingDetails = false;
    this.lastDownX = 0;

    this.minW = 260;
    this.maxWSidebar = 450;
  }

  public run() {
    if (this.sidebar && this.sidebarDragger) {
      this.sidebarDragger.addEventListener('mousedown', (e) =>
        this.handleMouseDown('sidebar', e)
      );
    }

    if (this.details && this.detailsDragger) {
      this.detailsDragger.addEventListener('mousedown', (e) =>
        this.handleMouseDown('details', e)
      );
    }
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mouseup', () => this.handleMouseUp());

    this.handleMinWidthContent();
    window.addEventListener('resize', () => this.handleMinWidthContent());
  }

  private handleMouseDown(block: 'sidebar' | 'details', e: MouseEvent) {
    if (block === 'sidebar') {
      this.isResizingSidebar = true;
    } else if (block === 'details') {
      this.isResizingDetails = true;
    }

    this.lastDownX = e.clientX;
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.isResizingSidebar) {
      this.resizeSidebar(e);
    } else if (this.isResizingDetails) {
      this.resizeDetails(e);
    }
  }

  private handleMouseUp() {
    this.isResizingSidebar = false;
    this.isResizingDetails = false;
  }

  private resizeSidebar(e: MouseEvent) {
    const sidebarWidth = this.sidebar.offsetWidth;
    const deltaX = e.clientX - this.lastDownX;

    const newSidebarWidth = sidebarWidth + deltaX;

    const contentWidth = this.content?.offsetWidth ?? 0;
    if (contentWidth <= this.minWContent && newSidebarWidth > sidebarWidth) {
      this.resizeDetails(e);
      return;
    }

    if (newSidebarWidth > this.minW && newSidebarWidth < this.maxWSidebar) {
      this.sidebar.style.width = `${newSidebarWidth}px`;
    }

    this.lastDownX = e.clientX;
  }

  private resizeDetails(e: MouseEvent) {
    if (!this.details) return;

    const detailsWidth = this.details.offsetWidth;
    const deltaX = e.clientX - this.lastDownX;
    const newDetailsWidth = detailsWidth - deltaX;

    const contentWidth = this.content?.offsetWidth ?? 0;
    if (contentWidth <= this.minWContent && newDetailsWidth > detailsWidth) {
      this.resizeSidebar(e);
      return;
    }

    if (newDetailsWidth > this.minW) {
      this.details.style.width = `${newDetailsWidth}px`;
    }

    this.lastDownX = e.clientX;
  }

  private handleMinWidthContent() {
    this.minWContent = Math.round(window.innerWidth * 0.4);
    this.sidebar.style.width = '';
    this.details.style.width = '';
  }
}

export default DraggerHandler;
