import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error ao conectar ao banco de dados.';

  constructor() {
    super('Error ao conectar ao banco de dados.');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
