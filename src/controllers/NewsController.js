import { INewsController } from '../interfaces/INewsController.js';

/**
 * Контроллер новостей
 * Реализует INewsController
 */
export class NewsController extends INewsController {
  /**
   * Создает экземпляр NewsController
   * @param {INewsView} newsView - Экземпляр класса INewsView для отображения данных
   * @param {INetworkService} networkService - Экземпляр класса INetworkService для работы с сетью
   * @param {ILogger} logger - Экземпляр логгера
   */
  constructor(newsView, networkService, logger = null) {
    super();
    this.newsView = newsView;
    this.networkService = networkService;
    this.logger = logger || console;
    this.enableLogging = true;

    // Инициализируем обработчики событий
    this.init();
  }

  /**
   * Инициализирует обработчики событий
   * @public
   */
  init() {
    // Добавляем обработчик события DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      const refreshBtn = document.getElementById('refresh-btn');
      const updateBtn = document.getElementById('update-btn');

      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          this.logger.info('Клик по кнопке обновления');
          this.loadData();
        });
      }

      if (updateBtn) {
        updateBtn.addEventListener('click', () => {
          this.logger.info('Клик по кнопке обновления');
          this.loadData();
        });
      }

      // Обработчик изменения состояния сети
      window.addEventListener('online', () => {
        this.logger.info('Состояние сети: онлайн');
        // Когда восстанавливается подключение, автоматически пытаемся загрузить данные
        // и закрываем модальное окно ошибки
        const modal = document.getElementById('modal-error');
        if (modal) {
          modal.classList.add('hidden');
        }
        this.loadData();
      });

      window.addEventListener('offline', () => {
        this.logger.info('Состояние сети: офлайн');
        // Когда теряется подключение, оставляем состояние загрузки
        // и не показываем ошибку сразу
        this.newsView.showLoadingState();
        this.loadData();
      });

      // Загружаем данные при инициализации
      this.logger.info('Инициализация загрузки данных');
      this.loadData();
    });
  }

  /**
   * Функция для загрузки данных и обновления UI
   * @async
   * @returns {Promise<void>}
   */
  async loadData() {
    this.logger.info('Начало загрузки данных');

    // Отображаем состояние загрузки
    this.newsView.showLoadingState();

    try {
      // Загружаем данные с сервера
      this.logger.info('Запрос данных с сервера');
      const data = await this.networkService.getNews();

      // Отображаем содержимое
      this.logger.info('Данные успешно получены', { count: data?.length || 0, });
      this.newsView.showContentState(data);
    } catch (error) {
      this.logger.error('Ошибка при загрузке данных', { error: error.message, });

      this.newsView.showModalError();
      this.logger.warn(
        'Нет подключения к интернету или сервер недоступен, ожидаем восстановления соединения',
      );
    }
  }
}
