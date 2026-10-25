# Yuan Xinyi — Personal Website

一个简洁、可维护的中英双语个人主页，适用于 GitHub Pages。

## 文件结构

- `index.html`：页面内容、中文/英文文案、导航与项目卡片。
- `style.css`：所有颜色、间距、字体、卡片布局与响应式样式。
- `script.js`：中英文切换、当前年份、导航高亮。
- `images/`：放自己的照片、校园照和项目截图。

## 本地预览

直接用浏览器打开 `index.html` 即可。修改后保存并刷新浏览器。

## 发布到 GitHub Pages

1. 将这些文件放进 `Lingyee-Git.github.io` 仓库。
2. 提交并推送到 `main` 分支。
3. 仓库 Settings → Pages → Build and deployment 选择 `Deploy from a branch`。
4. 选择 `main` 分支和 `/ (root)` 目录并保存。

## 最需要修改的地方

### 1. 修改个人介绍
在 `index.html` 中搜索“统计学硕士在读”或 `Yuan Xinyi`，修改主标题与简介。

### 2. 更换照片
将个人照片放到 `images/` 文件夹并命名为 `profile.jpg`。推荐正方形图片。网页会自动用照片替换占位提示。

校园图片位置目前是提示框。若要添加校园照片，可将该区块替换成：
```html
<img class="campus-photo" src="images/campus.jpg" alt="校园照片">
```
并在 `style.css` 增加：
```css
.campus-photo {
  width: 100%;
  height: 118px;
  object-fit: cover;
  border-radius: 12px;
}
```

### 3. 更换项目图片
目前三张项目封面是 CSS 绘制的装饰图，不依赖外部图片。若有项目截图，可把某个 `.project-image` 区块替换为：
```html
<img class="project-photo" src="images/project-data.jpg" alt="数据分析项目截图">
```
并在 `style.css` 添加：
```css
.project-photo {
  width: 100%;
  height: 118px;
  object-fit: cover;
}
```
图片放入 `images/` 文件夹，文件名要与 `src` 一致。

### 4. 更新邮箱和简历
在 `index.html` 中搜索 `your.email@example.com` 并替换为希望公开的邮箱。
将 PDF 简历命名为 `resume.pdf` 放在仓库根目录；如果暂时没有简历，可以删除“查看简历”按钮。

### 5. 更新项目链接
在 `index.html` 搜索 `href="#"`，将其替换为真实的 GitHub 仓库、项目说明或演示链接。没有真实项目时可以先删除相应卡片，避免出现无效链接。

### 6. 修改中英文内容
每段需要切换语言的文字都使用：
```html
<span data-zh="中文内容" data-en="English text">中文内容</span>
```
切换按钮会读取 `data-zh` / `data-en`，不需要改 `script.js`。

### 7. 调整整体配色
打开 `style.css` 文件最上方的 `:root`，修改 `--blue`、`--ink`、`--page` 等变量即可调整全站主色和文字颜色。

## 发布前检查

- 替换邮箱与个人信息。
- 确认公开教育经历、照片和联系方式是自己愿意公开的内容。
- 检查项目链接，不要保留无效的 `#` 链接。
- 如果使用简历按钮，请上传 `resume.pdf`。
