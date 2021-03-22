<template>
  <header class="header">
    <div class="header__wrap">
      <router-link to="/" class="header__logo">
        <img src="~@/assets/sibdev-logo.svg" alt="" class="header__logo-img" />
      </router-link>
      <nav class="header__nav">
        <router-link class="header__nav-link" to="/" exact>Поиск</router-link>
        <router-link class="header__nav-link" to="/favorites"
          >Избранное</router-link
        >
      </nav>
      <div class="header__logout">
        <a href="#" class="header__nav-link" @click.prevent="logout">Выйти</a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.header {
  background-color: #fff;
}

.header__wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 80px;
  max-width: 1080px;
  padding: 8px 20px;
  margin: 0 auto;
}

.header__logo,
.header__logo img {
  height: 100%;
}

.header__nav {
  margin-left: 30px;
}

.header__nav-link {
  position: relative;
  margin: 0 20px;
  font-size: 18px;
  line-height: 28px;
  color: #1390e5;
}

.header__nav-link.router-link-active::before,
.header__nav-link::before {
  position: absolute;
  bottom: -25px;
  left: 0px;
  content: "";
  display: block;
  width: 100%;
  height: 2px;
  background-color: #1390e5;
  transition: 0.3s all ease;
  opacity: 0;
}
.header__nav-link.router-link-active::before,
.header__nav-link:hover::before {
  opacity: 1;
}

.header__logout {
  margin-left: auto;
}
</style>
