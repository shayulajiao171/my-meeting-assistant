const STORAGE_KEY = "meeting-copilot-state-v1";
const PRIVATE_CONTENT_PATTERN = /上海领健|领健/;

const sampleTranscript = `本次会议讨论了视频会议助手的 MVP 范围。大家一致认为第一版不需要接入真实视频会议工具，也不需要做实时录音转写，优先支持用户手动输入会议信息和粘贴会议记录。产品侧需要在 5 月 16 日前补充 PRD 字段，开发侧在 5 月 17 日前完成页面框架，设计侧需要提供首页视觉方向。大家还讨论了是否接入真实大模型 API，结论是 Demo 阶段先用模拟生成，后续再考虑 API 接入。风险点是功能过多导致开发时间不足，因此第一版只保留会前准备、会后纪要和待办跟进三个模块。`;

const sampleMeeting = {
  id: "m-demo",
  title: "视频会议助手 MVP 需求评审",
  type: "需求评审",
  time: "2026-05-15T15:00",
  attendees: "产品经理、前端开发、设计师、测试同学",
  host: "产品经理",
  deliverable: "确认 MVP 范围、页面结构与待办清单",
  decisionMethod: "共识确认",
  cadence: "60 分钟：10 分钟对齐背景，30 分钟讨论范围，15 分钟确认待办，5 分钟风险补充",
  participantRoles: [
    {
      role: "产品负责人",
      name: "产品经理",
      required: "必到",
      prep: "准备用户痛点、MVP 范围和验收标准",
    },
    {
      role: "研发负责人",
      name: "前端开发",
      required: "必到",
      prep: "评估实现成本、接口依赖和交付风险",
    },
    {
      role: "体验负责人",
      name: "设计师",
      required: "可选",
      prep: "准备首页视觉方向和关键交互问题",
    },
  ],
  goal: "确认 MVP 功能范围、页面结构和开发优先级。",
  decisionItems: "确认第一版是否接入真实 API、是否支持实时转写、MVP 功能范围。",
  context:
    "当前办公会议存在会前准备不足、会后纪要整理耗时、待办事项遗漏等问题，希望做一个轻量 AI 工具提升效率。",
  transcript: sampleTranscript,
  prepBrief: {
    summary: "本次会议需要确认视频会议助手 MVP 的核心功能范围、页面结构和开发优先级。",
    agenda: [
      "对齐用户痛点与目标场景",
      "确认 MVP 功能范围和暂不实现边界",
      "确认页面结构与核心交互流程",
      "明确开发排期、负责人和验收标准",
    ],
    checklist: [
      "产品：准备 PRD 字段和 MVP 优先级",
      "设计：准备首页和工作台视觉方向",
      "开发：评估单文件网页与 React 方案成本",
      "测试：准备会前准备、纪要生成、待办追踪的验收用例",
    ],
    questions: [
      "Demo 阶段是否需要接入真实大模型 API？",
      "会议记录输入是否先支持手动粘贴即可？",
      "待办事项是否需要支持负责人和状态追踪？",
    ],
    risks: [
      "功能过多导致开发时间不足，需要先锁定 P0 范围。",
      "AI 输出如果不可编辑，会影响实际办公场景可用性。",
    ],
    outcomes: ["确认 MVP 范围", "确认页面结构", "明确开发优先级和验收标准"],
  },
  minutes: {
    summary: "会议确认第一版聚焦会前准备、会后纪要和待办跟进，不接入真实视频会议工具。",
    decisions: [
      "MVP 阶段暂不做实时录音转写。",
      "第一版支持用户手动输入会议信息和粘贴会议记录。",
      "Demo 阶段先使用模拟 AI 生成，后续再考虑真实 API 接入。",
    ],
    openItems: [
      "是否在下一版本接入真实大模型 API，需要根据评审反馈决定。",
      "历史会议和本地存储是否进入 P1 范围，仍需评估。",
    ],
    risks: ["功能范围过大可能影响交付速度，因此需要控制 MVP 边界。"],
  },
  tasks: [
    {
      id: "t-1",
      title: "补充 PRD 页面字段和功能优先级",
      owner: "产品",
      due: "5 月 16 日",
      priority: "高",
      status: "进行中",
    },
    {
      id: "t-2",
      title: "完成页面框架和 Tab 结构",
      owner: "开发",
      due: "5 月 17 日",
      priority: "高",
      status: "未开始",
    },
    {
      id: "t-3",
      title: "提供首页视觉方向和组件规范",
      owner: "设计",
      due: "5 月 17 日",
      priority: "中",
      status: "未开始",
    },
  ],
  followMessage:
    "各位好，本次会议已完成同步：第一版视频会议助手聚焦会前准备、会后纪要和待办跟进，暂不接入真实会议工具和实时转写。请产品在 5 月 16 日前补充 PRD 字段，开发在 5 月 17 日前完成页面框架，设计在 5 月 17 日前提供首页视觉方向。",
  prepSource: "local",
  minutesSource: "local",
  followSource: "local",
  archived: false,
};

const demoMeetingSamples = [
  {
    title: "会员积分功能需求评审",
    type: "需求评审",
    time: "2026-05-18T10:00",
    attendees: "产品经理、前端开发、后端开发、设计师、测试同学",
    host: "产品经理",
    deliverable: "确认积分规则、页面入口、验收标准和开发排期",
    decisionMethod: "共识确认",
    cadence: "60 分钟：10 分钟对齐背景，25 分钟讨论规则，15 分钟确认边界，10 分钟拆解待办",
    participantRoles: [
      { role: "产品负责人", name: "产品经理", required: "必到", prep: "准备用户场景、积分规则和验收标准" },
      { role: "研发负责人", name: "前后端开发", required: "必到", prep: "评估接口依赖、数据口径和开发成本" },
      { role: "体验负责人", name: "设计师", required: "必到", prep: "准备页面入口、任务卡片和积分明细交互方案" },
      { role: "质量负责人", name: "测试同学", required: "可选", prep: "准备核心测试路径和异常场景" },
    ],
    goal: "确认会员积分功能第一版范围、核心规则和上线前验收标准。",
    decisionItems: "积分获取与消耗规则；是否需要积分明细页；第一版是否支持积分过期提醒。",
    context:
      "当前用户活跃度下降，运营希望通过积分体系提升签到、浏览和任务完成行为，但需要控制第一版复杂度，避免规则过多导致理解成本高。",
    transcript:
      "本次会议围绕会员积分功能第一版范围进行了讨论。大家确认第一版先支持签到得积分、完成任务得积分和积分明细查询，不做积分兑换商城。产品侧需要在 5 月 18 日前补充积分规则和异常说明，设计侧在 5 月 19 日前完成任务卡片和积分明细页，研发侧在 5 月 20 日前评估接口和数据表结构。风险点是积分规则过多会影响用户理解，因此第一版只保留三类核心行为。",
  },
  {
    title: "用户增长活动复盘会",
    type: "运营复盘",
    time: "2026-05-19T15:30",
    attendees: "运营负责人、产品经理、数据分析、渠道同学、设计师",
    host: "运营负责人",
    deliverable: "输出活动复盘结论、问题假设和下一轮优化动作",
    decisionMethod: "负责人拍板",
    cadence: "45 分钟：10 分钟看数据，15 分钟定位问题，10 分钟讨论优化，10 分钟确认待办",
    participantRoles: [
      { role: "会议主持", name: "运营负责人", required: "必到", prep: "准备活动目标、资源投入和执行过程" },
      { role: "数据支持", name: "数据分析", required: "必到", prep: "准备转化漏斗、分渠道效果和异常波动解释" },
      { role: "产品支持", name: "产品经理", required: "必到", prep: "准备活动路径、转化阻塞和页面体验问题" },
      { role: "设计支持", name: "设计师", required: "可选", prep: "准备素材表现和落地页视觉问题" },
    ],
    goal: "复盘用户增长活动效果，找出转化低于预期的原因，并确定下一轮优化优先级。",
    decisionItems: "是否继续投放现有渠道；落地页是否需要重做；下一轮活动是否调整权益表达。",
    context:
      "本轮活动目标是提升新用户注册和首单转化，但实际转化低于预期。团队需要结合渠道、页面和权益表达做一次结构化复盘。",
    transcript:
      "本次复盘确认活动曝光量达到预期，但注册转化和首单转化低于目标。数据侧指出短视频渠道点击率较高但注册完成率偏低，产品侧认为落地页权益说明不够清晰，运营侧认为活动文案需要突出限时权益。会议决定保留效果较好的信息流渠道，暂停低转化渠道，设计侧在 5 月 20 日前调整落地页首屏，运营侧在 5 月 21 日前准备两版权益文案，数据侧下周输出新旧版本对比。",
  },
  {
    title: "客户续约方案沟通会",
    type: "客户沟通",
    time: "2026-05-20T14:00",
    attendees: "客户成功、销售负责人、产品经理、实施顾问",
    host: "客户成功",
    deliverable: "明确客户续约诉求、风险点和下一步跟进计划",
    decisionMethod: "会议后负责人确认",
    cadence: "50 分钟：10 分钟回顾客户使用情况，20 分钟讨论续约诉求，10 分钟确认风险，10 分钟拆解跟进动作",
    participantRoles: [
      { role: "客户负责人", name: "客户成功", required: "必到", prep: "准备客户使用数据、历史反馈和续约风险" },
      { role: "商务负责人", name: "销售负责人", required: "必到", prep: "准备报价策略、合同节点和商务底线" },
      { role: "产品支持", name: "产品经理", required: "可选", prep: "准备产品能力边界和可承诺优化项" },
      { role: "交付支持", name: "实施顾问", required: "可选", prep: "评估实施资源和交付周期" },
    ],
    goal: "梳理重点客户续约诉求，确认报价策略、产品支持范围和下一步跟进动作。",
    decisionItems: "是否提供续约优惠；哪些产品诉求可以进入排期；下一次客户沟通由谁负责。",
    context:
      "客户即将进入续约窗口，但近期反馈部分报表能力不够灵活。团队需要在商务条件、产品承诺和交付资源之间达成一致。",
    transcript:
      "本次会议围绕客户续约风险和支持方案进行了讨论。客户成功反馈客户主要关注报表自定义能力和数据导出效率，销售侧建议给出续约优惠但不要承诺无法按期交付的功能。产品侧确认可以在下个小版本支持两个高频报表模板，暂不承诺完全自定义。会议决定客户成功在 5 月 20 日前整理客户反馈清单，产品在 5 月 22 日前确认可排期需求，销售在 5 月 23 日前准备续约沟通方案。",
  },
  {
    title: "新人培训流程优化会",
    type: "培训分享",
    time: "2026-05-21T11:00",
    attendees: "团队负责人、培训负责人、新员工代表、业务导师",
    host: "培训负责人",
    deliverable: "优化新人培训路径、资料清单和导师跟进机制",
    decisionMethod: "共识确认",
    cadence: "40 分钟：10 分钟反馈现状，15 分钟讨论流程，10 分钟确认资料，5 分钟分配待办",
    participantRoles: [
      { role: "培训负责人", name: "培训负责人", required: "必到", prep: "准备当前培训流程、资料清单和反馈问题" },
      { role: "业务导师", name: "业务导师", required: "必到", prep: "准备新人常见问题和任务安排建议" },
      { role: "新员工代表", name: "新员工代表", required: "可选", prep: "反馈上手过程中的困惑和资料缺口" },
      { role: "团队负责人", name: "团队负责人", required: "必到", prep: "确认培养目标和阶段验收标准" },
    ],
    goal: "优化新人入职前两周培训流程，让新人更快理解业务、工具和协作方式。",
    decisionItems: "是否建立统一资料库；导师跟进频率；新人第 1 周和第 2 周的验收标准。",
    context:
      "近期新人反馈资料分散、任务优先级不清晰，导师也缺少统一跟进模板。团队希望通过流程优化降低新人上手成本。",
    transcript:
      "本次会议讨论了新人培训流程优化。大家认为当前资料分散在多个文档和群消息里，新人不知道先看什么。会议决定建立统一资料库，并把前两周培训拆成业务认知、工具使用和实操任务三部分。培训负责人在 5 月 21 日前整理资料目录，业务导师在 5 月 22 日前补充实操任务模板，团队负责人在 5 月 23 日前确认新人验收标准。",
  },
];

let state = loadState();
let activeView = "dashboard";
let taskFilter = "全部";
let meetingSearchQuery = "";
let reviewMode = "transcript";
let participantRoles = [];
let prepMode = "quick";
let textModalCopy = "";

const viewTitles = {
  dashboard: "会议效率总览",
  prep: "会前准备生成器",
  review: "会后纪要与跟进",
  tasks: "任务追踪工作台",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function createEmptyState() {
  return {
    meetings: [],
    selectedMeetingId: "",
  };
}

async function requestAI(type, payload) {
  const response = await fetch("/api/deepseek", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, payload }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "AI 请求失败");
  }
  return data.result;
}

function normalizeLineBreaks(value = "") {
  return String(value).replace(/\\r\\n|\\n|\\r/g, "\n").replace(/\r\n?/g, "\n");
}

function valueToText(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") return cleanInlineText(value) || fallback;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => valueToText(item)).filter(Boolean).join("；") || fallback;
  }
  if (typeof value === "object") {
    const preferredKeys = [
      "title",
      "task",
      "action",
      "content",
      "summary",
      "text",
      "description",
      "decision",
      "conclusion",
      "item",
      "question",
      "risk",
      "outcome",
      "owner",
      "assignee",
      "due",
      "deadline",
    ];
    const parts = [];
    preferredKeys.forEach((key) => {
      if (value[key] === undefined || value[key] === null) return;
      const text = valueToText(value[key]);
      if (text && !parts.includes(text)) parts.push(text);
    });
    if (parts.length) return parts.join("；");

    return (
      Object.entries(value)
        .map(([key, item]) => {
          const text = valueToText(item);
          return text ? `${key}：${text}` : "";
        })
        .filter(Boolean)
        .join("；") || fallback
    );
  }
  return fallback;
}

function cleanInlineText(value = "") {
  const cleaned = normalizeLineBreaks(value)
    .replace(/\*\*/g, "")
    .replace(/^[-*•]\s*/, "")
    .replace(/^\d+[.、)]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned === "[object Object]" ? "" : cleaned;
}

function cleanBlockText(value = "") {
  if (value && typeof value === "object") return valueToText(value);
  return normalizeLineBreaks(value)
    .split("\n")
    .map((line) => line.replace(/\*\*/g, "").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureArray(value, fallback = []) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
      ? normalizeLineBreaks(value).split(/\n+/)
      : value && typeof value === "object"
        ? [value]
      : [];
  const cleaned = source.map((item) => valueToText(item)).filter(Boolean);
  if (cleaned.length) return cleaned;
  return fallback.map((item) => valueToText(item)).filter(Boolean);
}

function linesToArray(value = "") {
  return normalizeLineBreaks(value)
    .split("\n")
    .map(cleanInlineText)
    .filter(Boolean);
}

function arrayToLines(value = []) {
  return ensureArray(value).join("\n");
}

function normalizeParticipantRoles(value = []) {
  const source = Array.isArray(value) ? value : [];
  return source
    .map((item) => ({
      role: valueToText(item.role || item.title || item.position, ""),
      name: valueToText(item.name || item.owner || item.person, ""),
      required: ["必到", "可选"].includes(valueToText(item.required)) ? valueToText(item.required) : "必到",
      prep: valueToText(item.prep || item.checklist || item.prepare || item.description, ""),
    }))
    .filter((item) => item.role || item.name || item.prep);
}

function normalizePrepBrief(value, fallback) {
  return {
    summary: cleanBlockText(value?.summary || fallback.summary),
    agenda: ensureArray(value?.agenda, fallback.agenda),
    checklist: ensureArray(value?.checklist, fallback.checklist),
    questions: ensureArray(value?.questions, fallback.questions),
    risks: ensureArray(value?.risks, fallback.risks),
    outcomes: ensureArray(value?.outcomes, fallback.outcomes),
  };
}

function normalizeMinutesResult(value, fallback) {
  const minutes = value?.minutes || {};
  const aiTasks = ensureTaskArray(value?.tasks, []);
  const fallbackTasks = ensureTaskArray(fallback.tasks, []);
  const tasks = mergeTaskArrays(aiTasks, fallbackTasks);

  return {
    minutes: {
      summary: cleanBlockText(minutes.summary || fallback.minutes.summary),
      decisions: ensureArray(minutes.decisions, fallback.minutes.decisions),
      openItems: ensureArray(minutes.openItems || minutes.open_items, fallback.minutes.openItems),
      risks: ensureArray(minutes.risks, fallback.minutes.risks),
    },
    tasks,
  };
}

function ensureTaskArray(value, fallback = []) {
  const source = Array.isArray(value) ? value : value ? [value] : [];
  const tasks = source.map(normalizeTask).filter((task) => task.title && task.title !== "待确认任务");
  if (tasks.length) return tasks;
  return fallback.map(normalizeTask).filter((task) => task.title);
}

function mergeTaskArrays(primary = [], secondary = []) {
  const result = [];
  const seen = new Set();
  [...primary, ...secondary].map(normalizeTask).forEach((task) => {
    if (!task.title || task.title === "待确认任务") return;
    const key = `${task.owner}|${task.due}|${task.title}`.replace(/\s+/g, "");
    const ownerDueKey = `${task.owner}|${task.due}`.replace(/\s+/g, "");
    if (seen.has(key) || seen.has(ownerDueKey)) return;
    result.push(task);
    seen.add(key);
    if (task.owner !== "待确认" && task.due !== "待确认") {
      seen.add(ownerDueKey);
    }
  });
  return result;
}

function normalizeTask(task = {}) {
  if (typeof task === "string") {
    return {
      id: createId("task"),
      title: cleanInlineText(task),
      owner: "待确认",
      due: "待确认",
      priority: "中",
      status: "未开始",
    };
  }

  const priority = valueToText(task.priority, "中");
  const status = valueToText(task.status, "未开始");
  return {
    id: valueToText(task.id) || createId("task"),
    title: valueToText(task.title ?? task.task ?? task.action ?? task.content ?? task.description, "待确认任务"),
    owner: valueToText(task.owner ?? task.assignee ?? task.responsible ?? task.person, "待确认"),
    due: valueToText(task.due ?? task.deadline ?? task.time ?? task.date, "待确认"),
    priority: ["高", "中", "低"].includes(priority) ? priority : "中",
    status: ["未开始", "进行中", "已完成", "延期"].includes(status) ? status : "未开始",
  };
}

function getSourceText(source) {
  const map = {
    deepseek: "DeepSeek 已生成",
    fallback: "本地兜底生成",
    local: "本地规则生成",
    edited: "已人工修改",
  };
  return map[source] || "等待生成";
}

function getSourceClass(source) {
  if (source === "deepseek") return "deepseek";
  if (source === "edited") return "edited";
  if (source === "fallback" || source === "local") return "fallback";
  return "";
}

function renderSourceBanner(source, text = "") {
  const sourceText = getSourceText(source);
  const sourceIcon = source === "deepseek" ? "ai" : source === "edited" ? "check" : "warning";
  return `
    <div class="source-banner ${getSourceClass(source)}">
      <span class="source-title">${renderIcon(sourceIcon)}${sourceText}</span>
      <small>${text || "AI 输出支持人工校正，修改后会自动保存到本地。"}</small>
    </div>
  `;
}

function getRandomDemoSample() {
  return demoMeetingSamples[Math.floor(Math.random() * demoMeetingSamples.length)];
}

function hasPrivateContent(value = "") {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return PRIVATE_CONTENT_PATTERN.test(text);
}

function loadState() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    return createEmptyState();
  }

  try {
    const parsed = JSON.parse(cached);
    const rawMeetings = parsed.meetings || [];
    const meetings = rawMeetings
      .filter((meeting) => meeting.id !== sampleMeeting.id && !hasPrivateContent(meeting))
      .map(sanitizeMeeting);
    if (!meetings.length) {
      if (rawMeetings.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(createEmptyState()));
      return createEmptyState();
    }
    const selectedMeetingId = meetings.some((meeting) => meeting.id === parsed.selectedMeetingId)
      ? parsed.selectedMeetingId
      : meetings[0].id;
    if (rawMeetings.length !== meetings.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, meetings, selectedMeetingId }));
    }
    return { ...parsed, meetings, selectedMeetingId };
  } catch {
    return createEmptyState();
  }
}

function sanitizeMeeting(meeting = {}) {
  const sanitized = {
    ...meeting,
    id: valueToText(meeting.id) || createId("meeting"),
    title: valueToText(meeting.title, "未命名会议"),
    type: valueToText(meeting.type, "其他"),
    attendees: valueToText(meeting.attendees, ""),
    host: valueToText(meeting.host, ""),
    deliverable: valueToText(meeting.deliverable, ""),
    decisionMethod: valueToText(meeting.decisionMethod, ""),
    cadence: valueToText(meeting.cadence, ""),
    participantRoles: normalizeParticipantRoles(meeting.participantRoles || []),
    goal: valueToText(meeting.goal, ""),
    decisionItems: cleanBlockText(meeting.decisionItems || ""),
    context: cleanBlockText(meeting.context || ""),
    transcript: cleanBlockText(meeting.transcript || ""),
    transcriptSource: valueToText(meeting.transcriptSource, "腾讯会议转写"),
    tasks: ensureTaskArray(meeting.tasks || [], []),
    followMessage: cleanBlockText(meeting.followMessage || ""),
    prepSource: meeting.prepSource || "",
    minutesSource: meeting.minutesSource || "",
    followSource: meeting.followSource || "",
    archived: Boolean(meeting.archived),
  };

  if (meeting.prepBrief) {
    sanitized.prepBrief = normalizePrepBrief(meeting.prepBrief, generatePrepBrief(sanitized));
  }

  if (meeting.minutes) {
    sanitized.minutes = {
      summary: cleanBlockText(meeting.minutes.summary || ""),
      decisions: ensureArray(meeting.minutes.decisions || []),
      openItems: ensureArray(meeting.minutes.openItems || meeting.minutes.open_items || []),
      risks: ensureArray(meeting.minutes.risks || []),
    };
  }

  return sanitized;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderIcon(name, className = "icon") {
  return `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function getBadgeIcon(badge = "AI") {
  const map = {
    AI: "ai",
    "01": "prep",
    "02": "review",
    "03": "tasks",
    0: "search",
  };
  return map[badge] || "empty";
}

function getMetricIcon(label = "") {
  if (label.includes("会前")) return "prep";
  if (label.includes("复盘")) return "review";
  if (label.includes("任务")) return "tasks";
  if (label.includes("归档")) return "archive";
  return "dashboard";
}

function getTimingIcon(className = "") {
  if (className === "done") return "check";
  if (className === "overdue" || className === "today") return "warning";
  if (className === "soon") return "clock";
  return "clock";
}

function getActionIcon(label = "", actionView = "") {
  if (actionView === "prep" || label.includes("创建") || label.includes("添加") || label.includes("新增")) return "plus";
  if (actionView === "review" || label.includes("纪要") || label.includes("复盘")) return "review";
  if (label.includes("清空")) return "clear";
  if (label.includes("复制")) return "copy";
  if (label.includes("提醒")) return "reminder";
  if (label.includes("归档")) return "archive";
  if (label.includes("恢复")) return "restore";
  if (label.includes("删除")) return "trash";
  return "ai";
}

function getSelectedMeeting() {
  return state.meetings.find((meeting) => meeting.id === state.selectedMeetingId) || state.meetings[0];
}

function getMeetingStatus(meeting) {
  if (meeting.archived) return "已归档";
  if (!meeting.prepBrief) return "待准备";
  if (!meeting.minutes) return "待复盘";
  const tasks = meeting.tasks || [];
  if (tasks.length && tasks.every((task) => task.status === "已完成")) return "已完成";
  if (tasks.length) return "待跟进";
  return "已复盘";
}

function getMeetingStatusMeta(status = "") {
  const map = {
    待准备: { className: "pending", icon: "prep" },
    待复盘: { className: "review", icon: "review" },
    待跟进: { className: "follow", icon: "reminder" },
    已复盘: { className: "reviewed", icon: "check" },
    已完成: { className: "done", icon: "check" },
    已归档: { className: "archived", icon: "archive" },
  };
  return map[status] || { className: "", icon: "dashboard" };
}

function getProgressIcon(item = "") {
  if (item.includes("会前")) return "prep";
  if (item.includes("复盘")) return "review";
  if (item.includes("待办")) return "tasks";
  if (item.includes("归档")) return "archive";
  return "clock";
}

function getPriorityIcon(priority = "") {
  if (priority === "高") return "warning";
  if (priority === "中") return "clock";
  return "check";
}

function getTaskStatusIcon(status = "") {
  const map = {
    全部: "tasks",
    未开始: "clock",
    进行中: "reminder",
    已完成: "check",
    延期: "warning",
  };
  return map[status] || "tasks";
}

function getMeetingProgress(meeting) {
  const tasks = meeting.tasks || [];
  const done = tasks.filter((task) => task.status === "已完成").length;
  const total = tasks.length;
  const items = [
    meeting.prepBrief ? "会前已生成" : "会前待生成",
    meeting.minutes ? "会后已复盘" : "会后待复盘",
    total ? `待办完成 ${done}/${total}` : "暂无待办",
    meeting.archived ? "已归档" : "未归档",
  ];
  return { done, total, items };
}

function getAllTasks({ includeArchived = true } = {}) {
  return state.meetings.filter((meeting) => includeArchived || !meeting.archived).flatMap((meeting) =>
    (meeting.tasks || []).map((task) => ({
      ...normalizeTask(task),
      meetingId: meeting.id,
      meetingTitle: valueToText(meeting.title, "未命名会议"),
    }))
  );
}

function formatTime(value) {
  if (!value) return "时间待定";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function parseDueDate(value = "") {
  const text = cleanInlineText(value);
  if (!text || text === "待确认") return null;

  const fullDate = text.match(/(20\d{2})[年./-]\s*(\d{1,2})[月./-]\s*(\d{1,2})/);
  if (fullDate) {
    return new Date(Number(fullDate[1]), Number(fullDate[2]) - 1, Number(fullDate[3]));
  }

  const monthDay = text.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (monthDay) {
    const year = new Date().getFullYear();
    return new Date(year, Number(monthDay[1]) - 1, Number(monthDay[2]));
  }

  const slashDate = text.match(/(\d{1,2})[/-](\d{1,2})/);
  if (slashDate) {
    const year = new Date().getFullYear();
    return new Date(year, Number(slashDate[1]) - 1, Number(slashDate[2]));
  }

  return null;
}

function getTaskTiming(task = {}) {
  const normalizedTask = normalizeTask(task);
  if (normalizedTask.status === "已完成") {
    return { label: "已完成", className: "done" };
  }

  const dueDate = parseDueDate(normalizedTask.due);
  if (!dueDate) {
    return { label: "时间待确认", className: "unknown" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const dayDiff = Math.round((dueDate - today) / 86400000);

  if (dayDiff < 0) return { label: "已逾期", className: "overdue" };
  if (dayDiff === 0) return { label: "今日到期", className: "today" };
  if (dayDiff <= 3) return { label: `${dayDiff} 天后到期`, className: "soon" };
  return { label: "排期正常", className: "normal" };
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function buildEmptyState({ badge = "AI", title, description, actionLabel, actionView, actionAttr = "" }) {
  const action = actionLabel
    ? `<button class="ghost-button icon-button" ${actionView ? `data-switch-view="${actionView}"` : ""} ${actionAttr}>${renderIcon(
        getActionIcon(actionLabel, actionView)
      )}${actionLabel}</button>`
    : "";
  return `
    <div class="empty-state">
      <span class="empty-state-icon">${renderIcon(getBadgeIcon(badge))}</span>
      <h4>${title}</h4>
      <p>${description}</p>
      ${action ? `<div class="empty-actions">${action}</div>` : ""}
    </div>
  `;
}

function buildMeetingStarter() {
  return `
    <div class="starter-state">
      <span class="starter-badge">${renderIcon("prep")}</span>
      <h4>还没有会议</h4>
      <p>按这三步体验完整闭环：先创建会议，再生成纪要，最后追踪待办。</p>
      <div class="starter-steps">
        <span>${renderIcon("prep")}填写会议信息</span>
        <span>${renderIcon("review")}生成会后纪要</span>
        <span>${renderIcon("tasks")}跟进 Action Items</span>
      </div>
      <button class="ghost-button icon-button" data-switch-view="prep">${renderIcon("plus")}去创建会议</button>
    </div>
  `;
}

function switchView(view) {
  closeGuideModal();
  closeTextModal();
  activeView = view;
  $("#viewTitle").textContent = viewTitles[view];
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  $$("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.viewPanel === view);
  });
}

function setPrepMode(mode = "quick", showMessage = true) {
  prepMode = mode === "advanced" ? "advanced" : "quick";
  $("#meetingForm")?.classList.toggle("advanced-mode", prepMode === "advanced");
  $("[data-prep-mode='quick']")?.classList.toggle("active", prepMode === "quick");
  $("[data-prep-mode='advanced']")?.classList.toggle("active", prepMode === "advanced");
  if (showMessage) {
    showToast(prepMode === "advanced" ? "已展开补充设置" : "已切换为轻量创建");
  }
}

function render() {
  renderSummary();
  renderMeetings();
  renderMeetingSelect();
  renderDashboardTasks();
  renderTaskTable();
  renderFollowMessage();
}

function renderSummary() {
  const meetings = state.meetings;
  const tasks = getAllTasks({ includeArchived: false });
  const pendingTasks = tasks.filter((task) => task.status !== "已完成");
  const prepared = meetings.filter((meeting) => Boolean(meeting.prepBrief)).length;
  const reviewed = meetings.filter((meeting) => Boolean(meeting.minutes)).length;
  const archived = meetings.filter((meeting) => meeting.archived).length;

  const metrics = [
    ["会议总数", meetings.length],
    ["已生成会前准备", prepared],
    ["已完成会后复盘", reviewed],
    ["待跟进任务", pendingTasks.length],
    ["已归档会议", archived],
  ];

  $("#summaryStrip").innerHTML = metrics
    .map(
      ([label, value]) => `
        <article class="metric">
          <div class="metric-icon">${renderIcon(getMetricIcon(label))}</div>
          <div>
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
        </article>
      `
    )
    .join("");
}

function renderMeetings() {
  const list = $("#meetingList");
  const query = meetingSearchQuery.trim().toLowerCase();
  const meetings = state.meetings.filter((meeting) => {
    if (!query) return true;
    const roleText = normalizeParticipantRoles(meeting.participantRoles || [])
      .map((item) => `${item.role} ${item.name} ${item.required} ${item.prep}`)
      .join(" ");
    return [meeting.title, meeting.type, meeting.attendees, meeting.host, roleText, getMeetingStatus(meeting), ...(getMeetingProgress(meeting).items || [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  if (!state.meetings.length) {
    list.innerHTML = buildMeetingStarter();
    return;
  }

  if (!meetings.length) {
    list.innerHTML = buildEmptyState({
      badge: "0",
      title: "没有匹配的会议",
      description: "换一个关键词试试，支持搜索会议主题、类型、参会人和当前状态。",
      actionLabel: "清空搜索",
      actionAttr: "data-clear-search",
    });
    return;
  }

  list.innerHTML = meetings
    .map((meeting) => {
      const unfinished = (meeting.tasks || []).filter((task) => task.status !== "已完成").length;
      const progress = getMeetingProgress(meeting);
      const status = getMeetingStatus(meeting);
      const statusMeta = getMeetingStatusMeta(status);
      return `
        <article class="meeting-row ${meeting.archived ? "archived" : ""}">
          <div>
            <h4>${escapeHTML(meeting.title)}</h4>
            <div class="row-meta">
              <span>${renderIcon("guide", "meta-icon")}${escapeHTML(meeting.type)}</span>
              <span>${renderIcon("clock", "meta-icon")}${formatTime(meeting.time)}</span>
              <span>${renderIcon("role", "meta-icon")}${escapeHTML(meeting.attendees || "参会人待补充")}</span>
              <span>${renderIcon(meeting.archived ? "archive" : "tasks", "meta-icon")}${
                meeting.archived ? "已归档，不计入待办统计" : `${unfinished} 个待跟进`
              }</span>
            </div>
            <div class="progress-pills">
              ${progress.items.map((item) => `<span>${renderIcon(getProgressIcon(item), "pill-icon")}${escapeHTML(item)}</span>`).join("")}
            </div>
          </div>
          <div class="inline-actions">
            <span class="status-badge ${statusMeta.className}">${renderIcon(statusMeta.icon, "badge-icon")}${status}</span>
            <button class="text-button icon-text-button" data-open-review="${meeting.id}">${renderIcon("review")}复盘</button>
            <button class="text-button icon-text-button" data-toggle-archive="${meeting.id}">${renderIcon(meeting.archived ? "restore" : "archive")}${
              meeting.archived ? "恢复" : "归档"
            }</button>
            <button class="text-button icon-text-button danger-text" data-delete-meeting="${meeting.id}">${renderIcon("trash")}删除</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDashboardTasks() {
  const tasks = getAllTasks({ includeArchived: false }).filter((task) => task.status !== "已完成").slice(0, 5);
  const list = $("#dashboardTaskList");
  if (!tasks.length) {
    list.innerHTML = buildEmptyState({
      badge: "AI",
      title: "暂无待办",
      description: state.meetings.length
        ? "选择一场会议进入会后跟进，生成纪要后待办会自动同步到这里。"
        : "先创建一场会议，生成会前准备后系统会自动保存，后续纪要待办会同步到这里。",
      actionLabel: state.meetings.length ? "去会后跟进" : "去创建会议",
      actionView: state.meetings.length ? "review" : "prep",
    });
    return;
  }

  list.innerHTML = tasks.map(renderTaskPreviewCard).join("");
}

function renderMeetingSelect() {
  const select = $("#reviewMeetingSelect");
  if (!state.meetings.length) {
    select.innerHTML = `<option value="">请先在会前准备中生成并保存一场会议</option>`;
    $("#meetingTranscript").value = "";
    $("#transcriptSource").value = "腾讯会议转写";
    resetMinutesOutput();
    resetFollowMessageOutput();
    return;
  }
  select.innerHTML = state.meetings
    .map(
      (meeting) => `<option value="${meeting.id}" ${meeting.id === state.selectedMeetingId ? "selected" : ""}>${escapeHTML(meeting.title)}</option>`
    )
    .join("");

  const selected = getSelectedMeeting();
  if (selected?.transcript && !$("#meetingTranscript").value.trim()) {
    $("#meetingTranscript").value = selected.transcript;
  }
  $("#transcriptSource").value = selected?.transcriptSource || "腾讯会议转写";
  if (selected?.minutes) {
    renderMinutesOutput(selected);
  } else {
    resetMinutesOutput();
  }
}

function renderTaskCard(task) {
  const normalizedTask = normalizeTask(task);
  const meetingTitle = valueToText(task.meetingTitle || "");
  const priorityClass = normalizedTask.priority === "高" ? "high" : normalizedTask.priority === "中" ? "medium" : "low";
  const meetingId = task.meetingId || state.selectedMeetingId;
  const timing = getTaskTiming(normalizedTask);
  return `
    <article class="task-card">
      <header>
        <label class="task-title-field">
          <span>任务</span>
          <input
            class="task-edit-input"
            data-task-field="title"
            data-task-id="${escapeHTML(normalizedTask.id)}"
            data-meeting-id="${escapeHTML(meetingId)}"
            value="${escapeHTML(normalizedTask.title)}"
          />
        </label>
        <span class="priority-badge ${priorityClass}">${renderIcon(getPriorityIcon(normalizedTask.priority), "badge-icon")}${normalizedTask.priority}</span>
      </header>
      <div class="task-meta">
        <label>
          <span>负责人</span>
          <input
            class="task-edit-input"
            data-task-field="owner"
            data-task-id="${escapeHTML(normalizedTask.id)}"
            data-meeting-id="${escapeHTML(meetingId)}"
            value="${escapeHTML(normalizedTask.owner || "待确认")}"
          />
        </label>
        <label>
          <span>截止</span>
          <input
            class="task-edit-input"
            data-task-field="due"
            data-task-id="${escapeHTML(normalizedTask.id)}"
            data-meeting-id="${escapeHTML(meetingId)}"
            value="${escapeHTML(normalizedTask.due || "待确认")}"
          />
        </label>
        <span class="due-badge ${timing.className}">${renderIcon(getTimingIcon(timing.className), "badge-icon")}${timing.label}</span>
        ${meetingTitle ? `<span>会议：${escapeHTML(meetingTitle)}</span>` : ""}
      </div>
      <div class="task-controls">
        <label>
          优先级
          <select class="task-edit-select" data-task-field="priority" data-task-id="${escapeHTML(normalizedTask.id)}" data-meeting-id="${escapeHTML(meetingId)}" aria-label="更新任务优先级">
            ${["高", "中", "低"].map((priority) => `<option ${normalizedTask.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
          </select>
        </label>
        <label>
          状态
          <select class="task-status-select task-edit-select" data-task-field="status" data-task-id="${escapeHTML(normalizedTask.id)}" data-meeting-id="${escapeHTML(meetingId)}" aria-label="更新任务状态">
            ${["未开始", "进行中", "已完成", "延期"]
              .map((status) => `<option ${normalizedTask.status === status ? "selected" : ""}>${status}</option>`)
              .join("")}
          </select>
        </label>
        <button class="text-button icon-text-button" type="button" data-remind-task="${escapeHTML(normalizedTask.id)}" data-meeting-id="${escapeHTML(
    meetingId
  )}">${renderIcon("reminder")}生成提醒</button>
        <button class="text-button icon-text-button danger-text" type="button" data-delete-task="${escapeHTML(
          normalizedTask.id
        )}" data-meeting-id="${escapeHTML(meetingId)}">${renderIcon("trash")}删除待办</button>
      </div>
    </article>
  `;
}

function renderTaskPreviewCard(task) {
  const normalizedTask = normalizeTask(task);
  const meetingTitle = valueToText(task.meetingTitle || "");
  const priorityClass = normalizedTask.priority === "高" ? "high" : normalizedTask.priority === "中" ? "medium" : "low";
  const timing = getTaskTiming(normalizedTask);
  return `
    <article class="task-card compact-task">
      <header>
        <h4>${escapeHTML(normalizedTask.title)}</h4>
        <span class="priority-badge ${priorityClass}">${renderIcon(getPriorityIcon(normalizedTask.priority), "badge-icon")}${normalizedTask.priority}</span>
      </header>
      <div class="task-meta">
        <span>负责人：${escapeHTML(normalizedTask.owner || "待确认")}</span>
        <span>截止：${escapeHTML(normalizedTask.due || "待确认")}</span>
        <span>状态：${escapeHTML(normalizedTask.status || "未开始")}</span>
        <span class="due-badge ${timing.className}">${renderIcon(getTimingIcon(timing.className), "badge-icon")}${timing.label}</span>
        ${meetingTitle ? `<span>会议：${escapeHTML(meetingTitle)}</span>` : ""}
      </div>
    </article>
  `;
}

function renderTaskTable() {
  let tasks = getAllTasks();
  if (taskFilter !== "全部") {
    tasks = tasks.filter((task) => task.status === taskFilter);
  }

  const table = $("#taskTable");
  if (!tasks.length) {
    table.innerHTML = buildEmptyState({
      badge: "03",
      title: "暂无待追踪任务",
      description: "先在会后跟进中选择会议、粘贴会议记录并生成会议纪要，AI 提取出的 Action Items 会自动同步到这里。",
      actionLabel: state.meetings.length ? "去生成纪要" : "先创建会议",
      actionView: state.meetings.length ? "review" : "prep",
    });
    return;
  }

  table.innerHTML = `
    <div class="task-board-summary">
      <span>${renderIcon("tasks", "badge-icon")}当前显示 ${tasks.length} 个待办</span>
      <span>${renderIcon(getTaskStatusIcon(taskFilter), "badge-icon")}${taskFilter === "全部" ? "全部状态" : taskFilter}</span>
    </div>
    ${tasks.map(renderTaskCard).join("")}
  `;
}

function renderPrepOutput(brief) {
  const output = $("#prepOutput");
  output.classList.remove("empty");
  output.innerHTML = `
    ${renderSourceBanner(window.currentPrepSource || getSelectedMeeting()?.prepSource || "local", "会前简报由 AI 初稿生成，编辑后会保留人工校正。")}
    ${renderEditableOutputSection("prep", "summary", "会议目标摘要", brief.summary, true)}
    ${renderEditableOutputSection("prep", "agenda", "建议议程", brief.agenda)}
    ${renderEditableOutputSection("prep", "risks", "潜在风险提醒", brief.risks)}
    <details class="output-details">
      <summary>${renderIcon("expand", "badge-icon")}更多准备细节</summary>
      ${renderEditableOutputSection("prep", "checklist", "参会人准备清单", brief.checklist)}
      ${renderEditableOutputSection("prep", "questions", "关键讨论问题", brief.questions)}
      ${renderEditableOutputSection("prep", "outcomes", "预期会议产出", brief.outcomes)}
    </details>
  `;
}

function renderMinutesOutput(meeting) {
  const output = $("#minutesOutput");
  output.classList.remove("empty");
  const minutes = meeting.minutes;
  output.innerHTML = `
    ${renderSourceBanner(meeting.minutesSource || "local", "会议纪要和 Action Items 支持人工修正，修正后会同步到任务追踪。")}
    ${renderEditableOutputSection("minutes", "summary", "会议摘要", minutes.summary, true)}
    ${renderEditableOutputSection("minutes", "decisions", "关键结论", minutes.decisions)}
    <div class="output-section">
      <div class="editable-section-heading">
        <h4>待办事项</h4>
        <button class="text-button icon-text-button" type="button" data-add-task="${escapeHTML(meeting.id)}">${renderIcon("plus")}新增待办</button>
      </div>
      <div class="task-list">${(meeting.tasks || []).map((task) => renderTaskCard({ ...task, meetingId: meeting.id })).join("")}</div>
    </div>
    <details class="output-details">
      <summary>${renderIcon("expand", "badge-icon")}更多复盘细节</summary>
      ${renderEditableOutputSection("minutes", "openItems", "未决事项", minutes.openItems)}
      ${renderEditableOutputSection("minutes", "risks", "风险提醒", minutes.risks)}
    </details>
  `;
}

function renderEditableOutputSection(scope, field, title, value, singleLine = false) {
  const textValue = singleLine ? cleanBlockText(value) : arrayToLines(value);
  const rows = singleLine ? 3 : Math.min(Math.max(ensureArray(value).length + 1, 3), 7);
  return `
    <section class="output-section">
      <div class="editable-section-heading">
        <h4>${title}</h4>
        <span>可编辑</span>
      </div>
      <textarea
        class="editable-output"
        data-edit-scope="${scope}"
        data-edit-field="${field}"
        data-edit-type="${singleLine ? "text" : "list"}"
        rows="${rows}"
      >${escapeHTML(textValue)}</textarea>
    </section>
  `;
}

function renderFollowMessage() {
  const meeting = getSelectedMeeting();
  const canUseFollowMessage = Boolean(meeting?.minutes && meeting?.followMessage);
  $("#followMessageOutput").value = cleanBlockText(meeting?.followMessage || "");
  $("#followMessageOutput").placeholder = "选择一场会议并生成纪要后，这里会展示可直接发送到群聊或邮件的跟进消息。";
  const followIcon = meeting?.followMessage ? (meeting.followSource === "deepseek" ? "ai" : meeting.followSource === "edited" ? "check" : "warning") : "clock";
  $("#followSourceBanner").innerHTML = meeting?.followMessage
    ? `<span class="source-title">${renderIcon(followIcon)}${getSourceText(meeting.followSource || "local")}</span><small>同步消息可继续人工润色。</small>`
    : `<span class="source-title">${renderIcon("clock")}等待生成</span><small>请先生成会议纪要，再生成同步消息。</small>`;
  $("#followSourceBanner").className = `source-banner compact ${getSourceClass(meeting?.followSource || "")}`;
  $("#generateFollowMessageButton").disabled = !meeting?.minutes;
  $("#copyFollowMessageButton").disabled = !canUseFollowMessage;
  $("#expandFollowButton").disabled = !canUseFollowMessage;
}

function renderParticipantRoles() {
  const list = $("#participantRoleList");
  if (!list) return;

  if (!participantRoles.length) {
    list.innerHTML = `
      <div class="participant-empty">
        还没有角色规划。可以点击“按类型建议角色”，让系统先给出必到/可选参会角色。
      </div>
    `;
    return;
  }

  list.innerHTML = participantRoles
    .map(
      (item, index) => `
        <div class="participant-role-row" data-role-index="${index}">
          <input class="role-input" data-role-field="role" value="${escapeHTML(item.role)}" placeholder="角色，例如：产品负责人" />
          <input class="role-input" data-role-field="name" value="${escapeHTML(item.name)}" placeholder="姓名/部门" />
          <select class="role-input" data-role-field="required">
            ${["必到", "可选"].map((option) => `<option ${item.required === option ? "selected" : ""}>${option}</option>`).join("")}
          </select>
          <input class="role-input" data-role-field="prep" value="${escapeHTML(item.prep)}" placeholder="会前需要准备什么" />
          <button class="text-button icon-text-button danger-text" type="button" data-remove-role="${index}">${renderIcon("trash")}删除</button>
        </div>
      `
    )
    .join("");
}

function getParticipantRolesFromUI() {
  return $$(".participant-role-row")
    .map((row) => {
      const getValue = (field) => row.querySelector(`[data-role-field="${field}"]`)?.value.trim() || "";
      return {
        role: getValue("role"),
        name: getValue("name"),
        required: getValue("required") || "必到",
        prep: getValue("prep"),
      };
    })
    .filter((item) => item.role || item.name || item.prep);
}

function getSuggestedParticipantRoles(type = "") {
  if (/需求|产品|评审|MVP|功能/.test(type)) {
    return [
      { role: "产品负责人", name: "产品/业务方", required: "必到", prep: "准备目标用户、核心痛点、范围取舍和验收标准" },
      { role: "研发负责人", name: "开发", required: "必到", prep: "评估实现成本、接口依赖、排期和技术风险" },
      { role: "体验负责人", name: "设计/交互", required: "可选", prep: "准备关键流程、异常状态和页面体验问题" },
      { role: "测试/交付", name: "测试/项目管理", required: "可选", prep: "准备验收用例、上线风险和交付节点" },
    ];
  }

  if (/复盘|运营|活动|数据/.test(type)) {
    return [
      { role: "会议主持", name: "运营负责人", required: "必到", prep: "准备目标、数据表现、问题假设和复盘框架" },
      { role: "数据支持", name: "数据/分析", required: "必到", prep: "准备核心指标、分渠道表现和异常波动解释" },
      { role: "执行负责人", name: "内容/渠道/产品", required: "必到", prep: "准备执行过程、资源投入和问题反馈" },
      { role: "决策人", name: "业务负责人", required: "可选", prep: "确认后续策略、资源优先级和调整方向" },
    ];
  }

  if (/客户|商务|沟通/.test(type)) {
    return [
      { role: "客户负责人", name: "销售/客户成功", required: "必到", prep: "准备客户背景、当前诉求和历史沟通记录" },
      { role: "方案支持", name: "产品/解决方案", required: "必到", prep: "准备产品能力、限制条件和可选方案" },
      { role: "交付支持", name: "实施/运营", required: "可选", prep: "评估交付周期、资源依赖和风险点" },
    ];
  }

  return [
    { role: "主持人", name: "会议负责人", required: "必到", prep: "准备会议目标、议程顺序和需决策事项" },
    { role: "决策人", name: "业务/项目负责人", required: "必到", prep: "准备判断标准、资源约束和最终拍板口径" },
    { role: "执行人", name: "相关执行同学", required: "必到", prep: "准备当前进展、阻塞和需要协助的问题" },
    { role: "信息同步对象", name: "相关协作方", required: "可选", prep: "提前阅读会议上下文，会议后接收结论同步" },
  ];
}

function suggestParticipantRoles() {
  setPrepMode("advanced", false);
  participantRoles = getSuggestedParticipantRoles($("#customMeetingType").value.trim() || $("#meetingType").value);
  renderParticipantRoles();
  showToast("已根据会议类型建议参会角色");
}

function addParticipantRole(role = { role: "", name: "", required: "必到", prep: "" }) {
  participantRoles = [...getParticipantRolesFromUI(), role];
  renderParticipantRoles();
}

function removeParticipantRole(index) {
  participantRoles = getParticipantRolesFromUI().filter((_, itemIndex) => itemIndex !== Number(index));
  renderParticipantRoles();
}

function updateEditableOutput(scope, field, value, type) {
  const normalizedValue = type === "list" ? linesToArray(value) : cleanBlockText(value);
  if (scope === "prep") {
    const fallback = generatePrepBrief(getFormData());
    const brief = normalizePrepBrief(window.currentPrepBrief || getSelectedMeeting()?.prepBrief || fallback, fallback);
    brief[field] = normalizedValue;
    window.currentPrepBrief = brief;
    window.currentPrepSource = "edited";

    const existing = state.meetings.find((meeting) => meeting.title === getFormData().title);
    if (existing) {
      existing.prepBrief = brief;
      existing.prepSource = "edited";
      saveState();
    }
    updateVisibleSourceBanner("#prepOutput", "edited", "会前简报已人工校正。");
    return;
  }

  if (scope === "minutes") {
    const meeting = getSelectedMeeting();
    if (!meeting?.minutes) return;
    meeting.minutes[field] = normalizedValue;
    meeting.minutesSource = "edited";
    saveState();
    updateVisibleSourceBanner("#minutesOutput", "edited", "会议纪要已人工校正，并会同步影响复制内容。");
  }
}

function updateVisibleSourceBanner(containerSelector, source, text) {
  const banner = $(`${containerSelector} .source-banner`);
  if (!banner) return;
  banner.className = `source-banner ${getSourceClass(source)}`;
  banner.innerHTML = `<span class="source-title">${renderIcon(source === "edited" ? "check" : "ai")}${getSourceText(source)}</span><small>${text}</small>`;
}

function updateTaskField(meetingId, taskId, field, value, shouldRender = true) {
  state.meetings = state.meetings.map((meeting) => {
    if (meeting.id !== meetingId) return meeting;
    return {
      ...meeting,
      tasks: (meeting.tasks || []).map((task) => {
        const normalizedTask = normalizeTask(task);
        if (normalizedTask.id !== taskId) return normalizedTask;
        return normalizeTask({ ...normalizedTask, [field]: value });
      }),
    };
  });
  saveState();
  if (shouldRender) render();
}

function addTask(meetingId = state.selectedMeetingId) {
  const targetMeetingId = meetingId || getSelectedMeeting()?.id;
  if (!targetMeetingId) {
    showToast("请先创建或选择会议");
    return;
  }
  const newTask = {
    id: createId("task"),
    title: "新增待办事项",
    owner: "待确认",
    due: "待确认",
    priority: "中",
    status: "未开始",
  };
  state.meetings = state.meetings.map((meeting) =>
    meeting.id === targetMeetingId ? { ...meeting, tasks: [...(meeting.tasks || []), newTask] } : meeting
  );
  state.selectedMeetingId = targetMeetingId;
  saveState();
  render();
  showToast("已新增待办");
}

function deleteTask(meetingId, taskId) {
  state.meetings = state.meetings.map((meeting) => {
    if (meeting.id !== meetingId) return meeting;
    return {
      ...meeting,
      tasks: (meeting.tasks || []).filter((task) => normalizeTask(task).id !== taskId),
    };
  });
  saveState();
  render();
  showToast("待办已删除");
}

function deleteMeeting(meetingId) {
  const meeting = state.meetings.find((item) => item.id === meetingId);
  if (!meeting) return;
  const ok = window.confirm(`确定删除「${meeting.title}」吗？相关纪要和待办也会一并删除。`);
  if (!ok) return;
  state.meetings = state.meetings.filter((item) => item.id !== meetingId);
  if (state.selectedMeetingId === meetingId) {
    state.selectedMeetingId = state.meetings[0]?.id || "";
  }
  saveState();
  render();
  showToast("会议已删除");
}

function toggleMeetingArchive(meetingId) {
  state.meetings = state.meetings.map((meeting) =>
    meeting.id === meetingId ? { ...meeting, archived: !meeting.archived } : meeting
  );
  saveState();
  render();
  const meeting = state.meetings.find((item) => item.id === meetingId);
  showToast(meeting?.archived ? "会议已归档" : "会议已恢复");
}

function findTaskById(meetingId, taskId) {
  const meeting = state.meetings.find((item) => item.id === meetingId);
  const task = (meeting?.tasks || []).map(normalizeTask).find((item) => item.id === taskId);
  return { meeting, task };
}

function getTaskReminderText(meeting, task) {
  const timing = getTaskTiming(task);
  return cleanBlockText(
    `提醒一下：${task.owner || "相关负责人"}负责的「${task.title}」需要跟进。\n\n会议：${meeting?.title || "未命名会议"}\n截止时间：${task.due || "待确认"}（${timing.label}）\n当前状态：${task.status || "未开始"}\n优先级：${task.priority || "中"}\n\n请同步当前进展、风险或是否需要调整截止时间。`
  );
}

function copyTaskReminder(meetingId, taskId) {
  const { meeting, task } = findTaskById(meetingId, taskId);
  if (!meeting || !task) {
    showToast("没有找到对应待办");
    return;
  }
  openTextModal("待办提醒消息", getTaskReminderText(meeting, task), "提醒消息");
}

function updateFollowMessage(value) {
  const meeting = getSelectedMeeting();
  if (!meeting) return;
  meeting.followMessage = cleanBlockText(value);
  meeting.followSource = "edited";
  saveState();
  $("#followSourceBanner").innerHTML = `<span class="source-title">${renderIcon("check")}${getSourceText("edited")}</span><small>同步消息已人工润色。</small>`;
  $("#followSourceBanner").className = "source-banner compact edited";
}

function resetMinutesOutput() {
  $("#minutesOutput").classList.add("empty");
  $("#minutesOutput").innerHTML = buildEmptyState({
    badge: "02",
    title: "粘贴会议记录后，AI 将生成纪要和 Action Items。",
    description: "支持提取关键结论、未决事项、风险提醒、负责人和截止时间。生成后可以人工修改。",
    actionLabel: state.meetings.length ? "选择会议并粘贴记录" : "先创建会议",
    actionView: state.meetings.length ? "review" : "prep",
  });
}

function resetFollowMessageOutput() {
  $("#followMessageOutput").value = "";
  $("#followMessageOutput").placeholder = "选择一场会议并生成纪要后，这里会展示可直接发送到群聊或邮件的跟进消息。";
}

function setMeetingDateTime(value = "") {
  const [date = "", time = ""] = String(value).split("T");
  $("#meetingTime").value = value || "";
  $("#meetingDate").value = date;
  $("#meetingClock").value = time.slice(0, 5);
}

function getMeetingDateTime() {
  const date = $("#meetingDate").value;
  const time = $("#meetingClock").value;
  const value = date && time ? `${date}T${time}` : date;
  $("#meetingTime").value = value;
  return value;
}

function getFormData() {
  return {
    title: $("#meetingTitle").value.trim(),
    type: $("#customMeetingType").value.trim() || $("#meetingType").value,
    time: getMeetingDateTime(),
    attendees: $("#meetingAttendees").value.trim(),
    host: $("#meetingHost").value.trim(),
    deliverable: $("#meetingDeliverable").value.trim(),
    decisionMethod: $("#meetingDecisionMethod").value,
    cadence: $("#meetingCadence").value.trim(),
    participantRoles: getParticipantRolesFromUI(),
    goal: $("#meetingGoal").value.trim(),
    decisionItems: $("#meetingDecisionItems").value.trim(),
    context: $("#meetingContext").value.trim(),
  };
}

function generatePrepBrief(data) {
  const attendeeList = data.attendees
    .split(/[、,，\\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const rolePlan = normalizeParticipantRoles(data.participantRoles || []);

  const checklist = rolePlan.length
    ? rolePlan.map((item) => {
        const name = item.name ? `（${item.name}）` : "";
        const required = item.required ? `｜${item.required}` : "";
        return `${item.role || "参会角色"}${name}${required}：${item.prep || "提前阅读会议上下文，准备相关问题"}`;
      })
    : attendeeList.length
      ? attendeeList.map((person) => `${person}：准备与本议题相关的上下文信息、风险点和待确认问题`)
      : ["参会人：提前阅读会议上下文，准备关键问题和需决策事项"];
  if (data.host) {
    checklist.unshift(`${data.host}：提前梳理会议主线、关键决策事项和预期输出物`);
  }

  return {
    summary: `本次会议围绕“${data.title}”展开，目标是${data.goal.replace(/[。.]$/, "")}${data.deliverable ? `，预期输出“${data.deliverable}”` : ""}${data.decisionMethod ? `，决策方式为${data.decisionMethod}` : ""}。`,
    agenda: [
      "对齐会议背景、目标和预期产出",
      data.decisionItems ? `聚焦需决策事项：${data.decisionItems.replace(/[。.]$/, "")}` : "确认当前需决策事项和关键判断标准",
      data.cadence ? `按照会议节奏推进：${data.cadence.replace(/[。.]$/, "")}` : "确认会议节奏和每个议题的时间边界",
      "确认当前问题、约束条件和关键风险",
      "逐项讨论核心议题和可选方案",
      data.decisionMethod ? `按“${data.decisionMethod}”形成会议结论，并明确会后待办、负责人和截止时间` : "明确会后待办、负责人和截止时间",
    ],
    checklist,
    questions: [
      "本次会议必须形成哪些明确结论？",
      data.decisionItems ? `围绕“${data.decisionItems.replace(/[。.]$/, "")}”，哪些信息还不足以支持决策？` : "哪些事项必须现场决策，哪些可以会后异步确认？",
      "哪些问题可以会后异步推进，避免会议范围失控？",
      "是否存在需要提前确认的数据、材料或决策人？",
      data.decisionMethod ? `如果现场无法按“${data.decisionMethod}”完成决策，需要转为哪种后续确认机制？` : "本次会议采用谁拍板、共识确认还是会后异步确认？",
    ],
    risks: [
      "会议目标过宽可能导致讨论发散，建议提前锁定 2-3 个关键议题。",
      "如果会后待办缺少负责人和截止时间，可能影响后续推进。",
    ],
    outcomes: [data.deliverable || "会议结论摘要", "待办事项清单", "后续跟进节奏"],
  };
}

function generateMinutes(transcript) {
  const extractedTasks = extractActionTasks(transcript);
  const hasProduct = /产品|PRD|需求/.test(transcript);
  const hasDev = /开发|页面|前端|框架/.test(transcript);
  const hasDesign = /设计|视觉|首页/.test(transcript);
  const hasTest = /测试|验收|用例/.test(transcript);
  const hasApi = /API|模型|大模型/.test(transcript);

  const tasks = [...extractedTasks];
  if (hasProduct && !hasTaskForOwner(tasks, /产品/)) {
    tasks.push({
      id: createId("task"),
      title: "补充需求字段、功能范围和验收标准",
      owner: "产品",
      due: extractRoleDue(transcript, /产品经理|产品侧|产品/) || extractDue(transcript, "18") || extractDue(transcript, "16") || "待确认",
      priority: "高",
      status: "未开始",
    });
  }
  if (hasDev && !hasTaskForOwner(tasks, /开发|前端|后端|研发/)) {
    tasks.push({
      id: createId("task"),
      title: "完成页面框架和核心交互搭建",
      owner: "开发",
      due: extractRoleDue(transcript, /前端开发|后端开发|开发侧|研发侧|开发|研发/) || extractDue(transcript, "20") || extractDue(transcript, "19") || extractDue(transcript, "17") || "待确认",
      priority: "高",
      status: "未开始",
    });
  }
  if (hasDesign && !hasTaskForOwner(tasks, /设计/)) {
    tasks.push({
      id: createId("task"),
      title: "提供首页视觉方向和关键组件样式",
      owner: "设计",
      due: extractRoleDue(transcript, /设计师|设计侧|设计/) || extractDue(transcript, "19") || extractDue(transcript, "17") || "待确认",
      priority: "中",
      status: "未开始",
    });
  }
  if (hasTest && !hasTaskForOwner(tasks, /测试/)) {
    tasks.push({
      id: createId("task"),
      title: "整理核心测试用例和验收场景",
      owner: "测试",
      due: extractRoleDue(transcript, /测试同学|测试侧|测试/) || extractDue(transcript, "21") || "待确认",
      priority: "中",
      status: "未开始",
    });
  }

  const mergedTasks = mergeTaskArrays(tasks, []);

  if (!mergedTasks.length) {
    mergedTasks.push({
      id: createId("task"),
      title: "整理会议结论并确认后续推进计划",
      owner: "待确认",
      due: "待确认",
      priority: "中",
      status: "未开始",
    });
  }

  return {
    minutes: {
      summary: "本次会议围绕核心功能范围、实现方式和后续推进节奏进行了讨论，并形成初步结论。",
      decisions: [
        "优先保留与会议效率直接相关的核心功能，避免第一版范围过大。",
        "Demo 阶段优先保证交互闭环和演示稳定性。",
        hasApi ? "真实 API 接入可作为后续增强项，当前阶段先使用模拟生成。" : "后续根据实际反馈再决定是否接入外部能力。",
      ],
      openItems: [
        "部分负责人和截止时间仍需在会后进一步确认。",
        "后续是否加入历史会议、本地存储或真实 AI API，需要结合开发时间评估。",
      ],
      risks: ["功能范围过大可能影响交付质量，需要以 MVP 为边界推进。"],
    },
    tasks: mergedTasks,
  };
}

function extractActionTasks(text = "") {
  const actors = [
    "产品经理",
    "产品侧",
    "设计师",
    "设计侧",
    "后端开发",
    "前端开发",
    "开发侧",
    "研发侧",
    "测试同学",
    "测试侧",
    "运营负责人",
    "运营侧",
    "数据分析",
    "数据侧",
    "客户成功",
    "销售负责人",
    "销售侧",
    "培训负责人",
    "业务导师",
    "团队负责人",
  ];
  const actorPattern = actors.join("|");
  const regex = new RegExp(
    `(${actorPattern})\\s*(?:需要|需|负责)?\\s*(?:在|于)?\\s*(\\d{1,2}\\s*月\\s*\\d{1,2}\\s*日)前\\s*([^。；\\n]+?)(?=，?\\s*(?:${actorPattern})\\s*(?:需要|需|负责)?\\s*(?:在|于)?\\s*\\d{1,2}\\s*月\\s*\\d{1,2}\\s*日前|[。；\\n]|$)`,
    "g"
  );
  const tasks = [];
  let match;
  while ((match = regex.exec(text))) {
    const owner = normalizeOwner(match[1]);
    const due = match[2].replace(/\s+/g, " ");
    const title = cleanTaskTitle(match[3]);
    if (!title) continue;
    tasks.push({
      id: createId("task"),
      title,
      owner,
      due,
      priority: /验收|接口|上线|风险|规则|联调/.test(title) ? "高" : "中",
      status: "未开始",
    });
  }
  return tasks;
}

function hasTaskForOwner(tasks = [], ownerRegex) {
  return tasks.some((task) => ownerRegex.test(task.owner));
}

function normalizeOwner(owner = "") {
  if (/产品/.test(owner)) return "产品";
  if (/设计/.test(owner)) return "设计";
  if (/测试/.test(owner)) return "测试";
  if (/开发|研发|前端|后端/.test(owner)) return owner.includes("前端") ? "前端" : owner.includes("后端") ? "后端" : "开发";
  if (/运营/.test(owner)) return "运营";
  if (/数据/.test(owner)) return "数据";
  if (/客户/.test(owner)) return "客户成功";
  if (/销售/.test(owner)) return "销售";
  if (/培训/.test(owner)) return "培训";
  if (/导师/.test(owner)) return "业务导师";
  if (/团队/.test(owner)) return "团队负责人";
  return cleanInlineText(owner) || "待确认";
}

function cleanTaskTitle(value = "") {
  return cleanInlineText(value)
    .replace(/^并?/, "")
    .replace(/^(完成|整理|补充|准备|确认|评估)(.+)/, "$1$2")
    .replace(/，?$/g, "")
    .trim();
}

function extractDue(text, day) {
  const regex = new RegExp(`(\\d{1,2})\\s*月\\s*${day}\\s*日`);
  const match = text.match(regex);
  return match ? `${match[1]} 月 ${day} 日` : "";
}

function extractRoleDue(text, roleRegex) {
  const sentences = normalizeLineBreaks(text).split(/[。；\n]/);
  const sentence = sentences.find((item) => roleRegex.test(item) && /\d{1,2}\s*月\s*\d{1,2}\s*日/.test(item));
  const match = sentence?.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  return match ? `${match[1]} 月 ${match[2]} 日` : "";
}


function generateFollowMessage(meeting) {
  const decisions = meeting.minutes?.decisions || [];
  const tasks = meeting.tasks || [];
  const decisionText = decisions.map((item, index) => `${index + 1}. ${cleanInlineText(item)}`).join("\n");
  const taskText = tasks
    .map((task) => `- ${task.owner}：${task.title}，截止时间 ${task.due || "待确认"}，优先级 ${task.priority}`)
    .join("\n");

  return cleanBlockText(
    `各位好，${meeting.title} 已完成会后同步。\n\n会议结论：\n${decisionText || "1. 会议结论待补充。"}\n\n待办事项：\n${taskText || "- 暂无明确待办。"}\n\n请相关负责人按截止时间推进，如有变化请及时同步。`
  );
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function fillPrepSample() {
  const sample = getRandomDemoSample();
  setPrepMode("advanced", false);
  $("#meetingTitle").value = sample.title;
  $("#meetingType").value = sample.type;
  $("#customMeetingType").value = "";
  setMeetingDateTime(sample.time);
  $("#meetingAttendees").value = sample.attendees;
  $("#meetingHost").value = sample.host;
  $("#meetingDeliverable").value = sample.deliverable;
  $("#meetingDecisionMethod").value = sample.decisionMethod;
  $("#meetingCadence").value = sample.cadence;
  participantRoles = normalizeParticipantRoles(sample.participantRoles);
  renderParticipantRoles();
  $("#meetingGoal").value = sample.goal;
  $("#meetingDecisionItems").value = sample.decisionItems;
  $("#meetingContext").value = sample.context;
  $("#prepOutput").classList.add("empty");
  $("#prepOutput").innerHTML = buildEmptyState({
    badge: "01",
    title: "填写会议信息后，生成结构化会前准备。",
    description: "输出将包含会议目标摘要、建议议程、参会人准备清单、关键问题和风险提醒。生成后会自动保存，后续可直接进入会后跟进。",
    actionLabel: "继续填写",
    actionView: "prep",
  });
  window.currentPrepBrief = null;
  window.currentPrepSource = "";
  showToast(`已随机填入示例：${sample.title}`);
}

function clearPrepForm() {
  $("#meetingForm").reset();
  setMeetingDateTime("");
  participantRoles = [];
  renderParticipantRoles();
  $("#prepOutput").classList.add("empty");
  $("#prepOutput").innerHTML = buildEmptyState({
    badge: "01",
    title: "填写会议信息后，生成结构化会前准备。",
    description: "输出将包含会议目标摘要、建议议程、参会人准备清单、关键问题和风险提醒。生成后会自动保存，后续可直接进入会后跟进。",
    actionLabel: "继续填写",
    actionView: "prep",
  });
  window.currentPrepBrief = null;
  window.currentPrepSource = "";
}

function clearReviewPanel() {
  reviewMode = "transcript";
  $$(".mode-chip").forEach((button) => button.classList.toggle("active", button.dataset.reviewMode === "transcript"));
  $("#meetingTranscript").value = "";
  $("#meetingTranscript").placeholder = "粘贴会议转写文本或手动会议记录";
  $("#transcriptSource").value = "腾讯会议转写";
  $("#transcriptFileInput").value = "";
  resetMinutesOutput();
  resetFollowMessageOutput();
  showToast("会后记录已清空");
}

async function handleTranscriptFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const fileName = file.name.toLowerCase();
  if (!/\.(txt|md)$/.test(fileName)) {
    showToast("当前仅支持 .txt / .md 文本文件");
    event.target.value = "";
    return;
  }
  try {
    const text = await file.text();
    $("#meetingTranscript").value = cleanBlockText(text);
    showToast("转写文件已导入");
  } catch (error) {
    console.warn(error);
    showToast("文件读取失败，请改用复制粘贴");
  }
}

function getCurrentPrepBrief() {
  const output = $("#prepOutput");
  if (output.classList.contains("empty")) return null;
  return window.currentPrepBrief || null;
}

function saveMeetingFromForm(options = {}) {
  const { silent = false } = options;
  const data = getFormData();
  if (!data.title || !data.goal) {
    showToast("请先填写会议主题和会议目标");
    return null;
  }

  if (hasPrivateContent(data)) {
    if (!silent) {
      showToast("检测到个人面试内容，本地未保存");
    }
    return null;
  }

  const existing = state.meetings.find((meeting) => meeting.title === data.title);
  const meeting = {
    ...(existing || { id: createId("meeting"), tasks: [] }),
    ...data,
    prepBrief: getCurrentPrepBrief() || generatePrepBrief(data),
    prepSource: window.currentPrepSource || existing?.prepSource || "local",
  };

  if (existing) {
    state.meetings = state.meetings.map((item) => (item.id === existing.id ? meeting : item));
  } else {
    state.meetings.unshift(meeting);
  }

  state.selectedMeetingId = meeting.id;
  saveState();
  render();
  if (!silent) {
    showToast("会议已保存");
  }
  return meeting;
}

async function handleGeneratePrep() {
  const data = getFormData();
  if (!data.title || !data.goal) {
    showToast("请至少填写会议主题和会议目标");
    return;
  }

  const output = $("#prepOutput");
  output.classList.remove("empty");
  output.classList.add("loading");
  output.innerHTML = `<div class="empty-state"><span class="empty-state-icon">${renderIcon("ai")}</span><h4>正在调用 DeepSeek 生成并保存会议...</h4><p>系统会根据会议目标、参会角色和会议上下文输出结构化简报，生成后自动进入可复盘状态。</p></div>`;

  const fallback = generatePrepBrief(data);
  try {
    const aiResult = await requestAI("prep", data);
    const brief = normalizePrepBrief(aiResult, fallback);
    window.currentPrepBrief = brief;
    window.currentPrepSource = "deepseek";
    renderPrepOutput(brief);
    const savedMeeting = saveMeetingFromForm({ silent: true });
    showToast(savedMeeting ? "DeepSeek 已生成并保存会议" : "DeepSeek 已生成，检测到个人内容未保存");
  } catch (error) {
    console.warn(error);
    window.currentPrepBrief = fallback;
    window.currentPrepSource = "fallback";
    renderPrepOutput(fallback);
    const savedMeeting = saveMeetingFromForm({ silent: true });
    showToast(savedMeeting ? "AI 接口暂不可用，已生成并保存本地结果" : "已生成本地结果，检测到个人内容未保存");
  } finally {
    output.classList.remove("loading");
  }
}

async function handleGenerateMinutes() {
  const meeting = getSelectedMeeting();
  const transcript = $("#meetingTranscript").value.trim();
  const transcriptSource = $("#transcriptSource").value || "腾讯会议转写";
  if (!meeting) {
    showToast("请先创建或选择会议");
    return;
  }
  if (!transcript) {
    showToast("请先输入会议记录");
    return;
  }

  const output = $("#minutesOutput");
  output.classList.remove("empty");
  output.classList.add("loading");
  output.innerHTML = `<div class="empty-state"><span class="empty-state-icon">${renderIcon("ai")}</span><h4>正在调用 DeepSeek 提取纪要和待办...</h4><p>系统会识别关键结论、风险和 Action Items。</p></div>`;

  const fallback = generateMinutes(transcript);
  const meetingWithSource = { ...meeting, transcriptSource };
  try {
    const aiResult = await requestAI("minutes", { meeting: meetingWithSource, transcript, reviewMode, transcriptSource });
    const result = normalizeMinutesResult(aiResult, fallback);
    const updated = {
      ...meeting,
      transcript,
      transcriptSource,
      minutes: result.minutes,
      tasks: result.tasks,
      minutesSource: "deepseek",
    };
    updated.followMessage = generateFollowMessage(updated);
    updated.followSource = "local";
    state.meetings = state.meetings.map((item) => (item.id === meeting.id ? updated : item));
    saveState();
    renderMinutesOutput(updated);
    render();
    showToast("DeepSeek 已生成会议纪要");
  } catch (error) {
    console.warn(error);
    const updated = {
      ...meeting,
      transcript,
      transcriptSource,
      minutes: fallback.minutes,
      tasks: fallback.tasks,
      minutesSource: "fallback",
    };
    updated.followMessage = generateFollowMessage(updated);
    updated.followSource = "local";
    state.meetings = state.meetings.map((item) => (item.id === meeting.id ? updated : item));
    saveState();
    renderMinutesOutput(updated);
    render();
    showToast("AI 接口暂不可用，已使用本地模拟输出");
  } finally {
    output.classList.remove("loading");
  }
}

function updateTaskStatus(meetingId, taskId, status) {
  state.meetings = state.meetings.map((meeting) => {
    if (meeting.id !== meetingId) return meeting;
    return {
      ...meeting,
      tasks: (meeting.tasks || []).map((task) => (task.id === taskId ? { ...task, status } : task)),
    };
  });
  saveState();
  render();
}

async function copyText(text, successText) {
  const normalizedText = cleanBlockText(text);
  if (!normalizedText) {
    showToast("暂无可复制内容");
    return;
  }

  try {
    await navigator.clipboard.writeText(normalizedText);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = normalizedText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast(successText);
}

function formatPlainList(items = [], numbered = false) {
  return items.map((item, index) => `${numbered ? `${index + 1}.` : "-"} ${cleanInlineText(item)}`).join("\n");
}

function formatParticipantRoles(items = []) {
  const roles = normalizeParticipantRoles(items);
  if (!roles.length) return "- 待确认";
  return roles
    .map((item) => `- ${item.required}｜${item.role || "参会角色"}${item.name ? `（${item.name}）` : ""}：${item.prep || "会前准备待确认"}`)
    .join("\n");
}

function getPrepPlainText() {
  const data = getFormData();
  const brief = window.currentPrepBrief || getSelectedMeeting()?.prepBrief;
  if (!brief) return "";
  const meeting = getSelectedMeeting();
  return cleanBlockText(
    [
      "【会前准备简报】",
      `会议主题：${data.title || meeting?.title || ""}`,
      `会议类型：${data.type || meeting?.type || "待确认"}`,
      `会议时间：${data.time || meeting?.time || "待确认"}`,
      `参会人：${data.attendees || meeting?.attendees || "待确认"}`,
      `主持人/汇报人：${data.host || meeting?.host || "待确认"}`,
      `决策方式：${data.decisionMethod || meeting?.decisionMethod || "待确认"}`,
      `会议节奏：${data.cadence || meeting?.cadence || "待确认"}`,
      `参会角色：\n${formatParticipantRoles(data.participantRoles?.length ? data.participantRoles : meeting?.participantRoles || [])}`,
      `需决策事项：${data.decisionItems || meeting?.decisionItems || "待确认"}`,
      `预期输出物：${data.deliverable || meeting?.deliverable || "待确认"}`,
      `会议目标摘要：${brief.summary}`,
      `建议议程：\n${formatPlainList(brief.agenda, true)}`,
      `参会人准备清单：\n${formatPlainList(brief.checklist)}`,
      `关键讨论问题：\n${formatPlainList(brief.questions)}`,
      `潜在风险提醒：\n${formatPlainList(brief.risks)}`,
      `预期会议产出：\n${formatPlainList(brief.outcomes)}`,
    ].join("\n\n")
  );
}

function getMinutesPlainText() {
  const meeting = getSelectedMeeting();
  if (!meeting?.minutes) return "";
  return cleanBlockText(
    [
      "【会议纪要】",
      `会议主题：${meeting.title}`,
      `会议类型：${meeting.type || "待确认"}`,
      `主持人/汇报人：${meeting.host || "待确认"}`,
      `会议摘要：${meeting.minutes.summary}`,
      `关键结论：\n${formatPlainList(meeting.minutes.decisions, true)}`,
      `未决事项：\n${formatPlainList(meeting.minutes.openItems)}`,
      `风险提醒：\n${formatPlainList(meeting.minutes.risks)}`,
      `待办事项：\n${(meeting.tasks || [])
        .map((task) => `- ${task.owner}｜${task.title}｜${task.due}｜${task.priority}｜${task.status}`)
        .join("\n")}`,
    ].join("\n\n")
  );
}

function bindEvents() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });
  $$("[data-switch-view]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.switchView));
  });

  $("#openGuideButton").addEventListener("click", openGuideModal);
  $("#closeGuideButton").addEventListener("click", closeGuideModal);
  $("#guideModal").addEventListener("click", (event) => {
    if (event.target.id === "guideModal") closeGuideModal();
  });
  $("#closeTextModalButton").addEventListener("click", closeTextModal);
  $("#closeTextModalSecondaryButton").addEventListener("click", closeTextModal);
  $("#textModal").addEventListener("click", (event) => {
    if (event.target.id === "textModal") closeTextModal();
  });
  $("#copyTextModalButton").addEventListener("click", () => copyText(textModalCopy, "预览内容已复制"));

  $("#loadPrepSampleButton").addEventListener("click", fillPrepSample);
  $("#clearPrepButton").addEventListener("click", clearPrepForm);
  $("#generatePrepButton").addEventListener("click", handleGeneratePrep);
  $("#meetingDate").addEventListener("input", getMeetingDateTime);
  $("#meetingClock").addEventListener("input", getMeetingDateTime);
  $("#saveMeetingButton").addEventListener("click", saveMeetingFromForm);
  $("#copyPrepButton").addEventListener("click", () => copyText(getPrepPlainText(), "会前简报已复制"));
  $("#expandPrepButton").addEventListener("click", () => openTextModal("会前准备简报", getPrepPlainText(), "简报"));
  $("#suggestRolesButton").addEventListener("click", suggestParticipantRoles);
  $("#addRoleButton").addEventListener("click", () => addParticipantRole());
  $("#meetingSearchInput").addEventListener("input", (event) => {
    meetingSearchQuery = event.target.value;
    renderMeetings();
  });

  $("#loadReviewSampleButton").addEventListener("click", () => {
    const sample = getRandomDemoSample();
    $("#transcriptSource").value = "腾讯会议转写";
    $("#meetingTranscript").value = sample.transcript;
    showToast(`已随机填入记录：${sample.title}`);
  });
  $("#transcriptFileInput").addEventListener("change", handleTranscriptFileImport);
  $("#transcriptSource").addEventListener("change", (event) => {
    if (event.target.value === "手动会议记录") {
      reviewMode = "manual";
      $$(".mode-chip").forEach((button) => button.classList.toggle("active", button.dataset.reviewMode === "manual"));
      $("#meetingTranscript").placeholder = "用要点形式记录会议摘要、结论、风险和待办，例如：结论：... 待办：...";
      showToast("已按手动记录优化纪要理解");
    }
  });
  $("#reviewMeetingSelect").addEventListener("change", (event) => {
    state.selectedMeetingId = event.target.value;
    const selected = getSelectedMeeting();
    $("#meetingTranscript").value = selected.transcript || "";
    $("#transcriptSource").value = selected.transcriptSource || "腾讯会议转写";
    if (selected.minutes) renderMinutesOutput(selected);
    saveState();
    render();
  });
  $("#generateMinutesButton").addEventListener("click", handleGenerateMinutes);
  $("#clearReviewButton").addEventListener("click", clearReviewPanel);
  $("#generateFollowMessageButton").addEventListener("click", async () => {
    const meeting = getSelectedMeeting();
    if (!meeting?.minutes) {
      showToast("请先生成会议纪要");
      return;
    }
    try {
      const aiResult = await requestAI("follow", { meeting });
      meeting.followMessage = cleanBlockText(aiResult?.message || "") || generateFollowMessage(meeting);
      meeting.followSource = "deepseek";
      showToast("DeepSeek 已生成跟进消息");
    } catch (error) {
      console.warn(error);
      meeting.followMessage = generateFollowMessage(meeting);
      meeting.followSource = "fallback";
      showToast("AI 接口暂不可用，已使用本地模拟消息");
    }
    saveState();
    renderFollowMessage();
  });
  $("#copyMinutesButton").addEventListener("click", () => copyText(getMinutesPlainText(), "会议纪要已复制"));
  $("#copyFollowMessageButton").addEventListener("click", () => copyText($("#followMessageOutput").value, "跟进消息已复制"));
  $("#expandMinutesButton").addEventListener("click", () => openTextModal("会议纪要与待办", getMinutesPlainText(), "纪要"));
  $("#expandFollowButton").addEventListener("click", () => {
    if ($("#expandFollowButton").disabled) return;
    openTextModal("会后同步消息", $("#followMessageOutput").value, "消息");
  });

  document.addEventListener("click", (event) => {
    const switchButton = event.target.closest("[data-switch-view]");
    if (switchButton) {
      switchView(switchButton.dataset.switchView);
    }

    const clearSearchButton = event.target.closest("[data-clear-search]");
    if (clearSearchButton) {
      meetingSearchQuery = "";
      $("#meetingSearchInput").value = "";
      renderMeetings();
    }

    const modeButton = event.target.closest("[data-review-mode]");
    if (modeButton) {
      reviewMode = modeButton.dataset.reviewMode;
      $$(".mode-chip").forEach((button) => button.classList.toggle("active", button === modeButton));
      $("#meetingTranscript").placeholder =
        reviewMode === "manual"
          ? "用要点形式记录会议摘要、结论、风险和待办，例如：结论：... 待办：..."
          : "粘贴会议转写文本或手动会议记录";
      if (reviewMode === "manual") {
        $("#transcriptSource").value = "手动会议记录";
      } else if ($("#transcriptSource").value === "手动会议记录") {
        $("#transcriptSource").value = "腾讯会议转写";
      }
      showToast(reviewMode === "manual" ? "已切换为手动纪要模式" : "已切换为转写粘贴模式");
    }

    const prepModeButton = event.target.closest("[data-prep-mode]");
    if (prepModeButton) {
      setPrepMode(prepModeButton.dataset.prepMode);
    }

    const addTaskButton = event.target.closest("[data-add-task]");
    if (addTaskButton) {
      addTask(addTaskButton.dataset.addTask || state.selectedMeetingId);
    }

    const deleteTaskButton = event.target.closest("[data-delete-task]");
    if (deleteTaskButton) {
      deleteTask(deleteTaskButton.dataset.meetingId, deleteTaskButton.dataset.deleteTask);
    }

    const remindTaskButton = event.target.closest("[data-remind-task]");
    if (remindTaskButton) {
      copyTaskReminder(remindTaskButton.dataset.meetingId, remindTaskButton.dataset.remindTask);
    }

    const removeRoleButton = event.target.closest("[data-remove-role]");
    if (removeRoleButton) {
      removeParticipantRole(removeRoleButton.dataset.removeRole);
    }

    const deleteMeetingButton = event.target.closest("[data-delete-meeting]");
    if (deleteMeetingButton) {
      deleteMeeting(deleteMeetingButton.dataset.deleteMeeting);
    }

    const archiveButton = event.target.closest("[data-toggle-archive]");
    if (archiveButton) {
      toggleMeetingArchive(archiveButton.dataset.toggleArchive);
    }

    const reviewButton = event.target.closest("[data-open-review]");
    if (reviewButton) {
      state.selectedMeetingId = reviewButton.dataset.openReview;
      const selected = getSelectedMeeting();
      $("#meetingTranscript").value = selected.transcript || "";
      saveState();
      render();
      switchView("review");
    }
  });

  document.addEventListener("input", (event) => {
    const editableOutput = event.target.closest(".editable-output");
    if (editableOutput) {
      updateEditableOutput(
        editableOutput.dataset.editScope,
        editableOutput.dataset.editField,
        editableOutput.value,
        editableOutput.dataset.editType
      );
      return;
    }

    if (event.target.id === "followMessageOutput") {
      updateFollowMessage(event.target.value);
      return;
    }

    const taskInput = event.target.closest(".task-edit-input");
    if (taskInput) {
      updateTaskField(taskInput.dataset.meetingId, taskInput.dataset.taskId, taskInput.dataset.taskField, taskInput.value, false);
    }
  });

  document.addEventListener("change", (event) => {
    const taskControl = event.target.closest("[data-task-field]");
    if (taskControl) {
      updateTaskField(taskControl.dataset.meetingId, taskControl.dataset.taskId, taskControl.dataset.taskField, taskControl.value);
      showToast("待办已更新");
    }
  });

  $$(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      taskFilter = button.dataset.taskFilter;
      $$(".filter-chip").forEach((item) => item.classList.toggle("active", item === button));
      renderTaskTable();
    });
  });
}

function openGuideModal() {
  const modal = $("#guideModal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeGuideModal() {
  const modal = $("#guideModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openTextModal(title, text, copyLabel = "内容") {
  const normalizedText = cleanBlockText(text);
  if (!normalizedText) {
    showToast("暂无可预览内容");
    return;
  }
  textModalCopy = normalizedText;
  $("#textModalTitle").textContent = title;
  $("#textModalContent").value = normalizedText;
  $("#copyTextModalButton").innerHTML = `${renderIcon("copy")}复制${copyLabel}`;
  const modal = $("#textModal");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeTextModal() {
  const modal = $("#textModal");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if ($("#guideModal")?.classList.contains("show")) {
    closeGuideModal();
  }
  if ($("#textModal")?.classList.contains("show")) {
    closeTextModal();
  }
});

function init() {
  saveState();
  renderParticipantRoles();
  setPrepMode("quick", false);
  bindEvents();
  render();
  switchView(activeView);
}

init();
