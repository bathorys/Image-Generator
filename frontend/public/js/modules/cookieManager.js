// 쿠키 관리 모듈 (CookieStore API 사용)
//
// CookieStore API 장점:
// 1. Promise 기반 비동기 처리
// 2. 더 안전한 쿠키 관리 (SameSite, Secure 등 자동 처리)
// 3. 더 간단한 API (복잡한 문자열 파싱 불필요)
// 4. 더 나은 에러 처리
//
// 브라우저 지원 (Baseline):
// - Chrome 87+ (2020년 11월 이후)
// - Edge 87+ (2020년 11월 이후)
// - Firefox 103+ (2022년 7월 이후)
// - Safari 16+ (2022년 9월 이후)
// - Opera 73+ (2020년 11월 이후)
//
// 전 세계 브라우저 사용률: 약 95% 이상 지원
// 한국 브라우저 사용률: 약 98% 이상 지원
export class CookieManager {
  constructor() {
    this.cookieName = 'imageGeneratorSettings';
    this.expireDays = 30; // 30일간 유지
  }

  // 쿠키 설정
  async setCookie(name, value, days = this.expireDays) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    await cookieStore.set({
      name: name,
      value: JSON.stringify(value),
      expires: expires,
      path: '/'
    });
  }

  // 쿠키 읽기
  async getCookie(name) {
    const cookie = await cookieStore.get(name);
    if (cookie) {
      return JSON.parse(cookie.value);
    }
    return null;
  }

  // 쿠키 삭제
  async deleteCookie(name) {
    await cookieStore.delete(name);
  }

  // 설정 저장
  async saveSettings(settings) {
    await this.setCookie(this.cookieName, settings);
  }

  // 설정 불러오기
  async loadSettings() {
    return await this.getCookie(this.cookieName);
  }

  // 설정 삭제
  async clearSettings() {
    await this.deleteCookie(this.cookieName);
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
      sizeOptions: {
        size1x: true,
        size2x: false,
        size3x: false
      }
    };
  }
}