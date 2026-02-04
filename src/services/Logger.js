import { ILogger } from '../interfaces/ILogger.js';

/**
 * Реализация логгера
 */
export class Logger extends ILogger {
  /**
   * Создает экземпляр логгера
   * @param {boolean} enabled - Включить логирование
   */
  constructor(enabled = true) {
    super();
    this.enabled = enabled;
  }

  /**
   * Логирование информации
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  info(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] INFO: ${message}`;

      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  /**
   * Логирование предупреждения
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  warn(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] WARN: ${message}`;

      if (data) {
        console.warn(logMessage, data);
      } else {
        console.warn(logMessage);
      }
    }
  }

  /**
   * Логирование ошибки
   * @param {string} message - Сообщение для логирования
   * @param {Object} data - Дополнительные данные
   * @returns {void}
   */
  error(message, data = null) {
    if (this.enabled) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ERROR: ${message}`;

      if (data) {
        console.error(logMessage, data);
      } else {
        console.error(logMessage);
      }
    }
  }
}
