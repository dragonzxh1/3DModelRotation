# API 接口文档

本文档详细说明了3D卡片翻转应用的所有可用API接口。

## 目录

- [主应用 (App)](#主应用-app)
- [场景管理器 (SceneManager)](#场景管理器-scenemanager)
- [模型管理器 (ModelManager)](#模型管理器-modelmanager)
- [上传管理器 (UploadManager)](#上传管理器-uploadmanager)
- [控制管理器 (ControlsManager)](#控制管理器-controlsmanager)
- [视频录制器 (VideoRecorder)](#视频录制器-videorecorder)
- [工具函数 (Utils)](#工具函数-utils)

---

## 主应用 (App)

主应用实例，整合所有模块。

### 导入

```javascript
import app from './main.js';
```

### 方法

#### `getSceneManager()`

获取场景管理器实例。

**返回值**: `SceneManager`

**示例**:
```javascript
const sceneManager = app.getSceneManager();
```

#### `getModelManager()`

获取模型管理器实例。

**返回值**: `ModelManager`

**示例**:
```javascript
const modelManager = app.getModelManager();
```

#### `getUploadManager()`

获取上传管理器实例。

**返回值**: `UploadManager`

**示例**:
```javascript
const uploadManager = app.getUploadManager();
```

#### `getControlsManager()`

获取控制管理器实例。

**返回值**: `ControlsManager`

**示例**:
```javascript
const controlsManager = app.getControlsManager();
```

#### `getVideoRecorder()`

获取视频录制器实例。

**返回值**: `VideoRecorder`

**示例**:
```javascript
const videoRecorder = app.getVideoRecorder();
```

---

## 场景管理器 (SceneManager)

管理Three.js场景、相机和渲染器。

### 属性

- `cameraDistance` - 当前相机距离
- `minDistance` - 最小相机距离（默认: 2）
- `maxDistance` - 最大相机距离（默认: 20）

### 方法

#### `add(object)`

将对象添加到场景中。

**参数**:
- `object` (THREE.Object3D) - 要添加的Three.js对象

**示例**:
```javascript
const cube = new THREE.Mesh(geometry, material);
sceneManager.add(cube);
```

#### `remove(object)`

从场景中移除对象。

**参数**:
- `object` (THREE.Object3D) - 要移除的Three.js对象

**示例**:
```javascript
sceneManager.remove(cube);
```

#### `render()`

渲染场景。通常在动画循环中自动调用。

**示例**:
```javascript
sceneManager.render();
```

#### `adjustCameraDistance(delta)`

调整相机距离。

**参数**:
- `delta` (number) - 距离变化量（正值拉远，负值拉近）

**示例**:
```javascript
sceneManager.adjustCameraDistance(1);  // 拉远1个单位
sceneManager.adjustCameraDistance(-1); // 拉近1个单位
```

#### `getScene()`

获取Three.js场景对象。

**返回值**: `THREE.Scene`

#### `getCamera()`

获取Three.js相机对象。

**返回值**: `THREE.PerspectiveCamera`

#### `getRenderer()`

获取Three.js渲染器对象。

**返回值**: `THREE.WebGLRenderer`

---

## 模型管理器 (ModelManager)

管理3D模型和纹理。

### 方法

#### `createRoundedCornerMask(cornerRadius)`

创建圆角遮罩纹理，用于避免矩形图片在圆角模型上露出黑边。

**参数**:
- `cornerRadius` (number, 可选) - 圆角半径（0-0.5之间），默认0.08

**返回值**: `THREE.CanvasTexture`

**示例**:
```javascript
const alphaMask = modelManager.createRoundedCornerMask(0.03);
```

**说明**:
- 此遮罩会应用到材质的 `alphaMap` 属性
- 较小的值（如0.03）产生较小的圆角，适合精细模型
- 较大的值（如0.08）产生更明显的圆角效果
- 自动应用于 `createTexturedCard()` 创建的材质

#### `createTexture(imageData, rotation, flipY, flipX)`

创建Three.js纹理。

**参数**:
- `imageData` (string) - 图片的Data URL
- `rotation` (number, 可选) - 旋转角度（弧度），默认0
- `flipY` (boolean, 可选) - 是否垂直翻转，默认false
- `flipX` (boolean, 可选) - 是否水平翻转，默认false

**返回值**: `THREE.Texture`

**示例**:
```javascript
const texture = modelManager.createTexture(imageData, 0, false, true);
```

#### `createDefaultCard()`

创建默认的3D卡片（无贴图）。

**示例**:
```javascript
modelManager.createDefaultCard();
```

#### `createTexturedCard(frontImageData, backImageData, modelFile)`

创建带纹理的3D卡片。

**参数**:
- `frontImageData` (string) - 正面图片的Data URL
- `backImageData` (string) - 背面图片的Data URL
- `modelFile` (File, 可选) - 自定义3D模型文件

**返回值**: `Promise<void>`

**示例**:
```javascript
await modelManager.createTexturedCard(
    'data:image/png;base64,...',
    'data:image/png;base64,...',
    null
);
```

**技术说明**:
- 自动应用 **圆角遮罩**（cornerRadius = 0.03）解决图片黑边问题
- 遮罩通过 `alphaMap` 实现，使矩形图片完美贴合圆角3D模型
- 材质配置包括金属度（0.15）和粗糙度（0.7）优化

#### `getCube()`

获取当前的立方体/模型对象。

**返回值**: `THREE.Object3D`

**示例**:
```javascript
const cube = modelManager.getCube();
```

#### `rotate(deltaY)`

旋转模型。

**参数**:
- `deltaY` (number) - Y轴旋转增量（弧度）

**示例**:
```javascript
modelManager.rotate(0.1);  // 旋转0.1弧度
```

#### `setRotation(y)`

设置模型旋转角度。

**参数**:
- `y` (number) - Y轴旋转值（弧度）

**示例**:
```javascript
modelManager.setRotation(Math.PI);  // 设置为180度
```

#### `getRotationY()`

获取模型当前的Y轴旋转角度。

**返回值**: `number`

**示例**:
```javascript
const rotation = modelManager.getRotationY();
```

---

## 上传管理器 (UploadManager)

处理文件上传和3D卡片创建。

### 方法

#### `createCard(options)`

编程方式创建3D卡片（推荐使用此方法集成到其他应用）。

**参数**:
- `options` (Object) - 配置选项
  - `frontImageData` (string) - 正面图片Data URL（必需）
  - `backImageData` (string) - 背面图片Data URL（必需）
  - `modelFile` (File, 可选) - 自定义3D模型文件

**返回值**: `Promise<void>`

**示例**:
```javascript
await uploadManager.createCard({
    frontImageData: 'data:image/png;base64,...',
    backImageData: 'data:image/png;base64,...',
    modelFile: null
});
```

**错误处理**:
```javascript
try {
    await uploadManager.createCard({
        frontImageData: frontData,
        backImageData: backData
    });
} catch (error) {
    console.error('创建失败:', error);
}
```

---

## 控制管理器 (ControlsManager)

管理用户交互和模型控制。

### 方法

#### `setAutoRotate(auto)`

设置自动旋转模式。

**参数**:
- `auto` (boolean) - true为自动旋转，false为手动控制

**示例**:
```javascript
controlsManager.setAutoRotate(true);  // 开启自动旋转
controlsManager.setAutoRotate(false); // 关闭自动旋转
```

#### `isAutoRotate()`

获取当前是否为自动旋转模式。

**返回值**: `boolean`

**示例**:
```javascript
const isAuto = controlsManager.isAutoRotate();
```

#### `update()`

更新控制状态。此方法在动画循环中自动调用，通常不需要手动调用。

---

## 视频录制器 (VideoRecorder)

管理3D卡片旋转视频的录制和导出。

### 方法

#### `recordVideo(options)`

录制3D卡片旋转视频。

**参数**:
- `options` (Object, 可选) - 录制选项
  - `duration` (number) - 录制时长（毫秒），默认5000
  - `fps` (number) - 帧率，默认60
  - `bitrate` (number) - 码率（bps），默认5000000
  - `rotations` (number) - 旋转圈数，默认1

**返回值**: `Promise<void>`

**示例**:
```javascript
// 使用默认参数（5秒，60FPS，旋转1圈）
await videoRecorder.recordVideo();

// 自定义参数
await videoRecorder.recordVideo({
    duration: 10000,  // 10秒
    fps: 30,          // 30帧
    bitrate: 3000000, // 3 Mbps
    rotations: 2      // 旋转2圈
});
```

**说明**:
- 录制期间会自动停止自动旋转，录制完成后恢复
- 使用EaseInOut缓动函数使旋转更加平滑
- 视频自动下载为WebM格式
- 支持VP9/VP8编码（自动选择最佳可用编码）

#### `enableRecordButton()`

启用录制按钮（通常在创建卡片后调用）。

**示例**:
```javascript
videoRecorder.enableRecordButton();
```

#### `disableRecordButton()`

禁用录制按钮。

**示例**:
```javascript
videoRecorder.disableRecordButton();
```

#### `isSupported()`

检查浏览器是否支持视频录制。

**返回值**: `boolean`

**示例**:
```javascript
if (videoRecorder.isSupported()) {
    console.log('支持视频录制');
} else {
    console.log('不支持视频录制');
}
```

#### `getSupportedMimeType()`

获取支持的视频MIME类型。

**返回值**: `string`

**示例**:
```javascript
const mimeType = videoRecorder.getSupportedMimeType();
console.log('支持的格式:', mimeType);
```

#### `getRecordingState()`

获取当前录制状态。

**返回值**: `boolean`

**示例**:
```javascript
const isRecording = videoRecorder.getRecordingState();
```

#### `stopRecording()`

停止当前录制。

**示例**:
```javascript
videoRecorder.stopRecording();
```

---

## 工具函数 (Utils)

提供通用辅助函数。

### 导入

```javascript
import { 
    calculateAspectRatio, 
    readFileAsDataURL, 
    readFileAsArrayBuffer,
    createImagePreview,
    toggleElement,
    setButtonLoading
} from './utils.js';
```

### 函数

#### `calculateAspectRatio(imageData)`

计算图片的宽高比。

**参数**:
- `imageData` (string) - 图片的Data URL

**返回值**: `Promise<number>`

**示例**:
```javascript
const ratio = await calculateAspectRatio('data:image/png;base64,...');
console.log('宽高比:', ratio);
```

#### `readFileAsDataURL(file)`

读取文件为Data URL。

**参数**:
- `file` (File) - 文件对象

**返回值**: `Promise<string>`

**示例**:
```javascript
const fileInput = document.getElementById('myFile');
const file = fileInput.files[0];
const dataURL = await readFileAsDataURL(file);
```

#### `readFileAsArrayBuffer(file)`

读取文件为ArrayBuffer。

**参数**:
- `file` (File) - 文件对象

**返回值**: `Promise<ArrayBuffer>`

**示例**:
```javascript
const arrayBuffer = await readFileAsArrayBuffer(file);
```

#### `createImagePreview(dataURL, container)`

创建图片预览。

**参数**:
- `dataURL` (string) - 图片的Data URL
- `container` (HTMLElement) - 预览容器元素

**示例**:
```javascript
const container = document.getElementById('preview');
createImagePreview('data:image/png;base64,...', container);
```

#### `toggleElement(element, show)`

显示或隐藏元素。

**参数**:
- `element` (HTMLElement) - 要操作的元素
- `show` (boolean) - true显示，false隐藏

**示例**:
```javascript
const section = document.getElementById('mySection');
toggleElement(section, true);  // 显示
toggleElement(section, false); // 隐藏
```

#### `setButtonLoading(button, loading, normalText, loadingText)`

设置按钮的加载状态。

**参数**:
- `button` (HTMLButtonElement) - 按钮元素
- `loading` (boolean) - 是否为加载状态
- `normalText` (string, 可选) - 正常状态文本，默认"创建3D卡片"
- `loadingText` (string, 可选) - 加载状态文本，默认"创建中..."

**示例**:
```javascript
const btn = document.getElementById('uploadBtn');
setButtonLoading(btn, true);  // 设置为加载中
setButtonLoading(btn, false); // 恢复正常
```

---

## 完整使用示例

### 示例1: 基本用法

```javascript
import app from './main.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
    // 获取管理器
    const uploadManager = app.getUploadManager();
    
    // 创建3D卡片
    await uploadManager.createCard({
        frontImageData: 'data:image/png;base64,...',
        backImageData: 'data:image/png;base64,...'
    });
    
    // 设置自动旋转
    app.getControlsManager().setAutoRotate(true);
});
```

### 示例2: 从文件输入创建卡片

```javascript
import app from './main.js';
import { readFileAsDataURL } from './utils.js';

async function handleFiles(frontFile, backFile) {
    // 读取文件
    const frontData = await readFileAsDataURL(frontFile);
    const backData = await readFileAsDataURL(backFile);
    
    // 创建卡片
    await app.getUploadManager().createCard({
        frontImageData: frontData,
        backImageData: backData
    });
}

// 使用
const frontInput = document.getElementById('frontImage');
const backInput = document.getElementById('backImage');

document.getElementById('createBtn').addEventListener('click', () => {
    handleFiles(frontInput.files[0], backInput.files[0]);
});
```

### 示例3: 高级控制

```javascript
import app from './main.js';

// 创建卡片后进行控制
async function createAndControl() {
    await app.getUploadManager().createCard({
        frontImageData: frontImageURL,
        backImageData: backImageURL
    });
    
    // 关闭自动旋转
    app.getControlsManager().setAutoRotate(false);
    
    // 手动旋转到指定角度
    app.getModelManager().setRotation(Math.PI / 4); // 45度
    
    // 调整相机距离
    app.getSceneManager().adjustCameraDistance(3);
    
    // 3秒后恢复自动旋转
    setTimeout(() => {
        app.getControlsManager().setAutoRotate(true);
    }, 3000);
}
```

### 示例4: 视频录制

```javascript
import app from './main.js';

async function createCardAndRecord(frontData, backData) {
    // 创建卡片
    await app.getUploadManager().createCard({
        frontImageData: frontData,
        backImageData: backData
    });
    
    // 启用录制按钮
    app.getVideoRecorder().enableRecordButton();
    
    // 自动开始录制（可选）
    await app.getVideoRecorder().recordVideo({
        duration: 5000,  // 5秒
        fps: 60,         // 60帧
        bitrate: 5000000 // 5 Mbps
    });
    
    console.log('视频已保存');
}
```

### 示例5: 错误处理

```javascript
import app from './main.js';

async function createCardSafely(frontData, backData) {
    try {
        await app.getUploadManager().createCard({
            frontImageData: frontData,
            backImageData: backData
        });
        console.log('3D卡片创建成功');
    } catch (error) {
        console.error('创建失败:', error);
        alert('创建3D卡片失败，请重试');
    }
}
```

### 示例6: 自定义圆角遮罩

如果需要调整圆角大小，可以修改 `model.js` 中的圆角半径：

```javascript
// 在 model.js 的 createTexturedCard() 方法中
const alphaMask = this.createRoundedCornerMask(0.03);  // 调整这个值

// 0.03 - 小圆角（推荐，适合精细模型）
// 0.05 - 中等圆角
// 0.08 - 大圆角（默认值）
```

**效果对比**:
- **0.03**: 最小圆角，最大限度保留图片内容，适合圆角较小的3D模型
- **0.08**: 较大圆角，更安全但会裁切更多图片边缘
- **0.00**: 无圆角（不推荐），会在圆角模型上产生黑边

---

## 常见问题

### Q1: 如何修改旋转速度？

在 `controls.js` 的 `update()` 方法中修改：
```javascript
this.modelManager.rotate(0.01);  // 修改这个数值
```

### Q2: 如何修改相机的默认距离？

在 `scene.js` 的构造函数中修改：
```javascript
this.cameraDistance = 6;  // 修改默认距离
this.minDistance = 2;     // 修改最小距离
this.maxDistance = 20;    // 修改最大距离
```

### Q3: 如何在卡片创建完成后执行操作？

```javascript
await app.getUploadManager().createCard({...});
// 卡片创建完成，可以执行后续操作
console.log('卡片已创建完成');
```

### Q4: 如何加载自定义3D模型？

```javascript
const modelFile = document.getElementById('modelInput').files[0];
await app.getUploadManager().createCard({
    frontImageData: frontData,
    backImageData: backData,
    modelFile: modelFile  // 传入GLB/GLTF文件
});
```

### Q5: 为什么图片贴到3D模型上有黑边？

这是因为矩形图片贴到圆角3D模型上时，四角会露出模型的黑色背景。项目已经通过 **Alpha遮罩技术** 解决了这个问题：

- 自动应用圆角遮罩（默认 cornerRadius = 0.03）
- 遮罩使图片边缘透明化，完美贴合圆角模型
- 无需手动处理，`createTexturedCard()` 会自动应用

如果仍有黑边，可以增大圆角半径值（如从 0.03 改为 0.05）。

### Q6: 如何调整圆角遮罩的大小？

在 `model.js` 的 `createTexturedCard()` 方法中修改：

```javascript
const alphaMask = this.createRoundedCornerMask(0.05);  // 从0.03改为0.05
```

**建议值**:
- **0.03** - 适合圆角较小的模型（当前默认）
- **0.05** - 适合中等圆角的模型
- **0.08** - 适合大圆角的模型

---

## 版本信息

- **当前版本**: 1.0.0
- **Three.js版本**: 0.128.0
- **最后更新**: 2025-10

### 关键特性

✅ **Alpha遮罩技术** - 解决圆角模型上的图片黑边问题  
✅ **自适应圆角** - 可调节圆角半径（0.03 默认，适合精细模型）  
✅ **模块化架构** - 清晰的代码组织和API设计  
✅ **完整的3D控制** - 自动/手动旋转、相机距离调节  
✅ **自定义模型支持** - 可加载GLB/GLTF格式的3D模型



