// UI 관리 모듈 - Data Attributes 기반 셀렉팅
import DOMSelector from '../utils/domSelector.js';

export class UIManager {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  // DOM 요소 초기화 - Data Attributes 기반
  initializeElements() {
    this.elements = {
      // 업로드 섹션
      uploadSection: DOMSelector.component('upload-section'),
      fileInput: DOMSelector.target('file-input'),

      // 프리뷰 섹션
      previewSection: DOMSelector.component('preview-section'),
      originalImage: DOMSelector.target('original-image'),
      processedImage: DOMSelector.target('processed-image'),
      originalInfo: DOMSelector.target('original-info'),
      processedInfo: DOMSelector.target('processed-info'),
      originalFileSize: DOMSelector.target('original-file-size'),
      originalImageSize: DOMSelector.target('original-image-size'),
      originalFormat: DOMSelector.target('original-format'),
      processedFileSize: DOMSelector.target('processed-file-size'),
      processedImageSize: DOMSelector.target('processed-image-size'),
      processedFormat: DOMSelector.target('processed-format'),
      compressionInfo: DOMSelector.target('compression-info'),
      compressionRatio: DOMSelector.target('compression-ratio'),

      // 컨트롤 섹션
      controlsSection: DOMSelector.component('controls-section'),
      formatSelect: DOMSelector.target('format-select'),
      jpegQualityGroup: DOMSelector.componentByType('control-group', 'jpeg-quality'),
      jpegQualitySlider: DOMSelector.target('jpeg-quality-slider'),
      jpegQualityValue: DOMSelector.target('jpeg-quality-value'),
      pngCompressionGroup: DOMSelector.componentByType('control-group', 'png-compression'),
      pngCompressionSlider: DOMSelector.target('png-compression-slider'),
      pngCompressionValue: DOMSelector.target('png-compression-value'),
      webpQualityGroup: DOMSelector.componentByType('control-group', 'webp-quality'),
      webpQualitySlider: DOMSelector.target('webp-quality-slider'),
      webpQualityValue: DOMSelector.target('webp-quality-value'),
      webpTransparency: DOMSelector.target('webp-transparency'),
      maxWidth: DOMSelector.target('max-width'),
      maxHeight: DOMSelector.target('max-height'),

      // 액션 버튼들
      processBtn: DOMSelector.action('process-image'),
      cropBtn: DOMSelector.action('crop-mode'),
      resetImageBtn: DOMSelector.action('reset-image'),
      resetBtn: DOMSelector.action('reset-all'),

      // 작업물 관리 버튼들
      saveWorkBtn: DOMSelector.action('save-work'),
      loadWorkBtn: DOMSelector.action('load-work'),
      autoSaveBtn: DOMSelector.action('toggle-auto-save'),
      clearWorksBtn: DOMSelector.action('clear-works'),

      // 크롭 섹션
      cropSection: DOMSelector.component('crop-section'),
      cropImage: DOMSelector.target('crop-image'),
      cropOverlay: DOMSelector.target('crop-overlay'),
      applyCropBtn: DOMSelector.action('apply-crop'),
      cancelCropBtn: DOMSelector.action('cancel-crop'),

      // 크롭 정보 표시 요소들
      cropX: DOMSelector.target('crop-x'),
      cropY: DOMSelector.target('crop-y'),
      cropWidth: DOMSelector.target('crop-width'),
      cropHeight: DOMSelector.target('crop-height'),

      // 크롭 핸들들
      cropHandleNW: DOMSelector.cropHandle('nw'),
      cropHandleN: DOMSelector.cropHandle('n'),
      cropHandleNE: DOMSelector.cropHandle('ne'),
      cropHandleW: DOMSelector.cropHandle('w'),
      cropHandleE: DOMSelector.cropHandle('e'),
      cropHandleSW: DOMSelector.cropHandle('sw'),
      cropHandleS: DOMSelector.cropHandle('s'),
      cropHandleSE: DOMSelector.cropHandle('se'),

      // 확대/축소 컨트롤
      zoomControls: DOMSelector.component('zoom-controls'),
      zoomOutBtn: DOMSelector.action('zoom-out'),
      zoomInBtn: DOMSelector.action('zoom-in'),
      resetZoomBtn: DOMSelector.action('reset-zoom'),
      zoomLevel: DOMSelector.target('zoom-level'),

      // 사이즈 옵션
      sizeOptions: DOMSelector.component('size-options'),
      size1x: DOMSelector.sizeOption('1x'),
      size2x: DOMSelector.sizeOption('2x'),
      size3x: DOMSelector.sizeOption('3x'),
      downloadMultiBtn: DOMSelector.action('download-multi'),

      // 모달들
      workModal: DOMSelector.modal('work-modal'),
      workList: DOMSelector.target('work-list'),
      workEmpty: DOMSelector.target('work-empty'),
      closeWorkModal: DOMSelector.modalCloseButton('work-modal'),
      workSaveModal: DOMSelector.modal('work-save-modal'),
      workNameInput: DOMSelector.target('work-name-input'),
      saveOriginalPreview: DOMSelector.target('save-original-preview'),
      saveProcessedPreview: DOMSelector.target('save-processed-preview'),
      saveSettingsPreview: DOMSelector.target('save-settings-preview'),
      confirmSaveWorkBtn: DOMSelector.action('confirm-save-work'),
      cancelSaveWorkBtn: DOMSelector.action('cancel-save-work'),
      closeWorkSaveModal: DOMSelector.modalCloseButton('work-save-modal'),

      // 이미지 컨테이너들 (부모 요소)
      originalImageContainer: DOMSelector.target('original').querySelector('.preview-image-container'),
      processedImageContainer: DOMSelector.target('processed').querySelector('.preview-image-container')
    };
  }

  // 품질 값 업데이트
  updateQualityValue() {
    if (this.elements.jpegQualityValue && this.elements.jpegQualitySlider) {
      this.elements.jpegQualityValue.textContent = this.elements.jpegQualitySlider.value + '%';
    }
  }

  // 미리보기 표시
  showPreview() {
    if (this.elements.previewSection) {
      this.elements.previewSection.style.display = 'block';
    }
    if (this.elements.uploadSection) {
      this.elements.uploadSection.style.display = 'none';
    }
  }

  // 크롭 섹션 표시/숨김
  toggleCropSection(show) {
    if (this.elements.cropSection) {
      this.elements.cropSection.style.display = show ? 'block' : 'none';
    }
  }



  // 이미지 소스 설정
  setImageSource(imageElement, source) {
    if (imageElement) {
      imageElement.src = source;
    }
  }

  // 다운로드 링크 생성
  createDownloadLink(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 알림 표시 (Snackbar 사용)
  showAlert(message, type = 'info', duration = 4000) {
    if (window.snackbarManager) {
      window.snackbarManager.show(message, type, duration);
    } else {
      // fallback으로 alert 사용
      alert(message);
    }
  }

  // 성공 메시지 표시
  showSuccessMessage(originalSize, newSize) {
    const message = `크롭 완료!\n원본: ${originalSize}\n크롭된 이미지: ${newSize}`;
    this.showAlert(message, 'success', 5000);
  }

  // 에러 메시지 표시
  showErrorMessage(message, duration = 6000) {
    this.showAlert(message, 'error', duration);
  }

  // 경고 메시지 표시
  showWarningMessage(message, duration = 5000) {
    this.showAlert(message, 'warning', duration);
  }

  // 정보 메시지 표시
  showInfoMessage(message, duration = 4000) {
    this.showAlert(message, 'info', duration);
  }

  // DOM 요소 가져오기
  getElement(name) {
    return this.elements[name];
  }

  // 모든 DOM 요소 가져오기
  getElements() {
    return this.elements;
  }

  // 안전한 요소 접근
  safeGetElement(name) {
    const element = this.elements[name];
    if (!element) {
      console.warn(`Element not found: ${name}`);
    }
    return element;
  }

  // 요소 존재 여부 확인
  hasElement(name) {
    return !!this.elements[name];
  }

  // 이미지만 초기화 (설정은 유지)
  resetImage() {
    // 원본 이미지는 유지하고, 처리된 이미지만 초기화
    if (this.elements.processedImage) {
      this.elements.processedImage.src = '';
    }
    if (this.elements.cropSection) {
      this.elements.cropSection.style.display = 'none';
    }

    // 처리된 이미지 정보만 초기화
    this.resetProcessedImageInfo();

    // 사이즈 옵션 숨기기
    this.hideSizeOptions();
  }

  // 앱 리셋 (모든 설정 포함)
  resetApp() {
    if (this.elements.previewSection) {
      this.elements.previewSection.style.display = 'none';
    }
    if (this.elements.cropSection) {
      this.elements.cropSection.style.display = 'none';
    }
    if (this.elements.uploadSection) {
      this.elements.uploadSection.style.display = 'block';
    }
    if (this.elements.fileInput) {
      this.elements.fileInput.value = '';
    }
    if (this.elements.originalImage) {
      this.elements.originalImage.src = '';
    }
    if (this.elements.processedImage) {
      this.elements.processedImage.src = '';
    }

    // 이미지 정보 초기화
    this.resetImageInfo();

    // 사이즈 옵션 숨기기
    this.hideSizeOptions();
  }

  // 사이즈 옵션 표시
  showSizeOptions() {
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.style.display = 'block';
    }
  }

  // 사이즈 옵션 숨기기
  hideSizeOptions() {
    if (this.elements.sizeOptions) {
      this.elements.sizeOptions.style.display = 'none';
    }
  }

  // 선택된 사이즈 가져오기
  getSelectedSizes() {
    const selectedSizes = [];

    if (this.elements.size1x && this.elements.size1x.checked) {
      selectedSizes.push(1);
    }
    if (this.elements.size2x && this.elements.size2x.checked) {
      selectedSizes.push(2);
    }
    if (this.elements.size3x && this.elements.size3x.checked) {
      selectedSizes.push(3);
    }

    return selectedSizes;
  }

  // 파일명에 사이즈 정보 추가
  generateFileName(baseName, size) {
    const extension = baseName.split('.').pop();
    const nameWithoutExt = baseName.replace(`.${extension}`, '');

    if (size === 1) {
      return baseName; // 원본 크기는 확장자 없이
    } else {
      return `${nameWithoutExt}@${size}x.${extension}`;
    }
  }

  // 이미지 정보 초기화
  resetImageInfo() {
    if (this.elements.originalFileSize) {
      this.elements.originalFileSize.textContent = '-';
    }
    if (this.elements.originalImageSize) {
      this.elements.originalImageSize.textContent = '-';
    }
    if (this.elements.originalFormat) {
      this.elements.originalFormat.textContent = '-';
    }
    if (this.elements.processedFileSize) {
      this.elements.processedFileSize.textContent = '-';
    }
    if (this.elements.processedImageSize) {
      this.elements.processedImageSize.textContent = '-';
    }
    if (this.elements.processedFormat) {
      this.elements.processedFormat.textContent = '-';
    }
    if (this.elements.compressionInfo) {
      this.elements.compressionInfo.style.display = 'none';
    }
  }

  // 처리된 이미지 정보만 초기화
  resetProcessedImageInfo() {
    if (this.elements.processedFileSize) {
      this.elements.processedFileSize.textContent = '-';
    }
    if (this.elements.processedImageSize) {
      this.elements.processedImageSize.textContent = '-';
    }
    if (this.elements.processedFormat) {
      this.elements.processedFormat.textContent = '-';
    }
    if (this.elements.compressionInfo) {
      this.elements.compressionInfo.style.display = 'none';
    }
  }

  // 원본 이미지 정보 업데이트
  updateOriginalImageInfo(file) {
    if (this.elements.originalFileSize) {
      this.elements.originalFileSize.textContent = this.formatFileSize(file.size);
    }
    if (this.elements.originalFormat) {
      this.elements.originalFormat.textContent = file.type.split('/')[1].toUpperCase();
    }

    // 이미지 크기는 이미지 로드 후 업데이트
    const img = new Image();
    img.onload = () => {
      if (this.elements.originalImageSize) {
        this.elements.originalImageSize.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
      }
    };
    img.src = URL.createObjectURL(file);
  }

  // 처리된 이미지 정보 업데이트
  updateProcessedImageInfo(blob, originalFile) {
    if (this.elements.processedFileSize) {
      this.elements.processedFileSize.textContent = this.formatFileSize(blob.size);
    }
    if (this.elements.processedFormat) {
      this.elements.processedFormat.textContent = blob.type.split('/')[1].toUpperCase();
    }

    // 압축률 계산 및 표시
    const compressionRatio = ((1 - blob.size / originalFile.size) * 100).toFixed(1);

    // PNG의 경우 압축률이 음수일 수 있음 (이미지 크기 조정으로 인해)
    if (blob.type === 'image/png') {
      if (compressionRatio > 0) {
        if (this.elements.compressionRatio) {
          this.elements.compressionRatio.textContent = `압축률: ${compressionRatio}%`;
        }
      } else {
        if (this.elements.compressionRatio) {
          this.elements.compressionRatio.textContent = `크기 조정: ${Math.abs(compressionRatio)}% 증가`;
        }
      }
    } else {
      if (this.elements.compressionRatio) {
        this.elements.compressionRatio.textContent = `압축률: ${compressionRatio}%`;
      }
    }

    if (this.elements.compressionInfo) {
      this.elements.compressionInfo.style.display = 'block';
    }

    // 이미지 크기는 이미지 로드 후 업데이트
    const img = new Image();
    img.onload = () => {
      if (this.elements.processedImageSize) {
        this.elements.processedImageSize.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
      }
    };
    img.src = URL.createObjectURL(blob);
  }

  // 파일 크기 포맷팅
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 크롭 정보 업데이트
  updateCropInfo(x, y, width, height) {
    if (this.elements.cropX) {
      this.elements.cropX.value = Math.round(x);
    }
    if (this.elements.cropY) {
      this.elements.cropY.value = Math.round(y);
    }
    if (this.elements.cropWidth) {
      this.elements.cropWidth.value = Math.round(width);
    }
    if (this.elements.cropHeight) {
      this.elements.cropHeight.value = Math.round(height);
    }
  }
}