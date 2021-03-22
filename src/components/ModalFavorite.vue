<template>
  <div class="modal-favorite">
    <div class="modal-favorite__wrap">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <h3 class="modal-favorite__title">Сохранить запрос</h3>
        <el-form-item label="Запрос" prop="q">
          <el-input type="text" v-model="ruleForm.q" autocomplete="off" :disabled="create"></el-input>
        </el-form-item>
        <el-form-item label="Название" prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="modal-favorite__select">
          <h5 class="el-form-item__label">Сортировать по</h5>
          <el-select v-model="ruleForm.order" placeholder="Без сортировки">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="modal-favorite__slider">
          <h4 class="el-form-item__label modal-favorite__slider-title">Максимальное количество</h4>
          <el-slider
            v-model="ruleForm.maxCount"
            :min="1"
            :max="52"
            show-input
          ></el-slider>
        </div>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">Не сохранять</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >Сохранить</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalFavorite",
  props: {
    create: Boolean,
    input: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 12
    },
    id: String
  },
  data() {
    var validateQ = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Введите что-то"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Это поле обязательно"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        q: null,
        name: "",
        order: "relevance",
        maxCount: 12
      },
      options: [
        {
          value: "date",
          label: "Дата",
        },
        {
          value: "rating",
          label: "Рейтинг",
        },
        {
          value: "relevance",
          label: "Релевантность",
        },
        {
          value: "viewCount",
          label: "Колличеству просмотров",
        }
      ],
      rules: {
        q: [{ validator: validateQ, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if(this.create) {
            await this.$store.dispatch('createFavorite', {q: this.ruleForm.q, name: this.ruleForm.name, count: this.ruleForm.maxCount, order: this.ruleForm.order})
          } else {
            await this.$store.dispatch('updateFavorite', {q: this.ruleForm.q, name: this.ruleForm.name, count: this.ruleForm.maxCount, order: this.ruleForm.order, id: this.id})
          }
          
          this.$emit("closeModal");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$emit("closeModal");
    },
  },
  mounted() {
    this.ruleForm.q = this.input
    this.ruleForm.name = this.name
    this.ruleForm.maxCount = this.count
  }
};
</script>

<style>
.modal-favorite {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(117, 199, 255, 0.8);
}

.modal-favorite__wrap {
  max-width: 510px;
  width: calc(100% - 40px);

  padding: 40px;

  background: #ffffff;
  box-shadow: 0px 10px 50px rgba(19, 144, 229, 0.8);
  border-radius: 10px;
}

.modal-favorite__title {
  text-align: center;
  font-size: 18px;
  line-height: 28px;
  margin-bottom: 25px;
}

.el-form-item {
  display: flex;
  flex-direction: column;
}

.el-form-item__label {
  text-align: left !important;
}

.el-form-item__content {
  margin-left: 0 !important;
}

.el-select {
  width: 100%;
}

.el-form-item__label {
  font-weight: 400;
}

.modal-favorite__slider {
  margin-top: 22px;
  margin-bottom: 15px;
}

.modal-favorite__slider .el-form-item__label {
  float: none;
}
</style>
