# 🧪 测试文件目录

本目录包含所有测试和示例文件，用于验证功能和演示用法。

---

## 📁 文件说明

### 🔍 `diagnostic.html` - 项目诊断工具 ✨新增
**用途**：一键诊断项目所有模块和依赖的加载状态

**功能**：
- ✅ 自动检测Three.js和GLTFLoader
- ✅ 自动检测所有11个项目模块
- ✅ 显示详细的错误信息
- ✅ 提供快速跳转链接
- 🎯 **推荐：遇到启动问题时首先使用这个工具**

**使用方法**：
```bash
# 启动本地服务器后访问
http://localhost:8000/tests/diagnostic.html
```

**适用场景**：
- 🚀 首次启动项目，不确定是否正常
- 🐛 遇到启动问题，需要快速定位
- 🔧 修改代码后，验证模块是否正常
- 📦 清理缓存后，确认加载状态

---

### 1️⃣ `test-modules.html` - 模块加载测试
**用途**：测试所有JavaScript模块是否正确加载

**功能**：
- ✅ 测试Three.js CDN加载
- ✅ 测试GLTFLoader加载
- ✅ 测试所有自定义模块（utils、scene、model、upload、controls、main）
- ✅ 显示详细的测试结果

**使用方法**：
```bash
# 启动本地服务器后访问
http://localhost:8000/tests/test-modules.html
```

---

### 2️⃣ `example-usage.html` - API使用示例
**用途**：演示如何通过编程方式调用3D卡片API

**功能**：
- 📸 从URL创建3D卡片
- 🔄 控制卡片旋转（自动/手动/指定角度）
- 📷 调整相机距离（拉近/拉远/重置）
- ✨ 动画特效（翻转/旋转/缩放）

**示例代码**：
```javascript
// 创建卡片
await app.getUploadManager().createCard({
    frontImageData: frontData,
    backImageData: backData
});

// 控制旋转
app.getControlsManager().setAutoRotate(true);

// 调整相机
app.getSceneManager().adjustCameraDistance(-2);
```

---

### 3️⃣ `start-fresh.html` - 缓存清理工具
**用途**：清除浏览器缓存，解决缓存导致的问题

**功能**：
- 🗑️ 清除Service Worker缓存
- 🗑️ 清除Cache Storage
- 🗑️ 清除Local Storage和Session Storage
- 🚀 提供快速跳转到主页的按钮

**使用场景**：
- 更新代码后页面没有变化
- 出现奇怪的缓存问题
- 需要完全重置应用状态

---

## 🚀 快速开始

### 启动本地服务器
```bash
# 方法1：使用Python（推荐）
python -m http.server 8000

# 方法2：使用Node.js
npx http-server -p 8000

# 方法3：使用PHP
php -S localhost:8000
```

### 访问测试页面
- **🔍 项目诊断** ✨推荐：http://localhost:8000/tests/diagnostic.html
- **模块测试**：http://localhost:8000/tests/test-modules.html
- **API示例**：http://localhost:8000/tests/example-usage.html
- **清理缓存**：http://localhost:8000/tests/start-fresh.html

### 🎯 推荐工作流

**第一次使用项目？**
```
1. 启动服务器 → 2. 访问 diagnostic.html → 3. 全部通过后访问主页
```

**遇到问题？**
```
1. 访问 start-fresh.html 清理缓存 → 2. 访问 diagnostic.html 诊断 → 3. 根据错误提示解决
```

**开发调试？**
```
1. 修改代码 → 2. 访问 diagnostic.html 验证模块 → 3. 访问 example-usage.html 测试功能
```

---

## 📊 测试清单

### ✅ 必须通过的测试

1. **模块加载测试** (`test-modules.html`)
   - [ ] Three.js CDN加载成功
   - [ ] GLTFLoader加载成功
   - [ ] utils.js加载成功
   - [ ] renderer.js加载成功（新增）
   - [ ] camera.js加载成功（新增）
   - [ ] lighting.js加载成功（新增）
   - [ ] scene.js加载成功
   - [ ] model.js加载成功
   - [ ] upload.js加载成功
   - [ ] controls.js加载成功
   - [ ] main.js加载成功

2. **功能测试** (`example-usage.html`)
   - [ ] 创建3D卡片成功
   - [ ] 自动旋转正常工作
   - [ ] 手动控制正常工作
   - [ ] 相机缩放正常工作
   - [ ] 动画效果流畅

3. **缓存清理** (`start-fresh.html`)
   - [ ] 缓存清理成功
   - [ ] 强制刷新正常
   - [ ] 跳转功能正常

---

## 🐛 故障排查

### 问题1：模块加载失败
**解决方案**：
1. 检查是否启动了本地服务器
2. 确保使用 `http://` 或 `https://`，不要直接打开文件
3. 检查浏览器控制台的错误信息

### 问题2：功能不正常
**解决方案**：
1. 访问 `start-fresh.html` 清除缓存
2. 按 `Ctrl + Shift + R` 强制刷新
3. 检查是否有JavaScript错误

### 问题3：图片加载失败
**解决方案**：
1. 确保测试图片在项目根目录
2. 检查图片路径是否正确
3. 确认图片格式支持（JPG、PNG、WEBP）

---

## 📝 注意事项

1. **必须使用本地服务器**
   - ❌ 不要直接双击HTML文件打开
   - ✅ 必须通过HTTP协议访问
   - 原因：ES6模块需要HTTP协议

2. **浏览器兼容性**
   - ✅ Chrome 90+
   - ✅ Firefox 88+
   - ✅ Edge 90+
   - ✅ Safari 14+

3. **性能监控**
   - 打开浏览器开发者工具 (F12)
   - 查看Console标签页的性能信息
   - 监控内存使用和FPS

---

## 🔗 相关文档

- [项目主文档](../README.md)
- [API文档](../API.md)
- [故障排查指南](../故障排查指南.md)
- [模块重构说明](../模块重构说明.md)

---

**测试愉快！🎉**

