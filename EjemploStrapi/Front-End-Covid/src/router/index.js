import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",

    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/covid",
    name: "covid",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Covid.vue"),
  },
  {
    path: "/covidStrapi",
    name: "covidStrapi",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CovidStrapi.vue"),
  },
  {
    path: "/CargardesdeAPI",
    name: "CargardesdeAPI",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CargardesdeAPI.vue"),
  },
  {
    path: "/Curvadecontagios",
    name: "Curva",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Curvadecontagios.vue"),
  },
  {
    path: "/Graficomundial",
    name: "Graficomundial",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Graficomundial.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/login.vue"),
  },
  {
    path: "/MapaCovid19MSalud",
    name: "MapaCovid19MSalud",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MapaCovid19MSalud.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
