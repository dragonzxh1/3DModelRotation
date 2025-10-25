/**
 * 用户交互控制模块
 * 负责处理用户的鼠标、键盘等交互操作
 */

export class ControlsManager {
    constructor(modelManager, sceneManager) {
        this.modelManager = modelManager;
        this.sceneManager = sceneManager;
        this.isAutoRotating = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationY = 0;
        this.canvas = null;
        this.autoRotateBtn = null;
        this.manualRotateBtn = null;
    }
    
    /**
     * 初始化DOM元素引用
     * @param {Object} elements - DOM元素对象
     */
    initElements(elements) {
        this.canvas = elements.canvas;
        this.autoRotateBtn = elements.autoRotateBtn;
        this.manualRotateBtn = elements.manualRotateBtn;
        
        this.setupEventListeners();
        this.setAutoRotate(true);
    }
    
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 控制按钮
        this.autoRotateBtn.addEventListener('click', () => {
            this.setAutoRotate(true);
        });
        
        this.manualRotateBtn.addEventListener('click', () => {
            this.setAutoRotate(false);
        });
        
        // 鼠标移动控制
        this.canvas.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        // 鼠标滚轮缩放
        this.canvas.addEventListener('wheel', (event) => {
            this.handleWheel(event);
        });
    }
    
    /**
     * 设置自动旋转模式
     * @param {boolean} auto - 是否自动旋转
     */
    setAutoRotate(auto) {
        this.isAutoRotating = auto;
        
        if (auto) {
            this.autoRotateBtn.classList.add('active');
            this.manualRotateBtn.classList.remove('active');
        } else {
            this.autoRotateBtn.classList.remove('active');
            this.manualRotateBtn.classList.add('active');
        }
    }
    
    /**
     * 处理鼠标移动事件
     * @param {MouseEvent} event - 鼠标事件
     */
    handleMouseMove(event) {
        if (!this.isAutoRotating) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (event.clientX - rect.left) / rect.width;
            this.targetRotationY = (this.mouseX - 0.5) * Math.PI * 2;
        }
    }
    
    /**
     * 处理鼠标滚轮事件
     * @param {WheelEvent} event - 滚轮事件
     */
    handleWheel(event) {
        event.preventDefault();
        
        const zoomSpeed = 0.5;
        const delta = event.deltaY > 0 ? zoomSpeed : -zoomSpeed;
        
        this.sceneManager.adjustCameraDistance(delta);
    }
    
    /**
     * 更新控制（在动画循环中调用）
     */
    update() {
        if (!this.modelManager.getCube()) return;
        
        if (this.isAutoRotating) {
            // 自动旋转
            this.modelManager.rotate(0.01);
        } else {
            // 手动控制，平滑过渡
            const currentRotation = this.modelManager.getRotationY();
            const newRotation = currentRotation + (this.targetRotationY - currentRotation) * 0.1;
            this.modelManager.setRotation(newRotation);
        }
    }
    
    /**
     * 获取自动旋转状态
     * @returns {boolean}
     */
    isAutoRotate() {
        return this.isAutoRotating;
    }
}




