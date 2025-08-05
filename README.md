# Image Generator

이미지 변환, 크롭, 최적화를 한 번에 처리하는 웹 애플리케이션입니다.

## 🚀 주요 기능

### ✅ 완료된 기능
- **이미지 업로드**: 드래그 앤 드롭, 파일 선택 지원
- **형식 변환**: JPEG, PNG, WebP 형식 변환
- **품질 조정**: 각 형식별 최적화된 품질 설정
- **이미지 크롭**: 드래그로 영역 선택 및 크롭
- **돋보기 기능**: 이미지 클릭 시 전체화면 모달
- **이미지 정보 표시**: 파일 크기, 이미지 크기, 압축률
- **사이즈 별 저장**: @x1, @x2, @x3 크기로 다운로드

## 🛠️ 기술 스택

- **Frontend**: Astro, SCSS, JavaScript (ES6+)
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/bathorys/Image-Generator.git
cd Image-Generator
```

### 2. 의존성 설치
```bash
cd frontend
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
```
http://localhost:4321
```

## 🎯 사용법

### 1. 이미지 업로드
- 업로드 영역 클릭하여 파일 선택
- 또는 이미지를 드래그 앤 드롭

### 2. 형식 및 품질 설정
- **JPEG**: 품질 설정 (1-100)
- **PNG**: 압축 레벨 설정 (0-9)
- **WebP**: 품질 설정 (1-100) + 투명도 지원

### 3. 이미지 처리
- "이미지 처리" 버튼 클릭
- 실시간으로 압축률 및 파일 크기 확인

### 4. 크롭 (선택사항)
- "크롭 모드" 버튼 클릭
- 드래그로 원하는 영역 선택
- "크롭 적용" 버튼으로 확정

### 5. 다운로드
- **단일 다운로드**: "다운로드" 버튼
- **다중 다운로드**: 원하는 크기 선택 후 "선택한 크기로 다운로드"

## 📁 프로젝트 구조

```
ImageGenerator/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.astro          # 메인 페이지
│   │   ├── styles/
│   │   │   ├── main.scss            # 메인 SCSS 파일
│   │   │   ├── base/                # 기본 스타일
│   │   │   ├── components/          # 컴포넌트 스타일
│   │   │   ├── layout/              # 레이아웃 스타일
│   │   │   └── utilities/           # 유틸리티 스타일
│   │   └── js/
│   │       └── modules/             # JavaScript 모듈
│   ├── public/
│   │   └── js/                      # 클라이언트 JavaScript
│   ├── package.json
│   └── astro.config.mjs
├── docs/
│   ├── TODO.md                      # 작업 목록
│   └── project-setup.md             # 프로젝트 설정 가이드
└── README.md
```

## 🔧 개발 환경 설정

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 개발 도구
- **Astro**: 정적 사이트 생성기
- **SCSS**: CSS 전처리기
- **Vite**: 빌드 도구

## 📝 주요 모듈

### JavaScript 모듈
- **ImageGeneratorApp**: 메인 애플리케이션 클래스
- **FileUploader**: 파일 업로드 처리
- **ImageProcessor**: 이미지 처리 및 변환
- **CropManager**: 이미지 크롭 기능
- **UIManager**: UI 상태 관리

### SCSS 모듈
- **Base**: 리셋, 변수, 타이포그래피
- **Components**: 버튼, 업로드, 미리보기, 컨트롤
- **Layout**: 헤더, 컨테이너
- **Utilities**: 반응형 디자인

## 🎨 기능 상세

### 이미지 형식별 처리
- **JPEG**: `canvas.toBlob()`의 quality 파라미터 사용
- **PNG**: 압축 레벨에 따른 이미지 크기 조정
- **WebP**: 브라우저 지원 확인 후 처리, 미지원 시 JPEG fallback

### 사이즈 별 저장
- **@x1**: 원본 크기
- **@x2**: 2배 크기 (고해상도 디스플레이용)
- **@x3**: 3배 크기 (고해상도 출력용)

### 돋보기 기능
- 마우스 호버 시 확대 아이콘 표시
- 클릭 시 전체화면 모달
- ESC 키 또는 배경 클릭으로 닫기

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

- **bathorys** - [GitHub](https://github.com/bathorys)

## 🙏 감사의 말

이 프로젝트는 다음 기술들을 사용합니다:
- [Astro](https://astro.build/) - 정적 사이트 생성기
- [Vite](https://vitejs.dev/) - 빌드 도구
- [SCSS](https://sass-lang.com/) - CSS 전처리기