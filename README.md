# HelloRUC Tongzhou

面向参访者、新生和国际友人的中国人民大学通州校区导览网站。项目采用纯静态前端实现，可直接部署到 GitHub Pages 或 Vercel。

## 项目内容

- 校园地图导览
  - 使用 `通州校区建筑/通州校区手绘地图.jpg` 作为主地图
  - 在地图上叠加可点击建筑标记
  - 点击标记后联动左侧建筑介绍、实景图片和建筑索引
  - 已将 `通州校区建筑/地图建筑小图/` 中仅有小图、暂无实景照片的地点也纳入索引

- 校园建筑索引
  - 读取 `通州校区建筑/已有建筑实景/` 中的建筑图片
  - 读取各建筑 `简介/cn|en|es|fr|ge|ja|ru.txt` 多语种文本
  - 支持按建筑类型筛选和关键词搜索
  - 对缺失图片、缺失文本做前端回退，避免页面空白或报错

- 参访路线
  - 提供首次参访、学习生活、文化参观三条路线
  - 路线节点会联动校园地图中的建筑焦点

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

- [index.html](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/index.html)：页面结构
- [styles.css](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/styles.css)：页面样式、响应式布局、动画
- [app.js](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/app.js)：交互逻辑、搜索筛选、地图联动、语言切换
- [site-data.js](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/site-data.js)：由本地素材整理出的页面数据
- [.github/workflows/pages.yml](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/.github/workflows/pages.yml)：GitHub Pages 自动部署工作流
- [vercel.json](/Users/chen/Desktop/JD%20Cup/%E4%BA%BA%E5%A4%A7%E9%80%9A%E5%B7%9E/vercel.json)：Vercel 静态部署配置

## 本地运行

```bash
cd "/Users/chen/Desktop/JD Cup/人大通州"
python3 -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
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
- 完成 29 个校园地点的地图标记与建筑详情联动
- 完成建筑搜索与类型筛选
- 完成博物馆和建筑介绍的多语种读取
- 完成缺图、缺文本、空字段的前端回退
- 完成 GitHub Pages 与 Vercel 的静态部署配置

## 后续改进方向

- 继续补齐餐饮条目的地址、电话、人均、评分和营业时间
- 为地图标记进一步校准精确坐标
- 增加真实步行路线时长、无障碍路线和雨天路线
- 接入校园活动日历、报到流程和校内服务电话
- 增加 AI 问答模块，用于回答访客关于路线、报到、餐饮和校园服务的问题
- 将 `site-data.js` 的生成过程脚本化，方便后续新增素材后一键刷新数据
