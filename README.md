# HelloRUC Tongzhou

面向参访者、新生和国际友人的中国人民大学通州校区导览网站。项目采用纯静态前端实现，可直接部署到 GitHub Pages 或 Vercel。

## 项目内容

- 校园地图导览
  - 使用 `通州校区建筑/通州校区手绘地图.jpg` 作为主地图
  - 在地图上叠加可点击建筑标记，当前只标注 `通州校区建筑/已有建筑实景/` 中已有实景资料的建筑
  - 点击标记后联动左侧建筑介绍、实景图片和建筑索引
  - 光标悬停或键盘聚焦地图标记时，会显示对应建筑小图并向上浮动放大
  - 手绘地图按容器宽度等比例缩放，桌面端无需横向或纵向滑动即可浏览完整地图

- 校园建筑索引
  - 读取 `通州校区建筑/已有建筑实景/` 中的建筑图片
  - 读取各建筑 `简介/cn|en|es|fr|ge|ja|ru.txt` 多语种文本
  - 支持按建筑类型筛选和关键词搜索
  - 对缺失图片、缺失文本做前端回退，避免页面空白或报错

- AI 问答助手
  - 增加本地知识库式问答模块
  - 支持围绕首次参访、新生报到、餐饮、酒店、校史展、VR 和志愿者服务进行快速回答
  - 提供常见问题按钮，也支持访客自行输入关键词提问

- 参访路线
  - 提供首次参访、学习生活、文化参观三条路线
  - 路线节点会联动校园地图中已有实景资料的建筑焦点

- 博物馆与 VR 体验
  - 使用 `通州校区博物馆/` 中的概述、校史展、线上 VR 体验资料
  - 支持中文、英文、日语、西语、法语、德语、俄语文本切换
  - 展示校史展图片、VR 页面截图和 VR 二维码

- 餐饮与酒店
  - 使用 `通州校区附近餐饮及酒店/餐饮/` 中的餐厅图片
  - 使用 `通州校区附近餐饮及酒店/酒店/` 中的酒店图片、地址、电话、备注、链接等资料
  - 餐饮资料中当前为空的字段会显示“资料待补充”

- 志愿者服务
  - 使用 `通州校区志愿者/` 中的志愿者照片和简介
  - 展示 `HelloRUC志愿者群聊.jpg` 作为咨询入口

- 视觉设计
  - 参考 `设计图1.jpg` 的红色半透明服务入口与校园建筑实景背景
  - 参考 `设计图2.jpg` 的圆形导航、地图与介绍分区结构
  - 使用人大红、砖红、绿色点缀和纸感背景，保持校园导览场景的正式与活力

## 目录结构

- [index.html](/Users/chen/Desktop/人大通州/index.html)：页面结构
- [styles.css](/Users/chen/Desktop/人大通州/styles.css)：页面样式、响应式布局、动画
- [app.js](/Users/chen/Desktop/人大通州/app.js)：交互逻辑、搜索筛选、地图联动、语言切换、AI 问答
- [site-data.js](/Users/chen/Desktop/人大通州/site-data.js)：由本地素材整理出的页面数据
- [scripts/refresh_site_data.py](/Users/chen/Desktop/人大通州/scripts/refresh_site_data.py)：数据计数刷新与素材一致性检查脚本
- [.github/workflows/pages.yml](/Users/chen/Desktop/人大通州/.github/workflows/pages.yml)：GitHub Pages 自动部署工作流
- [vercel.json](/Users/chen/Desktop/人大通州/vercel.json)：Vercel 静态部署配置

## 本地运行

```bash
cd "/Users/chen/Desktop/人大通州"
python3 -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
```

## 数据维护

当前 `site-data.js` 仍保留为静态数据文件。新增或删除素材后，可运行辅助脚本检查已有建筑目录、地图可标注建筑数量，并自动刷新统计计数：

```bash
python3 scripts/refresh_site_data.py
```

## GitHub Pages 部署

1. 将 `人大通州` 文件夹作为一个独立仓库推送到 GitHub。
2. 在 GitHub 仓库中进入 `Settings -> Pages`。
3. `Build and deployment` 选择 `GitHub Actions`。
4. 推送到 `main` 分支后，`.github/workflows/pages.yml` 会自动发布静态网站。

如果仓库名为 `HelloRUCTongzhou`，部署后的地址通常是：

```text
https://chensy-ruc.github.io/HelloRUCTongzhou/
```

## 已完成

- 完成校园导览首页、服务入口、地图、路线、建筑、博物馆、餐饮酒店、志愿者板块
- 完成 18 个已有实景建筑的地图标记与建筑详情联动
- 完成地图标记小图悬浮预览动画
- 完成地图自适应展示，桌面端无需滚动查看完整手绘地图
- 完成建筑搜索与类型筛选
- 完成 AI 问答助手模块
- 完成博物馆和建筑介绍的多语种读取
- 完成缺图、缺文本、空字段的前端回退
- 完成 `site-data.js` 统计刷新与素材一致性检查脚本
- 完成 GitHub Pages 与 Vercel 的静态部署配置

## 后续改进方向

- 继续根据手绘地图上的建筑名称微调 18 个已有实景建筑的百分比坐标
- 将 `scripts/refresh_site_data.py` 从统计刷新扩展为完整素材扫描生成器，自动读取新增建筑、餐饮、酒店、志愿者和多语种文本
- 将当前本地规则式 AI 问答升级为可接入大模型 API 的智能问答，并增加真实报到政策、开放时间等可更新资料源，api key由我手动在后端输入，你只需要搭建好前端以及后端的代码
- 为移动端地图增加更精细的缩放、拖拽和定位控制
