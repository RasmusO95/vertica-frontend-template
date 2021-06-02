import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import coreConfig from './core';
import projectConfig from './project';

import '@/styling/main.css';

const app = createApp(App);

coreConfig(app);
projectConfig(app);

app.use(router);

router.isReady().then(() => app.mount('#app'));

export default app;
