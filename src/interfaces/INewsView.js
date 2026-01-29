/**
 * Интерфейс для представления новостей
 */
export class INewsView {
  /**
   * Отображает состояние загрузки
   * @returns {void}
   */
  showLoadingState() {
    throw new Error('Method "showLoadingState" must be implemented');
  }

  /**
   * Отображает основной контент
   * @param {Array} data - Массив новостей для отображения
   * @returns {void}
   */
  showContentState(data) {
    throw new Error('Method "showContentState" must be implemented');
  }

  /**
   * Отображает модальное окно ошибки
   * @returns {void}
   */
  showModalError() {
    throw new Error('Method "showModalError" must be implemented');
  }
}
