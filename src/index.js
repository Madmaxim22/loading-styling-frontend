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

// Регистрация Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("Service Worker зарегистрирован: ", registration);
      })
      .catch((error) => {
        console.log("Ошибка регистрации Service Worker: ", error);
      });
  });
}
