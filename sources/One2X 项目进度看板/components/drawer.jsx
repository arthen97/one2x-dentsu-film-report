/* 详情抽屉：任务 / 会议 */

function StatusChips({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
      {["未开始", "进行中", "已完成"].map((s) => (
        <button
          key={s}
          className="tag"
          onClick={() => onChange(s)}
          style={
            value === s
              ? {
                  background: "var(--ink)",
                  color: "var(--card)",
                  borderColor: "var(--ink)"
                }
              : undefined
          }
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function TaskDrawer({ task, today, onClose, onProgress, onStatus }) {
  const D = window.BD;
  if (!task) return null;
  const pct = task.progress == null ? 0 : Math.round(task.progress * 100);
  const toDraft = D.diff(today, task.draftDue);
  const toFinal = D.diff(today, task.finalDue);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="drawer" role="dialog" aria-modal="true" aria-label={task.name}>
        <header className="dr-head">
          <div>
            <div className="kick">
              {task.project} · {task.type} · {task.id.slice(-6).toUpperCase()}
            </div>
            <h3>{task.name}</h3>
          </div>
          <button className="dr-close" onClick={onClose} aria-label="关闭">
            <IconClose size={15} />
          </button>
        </header>

        <div className="dr-body">
          <div className="tagrow">
            <span className={"tag pj " + task.project}>{task.project}</span>
            <span className="tag">{task.type}</span>
            <span className="tag hi">
              <IconFlag size={11} /> 优先级 {task.priority}
            </span>
            <span className="tag">{task.status}</span>
          </div>

          <div className="dr-mete">
            <div>
              <div className="k">距初版</div>
              <div className="v">{toDraft} 天</div>
            </div>
            <div>
              <div className="k">距终版</div>
              <div className="v">{toFinal} 天</div>
            </div>
            <div>
              <div className="k">完成度</div>
              <div className="v">{pct}%</div>
            </div>
          </div>

          <div className="progbox">
            <div className="progline">
              <b>{pct}%</b>
              <span>{task.progress == null ? "尚未填报进度" : "已填报"}</span>
            </div>
            <input
              className="slider"
              type="range"
              min="0"
              max="100"
              step="5"
              value={pct}
              onChange={(e) => onProgress(task.id, Number(e.target.value) / 100)}
              aria-label="调整完成度"
            />
            <div className="slider-scale">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div className="dr-sec">时间节点</div>
          <div className="datelist">
            <div className="dl-row">
              <span className="k">开始</span>
              <span className="v">
                {D.mdDot(task.start)}
                <em>{D.weekday(task.start)}</em>
              </span>
            </div>
            <div className="dl-row">
              <span className="k">初版截止</span>
              <span className={"v" + (toDraft <= 3 ? " warn" : "")}>
                {D.mdDot(task.draftDue)}
                <em>{D.weekday(task.draftDue)} · {toDraft >= 0 ? "剩 " + toDraft + " 天" : "已过"}</em>
              </span>
            </div>
            <div className="dl-row">
              <span className="k">最终交付</span>
              <span className="v">
                {D.mdDot(task.finalDue)}
                <em>{D.weekday(task.finalDue)} · 剩 {toFinal} 天</em>
              </span>
            </div>
          </div>

          <div className="dr-sec">当前状态</div>
          <StatusChips value={task.status} onChange={(s) => onStatus(task.id, s)} />

          <div className="dr-sec">备注</div>
          <div className="note-box">{task.note}</div>
        </div>

        <footer className="dr-foot">
          <button className="btn" onClick={() => onStatus(task.id, "已完成")}>
            {task.status === "已完成" ? "已标记交付" : "标记为已完成"}
          </button>
          <button className="btn ghost" onClick={onClose}>
            关闭
          </button>
        </footer>
      </section>
    </>
  );
}

function MeetingDrawer({ meeting, confirmed, onToggle, onClose }) {
  const D = window.BD;
  if (!meeting) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <section className="drawer" role="dialog" aria-modal="true" aria-label={meeting.name}>
        <header className="dr-head">
          <div>
            <div className="kick">
              会议 · {meeting.type} · {meeting.id.slice(-6).toUpperCase()}
            </div>
            <h3>{meeting.name}</h3>
          </div>
          <button className="dr-close" onClick={onClose} aria-label="关闭">
            <IconClose size={15} />
          </button>
        </header>
        <div className="dr-body">
          <div className="dr-mete">
            <div>
              <div className="k">日期</div>
              <div className="v">{D.mdDot(meeting.date)}</div>
            </div>
            <div>
              <div className="k">星期</div>
              <div className="v">{D.weekday(meeting.date)}</div>
            </div>
            <div>
              <div className="k">状态</div>
              <div className="v" style={{ color: confirmed ? "var(--moss)" : "var(--red)" }}>
                {confirmed ? "已确认" : "待预约"}
              </div>
            </div>
          </div>

          <div className="dr-sec">备注</div>
          <div className="note-box">{meeting.note}</div>

          <div className="dr-sec">预约状态</div>
          <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.8 }}>
            会议时间暂未落到具体时段，先在排期里占位。与相关同事对齐后，可在此标记为已确认。
          </p>
        </div>
        <footer className="dr-foot">
          <button className="btn" onClick={() => onToggle(meeting.id)}>
            {confirmed ? "恢复为待预约" : "标记为已确认"}
          </button>
          <button className="btn ghost" onClick={onClose}>
            关闭
          </button>
        </footer>
      </section>
    </>
  );
}

Object.assign(window, { TaskDrawer, MeetingDrawer, StatusChips });
