<template>
  <div id="app">
    <Header v-if="$route.path !== '/login'" />
    <router-view/>
  </div>
</template>

<script>
import Header from "@/components/Header"

export default {
  components: {
    Header
  },
  mounted() {
    const uid = this.$store.dispatch('getUid')
    if(uid) {
      this.$store.dispatch('loadFavorites')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #FAFAFA;
  font-family: "Roboto";
}
a {
  text-decoration: none;
}
img {
  max-width: 100%;
}
ul {
  list-style: none;
}
</style>
