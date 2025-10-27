/**
 * 主入口文件
 * 整合所有模块，初始化应用
 */

import { SceneManager } from './scene.js';
import { ModelManager } from './model.js';
import { ControlsManager } from './controls.js';
import { UploadManager } from './upload.js';
import { VideoRecorder } from './video-recorder.js';

class App {
    constructor() {
        this.sceneManager = null;
        this.modelManager = null;
        this.controlsManager = null;
        this.uploadManager = null;
        this.videoRecorder = null;
    }
    
    /**
     * 初始化应用
     */
    init() {
        // 获取DOM元素
        const canvas = document.getElementById('threeCanvas');
        
        // 初始化管理器
        this.sceneManager = new SceneManager(canvas);
        this.modelManager = new ModelManager(this.sceneManager);
        this.controlsManager = new ControlsManager(this.modelManager, this.sceneManager);
        this.uploadManager = new UploadManager(this.modelManager);
        this.videoRecorder = new VideoRecorder(this.sceneManager, this.modelManager, this.controlsManager);
        
        // 初始化控制器元素
        this.controlsManager.initElements({
            canvas: canvas,
            autoRotateBtn: document.getElementById('autoRotateBtn'),
            manualRotateBtn: document.getElementById('manualRotateBtn')
        });
        
        // 初始化上传管理器元素
        this.uploadManager.initElements({
            modelFileInput: document.getElementById('modelFile'),
            frontImageInput: document.getElementById('frontImage'),
            backImageInput: document.getElementById('backImage'),
            frontPreview: document.getElementById('frontPreview'),
            backPreview: document.getElementById('backPreview'),
            previewSection: document.getElementById('previewSection'),
            uploadBtn: document.getElementById('uploadBtn'),
            uploadForm: document.getElementById('uploadForm')
        });
        
        // 初始化视频录制器元素
        this.videoRecorder.initElements({
            recordButton: document.getElementById('recordButton')
        });
        
        // 设置卡片创建完成后启用录制按钮
        this.uploadManager.setOnCardCreatedCallback(() => {
            this.videoRecorder.enableRecordButton();
        });
        
        // 创建默认卡片
        this.modelManager.createDefaultCard();
        
        // 开始动画循环
        this.animate();
    }
    
    /**
     * 动画循环
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 更新控制器
        this.controlsManager.update();
        
        // 更新动态光效
        this.sceneManager.updateDynamicLights(this.modelManager.getRotationY());
        
        // 渲染场景
        this.sceneManager.render();
    }
    
    /**
     * 获取场景管理器
     * @returns {SceneManager}
     */
    getSceneManager() {
        return this.sceneManager;
    }
    
    /**
     * 获取模型管理器
     * @returns {ModelManager}
     */
    getModelManager() {
        return this.modelManager;
    }
    
    /**
     * 获取控制管理器
     * @returns {ControlsManager}
     */
    getControlsManager() {
        return this.controlsManager;
    }
    
    /**
     * 获取上传管理器
     * @returns {UploadManager}
     */
    getUploadManager() {
        return this.uploadManager;
    }
    
    /**
     * 获取视频录制器
     * @returns {VideoRecorder}
     */
    getVideoRecorder() {
        return this.videoRecorder;
    }
}

// 创建全局应用实例
const app = new App();

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// 导出app实例供调试使用
window.app = app;

// 导出默认对象供其他模块使用
export default app;
