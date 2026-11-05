/* 交付时间轴：两段式任务条（初版阶段实心 / 终版阶段斜纹） + 会议刻度 + 今天游标 */

function Timeline(props) {
  const { tasks, meetings, today, onOpenTask, onOpenMeeting, selectedMeeting, confirmed, density, showMeetings } = props;
  const D = window.BD;

  /* 轴范围：最早开始前一天 → 最晚交付后两天 */
  const starts = tasks.map((t) => t.start).concat(meetings.map((m) => m.date)).concat([today]);
  const ends = tasks.map((t) => t.finalDue).concat(meetings.map((m) => m.date)).concat([today]);
  const axisStart = D.addDays(starts.slice().sort()[0], -1);
  const axisEnd = D.addDays(ends.slice().sort().slice(-1)[0], 2);
  const total = Math.max(1, D.diff(axisStart, axisEnd));
  const draftGate = tasks.length ? tasks.map((t) => t.draftDue).sort()[0] : null;
  const finalGate = tasks.length ? tasks.map((t) => t.finalDue).sort().slice(-1)[0] : null;

  const dayAt = (d) => (D.diff(axisStart, d) + 0.5) / total * 100;
  const dayStart = (d) => D.diff(axisStart, d) / total * 100;
  const dayEnd = (d) => (D.diff(axisStart, d) + 1) / total * 100;

  const days = [];
  for (let i = 0; i < total; i++) {
    const d = D.addDays(axisStart, i);
    const wd = D.parse(d).getDay();
    days.push({ d, i, wd, we: wd === 0 || wd === 6, today: d === today });
  }

  const weekendBands = days
    .filter((x) => x.we)
    .map((x) => ({ key: x.d, left: dayStart(x.d), width: 100 / total }));

  return (
    <div className="tl" data-density={density}>
      {/* 轴头 */}
      <div className="tl-head">
        <div className="tl-head-label">任务 / 项目</div>
        <div className="tl-days">
          {days.map((x) => (
            <div
              key={x.d}
              className={"tl-day" + (x.we ? " we" : "") + (x.today ? " today" : "")}
              style={{ left: dayAt(x.d) + "%" }}
            >
              <b>{D.parse(x.d).getDate()}</b>
              <span className="wd">{x.wd === 2 ? "周二" : x.wd === 5 ? "周五" : ""}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 会议轨道 */}
      {showMeetings !== false && <div className="tl-meetrow">
        <div className="tl-meet-label">
          <IconCalendar size={13} />
          <span>会议节点</span>
          <span className="mono">{meetings.length}</span>
        </div>
        <div className="tl-meet-track">
          <div className="tl-today" style={{ left: dayAt(today) + "%" }} />
          {meetings.map((m) => (
            <button
              key={m.id}
              className={
                "meet-tick" +
                (confirmed[m.id] ? " confirmed" : "") +
                (selectedMeeting === m.id ? " sel" : "")
              }
              style={{ left: dayAt(m.date) + "%" }}
              title={m.name + " · " + D.mdDot(m.date)}
              aria-label={m.name}
              onClick={() => onOpenMeeting(m.id)}
            />
          ))}
        </div>
      </div>}

      {/* 任务行 */}
      {tasks.map((t, i) => {
        const left = dayStart(t.start);
        const right = dayEnd(t.finalDue);
        const draftPos = dayAt(t.draftDue);
        const width = right - left;
        const prog = t.progress == null ? 0 : Math.max(0, Math.min(1, t.progress));
        const tailW = Math.max(0, right - draftPos);
        return (
          <div className="tl-row" key={t.id}>
            <button className="tl-label" onClick={() => onOpenTask(t.id)} title={t.name}>
              <span className={"pdot " + t.project} />
              <span className="txt">
                <span className="t1">{t.short}</span>
                <span className="t2">
                  {t.project} / {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="pct">{t.progress == null ? "—" : Math.round(t.progress * 100) + "%"}</span>
            </button>
            <div className="tl-track" style={{ backgroundSize: "calc(100% / " + total + ") 100%" }}>
              {weekendBands.map((w) => (
                <div
                  key={w.key}
                  className="tl-weekend"
                  style={{ left: w.left + "%", width: w.width + "%" }}
                />
              ))}
              <div className="tl-mile" style={{ left: dayAt(t.draftDue) + "%" }} />
              <div className="tl-mile" style={{ left: dayAt(t.finalDue) + "%" }} />
              <div className="tl-today" style={{ left: dayAt(today) + "%" }} />
              <button
                className="bar"
                style={{ left: left + "%", width: width + "%" }}
                onClick={() => onOpenTask(t.id)}
                title={
                  t.name + "\n开始 " + D.mdDot(t.start) +
                  " · 初版 " + D.mdDot(t.draftDue) +
                  " · 终版 " + D.mdDot(t.finalDue)
                }
                aria-label={t.name}
              >
                <span className="prog" style={{ width: prog * 100 + "%" }} />
                <span className="tail" style={{ left: (draftPos - left) / width * 100 + "%", width: tailW / width * 100 + "%" }} />
              </button>
            </div>
          </div>
        );
      })}

      {/* 轴底：交付关口 */}
      <div className="tl-foot">
        <div className="cell">交付关口</div>
        <div className="tl-foot-track">
          {draftGate && (
            <div className="tl-foot-mark" style={{ left: dayAt(draftGate) + "%" }}>
              <span>初版</span>{D.mdDot(draftGate)}
            </div>
          )}
          {finalGate && (
            <div className="tl-foot-mark" style={{ left: dayAt(finalGate) + "%" }}>
              <span>终版</span>{D.mdDot(finalGate)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Timeline });
