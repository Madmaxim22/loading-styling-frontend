/**
 * Service Worker для кэширования ресурсов приложения
 */

// Версия кэша
const CACHE_NAME = "news-app-cache-v1";

// Список ресурсов для кэширования
const urlsToCache = [ "/main.js", "/index.html", "/css/style.css"];

// Установка Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Установка");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Кэширование ресурсов");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("Ошибка при добавлении в кэш:", error);
        // Продолжаем активацию даже если кэширование не удалось
        return Promise.resolve();
      }),
  );
});

// Активация Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Активация");

  // Удаление старых кэшей
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log("Удаление старого кэша:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});


// Событие перехвата сетевых запросов
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Перехват запроса", event.request.url);

  // Для демо-целей будем обслуживать запросы из кэша или сети
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем ответ из кэша, если он есть
      if (response) {
        console.log("Service Worker: Ответ из кэша для", event.request.url);

        // Отправляем сообщение в основной поток о перехвате fetch
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "FETCH_INTERCEPTED",
              url: event.request.url,
              responseStatus: response.status,
              responseData: { from: "cache", url: event.request.url },
            });
          });
        });

        return response;
      }

      // Если нет в кэше, делаем запрос в сеть
      return fetch(event.request)
        .then((response) => {
          // Проверяем, является ли ответ корректным
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Клонируем ответ, чтобы можно было использовать его дважды
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          console.log("Service Worker: Ответ из сети для", event.request.url);

          // Отправляем сообщение в основной поток о перехвате fetch
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "FETCH_INTERCEPTED",
                url: event.request.url,
                responseStatus: response.status,
                responseData: { from: "network", url: event.request.url },
              });
            });
          });

          return response;
        })
        .catch((error) => {
          console.error(
            "Service Worker: Ошибка при запросе",
            event.request.url,
            error,
          );

          // Если запрос не удался, пытаемся вернуть автономный ответ
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
        });
    }),
  );
});
