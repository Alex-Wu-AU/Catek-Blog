<template>
  <div class="home">
    <BlogPost :post="welcomeScreen" />
    <BlogPost
      :post="post"
      v-for="(post, index) in sampleBlogPost"
      :key="index"
    />
  </div>
</template>

<script>
import BlogPost from "../components/BlogPost.vue";
export default {
  name: "Home",
  components: { BlogPost },
  data() {
    return {
      welcomeScreen: {
        title: "Welcome!",
        blogPost:
          "Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
        welcomeScreen: true,
        photo: "coding",
      },
      sampleBlogPost: [
        {
          title: "Blog Post 1",
          blogHTML: "a",
          blogPost:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        },
        {
          title: "Blog Post 2",
          blogHTML: "a",
          blogPost:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
        },
      ],
    };
  },
};
</script>
