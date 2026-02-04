import { INetworkService } from "../interfaces/INetworkService.js";
import { NetworkError } from "../errors/NetworkError.js";
import { Logger } from "./Logger.js";

/**
 * Сервис для работы с сетью
 * Реализует INetworkService
 */
export class NewsApiService extends INetworkService {
  /**
   * Создает экземпляр NewsApiService
   * @param {string} baseUrl - Базовый URL для всех запросов
   * @param {Object} options - Опции конфигурации
   * @param {number} options.timeout - Таймаут запроса в миллисекундах (по умолчанию 5000)
   * @param {boolean} options.enableLogging - Включить логирование операций (по умолчанию false)
   * @param {ILogger} logger - Экземпляр логгера
   */
  constructor(baseUrl, options = {}, logger = null) {
    super();
    this.baseUrl = baseUrl;
    this.timeout = options.timeout ?? 15000;
    this.enableLogging = options.enableLogging ?? true;
    this.logger = logger || new Logger(this.enableLogging);
  }

  /**
   * Выполняет HTTP-запрос с таймаутом и обработкой ошибок
   * @private
   * @param {string} url - URL для запроса
   * @param {Object} options - Опции запроса
   * @returns {Promise<Response>} Ответ сервера
   * @throws {NetworkError} При ошибках сети или сервера
   */
  async _makeRequest(url, options = {}) {
    this.logger.info("Выполнение запроса", { url, options });

    // Проверяем наличие интернет-соединения
    if (!navigator.onLine) {
      const error = new NetworkError("Нет подключения к интернету");
      this.logger.error("Ошибка подключения", { error });
      throw error;
    }

    // Создаем контроллер AbortController для таймаута
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      this.logger.warn(`Превышено время ожидания запроса к ${url}`, {
        timeout: this.timeout,
      });
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new NetworkError(
          `HTTP ошибка! статус: ${response.status}`,
        );
        this.logger.error("Ошибка HTTP", { status: response.status, url });
        throw error;
      }

      this.logger.info("Запрос выполнен успешно", {
        status: response.status,
        url,
      });
      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // Если запрос был прерван из-за таймаута
      if (error.name === "AbortError") {
        const timeoutError = new NetworkError(
          `Запрос к ${url} превысил время ожидания (${this.timeout} мс)`,
        );
        this.logger.error("Таймаут запроса", { url, timeout: this.timeout });
        throw timeoutError;
      }

      this.logger.error("Ошибка сети", { error: error.message, url });
      throw error;
    }
  }

  /**
   * Получение данных с сервера
   * Кэширование обрабатывается Service Worker'ом
   * @param {string} endpoint - Конечная точка API
   * @param {Object} options - Опции запроса
   * @returns {Promise<any>} Данные из ответа сервера
   * @throws {NetworkError} При ошибках сети или сервера
   */
  async fetchData(endpoint, options = {}) {
    this.logger.info("Получение данных", { endpoint });

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await this._makeRequest(url, options);
      const data = await response.json();

      this.logger.info("Данные успешно получены", { endpoint });
      return data;
    } catch (error) {
      this.logger.error("Ошибка получения данных", {
        endpoint,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Получение новостей с сервера
   * @returns {Promise<Array>} Массив новостей
   * @throws {NetworkError} При ошибках сети или сервера
   */
  async getNews() {
    return this.fetchData("/data");
  }
}
