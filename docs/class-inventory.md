# 클래스 인벤토리

## 📋 현재 사용 중인 클래스 목록

### 🏗️ 레이아웃 클래스

#### 컨테이너
- `container` - 메인 컨테이너
- `main-content` - 메인 콘텐츠 영역

#### 헤더
- `header` - 페이지 헤더

#### 푸터
- `privacy-footer` - 프라이버시 안내 푸터
- `privacy-content` - 프라이버시 콘텐츠 컨테이너
- `privacy-info` - 프라이버시 정보 섹션
- `privacy-note` - 프라이버시 참고사항

### 📤 업로드 섹션

#### 업로드 영역
- `upload-section` - 파일 업로드 영역
- `upload-icon` - 업로드 아이콘
- `upload-text` - 업로드 안내 텍스트
- `upload-hint` - 업로드 힌트 텍스트
- `file-input` - 파일 입력 필드

#### 업로드 작업물 관리
- `upload-work-actions` - 업로드 섹션 작업물 관리 버튼들

### 🖼️ 프리뷰 섹션

#### 프리뷰 컨테이너
- `preview-section` - 프리뷰 섹션
- `preview-container` - 프리뷰 컨테이너
- `preview-box` - 개별 프리뷰 박스
- `preview-image-container` - 이미지 컨테이너
- `preview-image` - 프리뷰 이미지

#### 이미지 정보
- `image-info` - 이미지 정보 섹션
- `info-item` - 정보 아이템
- `info-label` - 정보 라벨
- `info-value` - 정보 값
- `compression-info` - 압축 정보 (특별 스타일)

#### 확대/축소 컨트롤
- `zoom-controls` - 확대/축소 컨트롤 영역
- `zoom-btn` - 확대/축소 버튼
- `zoom-level` - 확대/축소 레벨 표시

### ⚙️ 컨트롤 섹션

#### 컨트롤 영역
- `controls-section` - 컨트롤 섹션
- `controls-grid` - 컨트롤 그리드 레이아웃
- `control-group` - 개별 컨트롤 그룹

#### 체크박스 그룹
- `checkbox-group` - 체크박스 그룹

#### 사이즈 옵션
- `size-options` - 사이즈 옵션 섹션
- `size-checkboxes` - 사이즈 체크박스 컨테이너
- `size-option` - 개별 사이즈 옵션

### 🔘 버튼 클래스

#### 기본 버튼
- `btn` - 기본 버튼 클래스

#### 버튼 변형
- `btn-primary` - 주요 액션 버튼
- `btn-secondary` - 보조 액션 버튼
- `btn-success` - 성공 액션 버튼
- `btn-warning` - 경고 액션 버튼
- `btn-danger` - 위험 액션 버튼
- `btn-info` - 정보 액션 버튼

#### 액션 버튼 영역
- `action-buttons` - 주요 액션 버튼들 (메인 컨트롤)
- `action-buttons[data-component="crop-action-buttons"]` - 크롭 액션 버튼들
- `work-actions` - 작업물 관리 버튼들

### ✂️ 크롭 섹션

#### 크롭 영역
- `crop-section` - 크롭 섹션
- `crop-container` - 크롭 컨테이너
- `crop-image` - 크롭할 이미지
- `crop-overlay` - 크롭 오버레이

#### 크롭 핸들
- `crop-handle` - 크롭 핸들 기본 클래스
- `crop-handle[data-position="nw"]` - 북서쪽 핸들 (northwest)
- `crop-handle[data-position="n"]` - 북쪽 핸들 (north)
- `crop-handle[data-position="ne"]` - 북동쪽 핸들 (northeast)
- `crop-handle[data-position="w"]` - 서쪽 핸들 (west)
- `crop-handle[data-position="e"]` - 동쪽 핸들 (east)
- `crop-handle[data-position="sw"]` - 남서쪽 핸들 (southwest)
- `crop-handle[data-position="s"]` - 남쪽 핸들 (south)
- `crop-handle[data-position="se"]` - 남동쪽 핸들 (southeast)

### 🪟 모달 클래스

#### 작업물 모달
- `work-modal` - 작업물 목록 모달
- `work-modal-content` - 모달 콘텐츠
- `work-modal-header` - 모달 헤더
- `work-modal-body` - 모달 바디
- `work-list` - 작업물 목록
- `work-empty` - 빈 작업물 상태
- `close-btn` - 닫기 버튼

#### 작업물 저장 모달
- `work-save-modal` - 작업물 저장 모달
- `work-save-modal-content` - 저장 모달 콘텐츠
- `work-save-modal-header` - 저장 모달 헤더
- `work-save-modal-body` - 저장 모달 바디
- `work-save-preview` - 저장 미리보기
- `work-save-actions` - 저장 액션 버튼들

#### 폼 요소
- `form-group` - 폼 그룹
- `preview-item` - 미리보기 아이템
- `preview-label` - 미리보기 라벨
- `preview-value` - 미리보기 값

### 📊 통계 정보

#### 클래스 총 개수
- **총 클래스 수**: 95개
- **레이아웃 클래스**: 8개
- **업로드 섹션**: 6개
- **프리뷰 섹션**: 12개
- **컨트롤 섹션**: 6개
- **버튼 클래스**: 8개
- **크롭 섹션**: 12개
- **모달 클래스**: 15개
- **폼 요소**: 4개

#### 셀렉팅 방식 통계
- **getElementById 사용**: 0개 (완전 제거)
- **클래스 기반 셀렉팅**: 0개
- **Data Attributes 사용**: 95개 (완전 마이그레이션)

## 🔍 셀렉팅 방식 분석

### 현재 사용 중인 셀렉팅 방식

#### Data Attributes 기반 셀렉팅
모든 DOM 요소가 Data Attributes로 셀렉팅되도록 완전히 마이그레이션되었습니다:

```javascript
// 예시: uiManager.js에서
uploadSection: DOMSelector.component('upload-section'),
fileInput: DOMSelector.target('file-input'),
previewSection: DOMSelector.component('preview-section'),
// ... 총 95개의 Data Attributes 셀렉팅
```

### 개선된 부분

#### 1. 느슨한 결합
- HTML의 `data-*` 속성과 JavaScript가 느슨하게 결합
- HTML 구조 변경 시 JavaScript 수정 최소화
- 재사용성 향상

#### 2. 유지보수성 향상
- DOMSelector 유틸리티를 통한 일관된 셀렉팅
- 새로운 요소 추가 시 Data Attributes만 추가하면 됨
- 명명 규칙 통일로 가독성 향상

## 🚀 개선 제안

### Data Attributes 기반 셀렉팅으로 마이그레이션

#### 1. 액션 기반 셀렉팅
```html
<!-- 현재 -->
<button id="processBtn" class="btn btn-primary">이미지 처리</button>

<!-- 개선안 -->
<button data-action="process-image" class="btn btn-primary">이미지 처리</button>
```

#### 2. 컴포넌트 기반 셀렉팅
```html
<!-- 현재 -->
<div id="uploadSection" class="upload-section">

<!-- 개선안 -->
<div data-component="upload-section" class="upload-section">
```

#### 3. 상태 기반 셀렉팅
```html
<!-- 현재 -->
<div id="jpegQualityGroup" class="control-group">

<!-- 개선안 -->
<div data-component="control-group" data-type="jpeg-quality" class="control-group">
```

### 마이그레이션 우선순위

#### 1단계: 새로운 기능 (높은 우선순위)
- 새로운 기능 개발 시 Data Attributes 사용
- 기존 스타일 수정 없이 클래스만 추가

#### 2단계: 기존 기능 점진적 개선 (중간 우선순위)
- 자주 수정되는 컴포넌트부터 마이그레이션
- 액션 버튼들 우선 개선

#### 3단계: 완전한 마이그레이션 (낮은 우선순위)
- 모든 셀렉팅을 Data Attributes로 통일
- 기존 id 속성 제거

## 📝 명명 규칙 제안

### Data Attributes 규칙
- `data-action`: 사용자 액션 (예: `process-image`, `crop-image`, `download`)
- `data-component`: 컴포넌트 식별 (예: `upload-section`, `preview-box`)
- `data-target`: 대상 요소 (예: `preview`, `controls`, `modal`)
- `data-id`: 고유 식별자 (예: `original`, `processed`, `crop`)
- `data-type`: 타입 구분 (예: `jpeg-quality`, `png-compression`)

### CSS 클래스 규칙 (JavaScript 전용)
- `js-` 접두사 사용
- 케밥 케이스 (kebab-case)
- 기능 중심 명명 (예: `js-process-image`, `js-show-modal`)

## ✅ 결론

현재 프로젝트는 **95개의 클래스**와 **95개의 Data Attributes 셀렉팅**을 사용하고 있습니다. 

### 🎉 완료된 개선사항

#### 1. 클래스 중복 및 일관성 문제 해결
- `action-buttons` 클래스에 `data-component` 속성 추가로 구분
- 크롭 핸들 클래스들을 `data-position` 속성 기반으로 통일

#### 2. 셀렉팅 방식 완전 개선
- 모든 요소가 Data Attributes로 셀렉팅되어 HTML과 JavaScript가 느슨하게 결합
- 새로운 요소 추가 시 Data Attributes만 추가하면 됨
- 재사용성과 유지보수성 대폭 향상

#### 3. 스타일 시스템 완성
- 현재 95개의 클래스로 스타일 시스템이 완성됨
- 추가 스타일 수정보다는 새로운 기능 개발에 집중

### 🚀 완료된 개선 방향
1. ✅ **스타일 수정 제한**: 현재 스타일 시스템 완성으로 추가 수정 제한
2. ✅ **셀렉팅 방식 개선**: Data Attributes 기반으로 완전 마이그레이션
3. ✅ **유지보수성 향상**: HTML과 JavaScript의 느슨한 결합
4. ✅ **클래스 정리**: 중복 클래스 통합 및 명명 규칙 통일

### 📈 개선 효과
- **코드 품질**: HTML과 JavaScript의 분리로 더 깔끔한 구조
- **유지보수성**: DOMSelector 유틸리티로 일관된 셀렉팅
- **확장성**: 새로운 기능 추가 시 Data Attributes만 사용
- **가독성**: 명명 규칙 통일로 코드 이해도 향상

이제 더 나은 코드 품질과 유지보수성을 확보한 상태에서 새로운 기능 개발에 집중할 수 있습니다. 