// 확대/축소 관리자
export class MagnifierManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.zoomLevel = 100;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.currentPosition = { x: 0, y: 0 };
  }

  // 확대/축소 초기화
  initMagnifier() {
    const elements = this.uiManager.getElements();

    // 확대/축소 버튼 이벤트
    if (elements.zoomInBtn) {
      elements.zoomInBtn.addEventListener('click', () => this.zoomIn());
    }
    if (elements.zoomOutBtn) {
      elements.zoomOutBtn.addEventListener('click', () => this.zoomOut());
    }
    if (elements.resetZoomBtn) {
      elements.resetZoomBtn.addEventListener('click', () => this.resetZoom());
    }

    // 드래그 이벤트 초기화
    this.initDragEvents();
  }

  // 확대
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + 25, 300);
    this.applyZoom();
  }

  // 축소
  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - 25, 25);
    this.applyZoom();
  }

  // 확대/축소 리셋
  resetZoom() {
    this.zoomLevel = 100;
    this.currentPosition = { x: 0, y: 0 };
    this.applyZoom();
  }

  // 확대/축소 적용
  applyZoom() {
    const elements = this.uiManager.getElements();
    const processedImage = elements.processedImage;
    const originalImage = elements.originalImage;

    if (processedImage && processedImage.src) {
      processedImage.style.transform = `scale(${this.zoomLevel / 100}) translate(${this.currentPosition.x}px, ${this.currentPosition.y}px)`;
      processedImage.style.transformOrigin = 'center';
    }

    if (originalImage && originalImage.src) {
      originalImage.style.transform = `scale(${this.zoomLevel / 100}) translate(${this.currentPosition.x}px, ${this.currentPosition.y}px)`;
      originalImage.style.transformOrigin = 'center';
    }

    this.updateZoomButtons();
  }

  // 확대/축소 버튼 상태 업데이트
  updateZoomButtons() {
    const elements = this.uiManager.getElements();

    if (elements.zoomLevel) {
      elements.zoomLevel.textContent = `${this.zoomLevel}%`;
    }

    // 버튼 활성화/비활성화
    if (elements.zoomInBtn) {
      elements.zoomInBtn.disabled = this.zoomLevel >= 300;
    }
    if (elements.zoomOutBtn) {
      elements.zoomOutBtn.disabled = this.zoomLevel <= 25;
    }
  }

  // 드래그 이벤트 초기화
  initDragEvents() {
    const elements = this.uiManager.getElements();
    const processedImage = elements.processedImage;
    const originalImage = elements.originalImage;

    if (processedImage) {
      processedImage.addEventListener('mousedown', (e) => this.startDrag(e));
    }
    if (originalImage) {
      originalImage.addEventListener('mousedown', (e) => this.startDrag(e));
    }

    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());
  }

  // 드래그 시작
  startDrag(e) {
    if (this.zoomLevel <= 100) return;

    this.isDragging = true;
    this.dragStart = {
      x: e.clientX - this.currentPosition.x,
      y: e.clientY - this.currentPosition.y
    };

    e.preventDefault();
  }

  // 드래그 중
  drag(e) {
    if (!this.isDragging) return;

    this.currentPosition = {
      x: e.clientX - this.dragStart.x,
      y: e.clientY - this.dragStart.y
    };

    this.applyZoom();
  }

  // 드래그 종료
  endDrag() {
    this.isDragging = false;
  }
}