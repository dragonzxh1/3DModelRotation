# API 接口文档

本文档详细说明了3D卡片翻转应用的所有可用API接口。

## 目录

- [主应用 (App)](#主应用-app)
- [场景管理器 (SceneManager)](#场景管理器-scenemanager)
- [模型管理器 (ModelManager)](#模型管理器-modelmanager)
- [上传管理器 (UploadManager)](#上传管理器-uploadmanager)
- [控制管理器 (ControlsManager)](#控制管理器-controlsmanager)
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

#### `stop()`

停止动画循环。

**示例**:
```javascript
app.stop();
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

### 示例4: 错误处理

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

---

## 版本信息

- **当前版本**: 1.0.0
- **Three.js版本**: 0.128.0
- **最后更新**: 2025-10



