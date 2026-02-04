/**
 * Ошибка сети
 */
export class NetworkError extends Error {
  /**
   * Создает экземпляр ошибки сети
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   */
  constructor(message, code = 'NETWORK_ERROR') {
    super(message);
    this.name = 'NetworkError';
    this.code = code;
  }
}
