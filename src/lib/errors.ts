export class ArchiveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArchiveError";
  }
}

export class WorkflowAnalysisError extends Error {
  constructor(public errors: string[]) {
    super(`Workflow analysis found ${errors.length} error(s)`);
    this.name = "WorkflowAnalysisError";
  }
}
