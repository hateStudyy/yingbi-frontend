export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
