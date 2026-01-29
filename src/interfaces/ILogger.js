/**
 * Интерфейс для логирования
 */
export class ILogger {
  /**
   * Логирование информации
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  info(message, data = null) {
    throw new Error('Method "info" must be implemented');
  }

  /**
   * Логирование предупреждения
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  warn(message, data = null) {
    throw new Error('Method "warn" must be implemented');
  }

  /**
   * Логирование ошибки
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  error(message, data = null) {
    throw new Error('Method "error" must be implemented');
  }
}
