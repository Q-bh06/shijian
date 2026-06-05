const app = document.querySelector("#app");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");

const state = {
  projects: [],
  outcomes: [],
  activities: [],
  options: []
};

const fallbackData = {
  projects: [
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
  ],
  outcomes: [
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
  ],
  activities: [
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
  ]
};

const api = {
  projects: () => fetchJson("/api/projects"),
  project: (id) => fetchJson(`/api/projects/${encodeURIComponent(id)}`),
  outcomes: () => fetchJson("/api/outcomes"),
  outcome: (id) => fetchJson(`/api/outcomes/${encodeURIComponent(id)}`),
  activities: () => fetchJson("/api/activities"),
  activity: (id) => fetchJson(`/api/activities/${encodeURIComponent(id)}`),
  options: () => fetchJson("/api/registration-options"),
  register: (payload) =>
    fetchJson("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
};

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", () => {
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
});

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", async () => {
  await loadBaseData();
  render();
});

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "请求失败");
  }
  return data;
}

async function loadBaseData() {
  showLoading();
  try {
    const [projects, outcomes, activities, options] = await Promise.all([
      api.projects(),
      api.outcomes(),
      api.activities(),
      api.options()
    ]);
    state.projects = projects;
    state.outcomes = outcomes;
    state.activities = activities;
    state.options = options;
  } catch (error) {
    useFallbackData();
  }
}

function useFallbackData() {
  state.projects = fallbackData.projects;
  state.outcomes = fallbackData.outcomes;
  state.activities = fallbackData.activities;
  state.options = makeRegistrationOptions(fallbackData.projects, fallbackData.activities);
}

function makeRegistrationOptions(projects, activities) {
  return [
    ...projects.map((item) => ({ id: `project:${item.id}`, name: item.title, type: "项目" })),
    ...activities.map((item) => ({ id: `activity:${item.id}`, name: item.title, type: "活动" }))
  ];
}

function getRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const routeOnly = raw.split("?")[0];
  const parts = routeOnly ? routeOnly.split("/") : [];
  return {
    name: parts[0] || "home",
    id: parts[1] || ""
  };
}

function render() {
  const route = getRoute();
  setActiveNav(route.name);

  const views = {
    home: renderHome,
    projects: () => renderProjects(route.id),
    outcomes: () => renderOutcomes(route.id),
    activities: () => renderActivities(route.id),
    register: renderRegister
  };

  const view = views[route.name] || renderHome;
  view();
  app.focus({ preventScroll: true });
}

function setActiveNav(routeName) {
  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const isHome = routeName === "home" && href === "#/";
    link.classList.toggle("active", isHome || href === `#/${routeName}`);
  });
}

function showLoading() {
  const template = document.querySelector("#loading-template");
  app.innerHTML = "";
  app.append(template.content.cloneNode(true));
}

function renderHome() {
  const latestProjects = state.projects.slice(0, 3);
  const hotProjects = [...state.projects].sort((a, b) => a.title.localeCompare(b.title, "zh-CN")).slice(0, 3);

  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">2026 暑期社会实践</span>
        <h1>青年奔赴现场，让实践抵达真实生活。</h1>
        <p>从田野调研到支教课堂，从科创服务到社区陪伴，记录每一次走近社会的脚步，也把成果带回校园继续交流。</p>
        <div class="hero-actions">
          <a class="button primary" href="#/projects">浏览项目库</a>
          <a class="button secondary" href="#/register">立即报名</a>
        </div>
        <div class="hero-feature-row" aria-label="实践方向">
          <span>田野调研</span>
          <span>志愿服务</span>
          <span>青年共创</span>
        </div>
      </div>
      <aside class="hero-panel" aria-label="近期活动">
        <span class="panel-label">近期活动</span>
        <div class="list-panel">
          ${state.activities
            .slice(0, 2)
            .map((activity) => `<a class="list-item" href="#/activities/${activity.id}"><strong>${activity.title}</strong><span>${activity.date} · ${activity.place}</span></a>`)
            .join("")}
        </div>
      </aside>
    </section>

    <section class="home-overview" aria-label="平台概览">
      <div class="overview-inner">
        <div class="metric-grid">
          <div class="metric"><strong>${state.projects.length}</strong><span>实践项目</span></div>
          <div class="metric"><strong>${state.outcomes.length}</strong><span>成果类型</span></div>
          <div class="metric"><strong>${state.activities.length}</strong><span>近期活动</span></div>
        </div>
        <div class="overview-note">
          <strong>从一次出发，到一份成果。</strong>
          <span>平台记录实践项目、活动通知与成果沉淀，也为后续招募和交流留下清晰入口。</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <h2>最新项目</h2>
          <p>按实践季优先展示，适合快速了解近期机会。</p>
        </div>
        <a class="button secondary" href="#/projects">查看全部</a>
      </div>
      <div class="grid cards">${latestProjects.map(projectCard).join("")}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <h2>热门项目</h2>
          <p>跨学院参与度高，成果展示较完整。</p>
        </div>
      </div>
      <div class="grid cards">${hotProjects.map(projectCard).join("")}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <h2>活动通知</h2>
          <p>讲座、分享会和工作坊集中发布。</p>
        </div>
        <a class="button secondary" href="#/activities">进入广场</a>
      </div>
      <div class="grid two">${state.activities.map(activityListItem).join("")}</div>
    </section>
  `;
}

function renderProjects(id) {
  if (id) {
    const project = state.projects.find((item) => item.id === id);
    if (!project) {
      renderNotFound("未找到该项目");
      return;
    }
    renderProjectDetail(project);
    return;
  }

  app.innerHTML = `
    <section class="page-head">
      <h1>项目库</h1>
      <p>汇集社会服务、教育帮扶、科技创新和专题调研项目，点击卡片可查看详情。</p>
    </section>
    <section class="section">
      <div class="grid cards">${state.projects.map(projectCard).join("")}</div>
    </section>
  `;
}

function renderProjectDetail(project) {
  app.innerHTML = `
    <section class="page-head">
      <h1>${project.title}</h1>
      <p>${project.summary}</p>
    </section>
    <section class="detail-layout">
      <article class="detail-panel">
        <img class="detail-image" src="${project.cover}" alt="${project.title}" style="width:100%;max-height:260px;object-fit:cover;border-radius:8px;border:1px solid var(--line);margin-bottom:18px;">
        <h2>项目介绍</h2>
        <p>${project.description}</p>
        <h3>项目成果</h3>
        <ul class="outcome-list">
          ${project.outcomes.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <a class="button primary" href="#/register?target=project:${project.id}">报名参与</a>
      </article>
      <aside class="detail-panel">
        <dl class="info-list">
          <div><dt>实践地点</dt><dd>${project.location}</dd></div>
          <div><dt>项目成员</dt><dd>${project.members.join("、")}</dd></div>
          <div><dt>项目类别</dt><dd>${project.category}</dd></div>
          <div><dt>招募状态</dt><dd>${statusBadge(project.status)}</dd></div>
        </dl>
      </aside>
    </section>
  `;
}

function renderOutcomes(id) {
  if (id) {
    const outcome = state.outcomes.find((item) => item.id === id);
    if (!outcome) {
      renderNotFound("未找到该成果");
      return;
    }
    renderOutcomeDetail(outcome);
    return;
  }

  const categories = ["全部", "纪录片", "推送文章", "调研报告", "摄影作品"];
  app.innerHTML = `
    <section class="page-head">
      <h1>成果库</h1>
      <p>按成果类型分类展示实践沉淀，支持未来扩展上传、审核和检索功能。</p>
    </section>
    <section class="section">
      <div class="category-tabs" role="tablist">
        ${categories.map((category) => `<button type="button" data-category="${category}" class="${category === "全部" ? "active" : ""}">${category}</button>`).join("")}
      </div>
      <div id="outcome-grid" class="grid cards">${state.outcomes.map(outcomeCard).join("")}</div>
    </section>
  `;

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      document.querySelectorAll("[data-category]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const items = category === "全部" ? state.outcomes : state.outcomes.filter((item) => item.category === category);
      document.querySelector("#outcome-grid").innerHTML = items.map(outcomeCard).join("");
    });
  });
}

function renderOutcomeDetail(outcome) {
  app.innerHTML = `
    <section class="page-head">
      <h1>${outcome.title}</h1>
      <p>${outcome.summary}</p>
    </section>
    <section class="detail-layout">
      <article class="detail-panel">
        <h2>成果详情</h2>
        <p>${outcome.detail}</p>
        <h3>展示建议</h3>
        <p>可继续扩展为文件上传、视频在线播放、报告下载或图片展览页面。</p>
      </article>
      <aside class="detail-panel">
        <dl class="info-list">
          <div><dt>成果分类</dt><dd>${outcome.category}</dd></div>
          <div><dt>作者团队</dt><dd>${outcome.author}</dd></div>
          <div><dt>关联项目或活动</dt><dd>${outcome.related}</dd></div>
        </dl>
      </aside>
    </section>
  `;
}

function renderActivities(id) {
  if (id) {
    const activity = state.activities.find((item) => item.id === id);
    if (!activity) {
      renderNotFound("未找到该活动");
      return;
    }
    renderActivityDetail(activity);
    return;
  }

  app.innerHTML = `
    <section class="page-head">
      <h1>活动广场</h1>
      <p>集中展示讲座、分享会和体验活动，点击条目可查看具体安排。</p>
    </section>
    <section class="section">
      <div class="grid two">${state.activities.map(activityCard).join("")}</div>
    </section>
  `;
}

function renderActivityDetail(activity) {
  app.innerHTML = `
    <section class="page-head">
      <h1>${activity.title}</h1>
      <p>${activity.summary}</p>
    </section>
    <section class="detail-layout">
      <article class="detail-panel">
        <h2>活动详情</h2>
        <p>${activity.detail}</p>
        <a class="button primary" href="#/register?target=activity:${activity.id}">报名活动</a>
      </article>
      <aside class="detail-panel">
        <dl class="info-list">
          <div><dt>活动类型</dt><dd>${activity.type}</dd></div>
          <div><dt>活动时间</dt><dd>${activity.date}</dd></div>
          <div><dt>活动地点</dt><dd>${activity.place}</dd></div>
        </dl>
      </aside>
    </section>
  `;
}

function renderRegister() {
  app.innerHTML = `
    <section class="page-head">
      <h1>报名系统</h1>
      <p>填写基本信息后，报名记录会保存到后端 JSON 文件中。</p>
    </section>
    <section class="form-wrap">
      <form class="form-panel form-grid" id="register-form">
        <div class="field">
          <label for="name">姓名</label>
          <input id="name" name="name" autocomplete="name" required />
        </div>
        <div class="field">
          <label for="studentId">学号</label>
          <input id="studentId" name="studentId" required />
        </div>
        <div class="field">
          <label for="contact">联系方式</label>
          <input id="contact" name="contact" autocomplete="tel" required />
        </div>
        <div class="field">
          <label for="target">想参加的项目或活动</label>
          <select id="target" name="target" required>
            <option value="">请选择</option>
            ${state.options.map((option) => `<option value="${option.id}">${option.type} · ${option.name}</option>`).join("")}
          </select>
        </div>
        <button class="button primary" type="submit">提交报名</button>
        <p class="form-message" id="form-message" aria-live="polite"></p>
      </form>
      <aside class="detail-panel">
        <h2>扩展接口</h2>
        <p>当前原型提供项目、成果、活动、报名选项和提交报名接口。后续可以接入数据库、邮箱通知、管理员审核和导出功能。</p>
        <dl class="info-list">
          <div><dt>保存方式</dt><dd>data/registrations.json</dd></div>
          <div><dt>提交接口</dt><dd>POST /api/register</dd></div>
        </dl>
      </aside>
    </section>
  `;

  preselectTarget();
  document.querySelector("#register-form").addEventListener("submit", submitRegistration);
}

function preselectTarget() {
  const queryPart = window.location.hash.split("?")[1];
  if (!queryPart) return;
  const params = new URLSearchParams(queryPart);
  const target = params.get("target");
  if (target) {
    document.querySelector("#target").value = target;
  }
}

async function submitRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#form-message");
  const submitButton = form.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(form).entries());

  message.textContent = "正在提交...";
  submitButton.disabled = true;

  try {
    const result = await api.register(payload);
    message.textContent = result.message;
    form.reset();
  } catch (error) {
    saveStaticRegistration(payload);
    message.textContent = "当前为静态网页，报名信息已临时保存在本机浏览器。";
    form.reset();
  } finally {
    submitButton.disabled = false;
  }
}

function saveStaticRegistration(payload) {
  const key = "socialPracticeRegistrations";
  const registrations = JSON.parse(localStorage.getItem(key) || "[]");
  registrations.push({
    ...payload,
    id: `local-${Date.now()}`,
    submittedAt: new Date().toISOString()
  });
  localStorage.setItem(key, JSON.stringify(registrations));
}

function projectCard(project) {
  return `
    <a class="card" href="#/projects/${project.id}">
      <div class="card-cover"><img src="${project.cover}" alt="${project.title}" /></div>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag">${project.category}</span>
          ${statusBadge(project.status)}
        </div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="card-footer">
          <span>${project.location}</span>
          <strong>查看详情</strong>
        </div>
      </div>
    </a>
  `;
}

function outcomeCard(outcome) {
  return `
    <a class="card" href="#/outcomes/${outcome.id}">
      <div class="card-body">
        <div class="tag-row"><span class="tag">${outcome.category}</span></div>
        <h3>${outcome.title}</h3>
        <p>${outcome.summary}</p>
        <div class="card-footer">
          <span>${outcome.author}</span>
          <strong>查看详情</strong>
        </div>
      </div>
    </a>
  `;
}

function activityCard(activity) {
  return `
    <a class="card" href="#/activities/${activity.id}">
      <div class="card-body">
        <div class="tag-row"><span class="tag">${activity.type}</span></div>
        <h3>${activity.title}</h3>
        <p>${activity.summary}</p>
        <div class="card-footer">
          <span>${activity.date}</span>
          <strong>查看详情</strong>
        </div>
      </div>
    </a>
  `;
}

function activityListItem(activity) {
  return `
    <a class="list-item" href="#/activities/${activity.id}">
      <strong>${activity.title}</strong>
      <span>${activity.date} · ${activity.place}</span>
      <span>${activity.summary}</span>
    </a>
  `;
}

function statusBadge(status) {
  const open = status === "报名中";
  return `<span class="status ${open ? "open" : "closed"}">${status}</span>`;
}

function renderNotFound(message) {
  app.innerHTML = `
    <section class="empty-state">
      <p>${message}</p>
      <a class="button primary" href="#/">返回首页</a>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
