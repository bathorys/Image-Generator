// 이벤트 관리자
export class EventManager {
  constructor(app) {
    this.app = app;
    this.uiManager = app.uiManager;
    this.fileUploader = app.fileUploader;
    this.cropManager = app.cropManager;
  }

  // 모든 이벤트 바인딩
  bindEvents() {
    const elements = this.uiManager.getElements();

    // 파일 업로드 이벤트
    this.bindFileEvents(elements);

    // 버튼 이벤트
    this.bindButtonEvents(elements);

    // 모달 이벤트
    this.bindModalEvents(elements);

    // 크롭 이벤트
    this.bindCropEvents(elements);
  }

  // 파일 관련 이벤트
  bindFileEvents(elements) {
    elements.fileInput.addEventListener('change', (e) => this.app.handleFileSelect(e));

    // 드래그 앤 드롭 이벤트
    const uploadSection = elements.uploadSection;
    uploadSection.addEventListener('click', () => elements.fileInput.click());
    uploadSection.addEventListener('dragover', (e) => this.fileUploader.handleDragOver(e, uploadSection));
    uploadSection.addEventListener('dragleave', (e) => this.fileUploader.handleDragLeave(e, uploadSection));
    uploadSection.addEventListener('drop', (e) => this.app.handleFileDrop(e));
  }

  // 버튼 이벤트
  bindButtonEvents(elements) {
    // 메인 액션 버튼
    elements.processBtn.addEventListener('click', () => this.app.processImage());
    elements.cropBtn.addEventListener('click', () => this.app.toggleCropMode());
    elements.resetImageBtn.addEventListener('click', () => this.app.resetImage());
    elements.resetBtn.addEventListener('click', () => this.app.resetApp());

    // 작업물 관련 버튼
    elements.saveWorkBtn.addEventListener('click', () => this.app.showSaveWorkModal());
    elements.loadWorkBtn.addEventListener('click', () => this.app.showWorkListModal());
    elements.autoSaveBtn.addEventListener('click', () => this.app.toggleAutoSave());
    elements.clearWorksBtn.addEventListener('click', () => this.app.clearAllWorks());

    // 다운로드 버튼
    elements.downloadMultiBtn.addEventListener('click', () => this.app.downloadMultipleSizes());
  }

  // 모달 이벤트
  bindModalEvents(elements) {
    elements.closeWorkModal.addEventListener('click', () => this.app.hideWorkModal());
    elements.closeWorkSaveModal.addEventListener('click', () => this.app.hideSaveWorkModal());
    elements.confirmSaveWorkBtn.addEventListener('click', () => this.app.saveWork());
    elements.cancelSaveWorkBtn.addEventListener('click', () => this.app.hideSaveWorkModal());
  }

  // 크롭 이벤트
  bindCropEvents(elements) {
    elements.applyCropBtn.addEventListener('click', () => this.cropManager.applyCrop(this.app));
    elements.cancelCropBtn.addEventListener('click', () => this.cropManager.cancelCropMode(this.app));
  }

  // 크롭 이벤트 초기화
  initCropEvents() {
    const elements = this.uiManager.getElements();

    // 크롭 컨테이너 이벤트 (이미지 영역)
    elements.cropImage.addEventListener('mousedown', (e) => {
      if (this.cropManager.isCropMode) {
        this.cropManager.startCropDrag(e, elements.cropOverlay);
        // 전역 마우스 이벤트 추가
        document.addEventListener('mousemove', this.app.globalCropMouseMove);
        document.addEventListener('mouseup', this.app.globalCropMouseUp);
      }
    });

    // 크롭 오버레이 이벤트 (크롭 박스 자체)
    elements.cropOverlay.addEventListener('mousedown', (e) => {
      if (this.cropManager.isCropMode && !e.target.classList.contains('crop-handle')) {
        this.cropManager.startCropDrag(e, elements.cropOverlay);
        // 전역 마우스 이벤트 추가
        document.addEventListener('mousemove', this.app.globalCropMouseMove);
        document.addEventListener('mouseup', this.app.globalCropMouseUp);
      }
    });

    // 전역 마우스 이벤트 핸들러를 인스턴스에 바인딩
    this.app.globalCropMouseMove = (e) => {
      if (this.cropManager.isCropMode) {
        this.app.handleCropMouseMove(e);
      }
    };

    this.app.globalCropMouseUp = () => {
      if (this.cropManager.isCropMode) {
        this.cropManager.stopCropInteraction();
        // 전역 이벤트 제거
        document.removeEventListener('mousemove', this.app.globalCropMouseMove);
        document.removeEventListener('mouseup', this.app.globalCropMouseUp);
      }
    };

    // 크롭 핸들 이벤트 (8개 핸들)
    const handles = [
      elements.cropHandleNW,
      elements.cropHandleN,
      elements.cropHandleNE,
      elements.cropHandleW,
      elements.cropHandleE,
      elements.cropHandleSW,
      elements.cropHandleS,
      elements.cropHandleSE
    ];

    handles.forEach(handle => {
      if (handle) {
        handle.addEventListener('mousedown', (e) => {
          if (this.cropManager.isCropMode) {
            const handleType = handle.getAttribute('data-position');
            this.cropManager.startCropResize(e, handleType);
            // 전역 마우스 이벤트 추가
            document.addEventListener('mousemove', this.app.globalCropMouseMove);
            document.addEventListener('mouseup', this.app.globalCropMouseUp);
          }
        });
      }
    });

    // 터치 이벤트 지원 (이미지 영역)
    elements.cropImage.addEventListener('touchstart', (e) => {
      if (this.cropManager.isCropMode) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.cropManager.startCropDrag(mouseEvent, elements.cropOverlay);
        // 전역 터치 이벤트 추가
        document.addEventListener('touchmove', this.app.globalCropTouchMove);
        document.addEventListener('touchend', this.app.globalCropTouchEnd);
      }
    });

    // 터치 이벤트 지원 (크롭 박스 자체)
    elements.cropOverlay.addEventListener('touchstart', (e) => {
      if (this.cropManager.isCropMode && !e.target.classList.contains('crop-handle')) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.cropManager.startCropDrag(mouseEvent, elements.cropOverlay);
        // 전역 터치 이벤트 추가
        document.addEventListener('touchmove', this.app.globalCropTouchMove);
        document.addEventListener('touchend', this.app.globalCropTouchEnd);
      }
    });

    // 전역 터치 이벤트 핸들러
    this.app.globalCropTouchMove = (e) => {
      if (this.cropManager.isCropMode) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.app.handleCropMouseMove(mouseEvent);
      }
    };

    this.app.globalCropTouchEnd = () => {
      if (this.cropManager.isCropMode) {
        this.cropManager.stopCropInteraction();
        // 전역 터치 이벤트 제거
        document.removeEventListener('touchmove', this.app.globalCropTouchMove);
        document.removeEventListener('touchend', this.app.globalCropTouchEnd);
      }
    };

    // 크롭 핸들 터치 이벤트
    handles.forEach(handle => {
      if (handle) {
        handle.addEventListener('touchstart', (e) => {
          if (this.cropManager.isCropMode) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
              clientX: touch.clientX,
              clientY: touch.clientY
            });
            const handleType = handle.getAttribute('data-position');
            this.cropManager.startCropResize(mouseEvent, handleType);
            // 전역 터치 이벤트 추가
            document.addEventListener('touchmove', this.app.globalCropTouchMove);
            document.addEventListener('touchend', this.app.globalCropTouchEnd);
          }
        });
      }
    });
  }
}