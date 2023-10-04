// import Vue from 'vue'
// import Vuex from 'vuex'
import { createStore } from "vuex";
import { getAuth } from "firebase/auth";
import db from "../firebase/firebaseInit";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// Vue.use(Vuex)

export default createStore({
  state: {
    //blog post states
    blogPosts: [],
    postLoaded: null,
    blogHTML: "Write your blog title here...",
    blogTitle: "",
    blogPhotoName: "",
    blogPhotoFileURL: null,
    blogPhotoPreview: null,

    editPost: null,
    //use state to control the access to admin previleges
    user: null, //if user is logged in, user will be an object, otherwise null
    profileAdim: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null, //the uid created by firebase
    profileInitials: null,
  },

  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2); //2 newset blog posts to show in home
    },
    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6); //next 4 blog posts to show in home small blog cards
    },
  },
  mutations: {
    newBlogPost(state, payload) {
      state.blogHTML = payload;
      console.log(state.blogHTML);
    },
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
    },

    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },

    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    toggleEditPost(state, payload) {
      state.editPost = payload;
      console.log(state.editPost);
    },
    //hide the deleted post before refreshing
    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(
        //recreates the array without the deleted post
        (post) => post.blogID !== payload
      );
    },
    //edit post
    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },

    updateUser(state, payload) {
      state.user = payload;
    },

    setProfileAdmin(state, payload) {
      state.profileAdmin = payload;
      console.log(state.profileAdmin);
    },

    //doc is dbResults in getCurrentUser
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
      console.log(state.profileId);
    },
    //generate initials
    setProfileInitials(state) {
      state.profileInitials =
        state.profileFirstName.match(/(\b\S)?/g).join("") +
        state.profileLastName.match(/(\b\S)?/g).join("");
    },

    //change profile info
    changeFirstName(state, payload) {
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      state.profileLastName = payload;
    },
    changeUsername(state, payload) {
      state.profileUsername = payload;
    },
  },
  actions: {
    //get current user, only change user state by commit
    async getCurrentUser({ commit }, user) {
      const firestore = getFirestore(db);
      const collectionRef = collection(firestore, "users");
      const dataBase = await doc(collectionRef, getAuth().currentUser.uid);
      const dbResults = await getDoc(dataBase); //get the current user

      commit("setProfileInfo", dbResults); //update result by mutation
      commit("setProfileInitials");
      console.log(dbResults); //only use when testing if the user is logged in
      const token = await user.getIdTokenResult();
      const admin = await token.claims.admin;
      commit("setProfileAdmin", admin); //use mutation to change admin status
    },

    //updates the user profile
    async updateUserSettings({ commit, state }) {
      const firestore = getFirestore(db);
      const collectionRef = collection(firestore, "users");
      const docRef = await doc(collectionRef, state.profileId);
      await updateDoc(docRef, {
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials"); //update initials
    },

    async getPost({ state }) {
      const dataBase = await collection(getFirestore(db), "blogPosts");
      const q = query(dataBase, orderBy("date", "desc"));
      const dbResults = await getDocs(q);
      dbResults.forEach((doc) => {
        //the if filter make sure the same blog won't be added twice
        if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
          };
          state.blogPosts.push(data); //push the data to the blogPosts array
        }
      });
      state.postLoaded = true;
      console.log(state.blogPosts);
    },

    async updatePost({ commit, dispatch }, payload) {
      commit("filterBlogPost", payload);
      await dispatch("getPost");
    },

    async deletePost({ commit }, payload) {
      const getPost = await doc(
        collection(getFirestore(db), "blogPosts"),
        payload
      );
      await deleteDoc(getPost);
      commit("filterBlogPost", payload); //the user doesn/t have to refresh to see its been deleted
    },
  },
  modules: {},
});
