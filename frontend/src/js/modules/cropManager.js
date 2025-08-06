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

  // 크롭 모드 토글 (내부용)
  _toggleCropMode() {
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

  // 크롭 모드 토글 (앱에서 호출)
  toggleCropMode(app) {
    const originalFile = app.fileUploader.getOriginalFile();
    if (!originalFile) {
      app.uiManager.showWarningMessage('먼저 이미지를 업로드해주세요.');
      return false;
    }

    const isCropMode = this._toggleCropMode();
    const elements = app.uiManager.getElements();

    app.uiManager.toggleCropSection(isCropMode);

    if (isCropMode) {
      // 처리된 이미지가 있으면 처리된 이미지를, 없으면 원본 이미지를 사용
      const imageSource = app.processedBlob ? elements.processedImage.src : elements.originalImage.src;
      app.uiManager.setImageSource(elements.cropImage, imageSource);
      this.initCrop(elements.cropImage, elements.cropOverlay);

      // 초기 크롭 정보 업데이트
      this.updateCropInfo(app.uiManager);
    } else {
      // 크롭 모드 종료 시 버튼 텍스트 업데이트
      this.updateCropButtonText(app);
    }

    return isCropMode;
  }

  // 크롭 버튼 텍스트 업데이트
  updateCropButtonText(app) {
    const elements = app.uiManager.getElements();
    const originalFile = app.fileUploader.getOriginalFile();

    // 크롭 버튼 텍스트 및 상태 업데이트
    if (elements.cropBtn) {
      if (!originalFile) {
        elements.cropBtn.textContent = '크롭 모드';
        elements.cropBtn.disabled = true;
      } else if (app.processedBlob) {
        elements.cropBtn.textContent = '처리된 이미지 크롭';
        elements.cropBtn.disabled = false;
      } else {
        elements.cropBtn.textContent = '원본 이미지 크롭';
        elements.cropBtn.disabled = false;
      }
    }

    // 다른 버튼들 상태 업데이트
    if (elements.processBtn) {
      elements.processBtn.disabled = !originalFile;
    }
    if (elements.resetImageBtn) {
      elements.resetImageBtn.disabled = !originalFile;
    }
  }

  // 크롭 input 값 변경 처리
  handleCropInputChange(app) {
    const elements = app.uiManager.getElements();
    const x = parseInt(elements.cropX.value) || 0;
    const y = parseInt(elements.cropY.value) || 0;
    const width = parseInt(elements.cropWidth.value) || 1;
    const height = parseInt(elements.cropHeight.value) || 1;

    // input 값으로 크롭 영역 설정
    this.setCropFromInput(x, y, width, height, elements.cropImage, elements.cropOverlay);
  }

  // 크롭 적용
  async applyCrop(app) {
    const originalFile = app.fileUploader.getOriginalFile();
    if (!originalFile) {
      app.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    try {
      const elements = app.uiManager.getElements();
      const cropData = this.getCropData();
      const format = elements.formatSelect.value;

      // 이미지 크기 정보 추가
      cropData.imageWidth = elements.cropImage.offsetWidth;
      cropData.imageHeight = elements.cropImage.offsetHeight;

      // 확장자별 설정 구성
      const options = {
        format: format,
        jpegQuality: parseInt(elements.jpegQualitySlider.value) / 100,
        pngCompression: parseInt(elements.pngCompressionSlider.value),
        webpQuality: parseInt(elements.webpQualitySlider.value) / 100,
        webpTransparency: elements.webpTransparency.checked
      };

      // 크롭할 이미지 소스 결정 (처리된 이미지가 있으면 그것을, 없으면 원본 파일을 사용)
      let sourceBlob = app.processedBlob;
      let sourceFile = originalFile;

      if (!sourceBlob) {
        // 원본 파일을 Blob으로 변환
        sourceBlob = originalFile;
        sourceFile = originalFile;
      }

      app.processedBlob = await app.imageProcessor.cropImage(sourceBlob, cropData, options);
      const url = URL.createObjectURL(app.processedBlob);
      app.uiManager.setImageSource(elements.processedImage, url);

      // 크롭된 이미지 정보 업데이트 (Blob을 Base64로 변환)
      const reader = new FileReader();
      reader.onload = () => {
        const processedBase64 = reader.result;
        // 원본 파일도 Base64로 변환
        const originalReader = new FileReader();
        originalReader.onload = () => {
          const originalBase64 = originalReader.result;
          // 처리된 이미지 정보 업데이트
          app.imageInfoManager.updateProcessedImageInfo(processedBase64, originalBase64);
        };
        originalReader.readAsDataURL(sourceFile);
      };
      reader.readAsDataURL(app.processedBlob);

      // 크롭 모드 종료
      this.cancelCropMode(app);

      // 성공 메시지
      const originalSize = app.imageProcessor.formatFileSize(sourceFile.size);
      const newSize = app.imageProcessor.formatFileSize(app.processedBlob.size);
      app.uiManager.showSuccessMessage(originalSize, newSize);
    } catch (error) {
      console.error('크롭 처리 중 오류:', error);
      app.uiManager.showAlert('크롭 처리 중 오류가 발생했습니다.');
    }
  }

  // 크롭 취소
  cancelCropMode(app) {
    const elements = app.uiManager.getElements();

    // 크롭 모드 종료
    this.cancelCrop(elements.cropOverlay);
    app.uiManager.toggleCropSection(false);

    // 버튼 상태 업데이트
    this.updateCropButtonText(app);
  }
}