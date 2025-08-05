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
      qualitySlider: document.getElementById('qualitySlider'),
      qualityValue: document.getElementById('qualityValue'),
      maxWidth: document.getElementById('maxWidth'),
      maxHeight: document.getElementById('maxHeight'),
      processBtn: document.getElementById('processBtn'),
      cropBtn: document.getElementById('cropBtn'),
      downloadBtn: document.getElementById('downloadBtn'),
      resetBtn: document.getElementById('resetBtn'),
      cropSection: document.getElementById('cropSection'),
      cropImage: document.getElementById('cropImage'),
      cropOverlay: document.getElementById('cropOverlay'),
      cropHandleNW: document.getElementById('cropHandleNW'),
      cropHandleNE: document.getElementById('cropHandleNE'),
      cropHandleSW: document.getElementById('cropHandleSW'),
      cropHandleSE: document.getElementById('cropHandleSE'),
      applyCropBtn: document.getElementById('applyCropBtn'),
      cancelCropBtn: document.getElementById('cancelCropBtn')
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

  // 앱 리셋
  resetApp() {
    this.elements.previewSection.style.display = 'none';
    this.elements.cropSection.style.display = 'none';
    this.elements.uploadSection.style.display = 'block';
    this.elements.fileInput.value = '';
    this.elements.originalImage.src = '';
    this.elements.processedImage.src = '';
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