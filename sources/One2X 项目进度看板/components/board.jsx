/* 清单视图的行 + 状态看板（可拖拽改状态） */

const STATUS_COLUMNS = [
  { key: "未开始", dot: "off", hint: "等待启动" },
  { key: "进行中", dot: "on", hint: "正在推进" },
  { key: "已完成", dot: "fin", hint: "已交付" }
];

function TaskRow({ task, index, onOpen }) {
  const D = window.BD;
  return (
    <button className="trow" onClick={() => onOpen(task.id)}>
      <span className="no">{String(index + 1).padStart(2, "0")}</span>
      <span className="nm">
        <b>{task.name}</b>
        <span>{task.note}</span>
      </span>
      <span className="ct">
        <span className={"pdot " + task.project} />
        {task.project} · {task.type}
      </span>
      <span className="dt">
        <i>初版</i> {D.mdDot(task.draftDue)}
        <br />
        <i>终版</i> {D.mdDot(task.finalDue)}
      </span>
      <span className={"st " + task.status}>{task.status}</span>
    </button>
  );
}

function Kanban({ tasks, onOpen, onMove }) {
  const D = window.BD;
  const [over, setOver] = React.useState(null);
  const [dragId, setDragId] = React.useState(null);

  return (
    <div className="board">
      {STATUS_COLUMNS.map((col) => {
        const list = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className={"col" + (over === col.key ? " over" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.key);
            }}
            onDragLeave={() => setOver((v) => (v === col.key ? null : v))}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              try {
                const id = e.dataTransfer.getData("text/plain") || dragId;
                if (id) onMove(id, col.key);
              } catch (err) {
                if (dragId) onMove(dragId, col.key);
              }
              setDragId(null);
            }}
          >
            <div className="col-head">
              <span className={"dot " + col.dot} />
              <span>{col.key}</span>
              <span className="num">{String(list.length).padStart(2, "0")}</span>
            </div>
            <div className="col-body">
              {list.map((t) => (
                <div
                  key={t.id}
                  className={"tcard " + t.project + (dragId === t.id ? " dragging" : "")}
                  draggable="true"
                  role="button"
                  tabIndex={0}
                  onDragStart={(e) => {
                    setDragId(t.id);
                    try {
                      e.dataTransfer.setData("text/plain", t.id);
                    } catch (err) {}
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDragId(null)}
                  onClick={() => onOpen(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen(t.id);
                    }
                  }}
                >
                  <div className="top">
                    <span className={"pdot " + t.project} style={{ width: 5, height: 5 }} />
                    <span className="pj">{t.project}</span>
                    <span>/</span>
                    <span>{t.type}</span>
                  </div>
                  <h4>{t.short}</h4>
                  <div className="pbar">
                    <span style={{ width: ((t.progress || 0) * 100) + "%" }} />
                  </div>
                  <div className="foot">
                    <span>
                      初版 <em>{D.mdDot(t.draftDue)}</em>
                    </span>
                    <span>{t.progress == null ? "未填报" : Math.round(t.progress * 100) + "%"}</span>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="col-empty">
                  {col.key === "已完成" ? "还没有交付记录" : "暂无任务"}
                  <br />
                  <span style={{ fontSize: 10.5, opacity: 0.8 }}>
                    拖动卡片到此处即更改状态
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TaskRow, Kanban, STATUS_COLUMNS });
