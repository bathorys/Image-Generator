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
}