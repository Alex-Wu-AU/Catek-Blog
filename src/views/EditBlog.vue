<template>
  <div class="create-post">
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ this.errorMsg }}</p>
      </div>

      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            @change="fileChange"
            accept=".png, .jpg, ,jpeg"
          />
          <!-- only exists if there's an image to preview -->
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <vue-editor
          :editorOptions="editorSettings"
          v-model="blogHTML"
          useCustomImageHandler
          @image-added="imageHandler"
          toolbar="full"
        />
      </div>
      <div class="blog-actions">
        <button @click="updateBlog">Save Changes</button>
        <router-link class="router-button" :to="{ name: 'BlogPreview' }"
          >Preview Changes</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  getStorage,
  ref,
  uploadBytes, //upload the file to firebase storage
  getDownloadURL,
  uploadBytesResumable, //upload the file to firebase storage with ability to control upload process
} from "firebase/storage";
import db from "../firebase/firebaseInit";
import { getFirestore, collection, doc, updateDoc } from "firebase/firestore";
import BlogCoverPreview from "../components/BlogCoverPreview.vue";
import Loading from "../components/Loading.vue";
import Quill from "quill";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);

export default {
  name: "CreatePost",
  components: {
    BlogCoverPreview,
    Loading,
  },
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      currentBlog: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },
  //edits the blog
  async mounted() {
    this.routeID = this.$route.params.blogid;
    this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
      return post.blogID === this.routeID;
    });
    this.$store.commit("setBlogState", this.currentBlog[0]);
  },
  methods: {
    fileChange() {
      // Check if a file was selected
      if (this.$refs.blogPhoto.files.length > 0) {
        this.file = this.$refs.blogPhoto.files[0];
        const fileName = this.file.name;
        this.$store.commit("fileNameChange", fileName);
        this.$store.commit("createFileURL", URL.createObjectURL(this.file));
      } else {
        // Handle the case where no file was selected
        // You can display an error message or take appropriate action
        console.error("No file selected");
      }
    },

    openPreview() {
      this.$store.commit("openPhotoPreview");
    },

    //custom image handler
    async imageHandler(file, Editor, cursorLocation, resetUploader) {
      const storage = getStorage();
      const storageRef = ref(storage, `documents/blogPostPhotos/${file.name}`);

      console.log("Running image handler");

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        // Insert the image into the Quill Editor
        Editor.insertEmbed(cursorLocation, "image", downloadURL);
        resetUploader();
      } catch (error) {
        // Handle errors
        console.error("Error uploading image", error);
      }
    },

    //upload the blog to the database
    async updateBlog() {
      const dataBase = await doc(
        collection(getFirestore(db), "blogPosts"),
        this.routeID
      );
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        if (this.file) {
          //see if the user has uploaded a cover photo
          //while uploading, show the loading component
          this.loading = true;
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `documents/blogCoverPhotos/${this.$store.state.blogPhotoName}`
          );

          const uploadTask = uploadBytesResumable(storageRef, this.file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              console.log(error);
              this.loading = false;
            },
            async () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              await getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  console.log("File available at", downloadURL);

                  // const docRef = doc(dataBase);
                  await updateDoc(dataBase, {
                    blogHTML: this.blogHTML,
                    blogCoverPhoto: downloadURL,
                    blogCoverPhotoName: this.blogCoverPhotoName,
                    blogTitle: this.blogTitle,
                  });
                  await this.$store.dispatch("updatePost", this.routeID);
                  this.loading = false;
                  this.$router.push({
                    name: "ViewBlog",
                    params: { blogid: dataBase.id },
                  });
                }
              );
            }
          );
          return;
        }
        this.loading = true;
        await updateDoc(dataBase, {
          blogHTML: this.blogHTML,
          blogTitle: this.blogTitle,
        });
        await this.$store.dispatch("updatePost", this.routeID);
        //after updating
        this.loading = false;
        this.$router.push({
          name: "ViewBlog",
          params: { blogid: this.routeID },
        });
        return;
      }
      this.error = true;
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!";
      setTimeout(() => {
        this.error = false;
      }, 5000);
      return;
    },
  },
  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      },
    },
  },
};
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: #fff;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;

    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  // error styling
  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      //when focus, change the shadow
      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      //hide the input
      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }

    .ql-editor {
      padding: 20px 16px 30px;
    }
  }

  .blog-actions {
    margin-top: 32px;

    button {
      margin-right: 16px;
    }
  }
}
</style>
