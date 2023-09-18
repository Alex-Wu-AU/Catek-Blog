// import Vue from "vue";
// import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { createRouter, createWebHashHistory } from "vue-router";

// Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  history: createWebHashHistory(),
  routes,
});

// const app = Vue.createApp({});
// app.use(router);

export default router;
