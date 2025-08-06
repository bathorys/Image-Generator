// 설정 관리자
export class SettingsManager {
  constructor(uiManager, app) {
    this.uiManager = uiManager;
    this.app = app;
  }

  // 확장자별 컨트롤 초기화
  initFormatControls() {
    const elements = this.uiManager.getElements();

    // 형식 선택 이벤트
    if (elements.formatSelect) {
      elements.formatSelect.addEventListener('change', () => {
        this.updateFormatControls();
        this.app.autoSaveWork();
      });
    }

    // 슬라이더 이벤트
    if (elements.jpegQualitySlider) {
      elements.jpegQualitySlider.addEventListener('input', () => {
        elements.jpegQualityValue.textContent = elements.jpegQualitySlider.value + '%';
        this.app.autoSaveWork();
      });
    }

    if (elements.pngCompressionSlider) {
      elements.pngCompressionSlider.addEventListener('input', () => {
        elements.pngCompressionValue.textContent = elements.pngCompressionSlider.value;
        this.app.autoSaveWork();
      });
    }

    if (elements.webpQualitySlider) {
      elements.webpQualitySlider.addEventListener('input', () => {
        elements.webpQualityValue.textContent = elements.webpQualitySlider.value + '%';
        this.app.autoSaveWork();
      });
    }

    if (elements.webpTransparency) {
      elements.webpTransparency.addEventListener('change', () => {
        this.app.autoSaveWork();
      });
    }

    // 최대 크기 입력 이벤트
    if (elements.maxWidth) {
      elements.maxWidth.addEventListener('input', () => {
        this.app.autoSaveWork();
      });
    }

    if (elements.maxHeight) {
      elements.maxHeight.addEventListener('input', () => {
        this.app.autoSaveWork();
      });
    }

    // 크롭 입력 이벤트
    if (elements.cropX) {
      elements.cropX.addEventListener('input', () => {
        this.app.handleCropInputChange();
      });
    }

    if (elements.cropY) {
      elements.cropY.addEventListener('input', () => {
        this.app.handleCropInputChange();
      });
    }

    if (elements.cropWidth) {
      elements.cropWidth.addEventListener('input', () => {
        this.app.handleCropInputChange();
      });
    }

    if (elements.cropHeight) {
      elements.cropHeight.addEventListener('input', () => {
        this.app.handleCropInputChange();
      });
    }

    // 사이즈 옵션 체크박스 이벤트
    if (elements.size1x) {
      elements.size1x.addEventListener('change', () => {
        this.app.autoSaveWork();
      });
    }

    if (elements.size2x) {
      elements.size2x.addEventListener('change', () => {
        this.app.autoSaveWork();
      });
    }

    if (elements.size3x) {
      elements.size3x.addEventListener('change', () => {
        this.app.autoSaveWork();
      });
    }
  }

  // 형식별 컨트롤 업데이트
  updateFormatControls() {
    const elements = this.uiManager.getElements();
    const format = elements.formatSelect.value;

    // 모든 컨트롤 그룹 숨기기
    const controlGroups = document.querySelectorAll('[data-component="control-group"]');
    controlGroups.forEach(group => {
      group.style.display = 'none';
    });

    // 선택된 형식에 따라 컨트롤 표시
    switch (format) {
      case 'jpeg':
        const jpegGroup = document.querySelector('[data-type="jpeg-quality"]');
        if (jpegGroup) jpegGroup.style.display = 'block';
        break;
      case 'png':
        const pngGroup = document.querySelector('[data-type="png-compression"]');
        if (pngGroup) pngGroup.style.display = 'block';
        break;
      case 'webp':
        const webpGroup = document.querySelector('[data-type="webp-quality"]');
        if (webpGroup) webpGroup.style.display = 'block';
        break;
    }
  }

  // 현재 설정 가져오기
  getCurrentSettings() {
    const elements = this.uiManager.getElements();

    return {
      format: elements.formatSelect?.value || 'original',
      jpegQuality: elements.jpegQualitySlider?.value || 80,
      pngCompression: elements.pngCompressionSlider?.value || 6,
      webpQuality: elements.webpQualitySlider?.value || 80,
      webpTransparency: elements.webpTransparency?.checked || false,
      maxWidth: elements.maxWidth?.value || '',
      maxHeight: elements.maxHeight?.value || '',
      sizeOptions: {
        size1x: elements.size1x?.checked || true,
        size2x: elements.size2x?.checked || false,
        size3x: elements.size3x?.checked || false
      }
    };
  }

  // 설정 적용
  applySettings(settings) {
    const elements = this.uiManager.getElements();

    // 형식 설정
    if (settings.format && elements.formatSelect) {
      elements.formatSelect.value = settings.format;
      this.updateFormatControls();
    }

    // JPEG 품질 설정
    if (settings.jpegQuality && elements.jpegQualitySlider) {
      elements.jpegQualitySlider.value = settings.jpegQuality;
      elements.jpegQualityValue.textContent = settings.jpegQuality + '%';
    }

    // PNG 압축 설정
    if (settings.pngCompression && elements.pngCompressionSlider) {
      elements.pngCompressionSlider.value = settings.pngCompression;
      elements.pngCompressionValue.textContent = settings.pngCompression;
    }

    // WebP 품질 설정
    if (settings.webpQuality && elements.webpQualitySlider) {
      elements.webpQualitySlider.value = settings.webpQuality;
      elements.webpQualityValue.textContent = settings.webpQuality + '%';
    }

    // WebP 투명도 설정
    if (settings.webpTransparency !== undefined && elements.webpTransparency) {
      elements.webpTransparency.checked = settings.webpTransparency;
    }

    // 최대 크기 설정
    if (settings.maxWidth !== undefined && elements.maxWidth) {
      elements.maxWidth.value = settings.maxWidth;
    }
    if (settings.maxHeight !== undefined && elements.maxHeight) {
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
}