import './assets/main.css';
import 'leaflet/dist/leaflet.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options = {
  position: "bottom-right",
  timeout: 2500,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
};

const app = createApp(App);

app.use(router);
app.use(Toast, options);

app.mount('#app');

document.title = 'Kebabovnic';

const link = document.createElement('link');
link.rel = 'icon';
link.type = 'image/svg+xml';
link.href = '/logo.svg';
document.head.appendChild(link);
