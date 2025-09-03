// 설정 관리자
export class SettingsManager {
  constructor(uiManager, app) {
    this.uiManager = uiManager;
    this.app = app;
    this.lastValidJpegQuality = 80;
    this.processTimeout = null;
  }

  // 옵션 변경 시 자동 처리 (디바운스)
  scheduleAutoProcess(delay = 300) {
    // 원본 이미지가 없으면 처리하지 않음 (경고 방지)
    try {
      if (!this.app.fileUploader || !this.app.fileUploader.getOriginalFile()) {
        return;
      }
    } catch (_) {
      return;
    }

    if (this.processTimeout) {
      clearTimeout(this.processTimeout);
      this.processTimeout = null;
    }
    this.processTimeout = setTimeout(() => {
      this.app.processImage();
    }, delay);
  }

  // 확장자별 컨트롤 초기화
  initFormatControls() {
    const elements = this.uiManager.getElements();

    // 초기 유효값 저장
    if (elements.jpegQualitySlider) {
      const init = parseInt(elements.jpegQualitySlider.value || '80', 10);
      this.lastValidJpegQuality = isNaN(init) ? 80 : Math.min(100, Math.max(1, init));
    }

    // 형식 선택 이벤트
    if (elements.formatSelect) {
      elements.formatSelect.addEventListener('change', () => {
        this.updateFormatControls();
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    // 슬라이더 이벤트
    if (elements.jpegQualitySlider) {
      elements.jpegQualitySlider.addEventListener('input', () => {
        let v = parseInt(elements.jpegQualitySlider.value || '0', 10);
        if (isNaN(v)) v = 1;
        if (v < 1) v = 1;
        if (v > 100) v = 100;
        elements.jpegQualitySlider.value = v;
        if (elements.jpegQualityInput) elements.jpegQualityInput.value = v;
        if (elements.jpegQualityValue) elements.jpegQualityValue.textContent = v + '%';
        this.lastValidJpegQuality = v;
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    if (elements.jpegQualityInput) {
      // 입력 중에는 빈 값 허용, 유효 숫자만 동기화
      elements.jpegQualityInput.addEventListener('input', () => {
        const raw = elements.jpegQualityInput.value;
        if (raw === '' || raw === null) {
          if (elements.jpegQualityValue) elements.jpegQualityValue.textContent = '-';
          return; // 아직 확정하지 않음
        }
        const v = parseInt(raw, 10);
        if (isNaN(v)) return;
        if (v >= 1 && v <= 100) {
          if (elements.jpegQualitySlider) elements.jpegQualitySlider.value = v;
          if (elements.jpegQualityValue) elements.jpegQualityValue.textContent = v + '%';
          this.lastValidJpegQuality = v;
          this.app.autoSaveWork();
          this.scheduleAutoProcess();
        }
      });

      // 포커스 아웃/변경 확정 시에만 클램프
      const finalize = () => {
        let v = parseInt(elements.jpegQualityInput.value || '', 10);
        if (isNaN(v)) v = this.lastValidJpegQuality;
        if (v < 1) v = 1;
        if (v > 100) v = 100;
        elements.jpegQualityInput.value = v;
        if (elements.jpegQualitySlider) elements.jpegQualitySlider.value = v;
        if (elements.jpegQualityValue) elements.jpegQualityValue.textContent = v + '%';
        this.lastValidJpegQuality = v;
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      };
      elements.jpegQualityInput.addEventListener('blur', finalize);
      elements.jpegQualityInput.addEventListener('change', finalize);
    }

    if (elements.pngCompressionSlider) {
      elements.pngCompressionSlider.addEventListener('input', () => {
        elements.pngCompressionValue.textContent = elements.pngCompressionSlider.value;
        if (elements.pngCompressionInput) elements.pngCompressionInput.value = elements.pngCompressionSlider.value;
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    if (elements.pngCompressionInput) {
      elements.pngCompressionInput.addEventListener('input', () => {
        const raw = elements.pngCompressionInput.value;
        if (raw === '' || raw === null) {
          if (elements.pngCompressionValue) elements.pngCompressionValue.textContent = '-';
          return;
        }
        const v = parseInt(raw, 10);
        if (isNaN(v)) return;
        if (v >= 0 && v <= 9) {
          if (elements.pngCompressionSlider) elements.pngCompressionSlider.value = v;
          if (elements.pngCompressionValue) elements.pngCompressionValue.textContent = String(v);
          this.app.autoSaveWork();
          this.scheduleAutoProcess();
        }
      });

      const finalizePng = () => {
        let v = parseInt(elements.pngCompressionInput.value || '', 10);
        if (isNaN(v)) v = parseInt(elements.pngCompressionSlider?.value || '6', 10) || 6;
        if (v < 0) v = 0;
        if (v > 9) v = 9;
        elements.pngCompressionInput.value = v;
        if (elements.pngCompressionSlider) elements.pngCompressionSlider.value = v;
        if (elements.pngCompressionValue) elements.pngCompressionValue.textContent = String(v);
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      };
      elements.pngCompressionInput.addEventListener('blur', finalizePng);
      elements.pngCompressionInput.addEventListener('change', finalizePng);
    }

    if (elements.webpQualitySlider) {
      elements.webpQualitySlider.addEventListener('input', () => {
        elements.webpQualityValue.textContent = elements.webpQualitySlider.value + '%';
        if (elements.webpQualityInput) elements.webpQualityInput.value = elements.webpQualitySlider.value;
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    if (elements.webpQualityInput) {
      elements.webpQualityInput.addEventListener('input', () => {
        const raw = elements.webpQualityInput.value;
        if (raw === '' || raw === null) {
          if (elements.webpQualityValue) elements.webpQualityValue.textContent = '-';
          return;
        }
        const v = parseInt(raw, 10);
        if (isNaN(v)) return;
        if (v >= 1 && v <= 100) {
          if (elements.webpQualitySlider) elements.webpQualitySlider.value = v;
          if (elements.webpQualityValue) elements.webpQualityValue.textContent = v + '%';
          this.app.autoSaveWork();
          this.scheduleAutoProcess();
        }
      });

      const finalizeWebp = () => {
        let v = parseInt(elements.webpQualityInput.value || '', 10);
        if (isNaN(v)) v = parseInt(elements.webpQualitySlider?.value || '80', 10) || 80;
        if (v < 1) v = 1;
        if (v > 100) v = 100;
        elements.webpQualityInput.value = v;
        if (elements.webpQualitySlider) elements.webpQualitySlider.value = v;
        if (elements.webpQualityValue) elements.webpQualityValue.textContent = v + '%';
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      };
      elements.webpQualityInput.addEventListener('blur', finalizeWebp);
      elements.webpQualityInput.addEventListener('change', finalizeWebp);
    }

    if (elements.webpTransparency) {
      elements.webpTransparency.addEventListener('change', () => {
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    // 최대 크기 입력 이벤트
    if (elements.maxWidth) {
      elements.maxWidth.addEventListener('input', () => {
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
      });
    }

    if (elements.maxHeight) {
      elements.maxHeight.addEventListener('input', () => {
        this.app.autoSaveWork();
        this.scheduleAutoProcess();
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
      if (elements.jpegQualityInput) elements.jpegQualityInput.value = settings.jpegQuality;
      elements.jpegQualityValue.textContent = settings.jpegQuality + '%';
      this.lastValidJpegQuality = parseInt(settings.jpegQuality, 10) || 80;
    }

    // PNG 압축 설정
    if (settings.pngCompression && elements.pngCompressionSlider) {
      elements.pngCompressionSlider.value = settings.pngCompression;
      elements.pngCompressionValue.textContent = settings.pngCompression;
      if (elements.pngCompressionInput) elements.pngCompressionInput.value = settings.pngCompression;
    }

    // WebP 품질 설정
    if (settings.webpQuality && elements.webpQualitySlider) {
      elements.webpQualitySlider.value = settings.webpQuality;
      if (elements.webpQualityInput) elements.webpQualityInput.value = settings.webpQuality;
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