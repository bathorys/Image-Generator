# 🖼️ Image Generator

이미지 변환, 크롭, 최적화를 한 번에! 완전히 클라이언트 사이드에서 동작하는 이미지 처리 도구입니다.

## ✨ 주요 기능

### 🎨 이미지 처리
- **다양한 형식 지원**: JPEG, PNG, WebP 변환
- **품질 조정**: 각 형식별 최적화된 품질 설정 (0-100%)
- **크기 조정**: 최대 너비/높이 설정으로 자동 리사이징
- **압축 최적화**: 파일 크기와 품질의 균형

### ✂️ 고급 크롭 기능
- **원본 이미지 크롭**: 업로드 후 바로 크롭 가능
- **처리된 이미지 크롭**: 변환 후 크롭 가능
- **직관적인 인터페이스**: 드래그로 쉽게 크롭 영역 선택
- **8방향 핸들**: 정밀한 크롭 영역 조정
- **실시간 크롭 정보**: X, Y, Width, Height 픽셀 값 실시간 표시
- **직접 입력**: 정확한 픽셀 값으로 크롭 영역 설정

### 📱 반응형 디자인
- **모바일 퍼스트**: 모든 디바이스에서 최적화된 경험
- **8px 기반 간격 시스템**: 일관된 디자인 언어
- **컴팩트한 레이아웃**: 화면에 더 많은 내용 표시
- **Sticky 버튼**: 스크롤 시에도 주요 버튼들이 따라다님

### 💾 작업물 관리
- **로컬 저장**: 브라우저에 작업물 자동 저장
- **작업물 불러오기**: 이전 작업물 쉽게 복원
- **자동 저장**: 설정 변경 시 자동 저장
- **작업물 삭제**: 불필요한 작업물 정리
- **통합 관리**: 업로드 화면에서도 작업물 관리 가능

### 🔒 개인정보 보호
- **완전 클라이언트 사이드**: 서버로 데이터 전송 없음
- **로컬 처리**: 모든 이미지 처리가 사용자 컴퓨터에서 수행
- **개인정보 수집 없음**: 사용자 데이터 수집하지 않음

## 🚀 빠른 시작

### 설치
```bash
git clone https://github.com/yourusername/ImageGenerator.git
cd ImageGenerator/frontend
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
서버는 `http://localhost:4322/Image-Generator`에서 실행됩니다.

### 빌드
```bash
npm run build
```

## 🛠️ 기술 스택

### 프론트엔드
- **Astro 5.12.8**: 정적 사이트 생성
- **SCSS**: 모던한 CSS 전처리기 (CSS 파일 사용하지 않음)
- **Vanilla JavaScript**: 순수 JavaScript로 구현
- **Canvas API**: 이미지 처리

### 주요 라이브러리
- **browser-image-compression**: 이미지 압축 최적화
- **canvas**: 이미지 처리 및 변환
- **sass**: SCSS 컴파일

## 📱 브라우저 지원

### 최소 지원 브라우저
- **Chrome**: 87+ (2020년 11월 이후)
- **Edge**: 87+ (2020년 11월 이후)
- **Firefox**: 103+ (2022년 7월 이후)
- **Safari**: 16+ (2022년 9월 이후)

## 🎯 최근 개선사항 (2024년 12월)

### ✂️ 크롭 기능 완성
- **실시간 크롭 정보 표시**: X, Y, Width, Height 픽셀 값 실시간 업데이트
- **직접 입력 기능**: 정확한 픽셀 값으로 크롭 영역 설정
- **8방향 핸들**: 모든 방향에서 정밀한 크롭 영역 조정
- **드래그 및 리사이즈**: 직관적인 크롭 인터페이스

### 🎨 UI/UX 개선
- **8px 기반 간격 시스템**: 일관된 디자인 언어 적용
- **컴팩트한 레이아웃**: 화면에 더 많은 내용 표시
- **모던한 디자인**: 그라디언트, 그림자, 애니메이션 효과
- **반응형 최적화**: 모든 디바이스에서 최적화된 경험
- **Sticky 버튼**: 스크롤 시에도 주요 버튼들이 따라다님

### 🔧 기능 개선
- **작업물 관리 통합**: 업로드 화면에서도 작업물 삭제 기능
- **버튼 시스템 개선**: 더 컴팩트하고 직관적인 버튼 디자인
- **미리보기 영역 확대**: 이미지를 더 크게 볼 수 있는 환경
- **확대/축소 컨트롤**: 위치 최적화로 공간 효율성 향상

### 📱 접근성 개선
- **키보드 네비게이션**: 포커스 스타일 개선
- **시각적 피드백**: 호버 효과 및 상태 표시
- **스크롤바 스타일링**: 일관된 사용자 경험

## 📁 프로젝트 구조

```
ImageGenerator/
├── docs/                    # 문서
│   ├── development-guidelines.md
│   ├── project-setup.md
│   ├── class-inventory.md
│   └── TODO.md
├── frontend/               # 프론트엔드 (Astro)
│   ├── src/
│   │   ├── components/     # 컴포넌트
│   │   ├── pages/         # 페이지
│   │   │   └── index.astro # 메인 페이지
│   │   ├── styles/        # 스타일 (SCSS)
│   │   │   ├── main.scss
│   │   │   ├── base/      # 기본 스타일
│   │   │   ├── components/ # 컴포넌트 스타일
│   │   │   ├── layout/    # 레이아웃 스타일
│   │   │   └── utilities/ # 유틸리티 스타일
│   │   ├── js/            # JavaScript 모듈
│   │   │   ├── app.js     # 메인 애플리케이션 (570줄)
│   │   │   ├── modules/   # 기능별 모듈
│   │   │   │   ├── imageProcessor.js
│   │   │   │   ├── cropManager.js         # 크롭 기능 (통합 완료)
│   │   │   │   ├── fileUploader.js
│   │   │   │   ├── uiManager.js
│   │   │   │   ├── workManager.js
│   │   │   │   ├── cookieManager.js
│   │   │   │   ├── magnifierManager.js
│   │   │   │   ├── settingsManager.js
│   │   │   │   ├── imageInfoManager.js
│   │   │   │   ├── eventManager.js        # 이벤트 관리
│   │   │   │   └── workModalManager.js    # 작업물 모달 관리
│   │   │   └── utils/     # 유틸리티
│   │   │       └── domSelector.js
│   │   └── utils/         # 유틸리티 함수
│   │       └── imageUtils.js
│   ├── public/            # 정적 파일
│   ├── package.json       # 의존성 관리
│   └── astro.config.mjs  # Astro 설정
└── README.md
```

## 🎨 디자인 시스템

### 간격 시스템 (8px 기반)
- **4px** (xs): 최소 간격
- **8px** (sm): 기본 간격
- **16px** (md): 섹션 간격
- **24px** (lg): 큰 섹션 간격
- **32px** (xl): 페이지 간격
- **48px** (xxl): 최대 간격

### 색상 시스템
- **Primary**: #667eea (그라디언트)
- **Secondary**: #764ba2
- **Success**: #28a745
- **Warning**: #ffc107
- **Danger**: #dc3545
- **Info**: #17a2b8

## 🔧 개발 가이드

자세한 개발 가이드는 [docs/development-guidelines.md](docs/development-guidelines.md)를 참조하세요.

## 📝 TODO

현재 진행 중인 작업과 향후 계획은 [docs/TODO.md](docs/TODO.md)를 확인하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/yourusername/ImageGenerator](https://github.com/yourusername/ImageGenerator)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!