export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_Chart', name: '智能分析', icon: 'areaChartOutlined', component: './AddChart' },
  {
    path: '/add_Chart_async',
    name: '智能分析(异步)',
    icon: 'areaChartOutlined',
    component: './AddChartAsync',
  },
  { path: '/my_Chart', name: '我的图表', icon: 'pieChartOutlined', component: './MyChart' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { path: '*', layout: false, component: './404' },
];
