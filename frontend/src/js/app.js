// 메인 애플리케이션
import { ImageProcessor } from './modules/imageProcessor.js';
import { CropManager } from './modules/cropManager.js';
import { FileUploader } from './modules/fileUploader.js';
import { UIManager } from './modules/uiManager.js';
import { WorkManager } from './modules/workManager.js';
import { MagnifierManager } from './modules/magnifierManager.js';
import { SettingsManager } from './modules/settingsManager.js';
import { ImageInfoManager } from './modules/imageInfoManager.js';

export class ImageGeneratorApp {
  constructor() {
    this.uiManager = new UIManager();
    this.imageProcessor = new ImageProcessor();
    this.cropManager = new CropManager();
    this.fileUploader = new FileUploader();
    this.workManager = new WorkManager();
    this.magnifierManager = new MagnifierManager(this.uiManager);
    this.settingsManager = new SettingsManager(this.uiManager, this);
    this.imageInfoManager = new ImageInfoManager(this.uiManager);
    this.autoSaveEnabled = false;
    this.processedBlob = null;
  }

      // 애플리케이션 초기화
  async init() {
    this.uiManager.initializeElements();
    this.bindEvents();
    this.magnifierManager.initMagnifier();
    this.settingsManager.initFormatControls();

    // 자동 저장된 작업물이 있는지 확인
    await this.checkAutoSave();

    // 초기 버튼 상태 설정
    this.updateButtonStates();
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

    // 업로드 섹션 작업물 관련 버튼 이벤트 (제거됨 - HTML에 해당 요소가 없음)
    // elements.uploadLoadWorkBtn.addEventListener('click', () => this.showWorkListModal());
    // elements.uploadAutoSaveBtn.addEventListener('click', () => this.toggleAutoSave());

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

    // 크롭 정보 input 이벤트 리스너 추가
    elements.cropX.addEventListener('input', () => this.handleCropInputChange());
    elements.cropY.addEventListener('input', () => this.handleCropInputChange());
    elements.cropWidth.addEventListener('input', () => this.handleCropInputChange());
    elements.cropHeight.addEventListener('input', () => this.handleCropInputChange());
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

      this.uiManager.showSuccessMessage(`${results.length}개 파일이 다운로드되었습니다.`);
    } catch (error) {
      console.error('다중 사이즈 다운로드 중 오류:', error);
      this.uiManager.showErrorMessage('다운로드 중 오류가 발생했습니다.');
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
      this.imageInfoManager.updateOriginalImageInfo(file);

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();
    } catch (error) {
      console.error('파일 로드 중 오류:', error);
      this.uiManager.showErrorMessage(error.message);
    }
  }

  // 이미지 처리
  async processImage() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showWarningMessage('먼저 이미지를 업로드해주세요.');
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
      this.imageInfoManager.updateProcessedImageInfo(this.processedBlob, originalFile);

      // 사이즈 옵션 표시
      this.uiManager.showSizeOptions();

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();
    } catch (error) {
      console.error('이미지 처리 중 오류:', error);
      this.uiManager.showErrorMessage('이미지 처리 중 오류가 발생했습니다.');
    }
  }

  // 크롭 모드 토글
  toggleCropMode() {
    const originalFile = this.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showWarningMessage('먼저 이미지를 업로드해주세요.');
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

      // 초기 크롭 정보 업데이트
      this.cropManager.updateCropInfo(this.uiManager);
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
      this.imageInfoManager.updateProcessedImageInfo(this.processedBlob, sourceFile);

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
    return this.settingsManager.getCurrentSettings();
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
      this.uiManager.showWarningMessage('작업물 이름을 입력해주세요.');
      return;
    }

    const originalFile = this.fileUploader.getOriginalFile();
    const originalImage = elements.originalImage.src;
    const processedImage = this.processedBlob ? elements.processedImage.src : null;
    const settings = this.getCurrentSettings();

    const workData = await this.workManager.createWorkData(originalImage, processedImage, settings, workName);
    const success = await this.workManager.saveWork(workData);

    if (success) {
      this.uiManager.showSuccessMessage('작업물이 저장되었습니다.');
      this.hideSaveWorkModal();
    } else {
      this.uiManager.showErrorMessage('작업물 저장에 실패했습니다.');
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
      this.imageInfoManager.updateOriginalImageInfo(work.originalImage);

      // 처리된 이미지 설정
      if (work.processedImage) {
        await loadImage(work.processedImage);
        elements.processedImage.src = work.processedImage;
        this.processedBlob = work.processedImage;

        // 처리된 이미지 정보 업데이트
        this.imageInfoManager.updateProcessedImageInfo(work.processedImage, work.originalImage);
      } else {
        elements.processedImage.src = work.originalImage;
        this.processedBlob = null;

        // 처리된 이미지 정보 초기화
        this.uiManager.resetProcessedImageInfo();
      }

      // 설정 적용
      this.settingsManager.applySettings(work.settings);

      // 미리보기 섹션 표시
      this.uiManager.showPreview();

      // 버튼 상태 업데이트
      this.updateButtonStates();

      this.uiManager.showSuccessMessage('작업물을 불러왔습니다.');
    } catch (error) {
      console.error('작업물 불러오기 실패:', error);
      this.uiManager.showErrorMessage('작업물을 불러오는 중 오류가 발생했습니다. 이미지 데이터가 손상되었을 수 있습니다.');
    }
  }





  // 작업물 삭제
  async deleteWork(workId) {
    if (confirm('이 작업물을 삭제하시겠습니까?')) {
      const success = await this.workManager.deleteWork(workId);
      if (success) {
        this.uiManager.showSuccessMessage('작업물이 삭제되었습니다.');
        // 목록 새로고침
        await this.showWorkListModal();
      } else {
        this.uiManager.showErrorMessage('작업물 삭제에 실패했습니다.');
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

    // 업로드 섹션 자동저장 버튼 업데이트 (제거됨 - HTML에 해당 요소가 없음)
    // elements.uploadAutoSaveBtn.textContent = this.autoSaveEnabled ? '🔄 자동저장 ON' : '🔄 자동저장';
    // elements.uploadAutoSaveBtn.classList.toggle('btn-success', this.autoSaveEnabled);
    // elements.uploadAutoSaveBtn.classList.toggle('btn-warning', !this.autoSaveEnabled);

    this.uiManager.showInfoMessage(
      this.autoSaveEnabled ? '자동 저장이 활성화되었습니다.' : '자동 저장이 비활성화되었습니다.'
    );
  }

  // 모든 작업물 삭제
  async clearAllWorks() {
    if (confirm('모든 저장된 작업물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const success = await this.workManager.clearAllWorks();
      if (success) {
        this.uiManager.showSuccessMessage('모든 작업물이 삭제되었습니다.');
      } else {
        this.uiManager.showErrorMessage('작업물 삭제에 실패했습니다.');
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

// 애플리케이션 초기화 (클라이언트 사이드에서만 실행)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const app = new ImageGeneratorApp();
    await app.init();
  });
}