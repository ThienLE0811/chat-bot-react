import axios from "axios";

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type TrainStatus =
  | "queued"
  | "validating"
  | "training"
  | "loading"
  | "loaded"
  | "failed";

export interface TrainLogEntry {
  seq: number;
  at: string;
  level: "info" | "warn" | "error";
  status: TrainStatus;
  message: string;
}

export interface ValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  path: string;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface TrainingDataStats {
  intents: number;
  examples: number;
  entities: number;
  slots: number;
  responses: number;
  actions: number;
  stories: number;
  rules: number;
}

export interface TrainJob {
  _id: string;
  status: TrainStatus;
  logSeq: number;
  logs?: TrainLogEntry[];
  validation?: ValidationReport;
  stats?: TrainingDataStats;
  dataHash?: string;
  modelFile?: string;
  error?: { message: string; stage: TrainStatus; details?: unknown };
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
}

export type TrainStreamEvent =
  | { type: "snapshot"; job: TrainJob }
  | { type: "log"; jobId: string; entry: TrainLogEntry; status?: TrainStatus }
  | { type: "validation"; jobId: string; validation: ValidationReport }
  | { type: "done"; jobId: string; status: TrainStatus }
  | { type: "model.activated"; modelFile: string; at: string }
  | { type: "error"; message: string }
  | { type: "ping" };

export interface ModelVersion {
  modelFile: string;
  source: "train" | "legacy";
  trainJobId: string | null;
  status: TrainStatus | null;
  createdAt: string | null;
  durationMs: number | null;
  dataHash: string | null;
  stats: TrainingDataStats | null;
  lastActivatedAt: string | null;
  isActive: boolean;
}

export interface ModelList {
  rasaReachable: boolean;
  activeModel: string | null;
  items: ModelVersion[];
}

export const isTerminal = (status?: TrainStatus) =>
  status === "loaded" || status === "failed";

/** Queues a training. If one is already running, resolves with that job's id instead. */
const startTrain = async (): Promise<{
  jobId: string;
  alreadyRunning: boolean;
}> => {
  try {
    const { data } = await axios.post<TrainJob>(`${API_URL}/train`);
    return { jobId: data._id, alreadyRunning: false };
  } catch (error: any) {
    const body = error?.response?.data;
    if (error?.response?.status === 409 && body?.jobId) {
      return { jobId: body.jobId, alreadyRunning: true };
    }
    throw new Error(body?.message ?? "Không bắt đầu được phiên train");
  }
};

const validateTrainingData = async () => {
  const { data } = await axios.post<
    ValidationReport & { stats: TrainingDataStats }
  >(`${API_URL}/train/validate`);
  return data;
};

const getTrainJobs = async (limit = 10) => {
  const { data } = await axios.get<{ items: TrainJob[]; total: number }>(
    `${API_URL}/train/jobs`,
    { params: { limit } }
  );
  return data;
};

const getTrainJob = async (id: string) => {
  const { data } = await axios.get<TrainJob>(`${API_URL}/train/jobs/${id}`);
  return data;
};

const getModels = async () => {
  const { data } = await axios.get<ModelList>(`${API_URL}/train/models`);
  return data;
};

const activateModel = async (modelFile: string) => {
  try {
    const { data } = await axios.post<{ modelFile: string }>(
      `${API_URL}/train/models/${encodeURIComponent(modelFile)}/activate`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ?? "Không kích hoạt được model"
    );
  }
};

const parseMessage = async (value: string): Promise<any[]> => {
  try {
    const response = await axios.post(`${API_URL}/parseMessage`, value);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export {
  activateModel,
  getModels,
  getTrainJob,
  getTrainJobs,
  parseMessage,
  startTrain,
  validateTrainingData,
};
