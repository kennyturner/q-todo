
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'page2', component: () => import('pages/Page2.vue') }
    ]
  },
  {
    path: '/user/',
    component: () => import('layouts/user.vue'),
    children: [
      { path: 'login', component: () => import('pages/User/Login.vue') },
      { path: 'profile', component: () => import('pages/User/Profile.vue') },
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
