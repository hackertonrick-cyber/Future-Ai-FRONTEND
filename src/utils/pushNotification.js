export const pushNotification = (data) => {
  console.log('push notification')
  Notification.requestPermission().then((perm) => {
    if (perm === 'granted') {
      const notification = new Notification(data.title, {
        body: data.body,
        data,
        icon: data.icon,
        vibrate: true,
        tag: data.tag || 'LPG notification',
      })

      notification.addEventListener('error', (e) => {
        alert('Please allow notifications.')
      })
    } else {
      console.log('Notification permission not granted.')
    }
  })
}
