import axios, { AxiosInstance } from "axios";
import { Buffer } from "buffer";

function PreProcessTask(task: any): void {
	for (const key in task) {
		if (task[key] instanceof Buffer) {
			task[key] = task[key].toString("base64");
		}
	}
}

class CapSolver {
	private client: AxiosInstance;
	private clientKey: string;
	private options: CapSolverOptions;

	constructor(clientKey: string, options?: CapSolverOptions) {
		this.clientKey = clientKey;
		this.options = options || {};
		this.client = axios.create({
			baseURL: "https://api.capsolver.com",
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	private verbose(log: string): void {
		if (this.options?.verbose || false) {
			const verboseIdentifier = this.options?.verboseIdentifier
				? `${this.options?.verboseIdentifier} `
				: "";
			console.log(`${verboseIdentifier}${log}`);
		}
	}

	async getBalance(): Promise<CapSolverBalanceResponse> {
		const response = await this.client.post<CapSolverBalanceResponse>("/getBalance", {
			clientKey: this.clientKey,
		});
		return response.data;
	}

	async createTask(task: CapSolverTask): Promise<CapSolverCreateTaskResponse> {
		PreProcessTask(task);
		const response = await this.client.post<CapSolverCreateTaskResponse>("/createTask", {
			clientKey: this.clientKey,
			appId: this.options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
			task,
		});
		return response.data;
	}

	async getTaskResult(taskId: string): Promise<CapSolverGetTaskResultResponse> {
		const response = await this.client.post<CapSolverGetTaskResultResponse>("/getTaskResult", {
			clientKey: this.clientKey,
			taskId,
		});
		return response.data;
	}

	async feedbackTask(
		taskId: string,
		result: FeedbackTaskResult
	): Promise<CapSolverFeedbackTaskResponse> {
		const response = await this.client.post<CapSolverFeedbackTaskResponse>("/feedbackTask", {
			clientKey: this.clientKey,
			appId: this.options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
			taskId,
			result,
		});
		return response.data;
	}

	async solve(task: CapSolverTask): Promise<CapSolverSolveTaskResult> {
		if (!task)
			return {
				errorCode: "ERROR_INVALID_TASK_DATA",
				errorDescription: "Missing task data.",
				errorId: 1,
				status: null,
				solution: {},
				taskId: "",
			};

		const response = await this.createTask(task);
		if (response.status === "ready" || response.errorId === 1) return response;
		const taskId = response.taskId;

		this.verbose(`[${taskId}] Created [${task.type}].`);

		while (true) {
			const result = await this.getTaskResult(taskId);
			if (result.status === "ready" || result.errorId === 1) {
				const verboseMessage = result?.status === "ready" ? `Solved!` : `Failed!`;
				this.verbose(`[${taskId}] ${verboseMessage}`);
				return {
					...result,
					taskId,
				} as CapSolverSolveTaskResult;
			}
			this.verbose(`[${taskId}] Waiting 2500ms...`);
			await this.delay(2500);
		}
	}
}

export default CapSolver;