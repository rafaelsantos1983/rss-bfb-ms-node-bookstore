import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Endereço não encontrado.');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Não encontrado.' }];
  }
}
