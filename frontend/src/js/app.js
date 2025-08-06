// 메인 애플리케이션
import { ImageProcessor } from '@/js/modules/imageProcessor.js';
import { CropManager } from '@/js/modules/cropManager.js';
import { FileUploader } from '@/js/modules/fileUploader.js';
import { UIManager } from '@/js/modules/uiManager.js';

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
  }

  // 이벤트 바인딩
  bindEvents() {
    const elements = this.uiManager.getElements();

    // 파일 업로드 이벤트
    elements.uploadSection.addEventListener('click', () => elements.fileInput.click());
    elements.uploadSection.addEventListener('dragover', (e) => this.fileUploader.handleDragOver(e, elements.uploadSection));
    elements.uploadSection.addEventListener('dragleave', (e) => this.fileUploader.handleDragLeave(e, elements.uploadSection));
    elements.uploadSection.addEventListener('drop', (e) => this.handleFileDrop(e));
    elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // 컨트롤 이벤트
    elements.qualitySlider.addEventListener('input', () => this.uiManager.updateQualityValue());
    elements.processBtn.addEventListener('click', () => this.processImage());
    elements.resetBtn.addEventListener('click', () => this.resetApp());

    // 크롭 이벤트
    elements.cropBtn.addEventListener('click', () => this.toggleCropMode());
    elements.applyCropBtn.addEventListener('click', () => this.applyCrop());
    elements.cancelCropBtn.addEventListener('click', () => this.cancelCrop());

    // 크롭 상호작용 이벤트
    elements.cropOverlay.addEventListener('mousedown', (e) => this.cropManager.startCropDrag(e, elements.cropOverlay));

    // 모든 크롭 핸들에 이벤트 리스너 추가
    const cropHandles = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];
    cropHandles.forEach(position => {
      const handle = elements[`cropHandle${position.toUpperCase()}`];
      if (handle) {
        handle.addEventListener('mousedown', (e) => this.cropManager.startCropResize(e, position));
      }
    });

    document.addEventListener('mousemove', (e) => this.handleCropMouseMove(e));
    document.addEventListener('mouseup', () => this.cropManager.stopCropInteraction());
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
    } catch (error) {
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
      const options = {
        format: elements.formatSelect.value,
        quality: parseInt(elements.qualitySlider.value) / 100,
        maxWidth: parseInt(elements.maxWidth.value) || null,
        maxHeight: parseInt(elements.maxHeight.value) || null
      };

      this.processedBlob = await this.imageProcessor.processImage(originalFile, options);
      const url = URL.createObjectURL(this.processedBlob);
      this.uiManager.setImageSource(elements.processedImage, url);
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

      // 초기 크롭 정보 업데이트
      this.cropManager.updateCropInfo(this.uiManager);
    }
  }

    // 크롭 마우스 이동 처리
  handleCropMouseMove(e) {
    const elements = this.uiManager.getElements();
    this.cropManager.handleCropMouseMove(e, elements.cropImage, elements.cropOverlay);

    // 크롭 정보 실시간 업데이트
    this.cropManager.updateCropInfo(this.uiManager);
  }

    // 크롭 input 값 변경 처리
  handleCropInputChange() {
    const elements = this.uiManager.getElements();
    const x = parseInt(elements.cropX.value) || 0;
    const y = parseInt(elements.cropY.value) || 0;
    const width = parseInt(elements.cropWidth.value) || 1;
    const height = parseInt(elements.cropHeight.value) || 1;

        // input 값으로 크롭 영역 설정
    this.cropManager.setCropFromInput(x, y, width, height, elements.cropImage, elements.cropOverlay);
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

      // 이미지 크기 정보 추가
      cropData.imageWidth = elements.cropImage.offsetWidth;
      cropData.imageHeight = elements.cropImage.offsetHeight;

      const options = {
        format: elements.formatSelect.value,
        quality: parseInt(elements.qualitySlider.value) / 100
      };

      this.processedBlob = await this.imageProcessor.cropImage(this.processedBlob, cropData, options);
      const url = URL.createObjectURL(this.processedBlob);
      this.uiManager.setImageSource(elements.processedImage, url);

      // 크롭 모드 종료
      this.cancelCrop();

      // 성공 메시지
      const originalFile = this.fileUploader.getOriginalFile();
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
  }

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