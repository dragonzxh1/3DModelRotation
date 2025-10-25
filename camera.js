/**
 * Three.js相机管理模块
 * 负责相机的创建、位置控制和视角调整
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

export class CameraManager {
    constructor() {
        this.camera = null;
        this.distance = 3;           // 相机距离
        this.minDistance = 1.5;      // 最小距离
        this.maxDistance = 20;       // 最大距离
        this.fov = 75;               // 视野角度
        this.aspect = 1;             // 宽高比
        this.near = 0.1;             // 近裁剪面
        this.far = 1000;             // 远裁剪面
        
        this.init();
    }
    
    /**
     * 初始化相机
     */
    init() {
        // 创建透视相机
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.aspect,
            this.near,
            this.far
        );
        
        // 设置相机初始位置
        this.camera.position.set(0, 0.5, this.distance);
        this.camera.lookAt(0, 0, 0);  // 看向原点
    }
    
    /**
     * 调整相机距离（缩放）
     * @param {number} delta - 距离变化量
     */
    adjustDistance(delta) {
        this.distance += delta;
        
        // 限制在最小和最大距离之间
        this.distance = Math.max(
            this.minDistance, 
            Math.min(this.maxDistance, this.distance)
        );
        
        // 更新相机位置
        this.camera.position.z = this.distance;
    }
    
    /**
     * 设置相机距离
     * @param {number} distance - 目标距离
     */
    setDistance(distance) {
        this.distance = Math.max(
            this.minDistance, 
            Math.min(this.maxDistance, distance)
        );
        this.camera.position.z = this.distance;
    }
    
    /**
     * 设置相机位置
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} z - Z坐标
     */
    setPosition(x, y, z) {
        this.camera.position.set(x, y, z);
    }
    
    /**
     * 设置相机看向目标
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} z - Z坐标
     */
    lookAt(x, y, z) {
        this.camera.lookAt(x, y, z);
    }
    
    /**
     * 设置视野角度
     * @param {number} fov - 视野角度（度）
     */
    setFOV(fov) {
        this.fov = fov;
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * 设置宽高比
     * @param {number} aspect - 宽高比
     */
    setAspect(aspect) {
        this.aspect = aspect;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }
    
    /**
     * 设置距离范围
     * @param {number} min - 最小距离
     * @param {number} max - 最大距离
     */
    setDistanceRange(min, max) {
        this.minDistance = min;
        this.maxDistance = max;
        
        // 确保当前距离在范围内
        if (this.distance < min) this.setDistance(min);
        if (this.distance > max) this.setDistance(max);
    }
    
    /**
     * 获取相机实例
     * @returns {THREE.PerspectiveCamera}
     */
    getCamera() {
        return this.camera;
    }
    
    /**
     * 获取当前距离
     * @returns {number}
     */
    getDistance() {
        return this.distance;
    }
    
    /**
     * 重置相机到初始状态
     */
    reset() {
        this.distance = 3;
        this.camera.position.set(0, 0.5, this.distance);
        this.camera.lookAt(0, 0, 0);
    }
}

