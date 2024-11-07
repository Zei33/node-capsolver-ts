declare class CapSolver {
    private client;
    private clientKey;
    private options;
    constructor(clientKey: string, options?: CapSolverOptions);
    private delay;
    private verbose;
    getBalance(): Promise<CapSolverBalanceResponse>;
    createTask(task: CapSolverTask): Promise<CapSolverCreateTaskResponse>;
    getTaskResult(taskId: string): Promise<CapSolverGetTaskResultResponse>;
    feedbackTask(taskId: string, result: FeedbackTaskResult): Promise<CapSolverFeedbackTaskResponse>;
    solve(task: CapSolverTask): Promise<CapSolverSolveTaskResult>;
}
export default CapSolver;
