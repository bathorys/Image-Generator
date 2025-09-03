// 작업물 저장/불러오기 관리 모듈 (LocalStorage + IndexedDB 사용)
//
// 기능:
// 1. 최대 10개까지 작업물 저장
// 2. 원본 이미지 + 모든 설정값 저장
// 3. 작업물 목록 관리
// 4. 자동 저장 및 수동 저장 지원
//
// 브라우저 지원 (Baseline):
// - LocalStorage: IE8+, 모든 모던 브라우저
// - IndexedDB: IE10+, 모든 모던 브라우저
// - Blob API: IE10+, 모든 모던 브라우저
export class WorkManager {
  constructor() {
    this.storageKey = 'imageGeneratorWorks';
    this.maxWorks = 10;
    this.autoSaveKey = 'imageGeneratorAutoSave';
  }

  // Blob URL을 Base64로 변환
  async blobUrlToBase64(blobUrl) {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Blob URL을 Base64로 변환 실패:', error);
      return null;
    }
  }

  // 이미지 소스를 Base64로 변환
  async convertImageToBase64(imageSrc) {
    if (imageSrc.startsWith('data:')) {
      // 이미 Base64인 경우
      return imageSrc;
    } else if (imageSrc.startsWith('blob:')) {
      // Blob URL인 경우 Base64로 변환
      return await this.blobUrlToBase64(imageSrc);
    }
    return imageSrc;
  }

  // 작업물 데이터 구조
  async createWorkData(originalImage, processedImage, settings, workName = null) {
    // 이미지 데이터를 Base64로 변환
    const originalBase64 = await this.convertImageToBase64(originalImage);
    const processedBase64 = processedImage ? await this.convertImageToBase64(processedImage) : null;

    const thumbnail = await this.createThumbnail(originalBase64);
    return {
      id: Date.now().toString(),
      name: workName || `작업물_${new Date().toLocaleString('ko-KR')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      originalImage: originalBase64, // 항상 Base64
      processedImage: processedBase64, // Base64 또는 null
      settings: settings,
      thumbnail: thumbnail // 썸네일 생성
    };
  }

  // 썸네일 생성 (원본 이미지의 작은 버전)
  async createThumbnail(imageSrc) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

            img.onload = () => {
        // 썸네일 크기 (150x150)
        const maxSize = 150;
        let { width, height } = img;

        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      img.src = imageSrc;
    });
  }

  // 작업물 목록 가져오기
  async getWorkList() {
    try {
      const works = localStorage.getItem(this.storageKey);
      return works ? JSON.parse(works) : [];
    } catch (error) {
      console.error('작업물 목록 불러오기 실패:', error);
      return [];
    }
  }

  // 작업물 저장
  async saveWork(workData) {
    try {
      const works = await this.getWorkList();

      // 최대 개수 체크
      if (works.length >= this.maxWorks) {
        // 가장 오래된 작업물 삭제
        works.shift();
      }

      // 새 작업물 추가
      works.push(workData);

      // LocalStorage에 저장
      localStorage.setItem(this.storageKey, JSON.stringify(works));

      return true;
    } catch (error) {
      console.error('작업물 저장 실패:', error);
      return false;
    }
  }

  // 작업물 불러오기
  async loadWork(workId) {
    try {
      const works = await this.getWorkList();
      const work = works.find(w => w.id === workId);
      return work || null;
    } catch (error) {
      console.error('작업물 불러오기 실패:', error);
      return null;
    }
  }

  // 작업물 삭제
  async deleteWork(workId) {
    try {
      const works = await this.getWorkList();
      const filteredWorks = works.filter(w => w.id !== workId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredWorks));
      return true;
    } catch (error) {
      console.error('작업물 삭제 실패:', error);
      return false;
    }
  }

  // 자동 저장
  async autoSave(originalImage, processedImage, settings) {
    try {
      const workData = await this.createWorkData(originalImage, processedImage, settings, '자동저장');
      const works = await this.getWorkList();

      // 기존 자동저장 찾기
      const autoSaveIndex = works.findIndex(w => w.name === '자동저장');

      if (autoSaveIndex !== -1) {
        // 기존 자동저장 업데이트
        works[autoSaveIndex] = workData;
      } else {
        // 새 자동저장 추가
        if (works.length >= this.maxWorks) {
          works.shift();
        }
        works.push(workData);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(works));
      return true;
    } catch (error) {
      console.error('자동 저장 실패:', error);
      return false;
    }
  }

  // 자동 저장 불러오기
  async loadAutoSave() {
    try {
      const works = await this.getWorkList();
      const autoSave = works.find(w => w.name === '자동저장');
      return autoSave || null;
    } catch (error) {
      console.error('자동 저장 불러오기 실패:', error);
      return null;
    }
  }

  // 모든 작업물 삭제
  async clearAllWorks() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('모든 작업물 삭제 실패:', error);
      return false;
    }
  }

  // 저장 공간 사용량 확인
  getStorageUsage() {
    try {
      const works = localStorage.getItem(this.storageKey);
      if (!works) return 0;

      // 대략적인 크기 계산 (JSON 문자열 길이)
      return works.length;
    } catch (error) {
      return 0;
    }
  }

  // 기본 설정값
  getDefaultSettings() {
    return {
      format: 'original',
      jpegQuality: 80,
      pngCompression: 6,
      webpQuality: 80,
      webpTransparency: false,
      maxWidth: '',
      maxHeight: '',
      widthPreset: '',
      sizeOptions: {
        size1x: true,
        size1_5x: false,
        size2x: false,
        size3x: false,
        size4x: false
      }
    };
  }
}