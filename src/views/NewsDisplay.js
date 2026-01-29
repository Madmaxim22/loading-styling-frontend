import { INewsView } from '../interfaces/INewsView.js';

/**
 * Представление новостей
 * Реализует INewsView
 */
export class NewsDisplay extends INewsView {
  /**
   * Создает экземпляр NewsDisplay
   * @param {Object} options - Опции инициализации
   * @param {string} options.loadingStateId - ID элемента состояния загрузки
   * @param {string} options.contentStateId - ID элемента состояния контента
   * @param {string} options.contentDivId - ID контейнера контента
   * @param {string} options.modalErrorId - ID модального окна ошибки
   * @param {ILogger} logger - Экземпляр логгера
   */
  constructor(options = {}, logger = null) {
    super();
    this.loadingStateId = options.loadingStateId || 'loading-state';
    this.contentStateId = options.contentStateId || 'content-state';
    this.contentDivId = options.contentDivId || 'content';
    this.modalErrorId = options.modalErrorId || 'modal-error';
    
    // Инициализация элементов DOM с проверкой на существование
    this.loadingState = document.getElementById(this.loadingStateId);
    this.contentState = document.getElementById(this.contentStateId);
    this.contentDiv = document.getElementById(this.contentDivId);
    this.modalError = document.getElementById(this.modalErrorId);
    
    this.logger = logger || console;
    
    // Следим за состоянием модального окна для предотвращения дублирования обработчиков
    this.modalHandlersAttached = false;
  }

  /**
   * Отображает состояние загрузки
   * @public
   */
  showLoadingState() {
    this.logger.info('Отображение состояния загрузки');
    
    // Проверяем, что элемент существует перед изменением классов
    if (this.loadingState) {
      this.loadingState.classList.remove('hidden');
    }
    if (this.contentState) {
      this.contentState.classList.add('hidden');
    }
  }

  /**
   * Отображает основной контент
   * @param {Array} data - Массив новостей для отображения
   * @public
   */
  showContentState(data) {
    this.logger.info('Отображение контента', { count: data?.length || 0 });
    
    // Проверяем, что элементы существуют перед изменением классов
    if (this.loadingState) {
      this.loadingState.classList.add('hidden');
    }
    if (this.contentState) {
      this.contentState.classList.remove('hidden');
    }

    // Проверяем, что контейнер существует перед очисткой
    if (this.contentDiv) {
      // Очищаем контейнер
      this.contentDiv.innerHTML = "";

      // Проверяем, что данные существуют
      if (Array.isArray(data) && data.length > 0) {
        // Используем DocumentFragment для оптимизации рендеринга
        const fragment = document.createDocumentFragment();
        
        // Создаем и добавляем элементы новостей
        data.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "post";

          // Используем шаблонный литерал для создания HTML
          postElement.innerHTML = `
            <h3>${this._escapeHtml(post.title)}</h3>
            <p>${this._escapeHtml(post.body)}</p>
          `;

          // Используем append вместо innerHTML для лучшей безопасности
          fragment.appendChild(postElement);
        });
        
        // Добавляем все элементы за один раз
        this.contentDiv.appendChild(fragment);
      } else {
        // Если данных нет, показываем сообщение
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Нет новостей для отображения";
        this.contentDiv.appendChild(emptyMessage);
      }
    }
  }

  /**
   * Отображает модальное окно ошибки
   * @public
   */
  showModalError() {
    this.logger.info('Отображение модального окна ошибки');
    
    if (this.modalError) {
      this.modalError.classList.remove("hidden");

      // Добавляем обработчик закрытия модального окна, только если он еще не добавлен
      if (!this.modalHandlersAttached) {
        const closeBtn = this.modalError.querySelector(".close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            this.modalError.classList.add("hidden");
          });
        }

        // Закрытие модального окна при клике вне его области
        this.modalError.addEventListener("click", (event) => {
          if (event.target === this.modalError) {
            this.modalError.classList.add("hidden");
          }
        });
        
        this.modalHandlersAttached = true;
      }
    }
  }

  /**
   * Экранирует HTML для предотвращения XSS-атак
   * @private
   * @param {string} unsafe - Небезопасная строка
   * @returns {string} Безопасная строка
   */
  _escapeHtml(unsafe) {
    if (typeof unsafe !== "string") {
      return "";
    }

    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}