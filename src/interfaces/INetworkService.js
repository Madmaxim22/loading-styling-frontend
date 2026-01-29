/**
 * Интерфейс для сетевой службы
 */
export class INetworkService {
  /**
   * Получение данных с сервера
   * @param {string} endpoint - Конечная точка API
   * @param {Object} options - Опции запроса
   * @returns {Promise<any>} Данные из ответа сервера
   */
  async fetchData(endpoint, options = {}) {
    throw new Error('Method "fetchData" must be implemented');
  }

  /**
   * Получение новостей с сервера
   * @param {Object} options - Опции запроса
   * @returns {Promise<Array>} Массив новостей
   */
  async getNews(options = {}) {
    throw new Error('Method "getNews" must be implemented');
  }

  /**
   * Очистка кэша
   * @returns {void}
   */
  clearCache() {
    throw new Error('Method "clearCache" must be implemented');
  }

  /**
   * Включение/выключение кэширования
   * @param {boolean} enabled - Включить или выключить кэширование
   * @returns {void}
   */
  setCacheEnabled(enabled) {
    throw new Error('Method "setCacheEnabled" must be implemented');
  }
}
