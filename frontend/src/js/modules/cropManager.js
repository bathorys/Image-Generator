// 크롭 관리 모듈
export class CropManager {
  constructor() {
    this.cropData = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      isDragging: false,
      isResizing: false,
      resizeHandle: null,
      startX: 0,
      startY: 0
    };
    this.isCropMode = false;
  }

  // 크롭 초기화
  initCrop(cropImage, cropOverlay) {
    const imgRect = cropImage.getBoundingClientRect();

    // 이미지 크기의 80%로 초기 크롭 영역 설정
    const initialWidth = imgRect.width * 0.8;
    const initialHeight = imgRect.height * 0.8;
    const initialX = (imgRect.width - initialWidth) / 2;
    const initialY = (imgRect.height - initialHeight) / 2;

    this.cropData.x = initialX;
    this.cropData.y = initialY;
    this.cropData.width = initialWidth;
    this.cropData.height = initialHeight;

    this.updateCropOverlay(cropOverlay);
    cropOverlay.classList.add('active');
  }

  // 크롭 오버레이 업데이트
  updateCropOverlay(cropOverlay) {
    cropOverlay.style.left = this.cropData.x + 'px';
    cropOverlay.style.top = this.cropData.y + 'px';
    cropOverlay.style.width = this.cropData.width + 'px';
    cropOverlay.style.height = this.cropData.height + 'px';
  }

  // 크롭 정보 업데이트 (UI 매니저에 전달)
  updateCropInfo(uiManager) {
    if (uiManager && uiManager.updateCropInfo) {
      uiManager.updateCropInfo(
        this.cropData.x,
        this.cropData.y,
        this.cropData.width,
        this.cropData.height
      );
    }
  }

  // input 값으로 크롭 영역 설정
  setCropFromInput(x, y, width, height, cropImage, cropOverlay) {
    // 이미지의 실제 크기 사용 (offsetWidth/Height는 이미지의 실제 크기)
    const imageWidth = cropImage.offsetWidth;
    const imageHeight = cropImage.offsetHeight;

    // 값 범위 제한
    this.cropData.x = Math.max(0, Math.min(x, imageWidth - width));
    this.cropData.y = Math.max(0, Math.min(y, imageHeight - height));
    this.cropData.width = Math.max(1, Math.min(width, imageWidth - this.cropData.x));
    this.cropData.height = Math.max(1, Math.min(height, imageHeight - this.cropData.y));

        // 크롭 오버레이 업데이트
    this.updateCropOverlay(cropOverlay);
  }

  // 크롭 드래그 시작
  startCropDrag(e, cropOverlay) {
    if (e.target.classList.contains('crop-handle')) return;

    this.cropData.isDragging = true;
    this.cropData.startX = e.clientX - this.cropData.x;
    this.cropData.startY = e.clientY - this.cropData.y;
    e.preventDefault();
  }

  // 크롭 리사이즈 시작
  startCropResize(e, handle) {
    this.cropData.isResizing = true;
    this.cropData.resizeHandle = handle;
    this.cropData.startX = e.clientX;
    this.cropData.startY = e.clientY;
    e.preventDefault();
    e.stopPropagation();
  }

  // 크롭 마우스 이동 처리
  handleCropMouseMove(e, cropImage, cropOverlay) {
    if (!this.cropData.isDragging && !this.cropData.isResizing) return;

    const imgRect = cropImage.getBoundingClientRect();
    const minSize = 50; // 최소 크기

    if (this.cropData.isDragging) {
      // 드래그 처리
      let newX = e.clientX - this.cropData.startX;
      let newY = e.clientY - this.cropData.startY;

      // 경계 체크
      newX = Math.max(0, Math.min(newX, imgRect.width - this.cropData.width));
      newY = Math.max(0, Math.min(newY, imgRect.height - this.cropData.height));

      this.cropData.x = newX;
      this.cropData.y = newY;
    } else if (this.cropData.isResizing) {
      // 리사이즈 처리
      const deltaX = e.clientX - this.cropData.startX;
      const deltaY = e.clientY - this.cropData.startY;

      switch (this.cropData.resizeHandle) {
        case 'se':
          this.cropData.width = Math.max(minSize, this.cropData.width + deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.height + deltaY);
          break;
        case 'sw':
          this.cropData.width = Math.max(minSize, this.cropData.width - deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.height + deltaY);
          this.cropData.x = Math.max(0, this.cropData.x + deltaX);
          break;
        case 'ne':
          this.cropData.width = Math.max(minSize, this.cropData.width + deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.height - deltaY);
          this.cropData.y = Math.max(0, this.cropData.y + deltaY);
          break;
        case 'nw':
          this.cropData.width = Math.max(minSize, this.cropData.width - deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.height - deltaY);
          this.cropData.x = Math.max(0, this.cropData.x + deltaX);
          this.cropData.y = Math.max(0, this.cropData.y + deltaY);
          break;
        case 'n':
          this.cropData.height = Math.max(minSize, this.cropData.height - deltaY);
          this.cropData.y = Math.max(0, this.cropData.y + deltaY);
          break;
        case 's':
          this.cropData.height = Math.max(minSize, this.cropData.height + deltaY);
          break;
        case 'w':
          this.cropData.width = Math.max(minSize, this.cropData.width - deltaX);
          this.cropData.x = Math.max(0, this.cropData.x + deltaX);
          break;
        case 'e':
          this.cropData.width = Math.max(minSize, this.cropData.width + deltaX);
          break;
      }

      // 경계 체크
      if (this.cropData.x + this.cropData.width > imgRect.width) {
        this.cropData.width = imgRect.width - this.cropData.x;
      }
      if (this.cropData.y + this.cropData.height > imgRect.height) {
        this.cropData.height = imgRect.height - this.cropData.y;
      }
    }

    this.updateCropOverlay(cropOverlay);
  }

  // 크롭 상호작용 중지
  stopCropInteraction() {
    this.cropData.isDragging = false;
    this.cropData.isResizing = false;
    this.cropData.resizeHandle = null;
  }

  // 크롭 모드 토글
  toggleCropMode() {
    this.isCropMode = !this.isCropMode;
    return this.isCropMode;
  }

  // 크롭 데이터 가져오기
  getCropData() {
    return { ...this.cropData };
  }

  // 크롭 모드 종료
  cancelCrop(cropOverlay) {
    this.isCropMode = false;
    cropOverlay.classList.remove('active');
    this.stopCropInteraction();
  }
}