/**
 * Ошибка новостей
 */
export class NewsError extends Error {
  /**
   * Создает экземпляр ошибки новостей
   * @param {string} message - Сообщение об ошибке
   * @param {string} code - Код ошибки
   */
  constructor(message, code = "NEWS_ERROR") {
    super(message);
    this.name = "NewsError";
    this.code = code;
  }
}
