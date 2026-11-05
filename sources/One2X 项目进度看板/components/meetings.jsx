/* 右栏：会议安排 */
function MeetingsRail({ meetings, today, confirmed, onToggle, onOpen, selected }) {
  const D = window.BD;
  const doneCount = meetings.filter((m) => confirmed[m.id]).length;
  return (
    <aside className="rail">
      <div className="rail-head">
        <IconCalendar size={15} />
        <h2>会议安排</h2>
        <span className="cnt">
          {String(meetings.length).padStart(2, "0")} 场
        </span>
      </div>
      <div>
        {meetings.map((m) => {
          const isToday = m.date === today;
          return (
            <div
              key={m.id}
              className={"mt" + (isToday ? " today" : "") + (selected === m.id ? " sel" : "")}
              role="button"
              tabIndex={0}
              onClick={() => onOpen(m.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onOpen(m.id);
              }}
            >
              <div className="mt-date">
                <b>{String(D.parse(m.date).getDate()).padStart(2, "0")}</b>
                <span>{D.parse(m.date).getMonth() + 1}月 · {D.weekday(m.date)}</span>
              </div>
              <div className="mt-body">
                <div className="nm">{m.short}</div>
                <div className="tp">{m.type}</div>
                <button
                  className={"stbtn" + (confirmed[m.id] ? " on" : "")}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(m.id);
                  }}
                  title={confirmed[m.id] ? "点击恢复为待预约" : "点击标记为已确认"}
                >
                  <i />
                  {confirmed[m.id] ? "已确认" : "待预约"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rail-note">
        <b>节奏提示：</b>看片会固定每周两次（周二、周五），是唯一能看到成片的节点；11/20 为交付前最后一场。
        {doneCount > 0 && (
          <>
            <br />
            已确认 <b>{doneCount}</b> 场，还有 {meetings.length - doneCount} 场待预约。
          </>
        )}
      </div>
    </aside>
  );
}

Object.assign(window, { MeetingsRail });
