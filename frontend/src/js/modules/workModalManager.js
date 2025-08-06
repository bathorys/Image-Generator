// 작업물 모달 관리자
export class WorkModalManager {
  constructor(app) {
    this.app = app;
    this.uiManager = app.uiManager;
    this.workManager = app.workManager;
    this.imageInfoManager = app.imageInfoManager;
  }

  // 작업물 저장 모달 표시
  showSaveWorkModal() {
    const originalFile = this.app.fileUploader.getOriginalFile();
    if (!originalFile) {
      this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
      return;
    }

    const elements = this.uiManager.getElements();
    const workModal = elements.workSaveModal;

    // 저장할 내용 미리보기 업데이트
    elements.saveOriginalPreview.textContent = originalFile.name;
    elements.saveProcessedPreview.textContent = this.app.processedBlob ? '있음' : '없음';
    elements.saveSettingsPreview.textContent = this.app.getCurrentSettings().format;

    workModal.style.display = 'block';
    elements.workNameInput.focus();
  }

  // 작업물 저장 모달 숨기기
  hideSaveWorkModal() {
    const elements = this.uiManager.getElements();
    elements.workSaveModal.style.display = 'none';
    elements.workNameInput.value = '';
  }

  // 작업물 목록 모달 표시
  async showWorkListModal() {
    const elements = this.uiManager.getElements();
    const workModal = elements.workModal;
    const workList = elements.workList;
    const workEmpty = elements.workEmpty;

    const works = await this.workManager.getWorkList();

    if (works.length === 0) {
      workList.style.display = 'none';
      workEmpty.style.display = 'block';
    } else {
      workList.style.display = 'grid';
      workEmpty.style.display = 'none';

      // 기존 목록 초기화
      workList.innerHTML = '';

      // 작업물 목록 생성
      works.forEach(work => {
        const workItem = this.createWorkItem(work);
        workList.appendChild(workItem);
      });
    }

    workModal.style.display = 'block';
  }

  // 작업물 목록 모달 숨기기
  hideWorkModal() {
    const elements = this.uiManager.getElements();
    elements.workModal.style.display = 'none';
  }

  // 작업물 아이템 생성
  createWorkItem(work) {
    const workItem = document.createElement('div');
    workItem.className = 'work-item';
    workItem.dataset.workId = work.id;

    const date = new Date(work.createdAt).toLocaleString('ko-KR');

    workItem.innerHTML = `
      <img src="${work.thumbnail}" alt="${work.name}" class="work-thumbnail" />
      <div class="work-name">${work.name}</div>
      <div class="work-date">${date}</div>
      <div class="work-info">
        <div class="info-item">
          <span>형식:</span>
          <span>${work.settings.format}</span>
        </div>
        <div class="info-item">
          <span>처리됨:</span>
          <span>${work.processedImage ? '예' : '아니오'}</span>
        </div>
      </div>
      <div class="work-actions">
        <button class="btn btn-primary load-work-btn">불러오기</button>
        <button class="btn btn-danger delete-work-btn">삭제</button>
      </div>
    `;

    // 이벤트 리스너 추가
    workItem.querySelector('.load-work-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.loadWork(work);
      this.hideWorkModal();
    });

    workItem.querySelector('.delete-work-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.deleteWork(work.id);
    });

    return workItem;
  }

  // 작업물 저장
  async saveWork() {
    const elements = this.uiManager.getElements();
    const workName = elements.workNameInput.value.trim();

    if (!workName) {
      this.uiManager.showWarningMessage('작업물 이름을 입력해주세요.');
      return;
    }

    const originalFile = this.app.fileUploader.getOriginalFile();
    const originalImage = elements.originalImage.src;
    const processedImage = this.app.processedBlob ? elements.processedImage.src : null;
    const settings = this.app.getCurrentSettings();

    const workData = await this.workManager.createWorkData(originalImage, processedImage, settings, workName);
    const success = await this.workManager.saveWork(workData);

    if (success) {
      this.uiManager.showSuccessMessage('작업물이 저장되었습니다.');
      this.hideSaveWorkModal();
    } else {
      this.uiManager.showErrorMessage('작업물 저장에 실패했습니다.');
    }
  }
}