# Image Generator 프로젝트 설정 가이드

## 프로젝트 개요
이 프로젝트는 Astro 프레임워크를 사용한 웹 기반 이미지 처리 애플리케이션입니다.

## 주요 기능
- 이미지 업로드 (드래그 앤 드롭 지원)
- 이미지 형식 변환 (JPG ↔ PNG ↔ WebP)
- 이미지 크기 조정
- 이미지 압축 및 최적화
- 이미지 크롭 (완전 구현)
- 실시간 미리보기

## 기술 스택
- **Framework**: Astro 5.x
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Build Tool**: Vite
- **Styling**: SCSS
- **Additional Libraries**: 
  - canvas (이미지 처리)
  - browser-image-compression (이미지 압축)
  - sass (SCSS 컴파일)

## 프로젝트 구조
```
ImageGenerator/
├── docs/                    # 프로젝트 문서
│   └── project-setup.md     # 이 파일
├── frontend/                # Astro 애플리케이션
│   ├── src/
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   └── index.astro  # 메인 페이지
│   │   ├── styles/          # SCSS 스타일
│   │   │   ├── main.scss    # 메인 SCSS 파일
│   │   │   ├── base/        # 기본 스타일
│   │   │   │   ├── _variables.scss
│   │   │   │   ├── _reset.scss
│   │   │   │   └── _typography.scss
│   │   │   ├── components/  # 컴포넌트 스타일
│   │   │   │   ├── _buttons.scss
│   │   │   │   ├── _upload.scss
│   │   │   │   ├── _preview.scss
│   │   │   │   ├── _controls.scss
│   │   │   │   └── _crop.scss
│   │   │   ├── layout/      # 레이아웃 스타일
│   │   │   │   ├── _container.scss
│   │   │   │   └── _header.scss
│   │   │   └── utilities/   # 유틸리티 스타일
│   │   │       └── _responsive.scss
│   │   ├── js/              # JavaScript 모듈
│   │   │   ├── app.js       # 메인 애플리케이션 (570줄)
│   │   │   └── modules/     # 기능별 모듈
│   │   │       ├── imageProcessor.js
│   │   │       ├── cropManager.js         # 크롭 기능 (통합 완료)
│   │   │       ├── fileUploader.js
│   │   │       ├── uiManager.js
│   │   │       ├── workManager.js
│   │   │       ├── cookieManager.js
│   │   │       ├── magnifierManager.js    # 확대/축소 기능
│   │   │       ├── settingsManager.js     # 설정 관리
│   │   │       ├── imageInfoManager.js    # 이미지 정보 관리
│   │   │       ├── eventManager.js        # 이벤트 관리
│   │   │       └── workModalManager.js    # 작업물 모달 관리
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   └── utils/           # 유틸리티 함수
│   │       └── imageUtils.js # 이미지 처리 유틸리티
│   ├── public/              # 정적 파일
│   ├── package.json         # 의존성 관리
│   └── astro.config.mjs     # Astro 설정
└── README.md               # 프로젝트 메인 문서
```

## 설치 및 실행

### 1. 의존성 설치
```bash
cd frontend
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
개발 서버는 기본적으로 `http://localhost:4321`에서 실행됩니다.

### 3. 프로덕션 빌드
```bash
npm run build
```

### 4. 프로덕션 미리보기
```bash
npm run preview
```

## 개발 가이드

### 코드 구조

#### SCSS 구조
- **변수 기반 설계**: `_variables.scss`에서 모든 색상, 간격, 폰트 크기 등을 정의
- **모듈화된 스타일**: 기능별로 분리된 SCSS 파일들
- **반응형 디자인**: `_responsive.scss`에서 모바일 최적화

#### JavaScript 모듈 구조
- **ImageGeneratorApp**: 메인 애플리케이션 클래스 (570줄)
- **ImageProcessor**: 이미지 처리 및 변환 로직
- **CropManager**: 크롭 기능 관리 (통합 완료)
- **FileUploader**: 파일 업로드 및 드래그 앤 드롭 처리
- **UIManager**: DOM 조작 및 UI 상태 관리
- **WorkManager**: 작업물 저장/불러오기 관리
- **CookieManager**: 쿠키 기반 데이터 관리
- **MagnifierManager**: 확대/축소 및 드래그 기능
- **SettingsManager**: 설정 관리 및 컨트롤 이벤트
- **ImageInfoManager**: 이미지 정보 업데이트 및 압축률 계산
- **EventManager**: 이벤트 바인딩 및 관리
- **WorkModalManager**: 작업물 모달 관리

### 새로운 컴포넌트 추가
1. `src/components/` 디렉토리에 새 컴포넌트 파일 생성
2. Astro 컴포넌트 문법 사용
3. 필요한 경우 TypeScript 지원 추가

### 이미지 처리 기능 확장
1. `src/js/modules/`에 새로운 모듈 추가
2. `src/utils/imageUtils.js`에 새로운 유틸리티 함수 추가
3. 메인 애플리케이션에서 해당 모듈 import 및 사용
4. UI 컨트롤 추가

### 스타일링 확장
1. `src/styles/components/`에 새 컴포넌트 스타일 추가
2. `src/styles/main.scss`에 import 추가
3. 변수는 `src/styles/base/_variables.scss`에서 관리

## 모듈 설명

### ImageProcessor
이미지 처리의 핵심 로직을 담당합니다.
- 이미지 형식 변환 (JPEG, PNG, WebP)
- 이미지 크기 조정
- 이미지 압축
- 크롭 처리

### CropManager
크롭 기능을 관리합니다.
- 드래그 가능한 크롭 영역
- 리사이즈 핸들
- 경계 체크
- 크롭 데이터 관리

### FileUploader
파일 업로드 관련 기능을 처리합니다.
- 드래그 앤 드롭
- 파일 유효성 검사
- 파일 읽기

### UIManager
DOM 조작과 UI 상태를 관리합니다.
- DOM 요소 초기화
- UI 상태 변경
- 이벤트 처리

### WorkManager
작업물 저장 및 불러오기 기능을 관리합니다.
- LocalStorage 기반 작업물 저장
- 작업물 목록 관리
- 작업물 삭제 및 정리

### CookieManager
쿠키 기반 데이터 관리를 담당합니다.
- 쿠키 설정 및 읽기
- 자동 저장 데이터 관리
- 데이터 만료 처리

### MagnifierManager
확대/축소 및 드래그 기능을 관리합니다.
- 이미지 확대/축소 (25% 단위, 25%-300%)
- 확대 시 드래그로 이미지 이동
- 확대/축소 버튼 상태 관리
- 드래그 중 transition 제어로 반응성 향상

### SettingsManager
설정 관리 및 컨트롤 이벤트를 처리합니다.
- 형식별 컨트롤 표시/숨김
- 설정값 가져오기/적용
- 컨트롤 이벤트 바인딩

### ImageInfoManager
이미지 정보 업데이트 및 압축률 계산을 담당합니다.
- 원본/처리된 이미지 정보 표시
- 파일 크기 및 이미지 크기 계산
- 압축률 계산 및 표시

### EventManager
모든 이벤트 바인딩 및 관리를 담당합니다.
- 파일 업로드, 버튼, 모달, 크롭 이벤트 통합 관리
- 마우스/터치 이벤트 지원
- 전역 이벤트 핸들러 관리

### WorkModalManager
작업물 모달 관리 기능을 담당합니다.
- 작업물 저장/불러오기 모달 표시/숨김
- 작업물 목록 생성 및 이벤트 처리
- 모달 상태 및 입력값 관리

## 배포

### 정적 사이트 호스팅
```bash
npm run build
```
빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 지원하는 호스팅 서비스
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 브라우저 지원
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 성능 최적화
- 이미지 압축을 통한 파일 크기 최소화
- WebP 형식 지원으로 더 나은 압축률
- Canvas API를 사용한 클라이언트 사이드 이미지 처리
- 메모리 누수 방지를 위한 URL.revokeObjectURL() 사용
- 모듈화된 코드로 번들 크기 최적화

## 향후 개선 사항
- [x] 고급 크롭 기능 구현
- [ ] 이미지 필터 및 효과 추가
- [ ] 배치 처리 기능
- [ ] PWA 지원
- [ ] 다크 모드
- [ ] 다국어 지원
- [ ] 이미지 메타데이터 편집
- [ ] EXIF 데이터 보존
- [ ] TypeScript 마이그레이션
- [ ] 단위 테스트 추가

## 문제 해결

### 일반적인 문제들

#### 이미지 업로드가 안 되는 경우
- 브라우저가 File API를 지원하는지 확인
- 파일 크기 제한 확인 (기본 10MB)
- 지원되는 이미지 형식 확인

#### 이미지 처리 중 오류 발생
- 브라우저 콘솔에서 오류 메시지 확인
- Canvas API 지원 여부 확인
- 메모리 부족 문제일 수 있음

#### 빌드 오류
- Node.js 버전 확인 (16+ 권장)
- 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

#### SCSS 컴파일 오류
- sass 패키지가 설치되어 있는지 확인
- SCSS 파일의 import 경로 확인

## 라이선스
MIT License

## 기여 방법
1. 이슈 생성
2. 브랜치 생성
3. 변경사항 커밋
4. Pull Request 생성 