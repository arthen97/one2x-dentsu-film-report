/* 看板数据源：由飞书多维表格「任务进度」「会议安排」导出（2026-11-05 快照） */
window.BOARD_DATA = {
  snapshot: "2026-11-05",
  projects: {
    IRIS: {
      label: "IRIS",
      note: "已有积淀与反馈，进度较快；双线中优先推进。"
    },
    KAIROS: {
      label: "KAIROS",
      note: "起步晚于 IRIS；节奏以 11/05 细节沟通确认为准。"
    }
  },
  tasks: [
    {
      id: "reczz28VVs8SK95n",
      project: "IRIS",
      name: "IRIS 主题宣传片（约 60 秒）",
      short: "主题宣传片 · 60 秒",
      type: "宣传片",
      priority: "高",
      status: "进行中",
      progress: 0.3,
      start: "2026-11-04",
      draftDue: "2026-11-15",
      finalDue: "2026-11-22",
      note: "已有积淀和反馈，进度较快，两条线中优先推进。"
    },
    {
      id: "reczz28VVs8SMzY7",
      project: "KAIROS",
      name: "KAIROS 主题宣传片（约 60 秒）",
      short: "主题宣传片 · 60 秒",
      type: "宣传片",
      priority: "高",
      status: "未开始",
      progress: null,
      start: "2026-11-05",
      draftDue: "2026-11-15",
      finalDue: "2026-11-22",
      note: "优先级高；起步晚于 IRIS，节奏以 11/5 细节沟通确认为准。"
    },
    {
      id: "reczz28VVs8SNHJy",
      project: "KAIROS",
      name: "KAIROS 现场演示脚本 · 对话模式",
      short: "演示脚本 · 对话模式",
      type: "演示脚本",
      priority: "高",
      status: "未开始",
      progress: null,
      start: "2026-11-05",
      draftDue: "2026-11-15",
      finalDue: "2026-11-22",
      note: "演示脚本三方向之一（One2X 团队设计）；配套演示类视频需等 PPT 出来后启动。"
    },
    {
      id: "reczz28VVs8SLrll",
      project: "KAIROS",
      name: "KAIROS 现场演示脚本 · 模版模式",
      short: "演示脚本 · 模版模式",
      type: "演示脚本",
      priority: "高",
      status: "未开始",
      progress: null,
      start: "2026-11-05",
      draftDue: "2026-11-15",
      finalDue: "2026-11-22",
      note: "演示脚本三方向之二（One2X 团队设计）；配套演示类视频需等 PPT 出来后启动。"
    },
    {
      id: "reczz28VVs8SN1oT",
      project: "KAIROS",
      name: "KAIROS 现场模型选择方案",
      short: "模型选择方案",
      type: "演示脚本",
      priority: "高",
      status: "未开始",
      progress: 0,
      start: "2026-11-05",
      draftDue: "2026-11-15",
      finalDue: "2026-11-22",
      note: "演示脚本三方向之三；配套演示类视频需等 PPT 出来后启动。"
    }
  ],
  meetings: [
    {
      id: "reczz28VVsKT4ktF",
      name: "第一次细节沟通（项目启动对齐）",
      short: "细节沟通 · 启动对齐",
      type: "细节沟通",
      date: "2026-11-05",
      status: "待预约",
      note: "对齐 KAIROS / IRIS 排期节奏、PPT 时间与演示类视频启动点。"
    },
    {
      id: "reczz28VVsKT5Ync",
      name: "看片会 & 进度成果展示 #1",
      short: "看片会 #1",
      type: "看片会 / 进度展示",
      date: "2026-11-06",
      status: "待预约",
      note: "每周 2 次（暂定周二、周五），具体时间以实际预约为准。"
    },
    {
      id: "reczz28VVsKT1iDv",
      name: "看片会 & 进度成果展示 #2",
      short: "看片会 #2",
      type: "看片会 / 进度展示",
      date: "2026-11-10",
      status: "待预约",
      note: "每周 2 次（暂定周二、周五）。"
    },
    {
      id: "reczz28VVsKT3KZP",
      name: "看片会 & 进度成果展示 #3",
      short: "看片会 #3",
      type: "看片会 / 进度展示",
      date: "2026-11-13",
      status: "待预约",
      note: "每周 2 次（暂定周二、周五）。"
    },
    {
      id: "reczz28VVsKT3xmz",
      name: "看片会 & 进度成果展示 #4",
      short: "看片会 #4",
      type: "看片会 / 进度展示",
      date: "2026-11-17",
      status: "待预约",
      note: "每周 2 次（暂定周二、周五）。"
    },
    {
      id: "reczz28VVsKT27aN",
      name: "看片会 & 进度成果展示 #5",
      short: "看片会 #5",
      type: "看片会 / 进度展示",
      date: "2026-11-20",
      status: "待预约",
      note: "交付前最后一次看片会；全部交付截止 11/22。"
    }
  ]
};

/* 日期工具：全部按本地日历日处理，避免时区偏移 */
window.BD = (function () {
  const DAY = 86400000;
  function parse(s) {
    const p = String(s).split("-").map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function iso(d) {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }
  function addDays(s, n) {
    const d = parse(s);
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  function diff(a, b) {
    return Math.round((parse(b) - parse(a)) / DAY);
  }
  const WD = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return {
    parse: parse,
    iso: iso,
    addDays: addDays,
    diff: diff,
    md: function (s) {
      const d = parse(s);
      return d.getMonth() + 1 + "/" + String(d.getDate()).padStart(2, "0");
    },
    mdDot: function (s) {
      const d = parse(s);
      return (d.getMonth() + 1) + "." + String(d.getDate()).padStart(2, "0");
    },
    weekday: function (s) {
      return WD[parse(s).getDay()];
    },
    isWeekend: function (s) {
      const g = parse(s).getDay();
      return g === 0 || g === 6;
    }
  };
})();
