<template>
  <div class="reset-password">
    <!-- v-on listens the emit from the child component -->
    <Modal
      v-if="modalActive"
      :modalMessage="modalMessage"
      v-on:close-modal="closeModal"
    />
    <Loading v-if="loading" />
    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          Back to
          <router-link class="router-link" :to="{ name: 'Login' }"
            >Login</router-link
          >
        </p>
        <h2>Reset Password</h2>
        <p>Forgot your passowrd? Enter your email to reset it</p>
        <div class="inputs">
          <div class="input">
            <input type="text" placeholder="Email" v-model="email" />
            <email class="icon" />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import email from "../assets/svgComponents/Email.vue";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import db from "../firebase/firebaseInit";
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      modalActive: false,
      modalMessage: "",
      loading: null,
    };
  },
  components: {
    email,
    Modal,
    Loading,
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      try {
        const auth = getAuth(db);
        await sendPasswordResetEmail(auth, this.email);
        this.modalMessage = "If your account exists, you will receive an email";
        this.loading = false;
        this.modalActive = true;
      } catch (err) {
        this.modalMessage = err.message;
        this.loading = false;
        this.modalActive = true;
      }
    },

    closeModal() {
      this.modalActive = !this.modalActive;
      this.email = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
