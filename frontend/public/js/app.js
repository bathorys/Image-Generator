// 메인 애플리케이션
import { ImageProcessor } from '/Image-Generator/js/modules/imageProcessor.js';
import { CropManager } from '/Image-Generator/js/modules/cropManager.js';
import { FileUploader } from '/Image-Generator/js/modules/fileUploader.js';
import { UIManager } from '/Image-Generator/js/modules/uiManager.js';
import { WorkManager } from '/Image-Generator/js/modules/workManager.js';

export class ImageGeneratorApp {
  constructor() {
    this.imageProcessor = new ImageProcessor();
    this.cropManager = new CropManager();
    this.fileUploader = new FileUploader();
    this.uiManager = new UIManager();
    this.workManager = new WorkManager();
    this.autoSaveEnabled = false;
    this.processedBlob = null;
  }

      // 애플리케이션 초기화
  async init() {
    this.uiManager.initializeElements();
    this.bindEvents();
    this.initMagnifier();
    this.initFormatControls();

    // 자동 저장된 작업물이 있는지 확인
    await this.checkAutoSave();

    // 초기 버튼 상태 설정
    this.updateButtonStates();

    // 업로드 섹션 자동저장 버튼 초기 상태 설정
    const elements = this.uiManager.getElements();
    elements.uploadAutoSaveBtn.textContent = this.autoSaveEnabled ? '🔄 자동저장 ON' : '🔄 자동저장';
    elements.uploadAutoSaveBtn.classList.toggle('btn-success', this.autoSaveEnabled);
    elements.uploadAutoSaveBtn.classList.toggle('btn-warning', !this.autoSaveEnabled);
  }

  // 이벤트 바인딩
  bindEvents() {
    const elements = this.uiManager.getElements();

    // 파일 업로드 이벤트
    elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // 드래그 앤 드롭 이벤트
    const uploadSection = elements.uploadSection;
    uploadSection.addEventListener('click', () => elements.fileInput.click());
    uploadSection.addEventListener('dragover', (e) => this.fileUploader.handleDragOver(e, uploadSection));
    uploadSection.addEventListener('dragleave', (e) => this.fileUploader.handleDragLeave(e, uploadSection));
    uploadSection.addEventListener('drop', (e) => this.handleFileDrop(e));

    // 버튼 이벤트
    elements.processBtn.addEventListener('click', () => this.processImage());
    elements.cropBtn.addEventListener('click', () => this.toggleCropMode());

    elements.resetImageBtn.addEventListener('click', () => this.resetImage());
    elements.resetBtn.addEventListener('click', () => this.resetApp());

    // 작업물 관련 버튼 이벤트
    elements.saveWorkBtn.addEventListener('click', () => this.showSaveWorkModal());
    elements.loadWorkBtn.addEventListener('click', () => this.showWorkListModal());
    elements.autoSaveBtn.addEventListener('click', () => this.toggleAutoSave());
    elements.clearWorksBtn.addEventListener('click', () => this.clearAllWorks());

    // 업로드 섹션 작업물 관련 버튼 이벤트
    elements.uploadLoadWorkBtn.addEventListener('click', () => this.showWorkListModal());
    elements.uploadAutoSaveBtn.addEventListener('click', () => this.toggleAutoSave());

    // 모달 관련 이벤트
    elements.closeWorkModal.addEventListener('click', () => this.hideWorkModal());
    elements.closeWorkSaveModal.addEventListener('click', () => this.hideSaveWorkModal());
    elements.confirmSaveWorkBtn.addEventListener('click', () => this.saveWork());
    elements.cancelSaveWorkBtn.addEventListener('click', () => this.hideSaveWorkModal());

    // 크롭 관련 이벤트
    elements.applyCropBtn.addEventListener('click', () => this.applyCrop());
    elements.cancelCropBtn.addEventListener('click', () => this.cancelCrop());

    // 사이즈 별 다운로드 이벤트
    elements.downloadMultiBtn.addEventListener('click', () => this.downloadMultipleSizes());
  }

  // 확장자별 컨트롤 초기화
  initFormatControls() {
    const elements = this.uiManager.getElements();

    // 형식 선택 이벤트
    elements.formatSelect.addEventListener('change', () => {
      this.updateFormatControls();
      this.autoSaveWork();
    });

    // 슬라이더 이벤트
    elements.jpegQualitySlider.addEventListener('input', () => {
      elements.jpegQualityValue.textContent = elements.jpegQualitySlider.value + '%';
      this.autoSaveWork();
    });

    elements.pngCompressionSlider.addEventListener('input', () => {
      elements.pngCompressionValue.textContent = elements.pngCompressionSlider.value;
      this.autoSaveWork();
    });

    elements.webpQualitySlider.addEventListener('input', () => {
      elements.webpQualityValue.textContent = elements.webpQualitySlider.value + '%';
      this.autoSaveWork();
    });

    // WebP 투명도 이벤트
    elements.webpTransparency.addEventListener('change', () => {
      this.autoSaveWork();
    });

    // 최대 크기 입력 이벤트
    elements.maxWidth.addEventListener('input', () => {
      this.autoSaveWork();
    });

    elements.maxHeight.addEventListener('input', () => {
      this.autoSaveWork();
    });

    // 사이즈 옵션 이벤트
    if (elements.size1x) {
      elements.size1x.addEventListener('change', () => {
        this.autoSaveWork();
      });
    }
    if (elements.size2x) {
      elements.size2x.addEventListener('change', () => {
        this.autoSaveWork();
      });
    }
    if (elements.size3x) {
      elements.size3x.addEventListener('change', () => {
        this.autoSaveWork();
      });
    }

    // 초기 상태 설정
    this.updateFormatControls();
  }

  // 확장자별 컨트롤 업데이트
  updateFormatControls() {
    const elements = this.uiManager.getElements();
    const format = elements.formatSelect.value;

    // 모든 품질 그룹 숨기기
    elements.jpegQualityGroup.style.display = 'none';
    elements.pngCompressionGroup.style.display = 'none';
    elements.webpQualityGroup.style.display = 'none';

    // 선택된 형식에 따라 해당 그룹만 표시
    switch (format) {
      case 'jpeg':
        elements.jpegQualityGroup.style.display = 'block';
        break;
      case 'png':
        elements.pngCompressionGroup.style.display = 'block';
        break;
      case 'webp':
        elements.webpQualityGroup.style.display = 'block';
        break;
      default:
        // 원본 형식 유지 시 기본적으로 JPEG 품질 표시
        elements.jpegQualityGroup.style.display = 'block';
        break;
    }
  }

  // 확대/축소 및 드래그 기능 초기화
  initMagnifier() {
    const elements = this.uiManager.getElements();

    // 확대/축소 상태 관리
    this.zoomState = {
      scale: 1,
      minScale: 0.5,
      maxScale: 3,
      step: 0.25
    };

    // 드래그 상태 관리
    this.dragState = {
      isDragging: false,
      startX: 0,
      startY: 0,
      translateX: 0,
      translateY: 0
    };

    // 확대/축소 버튼 이벤트
    elements.zoomInBtn.addEventListener('click', () => this.zoomIn());
    elements.zoomOutBtn.addEventListener('click', () => this.zoomOut());
    elements.resetZoomBtn.addEventListener('click', () => this.resetZoom());

    // 드래그 이벤트
    this.initDragEvents();

    // 크롭 이벤트 초기화
    this.initCropEvents();

    // 초기 상태 업데이트
    this.updateZoomButtons();
  }

  // 확대
  zoomIn() {
    if (this.zoomState.scale < this.zoomState.maxScale) {
      this.zoomState.scale = Math.min(this.zoomState.maxScale, this.zoomState.scale + this.zoomState.step);
      this.applyZoom();
    }
  }

  // 축소
  zoomOut() {
    if (this.zoomState.scale > this.zoomState.minScale) {
      this.zoomState.scale = Math.max(this.zoomState.minScale, this.zoomState.scale - this.zoomState.step);
      this.applyZoom();
    }
  }

  // 확대/축소 리셋
  resetZoom() {
    this.zoomState.scale = 1;
    this.dragState.translateX = 0;
    this.dragState.translateY = 0;

        // transition 복원 후 확대/축소 적용
    const elements = this.uiManager.getElements();
    const containers = [elements.originalImageContainer, elements.processedImageContainer];
    const images = [elements.originalImage, elements.processedImage];

    containers.forEach(container => {
      container.classList.remove('dragging');
      container.style.transition = '';
    });

    images.forEach(img => {
      img.style.transition = '';
    });

    this.applyZoom();
  }

      // 확대/축소 적용
  applyZoom() {
    const elements = this.uiManager.getElements();
    const transform = `scale(${this.zoomState.scale}) translate(${this.dragState.translateX}px, ${this.dragState.translateY}px)`;

    // 이미지에 transform 적용
    elements.originalImage.style.transform = transform;
    elements.processedImage.style.transform = transform;

    // 확대/축소 레벨 표시
    elements.zoomLevel.textContent = `${Math.round(this.zoomState.scale * 100)}%`;

    // 버튼 상태 업데이트
    this.updateZoomButtons();

    // preview-image-container에 zoomed 클래스 추가/제거
    const containers = [elements.originalImageContainer, elements.processedImageContainer];
    containers.forEach(container => {
      if (this.zoomState.scale > 1) {
        container.classList.add('zoomed');
      } else {
        container.classList.remove('zoomed');
        container.classList.remove('dragging'); // 확대 해제 시 dragging 클래스도 제거
      }
    });
  }

  // 확대/축소 버튼 상태 업데이트
  updateZoomButtons() {
    const elements = this.uiManager.getElements();

    elements.zoomInBtn.disabled = this.zoomState.scale >= this.zoomState.maxScale;
    elements.zoomOutBtn.disabled = this.zoomState.scale <= this.zoomState.minScale;
  }

      // 드래그 이벤트 초기화
  initDragEvents() {
    const elements = this.uiManager.getElements();
    const containers = [elements.originalImageContainer, elements.processedImageContainer];

    containers.forEach(container => {
      container.addEventListener('mousedown', (e) => this.startDrag(e));
      container.addEventListener('mousemove', (e) => this.drag(e));
      container.addEventListener('mouseup', () => this.endDrag());
      container.addEventListener('mouseleave', () => this.endDrag());

      // 터치 이벤트 지원
      container.addEventListener('touchstart', (e) => this.startDrag(e));
      container.addEventListener('touchmove', (e) => this.drag(e));
      container.addEventListener('touchend', () => this.endDrag());
    });
  }

      // 드래그 시작
  startDrag(e) {
    if (this.zoomState.scale <= 1) return;

    e.preventDefault();
    this.dragState.isDragging = true;

        // 드래그 중일 때 transition 완전히 비활성화
    const elements = this.uiManager.getElements();
    const containers = [elements.originalImageContainer, elements.processedImageContainer];
    const images = [elements.originalImage, elements.processedImage];

    containers.forEach(container => {
      container.classList.add('dragging');
      container.style.transition = 'none';
    });

    images.forEach(img => {
      img.style.transition = 'none';
    });

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    this.dragState.startX = clientX - this.dragState.translateX;
    this.dragState.startY = clientY - this.dragState.translateY;
  }

  // 드래그 중
  drag(e) {
    if (!this.dragState.isDragging || this.zoomState.scale <= 1) return;

    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    this.dragState.translateX = clientX - this.dragState.startX;
    this.dragState.translateY = clientY - this.dragState.startY;

    this.applyZoom();
  }

      // 드래그 종료
  endDrag() {
    this.dragState.isDragging = false;

    // 드래그 종료 시 transition 다시 활성화
    const elements = this.uiManager.getElements();
    const containers = [elements.originalImageContainer, elements.processedImageContainer];
    const images = [elements.originalImage, elements.processedImage];

    containers.forEach(container => {
      container.classList.remove('dragging');
      container.style.transition = ''; // CSS 클래스의 transition으로 복원
    });

    images.forEach(img => {
      img.style.transition = ''; // CSS 클래스의 transition으로 복원
    });
  }

    // 크롭 이벤트 초기화
  initCropEvents() {
    const elements = this.uiManager.getElements();

    // 크롭 컨테이너 이벤트 (이미지 영역)
    elements.cropImage.addEventListener('mousedown', (e) => {
      if (this.cropManager.isCropMode) {
        this.cropManager.startCropDrag(e, elements.cropOverlay);
        // 전역 마우스 이벤트 추가
        document.addEventListener('mousemove', this.globalCropMouseMove);
        document.addEventListener('mouseup', this.globalCropMouseUp);
      }
    });

    // 크롭 오버레이 이벤트 (크롭 박스 자체)
    elements.cropOverlay.addEventListener('mousedown', (e) => {
      if (this.cropManager.isCropMode && !e.target.classList.contains('crop-handle')) {
        this.cropManager.startCropDrag(e, elements.cropOverlay);
        // 전역 마우스 이벤트 추가
        document.addEventListener('mousemove', this.globalCropMouseMove);
        document.addEventListener('mouseup', this.globalCropMouseUp);
      }
    });

    // 전역 마우스 이벤트 핸들러를 인스턴스에 바인딩
    this.globalCropMouseMove = (e) => {
      if (this.cropManager.isCropMode) {
        this.handleCropMouseMove(e);
      }
    };

    this.globalCropMouseUp = () => {
      if (this.cropManager.isCropMode) {
        this.cropManager.stopCropInteraction();
        // 전역 이벤트 제거
        document.removeEventListener('mousemove', this.globalCropMouseMove);
        document.removeEventListener('mouseup', this.globalCropMouseUp);
      }
    };

    // 크롭 핸들 이벤트 (9개 핸들)
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
            document.addEventListener('mousemove', this.globalCropMouseMove);
            document.addEventListener('mouseup', this.globalCropMouseUp);
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
        document.addEventListener('touchmove', this.globalCropTouchMove);
        document.addEventListener('touchend', this.globalCropTouchEnd);
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
        document.addEventListener('touchmove', this.globalCropTouchMove);
        document.addEventListener('touchend', this.globalCropTouchEnd);
      }
    });

    // 전역 터치 이벤트 핸들러
    this.globalCropTouchMove = (e) => {
      if (this.cropManager.isCropMode) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.handleCropMouseMove(mouseEvent);
      }
    };

    this.globalCropTouchEnd = () => {
      if (this.cropManager.isCropMode) {
        this.cropManager.stopCropInteraction();
        // 전역 터치 이벤트 제거
        document.removeEventListener('touchmove', this.globalCropTouchMove);
        document.removeEventListener('touchend', this.globalCropTouchEnd);
      }
    };
  }

  // 여러 사이즈로 다운로드 (크롭된 이미지 지원)
  async downloadMultipleSizes() {
    // 처리된 이미지가 있으면 그것을 사용, 없으면 원본 파일 사용
    const sourceBlob = this.processedBlob || this.fileUploader.getOriginalFile();
    if (!sourceBlob) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    const selectedSizes = this.uiManager.getSelectedSizes();
    if (selectedSizes.length === 0) {
      this.uiManager.showAlert('최소 하나의 크기를 선택해주세요.');
      return;
    }

    try {
      const elements = this.uiManager.getElements();
      const format = elements.formatSelect.value;

      // 확장자별 설정 구성
      const options = {
        format: format,
        jpegQuality: parseInt(elements.jpegQualitySlider.value) / 100,
        pngCompression: parseInt(elements.pngCompressionSlider.value),
        webpQuality: parseInt(elements.webpQualitySlider.value) / 100,
        webpTransparency: elements.webpTransparency.checked,
        maxWidth: parseInt(elements.maxWidth.value) || null,
        maxHeight: parseInt(elements.maxHeight.value) || null
      };

      // 여러 사이즈로 이미지 처리
      const results = await this.imageProcessor.processImageMultipleSizes(sourceBlob, selectedSizes, options);

      // 각 사이즈별로 다운로드
      for (const result of results) {
        if (result.error) {
          console.error(`사이즈 ${result.size}x 처리 실패:`, result.error);
          continue;
        }

        // 원본 파일명 또는 기본 파일명 사용
        const originalFileName = this.fileUploader.getOriginalFile()?.name || 'image';
        const fileName = this.uiManager.generateFileName(originalFileName, result.size);
        this.uiManager.createDownloadLink(result.blob, fileName);
      }

      this.uiManager.showAlert(`${results.length}개 파일이 다운로드되었습니다.`);
    } catch (error) {
      console.error('다중 사이즈 다운로드 중 오류:', error);
      this.uiManager.showAlert('다운로드 중 오류가 발생했습니다.');
    }
  }

  // 파일 드롭 처리
  async handleFileDrop(e) {
    const file = this.fileUploader.handleDrop(e, this.uiManager.getElement('uploadSection'));
    if (file) {
      await this.loadFile(file);
    }
  }

  // 파일 선택 처리
  async handleFileSelect(e) {
    const file = this.fileUploader.handleFileSelect(e);
    if (file) {
      await this.loadFile(file);
    }
  }

  // 파일 로드
  async loadFile(file) {
    try {
      const dataURL = await this.fileUploader.readFileAsDataURL(file);
      const elements = this.uiManager.getElements();

      this.uiManager.setImageSource(elements.originalImage, dataURL);
      this.uiManager.setImageSource(elements.processedImage, dataURL);
      this.uiManager.showPreview();

      // 원본 이미지 정보 업데이트
      this.uiManager.updateOriginalImageInfo(file);

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();
    } catch (error) {
      console.error('파일 로드 중 오류:', error);
      this.uiManager.showAlert(error.message);
    }
  }

  // 이미지 처리
  async processImage() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    try {
      const elements = this.uiManager.getElements();
      const format = elements.formatSelect.value;

      // 확장자별 설정 구성
      const options = {
        format: format,
        jpegQuality: parseInt(elements.jpegQualitySlider.value) / 100,
        pngCompression: parseInt(elements.pngCompressionSlider.value),
        webpQuality: parseInt(elements.webpQualitySlider.value) / 100,
        webpTransparency: elements.webpTransparency.checked,
        maxWidth: parseInt(elements.maxWidth.value) || null,
        maxHeight: parseInt(elements.maxHeight.value) || null
      };

      this.processedBlob = await this.imageProcessor.processImage(originalFile, options);
      const url = URL.createObjectURL(this.processedBlob);
      this.uiManager.setImageSource(elements.processedImage, url);

      // 처리된 이미지 정보 업데이트
      this.uiManager.updateProcessedImageInfo(this.processedBlob, originalFile);

      // 사이즈 옵션 표시
      this.uiManager.showSizeOptions();

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      this.uiManager.showAlert('이미지 처리 중 오류가 발생했습니다.');
    }
  }

  // 크롭 모드 토글
  toggleCropMode() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    const isCropMode = this.cropManager.toggleCropMode();
    const elements = this.uiManager.getElements();

    this.uiManager.toggleCropSection(isCropMode);

    if (isCropMode) {
      // 처리된 이미지가 있으면 처리된 이미지를, 없으면 원본 이미지를 사용
      const imageSource = this.processedBlob ? elements.processedImage.src : elements.originalImage.src;
      this.uiManager.setImageSource(elements.cropImage, imageSource);
      this.cropManager.initCrop(elements.cropImage, elements.cropOverlay);
    } else {
      // 크롭 모드 종료 시 버튼 텍스트 업데이트
      this.updateCropButtonText();
    }
  }

    // 버튼 상태 업데이트
  updateButtonStates() {
    const elements = this.uiManager.getElements();
    const originalFile = this.fileUploader.getOriginalFile();

    // 크롭 버튼 텍스트 및 상태 업데이트
    if (!originalFile) {
      elements.cropBtn.textContent = '크롭 모드';
      elements.cropBtn.disabled = true;
    } else if (this.processedBlob) {
      elements.cropBtn.textContent = '처리된 이미지 크롭';
      elements.cropBtn.disabled = false;
    } else {
      elements.cropBtn.textContent = '원본 이미지 크롭';
      elements.cropBtn.disabled = false;
    }

    // 다른 버튼들 상태 업데이트
    elements.processBtn.disabled = !originalFile;
    elements.resetImageBtn.disabled = !originalFile;
  }

  // 크롭 버튼 텍스트 업데이트 (기존 함수 유지)
  updateCropButtonText() {
    this.updateButtonStates();
  }

  // 크롭 마우스 이동 처리
  handleCropMouseMove(e) {
    const elements = this.uiManager.getElements();
    this.cropManager.handleCropMouseMove(e, elements.cropImage, elements.cropOverlay);
  }

  // 크롭 적용
  async applyCrop() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    try {
      const elements = this.uiManager.getElements();
      const cropData = this.cropManager.getCropData();
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
      let sourceBlob = this.processedBlob;
      let sourceFile = originalFile;

      if (!sourceBlob) {
        // 원본 파일을 Blob으로 변환
        sourceBlob = originalFile;
        sourceFile = originalFile;
      }

      this.processedBlob = await this.imageProcessor.cropImage(sourceBlob, cropData, options);
      const url = URL.createObjectURL(this.processedBlob);
      this.uiManager.setImageSource(elements.processedImage, url);

      // 크롭된 이미지 정보 업데이트
      this.uiManager.updateProcessedImageInfo(this.processedBlob, sourceFile);

      // 크롭 모드 종료
      this.cancelCrop();

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();

      // 성공 메시지
      const originalSize = this.imageProcessor.formatFileSize(sourceFile.size);
      const newSize = this.imageProcessor.formatFileSize(this.processedBlob.size);
      this.uiManager.showSuccessMessage(originalSize, newSize);
    } catch (error) {
      console.error('크롭 처리 중 오류:', error);
      this.uiManager.showAlert('크롭 처리 중 오류가 발생했습니다.');
    }
  }

  // 크롭 취소
  cancelCrop() {
    const elements = this.uiManager.getElements();
    this.cropManager.cancelCrop(elements.cropOverlay);
    this.uiManager.toggleCropSection(false);

    // 전역 이벤트 정리
    if (this.globalCropMouseMove) {
      document.removeEventListener('mousemove', this.globalCropMouseMove);
      document.removeEventListener('mouseup', this.globalCropMouseUp);
    }
    if (this.globalCropTouchMove) {
      document.removeEventListener('touchmove', this.globalCropTouchMove);
      document.removeEventListener('touchend', this.globalCropTouchEnd);
    }

    // 크롭 버튼 텍스트 업데이트
    this.updateCropButtonText();
  }

  // 이미지 다운로드
  // 이미지 다운로드 (단일 사이즈)
  downloadImage() {
    if (!this.processedBlob) {
      this.uiManager.showAlert('먼저 이미지를 처리해주세요.');
      return;
    }

    // blob의 MIME 타입에서 확장자 추출
    const mimeType = this.processedBlob.type;
    let extension = 'jpg';

    if (mimeType === 'image/png') {
      extension = 'png';
    } else if (mimeType === 'image/webp') {
      extension = 'webp';
    } else if (mimeType === 'image/jpeg') {
      extension = 'jpg';
    }

    const filename = `processed_image.${extension}`;
    this.uiManager.createDownloadLink(this.processedBlob, filename);
  }

    // 이미지만 초기화 (설정은 유지)
  resetImage() {
    // 원본 파일과 이미지 소스를 보존
    const originalFile = this.fileUploader.getOriginalFile();
    const originalImageSrc = this.uiManager.getElements().originalImage.src;

    // 처리된 이미지만 초기화
    this.processedBlob = null;
    this.cropManager.cancelCrop(this.uiManager.getElement('cropOverlay'));
    this.uiManager.resetImage();

    // 처리된 이미지를 원본 이미지로 복원
    if (originalImageSrc && originalImageSrc !== '') {
      this.uiManager.getElements().processedImage.src = originalImageSrc;
    }

    // 버튼 상태 업데이트 (원본 이미지는 유지되므로 크롭 버튼 활성화)
    this.updateButtonStates();
  }

  // 현재 설정 가져오기
  getCurrentSettings() {
    const elements = this.uiManager.getElements();
    return {
      format: elements.formatSelect.value,
      jpegQuality: parseInt(elements.jpegQualitySlider.value),
      pngCompression: parseInt(elements.pngCompressionSlider.value),
      webpQuality: parseInt(elements.webpQualitySlider.value),
      webpTransparency: elements.webpTransparency.checked,
      maxWidth: elements.maxWidth.value,
      maxHeight: elements.maxHeight.value,
      sizeOptions: {
        size1x: elements.size1x ? elements.size1x.checked : true,
        size2x: elements.size2x ? elements.size2x.checked : false,
        size3x: elements.size3x ? elements.size3x.checked : false
      }
    };
  }

  // 자동 저장
  async autoSaveWork() {
    if (!this.autoSaveEnabled) return;

    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) return;

    const elements = this.uiManager.getElements();
    const originalImage = elements.originalImage.src;
    const processedImage = this.processedBlob ? elements.processedImage.src : null;
    const settings = this.getCurrentSettings();

    await this.workManager.autoSave(originalImage, processedImage, settings);
  }

  // 자동 저장 확인
  async checkAutoSave() {
    const autoSave = await this.workManager.loadAutoSave();
    if (autoSave) {
      const shouldLoad = confirm('자동 저장된 작업물이 있습니다. 불러오시겠습니까?');
      if (shouldLoad) {
        await this.loadWork(autoSave);
      }
    }
  }

  // 작업물 저장 모달 표시
  showSaveWorkModal() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    const elements = this.uiManager.getElements();
    const workModal = elements.workSaveModal;

    // 저장할 내용 미리보기 업데이트
    elements.saveOriginalPreview.textContent = originalFile.name;
    elements.saveProcessedPreview.textContent = this.processedBlob ? '있음' : '없음';
    elements.saveSettingsPreview.textContent = this.getCurrentSettings().format;

    workModal.style.display = 'block';
    elements.workNameInput.focus();
  }

  // 작업물 저장 모달 숨기기
  hideSaveWorkModal() {
    const elements = this.uiManager.getElements();
    elements.workSaveModal.style.display = 'none';
    elements.workNameInput.value = '';
  }

  // 작업물 저장
  async saveWork() {
    const elements = this.uiManager.getElements();
    const workName = elements.workNameInput.value.trim();

    if (!workName) {
      this.uiManager.showAlert('작업물 이름을 입력해주세요.');
      return;
    }

    const originalFile = this.fileUploader.getOriginalFile();
    const originalImage = elements.originalImage.src;
    const processedImage = this.processedBlob ? elements.processedImage.src : null;
    const settings = this.getCurrentSettings();

    const workData = await this.workManager.createWorkData(originalImage, processedImage, settings, workName);
    const success = await this.workManager.saveWork(workData);

    if (success) {
      this.uiManager.showAlert('작업물이 저장되었습니다.');
      this.hideSaveWorkModal();
    } else {
      this.uiManager.showAlert('작업물 저장에 실패했습니다.');
    }
  }

  // 작업물 목록 모달 표시
  async showWorkListModal() {
    const elements = this.uiManager.getElements();
    const workModal = elements.workModal;
    const workList = elements.workList;
    const workEmpty = elements.workEmpty;

    const works = await this.workManager.getWorkList();

    if (works.length === 0) {
      workList.style.display = 'none';
      workEmpty.style.display = 'block';
    } else {
      workList.style.display = 'grid';
      workEmpty.style.display = 'none';

      // 기존 목록 초기화
      workList.innerHTML = '';

      // 작업물 목록 생성
      works.forEach(work => {
        const workItem = this.createWorkItem(work);
        workList.appendChild(workItem);
      });
    }

    workModal.style.display = 'block';
  }

  // 작업물 목록 모달 숨기기
  hideWorkModal() {
    const elements = this.uiManager.getElements();
    elements.workModal.style.display = 'none';
  }

  // 작업물 아이템 생성
  createWorkItem(work) {
    const workItem = document.createElement('div');
    workItem.className = 'work-item';
    workItem.dataset.workId = work.id;

    const date = new Date(work.createdAt).toLocaleString('ko-KR');

    workItem.innerHTML = `
      <img src="${work.thumbnail}" alt="${work.name}" class="work-thumbnail" />
      <div class="work-name">${work.name}</div>
      <div class="work-date">${date}</div>
      <div class="work-info">
        <div class="info-item">
          <span>형식:</span>
          <span>${work.settings.format}</span>
        </div>
        <div class="info-item">
          <span>처리됨:</span>
          <span>${work.processedImage ? '예' : '아니오'}</span>
        </div>
      </div>
      <div class="work-actions">
        <button class="btn btn-primary load-work-btn">불러오기</button>
        <button class="btn btn-danger delete-work-btn">삭제</button>
      </div>
    `;

    // 이벤트 리스너 추가
    workItem.querySelector('.load-work-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.loadWork(work);
      this.hideWorkModal();
    });

    workItem.querySelector('.delete-work-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteWork(work.id);
    });

    return workItem;
  }

    // 작업물 불러오기
  async loadWork(work) {
    const elements = this.uiManager.getElements();

    try {
      // 이미지 로드 완료를 기다리는 Promise
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
          img.src = src;
        });
      };

      // 원본 이미지 로드
      await loadImage(work.originalImage);
      elements.originalImage.src = work.originalImage;
      this.fileUploader.setOriginalFile(work.originalImage);

      // 원본 이미지 정보 업데이트
      this.updateOriginalImageInfo(work.originalImage);

      // 처리된 이미지 설정
      if (work.processedImage) {
        await loadImage(work.processedImage);
        elements.processedImage.src = work.processedImage;
        this.processedBlob = work.processedImage;

        // 처리된 이미지 정보 업데이트
        this.updateProcessedImageInfo(work.processedImage, work.originalImage);
      } else {
        elements.processedImage.src = work.originalImage;
        this.processedBlob = null;

        // 처리된 이미지 정보 초기화
        this.uiManager.resetProcessedImageInfo();
      }

      // 설정 적용
      this.applySettings(work.settings);

      // 미리보기 섹션 표시
      this.uiManager.showPreview();

      // 버튼 상태 업데이트
      this.updateButtonStates();

      this.uiManager.showAlert('작업물을 불러왔습니다.');
    } catch (error) {
      console.error('작업물 불러오기 실패:', error);
      this.uiManager.showAlert('작업물을 불러오는 중 오류가 발생했습니다. 이미지 데이터가 손상되었을 수 있습니다.');
    }
  }

    // 원본 이미지 정보 업데이트 (Base64 이미지용)
  updateOriginalImageInfo(base64Image) {
    const elements = this.uiManager.getElements();

    try {
      // Base64에서 파일 크기 계산
      const base64Data = base64Image.split(',')[1];
      const fileSize = Math.ceil((base64Data.length * 3) / 4);

      // 이미지 크기 계산
      const img = new Image();
      img.onload = () => {
        elements.originalImageSize.textContent = `${img.width} × ${img.height}`;
        elements.originalFileSize.textContent = this.uiManager.formatFileSize(fileSize);

        // 형식 추출
        const format = base64Image.split(';')[0].split('/')[1];
        elements.originalFormat.textContent = format.toUpperCase();
      };
      img.src = base64Image;
    } catch (error) {
      console.error('이미지 정보 업데이트 실패:', error);
      elements.originalImageSize.textContent = '-';
      elements.originalFileSize.textContent = '-';
      elements.originalFormat.textContent = '-';
    }
  }

  // 처리된 이미지 정보 업데이트 (Base64 이미지용)
  updateProcessedImageInfo(processedBase64, originalBase64) {
    const elements = this.uiManager.getElements();

    try {
      // Base64에서 파일 크기 계산
      const processedData = processedBase64.split(',')[1];
      const originalData = originalBase64.split(',')[1];
      const processedSize = Math.ceil((processedData.length * 3) / 4);
      const originalSize = Math.ceil((originalData.length * 3) / 4);

      // 이미지 크기 계산
      const img = new Image();
      img.onload = () => {
        elements.processedImageSize.textContent = `${img.width} × ${img.height}`;
        elements.processedFileSize.textContent = this.uiManager.formatFileSize(processedSize);

        // 형식 추출
        const format = processedBase64.split(';')[0].split('/')[1];
        elements.processedFormat.textContent = format.toUpperCase();

        // 압축 정보 표시
        const compressionRatio = ((originalSize - processedSize) / originalSize * 100).toFixed(1);
        elements.compressionRatio.textContent = `${compressionRatio}%`;
        elements.compressionInfo.style.display = 'block';
      };
      img.src = processedBase64;
    } catch (error) {
      console.error('처리된 이미지 정보 업데이트 실패:', error);
      elements.processedImageSize.textContent = '-';
      elements.processedFileSize.textContent = '-';
      elements.processedFormat.textContent = '-';
      elements.compressionInfo.style.display = 'none';
    }
  }

  // 설정 적용
  applySettings(settings) {
    const elements = this.uiManager.getElements();

    // 형식 설정
    if (settings.format) {
      elements.formatSelect.value = settings.format;
      this.updateFormatControls();
    }

    // JPEG 품질 설정
    if (settings.jpegQuality) {
      elements.jpegQualitySlider.value = settings.jpegQuality;
      elements.jpegQualityValue.textContent = settings.jpegQuality + '%';
    }

    // PNG 압축 설정
    if (settings.pngCompression !== undefined) {
      elements.pngCompressionSlider.value = settings.pngCompression;
      elements.pngCompressionValue.textContent = settings.pngCompression;
    }

    // WebP 품질 설정
    if (settings.webpQuality) {
      elements.webpQualitySlider.value = settings.webpQuality;
      elements.webpQualityValue.textContent = settings.webpQuality + '%';
    }

    // WebP 투명도 설정
    if (settings.webpTransparency !== undefined) {
      elements.webpTransparency.checked = settings.webpTransparency;
    }

    // 최대 크기 설정
    if (settings.maxWidth !== undefined) {
      elements.maxWidth.value = settings.maxWidth;
    }
    if (settings.maxHeight !== undefined) {
      elements.maxHeight.value = settings.maxHeight;
    }

    // 사이즈 옵션 설정
    if (settings.sizeOptions) {
      if (elements.size1x && settings.sizeOptions.size1x !== undefined) {
        elements.size1x.checked = settings.sizeOptions.size1x;
      }
      if (elements.size2x && settings.sizeOptions.size2x !== undefined) {
        elements.size2x.checked = settings.sizeOptions.size2x;
      }
      if (elements.size3x && settings.sizeOptions.size3x !== undefined) {
        elements.size3x.checked = settings.sizeOptions.size3x;
      }
    }
  }

  // 작업물 삭제
  async deleteWork(workId) {
    if (confirm('이 작업물을 삭제하시겠습니까?')) {
      const success = await this.workManager.deleteWork(workId);
      if (success) {
        this.uiManager.showAlert('작업물이 삭제되었습니다.');
        // 목록 새로고침
        await this.showWorkListModal();
      } else {
        this.uiManager.showAlert('작업물 삭제에 실패했습니다.');
      }
    }
  }

    // 자동 저장 토글
  toggleAutoSave() {
    this.autoSaveEnabled = !this.autoSaveEnabled;
    const elements = this.uiManager.getElements();

    // 메인 자동저장 버튼 업데이트
    elements.autoSaveBtn.textContent = this.autoSaveEnabled ? '자동저장 ON' : '자동저장';
    elements.autoSaveBtn.classList.toggle('btn-success', this.autoSaveEnabled);
    elements.autoSaveBtn.classList.toggle('btn-warning', !this.autoSaveEnabled);

    // 업로드 섹션 자동저장 버튼 업데이트
    elements.uploadAutoSaveBtn.textContent = this.autoSaveEnabled ? '🔄 자동저장 ON' : '🔄 자동저장';
    elements.uploadAutoSaveBtn.classList.toggle('btn-success', this.autoSaveEnabled);
    elements.uploadAutoSaveBtn.classList.toggle('btn-warning', !this.autoSaveEnabled);

    this.uiManager.showAlert(
      this.autoSaveEnabled ? '자동 저장이 활성화되었습니다.' : '자동 저장이 비활성화되었습니다.'
    );
  }

  // 모든 작업물 삭제
  async clearAllWorks() {
    if (confirm('모든 저장된 작업물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const success = await this.workManager.clearAllWorks();
      if (success) {
        this.uiManager.showAlert('모든 작업물이 삭제되었습니다.');
      } else {
        this.uiManager.showAlert('작업물 삭제에 실패했습니다.');
      }
    }
  }

  // 앱 리셋 (모든 설정 포함)
  async resetApp() {
    this.fileUploader.reset();
    this.processedBlob = null;
    this.cropManager.cancelCrop(this.uiManager.getElement('cropOverlay'));
    this.uiManager.resetApp();

    // 크롭 버튼 텍스트 업데이트
    this.updateCropButtonText();
  }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', async () => {
  const app = new ImageGeneratorApp();
  await app.init();
});