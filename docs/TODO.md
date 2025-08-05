# 해야 할일
 - [x] 이미지 미리보기 화면 돋보기 기능 ✅
 - [x] 이미지 퀄리티 기능이 jpg에 맞춰져 있음 ✅
 - [x] 원본이미지 / 처리된 이미지 하단에 이미지 사이즈 표시 ✅
 - [x] 사이즈 별 저장 기능 (@x1, @x2, @x3) ✅
 - [x] 크롭 모드 개선 (원본 이미지 크롭 지원) ✅
 - [x] 버튼 기능 개선 (이미지 초기화 / 새로 시작 분리) ✅

## 완료된 기능
### ✅ 이미지 미리보기 화면 돋보기 기능
- 마우스 호버 시 이미지 확대 효과
- 클릭 시 전체화면 모달로 확대
- ESC 키나 클릭으로 모달 닫기
- 부드러운 애니메이션 효과

### ✅ 크롭 모드 개선 (원본 이미지 크롭 지원)
- **원본 이미지 크롭**: 이미지 업로드 후 바로 크롭 가능
- **처리된 이미지 크롭**: 이미지 처리 후 크롭 가능
- **유연한 워크플로우**: 원본→크롭→처리 또는 원본→처리→크롭 모두 지원
- **동적 버튼 텍스트**: 상황에 따라 "원본 이미지 크롭" / "처리된 이미지 크롭" 표시
- **스마트한 상태 관리**: 이미지가 없을 때 크롭 버튼 비활성화

### ✅ 버튼 기능 개선 (이미지 초기화 / 새로 시작 분리)
- **이미지 초기화**: 업로드된 이미지만 초기화, 설정은 유지
- **새로 시작**: 모든 설정을 포함한 완전 초기화
- **스마트한 버튼 상태**: 상황에 따라 버튼 자동 활성화/비활성화
- **툴팁 지원**: 각 버튼에 마우스 호버 시 기능 설명 표시
- **시각적 구분**: warning 색상으로 이미지 초기화 버튼 구분

### ✅ 사이즈 별 저장 기능 (@x1, @x2, @x3)
- **@x1**: 원본 크기로 저장
- **@x2**: 2배 크기로 저장 (고해상도 디스플레이용)
- **@x3**: 3배 크기로 저장 (고해상도 출력용)
- 여러 크기 동시 선택 가능
- 파일명에 크기 정보 자동 추가

### ✅ 이미지 퀄리티 기능이 jpg에 맞춰져 있음
- **JPEG**: 품질 설정 (1-100)
- **PNG**: 압축 레벨 설정 (0-9)
- **WebP**: 품질 설정 (1-100) + 투명도 지원 옵션
- 확장자 선택에 따라 해당 설정만 표시
- 각 형식별 최적화된 처리 방식 적용

### ✅ 원본이미지 / 처리된 이미지 하단에 이미지 사이즈 표시
- **파일 크기**: KB, MB 단위로 표시
- **이미지 크기**: 픽셀 단위 (가로 × 세로)
- **형식**: 파일 형식 표시
- **압축률**: 처리된 이미지의 압축률 표시 (녹색으로 강조)
- 실시간 업데이트로 품질 설정 효과 확인 가능

## 형식별 처리 방식 개선
### JPEG
- `canvas.toBlob()`의 quality 파라미터 사용 (0-1 범위)
- 품질이 높을수록 파일 크기 증가하는 정상적인 동작

### PNG
- PNG는 lossless 압축이므로 품질 조정 불가
- 압축 레벨에 따라 이미지 크기 조정으로 압축 효과 구현
- 높은 압축 레벨 = 작은 이미지 크기 = 작은 파일 크기

### WebP
- 브라우저 WebP 지원 확인 후 처리
- 지원되지 않는 경우 JPEG로 자동 fallback
- 투명도 지원 옵션 포함

## 최근 개선사항 상세

### 크롭 모드 개선 구현
```javascript
// 크롭 모드 토글 함수 개선
toggleCropMode() {
  const originalFile = this.fileUploader.getOriginalFile();
  if (!originalFile) {
    this.uiManager.showAlert('먼저 이미지를 업로드해주세요.');
    return;
  }

  // 처리된 이미지가 있으면 처리된 이미지를, 없으면 원본 이미지를 사용
  const imageSource = this.processedBlob ? elements.processedImage.src : elements.originalImage.src;
  this.uiManager.setImageSource(elements.cropImage, imageSource);
}

// 크롭 적용 함수 개선
async applyCrop() {
  // 크롭할 이미지 소스 결정 (처리된 이미지가 있으면 그것을, 없으면 원본 파일을 사용)
  let sourceBlob = this.processedBlob;
  let sourceFile = originalFile;
  
  if (!sourceBlob) {
    sourceBlob = originalFile;
    sourceFile = originalFile;
  }
}
```

### 버튼 상태 관리 구현
```javascript
// 버튼 상태 업데이트
updateButtonStates() {
  const originalFile = this.fileUploader.getOriginalFile();
  
  // 크롭 버튼 텍스트 및 상태 업데이트
  if (!originalFile) {
    elements.cropBtn.textContent = '크롭 모드';
    elements.cropBtn.disabled = true;
  } else if (this.processedBlob) {
    elements.cropBtn.textContent = '처리된 이미지 크롭';
    elements.cropBtn.disabled = false;
  } else {
    elements.cropBtn.textContent = '원본 이미지 크롭';
    elements.cropBtn.disabled = false;
  }
  
  // 다른 버튼들 상태 업데이트
  elements.processBtn.disabled = !originalFile;
  elements.downloadBtn.disabled = !this.processedBlob;
  elements.resetImageBtn.disabled = !originalFile;
}
```

### 쿠키 기반 설정 저장 구현
```javascript
// CookieStore API를 사용한 설정 저장
async saveCurrentSettings() {
  const settings = {
    format: elements.formatSelect.value,
    jpegQuality: parseInt(elements.jpegQualitySlider.value),
    pngCompression: parseInt(elements.pngCompressionSlider.value),
    webpQuality: parseInt(elements.webpQualitySlider.value),
    webpTransparency: elements.webpTransparency.checked,
    maxWidth: elements.maxWidth.value,
    maxHeight: elements.maxHeight.value,
    sizeOptions: {
      size1x: elements.size1x ? elements.size1x.checked : true,
      size2x: elements.size2x ? elements.size2x.checked : false,
      size3x: elements.size3x ? elements.size3x.checked : false
    }
  };
  
  await this.cookieManager.saveSettings(settings);
}

// 자동 설정 복원
async loadSavedSettings() {
  const savedSettings = await this.cookieManager.loadSettings();
  if (savedSettings) {
    // 저장된 설정을 UI에 적용
    elements.formatSelect.value = savedSettings.format;
    elements.jpegQualitySlider.value = savedSettings.jpegQuality;
    // ... 기타 설정들
  }
}
```

## 브라우저 지원 기준 (Baseline)

### 최소 지원 브라우저
- **Chrome**: 87+ (2020년 11월 이후)
- **Edge**: 87+ (2020년 11월 이후)
- **Firefox**: 103+ (2022년 7월 이후)
- **Safari**: 16+ (2022년 9월 이후)
- **Opera**: 73+ (2020년 11월 이후)

### 지원 정책
1. **최신 기술 우선**: 최신 브라우저에서 최적의 경험 제공
2. **점진적 개선**: 새로운 API 기능을 적극 활용
3. **넓은 호환성**: 2020년 이후 브라우저 대부분 지원
4. **성능 최적화**: 최신 브라우저의 성능 최적화 기능 활용

## 예정 기능
### ✅ 쿠키 기반 설정 저장 기능
- **CookieStore API 사용**: 최신 브라우저 API로 안전하고 빠른 쿠키 관리 (Chrome 87+, Firefox 103+, Safari 16+)
- **자동 설정 저장**: 사용자가 설정을 변경할 때마다 자동 저장
- **자동 설정 복원**: 페이지 로드 시 이전 설정 자동 복원
- **수동 설정 관리**: 설정 저장/불러오기/삭제 버튼 제공
- **30일간 유지**: 설정이 30일간 브라우저에 저장됨

### 향후 개선 사항
- [ ] 이미지 회전 기능
- [ ] 이미지 필터 적용 (밝기, 대비, 채도 등)
- [ ] 배치 처리 기능 (여러 이미지 동시 처리)
- [ ] 드래그 앤 드롭으로 크롭 영역 조정
- [ ] 키보드 단축키 지원
- [ ] 처리 히스토리 기능
- [ ] 프리셋 저장/불러오기 기능 