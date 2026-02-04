# Loading Styling Frontend

![Deploy](https://github.com/Madmaxim22/loading-styling-frontend/workflows/Test%20and%20Deploy/badge.svg)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://madmaxim22.github.io/loading-styling-frontend/)

## Описание проекта

Проект "Loading Styling" представляет собой современное веб-приложение для отображения новостей с использованием современных технологий и паттернов проектирования. Приложение демонстрирует правильное применение архитектурных принципов, таких как MVC (Model-View-Controller), использование интерфейсов, логирование и обработка сетевых ошибок.

Основные особенности проекта:
- Реализация паттерна MVC с четким разделением ответственности
- Поддержка кэширования данных для повышения производительности
- Workbox для автоматического кэширования и оффлайн-режима
- Обработка сетевых ошибок и отображение модальных окон ошибок
- Адаптивный дизайн с использованием CSS-переменных
- Логирование действий пользователя и системных событий
- Поддержка оффлайн-режима и автоматического восстановления соединения

## Технологии и зависимости

### Основные технологии:
- **JavaScript (ES6+)** - основной язык программирования
- **HTML5** - разметка страницы
- **CSS3** - стилизация и анимации
- **Webpack** - сборка проекта
- **Workbox** - Service Worker и кэширование
- **ESLint** - статический анализ кода

### Зависимости проекта (package.json):
```json
{
  "devDependencies": {
    "@babel/core": "^7.23.2",
    "@babel/preset-env": "^7.23.2",
    "@eslint/js": "^9.36.0",
    "@stylistic/eslint-plugin": "^5.4.0",
    "babel-jest": "^30.2.0",
    "babel-loader": "^9.1.3",
    "css-loader": "^6.11.0",
    "eslint": "^9.36.0",
    "html-webpack-plugin": "^5.5.3",
    "mini-css-extract-plugin": "^2.9.4",
    "style-loader": "^3.3.4",
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.2.2",
    "workbox-webpack-plugin": "^7.4.0"
  }
}
```

## Инструкция по установке и запуску

### Требования:
- Node.js (версия 14 или выше)
- npm (входит в состав Node.js)

### Установка:
1. Клонируйте репозиторий:
```bash
git clone <URL_репозитория>
```

2. Перейдите в директорию проекта:
```bash
cd loading-styling-frontend
```

3. Установите зависимости:
```bash
npm install
```

### Запуск:
- Для разработки:
```bash
npm start
```
Это запустит webpack-dev-server на порту 5000

- Для сборки в режиме разработки:
```bash
npm run build:dev
```

- Для сборки в продакшене:
```bash
npm run build:prod
```

- Для линтинга кода:
```bash
npm run lint
```

## Структура проекта

```
loading-styling-frontend/
├── src/
│   ├── index.html          # Основной HTML-файл
│   ├── index.js            # Точка входа приложения
│   ├── css/
│   │   └── style.css       # Стили приложения
│   ├── controllers/        # Контроллеры
│   │   └── NewsController.js # Контроллер новостей
│   ├── services/           # Сервисы
│   │   ├── NewsApiService.js # Сервис работы с API
│   │   └── Logger.js       # Сервис логирования
│   ├── views/              # Представления
│   │   └── NewsDisplay.js  # Представление новостей
│   ├── interfaces/         # Интерфейсы
│   │   ├── INewsController.js
│   │   ├── INetworkService.js
│   │   ├── INewsView.js
│   │   └── ILogger.js
│   └── errors/             # Пользовательские ошибки
│       ├── NetworkError.js
│       └── NewsError.js
├── webpack.dev.js          # Конфигурация для разработки
├── webpack.prod.js         # Конфигурация для продакшена
├── package.json            # Зависимости и скрипты
└── README.md               # Документация проекта
```

## Руководство по использованию основных функций

### 1. NewsController (Контроллер новостей)
Контроллер отвечает за управление взаимодействием между представлением и сервисами. Он:
- Инициализирует обработчики событий DOM
- Обрабатывает события обновления данных
- Управляет состоянием приложения (загрузка, контент, ошибка)
- Обрабатывает события онлайн/офлайн состояния сети

### 2. NewsApiService (Сервис работы с API)
Сервис предоставляет функциональность для работы с сетью:
- Выполняет HTTP-запросы с таймаутами
- Обрабатывает ошибки сети и HTTP-ошибки
- Поддерживает кэширование данных
- Логирует все сетевые операции

### 3. NewsDisplay (Представление новостей)
Представление отвечает за отображение данных пользователю:
- Отображает состояние загрузки
- Отображает основной контент новостей
- Отображает модальное окно ошибки
- Обеспечивает безопасность от XSS-атак через экранирование HTML

### 4. Logger (Логгер)
Сервис логирования:
- Логирует информацию, предупреждения и ошибки
- Поддерживает включение/выключение логирования
- Форматирует сообщения с временными метками

## Примеры кода

### Инициализация приложения:
```javascript
import { NewsApiService } from "./services/NewsApiService.js";
import { NewsDisplay } from "./views/NewsDisplay.js";
import { NewsController } from "./controllers/NewsController.js";
import { Logger } from "./services/Logger.js";

// Создание экземпляров компонентов
const logger = new Logger(true);
const networkService = new NewsApiService(
  "http://localhost:3000",
  {
    cacheEnabled: true,
    enableLogging: true,
  },
  logger,
);
const newsView = new NewsDisplay({
  loadingStateId: "loading-state",
  contentStateId: "content-state",
  contentDivId: "content",
  modalErrorId: "modal-error",
}, logger);
const newsController = new NewsController(newsView, networkService, logger);
```

### Использование сервиса API:
```javascript
try {
  // Обработка полученных данных
  const news = await networkService.getNews({ useCache: true });
} catch (error) {
  // Обработка ошибки
  console.error('Ошибка при загрузке новостей:', error.message);
}
```

### Обработка событий в контроллере:
```javascript
document.addEventListener("DOMContentLoaded", () => {
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      this.loadData(false); // Принудительная загрузка без кэша
    });
  }
});
```

## Тестирование

Проект использует ESLint для статического анализа кода. Для запуска линтера выполните:

```bash
npm run lint
```

В проекте предусмотрена структура для тестирования, но конкретные тесты не реализованы. Для расширения функциональности можно добавить:
- Юнит-тесты для сервисов
- Интеграционные тесты для контроллеров
- E2E тесты для проверки UI

## Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для подробностей.

## Контактная информация

Автор: Максим Мухомедьяров  
Email: madmaxim22@gmail.com  

GitHub: [https://github.com/madmaxim22](https://github.com/madmaxim22)

## Ссылки на документацию

- [MDN Web Docs](https://developer.mozilla.org/ru/docs/Web)
- [Webpack Documentation](https://webpack.js.org/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [ESLint Documentation](https://eslint.org/)
- [JavaScript ES6+ Features](https://developer.mozilla.org/ru/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_6_support_in_Mozilla)

## Миграция на Workbox

Проект использует `workbox-webpack-plugin` для автоматической генерации Service Worker. Подробности миграции см. в [WORKBOX_MIGRATION.md](WORKBOX_MIGRATION.md).