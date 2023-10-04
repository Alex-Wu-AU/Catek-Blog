// import Vue from "vue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue3Editor from "vue3-editor";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

//from vue2 to vue3, use createApp instead of new Vue

let app;
onAuthStateChanged(getAuth(), () => {
  if (!app) {
    app = createApp(App);
    // app.component("QuillEditor", QuillEditor);
    app.use(Vue3Editor);
    app.use(store);
    app.use(router);
    app.mount("#app");
  }
});
