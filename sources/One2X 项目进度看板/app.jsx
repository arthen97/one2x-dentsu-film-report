/* 主应用 */
const { useState, useEffect, useMemo, useCallback } = React;
const D = window.BD;
const DATA = window.BOARD_DATA;
const STORE_KEY = "studio-board-2026-11";

const TABS = [
  { key: "ALL", label: "全部", dot: "" },
  { key: "IRIS", label: "IRIS", dot: "iris" },
  { key: "KAIROS", label: "KAIROS", dot: "kairos" }
];

function readStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function App() {
  const [tw, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const saved = useMemo(readStore, []);

  const [filter, setFilter] = useState("ALL");
  const [view, setView] = useState("timeline");
  const [progressOv, setProgressOv] = useState(saved.progress || {});
  const [statusOv, setStatusOv] = useState(saved.status || {});
  const [confirmed, setConfirmed] = useState(saved.confirmed || {});
  const [openTask, setOpenTask] = useState(null);
  const [openMeeting, setOpenMeeting] = useState(null);
  const [toast, setToast] = useState(null);

  /* 持久化 */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ progress: progressOv, status: statusOv, confirmed })
      );
    } catch (e) {}
  }, [progressOv, statusOv, confirmed]);

  /* Esc 关闭抽屉 */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenTask(null);
        setOpenMeeting(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const allTasks = useMemo(() => {
    return DATA.tasks.map((t) => ({
      ...t,
      status: statusOv[t.id] || t.status,
      progress: Object.prototype.hasOwnProperty.call(progressOv, t.id)
        ? progressOv[t.id]
        : t.progress
    }));
  }, [statusOv, progressOv]);

  const tasks = useMemo(
    () => (filter === "ALL" ? allTasks : allTasks.filter((t) => t.project === filter)),
    [allTasks, filter]
  );

  const counts = useMemo(() => {
    const c = { ALL: allTasks.length, IRIS: 0, KAIROS: 0 };
    allTasks.forEach((t) => { c[t.project] += 1; });
    return c;
  }, [allTasks]);

  const inProgress = tasks.filter((t) => t.status === "进行中").length;
  const notStarted = tasks.filter((t) => t.status === "未开始").length;
  const doneCount = tasks.filter((t) => t.status === "已完成").length;
  const confirmedCount = DATA.meetings.filter((m) => confirmed[m.id]).length;

  const toDraft = D.diff(DATA.snapshot, "2026-11-15");
  const toFinal = D.diff(DATA.snapshot, "2026-11-22");

  const setProgress = useCallback((id, v) => {
    setProgressOv((p) => ({ ...p, [id]: v }));
  }, []);

  const setStatus = useCallback(
    (id, s) => {
      setStatusOv((p) => ({ ...p, [id]: s }));
      if (s === "已完成") setProgressOv((p) => ({ ...p, [id]: 1 }));
      const task = DATA.tasks.find((t) => t.id === id);
      setToast((task ? task.short : "任务") + " → " + s);
    },
    []
  );

  const toggleMeeting = useCallback((id) => {
    setConfirmed((c) => {
      const next = { ...c };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
    setToast("会议预约状态已更新");
  }, []);

  const activeTask = openTask ? allTasks.find((t) => t.id === openTask) : null;
  const activeMeeting = openMeeting
    ? DATA.meetings.find((m) => m.id === openMeeting)
    : null;

  const projectNote =
    filter === "ALL"
      ? "双线并行：IRIS 已有积淀、优先推进；KAIROS 起步晚于 IRIS，节奏待 11/05 细节沟通确认。"
      : DATA.projects[filter].note;

  return (
    <div
      className={"app density-" + (tw.density || "regular")}
      style={{ "--red": tw.accent || "#C4402C" }}
    >
      {/* 顶栏 */}
      <div className="topbar">
        <div className="shell topbar-in">
          <div className="brand">
            <span className="brand-mark">
              <IconFilm size={15} />
            </span>
            <span className="brand-txt">
              <span className="brand-name">一生智能 · 内容制作台</span>
              <span className="brand-sub">Production Schedule</span>
            </span>
          </div>

          <nav className="topnav" aria-label="按项目筛选">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={"navbtn" + (filter === tab.key ? " on" : "")}
                onClick={() => setFilter(tab.key)}
              >
                {tab.dot && <span className={"dotp " + tab.dot} />}
                {tab.label}
                <span className="cnt">{String(counts[tab.key]).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>

          <div className="topbar-right">
            <div className="snapshot">
              <span className="lbl">数据快照</span>
              <b>2026.11.05</b>
            </div>
            <div className="viewswitch" role="group" aria-label="切换视图">
              <button
                className={view === "timeline" ? "on" : ""}
                onClick={() => setView("timeline")}
              >
                <IconTimeline size={14} /> <span className="vlabel">时间轴</span>
              </button>
              <button
                className={view === "board" ? "on" : ""}
                onClick={() => setView("board")}
              >
                <IconBoard size={14} /> <span className="vlabel">看板</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        {/* 报头 */}
        <header className="masthead">
          <div>
            <div className="eyebrow">
              <span>PRODUCTION SCHEDULE</span>
              <span className="rule" />
              <span>NOV 2026</span>
            </div>
            <h1>11 月交付排期</h1>
            <p>{projectNote}</p>
          </div>
          <div className="mast-side">
            <div className="count">
              {toFinal}
              <span>天后</span>
            </div>
            <div className="cap">最终交付 11.22 · 周日</div>
          </div>
        </header>

        {/* 指标条 */}
        <div className="metrics">
          <div className="metric">
            <div className="k">交付任务</div>
            <div className="v">
              {String(tasks.length).padStart(2, "0")}
              <small>项</small>
            </div>
            <div className="n">
              进行中 {String(inProgress).padStart(2, "0")} · 待启动{" "}
              {String(notStarted).padStart(2, "0")}
              {doneCount > 0 ? " · 已完成 " + String(doneCount).padStart(2, "0") : ""}
            </div>
          </div>
          <div className="metric">
            <div className="k">初版截止</div>
            <div className="v">
              11.15<small>周日</small>
            </div>
            <div className="n">剩 {toDraft} 天 · 全部任务同一关口</div>
          </div>
          <div className={"metric" + (toFinal <= 7 ? " alert" : "")}>
            <div className="k">最终交付</div>
            <div className="v">
              11.22<small>周日</small>
            </div>
            <div className="n">剩 {toFinal} 天 · 交付前看片会 11/20</div>
          </div>
          <div className="metric">
            <div className="k">会议安排</div>
            <div className="v">
              {String(DATA.meetings.length).padStart(2, "0")}
              <small>场</small>
            </div>
            <div className="n">
              待预约 {DATA.meetings.length - confirmedCount} · 已确认 {confirmedCount}
            </div>
          </div>
        </div>

        {/* 主体 */}
        <div className="layout">
          <main className="maincol">
            {view === "timeline" ? (
              <>
                <div className="sec-head">
                  <h2>交付时间轴</h2>
                  <span className="meta">11.03 — 11.24 · {tasks.length} 项任务</span>
                  <span className="spacer" />
                  <div className="legend">
                    <span className="lg"><i className="draft" />初版阶段</span>
                    <span className="lg"><i className="tail" />初版后修订</span>
                    <span className="lg"><i className="mark" />交付关口</span>
                    <span className="lg"><i className="today" />今天 11/05</span>
                  </div>
                </div>

                <Timeline
                  tasks={tasks}
                  meetings={DATA.meetings}
                  today={DATA.snapshot}
                  density={tw.density}
                  confirmed={confirmed}
                  selectedMeeting={openMeeting}
                  onOpenTask={setOpenTask}
                  onOpenMeeting={setOpenMeeting}
                  showMeetings={tw.showMeetings !== false}
                />

                <div className="sec-head" style={{ marginTop: 32 }}>
                  <h2>任务清单</h2>
                  <span className="meta">
                    {String(tasks.length).padStart(2, "0")} 项 · 点开查看备注
                  </span>
                  <span className="spacer" />
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    完成度可拖动更新，仅保存在本机
                  </span>
                </div>

                <div className="tasklist">
                  {tasks.map((t, i) => (
                    <TaskRow key={t.id} task={t} index={i} onOpen={setOpenTask} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="sec-head">
                  <h2>状态看板</h2>
                  <span className="meta">{tasks.length} 项 · 三列状态</span>
                  <span className="spacer" />
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    拖动卡片即可更改任务状态
                  </span>
                </div>
                <Kanban tasks={tasks} onOpen={setOpenTask} onMove={setStatus} />
              </>
            )}
          </main>

          <MeetingsRail
            meetings={DATA.meetings}
            today={DATA.snapshot}
            confirmed={confirmed}
            selected={openMeeting}
            onToggle={toggleMeeting}
            onOpen={setOpenMeeting}
          />
        </div>
      </div>

      {activeTask && (
        <TaskDrawer
          task={activeTask}
          today={DATA.snapshot}
          onClose={() => setOpenTask(null)}
          onProgress={setProgress}
          onStatus={setStatus}
        />
      )}
      {activeMeeting && (
        <MeetingDrawer
          meeting={activeMeeting}
          confirmed={!!confirmed[activeMeeting.id]}
          onToggle={toggleMeeting}
          onClose={() => setOpenMeeting(null)}
        />
      )}

      {toast && (
        <div className="toast">
          <IconCheck size={14} />
          {toast}
        </div>
      )}

      <TweaksPanel title="风格">
        <TweakSection label="颜色" />
        <TweakColor
          label="强调色"
          value={tw.accent}
          options={["#C4402C", "#2F5D8A", "#A85A1E"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakSection label="版式" />
        <TweakRadio
          label="行高密度"
          value={tw.density}
          options={[
            { label: "紧凑", value: "compact" },
            { label: "常规", value: "regular" },
            { label: "宽松", value: "roomy" }
          ]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSection label="内容" />
        <TweakToggle
          label="时间轴会议刻度"
          value={tw.showMeetings !== false}
          onChange={(v) => setTweak("showMeetings", v)}
        />
      </TweaksPanel>
    </div>
  );
}

window.BoardApp = App;
