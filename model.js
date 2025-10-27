/**
 * 模型和纹理管理模块
 * 负责3D模型的创建、加载和纹理处理
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { calculateAspectRatio } from './utils.js';

export class ModelManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.cube = null;
        this.frontTexture = null;
        this.backTexture = null;
        this.backTextureOriginal = null;
        this.frontPlane = null;
        this.backPlane = null;
        this.gltfLoader = new GLTFLoader();
    }
    
    /**
     * 创建圆角遮罩纹理，用于避免矩形图片在圆角模型上露出黑边
     * @param {number} cornerRadius - 圆角半径（0-0.5之间）
     * @returns {THREE.CanvasTexture}
     */
    createRoundedCornerMask(cornerRadius = 0.08) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // 背景设为黑色（完全透明区域）
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制白色圆角矩形（不透明区域）
        ctx.fillStyle = 'white';
        ctx.beginPath();
        const x = 0, y = 0, w = canvas.width, h = canvas.height;
        const r = cornerRadius * Math.min(w, h); // 圆角半径
        
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.fill();
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    /**
     * 创建纹理
     * @param {string} imageData - 图片的Data URL
     * @param {number} rotation - 旋转角度（弧度）
     * @param {boolean} flipY - 是否垂直翻转
     * @param {boolean} flipX - 是否水平翻转
     * @returns {THREE.Texture}
     */
    createTexture(imageData, rotation = 0, flipY = false, flipX = false) {
        const texture = new THREE.Texture();
        const image = new Image();
        image.onload = function() {
            texture.image = image;
            texture.needsUpdate = true;
        };
        image.src = imageData;
        
        // 设置高质量纹理过滤
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        
        // 如果需要翻转Y轴或X轴
        if (flipY || flipX) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            
            if (flipY) {
                texture.repeat.y = -1;
                texture.offset.y = 1;
            }
            
            if (flipX) {
                texture.repeat.x = -1;
                texture.offset.x = 1;
            }
        }
        
        // 如果需要旋转纹理
        if (rotation !== 0) {
            texture.center = new THREE.Vector2(0.5, 0.5);
            texture.rotation = rotation;
        }
        
        return texture;
    }
    
    /**
     * 创建默认卡片（立方体）
     */
    createDefaultCard() {
        // 默认比例使用标准卡片比例（游戏王卡片 63:88 ≈ 0.716）
        const aspectRatio = 0.716;
        const baseHeight = 4;
        const width = baseHeight * aspectRatio;
        const height = baseHeight;
        
        const geometry = new THREE.BoxGeometry(width, height, 0.05);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x4a90e2,
            transparent: true,
            opacity: 0.8,
            metalness: 0.2,
            roughness: 0.3,
            envMapIntensity: 0.8
        });
        
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.sceneManager.add(this.cube);
    }
    
    /**
     * 创建带纹理的卡片
     * @param {string} frontImageData - 正面图片数据
     * @param {string} backImageData - 背面图片数据
     * @param {File} modelFile - 可选的3D模型文件
     * @returns {Promise<void>}
     */
    async createTexturedCard(frontImageData, backImageData, modelFile = null) {
        // 创建纹理 - 正面和背面都直接贴图，不翻转
        this.frontTexture = this.createTexture(frontImageData);
        this.backTexture = this.createTexture(backImageData);
        this.backTextureOriginal = this.createTexture(backImageData);
        
        // 如果有自定义模型文件
        if (modelFile) {
            await this.loadCustomModel(modelFile, frontImageData, backImageData);
        } else {
            await this.createDefaultTexturedCard(frontImageData, backImageData);
        }
    }
    
    /**
     * 创建默认的带纹理卡片
     * @param {string} frontImageData - 正面图片数据
     * @param {string} backImageData - 背面图片数据
     * @returns {Promise<void>}
     */
    async createDefaultTexturedCard(frontImageData, backImageData) {
        // 清理现有平面
        this.cleanupTexturePlanes();
        
        // 根据实际图片比例计算卡片尺寸
        const aspectRatio = await calculateAspectRatio(frontImageData);
        const baseHeight = 4;
        const width = baseHeight * aspectRatio;
        const height = baseHeight;
        
        // 移除旧的立方体
        if (this.cube) this.sceneManager.remove(this.cube);
        
        // 创建新的立方体
        const geometry = new THREE.BoxGeometry(width, height, 0.05);
        const frontMaterial = new THREE.MeshStandardMaterial({ 
            map: this.frontTexture, 
            transparent: true,
            metalness: 0.15,
            roughness: 0.3,
            envMapIntensity: 0.8,
            side: THREE.FrontSide
        });
        const backMaterial = new THREE.MeshStandardMaterial({ 
            map: this.backTexture, 
            transparent: true,
            metalness: 0.15,
            roughness: 0.3,
            envMapIntensity: 0.8,
            side: THREE.FrontSide
        });
        const edgeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.3,
            metalness: 0.1,
            roughness: 0.7
        });
        
        const materials = [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, backMaterial];
        this.cube = new THREE.Mesh(geometry, materials);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.sceneManager.add(this.cube);
    }
    
    /**
     * 加载自定义3D模型
     * @param {File} modelFile - 模型文件
     * @param {string} frontImageData - 正面图片数据
     * @param {string} backImageData - 背面图片数据
     * @returns {Promise<void>}
     */
    async loadCustomModel(modelFile, frontImageData, backImageData) {
        const arrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(modelFile);
        });
        
        return new Promise((resolve, reject) => {
            this.gltfLoader.parse(arrayBuffer, '', (gltf) => {
                if (this.cube) this.sceneManager.remove(this.cube);
                
                // 计算包围盒
                const scene = this.sceneManager.getScene();
                scene.add(gltf.scene);
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const size = box.getSize(new THREE.Vector3());
                scene.remove(gltf.scene);
                
                // 创建容器组
                this.cube = new THREE.Group();
                
                // 判断模型朝向
                const dims = [
                    { v: size.x, axis: 'x', idx: 0 },
                    { v: size.y, axis: 'y', idx: 1 },
                    { v: size.z, axis: 'z', idx: 2 }
                ].sort((a,b) => a.v - b.v);
                const shortest = dims[0];
                
                // 如果Y轴最短，说明模型是平躺的，需要竖立
                if (shortest.idx === 1) {
                    gltf.scene.rotation.x = -Math.PI / 2;
                }
                
                // 放大模型以便更好地查看
                const modelScale = 3.5;
                gltf.scene.scale.set(modelScale, modelScale, modelScale);
                
                // 旋转和缩放后重新计算包围盒并居中
                scene.add(gltf.scene);
                const rotatedBox = new THREE.Box3().setFromObject(gltf.scene);
                const rotatedCenter = rotatedBox.getCenter(new THREE.Vector3());
                scene.remove(gltf.scene);
                gltf.scene.position.sub(rotatedCenter);
                
                // 为模型中的所有网格启用阴影和保留原始材质
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // 保留并增强原始材质
                        if (child.material) {
                            const oldMaterial = child.material;
                            
                            // 如果是BasicMaterial，升级为StandardMaterial（保留所有原始属性）
                            if (oldMaterial.isMeshBasicMaterial) {
                                child.material = new THREE.MeshStandardMaterial({
                                    map: oldMaterial.map,
                                    color: oldMaterial.color,
                                    transparent: oldMaterial.transparent,
                                    opacity: oldMaterial.opacity,
                                    side: oldMaterial.side,
                                    metalness: 0.15,
                                    roughness: 0.3,
                                    envMapIntensity: 0.8
                                });
                            }
                            // 如果是PhongMaterial，转换为StandardMaterial（保留所有纹理和颜色）
                            else if (oldMaterial.isMeshPhongMaterial) {
                                child.material = new THREE.MeshStandardMaterial({
                                    map: oldMaterial.map,
                                    normalMap: oldMaterial.normalMap,
                                    bumpMap: oldMaterial.bumpMap,
                                    displacementMap: oldMaterial.displacementMap,
                                    roughnessMap: oldMaterial.roughnessMap,
                                    metalnessMap: oldMaterial.metalnessMap,
                                    aoMap: oldMaterial.aoMap,
                                    emissiveMap: oldMaterial.emissiveMap,
                                    emissive: oldMaterial.emissive,
                                    color: oldMaterial.color,
                                    transparent: oldMaterial.transparent,
                                    opacity: oldMaterial.opacity,
                                    side: oldMaterial.side,
                                    metalness: 0.15,
                                    roughness: 0.3,
                                    envMapIntensity: 0.8
                                });
                            }
                            // 如果是LambertMaterial，转换为StandardMaterial
                            else if (oldMaterial.isMeshLambertMaterial) {
                                child.material = new THREE.MeshStandardMaterial({
                                    map: oldMaterial.map,
                                    normalMap: oldMaterial.normalMap,
                                    emissiveMap: oldMaterial.emissiveMap,
                                    emissive: oldMaterial.emissive,
                                    color: oldMaterial.color,
                                    transparent: oldMaterial.transparent,
                                    opacity: oldMaterial.opacity,
                                    side: oldMaterial.side,
                                    metalness: 0.15,
                                    roughness: 0.3,
                                    envMapIntensity: 0.8
                                });
                            }
                            // 如果已经是StandardMaterial，保留原始材质参数（不强制覆盖）
                            else if (oldMaterial.isMeshStandardMaterial) {
                                // 只在未定义的情况下设置默认值，否则保留模型自带的值
                                if (oldMaterial.metalness === undefined) oldMaterial.metalness = 0.15;
                                if (oldMaterial.roughness === undefined) oldMaterial.roughness = 0.3;
                                if (oldMaterial.envMapIntensity === undefined) oldMaterial.envMapIntensity = 0.8;
                                oldMaterial.needsUpdate = true;
                            }
                        }
                    }
                });
                
                this.cube.add(gltf.scene);
                this.sceneManager.add(this.cube);
                
                // 使用之前计算的旋转后包围盒尺寸
                const rotatedSize = rotatedBox.getSize(new THREE.Vector3());
                this.cube.userData.size = rotatedSize;
                
                // 附加正/背面贴图平面
                this.attachTexturePlanesToModel(frontImageData, backImageData);
                resolve();
            }, (err) => {
                console.error('模型解析失败', err);
                // 回退为默认卡片
                this.createDefaultTexturedCard(frontImageData, backImageData).then(resolve);
            });
        });
    }
    
    /**
     * 为自定义模型附加纹理平面
     * @param {string} frontImageData - 正面图片数据
     * @param {string} backImageData - 背面图片数据
     */
    attachTexturePlanesToModel(frontImageData, backImageData) {
        // 清理现有平面
        this.cleanupTexturePlanes();
        
        const size = this.cube.userData.size || new THREE.Vector3(1, 1, 1);
        const dims = [
            { v: size.x, axis: 'x', idx: 0 },
            { v: size.y, axis: 'y', idx: 1 },
            { v: size.z, axis: 'z', idx: 2 }
        ].sort((a,b) => a.v - b.v);
        const shortest = dims[0];
        
        // 根据最短轴确定贴图平面的宽高
        let width, height;
        const offset = shortest.v / 2 + 0.001;
        
        if (shortest.idx === 2) {
            // Z轴最短 - 贴图在XY平面
            width = size.x;
            height = size.y;
        } else if (shortest.idx === 0) {
            // X轴最短 - 贴图在YZ平面
            width = size.z;
            height = size.y;
        } else {
            // Y轴最短 - 贴图在XZ平面
            width = size.x;
            height = size.z;
        }
        
        const geoFront = new THREE.PlaneGeometry(width, height);
        const geoBack = new THREE.PlaneGeometry(width, height);
        
        // 创建纹理副本
        const customFrontTexture = this.frontTexture.clone();
        customFrontTexture.needsUpdate = true;
        customFrontTexture.wrapS = THREE.RepeatWrapping;
        customFrontTexture.wrapT = THREE.RepeatWrapping;
        
        const customBackTexture = this.backTextureOriginal.clone();
        customBackTexture.needsUpdate = true;
        customBackTexture.wrapS = THREE.RepeatWrapping;
        customBackTexture.wrapT = THREE.RepeatWrapping;
        
        // 创建圆角遮罩，避免矩形图片在圆角模型上露出黑边
        const alphaMask = this.createRoundedCornerMask(0.03);
        
        const matFront = new THREE.MeshStandardMaterial({ 
            map: customFrontTexture,
            alphaMap: alphaMask,  // 添加圆角遮罩
            transparent: true, 
            side: THREE.DoubleSide,
            metalness: 0.15,
            roughness: 0.3,
            envMapIntensity: 0.8
        });
        const matBack = new THREE.MeshStandardMaterial({ 
            map: customBackTexture,
            alphaMap: alphaMask,  // 添加圆角遮罩
            transparent: true, 
            side: THREE.DoubleSide,
            metalness: 0.15,
            roughness: 0.3,
            envMapIntensity: 0.8
        });
        
        this.frontPlane = new THREE.Mesh(geoFront, matFront);
        this.backPlane = new THREE.Mesh(geoBack, matBack);
        
        // 启用阴影
        this.frontPlane.castShadow = true;
        this.frontPlane.receiveShadow = true;
        this.backPlane.castShadow = true;
        this.backPlane.receiveShadow = true;
        
        this.cube.add(this.frontPlane);
        this.cube.add(this.backPlane);
        
        // 根据最短轴放置贴图平面
        if (shortest.idx === 2) {
            // Z轴最短（厚度在Z方向）- 贴图在前后（±Z面）
            // 平面默认在XY平面，贴图U→X, V→Y
            // 正面和背面直接贴图，无翻转
            this.frontPlane.position.set(0, 0, offset);
            this.backPlane.position.set(0, 0, -offset);
            this.backPlane.rotateY(Math.PI);
        } else if (shortest.idx === 0) {
            // X轴最短（厚度在X方向）- 贴图在左右（±X面）
            // 平面旋转到YZ平面，此时贴图U→Z, V→Y
            // 正面和背面直接贴图，无翻转
            this.frontPlane.rotation.y = Math.PI / 2;
            this.frontPlane.position.set(offset, 0, 0);
            this.backPlane.rotation.y = -Math.PI / 2;
            this.backPlane.position.set(-offset, 0, 0);
        } else {
            // Y轴最短（厚度在Y方向）- 贴图在上下（±Y面）
            // 平面旋转到XZ平面，此时贴图U→X, V→Z
            // 正面和背面直接贴图，无翻转
            this.frontPlane.rotation.x = -Math.PI / 2;
            this.frontPlane.position.set(0, offset, 0);
            this.backPlane.rotation.x = Math.PI / 2;
            this.backPlane.position.set(0, -offset, 0);
        }
        
        this.frontPlane.renderOrder = 1;
        this.backPlane.renderOrder = 1;
    }
    
    /**
     * 清理纹理平面
     */
    cleanupTexturePlanes() {
        if (this.frontPlane) {
            if (this.frontPlane.parent) this.frontPlane.parent.remove(this.frontPlane);
            if (this.frontPlane.material) this.frontPlane.material.dispose();
            if (this.frontPlane.geometry) this.frontPlane.geometry.dispose();
            this.frontPlane = null;
        }
        if (this.backPlane) {
            if (this.backPlane.parent) this.backPlane.parent.remove(this.backPlane);
            if (this.backPlane.material) this.backPlane.material.dispose();
            if (this.backPlane.geometry) this.backPlane.geometry.dispose();
            this.backPlane = null;
        }
    }
    
    /**
     * 获取当前的立方体/模型对象
     * @returns {THREE.Object3D}
     */
    getCube() {
        return this.cube;
    }
    
    /**
     * 旋转模型
     * @param {number} deltaY - Y轴旋转增量
     */
    rotate(deltaY) {
        if (this.cube) {
            this.cube.rotation.y += deltaY;
        }
    }
    
    /**
     * 设置模型旋转
     * @param {number} y - Y轴旋转值
     */
    setRotation(y) {
        if (this.cube) {
            this.cube.rotation.y = y;
        }
    }
    
    /**
     * 获取模型旋转
     * @returns {number} Y轴旋转值
     */
    getRotationY() {
        return this.cube ? this.cube.rotation.y : 0;
    }
}




