// import Vue from 'vue'
// import Vuex from 'vuex'
import { createStore } from "vuex";

// Vue.use(Vuex)

export default createStore({
  state: {
    sampleBlogCards: [
      {
        blogTitle: "Blog Post 1",
        blogCoverPhoto: "stock-1",
        blogDate: "Sept 1, 2023",
      },
      {
        blogTitle: "Blog Post 2",
        blogCoverPhoto: "stock-2",
        blogDate: "Sept 1, 2023",
      },
      {
        blogTitle: "Blog Post 3",
        blogCoverPhoto: "stock-3",
        blogDate: "Sept 1, 2023",
      },
      {
        blogTitle: "Blog Post 4",
        blogCoverPhoto: "stock-4",
        blogDate: "Sept 1, 2023",
      },
    ],
    editPost: null,
  },
  mutations: {
    toggleEditPost(state, payload) {
      state.editPost = payload;
      console.log(state.editPost);
    },
  },
  actions: {},
  modules: {},
});
