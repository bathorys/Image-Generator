/**
 * Data Attributes 기반 DOM 셀렉팅 유틸리티
 * HTML과 JavaScript의 느슨한 결합을 위한 셀렉팅 시스템
 */

class DOMSelector {
	/**
	 * Data Attributes로 요소를 셀렉팅
	 * @param {string} attribute - data-* 속성명 (예: 'action', 'target', 'component')
	 * @param {string} value - 속성값
	 * @returns {Element|null} 셀렉팅된 요소
	 */
	static byData(attribute, value) {
		return document.querySelector(`[data-${attribute}="${value}"]`);
	}

	/**
	 * Data Attributes로 여러 요소를 셀렉팅
	 * @param {string} attribute - data-* 속성명
	 * @param {string} value - 속성값
	 * @returns {NodeList} 셀렉팅된 요소들
	 */
	static byDataAll(attribute, value) {
		return document.querySelectorAll(`[data-${attribute}="${value}"]`);
	}

	/**
	 * 컴포넌트 셀렉팅
	 * @param {string} componentName - 컴포넌트명
	 * @returns {Element|null} 컴포넌트 요소
	 */
	static component(componentName) {
		return this.byData('component', componentName);
	}

	/**
	 * 액션 버튼 셀렉팅
	 * @param {string} action - 액션명
	 * @returns {Element|null} 액션 버튼
	 */
	static action(action) {
		return this.byData('action', action);
	}

	/**
	 * 타겟 요소 셀렉팅
	 * @param {string} target - 타겟명
	 * @returns {Element|null} 타겟 요소
	 */
	static target(target) {
		return this.byData('target', target);
	}

	/**
	 * 프리셋 선택 셀렉팅 (너비 프리셋 등)
	 * @returns {Element|null}
	 */
	static widthPreset() {
		return this.byData('target', 'width-preset');
	}

	/**
	 * 특정 타입의 컴포넌트 셀렉팅
	 * @param {string} componentType - 컴포넌트 타입
	 * @param {string} type - 타입명
	 * @returns {Element|null} 컴포넌트 요소
	 */
	static componentByType(componentType, type) {
		return document.querySelector(`[data-component="${componentType}"][data-type="${type}"]`);
	}

	/**
	 * 특정 타겟의 액션 셀렉팅
	 * @param {string} action - 액션명
	 * @param {string} target - 타겟명
	 * @returns {Element|null} 액션 요소
	 */
	static actionByTarget(action, target) {
		return document.querySelector(`[data-action="${action}"][data-target="${target}"]`);
	}

	/**
	 * 크롭 핸들 셀렉팅
	 * @param {string} position - 핸들 위치 (nw, n, ne, w, e, sw, s, se)
	 * @returns {Element|null} 크롭 핸들 요소
	 */
	static cropHandle(position) {
		return document.querySelector(`[data-target="crop-handle"][data-position="${position}"]`);
	}

	/**
	 * 모든 크롭 핸들 셀렉팅
	 * @returns {NodeList} 모든 크롭 핸들
	 */
	static cropHandles() {
		return this.byDataAll('target', 'crop-handle');
	}

	/**
	 * 사이즈 옵션 체크박스 셀렉팅
	 * @param {string} size - 사이즈 (1x, 1_5x, 2x, 3x, 4x)
	 * @returns {Element|null} 사이즈 체크박스
	 */
	static sizeOption(size) {
		return this.byData('target', `size-${size}`);
	}

	/**
	 * 모든 사이즈 옵션 셀렉팅
	 * @returns {NodeList} 모든 사이즈 옵션
	 */
	static sizeOptions() {
		return document.querySelectorAll('[data-target^="size-"]');
	}

	/**
	 * 모달 셀렉팅
	 * @param {string} modalName - 모달명
	 * @returns {Element|null} 모달 요소
	 */
	static modal(modalName) {
		return this.component(modalName);
	}

	/**
	 * 모달 닫기 버튼 셀렉팅
	 * @param {string} modalName - 모달명
	 * @returns {Element|null} 닫기 버튼
	 */
	static modalCloseButton(modalName) {
		return this.actionByTarget('close-modal', modalName);
	}
}

export default DOMSelector;