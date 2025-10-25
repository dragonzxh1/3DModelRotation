/**
 * Three.js渲染器管理模块
 * 负责WebGL渲染器的初始化、配置和渲染操作
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class RendererManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = null;
        this.width = 600;
        this.height = 600;
        
        this.init();
    }
    
    /**
     * 初始化渲染器
     */
    init() {
        // 创建高质量WebGL渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true,              // 抗锯齿
            alpha: true,                  // 透明背景
            powerPreference: "high-performance",  // 高性能模式
            precision: "highp"            // 高精度着色器
        });
        
        // 设置渲染尺寸和像素比
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);  // 透明背景
        
        // 启用高质量阴影系统
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // 柔和阴影
        this.renderer.shadowMap.autoUpdate = true;
        
        // 色调映射和颜色编码
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding;  // 标准RGB颜色空间
        
        // 启用物理正确的光照计算
        this.renderer.physicallyCorrectLights = true;
    }
    
    /**
     * 渲染场景
     * @param {THREE.Scene} scene - 场景对象
     * @param {THREE.Camera} camera - 相机对象
     */
    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
    
    /**
     * 设置渲染器尺寸
     * @param {number} width - 宽度
     * @param {number} height - 高度
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.renderer.setSize(width, height);
    }
    
    /**
     * 设置像素比
     * @param {number} pixelRatio - 像素比
     */
    setPixelRatio(pixelRatio) {
        this.renderer.setPixelRatio(pixelRatio);
    }
    
    /**
     * 设置曝光度
     * @param {number} exposure - 曝光度值
     */
    setExposure(exposure) {
        this.renderer.toneMappingExposure = exposure;
    }
    
    /**
     * 启用/禁用阴影
     * @param {boolean} enabled - 是否启用
     */
    setShadowsEnabled(enabled) {
        this.renderer.shadowMap.enabled = enabled;
    }
    
    /**
     * 获取渲染器实例
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.renderer;
    }
    
    /**
     * 获取渲染信息（用于性能监控）
     * @returns {Object}
     */
    getRenderInfo() {
        return {
            memory: this.renderer.info.memory,
            render: this.renderer.info.render,
            programs: this.renderer.info.programs
        };
    }
    
    /**
     * 清理资源
     */
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
    }
}

