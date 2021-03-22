<template>
  <div class="login-container">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div class="form__logo">
        <img src="~@/assets/sibdev-logo.svg" alt="" />
      </div>
      <el-form-item label="Email" prop="email">
        <el-input
          type="email"
          v-model.trim="ruleForm.email"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <el-input
          type="password"
          v-model.trim="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('ruleForm')"
          >Submit</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Введите email"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Введите пароль"));
      } else if (value !== this.ruleForm.pass) {
        callback();
      }
    };
    return {
      ruleForm: {
        email: "",
        password: "",
      },
      rules: {
        pass: [{ validator: validateEmail, trigger: "blur" }],
        checkPass: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await this.$store.dispatch('login', {email: this.ruleForm.email, password: this.ruleForm.password})
          if(result) {
            this.$router.push('/')
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  background: #fafafa;
}

.login-container form {
  max-width: 510px;
  width: calc(100% - 40px);

  padding: 40px 80px;

  background: #fff;
}

@media (max-width: 992px) {
  .login-container form {
    padding: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
}

.form__logo {
  margin-bottom: 30px;

  text-align: center;
}

.form__title {
  margin-bottom: 20px;

  text-align: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
}

.el-form-item {
  display: flex;
  flex-direction: column;
}

.el-form-item__label {
  text-align: left;
}

.el-form-item__content {
  margin-left: 0 !important;
}

.el-input__inner:focus {
  background-color: rgba(64, 158, 255, 0.15);
}

.el-form-item.is-error .el-input__inner {
  background-color: rgba(245, 108, 108, 0.15);
}
</style>