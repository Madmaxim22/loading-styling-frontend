/**
 * Главный файл приложения
 * Инициализирует компоненты приложения
 */

import "./css/style.css";
import { NewsApiService } from "./services/NewsApiService.js";
import { NewsDisplay } from "./views/NewsDisplay.js";
import { NewsController } from "./controllers/NewsController.js";
import { Logger } from "./services/Logger.js";

// Создаем экземпляры компонентов
const logger = new Logger(true);
const networkService = new NewsApiService(
  "http://localhost:3000",
  {
    cacheEnabled: true,
    enableLogging: true,
  },
  logger,
);
const newsView = new NewsDisplay(
  {
    loadingStateId: "loading-state",
    contentStateId: "content-state",
    contentDivId: "content",
    modalErrorId: "modal-error",
  },
  logger,
);
const newsController = new NewsController(newsView, networkService, logger);
