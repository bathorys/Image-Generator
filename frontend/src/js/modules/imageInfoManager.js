// 이미지 정보 관리자
export class ImageInfoManager {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  // 원본 이미지 정보 업데이트
  updateOriginalImageInfo(base64Image) {
    const elements = this.uiManager.getElements();

    if (!base64Image) return;

    // 이미지 크기 계산
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // 파일 크기 계산 (base64에서)
      const base64Length = base64Image.length;
      const fileSizeBytes = Math.ceil((base64Length * 3) / 4);
      const fileSizeKB = (fileSizeBytes / 1024).toFixed(1);

      // 형식 추출
      const format = this.extractFormatFromBase64(base64Image);

      // 정보 업데이트
      if (elements.originalFileSize) {
        elements.originalFileSize.textContent = `${fileSizeKB} KB`;
      }
      if (elements.originalImageSize) {
        elements.originalImageSize.textContent = `${width} × ${height}`;
      }
      if (elements.originalFormat) {
        elements.originalFormat.textContent = format.toUpperCase();
      }
    };

    img.src = base64Image;
  }

  // 처리된 이미지 정보 업데이트
  updateProcessedImageInfo(processedBase64, originalBase64) {
    const elements = this.uiManager.getElements();

    if (!processedBase64) return;

    // 이미지 크기 계산
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      // 파일 크기 계산
      const base64Length = processedBase64.length;
      const fileSizeBytes = Math.ceil((base64Length * 3) / 4);
      const fileSizeKB = (fileSizeBytes / 1024).toFixed(1);

      // 형식 추출
      const format = this.extractFormatFromBase64(processedBase64);

      // 압축률 계산 (원본과 비교)
      let compressionRatio = '';
      if (originalBase64) {
        const originalLength = originalBase64.length;
        const originalBytes = Math.ceil((originalLength * 3) / 4);
        const processedBytes = Math.ceil((base64Length * 3) / 4);
        const ratio = ((originalBytes - processedBytes) / originalBytes * 100).toFixed(1);
        compressionRatio = `${ratio}%`;
      }

      // 정보 업데이트
      if (elements.processedFileSize) {
        elements.processedFileSize.textContent = `${fileSizeKB} KB`;
      }
      if (elements.processedImageSize) {
        elements.processedImageSize.textContent = `${width} × ${height}`;
      }
      if (elements.processedFormat) {
        elements.processedFormat.textContent = format.toUpperCase();
      }

      // 압축률 표시
      if (elements.compressionRatio && compressionRatio) {
        elements.compressionRatio.textContent = compressionRatio;
        const compressionInfo = elements.compressionInfo;
        if (compressionInfo) {
          compressionInfo.style.display = 'block';
        }
      }
    };

    img.src = processedBase64;
  }

  // Base64에서 형식 추출
  extractFormatFromBase64(base64String) {
    if (base64String.startsWith('data:image/jpeg')) return 'jpeg';
    if (base64String.startsWith('data:image/png')) return 'png';
    if (base64String.startsWith('data:image/webp')) return 'webp';
    if (base64String.startsWith('data:image/gif')) return 'gif';
    return 'unknown';
  }

  // 저장할 작업물 미리보기 정보 업데이트
  updateSaveWorkPreview(originalImage, processedImage, settings) {
    const elements = this.uiManager.getElements();

    // 원본 이미지 정보
    if (elements.saveOriginalPreview) {
      elements.saveOriginalPreview.textContent = originalImage ? '있음' : '없음';
    }

    // 처리된 이미지 정보
    if (elements.saveProcessedPreview) {
      elements.saveProcessedPreview.textContent = processedImage ? '있음' : '없음';
    }

    // 설정 정보
    if (elements.saveSettingsPreview) {
      const format = settings?.format || '원본 형식';
      const quality = settings?.jpegQuality || settings?.webpQuality || '';
      const qualityText = quality ? ` (품질: ${quality}%)` : '';
      elements.saveSettingsPreview.textContent = `${format}${qualityText}`;
    }
  }
}