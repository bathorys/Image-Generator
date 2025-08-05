// 메인 애플리케이션
import { ImageProcessor } from '/Image-Generator/js/modules/imageProcessor.js';
import { CropManager } from '/Image-Generator/js/modules/cropManager.js';
import { FileUploader } from '/Image-Generator/js/modules/fileUploader.js';
import { UIManager } from '/Image-Generator/js/modules/uiManager.js';

export class ImageGeneratorApp {
  constructor() {
    this.imageProcessor = new ImageProcessor();
    this.cropManager = new CropManager();
    this.fileUploader = new FileUploader();
    this.uiManager = new UIManager();
    this.processedBlob = null;
  }

  // 애플리케이션 초기화
  init() {
    this.uiManager.initializeElements();
    this.bindEvents();
    this.initMagnifier();
    this.initFormatControls();
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
    elements.downloadBtn.addEventListener('click', () => this.downloadImage());
    elements.resetBtn.addEventListener('click', () => this.resetApp());

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
    elements.formatSelect.addEventListener('change', () => this.updateFormatControls());

    // 슬라이더 이벤트
    elements.jpegQualitySlider.addEventListener('input', () => {
      elements.jpegQualityValue.textContent = elements.jpegQualitySlider.value + '%';
    });

    elements.pngCompressionSlider.addEventListener('input', () => {
      elements.pngCompressionValue.textContent = elements.pngCompressionSlider.value;
    });

    elements.webpQualitySlider.addEventListener('input', () => {
      elements.webpQualityValue.textContent = elements.webpQualitySlider.value + '%';
    });

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
            const handleType = handle.id.replace('cropHandle', '').toLowerCase();
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

  // 여러 사이즈로 다운로드
  async downloadMultipleSizes() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
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
      const results = await this.imageProcessor.processImageMultipleSizes(originalFile, selectedSizes, options);

      // 각 사이즈별로 다운로드
      for (const result of results) {
        if (result.error) {
          console.error(`사이즈 ${result.size}x 처리 실패:`, result.error);
          continue;
        }

        const fileName = this.uiManager.generateFileName(originalFile.name, result.size);
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
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      this.uiManager.showAlert('이미지 처리 중 오류가 발생했습니다.');
    }
  }

  // 크롭 모드 토글
  toggleCropMode() {
    if (!this.processedBlob) {
      this.uiManager.showAlert('먼저 이미지를 처리해주세요.');
      return;
    }

    const isCropMode = this.cropManager.toggleCropMode();
    const elements = this.uiManager.getElements();

    this.uiManager.toggleCropSection(isCropMode);

    if (isCropMode) {
      this.uiManager.setImageSource(elements.cropImage, elements.processedImage.src);
      this.cropManager.initCrop(elements.cropImage, elements.cropOverlay);
    }
  }

  // 크롭 마우스 이동 처리
  handleCropMouseMove(e) {
    const elements = this.uiManager.getElements();
    this.cropManager.handleCropMouseMove(e, elements.cropImage, elements.cropOverlay);
  }

  // 크롭 적용
  async applyCrop() {
    if (!this.processedBlob) {
      this.uiManager.showAlert('먼저 이미지를 처리해주세요.');
      return;
    }

    try {
      const elements = this.uiManager.getElements();
      const cropData = this.cropManager.getCropData();
      const format = elements.formatSelect.value;
      const originalFile = this.fileUploader.getOriginalFile();

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

      this.processedBlob = await this.imageProcessor.cropImage(this.processedBlob, cropData, options);
      const url = URL.createObjectURL(this.processedBlob);
      this.uiManager.setImageSource(elements.processedImage, url);

      // 크롭된 이미지 정보 업데이트
      this.uiManager.updateProcessedImageInfo(this.processedBlob, originalFile);

      // 크롭 모드 종료
      this.cancelCrop();

      // 성공 메시지
      const originalSize = this.imageProcessor.formatFileSize(originalFile.size);
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
  }

  // 이미지 다운로드
  downloadImage() {
    if (!this.processedBlob) {
      this.uiManager.showAlert('먼저 이미지를 처리해주세요.');
      return;
    }

    const elements = this.uiManager.getElements();
    const format = elements.formatSelect.value || 'jpg';
    const filename = `processed_image.${format}`;

    this.uiManager.createDownloadLink(this.processedBlob, filename);
  }

  // 앱 리셋
  resetApp() {
    this.fileUploader.reset();
    this.processedBlob = null;
    this.cropManager.cancelCrop(this.uiManager.getElement('cropOverlay'));
    this.uiManager.resetApp();
  }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
  const app = new ImageGeneratorApp();
  app.init();
});