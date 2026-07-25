/*
 * 수합의 달인 FCM 공용 서비스 워커 V2
 * - Firebase SDK를 서비스 워커 안에서 불러오지 않습니다.
 * - GAS에서 보내는 FCM data payload를 표준 push 이벤트로 직접 처리합니다.
 * - 여러 학교가 동일한 GitHub Pages 파일을 사용해도 Firebase 설정이 섞이지 않습니다.
 */
'use strict';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

function readPayload_(event) {
  if (!event.data) return {};
  try {
    return event.data.json() || {};
  } catch (jsonError) {
    try {
      return { data: { body: event.data.text() } };
    } catch (textError) {
      return {};
    }
  }
}

self.addEventListener('push', function (event) {
  var payload = readPayload_(event);
  var notification = payload.notification || {};
  var data = payload.data || payload || {};

  var title = notification.title || data.title || '수합의 달인';
  var body = notification.body || data.body || '새 알림이 있습니다.';
  var link = data.link || notification.click_action || './push-register.html';
  var collectionId = data.collectionId || data.collectionID || '';

  var options = {
    body: body,
    tag: collectionId ? 'dalin-' + collectionId : 'dalin-notice',
    renotify: true,
    data: {
      link: link,
      collectionId: collectionId
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  var link = './push-register.html';
  if (event.notification && event.notification.data && event.notification.data.link) {
    link = event.notification.data.link;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i += 1) {
        var client = clientList[i];
        if ('navigate' in client && 'focus' in client) {
          return client.navigate(link).then(function () {
            return client.focus();
          });
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
      return null;
    })
  );
});
