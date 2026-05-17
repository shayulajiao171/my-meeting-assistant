const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;
const DEEPSEEK_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";

loadEnv(path.join(ROOT, ".env"));

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/deepseek") {
      await handleDeepSeek(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: "Method Not Allowed" });
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "服务器内部错误" });
  }
});

server.listen(PORT, () => {
  console.log(`Meeting assistant running at http://localhost:${PORT}`);
});

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, normalized);

  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(res, 404, "Not Found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

async function handleDeepSeek(req, res) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: "缺少 DEEPSEEK_API_KEY，请在 .env 或环境变量中配置" });
    return;
  }

  const body = await readJson(req);
  const { type, payload } = body;
  const messages = buildMessages(type, payload);

  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.25,
      max_tokens: 1800,
      response_format: { type: "json_object" },
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    sendJson(res, response.status, {
      error: result.error?.message || "DeepSeek API 请求失败",
    });
    return;
  }

  const content = result.choices?.[0]?.message?.content || "";
  const parsed = sanitizeModelResult(parseJsonContent(content));
  sendJson(res, 200, { result: parsed });
}

function buildMessages(type, payload = {}) {
  const system = [
    "你是一个中文办公效率产品中的视频会议 AI 助手。",
    "你的输出必须严格是 JSON 对象，不要 Markdown，不要解释，不要代码块。",
    "不要在 JSON 字符串里输出字面量 \\n；需要分点时必须使用数组字段。",
    "所有内容要具体、可执行、适合真实办公场景。",
    "请根据会议类型、会议主题和会议目标选择不同分析角度，避免所有会议都输出同一套泛泛模板。",
    "不要编造用户没有提供的关键事实；如果负责人或时间不明确，请写“待确认”。",
  ].join("\n");

  if (type === "prep") {
    const strategy = getMeetingStrategy(payload);
    return [
      { role: "system", content: system },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "根据会议信息生成专业、细致、可执行的会前准备。",
            meeting_type_strategy: strategy,
            quality_rules: [
              "先判断会议属于面试、需求评审、项目同步、复盘、客户沟通、商务沟通、培训分享或通用会议中的哪一种，再选择对应角度。",
              "如果是面试准备类会议，默认当前用户是候选人，请从候选人准备回答、项目讲法、风险解释和反问问题的角度输出；除非用户明确说明自己是招聘方，不要写面试官评估候选人的视角。",
              "议程不要只写“讨论问题、明确待办”，要结合会议主题写出真实会问到或需要确认的事项。",
              "如果用户提供了决策方式、会议节奏或参会角色规划，必须体现在议程、准备清单和关键问题中。",
              "参会人准备清单要尽量按角色写清楚每个人/每类角色会前需要准备什么，而不是泛泛写“提前准备材料”。",
              "关键问题要能直接拿去开会使用，最好体现取舍、风险、验证标准和下一步动作。",
              "不要仅凭公司名推断行业背景；如用户没有提供行业信息，请写成“待确认/可提前了解”。",
              "如信息不足，可以提出待确认问题，但不要虚构数据、负责人或业务事实。",
            ],
            output_schema: {
              summary: "会议目标摘要，1句话",
              agenda: ["建议议程，4-6条"],
              checklist: ["参会人准备清单，3-6条"],
              questions: ["关键讨论问题，3-5条"],
              risks: ["潜在风险提醒，2-4条"],
              outcomes: ["预期会议产出，2-4条"],
            },
            meeting: payload,
          },
          null,
          2
        ),
      },
    ];
  }

  if (type === "minutes") {
    const strategy = getMeetingStrategy(payload.meeting);
    return [
      { role: "system", content: system },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "根据会议记录生成结构化会议纪要，并提取待办事项。",
            meeting_type_strategy: strategy,
            quality_rules: [
              "纪要必须体现本场会议的真实结论，而不是复述转写文本。",
              payload.reviewMode === "manual"
                ? "用户输入的是手动纪要，请尊重已有结构，重点补全结论、风险和待办，不要假装这是完整逐字转写。"
                : "用户输入的是转写/记录文本，请先归纳，再提炼结论和行动项。",
              `用户标注的转写来源是“${payload.transcriptSource || payload.meeting?.transcriptSource || "未标注"}”，请在理解文本时考虑视频会议转写常见问题：口语重复、发言人缺失、语义跳跃和待办口头化。`,
              "待办事项必须包含任务、负责人、截止时间、优先级；信息不明确时写“待确认”。",
              "凡是会议记录中出现“某负责人/某角色在某日期前完成某动作”的句子，都必须逐条提取为独立待办，不要漏掉测试、设计、数据、运营等非产品/开发角色。",
              "如果同一句话里连续出现多个负责人和截止时间，例如产品、设计、后端、测试分别在不同日期前完成任务，必须拆成多条 Action Items。",
              "风险提醒要结合会议类型：面试类关注准备缺口，需求类关注范围和验收，项目类关注依赖和延期，客户类关注异议和下一步推进。",
            ],
            output_schema: {
              minutes: {
                summary: "会议摘要，1-2句话",
                decisions: ["关键结论，3-5条"],
                openItems: ["未决事项，1-4条"],
                risks: ["风险提醒，1-4条"],
              },
              tasks: [
                {
                  title: "任务内容",
                  owner: "负责人，不明确则待确认",
                  due: "截止时间，不明确则待确认",
                  priority: "高/中/低",
                  status: "未开始",
                },
              ],
            },
            meeting: payload.meeting,
            transcript_source: payload.transcriptSource || payload.meeting?.transcriptSource,
            transcript: payload.transcript,
          },
          null,
          2
        ),
      },
    ];
  }

  if (type === "follow") {
    const strategy = getMeetingStrategy(payload.meeting);
    return [
      { role: "system", content: system },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: "根据会议纪要和待办事项生成一段可直接发送到工作群的会后同步消息。",
            meeting_type_strategy: strategy,
            quality_rules: [
              "语气专业、简洁、可直接复制发送。",
              "先同步结论，再列待办，最后提醒反馈或确认。",
              "不要输出 Markdown 标题，不要输出字面量 \\n。",
            ],
            output_schema: {
              message: "群聊简洁版跟进消息，包含会议结论和待办事项",
            },
            meeting: payload.meeting,
          },
          null,
          2
        ),
      },
    ];
  }

  throw new Error(`未知 AI 任务类型：${type}`);
}

function getMeetingStrategy(meeting = {}) {
  const text = [meeting.type, meeting.title, meeting.goal, meeting.context].filter(Boolean).join(" ");

  if (/面试|招聘|求职|岗位|候选人|offer/i.test(text)) {
    return {
      scene: "面试/招聘沟通",
      answer_angle: "默认从候选人准备面试的角度，围绕岗位匹配、个人经历证明、项目追问、风险解释和反问问题准备。",
      focus_points: ["岗位要求拆解", "个人经历与岗位能力匹配", "简历项目可追问点", "可能短板与应对话术", "反问问题和面试后跟进动作"],
    };
  }

  if (/需求|产品评审|PRD|原型|功能|MVP/i.test(text)) {
    return {
      scene: "产品需求/评审",
      answer_angle: "围绕用户问题、目标指标、范围取舍、交互流程、验收标准和风险边界。",
      focus_points: ["目标用户与核心痛点", "P0/P1 范围", "关键路径与异常状态", "验收标准", "上线风险和依赖"],
    };
  }

  if (/项目同步|进度|排期|里程碑|协同/i.test(text)) {
    return {
      scene: "项目同步",
      answer_angle: "围绕进度、阻塞、依赖、负责人、截止时间和跨部门协同。",
      focus_points: ["当前进度", "风险阻塞", "依赖方", "下一步责任人", "截止时间"],
    };
  }

  if (/复盘|版本|数据|增长|运营|活动/i.test(text)) {
    return {
      scene: "复盘/运营分析",
      answer_angle: "围绕目标达成、数据变化、用户反馈、问题归因和下一轮迭代。",
      focus_points: ["目标与结果对比", "关键数据或反馈", "问题归因", "保留/放弃的策略", "下一轮实验"],
    };
  }

  if (/客户|商务|销售|合作|路演|汇报/i.test(text)) {
    return {
      scene: "客户/商务沟通",
      answer_angle: "围绕客户诉求、决策链、异议处理、方案价值和下一步推进。",
      focus_points: ["客户核心诉求", "关键异议", "价值证明", "决策人和影响人", "下一步动作"],
    };
  }

  if (/培训|分享|宣讲|教学/i.test(text)) {
    return {
      scene: "培训/分享",
      answer_angle: "围绕听众基础、学习目标、案例设计、互动问题和课后行动。",
      focus_points: ["听众画像", "学习目标", "案例和演示", "互动问题", "课后材料或行动"],
    };
  }

  return {
    scene: "通用办公会议",
    answer_angle: "围绕目标、背景、约束、关键问题、决策事项和会后动作。",
    focus_points: ["会议目标", "背景约束", "待决策问题", "风险", "会后负责人和截止时间"],
  };
}

function sanitizeModelResult(value) {
  if (Array.isArray(value)) return value.map(sanitizeModelResult);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeModelResult(item)]));
  }
  if (typeof value !== "string") return value;
  return value
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\*\*/g, "").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseJsonContent(content) {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("模型输出不是合法 JSON");
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("请求体过大"));
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}
