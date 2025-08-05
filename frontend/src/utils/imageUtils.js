// 이미지 처리 및 최적화 유틸리티 함수들

/**
 * 이미지 크기 조정
 * @param {HTMLImageElement} img - 원본 이미지
 * @param {number} maxWidth - 최대 너비
 * @param {number} maxHeight - 최대 높이
 * @returns {Object} 조정된 크기 정보
 */
export function calculateImageSize(img, maxWidth, maxHeight) {
  let { width, height } = img;

  if (maxWidth && maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  } else if (maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height *= ratio;
  } else if (maxHeight) {
    const ratio = maxHeight / height;
    width *= ratio;
    height = maxHeight;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * 이미지 형식 변환
 * @param {HTMLCanvasElement} canvas - 캔버스 요소
 * @param {string} format - 출력 형식 ('jpeg', 'png', 'webp')
 * @param {number} quality - 품질 (0-1)
 * @returns {Promise<Blob>} 변환된 이미지 Blob
 */
export function convertImageFormat(canvas, format, quality = 0.8) {
  return new Promise((resolve, reject) => {
    let mimeType = 'image/jpeg';

    switch (format.toLowerCase()) {
      case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'jpeg':
      case 'jpg':
      default:
        mimeType = 'image/jpeg';
        break;
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('이미지 변환에 실패했습니다.'));
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * 이미지 압축
 * @param {File} file - 원본 파일
 * @param {Object} options - 압축 옵션
 * @returns {Promise<Blob>} 압축된 이미지 Blob
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function() {
      const { width, height } = calculateImageSize(img, maxWidth, maxHeight);

      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // 형식 변환
      convertImageFormat(canvas, format, quality)
        .then(resolve)
        .catch(reject);
    };

    img.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 이미지 메타데이터 추출
 * @param {File} file - 이미지 파일
 * @returns {Promise<Object>} 이미지 메타데이터
 */
export function getImageMetadata(file) {
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

/**
 * 파일 크기 포맷팅
 * @param {number} bytes - 바이트 단위 크기
 * @returns {string} 포맷된 크기 문자열
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 이미지 크롭
 * @param {HTMLCanvasElement} canvas - 캔버스 요소
 * @param {number} x - 시작 X 좌표
 * @param {number} y - 시작 Y 좌표
 * @param {number} width - 크롭할 너비
 * @param {number} height - 크롭할 높이
 * @returns {HTMLCanvasElement} 크롭된 캔버스
 */
export function cropImage(canvas, x, y, width, height) {
  const croppedCanvas = document.createElement('canvas');
  const ctx = croppedCanvas.getContext('2d');

  croppedCanvas.width = width;
  croppedCanvas.height = height;

  ctx.drawImage(
    canvas,
    x, y, width, height,
    0, 0, width, height
  );

  return croppedCanvas;
}

/**
 * 이미지 회전
 * @param {HTMLCanvasElement} canvas - 캔버스 요소
 * @param {number} angle - 회전 각도 (도)
 * @returns {HTMLCanvasElement} 회전된 캔버스
 */
export function rotateImage(canvas, angle) {
  const rotatedCanvas = document.createElement('canvas');
  const ctx = rotatedCanvas.getContext('2d');

  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  rotatedCanvas.width = Math.abs(canvas.width * cos) + Math.abs(canvas.height * sin);
  rotatedCanvas.height = Math.abs(canvas.width * sin) + Math.abs(canvas.height * cos);

  ctx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return rotatedCanvas;
}

/**
 * 이미지 필터 적용
 * @param {HTMLCanvasElement} canvas - 캔버스 요소
 * @param {string} filter - CSS 필터 문자열
 * @returns {HTMLCanvasElement} 필터가 적용된 캔버스
 */
export function applyImageFilter(canvas, filter) {
  const filteredCanvas = document.createElement('canvas');
  const ctx = filteredCanvas.getContext('2d');

  filteredCanvas.width = canvas.width;
  filteredCanvas.height = canvas.height;

  // 임시 이미지 요소에 필터 적용
  const tempImg = new Image();
  tempImg.onload = function() {
    ctx.filter = filter;
    ctx.drawImage(tempImg, 0, 0);
  };

  tempImg.src = canvas.toDataURL();
  return filteredCanvas;
}

/**
 * 이미지 품질 평가
 * @param {File} file - 이미지 파일
 * @returns {Promise<Object>} 품질 정보
 */
export async function assessImageQuality(file) {
  const metadata = await getImageMetadata(file);

  const quality = {
    resolution: metadata.width * metadata.height,
    fileSize: metadata.size,
    compressionRatio: 1, // 기본값
    recommendations: []
  };

  // 해상도 기반 권장사항
  if (quality.resolution < 640 * 480) {
    quality.recommendations.push('저해상도 이미지입니다. 더 높은 해상도의 이미지를 사용하세요.');
  } else if (quality.resolution > 4000 * 3000) {
    quality.recommendations.push('고해상도 이미지입니다. 웹 사용을 위해 압축을 고려하세요.');
  }

  // 파일 크기 기반 권장사항
  if (metadata.size > 5 * 1024 * 1024) { // 5MB
    quality.recommendations.push('파일 크기가 큽니다. 압축을 권장합니다.');
  }

  return quality;
}