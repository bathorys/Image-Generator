# 개발 가이드라인

## 🌐 브라우저 지원 기준 (Baseline)

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

### 지원 정책
1. **최신 기술 우선**: 최신 브라우저에서 최적의 경험 제공
2. **점진적 개선**: 새로운 API 기능을 적극 활용
3. **넓은 호환성**: 2020년 이후 브라우저 대부분 지원
4. **성능 최적화**: 최신 브라우저의 성능 최적화 기능 활용

## 🚀 사용하는 최신 기술

### JavaScript
- **ES6+ 모듈**: `import`/`export` 문법
- **Arrow Functions**: `() => {}` 문법
- **Destructuring**: 객체/배열 구조 분해
- **Template Literals**: 백틱 문자열
- **Promise & async/await**: 비동기 처리
- **Optional Chaining**: `?.` 연산자
- **Nullish Coalescing**: `??` 연산자

### CSS
- **CSS Grid**: 2차원 레이아웃
- **Flexbox**: 1차원 레이아웃
- **CSS Custom Properties**: CSS 변수
- **Modern Selectors**: `:is()`, `:where()`, `:has()`
- **CSS Logical Properties**: `margin-inline`, `padding-block` 등

### Web APIs
- **CookieStore API**: 쿠키 관리 (Chrome 87+, Firefox 103+, Safari 16+)
- **Fetch API**: 네트워크 요청
- **File API**: 파일 처리
- **Canvas API**: 이미지 처리
- **Drag & Drop API**: 드래그 앤 드롭

### HTML5
- **Semantic Elements**: `<header>`, `<main>`, `<section>` 등
- **Modern Form Controls**: `<input type="range">`, `<input type="file">`
- **Data Attributes**: `data-*` 속성

## ⚠️ 사용 시 주의사항

### API 사용 전 확인사항
1. **브라우저 지원 현황 확인**: Can I Use 사이트 체크
2. **MDN 문서 확인**: 브라우저 지원 표 참조
3. **실제 테스트**: 대상 브라우저에서 직접 테스트

### CSS 기능 사용 시
- **Grid/Flexbox**: IE 미지원, baseline 브라우저에서 완전 지원
- **CSS Variables**: IE 미지원, baseline 브라우저에서 완전 지원
- **Modern Selectors**: `:is()`, `:where()` 등은 최신 브라우저에서만 지원

### JavaScript 기능 사용 시
- **ES6+ 모듈**: baseline 브라우저에서 완전 지원
- **Promise/async-await**: baseline 브라우저에서 완전 지원
- **Optional Chaining**: Chrome 80+, Firefox 72+, Safari 13.1+

## 🔍 브라우저 지원 확인 방법

### 온라인 도구
1. **Can I Use**: https://caniuse.com/
   - 특정 기능의 브라우저 지원 현황 확인
   - 사용률 통계 제공

2. **MDN Web Docs**: https://developer.mozilla.org/
   - 각 API의 브라우저 지원 표 확인
   - 상세한 사용법과 예제 제공

3. **Browser Compatibility**: https://web.dev/browser-compatibility/
   - Google의 브라우저 호환성 가이드

### 로컬 테스트
1. **브라우저 개발자 도구**: 각 브라우저의 개발자 도구에서 기능 테스트
2. **Polyfill 확인**: 필요한 경우 polyfill 사용 검토
3. **크로스 브라우저 테스트**: 여러 브라우저에서 동시 테스트

## 📝 개발 체크리스트

### 새 기능 추가 시
- [ ] 사용하는 API가 baseline 브라우저에서 지원되는지 확인
- [ ] CSS 기능이 모든 대상 브라우저에서 작동하는지 확인
- [ ] JavaScript 기능이 ES6+ 모듈 시스템과 호환되는지 확인
- [ ] 성능 최적화가 최신 브라우저에서 효과적인지 확인
- [ ] 접근성(Accessibility) 고려사항 확인
- [ ] 모바일 브라우저에서의 동작 확인

### 코드 리뷰 시
- [ ] 브라우저 호환성 검토
- [ ] 성능 영향 분석
- [ ] 보안 고려사항 확인
- [ ] 코드 품질 및 가독성 검토

### 배포 전
- [ ] 모든 대상 브라우저에서 기능 테스트
- [ ] 성능 테스트 (Lighthouse 등)
- [ ] 접근성 테스트
- [ ] 모바일 반응형 테스트

## 🛠️ 개발 도구 설정

### VS Code 확장 프로그램 권장
- **ESLint**: JavaScript 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Live Server**: 로컬 개발 서버
- **Browser Preview**: 브라우저 미리보기

### 브라우저 개발자 도구
- **Chrome DevTools**: 성능 분석, 디버깅
- **Firefox Developer Tools**: CSS Grid/Flexbox 디버깅
- **Safari Web Inspector**: iOS 시뮬레이션

## 📚 참고 자료

### 공식 문서
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)
- [Web.dev](https://web.dev/)

### 브라우저 지원 현황
- [Chrome Platform Status](https://www.chromestatus.com/)
- [Firefox Platform Status](https://platform-status.mozilla.org/)
- [WebKit Feature Status](https://webkit.org/status/)

### 성능 최적화
- [Web Performance](https://web.dev/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/) 