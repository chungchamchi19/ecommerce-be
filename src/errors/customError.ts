import getErrorMessage from "./getErrorMessage";

class CustomError {
  private code: number;
  private message: string;

  constructor(code: number, message?: string) {
    this.code = code;
    this.message = message || getErrorMessage(code) || "Bad Request";
  }
}

export default CustomError;
