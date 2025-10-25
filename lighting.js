/**
 * Three.js光照系统模块
 * 负责所有光源的创建、管理和动态效果
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {
            ambient: null,
            directional: null,
            fill: null,
            back: null,
            hemisphere: null,
            dynamic1: null,  // 暖色调动态光
            dynamic2: null   // 冷色调动态光
        };
        
        this.init();
    }
    
    /**
     * 初始化所有光源
     */
    init() {
        this.addAmbientLight();
        this.addDirectionalLight();
        this.addFillLight();
        this.addBackLight();
        this.addHemisphereLight();
        this.addDynamicLights();
    }
    
    /**
     * 添加环境光 - 提供基础照明
     */
    addAmbientLight() {
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(this.lights.ambient);
    }
    
    /**
     * 添加主光源 - 模拟太阳光（带阴影）
     */
    addDirectionalLight() {
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 1.2);
        this.lights.directional.position.set(5, 5, 5);
        this.lights.directional.castShadow = true;
        
        // 高质量阴影设置
        const shadow = this.lights.directional.shadow;
        shadow.mapSize.width = 2048;
        shadow.mapSize.height = 2048;
        shadow.camera.near = 0.5;
        shadow.camera.far = 50;
        shadow.camera.left = -10;
        shadow.camera.right = 10;
        shadow.camera.top = 10;
        shadow.camera.bottom = -10;
        shadow.bias = -0.0001;
        
        this.scene.add(this.lights.directional);
    }
    
    /**
     * 添加补光 - 从左侧照亮，减少暗部
     */
    addFillLight() {
        this.lights.fill = new THREE.DirectionalLight(0xffffff, 0.6);
        this.lights.fill.position.set(-5, 3, -3);
        this.scene.add(this.lights.fill);
    }
    
    /**
     * 添加背光 - 增加轮廓光，让模型更立体
     */
    addBackLight() {
        this.lights.back = new THREE.DirectionalLight(0xffffff, 0.5);
        this.lights.back.position.set(0, 3, -5);
        this.scene.add(this.lights.back);
    }
    
    /**
     * 添加半球光 - 模拟天空和地面的反射光
     */
    addHemisphereLight() {
        this.lights.hemisphere = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
        this.lights.hemisphere.position.set(0, 10, 0);
        this.scene.add(this.lights.hemisphere);
    }
    
    /**
     * 添加动态点光源 - 跟随卡片旋转产生自然光效
     */
    addDynamicLights() {
        // 暖色调动态光（模拟阳光在卡片表面的反射）
        this.lights.dynamic1 = new THREE.PointLight(0xffd700, 0.8, 10);
        this.lights.dynamic1.position.set(3, 2, 3);
        this.scene.add(this.lights.dynamic1);
        
        // 冷色调动态光（模拟环境光反射）
        this.lights.dynamic2 = new THREE.PointLight(0x4da6ff, 0.6, 10);
        this.lights.dynamic2.position.set(-3, 2, 3);
        this.scene.add(this.lights.dynamic2);
    }
    
    /**
     * 更新动态光效 - 跟随模型旋转产生自然的光线变化
     * @param {number} rotationY - 当前模型的Y轴旋转角度
     */
    updateDynamicLights(rotationY) {
        if (!this.lights.dynamic1 || !this.lights.dynamic2) return;
        
        const time = Date.now() * 0.001; // 时间因子
        
        // 动态光1 - 围绕卡片旋转（模拟主光源反射）
        this.lights.dynamic1.position.x = Math.cos(rotationY + time * 0.5) * 4;
        this.lights.dynamic1.position.z = Math.sin(rotationY + time * 0.5) * 4;
        this.lights.dynamic1.position.y = 2 + Math.sin(time * 0.3) * 0.5;
        
        // 动态光2 - 反向旋转（模拟环境补光）
        this.lights.dynamic2.position.x = Math.cos(rotationY - time * 0.3) * 3.5;
        this.lights.dynamic2.position.z = Math.sin(rotationY - time * 0.3) * 3.5;
        this.lights.dynamic2.position.y = 2 + Math.cos(time * 0.4) * 0.5;
        
        // 根据旋转角度微调光照强度，产生更自然的效果
        const intensityFactor = Math.abs(Math.sin(rotationY * 0.5)) * 0.3 + 0.7;
        this.lights.dynamic1.intensity = 0.8 * intensityFactor;
        this.lights.dynamic2.intensity = 0.6 * (1.1 - intensityFactor * 0.5);
    }
    
    /**
     * 设置环境光强度
     * @param {number} intensity - 光照强度
     */
    setAmbientIntensity(intensity) {
        if (this.lights.ambient) {
            this.lights.ambient.intensity = intensity;
        }
    }
    
    /**
     * 设置主光源强度
     * @param {number} intensity - 光照强度
     */
    setDirectionalIntensity(intensity) {
        if (this.lights.directional) {
            this.lights.directional.intensity = intensity;
        }
    }
    
    /**
     * 启用/禁用动态光效
     * @param {boolean} enabled - 是否启用
     */
    setDynamicLightsEnabled(enabled) {
        if (this.lights.dynamic1) {
            this.lights.dynamic1.visible = enabled;
        }
        if (this.lights.dynamic2) {
            this.lights.dynamic2.visible = enabled;
        }
    }
    
    /**
     * 启用/禁用阴影投射
     * @param {boolean} enabled - 是否启用
     */
    setShadowsEnabled(enabled) {
        if (this.lights.directional) {
            this.lights.directional.castShadow = enabled;
        }
    }
    
    /**
     * 获取所有光源
     * @returns {Object}
     */
    getLights() {
        return this.lights;
    }
    
    /**
     * 移除所有光源
     */
    dispose() {
        Object.values(this.lights).forEach(light => {
            if (light) {
                this.scene.remove(light);
                if (light.dispose) light.dispose();
            }
        });
        this.lights = {};
    }
}

