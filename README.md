# Image Generator

이미지 변환, 크롭, 최적화를 한 번에 처리하는 웹 애플리케이션입니다.

## 🚀 주요 기능

### ✅ 완료된 기능
- **이미지 업로드**: 드래그 앤 드롭, 파일 선택 지원
- **형식 변환**: JPEG, PNG, WebP 형식 변환
- **품질 조정**: 각 형식별 최적화된 품질 설정
- **이미지 크롭**: 원본/처리된 이미지 모두 크롭 가능
- **돋보기 기능**: 이미지 클릭 시 전체화면 모달
- **이미지 정보 표시**: 파일 크기, 이미지 크기, 압축률
- **사이즈 별 저장**: @x1, @x2, @x3 크기로 다운로드
- **스마트한 버튼 관리**: 상황에 따른 자동 활성화/비활성화
- **유연한 초기화**: 이미지 초기화와 완전 초기화 분리
- **설정 자동 저장**: CookieStore API를 사용한 설정 자동 저장/복원

## 🛠️ 기술 스택

- **Frontend**: Astro, SCSS, JavaScript (ES6+)
- **Build Tool**: Vite
- **Package Manager**: npm

## 🌐 브라우저 지원 (Baseline)

### 최소 지원 브라우저
이 프로젝트는 **최신 기술을 우선**하되, **최대한 많은 사용자**를 지원하는 것을 목표로 합니다.

#### ✅ 지원 브라우저
- **Chrome**: 87+ (2020년 11월 이후)
- **Edge**: 87+ (2020년 11월 이후)
- **Firefox**: 103+ (2022년 7월 이후)
- **Safari**: 16+ (2022년 9월 이후)
- **Opera**: 73+ (2020년 11월 이후)

#### 📊 지원 현황
- **전 세계 사용률**: 약 95% 이상
- **한국 사용률**: 약 98% 이상
- **모바일 브라우저**: iOS Safari 16+, Android Chrome 87+

#### 🚀 사용하는 최신 기술
- **CookieStore API**: 쿠키 관리 (Chrome 87+, Firefox 103+, Safari 16+)
- **ES6+ 모듈**: JavaScript 모듈 시스템
- **CSS Grid & Flexbox**: 현대적 레이아웃
- **CSS Custom Properties**: CSS 변수
- **Promise 기반 비동기 처리**: async/await

#### 📋 지원 정책
1. **최신 기술 우선**: 최신 브라우저에서 최적의 경험 제공
2. **점진적 개선**: 새로운 API 기능을 적극 활용
3. **넓은 호환성**: 2020년 이후 브라우저 대부분 지원
4. **성능 최적화**: 최신 브라우저의 성능 최적화 기능 활용

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
- **원본 이미지 크롭**: "원본 이미지 크롭" 버튼 클릭
- **처리된 이미지 크롭**: "처리된 이미지 크롭" 버튼 클릭
- 드래그로 원하는 영역 선택
- "크롭 적용" 버튼으로 확정

### 5. 다운로드
- **단일 다운로드**: "다운로드" 버튼
- **다중 다운로드**: 원하는 크기 선택 후 "선택한 크기로 다운로드"

### 6. 초기화
- **이미지 초기화**: 업로드된 이미지만 초기화, 설정은 유지
- **새로 시작**: 모든 설정을 포함한 완전 초기화

### 7. 설정 관리
- **자동 저장**: 설정 변경 시 자동으로 브라우저에 저장
- **자동 복원**: 페이지 로드 시 이전 설정 자동 복원
- **수동 관리**: 설정 저장/불러오기/삭제 버튼 제공

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
│   ├── project-setup.md             # 프로젝트 설정 가이드
│   └── development-guidelines.md    # 개발 가이드라인
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

## 📋 개발 가이드라인

### 브라우저 지원 기준
개발 시 다음 기준을 준수하여 최신 기술을 적극 활용하되, 넓은 호환성을 유지합니다.

#### ✅ 권장 사용 기술
- **JavaScript**: ES6+ (Arrow functions, Destructuring, Template literals, Modules)
- **CSS**: Grid, Flexbox, Custom Properties, Modern selectors
- **Web APIs**: CookieStore, Fetch API, Promise, async/await
- **HTML5**: Semantic elements, Modern form controls

#### ⚠️ 사용 시 주의사항
- **최신 API 사용 시**: 브라우저 지원 현황 확인 필수
- **CSS 기능 사용 시**: Can I Use 사이트로 호환성 체크
- **JavaScript 기능 사용 시**: MDN 문서의 브라우저 지원 표 확인

#### 🔍 브라우저 지원 확인 방법
1. **Can I Use**: https://caniuse.com/
2. **MDN Web Docs**: https://developer.mozilla.org/
3. **Browser Compatibility**: https://web.dev/browser-compatibility/

#### 📝 개발 체크리스트
- [ ] 사용하는 API가 baseline 브라우저에서 지원되는지 확인
- [ ] CSS 기능이 모든 대상 브라우저에서 작동하는지 확인
- [ ] JavaScript 기능이 ES6+ 모듈 시스템과 호환되는지 확인
- [ ] 성능 최적화가 최신 브라우저에서 효과적인지 확인

> 📖 **더 자세한 개발 가이드라인**: [development-guidelines.md](docs/development-guidelines.md)

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

### 크롭 기능
- **원본 이미지 크롭**: 이미지 업로드 후 바로 크롭 가능
- **처리된 이미지 크롭**: 이미지 처리 후 크롭 가능
- **유연한 워크플로우**: 원본→크롭→처리 또는 원본→처리→크롭 모두 지원

### 스마트한 UI
- **동적 버튼 텍스트**: 상황에 따라 버튼 텍스트 자동 변경
- **자동 활성화/비활성화**: 사용할 수 없는 버튼은 자동으로 비활성화
- **툴팁 지원**: 각 버튼에 마우스 호버 시 기능 설명 표시

### 설정 자동 저장
- **CookieStore API**: 최신 브라우저 API로 안전하고 빠른 쿠키 관리 (Chrome 87+, Firefox 103+, Safari 16+)
- **자동 저장**: 설정 변경 시 즉시 브라우저에 저장
- **자동 복원**: 페이지 새로고침 시 이전 설정 자동 복원
- **30일간 유지**: 설정이 30일간 브라우저에 보관

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