// 이미지 처리 모듈
export class ImageProcessor {
  constructor() {
    this.originalFile = null;
    this.processedBlob = null;
  }

  // 이미지 처리
  async processImage(file, options = {}) {
    const {
      format = 'jpeg',
      quality = 0.8,
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

        // 형식 및 품질 설정
        let mimeType = 'image/jpeg';
        if (format === 'png') mimeType = 'image/png';
        else if (format === 'webp') mimeType = 'image/webp';

        // Blob 생성
        canvas.toBlob(function(blob) {
          resolve(blob);
        }, mimeType, quality);
      };

      img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
      img.src = URL.createObjectURL(file);
    });
  }

  // 이미지 크롭
  async cropImage(blob, cropData, options = {}) {
    const { format = 'jpeg', quality = 0.8 } = options;

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

        // 형식 및 품질 설정
        let mimeType = 'image/jpeg';
        if (format === 'png') mimeType = 'image/png';
        else if (format === 'webp') mimeType = 'image/webp';

        // 새로운 Blob 생성
        canvas.toBlob(function(blob) {
          resolve(blob);
        }, mimeType, quality);
      };

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