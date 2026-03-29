import { workerIds, workerRegistry } from "../contracts";
import type { AgentWorker } from "../contracts";

export const seededWorkers: AgentWorker[] = workerIds.map((workerId) => workerRegistry[workerId]);

export const seededWorkerRegistry = Object.fromEntries(
  seededWorkers.map((worker) => [worker.id, worker]),
) as Record<AgentWorker["id"], AgentWorker>;
