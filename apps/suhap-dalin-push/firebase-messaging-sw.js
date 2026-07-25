/* 수합의 달인 FCM 서비스 워커 */
function decodeBase64Url(value){
  var s=String(value||'').replace(/-/g,'+').replace(/_/g,'/');
  while(s.length%4)s+='=';
  var binary=atob(s),bytes=new Uint8Array(binary.length);
  for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
var raw=new URL(self.location.href).searchParams.get('cfg');
var client={};
try{client=JSON.parse(decodeBase64Url(raw));}catch(e){console.error('FCM config decode failed',e);}
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');
if(client.firebaseConfig){
  firebase.initializeApp(client.firebaseConfig);
  var messaging=firebase.messaging();
  messaging.onBackgroundMessage(function(payload){
    var d=payload&&payload.data?payload.data:{};
    var title=d.title||'수합의 달인';
    var options={
      body:d.body||'새 알림이 있습니다.',
      tag:d.collectionId?'dalin-'+d.collectionId:'dalin-notice',
      renotify:true,
      data:{link:d.link||client.webAppUrl||'./push-register.html'}
    };
    return self.registration.showNotification(title,options);
  });
}
self.addEventListener('notificationclick',function(event){
  event.notification.close();
  var link=event.notification&&event.notification.data&&event.notification.data.link;
  link=link||client.webAppUrl||'./push-register.html';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){
      if('focus' in list[i]){list[i].navigate(link);return list[i].focus();}
    }
    return clients.openWindow?clients.openWindow(link):null;
  }));
});
