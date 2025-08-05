// UI 관리 모듈
export class UIManager {
  constructor() {
    this.elements = {};
  }

  // DOM 요소 초기화
  initializeElements() {
    this.elements = {
      uploadSection: document.getElementById('uploadSection'),
      fileInput: document.getElementById('fileInput'),
      previewSection: document.getElementById('previewSection'),
      originalImage: document.getElementById('originalImage'),
      processedImage: document.getElementById('processedImage'),
      formatSelect: document.getElementById('formatSelect'),

      // JPEG 품질 설정
      jpegQualityGroup: document.getElementById('jpegQualityGroup'),
      jpegQualitySlider: document.getElementById('jpegQualitySlider'),
      jpegQualityValue: document.getElementById('jpegQualityValue'),

      // PNG 압축 설정
      pngCompressionGroup: document.getElementById('pngCompressionGroup'),
      pngCompressionSlider: document.getElementById('pngCompressionSlider'),
      pngCompressionValue: document.getElementById('pngCompressionValue'),

      // WebP 품질 설정
      webpQualityGroup: document.getElementById('webpQualityGroup'),
      webpQualitySlider: document.getElementById('webpQualitySlider'),
      webpQualityValue: document.getElementById('webpQualityValue'),
      webpTransparency: document.getElementById('webpTransparency'),

      // 이미지 정보 표시
      originalFileSize: document.getElementById('originalFileSize'),
      originalImageSize: document.getElementById('originalImageSize'),
      originalFormat: document.getElementById('originalFormat'),
      processedFileSize: document.getElementById('processedFileSize'),
      processedImageSize: document.getElementById('processedImageSize'),
      processedFormat: document.getElementById('processedFormat'),
      compressionInfo: document.getElementById('compressionInfo'),
      compressionRatio: document.getElementById('compressionRatio'),

      // 사이즈 별 저장 옵션
      sizeOptions: document.getElementById('sizeOptions'),
      size1x: document.getElementById('size1x'),
      size2x: document.getElementById('size2x'),
      size3x: document.getElementById('size3x'),
      downloadMultiBtn: document.getElementById('downloadMultiBtn'),

      maxWidth: document.getElementById('maxWidth'),
      maxHeight: document.getElementById('maxHeight'),
      processBtn: document.getElementById('processBtn'),
      cropBtn: document.getElementById('cropBtn'),
      downloadBtn: document.getElementById('downloadBtn'),
      resetImageBtn: document.getElementById('resetImageBtn'),
      resetBtn: document.getElementById('resetBtn'),
      saveWorkBtn: document.getElementById('saveWorkBtn'),
      loadWorkBtn: document.getElementById('loadWorkBtn'),
      autoSaveBtn: document.getElementById('autoSaveBtn'),
      clearWorksBtn: document.getElementById('clearWorksBtn'),
      uploadLoadWorkBtn: document.getElementById('uploadLoadWorkBtn'),
      uploadAutoSaveBtn: document.getElementById('uploadAutoSaveBtn'),
      cropSection: document.getElementById('cropSection'),
      cropImage: document.getElementById('cropImage'),
      cropOverlay: document.getElementById('cropOverlay'),
      cropHandleNW: document.getElementById('cropHandleNW'),
      cropHandleN: document.getElementById('cropHandleN'),
      cropHandleNE: document.getElementById('cropHandleNE'),
      cropHandleW: document.getElementById('cropHandleW'),
      cropHandleE: document.getElementById('cropHandleE'),
      cropHandleSW: document.getElementById('cropHandleSW'),
      cropHandleS: document.getElementById('cropHandleS'),
      cropHandleSE: document.getElementById('cropHandleSE'),
      applyCropBtn: document.getElementById('applyCropBtn'),
      cancelCropBtn: document.getElementById('cancelCropBtn'),
      // 확대/축소 관련 요소들
      zoomOutBtn: document.getElementById('zoomOutBtn'),
      zoomInBtn: document.getElementById('zoomInBtn'),
      resetZoomBtn: document.getElementById('resetZoomBtn'),
      zoomLevel: document.getElementById('zoomLevel'),
      originalImageContainer: document.getElementById('originalImage').parentElement,
      processedImageContainer: document.getElementById('processedImage').parentElement,

      // 작업물 모달 관련 요소들
      workModal: document.getElementById('workModal'),
      workList: document.getElementById('workList'),
      workEmpty: document.getElementById('workEmpty'),
      closeWorkModal: document.getElementById('closeWorkModal'),
      workSaveModal: document.getElementById('workSaveModal'),
      workNameInput: document.getElementById('workNameInput'),
      saveOriginalPreview: document.getElementById('saveOriginalPreview'),
      saveProcessedPreview: document.getElementById('saveProcessedPreview'),
      saveSettingsPreview: document.getElementById('saveSettingsPreview'),
      confirmSaveWorkBtn: document.getElementById('confirmSaveWorkBtn'),
      cancelSaveWorkBtn: document.getElementById('cancelSaveWorkBtn'),
      closeWorkSaveModal: document.getElementById('closeWorkSaveModal')
    };
  }

  // 품질 값 업데이트
  updateQualityValue() {
    this.elements.qualityValue.textContent = this.elements.qualitySlider.value + '%';
  }

  // 미리보기 표시
  showPreview() {
    this.elements.previewSection.style.display = 'block';
    this.elements.uploadSection.style.display = 'none';
  }

  // 크롭 섹션 표시/숨김
  toggleCropSection(show) {
    this.elements.cropSection.style.display = show ? 'block' : 'none';
  }

  // 이미지만 초기화 (설정은 유지)
  resetImage() {
    // 원본 이미지는 유지하고, 처리된 이미지만 초기화
    this.elements.processedImage.src = '';
    this.elements.cropSection.style.display = 'none';

    // 처리된 이미지 정보만 초기화
    this.resetProcessedImageInfo();

    // 사이즈 옵션 숨기기
    this.hideSizeOptions();
  }

  // 앱 리셋 (모든 설정 포함)
  resetApp() {
    this.elements.previewSection.style.display = 'none';
    this.elements.cropSection.style.display = 'none';
    this.elements.uploadSection.style.display = 'block';
    this.elements.fileInput.value = '';
    this.elements.originalImage.src = '';
    this.elements.processedImage.src = '';

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
    this.elements.originalFileSize.textContent = '-';
    this.elements.originalImageSize.textContent = '-';
    this.elements.originalFormat.textContent = '-';
    this.elements.processedFileSize.textContent = '-';
    this.elements.processedImageSize.textContent = '-';
    this.elements.processedFormat.textContent = '-';
    this.elements.compressionInfo.style.display = 'none';
  }

  // 처리된 이미지 정보만 초기화
  resetProcessedImageInfo() {
    this.elements.processedFileSize.textContent = '-';
    this.elements.processedImageSize.textContent = '-';
    this.elements.processedFormat.textContent = '-';
    this.elements.compressionInfo.style.display = 'none';
  }

  // 원본 이미지 정보 업데이트
  updateOriginalImageInfo(file) {
    this.elements.originalFileSize.textContent = this.formatFileSize(file.size);
    this.elements.originalFormat.textContent = file.type.split('/')[1].toUpperCase();

    // 이미지 크기는 이미지 로드 후 업데이트
    const img = new Image();
    img.onload = () => {
      this.elements.originalImageSize.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
    };
    img.src = URL.createObjectURL(file);
  }

  // 처리된 이미지 정보 업데이트
  updateProcessedImageInfo(blob, originalFile) {
    this.elements.processedFileSize.textContent = this.formatFileSize(blob.size);
    this.elements.processedFormat.textContent = blob.type.split('/')[1].toUpperCase();

    // 압축률 계산 및 표시
    const compressionRatio = ((1 - blob.size / originalFile.size) * 100).toFixed(1);

    // PNG의 경우 압축률이 음수일 수 있음 (이미지 크기 조정으로 인해)
    if (blob.type === 'image/png') {
      if (compressionRatio > 0) {
        this.elements.compressionRatio.textContent = `압축률: ${compressionRatio}%`;
      } else {
        this.elements.compressionRatio.textContent = `크기 조정: ${Math.abs(compressionRatio)}% 증가`;
      }
    } else {
      this.elements.compressionRatio.textContent = `압축률: ${compressionRatio}%`;
    }

    this.elements.compressionInfo.style.display = 'block';

    // 이미지 크기는 이미지 로드 후 업데이트
    const img = new Image();
    img.onload = () => {
      this.elements.processedImageSize.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
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

  // 이미지 소스 설정
  setImageSource(imageElement, source) {
    imageElement.src = source;
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

  // 알림 표시
  showAlert(message) {
    alert(message);
  }

  // 성공 메시지 표시
  showSuccessMessage(originalSize, newSize) {
    this.showAlert(`크롭 완료!\n원본: ${originalSize}\n크롭된 이미지: ${newSize}`);
  }

  // DOM 요소 가져오기
  getElement(name) {
    return this.elements[name];
  }

  // 모든 DOM 요소 가져오기
  getElements() {
    return this.elements;
  }
}