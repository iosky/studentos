<template>
  <div id="login-container">
    <el-form class="login-form"
             :rules="rules"
             autoComplete="on"
             :model="loginForm"
             ref="loginForm">
      <el-form-item prop="username"
                    label="username">
        <el-input v-model="loginForm.username"
                  placeholder="请输入用户名"
                  autoComplete="on"
                  type="text"></el-input>
      </el-form-item>
      <el-form-item prop="password"
                    label="password">
        <el-input v-model="loginForm.password"
                  type="password"
                  @keyup.enter.native="handleLogin"
                  placeholder="请输入密码"
                  auto-complete="on"></el-input>
      </el-form-item>

    </el-form>
    <el-row>
      <el-col :span="24"
              class="btn-container">
        <el-button type="primary"
                   size="medium"
                   round
                   class="Btn"
                   :loading="loading"
                   @click.native.prevent="handleLogin">登录</el-button>
      </el-col>

    </el-row>
  </div>
</template>
<script>
// FIXME: 用户登录模块实在是烂，记得优化此模块
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === 'admin') {
        this.$store.dispatch('setRole', 'admin')
        this.DB.getByIndex('admin', value, 'account')
          .then(result => {
            this.$store.dispatch('setAccount', result)
          })
          .catch(error => {
            callback(error)
          })
        callback()
      } else {
        // 表示此时是用户登录
        this.$store.dispatch('setRole', 'user')
        this.DB.getByIndex('user', value, 'account')
          .then(result => {
            this.$store.dispatch('setAccount', result)
            callback()
          })
          .catch(error => {
            console.log(error)
            callback(error)
          })
      }
    }
    const validatepassword = (rule, value, callback) => {
      let isEqual = this._.isEqual(this.$store.getters.password, value)
      isEqual && callback()
      callback(new Error('密码错误，请重新输入！！！'))
    }
    return {
      loginForm: {
        username: 'admin',
        password: '987654321'
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatepassword
          }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        //TODO: 解决登录处理
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('login')
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/about' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // 登录错误
          console.log('error')
        }
      })
    },
    register() {}
  }
}
</script>
<style>
#login-container {
  width: 300px;
  padding: 20px 30px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.16);
}
.btn-container {
  display: flex;
  justify-content: center;
}
.Btn {
  width: 200px;
}
.el-row {
  margin: 10px 0;
}
</style>
