# 개발 가이드라인

## 프로젝트 구조

### 디렉토리 구조
```
ImageGenerator/
├── docs/                    # 문서
├── frontend/               # 프론트엔드 (Astro)
│   ├── src/
│   │   ├── components/     # 컴포넌트
│   │   ├── pages/         # 페이지
│   │   ├── styles/        # 스타일 (SCSS)
│   │   └── utils/         # 유틸리티
│   ├── public/            # 정적 파일
│   └── package.json
└── README.md
```

## 스타일링 시스템

### 8px 기반 간격 시스템
- **$spacing-xs**: 4px (0.25rem)
- **$spacing-sm**: 8px (0.5rem) 
- **$spacing-md**: 16px (1rem)
- **$spacing-lg**: 24px (1.5rem)
- **$spacing-xl**: 32px (2rem)
- **$spacing-xxl**: 48px (3rem)

### 색상 시스템
- **Primary**: #667eea (그라디언트: #667eea → #764ba2)
- **Secondary**: #764ba2
- **Success**: #28a745
- **Warning**: #ffc107
- **Danger**: #dc3545
- **Info**: #17a2b8

### 폰트 크기
- **$font-size-xs**: 0.75rem (12px)
- **$font-size-sm**: 0.875rem (14px)
- **$font-size-base**: 1rem (16px)
- **$font-size-lg**: 1.125rem (18px)
- **$font-size-xl**: 1.25rem (20px)
- **$font-size-xxl**: 1.5rem (24px)
- **$font-size-xxxl**: 2rem (32px)

## 최근 개선사항 (2024년 8월)

### 1. 크롭 기능 고도화 (2024-08-06)
- **실시간 크롭 정보 표시**: X, Y, Width, Height 값을 실시간으로 표시
- **직접 입력 기능**: input 필드를 통해 정확한 픽셀 값으로 크롭 영역 설정
- **양방향 동기화**: 드래그/리사이즈와 input 입력이 서로 실시간으로 반영
- **값 범위 제한**: 입력된 값이 이미지 범위를 벗어나지 않도록 자동 제한
- **사용자 친화적 UI**: number 타입 input으로 정확한 픽셀 값 입력 가능

### 2. 전체적인 간격 시스템 개선
- **8px 기반 간격 시스템 도입**: 모든 간격을 8px의 배수로 통일
- **컴팩트한 레이아웃**: 화면에 더 많은 내용을 표시할 수 있도록 간격 축소
- **일관된 디자인**: 모든 컴포넌트에서 동일한 간격 시스템 적용

### 2. 버튼 시스템 개선
- **버튼 크기 축소**: 전체적으로 더 컴팩트한 버튼 디자인
- **가로 배치**: "저장된 작업물 불러오기"와 "자동저장" 버튼을 한 줄에 배치
- **Sticky 버튼**: action-buttons와 work-actions에 position: sticky 적용 (TODO: 실제 작동 확인 필요)

### 3. 미리보기 영역 최적화
- **확대/축소 컨트롤 위치 변경**: 원본/처리된 이미지 사이에서 위쪽으로 이동
- **이미지 컨테이너 확대**: 높이를 320px → 400px로 확대
- **반응형 최적화**: 모바일에서도 적절한 크기 유지

### 4. 컴포넌트별 개선사항

#### 업로드 섹션
- 애니메이션 효과가 있는 드래그 앤 드롭 영역
- 호버 및 드래그오버 상태의 시각적 피드백
- 파일 업로드 후 성공 상태 표시

#### 프리뷰 섹션
- 카드 형태의 모던한 디자인
- 개선된 확대/축소 컨트롤
- 이미지 정보 표시의 시각적 개선

#### 컨트롤 섹션
- 그리드 레이아웃으로 정리된 설정 옵션
- 슬라이더와 입력 필드의 개선된 스타일
- 호버 효과와 포커스 상태 개선

#### 모달 시스템
- 작업물 관리 모달: 카드 형태의 작업물 목록
- 저장 모달: 개선된 폼 디자인과 미리보기
- 애니메이션: fadeIn, slideIn 등 부드러운 전환 효과

### 5. 반응형 디자인 강화
- **모바일 퍼스트 접근법**: 320px부터 시작하는 반응형 디자인
- **태블릿 최적화**: 768px 이상에서의 레이아웃 개선
- **데스크톱 최적화**: 992px 이상에서의 풀 레이아웃

### 6. 접근성 및 사용성 개선
- **포커스 스타일**: 키보드 네비게이션 지원
- **스크롤바 스타일링**: 일관된 스크롤바 디자인
- **선택 텍스트 스타일**: 텍스트 선택 시 시각적 피드백

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```

### 빌드
```bash
npm run build
```

## 코딩 컨벤션

### SCSS 작성 규칙
1. **변수 우선 사용**: 하드코딩된 값 대신 변수 사용
2. **BEM 방법론**: Block__Element--Modifier 구조
3. **중첩 제한**: 최대 3단계까지만 중첩
4. **일관된 간격**: 8px 기반 시스템 준수

### JavaScript 작성 규칙
1. **모듈화**: 기능별로 파일 분리
2. **ES6+ 문법**: 최신 JavaScript 문법 사용
3. **에러 처리**: 적절한 에러 핸들링
4. **성능 최적화**: 불필요한 DOM 조작 최소화

## 🎨 스타일 작업 가이드라인

### SCSS 사용 정책
**이 프로젝트는 SCSS를 사용하며, CSS 파일은 사용하지 않습니다.**

#### ✅ SCSS 파일 구조
```
frontend/src/styles/
├── base/                    # 기본 스타일
│   ├── _variables.scss     # 변수 정의
│   ├── _reset.scss         # CSS 리셋
│   └── _typography.scss    # 타이포그래피
├── components/             # 컴포넌트 스타일
│   ├── _buttons.scss       # 버튼 스타일
│   ├── _upload.scss        # 업로드 스타일
│   ├── _preview.scss       # 미리보기 스타일
│   ├── _controls.scss      # 컨트롤 스타일
│   ├── _crop.scss          # 크롭 스타일
│   └── _snackbar.scss      # Snackbar 스타일
├── layout/                 # 레이아웃 스타일
│   ├── _header.scss        # 헤더 스타일
│   └── _container.scss     # 컨테이너 스타일
├── utilities/              # 유틸리티 스타일
│   └── _responsive.scss    # 반응형 스타일
└── main.scss              # 메인 SCSS 파일 (모든 스타일 import)
```

#### ✅ SCSS 작성 규칙
1. **파일명**: 언더스코어로 시작 (`_filename.scss`)
2. **변수 사용**: `_variables.scss`에 정의된 변수 활용
3. **중첩 제한**: 3단계 이상 중첩 금지
4. **모듈화**: 기능별로 파일 분리
5. **import 순서**: base → components → layout → utilities

### 스타일 수정 제한 정책
**현재 스타일 시스템이 완성되었으므로 추가적인 스타일 수정은 제한합니다.**

#### ✅ 허용되는 작업
- **새로운 컴포넌트 추가**: 완전히 새로운 기능을 위한 스타일
- **유틸리티 클래스 추가**: 기능적인 유틸리티 클래스 (예: `.hidden`, `.loading`)
- **상태별 클래스 추가**: JavaScript로 제어되는 상태 클래스 (예: `.is-active`, `.has-error`)

#### ❌ 제한되는 작업
- **기존 스타일 수정**: 현재 구현된 컴포넌트의 스타일 변경
- **간격 시스템 변경**: 8px 기반 간격 시스템 수정
- **색상 시스템 변경**: 정의된 색상 변수 수정
- **레이아웃 구조 변경**: 기존 레이아웃의 구조적 변경

### 엘리먼트 클래스 추가 가이드라인
새로운 기능 개발 시 필요한 클래스는 추가할 수 있습니다:

```html
<!-- ✅ 좋은 예: 기능적인 클래스 추가 -->
<div class="upload-section" id="uploadSection">
  <div class="upload-icon">📁</div>
  <div class="upload-text">이미지를 선택하거나 드래그하여 업로드하세요</div>
  <div class="upload-hint">JPG, PNG, GIF 파일을 지원합니다</div>
  <input type="file" id="fileInput" class="file-input" accept="image/*" />
  
  <!-- 새로운 기능을 위한 클래스 추가 -->
  <div class="upload-progress" id="uploadProgress" style="display: none;">
    <div class="progress-bar"></div>
  </div>
</div>
```

## 🍞 Snackbar 컴포넌트 가이드라인

### 개요
Snackbar는 사용자에게 알림 메시지를 표시하는 모던한 UI 컴포넌트입니다.

### 사용법

#### 1. 기본 사용법
```javascript
// 전역 snackbarManager 사용
window.snackbarManager.show('메시지', 'info', 4000);
```

#### 2. 타입별 메서드
```javascript
// 성공 메시지
window.snackbarManager.success('작업이 완료되었습니다.');

// 에러 메시지
window.snackbarManager.error('오류가 발생했습니다.');

// 경고 메시지
window.snackbarManager.warning('주의가 필요합니다.');

// 정보 메시지
window.snackbarManager.info('정보를 확인하세요.');
```

#### 3. UIManager를 통한 사용
```javascript
// UIManager 인스턴스 사용
this.uiManager.showSuccessMessage('작업 완료');
this.uiManager.showErrorMessage('오류 발생');
this.uiManager.showWarningMessage('경고 메시지');
this.uiManager.showInfoMessage('정보 메시지');
```

### 스타일 커스터마이징
Snackbar 스타일은 `src/styles/components/_snackbar.scss`에서 관리됩니다.

```scss
// 새로운 타입 추가
.snackbar.custom-type {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
  color: #your-text-color;
}
```

### 접근성 고려사항
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 충분한 색상 대비
- 자동 제거 시간 설정

## 🔧 스크립트 셀렉팅 방식 개선

### 현재 문제점
- `getElementById()` 사용으로 인한 강한 결합
- HTML 구조 변경 시 JavaScript 수정 필요
- 재사용성과 유지보수성 저하

### 개선된 셀렉팅 방식

#### 1. Data Attributes 사용 (권장)
```html
<!-- HTML -->
<button data-action="process-image" data-target="image-processor">
  이미지 처리
</button>
<div data-component="image-preview" data-id="original">
  <!-- 내용 -->
</div>
```

```javascript
// JavaScript
const processBtn = document.querySelector('[data-action="process-image"]');
const imagePreview = document.querySelector('[data-component="image-preview"][data-id="original"]');

// 이벤트 리스너
processBtn.addEventListener('click', () => {
  // 처리 로직
});
```

#### 2. CSS 클래스 기반 셀렉팅
```html
<!-- HTML -->
<button class="btn btn-primary js-process-image">
  이미지 처리
</button>
<div class="image-preview js-original-preview">
  <!-- 내용 -->
</div>
```

```javascript
// JavaScript
const processBtn = document.querySelector('.js-process-image');
const originalPreview = document.querySelector('.js-original-preview');

// 이벤트 리스너
processBtn.addEventListener('click', () => {
  // 처리 로직
});
```

#### 3. 컴포넌트 기반 셀렉팅
```html
<!-- HTML -->
<div class="image-processor" data-component="image-processor">
  <button class="btn btn-primary" data-action="process">
    이미지 처리
  </button>
  <div class="preview-container" data-target="preview">
    <!-- 내용 -->
  </div>
</div>
```

```javascript
// JavaScript
class ImageProcessor {
  constructor(container) {
    this.container = container;
    this.processBtn = container.querySelector('[data-action="process"]');
    this.preview = container.querySelector('[data-target="preview"]');
    
    this.init();
  }
  
  init() {
    this.processBtn.addEventListener('click', () => {
      this.processImage();
    });
  }
  
  processImage() {
    // 처리 로직
  }
}

// 사용
const processor = new ImageProcessor(document.querySelector('[data-component="image-processor"]'));
```

### 셀렉팅 우선순위
1. **Data Attributes** (가장 권장)
   - 명확한 의미 전달
   - HTML과 JavaScript 분리
   - 재사용성 높음

2. **CSS 클래스 (js- 접두사)**
   - 기존 CSS 클래스와 구분
   - JavaScript 전용 클래스임을 명시

3. **컴포넌트 기반**
   - 복잡한 컴포넌트에 적합
   - 캡슐화된 구조

### 마이그레이션 가이드

#### 단계별 마이그레이션
1. **새로운 기능**: Data Attributes 방식 사용
2. **기존 기능 수정**: 점진적으로 Data Attributes로 변경
3. **완전한 마이그레이션**: 모든 셀렉팅을 Data Attributes로 통일

#### 예시: 기존 코드 개선
```javascript
// ❌ 기존 방식
const processBtn = document.getElementById('processBtn');
const originalImage = document.getElementById('originalImage');

// ✅ 개선된 방식
const processBtn = document.querySelector('[data-action="process-image"]');
const originalImage = document.querySelector('[data-component="image-preview"][data-id="original"] img');
```

### 명명 규칙

#### Data Attributes 규칙
- `data-action`: 사용자 액션 (예: `process-image`, `crop-image`, `download`)
- `data-component`: 컴포넌트 식별 (예: `image-preview`, `upload-section`)
- `data-target`: 대상 요소 (예: `preview`, `controls`, `modal`)
- `data-id`: 고유 식별자 (예: `original`, `processed`, `crop`)

#### CSS 클래스 규칙 (JavaScript 전용)
- `js-` 접두사 사용
- 케밥 케이스 (kebab-case)
- 기능 중심 명명 (예: `js-process-image`, `js-show-modal`) 