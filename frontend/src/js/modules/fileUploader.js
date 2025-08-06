// 파일 업로드 모듈
export class FileUploader {
  constructor() {
    this.originalFile = null;
  }

  // 파일 처리
  handleFile(file) {
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    this.originalFile = file;
    return file;
  }

  // 드래그 앤 드롭 이벤트 핸들러
  handleDragOver(e, uploadSection) {
    e.preventDefault();
    uploadSection.classList.add('dragover');
  }

  handleDragLeave(e, uploadSection) {
    e.preventDefault();
    uploadSection.classList.remove('dragover');
  }

  handleDrop(e, uploadSection) {
    e.preventDefault();
    uploadSection.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      return this.handleFile(files[0]);
    }
    return null;
  }

  // 파일 선택 이벤트 핸들러
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      return this.handleFile(file);
    }
    return null;
  }

  // 파일 읽기
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        resolve(e.target.result);
      };
      reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다.'));
      reader.readAsDataURL(file);
    });
  }

  // 원본 파일 가져오기
  getOriginalFile() {
    return this.originalFile;
  }

  // 파일 리셋
  reset() {
    this.originalFile = null;
  }

  // 원본 파일 설정 (작업물 불러오기용)
  setOriginalFile(imageSrc) {
    // Base64 이미지를 File 객체로 변환
    if (imageSrc.startsWith('data:image/')) {
      // Base64 문자열을 Blob으로 변환
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      this.originalFile = new File([blob], 'restored-image.jpg', { type: mimeString });
    }
  }
}