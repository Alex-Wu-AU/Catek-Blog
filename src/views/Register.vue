<template>
  <div class="form-wrap">
    <form class="register">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'Login' }"
          >Login</router-link
        >
      </p>
      <h2>Create Your CatekBlog Account</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="username" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <email class="icon" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
        <div v-show="error" class="error">{{ this.errorMsg }}</div>
      </div>
      <button @click.prevent="register">Sign Up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from "../assets/svgComponents/Email.vue";
import password from "../assets/svgComponents/Password.vue";
import user from "../assets/svgComponents/User.vue";
// import firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import db from "../firebase/firebaseInit";
export default {
  name: "Register",
  components: {
    email,
    password,
    user,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: null,
      errorMsg: "",
    };
  },
  methods: {
    async register() {
      if (
        this.email !== "" &&
        this.password !== "" &&
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.username !== ""
      ) {
        this.error = false;
        this.errorMsg = "";
        try {
          const createUser = await createUserWithEmailAndPassword(
            getAuth(),
            this.email,
            this.password
          );
          const result = await createUser;
          const firestore = getFirestore(db);
          const uid = result.user.uid;
          const userRef = doc(firestore, "users", uid);
          //setDoc methods stores the data to the firestore database
          await setDoc(userRef, {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            email: this.email,
          });
          this.$router.push({ name: "Home" });
          return;
        } catch (err) {
          this.error = true;
          this.errorMsg = err.message;
        }
      } else {
        this.error = true;
        this.errorMsg = "Please fill out all the fields!";
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
