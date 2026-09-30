import { useEffect, useRef, useState } from "react";
import {
  API_URL,
  TrainJob,
  TrainStreamEvent,
  getTrainJob,
  isTerminal,
} from "../../services/trainService";
import { withToken } from "../../lib/auth";

/**
 * Follows one training job over SSE: the server sends a snapshot, then live
 * log/validation events, then `done`. Log entries are merged by `seq`, so the
 * snapshot resent after an automatic reconnect does not duplicate lines.
 */
export function useTrainJob(jobId?: string, onDone?: (job: TrainJob) => void) {
  const [job, setJob] = useState<TrainJob | null>(null);
  const [connected, setConnected] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setJob(null);
    if (!jobId) return;

    const source = new EventSource(
      withToken(`${API_URL}/train/jobs/${jobId}/stream`)
    );
    const finish = async () => {
      source.close();
      setConnected(false);
      const latest = await getTrainJob(jobId).catch(() => null);
      if (latest) {
        setJob(latest);
        onDoneRef.current?.(latest);
      }
    };

    source.onopen = () => setConnected(true);
    source.onerror = () => setConnected(false);
    source.onmessage = (message) => {
      const event: TrainStreamEvent = JSON.parse(message.data);
      switch (event.type) {
        case "snapshot":
          setJob((current) => mergeSnapshot(current, event.job));
          if (isTerminal(event.job.status)) {
            // The server ends the stream here; close so EventSource does not reconnect.
            source.close();
            setConnected(false);
          }
          break;
        case "log":
          setJob((current) =>
            current
              ? {
                  ...current,
                  status: event.status ?? current.status,
                  logs: appendLog(current.logs ?? [], event.entry),
                }
              : current
          );
          break;
        case "validation":
          setJob((current) =>
            current ? { ...current, validation: event.validation } : current
          );
          break;
        case "done":
          finish();
          break;
        case "error":
          source.close();
          setConnected(false);
          break;
      }
    };

    return () => source.close();
  }, [jobId]);

  return { job, connected };
}

function mergeSnapshot(current: TrainJob | null, snapshot: TrainJob): TrainJob {
  if (!current || current._id !== snapshot._id) return snapshot;
  const logs = (current.logs ?? []).reduce(
    (merged, entry) => appendLog(merged, entry),
    snapshot.logs ?? []
  );
  return { ...snapshot, logs };
}

function appendLog(logs: TrainJob["logs"] = [], entry: NonNullable<TrainJob["logs"]>[number]) {
  if (logs.some((existing) => existing.seq === entry.seq)) return logs;
  return [...logs, entry].sort((a, b) => a.seq - b.seq);
}
