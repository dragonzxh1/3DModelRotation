/**
 * 视频录制模块
 * 负责录制3D卡片旋转动画并导出为视频文件
 */

export class VideoRecorder {
    constructor(sceneManager, modelManager, controlsManager) {
        this.sceneManager = sceneManager;
        this.modelManager = modelManager;
        this.controlsManager = controlsManager;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordButton = null;
    }
    
    /**
     * 初始化DOM元素引用
     * @param {Object} elements - DOM元素对象
     */
    initElements(elements) {
        this.recordButton = elements.recordButton;
        
        if (this.recordButton) {
            this.recordButton.addEventListener('click', () => {
                this.recordVideo();
            });
        }
    }
    
    /**
     * 启用录制按钮
     */
    enableRecordButton() {
        if (this.recordButton) {
            this.recordButton.disabled = false;
        }
    }
    
    /**
     * 禁用录制按钮
     */
    disableRecordButton() {
        if (this.recordButton) {
            this.recordButton.disabled = true;
        }
    }
    
    /**
     * 检查浏览器是否支持视频录制
     * @returns {boolean}
     */
    isSupported() {
        return typeof MediaRecorder !== 'undefined' && 
               typeof HTMLCanvasElement.prototype.captureStream !== 'undefined';
    }
    
    /**
     * 获取支持的视频MIME类型
     * @returns {string}
     */
    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        
        return 'video/webm';
    }
    
    /**
     * 录制视频
     * @param {Object} options - 录制选项
     * @param {number} options.duration - 录制时长（毫秒），默认5000
     * @param {number} options.fps - 帧率，默认60
     * @param {number} options.bitrate - 码率（bps），默认5000000
     * @param {number} options.rotations - 旋转圈数，默认1
     * @returns {Promise<void>}
     */
    async recordVideo(options = {}) {
        if (this.isRecording) {
            console.warn('录制已在进行中');
            return;
        }
        
        if (!this.isSupported()) {
            alert('您的浏览器不支持视频录制功能，请使用Chrome、Firefox或Edge浏览器。');
            return;
        }
        
        const cube = this.modelManager.getCube();
        if (!cube) {
            alert('请先创建3D卡片后再录制视频');
            return;
        }
        
        // 合并默认选项
        const config = {
            duration: 5000,
            fps: 60,
            bitrate: 5000000,
            rotations: 1,
            ...options
        };
        
        try {
            await this._performRecording(config);
        } catch (error) {
            console.error('录制失败:', error);
            alert('视频录制失败，请重试');
            this._resetRecordingState();
        }
    }
    
    /**
     * 执行录制
     * @private
     * @param {Object} config - 录制配置
     */
    async _performRecording(config) {
        // 设置录制状态
        this.isRecording = true;
        this._updateButtonState(true);
        
        // 保存当前状态
        const wasAutoRotating = this.controlsManager.isAutoRotate();
        this.controlsManager.setAutoRotate(false);
        
        const cube = this.modelManager.getCube();
        const startRotation = cube.rotation.y;
        const endRotation = startRotation + (Math.PI * 2 * config.rotations);
        
        // 获取Canvas和视频流
        const canvas = this.sceneManager.getRenderer().domElement;
        const stream = canvas.captureStream(config.fps);
        
        // 创建MediaRecorder
        const mimeType = this.getSupportedMimeType();
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: config.bitrate
        });
        
        // 监听数据
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };
        
        // 录制完成处理
        const recordingComplete = new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                this._saveVideo();
                resolve();
            };
        });
        
        // 开始录制
        this.mediaRecorder.start();
        
        // 执行旋转动画
        await this._animateRotation(startRotation, endRotation, config.duration);
        
        // 停止录制
        this.mediaRecorder.stop();
        await recordingComplete;
        
        // 恢复状态
        this.controlsManager.setAutoRotate(wasAutoRotating);
        this._resetRecordingState();
        
        alert('视频已保存！');
    }
    
    /**
     * 执行旋转动画
     * @private
     * @param {number} startRotation - 起始角度
     * @param {number} endRotation - 结束角度
     * @param {number} duration - 持续时间（毫秒）
     * @returns {Promise<void>}
     */
    _animateRotation(startRotation, endRotation, duration) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const cube = this.modelManager.getCube();
            
            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用EaseInOut缓动函数
                const easeProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                cube.rotation.y = startRotation + (endRotation - startRotation) * easeProgress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 额外等待一小段时间确保录制完整
                    setTimeout(resolve, 500);
                }
            };
            
            animate();
        });
    }
    
    /**
     * 保存视频
     * @private
     */
    _saveVideo() {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `3d-card-rotation-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * 更新按钮状态
     * @private
     * @param {boolean} recording - 是否正在录制
     */
    _updateButtonState(recording) {
        if (!this.recordButton) return;
        
        if (recording) {
            this.recordButton.textContent = '⏺️ 录制中...';
            this.recordButton.disabled = true;
            this.recordButton.style.backgroundColor = '#4CAF50';
            this.recordButton.style.animation = 'pulse 1.5s ease-in-out infinite';
        } else {
            this.recordButton.textContent = '🎬 生成视频';
            this.recordButton.disabled = false;
            this.recordButton.style.backgroundColor = '#f44336';
            this.recordButton.style.animation = 'none';
        }
    }
    
    /**
     * 重置录制状态
     * @private
     */
    _resetRecordingState() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this._updateButtonState(false);
    }
    
    /**
     * 获取录制状态
     * @returns {boolean}
     */
    getRecordingState() {
        return this.isRecording;
    }
    
    /**
     * 停止当前录制
     */
    stopRecording() {
        if (this.isRecording && this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
    }
}

