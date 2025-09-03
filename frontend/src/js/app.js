// 메인 애플리케이션
import { ImageProcessor } from './modules/imageProcessor.js';
import { CropManager } from './modules/cropManager.js';
import { FileUploader } from './modules/fileUploader.js';
import { UIManager } from './modules/uiManager.js';
import { WorkManager } from './modules/workManager.js';
import { MagnifierManager } from './modules/magnifierManager.js';
import { SettingsManager } from './modules/settingsManager.js';
import { ImageInfoManager } from './modules/imageInfoManager.js';
import { EventManager } from './modules/eventManager.js';
import { WorkModalManager } from './modules/workModalManager.js';

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
    this.eventManager = new EventManager(this);
    this.workModalManager = new WorkModalManager(this);
    this.autoSaveEnabled = false;
    this.processedBlob = null;
  }

      // 애플리케이션 초기화
  async init() {
    this.uiManager.initializeElements();
    this.eventManager.bindEvents();
    this.eventManager.initCropEvents();
    this.magnifierManager.initMagnifier();
    this.settingsManager.initFormatControls();

    // 자동 저장된 작업물이 있는지 확인
    await this.checkAutoSave();

    // 초기 버튼 상태 설정
    this.updateButtonStates();

    // 초기 툴바 상태 설정
    await this.updateToolbarStatus();
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
      this.imageInfoManager.updateOriginalImageInfo(dataURL);

      // 크롭 버튼 텍스트 업데이트
      this.updateCropButtonText();

      // 업로드 직후 자동 제안: 웹 최적화 기준 크기 + 배율 옵션
      await this.suggestOptimizedSizes(file);

      // 제안된 크기에 맞춰 즉시 처리하여 processed 미리보기와 정보 갱신
      await this.processImage();
    } catch (error) {
      console.error('파일 로드 중 오류:', error);
      this.uiManager.showErrorMessage(error.message);
    }
  }

  // 업로드된 원본 기준으로 웹 최적화 크기와 배율 제안
  async suggestOptimizedSizes(file) {
    try {
      const meta = await this.imageProcessor.getImageMetadata(file);
      const { width, height } = meta;
      const elements = this.uiManager.getElements();

      // 기준: 모니터 FHD에 맞춰 긴 변 기준 1920(원본 이내로 제한)
      const longEdge = Math.max(width, height);
      const baseLong = Math.min(longEdge, 1920);

      // 같은 비율로 단축 변 계산
      const ratio = baseLong / longEdge;
      const baseW = Math.round(width * ratio);
      const baseH = Math.round(height * ratio);

      // 입력칸 채우기 (너비 우선 제안)
      if (elements.maxWidth) elements.maxWidth.value = String(baseW);
      if (elements.widthPreset) {
        // baseLong을 가장 가까운 프리셋으로 표시만 동기화 (값은 baseW 직접 입력)
        const presets = ['3840','2560','1920'];
        const nearest = presets.find(p => parseInt(p, 10) === baseLong) || '';
        elements.widthPreset.value = nearest;
      }
      if (elements.maxHeight) elements.maxHeight.value = '';

      // 배율 체크: base*2, *3이 원본 내이면 활성화, 아니면 비활성화
      const can1_5x = baseW * 1.5 <= width && baseH * 1.5 <= height;
      const can2x = baseW * 2 <= width && baseH * 2 <= height;
      const can3x = baseW * 3 <= width && baseH * 3 <= height;
      const can4x = baseW * 4 <= width && baseH * 4 <= height;

      // 기본은 1x 체크 유지, 2x/3x는 가능할 때만 체크
      if (elements.size1x) elements.size1x.checked = true;
      if (elements.size1_5x) {
        elements.size1_5x.disabled = !can1_5x;
        elements.size1_5x.checked = can1_5x; // 자동 체크
      }
      if (elements.size2x) {
        elements.size2x.disabled = !can2x;
        elements.size2x.checked = can2x; // 자동 체크
      }
      if (elements.size3x) {
        elements.size3x.disabled = !can3x;
        elements.size3x.checked = false && can3x; // 기본은 3x는 체크 해제
      }
      if (elements.size4x) {
        elements.size4x.disabled = !can4x;
        elements.size4x.checked = false && can4x; // 기본은 4x는 체크 해제
      }

      // 사이즈 옵션 영역 노출
      this.uiManager.showSizeOptions();
    } catch (_) {
      // 메타데이터 실패 시 무시
    }
  }

  // 현재 maxWidth/maxHeight와 원본을 기준으로 배율 선택 가능 여부를 갱신
  updateMultiplierAvailability() {
    try {
      const elements = this.uiManager.getElements();
      const file = this.fileUploader.getOriginalFile();
      if (!file) return;
      this.imageProcessor.getImageMetadata(file).then(meta => {
        const { width, height } = meta;
        const mw = parseInt(elements.maxWidth?.value || '0', 10) || null;
        const mh = parseInt(elements.maxHeight?.value || '0', 10) || null;

        // 실제 처리 로직과 동일하게 비율을 계산하여 기준 크기 산출
        const maxW = mw || width;
        const maxH = mh || height;
        const ratio = Math.min(maxW / width, maxH / height);
        const baseW = Math.round(width * ratio);
        const baseH = Math.round(height * ratio);

        // 배율 가능 여부
        const can15 = baseW * 1.5 <= width && baseH * 1.5 <= height;
        const can2 = baseW * 2 <= width && baseH * 2 <= height;
        const can3 = baseW * 3 <= width && baseH * 3 <= height;
        const can4 = baseW * 4 <= width && baseH * 4 <= height;

        if (elements.size1_5x) {
          elements.size1_5x.disabled = !can15;
          if (!can15) elements.size1_5x.checked = false;
        }
        if (elements.size2x) {
          elements.size2x.disabled = !can2;
          if (!can2) elements.size2x.checked = false;
        }
        if (elements.size3x) {
          elements.size3x.disabled = !can3;
          if (!can3) elements.size3x.checked = false;
        }
        if (elements.size4x) {
          elements.size4x.disabled = !can4;
          if (!can4) elements.size4x.checked = false;
        }
      });
    } catch (_) {
      // 무시
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

      // Blob을 Base64로 변환
      const reader = new FileReader();
      reader.onload = () => {
        const processedBase64 = reader.result;
        // 원본 파일도 Base64로 변환
        const originalReader = new FileReader();
        originalReader.onload = () => {
          const originalBase64 = originalReader.result;
          // 처리된 이미지 정보 업데이트
          this.imageInfoManager.updateProcessedImageInfo(processedBase64, originalBase64);
        };
        originalReader.readAsDataURL(originalFile);
      };
      reader.readAsDataURL(this.processedBlob);

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
    this.cropManager.toggleCropMode(this);
  }

    // 버튼 상태 업데이트
  updateButtonStates() {
    this.cropManager.updateCropButtonText(this);
  }

  // 크롭 버튼 텍스트 업데이트 (기존 함수 유지)
  updateCropButtonText() {
    this.cropManager.updateCropButtonText(this);
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
    this.cropManager.handleCropInputChange(this);
  }

  // 크롭 적용
  async applyCrop() {
    await this.cropManager.applyCrop(this);
  }

  // 크롭 취소
  cancelCrop() {
    this.cropManager.cancelCropMode(this);
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
    this.workModalManager.showSaveWorkModal();
  }

  // 작업물 저장 모달 숨기기
  hideSaveWorkModal() {
    this.workModalManager.hideSaveWorkModal();
  }

  // 작업물 저장
  async saveWork() {
    await this.workModalManager.saveWork();
    // 저장 후 툴바 상태 갱신
    await this.updateToolbarStatus();
  }

  // 작업물 목록 모달 표시
  async showWorkListModal() {
    await this.workModalManager.showWorkListModal();
  }

  // 작업물 목록 모달 숨기기
  hideWorkModal() {
    this.workModalManager.hideWorkModal();
  }

  // 작업물 아이템 생성
  createWorkItem(work) {
    return this.workModalManager.createWorkItem(work);
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
      // 불러오기 후 툴바 상태 갱신
      await this.updateToolbarStatus();
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
        // 툴바 상태 갱신
        await this.updateToolbarStatus();
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

    // 툴바 배지 갱신
    this.uiManager.setAutoSaveBadge(this.autoSaveEnabled);
  }

  // 모든 작업물 삭제
  async clearAllWorks() {
    if (confirm('모든 저장된 작업물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      const success = await this.workManager.clearAllWorks();
      if (success) {
        this.uiManager.showSuccessMessage('모든 작업물이 삭제되었습니다.');
        // 툴바 상태 갱신
        await this.updateToolbarStatus();
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

  // 툴바 상태 갱신 (자동저장 배지, 작업물 개수)
  async updateToolbarStatus() {
    try {
      this.uiManager.setAutoSaveBadge(this.autoSaveEnabled);
      const works = await this.workManager.getWorkList();
      this.uiManager.setWorksCount(works.length);
    } catch (e) {
      // 무시
    }
  }
}

// 애플리케이션 초기화 (클라이언트 사이드에서만 실행)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const app = new ImageGeneratorApp();
    await app.init();
  });
}