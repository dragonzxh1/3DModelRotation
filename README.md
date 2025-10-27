# 3D卡片翻转效果 - 模块化版本

这是一个基于Three.js的3D卡片翻转效果应用，支持自定义图片贴图和3D模型加载。代码已完全模块化，便于集成和扩展。

> 🎉 **最新更新**：项目已完成模块化重构！渲染、相机、光照系统已独立成专门的模块，详见 [模块重构说明.md](模块重构说明.md)

## 📁 项目结构

```
3DModel/
├── index.html          # 主页面文件
├── 1.html              # 单文件版本（备用参考）
├── styles.css          # 样式文件
│
├── main.js             # 主入口文件
├── scene.js            # Three.js场景管理模块（重构版）
├── renderer.js         # 渲染器管理模块 ✨新增
├── camera.js           # 相机管理模块 ✨新增
├── lighting.js         # 光照系统模块 ✨新增
├── model.js            # 模型和纹理管理模块
├── upload.js           # 文件上传处理模块
├── controls.js         # 用户交互控制模块
├── utils.js            # 工具函数模块
│
├── tests/              # 测试文件目录 ✨新增
│   ├── README.md       # 测试说明
│   ├── test-modules.html      # 模块加载测试
│   ├── example-usage.html     # API使用示例
│   └── start-fresh.html       # 缓存清理工具
│
├── API.md                     # API接口文档
├── 故障排查指南.md             # 故障排查指南
├── 项目结构说明.md             # 详细项目结构
├── 模块重构说明.md             # 模块化重构说明
├── 清理记录.md                 # 文件清理记录
└── README.md                  # 项目说明（本文件）
```

## 🆕 重构亮点

本项目已完成重构，实现了更好的模块化架构：

### 独立的子系统
- **`renderer.js`** - 专注于WebGL渲染器配置和渲染操作
- **`camera.js`** - 专注于相机控制和视角管理
- **`lighting.js`** - 专注于光照系统和动态光效
- **`scene.js`** - 整合所有子系统，提供统一接口

### 优势
✅ **单一职责** - 每个模块只做一件事  
✅ **易于维护** - 代码结构清晰，便于定位问题  
✅ **可复用性** - 渲染器、相机模块可在其他项目中使用  
✅ **向后兼容** - 原有API完全不变  

详细信息请查看 [模块重构说明.md](模块重构说明.md)

## 🚀 快速开始

### 🔍 一键诊断（推荐）✨

如果不确定项目是否正常，先运行诊断：

1. **启动服务器**
```bash
cd C:\Users\Administrator\Desktop\3DModel
py -m http.server 8000
```

2. **访问诊断页面**
```
http://localhost:8000/tests/diagnostic.html
```
这个页面会自动检测所有模块和库是否正常加载。

3. **如果全部通过**，点击"前往主页"按钮开始使用！

### ⚠️ 重要：必须使用本地服务器

**不能直接双击打开HTML文件！** 由于使用了ES6模块，您必须通过HTTP服务器访问项目。

#### 方法1：使用Python（推荐）

在项目目录下运行：
```bash
py -m http.server 8000
# 注意：Windows上使用 py 命令
```
然后访问：`http://localhost:8000/index.html`

#### 方法2：使用Node.js

```bash
npx http-server -p 8000
```

#### 方法3：使用VS Code

安装"Live Server"扩展，然后右键HTML文件选择"Open with Live Server"

### 🆘 遇到启动问题？

- **[启动指南.md](启动指南.md)** - 详细的启动和排查步骤（含常见问题解决）
- **[tests/diagnostic.html](http://localhost:8000/tests/diagnostic.html)** - 自动诊断工具
- **[故障排查指南.md](故障排查指南.md)** - 完整的问题排查手册

---

### 1. 直接使用界面

启动服务器后，在浏览器中访问 `http://localhost:8000/index.html`：

1. 选择正面图片
2. 选择背面图片
3. （可选）选择自定义3D模型文件（.glb/.gltf格式）
4. 点击"创建3D卡片"按钮
5. 🎬 点击"生成视频"按钮可以录制卡片旋转一圈的视频（5秒，自动下载为WebM格式）

### 2. 作为模块集成

在你的JavaScript代码中引入和使用：

```javascript
// 引入主应用实例
import app from './main.js';

// 等待DOM加载完成后使用
document.addEventListener('DOMContentLoaded', () => {
    // 创建3D卡片（使用图片数据）
    app.getUploadManager().createCard({
        frontImageData: 'data:image/png;base64,...',  // 正面图片Data URL
        backImageData: 'data:image/png;base64,...',   // 背面图片Data URL
        modelFile: null  // 可选的3D模型文件对象
    });
});
```

## 📦 核心模块

### 渲染系统模块（重构后）

#### 1. RendererManager (renderer.js) ✨新增
负责WebGL渲染器的管理和配置
- 高质量渲染器初始化（抗锯齿、高精度）
- 阴影系统配置（PCF柔和阴影）
- 色调映射和颜色编码
- 物理正确的光照计算
- 性能监控接口

#### 2. CameraManager (camera.js) ✨新增
负责相机的创建和控制
- 透视相机初始化
- 相机距离控制（缩放）
- 距离范围限制
- 位置和朝向控制
- 视野角度调整

#### 3. LightingManager (lighting.js) ✨新增
负责光照系统和动态光效
- 6种光源系统（环境光、主光源、补光、背光、半球光、动态光）
- 动态光效算法（跟随旋转）
- 光照强度动态调整
- 高质量阴影配置

#### 4. SceneManager (scene.js) - 重构版
整合所有子系统，提供统一接口
- 场景创建和管理
- 子系统整合（渲染器、相机、光照）
- 统一的API接口
- 资源清理

### 业务逻辑模块

#### 5. ModelManager (model.js)
负责3D模型和纹理的管理
- 创建默认卡片
- 加载自定义3D模型
- 纹理贴图处理
- 模型旋转控制

#### 6. UploadManager (upload.js)
负责文件上传和处理
- 文件读取
- 图片预览
- 创建3D卡片的业务逻辑
- 提供编程接口

#### 7. ControlsManager (controls.js)
负责用户交互控制
- 自动/手动旋转切换
- 鼠标移动控制
- 滚轮缩放控制

#### 8. Utils (utils.js)
提供通用工具函数
- 图片宽高比计算
- 文件读取（Data URL / ArrayBuffer）
- DOM操作辅助函数

## 🔌 API接口

### 创建3D卡片

```javascript
// 方式1: 使用UploadManager
app.getUploadManager().createCard({
    frontImageData: '正面图片Data URL',
    backImageData: '背面图片Data URL',
    modelFile: null  // File对象或null
});

// 方式2: 直接使用ModelManager
const modelManager = app.getModelManager();
await modelManager.createTexturedCard(
    frontImageData,
    backImageData,
    modelFile  // File对象或null
);
```

### 控制旋转

```javascript
const controlsManager = app.getControlsManager();

// 设置自动旋转
controlsManager.setAutoRotate(true);

// 手动旋转
const modelManager = app.getModelManager();
modelManager.rotate(0.1);  // 旋转0.1弧度
```

### 调整相机

```javascript
const sceneManager = app.getSceneManager();

// 调整相机距离
sceneManager.adjustCameraDistance(1);  // 拉远1个单位
sceneManager.adjustCameraDistance(-1); // 拉近1个单位

// 高级用法：访问相机管理器
const cameraManager = sceneManager.getCameraManager();
cameraManager.setFOV(90);  // 设置视野角度
cameraManager.reset();     // 重置相机
```

### 访问子系统（高级用法）✨新增

```javascript
const sceneManager = app.getSceneManager();

// 访问渲染器管理器
const renderer = sceneManager.getRendererManager();
renderer.setExposure(1.5);      // 调整曝光度
renderer.getRenderInfo();        // 获取性能信息

// 访问相机管理器
const camera = sceneManager.getCameraManager();
camera.setFOV(90);               // 调整视野角度
camera.setDistanceRange(2, 30);  // 设置缩放范围

// 访问光照管理器
const lighting = sceneManager.getLightingManager();
lighting.setAmbientIntensity(1.0);           // 调整环境光
lighting.setDynamicLightsEnabled(false);     // 关闭动态光效
```

## 🎨 自定义配置

### 修改相机距离范围

在 `camera.js` 中修改，或通过API动态设置：

```javascript
// 方式1: 修改camera.js源码
this.minDistance = 2;   // 最小距离
this.maxDistance = 20;  // 最大距离

// 方式2: 通过API动态设置（推荐）✨
const cameraManager = app.getSceneManager().getCameraManager();
cameraManager.setDistanceRange(1, 30);
```

### 修改自动旋转速度

在 `controls.js` 的 `update()` 方法中修改：

```javascript
this.modelManager.rotate(0.01);  // 修改这个值改变旋转速度
```

### 修改光照效果✨新增

```javascript
const lighting = app.getSceneManager().getLightingManager();

// 调整环境光强度
lighting.setAmbientIntensity(1.2);

// 调整主光源强度
lighting.setDirectionalIntensity(1.5);

// 开关动态光效
lighting.setDynamicLightsEnabled(true);
```

### 修改渲染质量✨新增

```javascript
const renderer = app.getSceneManager().getRendererManager();

// 调整曝光度
renderer.setExposure(1.2);

// 开关阴影
renderer.setShadowsEnabled(true);
```

## 📝 使用示例

### 示例1: 从URL加载图片

```javascript
async function createCardFromURLs(frontURL, backURL) {
    // 将图片URL转换为Data URL
    const frontData = await urlToDataURL(frontURL);
    const backData = await urlToDataURL(backURL);
    
    await app.getUploadManager().createCard({
        frontImageData: frontData,
        backImageData: backData
    });
}

// 辅助函数: URL转Data URL
function urlToDataURL(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
}
```

### 示例2: 从Canvas获取图片

```javascript
function createCardFromCanvas(frontCanvas, backCanvas) {
    const frontData = frontCanvas.toDataURL('image/png');
    const backData = backCanvas.toDataURL('image/png');
    
    app.getUploadManager().createCard({
        frontImageData: frontData,
        backImageData: backData
    });
}
```

### 示例3: 动态切换旋转模式

```javascript
// 3秒后自动切换到手动模式
setTimeout(() => {
    app.getControlsManager().setAutoRotate(false);
}, 3000);
```

## 🎬 视频录制功能

### 功能说明

项目内置了视频录制功能，可以录制3D卡片旋转一圈的视频：

- **录制时长**：5秒（卡片完整旋转360度）
- **输出格式**：WebM（浏览器原生支持）
- **视频质量**：60 FPS，5 Mbps码率
- **自动下载**：录制完成后自动保存到本地

### 使用方法

1. 在界面上创建3D卡片后，"生成视频"按钮会自动启用
2. 点击"🎬 生成视频"按钮
3. 等待5秒，卡片会自动旋转一圈
4. 录制完成后自动下载视频文件

### 格式转换

WebM是浏览器标准视频格式，如需转换为MP4格式，可使用以下工具：

- **在线转换**：[CloudConvert](https://cloudconvert.com/)、[Online-Convert](https://www.online-convert.com/)
- **桌面软件**：VLC Media Player、HandBrake
- **命令行工具**：FFmpeg（`ffmpeg -i input.webm output.mp4`）

### 技术实现

- 使用 `canvas.captureStream(60)` 捕获Canvas画面
- 使用 `MediaRecorder API` 录制视频流
- 支持VP9/VP8编码（浏览器自动选择）
- 平滑的缓动动画（EaseInOut）

### 浏览器兼容性

视频录制功能需要浏览器支持 `MediaRecorder API`：
- ✅ Chrome 47+
- ✅ Firefox 25+
- ✅ Edge 79+
- ⚠️ Safari 14.1+（部分支持）

## 🌐 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

需要支持ES6模块（type="module"）

## ⚠️ 注意事项

1. 必须通过HTTP/HTTPS服务器访问，不能直接用 `file://` 协议打开（因为使用了ES6模块）
2. 如果需要加载外部图片，需要注意CORS跨域问题
3. 大尺寸的3D模型文件可能需要较长加载时间

## 🧪 测试

### 测试页面

我们提供了完整的测试套件，位于 `tests/` 目录：

```bash
# 启动服务器后访问以下页面

# 1. 模块加载测试（检查所有模块是否正常加载）
http://localhost:8000/tests/test-modules.html

# 2. API使用示例（查看各种API调用效果）
http://localhost:8000/tests/example-usage.html

# 3. 缓存清理工具（解决缓存问题）
http://localhost:8000/tests/start-fresh.html
```

详细测试说明请查看 [tests/README.md](tests/README.md)

## 🔧 开发建议

### 本地开发服务器

推荐使用以下方式之一启动本地服务器：

```bash
# 方式1: Python（Windows上使用 py 命令）
py -m http.server 8000

# 方式2: Node.js (需要安装http-server)
npx http-server -p 8000

# 方式3: VS Code Live Server扩展
# 直接右键index.html选择"Open with Live Server"
```

### 调试模式

在浏览器开发者工具中可以访问全局 `app` 对象：

```javascript
// 在控制台中直接调用
app.getModelManager().rotate(Math.PI);
app.getSceneManager().adjustCameraDistance(5);

// 访问子系统进行高级调试✨
const renderer = app.getSceneManager().getRendererManager();
console.log(renderer.getRenderInfo());  // 查看性能信息

const camera = app.getSceneManager().getCameraManager();
console.log(camera.getDistance());      // 查看当前相机距离
```

## 📚 相关文档

- **[API.md](API.md)** - 完整的API接口文档
- **[模块重构说明.md](模块重构说明.md)** - 模块化重构详细说明
- **[故障排查指南.md](故障排查指南.md)** - 常见问题和解决方案
- **[项目结构说明.md](项目结构说明.md)** - 详细的项目结构说明
- **[清理记录.md](清理记录.md)** - 文件清理和整理记录
- **[tests/README.md](tests/README.md)** - 测试文件说明


