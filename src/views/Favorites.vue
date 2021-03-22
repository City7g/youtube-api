<template>
  <div class="favorite">
    <h2 class="favorite__title">Избранное</h2>
    <ul class="favorite__list">
      <li
        v-for="favorite in favorites"
        :key="favorite.id"
        class="favorite__list-item"
      >
        {{ favorite.name ? favorite.name : favorite.q }}
        <el-link type="success" @click="execute(favorite.q, favorite.count, favorite.order)">Выполнить</el-link>
        <el-link type="primary" @click="openModal(favorite.q, favorite.name, favorite.count, favorite.id)">Редактировать</el-link>
      </li>
    </ul>
    <transition name="modal">
      <ModalFavorite :input="q" :name="name" :id="id" :count="count"  v-if="isShowModal" @closeModal="closeModal" />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalFavorite from "../components/ModalFavorite.vue";

export default {
  name: "Favorite",
  components: { ModalFavorite },
  data() {
    return {
      q: null,
      name: null,
      count: 12,
      id: null,
      isShowModal: false,
    };
  },
  computed: {
    ...mapGetters(["favorites"]),
  },
  methods: {
    closeModal() {
      this.isShowModal = false;
    },
    openModal(q, name, count, id) {
      this.q = q
      this.name = name
      this.count = count
      this.id = id
      this.isShowModal = true;
    },
    execute(query, count, order) {
      this.$router.push({ path: '/', query: { value: query, count, order}})
      console.log(query)
    }
  },
};
</script>

<style>
.favorite {
  min-height: calc(100vh - 80px);
  max-width: 1080px;
  margin: auto;
  padding: 40px 20px;
}

.favorite__title {
  font-size: 28px;
  line-height: 40px;
  font-weight: normal;
}

.favorite__list {
  margin-top: 40px;
}

.favorite__list-item {
  display: flex;
  justify-content: space-between;

  padding: 13px 20px;

  font-size: 16px;
  line-height: 20px;
  font-weight: 500;
  border-bottom: 1px solid #f1f1f1;
  background-color: #fff;
}

.el-link--primary {
  margin-left: 25px;
}

.el-link--success {
  margin-left: auto;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>