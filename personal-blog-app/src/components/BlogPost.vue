<template>
  <div class="blog-wrapper">
    <div class="blog-content">
      <!-- use v-if to render different type of content: welcome/post -->
      <div>
        <h2 v-if="post.welcomeScreen">{{ post.title }}</h2>
        <h2 v-else>{{ post.title }}</h2>
        <p v-if="post.welcomeScreen">{{ post.blogPost }}</p>
        <!-- only show a preview title-->
        <p class="content-preview" v-else v-html="post.blogHTML"></p>
        <router-link class="link link-light" v-if="post.welcomeScreen" to="#">
          Login/Register
          <img
            src="../assets/Icons/twitter-brands.svg"
            class="svg-icon"
            alt="Twitter Icon"
          />
          <Arrow class="arrow arrow-light" />
        </router-link>
        <router-link class="link" v-else>
          View The Post<Arrow class="arrow" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlogPost",
  props: ["post"],
};
</script>

<style lang="scss" scoped></style>
