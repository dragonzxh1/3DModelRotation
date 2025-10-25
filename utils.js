/**
 * 工具函数模块
 * 提供通用的辅助函数
 */

/**
 * 计算图片的宽高比
 * @param {string} imageData - 图片的Data URL
 * @returns {Promise<number>} 宽高比 (宽度/高度)
 */
export function calculateAspectRatio(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const aspectRatio = this.width / this.height;
            resolve(aspectRatio);
        };
        img.src = imageData;
    });
}

/**
 * 读取文件为Data URL
 * @param {File} file - 要读取的文件
 * @returns {Promise<string>} 文件的Data URL
 */
export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

/**
 * 读取文件为ArrayBuffer
 * @param {File} file - 要读取的文件
 * @returns {Promise<ArrayBuffer>} 文件的ArrayBuffer
 */
export function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * 创建图片预览
 * @param {string} dataURL - 图片的Data URL
 * @param {HTMLElement} container - 预览容器元素
 */
export function createImagePreview(dataURL, container) {
    container.innerHTML = `<img src="${dataURL}" alt="预览">`;
}

/**
 * 显示/隐藏元素
 * @param {HTMLElement} element - 要操作的元素
 * @param {boolean} show - 是否显示
 */
export function toggleElement(element, show) {
    element.style.display = show ? 'block' : 'none';
}

/**
 * 设置按钮加载状态
 * @param {HTMLButtonElement} button - 按钮元素
 * @param {boolean} loading - 是否加载中
 * @param {string} normalText - 正常状态的文本
 * @param {string} loadingText - 加载状态的文本
 */
export function setButtonLoading(button, loading, normalText = '创建3D卡片', loadingText = '创建中...') {
    button.disabled = loading;
    button.textContent = loading ? loadingText : normalText;
}




