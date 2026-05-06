# HelloRUC Tongzhou

面向参访者、新生和国际友人的中国人民大学通州校区导览网站。项目主体为静态前端，可部署到 GitHub Pages 或 Vercel；智能问答可选择接入同源 Node 后端或 Vercel API。

## 项目内容

- 校园地图导览
  - 使用 `通州校区建筑/通州校区手绘地图.jpg` 作为主地图
  - 在地图上叠加可点击建筑标记，当前只标注 `通州校区建筑/已有建筑实景/` 中已有实景资料的建筑
  - 点击标记后联动左侧建筑介绍、实景图片和建筑索引
  - 光标悬停或键盘聚焦地图标记时，会显示对应建筑小图并向上浮动放大
  - 已按手绘地图中的建筑名称和红色虚线指示重新校准 18 个实景建筑坐标
  - 地图支持放大、缩小、复位和拖拽浏览，移动端可更精细查看局部区域

- 校园建筑索引
  - 读取 `通州校区建筑/已有建筑实景/` 中的建筑图片
  - 读取各建筑 `简介/cn|en|es|fr|ge|ja|ru.txt` 多语种文本
  - 只展示已有实景资料的建筑，不展示仅有地图小图但暂无实景资料的地点
  - 支持按建筑类型筛选和关键词搜索
  - 对缺失图片、缺失文本做前端回退，避免页面空白或报错

- 智能问答助手
  - 支持围绕首次参访、新生报到、餐饮、酒店、校史展、VR 和志愿者服务进行快速回答
  - 前端会优先请求同源 `/api/chat`，无后端或未配置 API Key 时自动退回页面资料回答
  - 后端通过 `OPENAI_API_KEY`、`OPENAI_MODEL`、`OPENAI_BASE_URL` 环境变量接入大模型 API
  - 提供常见问题按钮，也支持访客自行输入关键词提问

- 参访路线
  - 提供首次参访、学习生活、文化参观三条路线
  - 路线节点会联动校园地图中已有实景资料的建筑焦点

- 博物馆与 VR 体验
  - 使用 `通州校区博物馆/` 中的概述、校史展、线上 VR 体验资料
  - 支持中文、英文、日语、西语、法语、德语、俄语文本切换
  - 校史展使用博物馆图片作为背景和分层内容，避免简单横向堆砌
  - VR 页面截图与二维码分区展示，二维码不再混入实景截图列表

- 餐饮与酒店
  - 使用 `通州校区附近餐饮及酒店/餐饮/` 中的餐厅图片
  - 使用 `通州校区附近餐饮及酒店/酒店/` 中的酒店图片、地址、电话、备注、链接等资料
  - 空字段会显示“资料待补充”，避免页面出现空白

- 志愿者服务
  - 使用 `通州校区志愿者/` 中的志愿者照片和简介
  - 展示 `HelloRUC志愿者群聊.jpg` 作为咨询入口，页面文案面向访客表达

- 视觉设计
  - 参考 `设计图1.jpg` 的红色半透明服务入口与校园建筑实景背景
  - 参考 `设计图2.jpg` 的圆形导航、地图与介绍分区结构
  - 使用人大红、砖红、绿色点缀和纸感背景，保持校园导览场景的正式与活力

## 目录结构

- [index.html](/Users/chen/Desktop/人大通州/index.html)：页面结构
- [styles.css](/Users/chen/Desktop/人大通州/styles.css)：页面样式、响应式布局、动画
- [app.js](/Users/chen/Desktop/人大通州/app.js)：交互逻辑、搜索筛选、地图联动、语言切换、智能问答
- [site-data.js](/Users/chen/Desktop/人大通州/site-data.js)：由本地素材整理出的页面数据
- [server.js](/Users/chen/Desktop/人大通州/server.js)：本地 Node 静态服务与 `/api/chat` 问答接口
- [api/chat.js](/Users/chen/Desktop/人大通州/api/chat.js)：Vercel API 问答入口
- [lib/assistant-service.js](/Users/chen/Desktop/人大通州/lib/assistant-service.js)：大模型问答服务封装
- [scripts/refresh_site_data.py](/Users/chen/Desktop/人大通州/scripts/refresh_site_data.py)：素材扫描与 `site-data.js` 生成脚本
- [package.json](/Users/chen/Desktop/人大通州/package.json)：本地脚本入口
- [.env.example](/Users/chen/Desktop/人大通州/.env.example)：问答后端环境变量示例
- [.github/workflows/pages.yml](/Users/chen/Desktop/人大通州/.github/workflows/pages.yml)：GitHub Pages 自动部署工作流
- [vercel.json](/Users/chen/Desktop/人大通州/vercel.json)：Vercel 静态部署配置

## 本地运行

静态预览：

```bash
cd "/Users/chen/Desktop/人大通州"
python3 -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
```

如需启用同源智能问答后端，先安装 Node.js，然后手动设置 API Key：

```bash
cd "/Users/chen/Desktop/人大通州"
OPENAI_API_KEY="你的 API Key" OPENAI_MODEL="gpt-4o-mini" npm start
```

浏览器同样打开：

```text
http://localhost:8000
```

## 数据维护

当前 `site-data.js` 仍保留为静态数据文件。新增或删除素材后，可运行辅助脚本重新扫描建筑、博物馆、餐饮、酒店、志愿者和多语种文本，并刷新统计计数：

```bash
python3 scripts/refresh_site_data.py
```

脚本会只读取 `通州校区建筑/已有建筑实景/` 中有实景资料的建筑；18 个地图坐标维护在脚本的 `POSITION_OVERRIDES` 中。

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
- 完成 18 个实景建筑坐标校准，坐标参考手绘地图中的建筑名称和红色虚线指示
- 完成地图标记小图悬浮预览动画
- 完成地图缩放、复位和拖拽浏览
- 完成仅展示已有实景建筑的建筑搜索与类型筛选
- 完成可接入后端大模型 API 的智能问答助手，并保留无后端时的页面资料回答
- 完成博物馆和建筑介绍的多语种读取
- 完成校史展层次化背景展示，以及 VR 截图与二维码分区展示
- 完成面向访客的页面文案优化
- 完成缺图、缺文本、空字段的前端回退
- 完成 `site-data.js` 完整素材扫描生成脚本
- 完成 GitHub Pages 与 Vercel 的静态部署配置

## 后续改进方向

- 继续补充真实报到政策、开放时间、预约方式等可更新资料源，并定期校验内容有效性
- 为 GitHub Pages 场景补充外部问答服务地址配置；GitHub Pages 只能托管静态前端，不能运行同源 Node API
- 如手绘地图后续更新，需要重新校准 `POSITION_OVERRIDES` 中的建筑坐标
