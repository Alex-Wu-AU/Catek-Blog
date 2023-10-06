<template>
  <header>
    <!-- desktop nav bar -->
    <nav class="container">
      <div class="branding">
        <!-- instead of looking for path, look for the name of the route -->
        <router-link class="header" :to="{ name: 'Home' }"
          >CatekBlog</router-link
        >
      </div>
      <div class="nav-links">
        <!-- if the screen is not mobile, show the links -->
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
          <router-link class="link" v-if="admin" :to="{ name: 'CreatePost' }"
            >Create Post</router-link
          >
          <!-- login not shown if user is logged in -->
          <router-link v-if="!user" class="link" :to="{ name: 'Login' }"
            >Login/Register</router-link
          >
        </ul>
        <!-- the profile menu -->
        <div
          v-if="user"
          @click="toggleProfileMenu"
          class="profile"
          ref="profile"
        >
          <span>{{ this.$store.state.profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <!-- profile info -->
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>
                  {{ this.$store.state.profileFirstName }}
                  {{ this.$store.state.profileLastName }}
                </p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <!-- profile options -->
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'Profile' }">
                  <userIcon class="icon" />
                  <p>Profile</p>
                </router-link>
              </div>

              <div class="option">
                <router-link class="option" :to="{ name: 'Admin' }">
                  <adminIcon class="icon" />
                  <p>Admin</p>
                </router-link>
              </div>

              <div @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- mobile nav bar -->
    <!-- <menuIcon /> -->
    <img
      src="../assets/Icons/bars-regular.svg"
      alt="bars-regular"
      class="menu-icon"
      @click="toggleMobileNav"
      v-show="mobile"
    />

    <!-- transition animation -->
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
        <router-link class="link" v-if="admin" :to="{ name: 'CreatePost' }"
          >Create Post</router-link
        >
        <router-link class="link" v-if="!user" :to="{ name: 'Login' }"
          >Login/Register</router-link
        >
      </ul>
    </transition>
  </header>
</template>

<script>
// import router from "@/router";
//use svg-loader to use svg as a component
// import menuIcon from "../assets/Icons/bars-regular.svg";
import userIcon from "../assets/svgComponents/userIcon.vue";
import adminIcon from "../assets/svgComponents/adminIcon.vue";
import signOutIcon from "../assets/svgComponents/signOutIcon.vue";
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "navigation",
  components: {
    // menuIcon //can't import svg as a component, used src instead
    userIcon,
    adminIcon,
    signOutIcon,
  },
  data() {
    return {
      profileMenu: null, //whether the profile menu is open or not
      mobile: null, //whether the screen is mobile or not
      mobileNav: null, //whether the mobile nav is open or not
      windownWidth: null, //the width of the window
    };
  },
  //when the component is created, add an event listener to the window to detect the screen size
  created() {
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
  },
  methods: {
    //detect the screen size
    checkScreen() {
      this.windownWidth = window.innerWidth;
      if (this.windownWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },

    //toggle the mobile nav
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },

    //toggle profile menu
    toggleProfileMenu(e) {
      //prevents the profile menu from closing when user click on any part of the profile menu
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu;
      }
    },
    //sign out the current user
    signOut() {
      signOut(getAuth());
      window.location.reload();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    admin() {
      return this.$store.state.profileAdmin;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;

    &hover {
      color: #1eb8b8;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 600;
        font-size: 24px;
        color: #000;
        text-decoration: none;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end; //put the links to the right hand side

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }

        .link:last-child {
          margin-right: 0;
        }
      }
      .profile {
        position: relative; //absolute position the profile menu
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%; //for initial
        color: #fff;
        background-color: #303030;

        //fix the issue that the user will only be able to click the outer circle of the initial to open the profile menu
        span {
          pointer-events: none;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #fff; //separate from the option div

            .initials {
              //similar to the profile
              position: initial;
              width: 40px;
              height: 40px;
              background-color: #fff;
              color: #303030;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
            }

            .right {
              flex: 1;
              margin-left: 24px;

              //first paragraph
              p:nth-child(1) {
                font-size: 14px;
              }

              p:nth-child(2),
              p:nth-child(3) {
                font-size: 12px;
              }
            }
          }

          .options {
            padding: 15px;
            .option {
              text-decoration: none;
              color: #fff;
              display: flex;
              align-items: center;
              margin-bottom: 12px; //separate the options

              .icon {
                width: 18px;
                height: auto;
              }
              p {
                font-size: 14px;
                margin-left: 12px;
              }

              //deal with the space below the last paragraph
              &:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }

  //make the large bars into a small icon
  .menu-icon {
    cursor: pointer; //change the cursor look when hover over the icon
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;

    .link {
      padding: 15px 0;
      color: #fff;
    }
  }

  //transition animations using vue transition
  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>
