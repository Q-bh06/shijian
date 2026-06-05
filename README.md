# 社会实践展示与交流网站原型

这是一个完整可运行的校园社会实践展示与交流平台原型，包含首页、项目库、项目详情、成果库、成果详情、活动广场、活动详情和报名系统。

## 运行方式

```bash
npm start
```

启动后访问：

```text
http://localhost:3000
```

## 功能

- 首页：网站介绍、最新项目、热门项目、活动通知。
- 项目库：展示“一日·一生”、支教项目、科创项目、调研项目。
- 项目详情：显示介绍、地点、成员、成果和招募状态。
- 成果库：按纪录片、推送文章、调研报告、摄影作品分类展示。
- 活动广场：展示农业专家讲座、渔业分享会、传统工艺体验。
- 报名系统：提交姓名、学号、联系方式、项目或活动。

## 后端接口

- `GET /api/projects`
- `GET /api/projects/:id`
- `GET /api/outcomes`
- `GET /api/outcomes/:id`
- `GET /api/activities`
- `GET /api/activities/:id`
- `GET /api/registration-options`
- `POST /api/register`
- `GET /api/registrations`

报名数据会保存到：

```text
data/registrations.json
```

## 扩展建议

- 将静态数组迁移到 SQLite、MySQL 或 MongoDB。
- 增加管理员登录、报名审核、成果上传和导出表格。
- 将 `POST /api/register` 接入邮件服务，实现报名通知。
