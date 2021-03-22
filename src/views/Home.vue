<template>
  <div class="home">
    <div class="home__container">
      <h1 class="home__title">Поиск видео</h1>
      <div class="home__search">
        <el-input placeholder="Введите что-то" v-model="input" ref="input">
        </el-input>
        <i class="el-icon-star-off" @click="showModal"></i>
        <el-button type="primary" @click="load">Найти</el-button>
      </div>
      <div class="home__main" v-show="videos.length">
        <div class="home__info">
          <h3 class="home__main-title" ref="request"></h3>
          <span class="home__main-count" ref="requestCount"></span>
          <div class="home__main-icons">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="grid = false"
              class="home__main-icon"
              :class="{ active: grid }"
            >
              <g>
                <path
                  d="M8 6H21"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 12H21"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 18H21"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 6H3.01"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 12H3.01"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M3 18H3.01"
                  stroke="#272727"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              @click="grid = true"
              class="home__main-icon"
              :class="{ active: !grid }"
            >
              <path
                d="M10 5H5V10H10V5Z"
                stroke="#272727"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 5H14V10H19V5Z"
                stroke="#272727"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 14H14V19H19V14Z"
                stroke="#272727"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 14H5V19H10V14Z"
                stroke="#272727"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div class="home__list" :class="{ 'home__list--list': !grid }">
          <div class="home__item" v-for="video in videos" :key="video.etag">
            <figure class="home__item-img">
              <img :src="video.snippet.thumbnails.high.url" alt="" />
            </figure>
            <h3 class="home__item-title">
              {{
                grid ? splitText(video.snippet.title, 27) : video.snippet.title
              }}
            </h3>
            <p class="home__item-description">
              {{
                grid
                  ? splitText(video.snippet.description, 30)
                  : video.snippet.description
              }}
            </p>
            <p class="home__item-views">{{ video.views | view }}</p>
          </div>
        </div>
      </div>
    </div>
    <transition name="modal">
      <ModalFavorite
        create
        :input="input"
        :count="25"
        v-if="isShowModal"
        @closeModal="closeModal"
      />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalFavorite from "../components/ModalFavorite.vue";

export default {
  name: "Home",
  components: { ModalFavorite },
  data() {
    return {
      input: "",
      isShowModal: false,

      grid: true,
    };
  },
  methods: {
    showModal() {
      if (this.input !== "") {
        this.isShowModal = true;
      }
    },
    closeModal() {
      this.isShowModal = false;
    },
    load() {
      this.loadVideos(12, 'relevance')
    },
    async loadVideos(count = 12, order = 'relevance') {
      if (this.input == "") {
        return;
      }
      const countVideo = await this.$store.dispatch("fetchVideosFromYoutube", {
        q: this.input,
        count,
        order
      });
      this.$refs.request.textContent = `Видео по запросу «${this.input}»`;
      if (countVideo >= 1000000) {
        this.$refs.requestCount.textContent = `>${countVideo}`;
      } else {
        this.$refs.requestCount.textContent = countVideo;
      }
    },
    splitText(text, count) {
      if (text.length > count) {
        return text.slice(0, count - 3) + "...";
      } else {
        return text;
      }
    },
  },
  computed: {
    ...mapGetters(["videos"]),
  },
  mounted() {
    this.$refs.input.$refs.input.addEventListener("keyup", (e) => {
      if (e.keyCode == 13) {
        this.loadVideos();
      }
    });
    if(this.$route.query.value) {
      this.input = this.$route.query.value
      this.loadVideos(this.$route.query.count, this.$route.query.order)
    }
    console.log(this.$route)
  },
  beforeDestroy() {
    this.$store.dispatch('cleanVideos')
  }
};
</script>

<style>
.home__container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  min-height: calc(100vh - 80px);
  max-width: 1040px;
  margin: auto;
}

.home__title {
  text-align: center;
  margin-bottom: 50px;
}

.home__search {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
}

.home__search i {
  position: absolute;
  right: 90px;
  top: 50%;
  transform: translateY(-50%);

  cursor: pointer;
}

.home__search button {
  margin-top: -1px;
  margin-left: 1px;
  border: none;
}

.home__main {
  margin-top: 40px;
  width: 100%;
}

.home__main-icons {
  margin-left: auto;
}

.home__main-icon {
  cursor: pointer;
}

.home__main-icon.active {
  opacity: 0.3;
}

.home__main-icon ~ .home__main-icon {
  margin-left: 20px;
}

.home__info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.home__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  width: 100%;
  margin-top: 15px;
}

.home__list--list {
  grid-template-columns: repeat(1, 1fr);
}

.home__list--list .home__item {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0 20px;
}

.home__list--list .home__item-img {
  grid-row: 1 / 5;
}

.home__item-img {
  width: 100%;
  margin-bottom: 8px;

  background-color: #eee;
}

.home__main-title {
  display: inline;
  font-size: 16px;
  line-height: 24px;
}

.home__main-count {
  margin-left: 15px;

  font-size: 16px;
  line-height: 24px;
  color: rgba(23, 23, 25, 0.3);
}

.home__item-title {
  margin-bottom: 8px;
}

.home__item-description,
.home__item-views {
  color: rgba(23, 23, 25, 0.3);
}

.home__item-title,
.home__item-description,
.home__item-views {
  font-size: 14px;
  line-height: 16px;
}

.home__list--list .home__item-title,
.home__list--list .home__item-description,
.home__list--list .home__item-views {
  font-size: 16px;
  line-height: 20px;
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