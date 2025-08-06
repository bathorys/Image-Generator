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
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      dragStartX: 0,
      dragStartY: 0,
      mouseStartX: 0,
      mouseStartY: 0
    };
    this.isCropMode = false;
  }

      // 크롭 초기화
  initCrop(cropImage, cropOverlay) {
    // 이미지가 로드되었는지 확인하고 크기 가져오기
    const getImageSize = () => {
      // 여러 방법으로 크기 가져오기 시도
      let imgWidth = cropImage.offsetWidth;
      let imgHeight = cropImage.offsetHeight;

      // offsetWidth/offsetHeight가 0이면 다른 방법 시도
      if (imgWidth === 0 || imgHeight === 0) {
        const rect = cropImage.getBoundingClientRect();
        imgWidth = rect.width;
        imgHeight = rect.height;
      }

      // 여전히 0이면 naturalWidth/naturalHeight 사용
      if (imgWidth === 0 || imgHeight === 0) {
        imgWidth = cropImage.naturalWidth;
        imgHeight = cropImage.naturalHeight;
      }

            return { width: imgWidth, height: imgHeight };
    };

    const initializeCrop = () => {
      const { width: imgWidth, height: imgHeight } = getImageSize();

      // 크기가 여전히 0이면 재시도
      if (imgWidth === 0 || imgHeight === 0) {
        setTimeout(initializeCrop, 100);
        return;
      }

      // 이미지 크기와 동일하게 초기 크롭 영역 설정
      this.cropData.x = 0;
      this.cropData.y = 0;
      this.cropData.width = imgWidth;
      this.cropData.height = imgHeight;

      // 먼저 크기를 설정한 후 active 클래스 추가
      this.updateCropOverlay(cropOverlay);

      // 약간의 지연 후 active 클래스 추가 (크기가 적용된 후)
      setTimeout(() => {
        cropOverlay.classList.add('active');
      }, 10);
    };

    // 이미지가 완전히 로드되었는지 확인
    if (cropImage.complete && cropImage.naturalHeight !== 0) {
      initializeCrop();
    } else {
      // 이미지 로드 완료를 기다림
      cropImage.addEventListener('load', initializeCrop, { once: true });
      // 이미 로드된 경우를 대비해 즉시 시도
      setTimeout(initializeCrop, 100);
    }
  }

  // 크롭 오버레이 업데이트
  updateCropOverlay(cropOverlay) {
    // 크기가 유효한지 확인
    if (this.cropData.width > 0 && this.cropData.height > 0) {
      cropOverlay.style.left = this.cropData.x + 'px';
      cropOverlay.style.top = this.cropData.y + 'px';
      cropOverlay.style.width = this.cropData.width + 'px';
      cropOverlay.style.height = this.cropData.height + 'px';
    }
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
    this.cropData.dragStartX = e.clientX - this.cropData.x;
    this.cropData.dragStartY = e.clientY - this.cropData.y;
    e.preventDefault();
  }

  // 크롭 리사이즈 시작
  startCropResize(e, handle) {
    this.cropData.isResizing = true;
    this.cropData.resizeHandle = handle;
    this.cropData.startX = this.cropData.x; // 크롭 박스의 시작 X 위치
    this.cropData.startY = this.cropData.y; // 크롭 박스의 시작 Y 위치
    this.cropData.startWidth = this.cropData.width;
    this.cropData.startHeight = this.cropData.height;
    this.cropData.mouseStartX = e.clientX; // 마우스 시작 X 위치
    this.cropData.mouseStartY = e.clientY; // 마우스 시작 Y 위치
    e.preventDefault();
    e.stopPropagation();
  }

  // 크롭 마우스 이동 처리
  handleCropMouseMove(e, cropImage, cropOverlay) {
    if (!this.cropData.isDragging && !this.cropData.isResizing) return;

    const imgRect = cropImage.getBoundingClientRect();
    const minSize = 50; // 최소 크기

    if (this.cropData.isDragging) {
      // 드래그 처리 - 가운데 영역을 잡고 드래그
      let newX = e.clientX - this.cropData.dragStartX;
      let newY = e.clientY - this.cropData.dragStartY;

      // 경계 체크 - 이미지를 벗어나지 않도록
      newX = Math.max(0, Math.min(newX, imgRect.width - this.cropData.width));
      newY = Math.max(0, Math.min(newY, imgRect.height - this.cropData.height));

      this.cropData.x = newX;
      this.cropData.y = newY;
    } else if (this.cropData.isResizing) {
      // 리사이즈 처리 - 마우스 이동 거리 기준으로 계산
      const deltaX = e.clientX - this.cropData.mouseStartX;
      const deltaY = e.clientY - this.cropData.mouseStartY;

      switch (this.cropData.resizeHandle) {
        case 'se':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth + deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.startHeight + deltaY);
          break;
        case 'sw':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth - deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.startHeight + deltaY);
          this.cropData.x = Math.max(0, this.cropData.startX + deltaX);
          break;
        case 'ne':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth + deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.startHeight - deltaY);
          this.cropData.y = Math.max(0, this.cropData.startY + deltaY);
          break;
        case 'nw':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth - deltaX);
          this.cropData.height = Math.max(minSize, this.cropData.startHeight - deltaY);
          this.cropData.x = Math.max(0, this.cropData.startX + deltaX);
          this.cropData.y = Math.max(0, this.cropData.startY + deltaY);
          break;
        case 'n':
          this.cropData.height = Math.max(minSize, this.cropData.startHeight - deltaY);
          this.cropData.y = Math.max(0, this.cropData.startY + deltaY);
          break;
        case 's':
          this.cropData.height = Math.max(minSize, this.cropData.startHeight + deltaY);
          break;
        case 'e':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth + deltaX);
          break;
        case 'w':
          this.cropData.width = Math.max(minSize, this.cropData.startWidth - deltaX);
          this.cropData.x = Math.max(0, this.cropData.startX + deltaX);
          break;
      }

      // 경계 체크 - 이미지를 벗어나지 않도록
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