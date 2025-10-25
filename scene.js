/**
 * Three.js场景管理模块（重构版）
 * 整合渲染器、相机和光照系统
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { RendererManager } from './renderer.js';
import { CameraManager } from './camera.js';
import { LightingManager } from './lighting.js';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        
        // 使用独立的管理器
        this.rendererManager = null;
        this.cameraManager = null;
        this.lightingManager = null;
        
        this.init();
    }
    
    /**
     * 初始化场景及各个子系统
     */
    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        
        // 初始化渲染器管理器
        this.rendererManager = new RendererManager(this.canvas);
        
        // 初始化相机管理器
        this.cameraManager = new CameraManager();
        
        // 初始化光照管理器
        this.lightingManager = new LightingManager(this.scene);
    }
    
    /**
     * 添加对象到场景
     * @param {THREE.Object3D} object - 要添加的对象
     */
    add(object) {
        this.scene.add(object);
    }
    
    /**
     * 从场景移除对象
     * @param {THREE.Object3D} object - 要移除的对象
     */
    remove(object) {
        this.scene.remove(object);
    }
    
    /**
     * 渲染场景
     */
    render() {
        this.rendererManager.render(this.scene, this.cameraManager.getCamera());
    }
    
    /**
     * 调整相机距离
     * @param {number} delta - 距离变化量
     */
    adjustCameraDistance(delta) {
        this.cameraManager.adjustDistance(delta);
    }
    
    /**
     * 更新动态光效
     * @param {number} rotationY - 当前模型的Y轴旋转角度
     */
    updateDynamicLights(rotationY) {
        this.lightingManager.updateDynamicLights(rotationY);
    }
    
    /**
     * 获取场景对象
     * @returns {THREE.Scene}
     */
    getScene() {
        return this.scene;
    }
    
    /**
     * 获取相机对象
     * @returns {THREE.PerspectiveCamera}
     */
    getCamera() {
        return this.cameraManager.getCamera();
    }
    
    /**
     * 获取渲染器对象
     * @returns {THREE.WebGLRenderer}
     */
    getRenderer() {
        return this.rendererManager.getRenderer();
    }
    
    /**
     * 获取渲染器管理器
     * @returns {RendererManager}
     */
    getRendererManager() {
        return this.rendererManager;
    }
    
    /**
     * 获取相机管理器
     * @returns {CameraManager}
     */
    getCameraManager() {
        return this.cameraManager;
    }
    
    /**
     * 获取光照管理器
     * @returns {LightingManager}
     */
    getLightingManager() {
        return this.lightingManager;
    }
    
    /**
     * 清理资源
     */
    dispose() {
        // 清理光照
        if (this.lightingManager) {
            this.lightingManager.dispose();
        }
        
        // 清理渲染器
        if (this.rendererManager) {
            this.rendererManager.dispose();
        }
        
        // 清理场景
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            this.scene.clear();
        }
    }
}
