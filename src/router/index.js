import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        redirect: '/spinner'
    },
    {
        path: '/spinner',
        name: 'Spinner',
        component: () => import('../views/SpinnerView.vue')
    },
    {
        path: '/treasure-hunt',
        name: 'TreasureHunt',
        component: () => import('../views/TreasureHuntView.vue')
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;