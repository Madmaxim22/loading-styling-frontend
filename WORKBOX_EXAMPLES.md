# Примеры использования Workbox

## Текущая конфигурация

### Базовые настройки

```javascript
new GenerateSW({
  clientsClaim: true,        // SW сразу берет контроль
  skipWaiting: true,         // Немедленная активация
  cleanupOutdatedCaches: true // Автоочистка старых кэшей
})
```

### Runtime Caching стратегии

#### 1. StaleWhileRevalidate (для Google Fonts стилей)
```javascript
{
  urlPattern: /^https:\/\/fonts\.googleapis\.com/,
  handler: "StaleWhileRevalidate",
  options: {
    cacheName: "google-fonts-stylesheets",
  },
}
```
**Как работает**: Возвращает из кэша, одновременно обновляя кэш в фоне.

#### 2. CacheFirst (для шрифтов и изображений)
```javascript
{
  urlPattern: /^https:\/\/fonts\.gstatic\.com/,
  handler: "CacheFirst",
  options: {
    cacheName: "google-fonts-webfonts",
    expiration: {
      maxEntries: 30,
      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 год
    },
  },
}
```
**Как работает**: Сначала проверяет кэш, только потом сеть.

## Дополнительные примеры конфигурации

### NetworkFirst (для API запросов)
```javascript
{
  urlPattern: /^https:\/\/api\.example\.com/,
  handler: "NetworkFirst",
  options: {
    cacheName: "api-cache",
    networkTimeoutSeconds: 3,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 5, // 5 минут
    },
  },
}
```

### NetworkOnly (для критичных данных)
```javascript
{
  urlPattern: /^https:\/\/api\.example\.com\/auth/,
  handler: "NetworkOnly",
}
```

### CacheOnly (для статических ресурсов)
```javascript
{
  urlPattern: /^https:\/\/cdn\.example\.com/,
  handler: "CacheOnly",
  options: {
    cacheName: "cdn-cache",
  },
}
```

## Расширенные возможности

### Добавление плагинов

#### Background Sync
```javascript
import { BackgroundSyncPlugin } from 'workbox-background-sync';

{
  urlPattern: /^https:\/\/api\.example\.com\/submit/,
  handler: "NetworkOnly",
  options: {
    plugins: [
      new BackgroundSyncPlugin('submitQueue', {
        maxRetentionTime: 24 * 60 // 24 часа
      })
    ]
  }
}
```

#### Broadcast Update
```javascript
import { BroadcastUpdatePlugin } from 'workbox-broadcast-update';

{
  urlPattern: /^https:\/\/api\.example\.com\/news/,
  handler: "StaleWhileRevalidate",
  options: {
    plugins: [
      new BroadcastUpdatePlugin()
    ]
  }
}
```

### Кастомизация precaching

```javascript
new GenerateSW({
  // Исключить файлы из precaching
  exclude: [/\.map$/, /^manifest.*\.js$/],
  
  // Добавить дополнительные файлы
  additionalManifestEntries: [
    { url: '/offline.html', revision: null }
  ],
  
  // Настройка навигации
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api\//],
})
```

## Использование InjectManifest (для кастомного SW)

Если нужен больший контроль, используйте `InjectManifest`:

```javascript
import { InjectManifest } from 'workbox-webpack-plugin';

new InjectManifest({
  swSrc: './src/custom-sw.js',
  swDest: 'service-worker.js',
})
```

### Пример custom-sw.js
```javascript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

// Precache файлов из webpack
precacheAndRoute(self.__WB_MANIFEST);

// Кастомная логика
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      {
        cacheWillUpdate: async ({ response }) => {
          // Кастомная логика перед кэшированием
          return response.status === 200 ? response : null;
        },
      },
    ],
  })
);

// Кастомные обработчики событий
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

## Отладка

### Проверка Service Worker в DevTools
1. Откройте Chrome DevTools
2. Перейдите в Application → Service Workers
3. Проверьте статус и версию SW
4. Используйте "Update on reload" для разработки

### Просмотр кэша
1. Application → Cache Storage
2. Проверьте содержимое кэшей:
   - `workbox-precache-v2-...` - precached файлы
   - `google-fonts-stylesheets` - стили шрифтов
   - `google-fonts-webfonts` - файлы шрифтов
   - `images` - изображения

### Логирование Workbox
Добавьте в webpack конфигурацию:
```javascript
new GenerateSW({
  // ... другие опции
  mode: 'development', // Включает подробное логирование
})
```

## Полезные ссылки

- [Workbox Strategies](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/)
- [Workbox Routing](https://developer.chrome.com/docs/workbox/modules/workbox-routing/)
- [Workbox Precaching](https://developer.chrome.com/docs/workbox/modules/workbox-precaching/)
- [Workbox Recipes](https://developer.chrome.com/docs/workbox/the-ways-of-workbox/)
