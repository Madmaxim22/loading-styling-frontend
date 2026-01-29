/**
 * Интерфейс для контроллера новостей
 */
export class INewsController {
  /**
   * Инициализация контроллера
   * @returns {void}
   */
  init() {
    throw new Error('Method "init" must be implemented');
  }

  /**
   * Загрузка данных
   * @param {boolean} useCache - Использовать кэш
   * @returns {Promise<void>}
   */
  async loadData(useCache = true) {
    throw new Error('Method "loadData" must be implemented');
  }
}
