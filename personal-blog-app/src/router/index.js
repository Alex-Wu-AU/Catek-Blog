// import Vue from "vue";
// import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Blogs from "../views/Blogs.vue";
import { createRouter, createWebHashHistory } from "vue-router";

// Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
    meta: {
      title: "Blogs",
    },
  },
];

const router = createRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  history: createWebHashHistory(),
  routes,
});

//implement tab titles (in browser)
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Personal Blog`;
  next();
});

// const app = Vue.createApp({});
// app.use(router);

export default router;
