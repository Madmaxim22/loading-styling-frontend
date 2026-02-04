/**
 * Интерфейс для сетевой службы
 */
export class INetworkService {
  /**
   * Получение данных с сервера
   * @param {string} endpoint - Конечная точка API
   * @returns {Promise<any>} Данные из ответа сервера
   */
  async fetchData(endpoint) {
    throw new Error('Method "fetchData" must be implemented');
  }

  /**
   * Получение новостей с сервера
   * @returns {Promise<Array>} Массив новостей
   */
  async getNews() {
    throw new Error('Method "getNews" must be implemented');
  }
}
