import { useEffect, useRef } from "react";
import { TrainLogEntry } from "../../../services/trainService";
import "./TrainLog.css";

/** Console-style log that follows new lines unless the user has scrolled up. */
const TrainLog = ({
  logs,
  live,
}: {
  logs: TrainLogEntry[];
  live: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (container && followRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div
      ref={containerRef}
      className="train-log"
      role="log"
      aria-live="polite"
      onScroll={(event) => {
        const el = event.currentTarget;
        followRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      }}
    >
      {logs.length === 0 && (
        <div className="train-log__empty">Chưa có log.</div>
      )}
      {logs.map((entry) => (
        <div key={entry.seq} className={`train-log__line is-${entry.level}`}>
          <span className="train-log__time">
            {new Date(entry.at).toLocaleTimeString("vi-VN")}
          </span>
          <span className="train-log__stage">{entry.status}</span>
          <span className="train-log__message">{entry.message}</span>
        </div>
      ))}
      {live && <div className="train-log__cursor">▍</div>}
    </div>
  );
};

export default TrainLog;
