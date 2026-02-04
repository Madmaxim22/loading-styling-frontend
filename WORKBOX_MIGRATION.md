# Миграция на Workbox Webpack Plugin

## Что изменилось

Проект был обновлен для использования `workbox-webpack-plugin` вместо кастомного Service Worker.

### Изменения в конфигурации Webpack

#### webpack.prod.js и webpack.dev.js

1. **Удалено копирование** `src/sw.js` из `CopyWebpackPlugin`
2. **Добавлен плагин** `GenerateSW` с конфигурацией:
   - `clientsClaim: true` - Service Worker сразу берет контроль над страницей
   - `skipWaiting: true` - новая версия SW активируется немедленно
   - `cleanupOutdatedCaches: true` - автоматическая очистка старых кэшей
   - **Runtime Caching** для:
     - Google Fonts стилей (StaleWhileRevalidate)
     - Google Fonts шрифтов (CacheFirst, 1 год)
     - Изображений (CacheFirst, 30 дней)

### Изменения в src/index.js

Изменена регистрация Service Worker:
- **Было**: `/sw.js`
- **Стало**: `/service-worker.js` (генерируется автоматически Workbox)

### Преимущества Workbox

1. **Автоматическое кэширование** всех ресурсов сборки (JS, CSS, HTML)
2. **Precaching** с версионированием - автоматическое обновление кэша при изменении файлов
3. **Runtime caching** стратегии для внешних ресурсов
4. **Меньше кода** - не нужно писать логику кэширования вручную
5. **Лучшая производительность** - оптимизированные стратегии кэширования
6. **Автоматическая очистка** устаревших кэшей

### Старый Service Worker

Кастомный Service Worker (`src/sw.js`) больше не используется, но сохранен в проекте для справки.

## Как использовать

1. Установите зависимости (если еще не установлены):
   ```bash
   npm install
   ```

2. Соберите проект:
   ```bash
   npm run build:prod
   ```
   или для разработки:
   ```bash
   npm run build:dev
   ```

3. Workbox автоматически создаст `service-worker.js` в папке `build/`

## Настройка кэширования

Вы можете настроить стратегии кэширования в конфигурации `GenerateSW`:

- **CacheFirst** - сначала проверяет кэш, затем сеть (для статических ресурсов)
- **NetworkFirst** - сначала сеть, затем кэш (для динамического контента)
- **StaleWhileRevalidate** - возвращает из кэша, обновляет в фоне
- **NetworkOnly** - только сеть
- **CacheOnly** - только кэш

Подробнее: https://developer.chrome.com/docs/workbox/
