export class ApiError extends Error {
  statusCode: number;
  errorMessage: string;

  constructor(message: string, status: number) {
    super(message);
    this.errorMessage = message;
    this.statusCode = status;
  }
}
