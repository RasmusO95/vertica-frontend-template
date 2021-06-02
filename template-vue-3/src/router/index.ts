import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/WelcomePage.vue'),
    },
];

const fallbackRoute: RouteRecordRaw = {
    path: '/:pathMatch(.*)*', component: () => import('@/pages/_404Page.vue'),
};

routes.push(fallbackRoute);

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
