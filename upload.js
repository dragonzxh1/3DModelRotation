/**
 * 文件上传处理模块
 * 负责处理文件上传、预览和创建3D卡片的逻辑
 */

import { readFileAsDataURL, createImagePreview, toggleElement, setButtonLoading } from './utils.js';

export class UploadManager {
    constructor(modelManager) {
        this.modelManager = modelManager;
        this.modelFileInput = null;
        this.frontImageInput = null;
        this.backImageInput = null;
        this.frontPreview = null;
        this.backPreview = null;
        this.previewSection = null;
        this.uploadBtn = null;
        this.uploadForm = null;
        this.onCardCreatedCallback = null;
    }
    
    /**
     * 初始化DOM元素引用
     * @param {Object} elements - DOM元素对象
     */
    initElements(elements) {
        this.modelFileInput = elements.modelFileInput;
        this.frontImageInput = elements.frontImageInput;
        this.backImageInput = elements.backImageInput;
        this.frontPreview = elements.frontPreview;
        this.backPreview = elements.backPreview;
        this.previewSection = elements.previewSection;
        this.uploadBtn = elements.uploadBtn;
        this.uploadForm = elements.uploadForm;
        
        this.setupEventListeners();
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 监听图片选择
        this.frontImageInput.addEventListener('change', () => {
            this.handleImagePreview(this.frontImageInput, this.frontPreview);
        });
        
        this.backImageInput.addEventListener('change', () => {
            this.handleImagePreview(this.backImageInput, this.backPreview);
        });
        
        // 监听表单提交
        this.uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }
    
    /**
     * 处理图片预览
     * @param {HTMLInputElement} input - 文件输入元素
     * @param {HTMLElement} previewElement - 预览容器元素
     */
    async handleImagePreview(input, previewElement) {
        const file = input.files[0];
        if (file) {
            const dataURL = await readFileAsDataURL(file);
            createImagePreview(dataURL, previewElement);
        }
    }
    
    /**
     * 处理表单提交
     */
    async handleSubmit() {
        const frontFile = this.frontImageInput.files[0];
        const backFile = this.backImageInput.files[0];
        
        if (!frontFile || !backFile) {
            alert('请选择正面和背面图片！');
            return;
        }
        
        setButtonLoading(this.uploadBtn, true);
        
        try {
            // 读取图片文件
            const frontImageData = await readFileAsDataURL(frontFile);
            const backImageData = await readFileAsDataURL(backFile);
            
            // 获取模型文件（可选）
            const modelFile = this.modelFileInput.files[0] || null;
            
            // 创建3D卡片
            await this.modelManager.createTexturedCard(frontImageData, backImageData, modelFile);
            
            // 显示预览区域
            toggleElement(this.previewSection, true);
            
            // 触发卡片创建成功回调
            if (this.onCardCreatedCallback) {
                this.onCardCreatedCallback();
            }
        } catch (error) {
            console.error('创建3D卡片失败：', error);
            alert('创建3D卡片失败，请重试！');
        } finally {
            setButtonLoading(this.uploadBtn, false);
        }
    }
    
    /**
     * 编程方式创建3D卡片（供外部调用）
     * @param {Object} options - 配置选项
     * @param {string} options.frontImageData - 正面图片Data URL
     * @param {string} options.backImageData - 背面图片Data URL
     * @param {File} options.modelFile - 可选的3D模型文件
     * @returns {Promise<void>}
     */
    async createCard(options) {
        const { frontImageData, backImageData, modelFile = null } = options;
        
        if (!frontImageData || !backImageData) {
            throw new Error('frontImageData 和 backImageData 是必需的参数');
        }
        
        await this.modelManager.createTexturedCard(frontImageData, backImageData, modelFile);
        
        // 触发卡片创建成功回调
        if (this.onCardCreatedCallback) {
            this.onCardCreatedCallback();
        }
    }
    
    /**
     * 设置卡片创建完成后的回调函数
     * @param {Function} callback - 回调函数
     */
    setOnCardCreatedCallback(callback) {
        this.onCardCreatedCallback = callback;
    }
}




