import axios from "axios";
import { Buffer } from "buffer";
function PreProcessTask(task) {
    for (const key in task) {
        if (task[key] instanceof Buffer) {
            task[key] = task[key].toString("base64");
        }
    }
}
class CapSolver {
    client;
    clientKey;
    options;
    constructor(clientKey, options) {
        this.clientKey = clientKey;
        this.options = options || {};
        this.client = axios.create({
            baseURL: "https://api.capsolver.com",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    verbose(log) {
        if (this.options?.verbose || false) {
            const verboseIdentifier = this.options?.verboseIdentifier
                ? `${this.options?.verboseIdentifier} `
                : "";
            console.log(`${verboseIdentifier}${log}`);
        }
    }
    async getBalance() {
        const response = await this.client.post("/getBalance", {
            clientKey: this.clientKey,
        });
        return response.data;
    }
    async createTask(task) {
        PreProcessTask(task);
        const response = await this.client.post("/createTask", {
            clientKey: this.clientKey,
            appId: this.options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
            task,
        });
        return response.data;
    }
    async getTaskResult(taskId) {
        const response = await this.client.post("/getTaskResult", {
            clientKey: this.clientKey,
            taskId,
        });
        return response.data;
    }
    async feedbackTask(taskId, result) {
        const response = await this.client.post("/feedbackTask", {
            clientKey: this.clientKey,
            appId: this.options.appId || "6B27D516-3A6F-4E13-9DED-F517295F5F89",
            taskId,
            result,
        });
        return response.data;
    }
    async solve(task) {
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
        if (response.status === "ready" || response.errorId === 1)
            return response;
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
                };
            }
            this.verbose(`[${taskId}] Waiting 2500ms...`);
            await this.delay(2500);
        }
    }
}
export default CapSolver;
