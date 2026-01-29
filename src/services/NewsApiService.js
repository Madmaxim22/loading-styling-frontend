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
   * @param {boolean} options.cacheEnabled - Включить кэширование ответов (по умолчанию false)
   * @param {number} options.defaultCacheTtl - Время жизни кэша по умолчанию в миллисекундах (по умолчанию 300000)
   * @param {boolean} options.enableLogging - Включить логирование операций (по умолчанию false)
   * @param {ILogger} logger - Экземпляр логгера
   */
  constructor(baseUrl, options = {}, logger = null) {
    super();
    this.baseUrl = baseUrl;
    this.timeout = options.timeout ?? 5000;
    this.cacheEnabled = options.cacheEnabled ?? true;
    this.defaultCacheTtl = options.defaultCacheTtl ?? 300000;
    this.enableLogging = options.enableLogging ?? true;
    this.logger = logger || new Logger(this.enableLogging);
    this.cache = new Map();
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
   * Получение данных с сервера с возможностью кэширования
   * @param {string} endpoint - Конечная точка API
   * @param {Object} options - Опции запроса
   * @param {boolean} options.useCache - Использовать кэш (если включен)
   * @param {number} options.cacheTtl - Время жизни кэша в миллисекундах
   * @returns {Promise<any>} Данные из ответа сервера
   * @throws {NetworkError} При ошибках сети или сервера
   */
  async fetchData(endpoint, options = {}) {
    const { useCache = this.cacheEnabled, cacheTtl = this.defaultCacheTtl } =
      options;
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;

    this.logger.info("Получение данных", { endpoint, useCache, cacheTtl });

    // Проверяем кэш, если включен
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheTtl) {
        this.logger.info("Данные получены из кэша", { endpoint });
        return cached.data;
      } else {
        // Удаляем устаревший кэш
        this.logger.info("Устаревшие данные удалены из кэша", { endpoint });
        this.cache.delete(cacheKey);
      }
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await this._makeRequest(url, options);
      const data = await response.json();

      // Сохраняем в кэш, если включен
      if (useCache) {
        this.cache.set(cacheKey, {
          data: data,
          timestamp: Date.now(),
        });
        this.logger.info("Данные сохранены в кэш", { endpoint });
      }

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
   * Получение новостей с сервера с возможностью кэширования
   * @param {Object} options - Опции запроса
   * @param {boolean} options.useCache - Использовать кэш (если включен)
   * @param {number} options.cacheTtl - Время жизни кэша в миллисекундах
   * @returns {Promise<Array>} Массив новостей
   * @throws {NetworkError} При ошибках сети или сервера
   */
  async getNews(options = {}) {
    return this.fetchData("/data", options);
  }

  /**
   * Очищает кэш
   * @public
   */
  clearCache() {
    this.logger.info("Очистка кэша");
    this.cache.clear();
  }

  /**
   * Включает/выключает кэширование
   * @param {boolean} enabled - Включить или выключить кэширование
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
    this.logger.info("Кэширование установлено", { enabled });
  }
}
