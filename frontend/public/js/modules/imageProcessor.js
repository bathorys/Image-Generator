// 이미지 처리 모듈
export class ImageProcessor {
  constructor() {
    this.originalFile = null;
    this.processedBlob = null;
  }

  // WebP 지원 확인
  isWebPSupported() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // PNG 압축 처리
  async compressPNG(canvas, compressionLevel) {
    return new Promise((resolve) => {
      // PNG는 lossless 압축이므로 품질 조정이 어렵습니다
      // 압축 레벨에 따라 다른 방식으로 처리

      if (compressionLevel <= 3) {
        // 낮은 압축: 원본 크기 유지, 기본 PNG 압축
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      } else if (compressionLevel <= 6) {
        // 중간 압축: 약간의 크기 조정
        const scale = 0.9;
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        const newWidth = Math.max(originalWidth * scale, 100);
        const newHeight = Math.max(originalHeight * scale, 100);

        const compressedCanvas = document.createElement('canvas');
        const compressedCtx = compressedCanvas.getContext('2d');

        compressedCanvas.width = newWidth;
        compressedCanvas.height = newHeight;

        compressedCtx.imageSmoothingEnabled = true;
        compressedCtx.imageSmoothingQuality = 'high';
        compressedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

        compressedCanvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      } else {
        // 높은 압축: 더 큰 크기 조정
        const scale = 0.7;
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        const newWidth = Math.max(originalWidth * scale, 100);
        const newHeight = Math.max(originalHeight * scale, 100);

        const compressedCanvas = document.createElement('canvas');
        const compressedCtx = compressedCanvas.getContext('2d');

        compressedCanvas.width = newWidth;
        compressedCanvas.height = newHeight;

        compressedCtx.imageSmoothingEnabled = true;
        compressedCtx.imageSmoothingQuality = 'high';
        compressedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

        compressedCanvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      }
    });
  }

  // 이미지 처리
  async processImage(file, options = {}) {
    const {
      format = 'jpeg',
      jpegQuality = 0.8,
      pngCompression = 6,
      webpQuality = 0.8,
      webpTransparency = false,
      maxWidth = null,
      maxHeight = null
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function() {
        // 크기 계산
        let { width, height } = img;
        const maxW = maxWidth || width;
        const maxH = maxHeight || height;

        const ratio = Math.min(maxW / width, maxH / height);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        ctx.drawImage(img, 0, 0, width, height);

        // 형식별 처리
        if (format === 'png') {
          // PNG는 별도 압축 처리
          this.compressPNG(canvas, pngCompression).then(resolve);
          return;
        }

        // 다른 형식들
        let mimeType = 'image/jpeg';
        let quality = jpegQuality;

        switch (format) {
          case 'webp':
            // WebP 지원 확인
            if (this.isWebPSupported()) {
              mimeType = 'image/webp';
              quality = webpQuality;
            } else {
              // WebP가 지원되지 않으면 JPEG로 fallback
              console.warn('WebP가 지원되지 않습니다. JPEG로 변환합니다.');
              mimeType = 'image/jpeg';
              quality = webpQuality;
            }
            break;
          case 'jpeg':
          default:
            mimeType = 'image/jpeg';
            quality = jpegQuality;
            break;
        }

        // Blob 생성
        canvas.toBlob(function(blob) {
          resolve(blob);
        }, mimeType, quality);
      }.bind(this);

      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
      img.src = URL.createObjectURL(file);
    });
  }

  // 이미지 크롭
  async cropImage(blob, cropData, options = {}) {
    const {
      format = 'jpeg',
      jpegQuality = 0.8,
      pngCompression = 6,
      webpQuality = 0.8,
      webpTransparency = false
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function() {
        // 실제 이미지 크기와 화면상 크기의 비율 계산
        const scaleX = img.naturalWidth / cropData.imageWidth;
        const scaleY = img.naturalHeight / cropData.imageHeight;

        // 실제 크롭 좌표 계산
        const cropX = cropData.x * scaleX;
        const cropY = cropData.y * scaleY;
        const cropWidth = cropData.width * scaleX;
        const cropHeight = cropData.height * scaleY;

        // 캔버스 크기 설정
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // 크롭된 이미지 그리기
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropWidth, cropHeight
        );

        // 형식별 처리
        if (format === 'png') {
          // PNG는 별도 압축 처리
          this.compressPNG(canvas, pngCompression).then(resolve);
          return;
        }

        // 다른 형식들
        let mimeType = 'image/jpeg';
        let quality = jpegQuality;

        switch (format) {
          case 'webp':
            // WebP 지원 확인
            if (this.isWebPSupported()) {
              mimeType = 'image/webp';
              quality = webpQuality;
            } else {
              // WebP가 지원되지 않으면 JPEG로 fallback
              console.warn('WebP가 지원되지 않습니다. JPEG로 변환합니다.');
              mimeType = 'image/jpeg';
              quality = webpQuality;
            }
            break;
          case 'jpeg':
          default:
            mimeType = 'image/jpeg';
            quality = jpegQuality;
            break;
        }

        // 새로운 Blob 생성
        canvas.toBlob(function(blob) {
          resolve(blob);
        }, mimeType, quality);
      }.bind(this);

      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
      img.src = URL.createObjectURL(blob);
    });
  }

  // 파일 크기 포맷팅
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // 여러 사이즈로 이미지 처리
  async processImageMultipleSizes(file, sizes, options = {}) {
    const results = [];

    for (const size of sizes) {
      try {
        const sizeOptions = {
          ...options,
          maxWidth: options.maxWidth ? options.maxWidth * size : null,
          maxHeight: options.maxHeight ? options.maxHeight * size : null
        };

        const blob = await this.processImage(file, sizeOptions);
        results.push({
          size: size,
          blob: blob,
          width: options.maxWidth ? options.maxWidth * size : null,
          height: options.maxHeight ? options.maxHeight * size : null
        });
      } catch (error) {
        console.error(`사이즈 ${size}x 처리 중 오류:`, error);
        results.push({
          size: size,
          error: error.message
        });
      }
    }

    return results;
  }

  // 이미지 메타데이터 추출
  getImageMetadata(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = function() {
        const metadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        };

        resolve(metadata);
      };

      img.onerror = () => reject(new Error('이미지 메타데이터 추출에 실패했습니다.'));
      img.src = URL.createObjectURL(file);
    });
  }
}