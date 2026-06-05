const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const REGISTRATION_FILE = path.join(DATA_DIR, "registrations.json");

const projects = [
  {
    id: "one-day-one-life",
    title: "一日·一生",
    category: "生命教育",
    summary: "走进基层社区与乡村家庭，用一天的陪伴理解不同人生经验。",
    description:
      "“一日·一生”项目鼓励学生以访谈、陪伴、记录的方式参与社区服务，关注老年人、留守儿童和基层劳动者的日常生活，形成兼具温度与思考的实践成果。",
    location: "浙江省湖州市安吉县",
    members: ["陈雨桐", "李明哲", "王思源", "赵清"],
    outcomes: ["人物访谈短片 3 部", "实践札记 18 篇", "社区服务时长 120 小时"],
    status: "报名中",
    cover: "images/project-community.svg"
  },
  {
    id: "teaching-support",
    title: "支教项目",
    category: "教育帮扶",
    summary: "为乡村学校提供课程支持、兴趣课堂和成长陪伴。",
    description:
      "支教项目面向师范、中文、艺术、体育等方向学生招募志愿者，围绕阅读、科学启蒙、心理陪伴和素质拓展开展连续服务。",
    location: "贵州省黔东南苗族侗族自治州",
    members: ["刘思琪", "周航", "何佳宁", "马子昂"],
    outcomes: ["暑期课程包 12 套", "学生成长档案 46 份", "校园墙绘 1 组"],
    status: "报名中",
    cover: "images/project-teaching.svg"
  },
  {
    id: "innovation-tech",
    title: "科创项目",
    category: "科技服务",
    summary: "用低成本技术方案回应乡村治理、农业生产和校园服务问题。",
    description:
      "科创项目组织学生把传感器、数据可视化、智能硬件和小程序原型带到真实场景中测试，强调可复制、可维护、可持续的技术服务。",
    location: "江苏省南京市浦口区",
    members: ["许亦辰", "唐婧", "沈南", "郭一帆"],
    outcomes: ["温湿度监测原型 2 套", "数据看板 1 个", "专利申报材料 1 份"],
    status: "已结束",
    cover: "images/project-innovation.svg"
  },
  {
    id: "field-research",
    title: "调研项目",
    category: "社会观察",
    summary: "围绕乡村振兴、非遗传承和青年就业开展专题调研。",
    description:
      "调研项目训练学生完成选题、访谈、问卷、资料整理和报告写作，最终产出可供学院、社区或合作单位参考的实践报告。",
    location: "福建省泉州市晋江市",
    members: ["郑书予", "孙悦", "黄嘉树", "林墨"],
    outcomes: ["问卷样本 328 份", "深度访谈 21 人", "调研报告 1 份"],
    status: "已结束",
    cover: "images/project-research.svg"
  }
];

const outcomes = [
  {
    id: "documentary-village-day",
    title: "村落的一天",
    category: "纪录片",
    summary: "记录乡村清晨集市、课堂与夜晚广场的生活切片。",
    author: "影像实践小组",
    related: "一日·一生",
    detail:
      "影片以 18 分钟短纪录片形式呈现村落生活节奏，重点关注代际关系、公共空间和青年返乡创业。"
  },
  {
    id: "article-craft-memory",
    title: "指尖上的传统工艺",
    category: "推送文章",
    summary: "以图文方式呈现竹编、蓝染和木版年画的传承故事。",
    author: "非遗观察小组",
    related: "调研项目",
    detail:
      "文章整合采访摘录、工艺流程图和学生体验记录，适合在学院公众号发布。"
  },
  {
    id: "report-rural-education",
    title: "乡村课后服务调研报告",
    category: "调研报告",
    summary: "分析乡村学校课后服务资源、师资压力与学生需求。",
    author: "教育调研小组",
    related: "支教项目",
    detail:
      "报告基于问卷和访谈材料，提出课程资源共享、志愿者培训和连续跟踪机制三项建议。"
  },
  {
    id: "photo-fishing-harbor",
    title: "港口晨光",
    category: "摄影作品",
    summary: "展示渔港劳动场景、海产品交易和社区互助网络。",
    author: "摄影记录小组",
    related: "渔业分享会",
    detail:
      "作品以组照方式呈现渔港一天的工作节奏，可用于成果展板和线上影像展。"
  }
];

const activities = [
  {
    id: "agriculture-lecture",
    title: "农业专家讲座",
    type: "专题讲座",
    date: "2026-06-12 14:30",
    place: "学生活动中心 B201",
    summary: "邀请农业技术推广专家分享智慧农业与青年实践选题。",
    detail:
      "讲座将介绍作物监测、农产品品牌建设和乡村实践中的调研伦理，并开放现场问答。"
  },
  {
    id: "fishery-sharing",
    title: "渔业分享会",
    type: "经验交流",
    date: "2026-06-18 19:00",
    place: "图书馆报告厅",
    summary: "渔业合作社负责人和学生实践队共同交流海洋社区观察。",
    detail:
      "分享会包含实践队成果展示、合作社案例讲解和暑期调研招募说明。"
  },
  {
    id: "traditional-craft",
    title: "传统工艺体验",
    type: "工作坊",
    date: "2026-06-25 15:00",
    place: "美育中心 103",
    summary: "体验竹编基础技法，理解非遗项目的社区传承方式。",
    detail:
      "工作坊限额 30 人，现场提供材料包，参与者可将体验记录纳入实践成果。"
  }
];

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(REGISTRATION_FILE)) {
    fs.writeFileSync(REGISTRATION_FILE, "[]\n", "utf8");
  }
}

function readRegistrations() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(REGISTRATION_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveRegistrations(registrations) {
  ensureStorage();
  fs.writeFileSync(REGISTRATION_FILE, JSON.stringify(registrations, null, 2), "utf8");
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
  };
  return types[ext] || "application/octet-stream";
}

function serveStatic(req, res, pathname) {
  let requestedPath = pathname === "/" ? "/index.html" : pathname;
  requestedPath = decodeURIComponent(requestedPath);

  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (fallbackError, fallbackData) => {
        if (fallbackError) {
          sendText(res, 404, "Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(fallbackData);
      });
      return;
    }

    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  });
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/projects") {
    sendJson(res, 200, projects);
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/projects/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/projects/", ""));
    const project = projects.find((item) => item.id === id);
    sendJson(res, project ? 200 : 404, project || { message: "Project not found" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/outcomes") {
    sendJson(res, 200, outcomes);
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/outcomes/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/outcomes/", ""));
    const outcome = outcomes.find((item) => item.id === id);
    sendJson(res, outcome ? 200 : 404, outcome || { message: "Outcome not found" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/activities") {
    sendJson(res, 200, activities);
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/activities/")) {
    const id = decodeURIComponent(url.pathname.replace("/api/activities/", ""));
    const activity = activities.find((item) => item.id === id);
    sendJson(res, activity ? 200 : 404, activity || { message: "Activity not found" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/registration-options") {
    const options = [
      ...projects.map((item) => ({ id: `project:${item.id}`, name: item.title, type: "项目" })),
      ...activities.map((item) => ({ id: `activity:${item.id}`, name: item.title, type: "活动" }))
    ];
    sendJson(res, 200, options);
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/register") {
    try {
      const rawBody = await readBody(req);
      const payload = JSON.parse(rawBody || "{}");
      const name = String(payload.name || "").trim();
      const studentId = String(payload.studentId || "").trim();
      const contact = String(payload.contact || "").trim();
      const target = String(payload.target || "").trim();

      if (!name || !studentId || !contact || !target) {
        sendJson(res, 400, { message: "请完整填写姓名、学号、联系方式和报名项目或活动。" });
        return;
      }

      const registrations = readRegistrations();
      const record = {
        id: `reg-${Date.now()}`,
        name,
        studentId,
        contact,
        target,
        submittedAt: new Date().toISOString()
      };

      registrations.push(record);
      saveRegistrations(registrations);
      sendJson(res, 201, { message: "报名信息已提交。", registration: record });
    } catch (error) {
      sendJson(res, 400, { message: "提交失败，请检查表单内容。" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/registrations") {
    sendJson(res, 200, readRegistrations());
    return;
  }

  sendJson(res, 404, { message: "API endpoint not found" });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url);
    return;
  }

  serveStatic(req, res, url.pathname);
});

ensureStorage();
server.listen(PORT, () => {
  console.log(`Social practice prototype is running at http://localhost:${PORT}`);
});
