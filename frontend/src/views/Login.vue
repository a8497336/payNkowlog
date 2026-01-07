<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">知识付费</h1>
        <p class="login-subtitle">欢迎回来</p>
      </div>

      <van-form @submit="onSubmit" class="login-form">
        <van-field
          v-model="formData.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
          clearable
        >
          <template #left-icon>
            <van-icon name="user-o" />
          </template>
        </van-field>

        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
          clearable
        >
          <template #left-icon>
            <van-icon name="lock" />
          </template>
        </van-field>

        <div class="login-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
            class="login-button"
          >
            登录
          </van-button>
        </div>
      </van-form>

      <div class="login-footer">
        <p class="footer-text">还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/stores/user'
import { usernameLogin } from '@/api/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formData = ref({
  username: '',
  password: ''
})
const loading = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true

    const res = await usernameLogin({
      username: formData.value.username,
      password: formData.value.password
    })

    if (res.code === 200) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.user)
      showToast({
        type: 'success',
        message: '登录成功'
      })

      const redirect = route.query.redirect || '/'
      console.log('登录成功，跳转到:', redirect)
      setTimeout(() => {
        router.push(redirect)
      }, 500)
    } else {
      showToast({
        type: 'fail',
        message: res.message || '登录失败'
      })
    }
  } catch (error) {
    console.error('登录失败:', error)
    showToast({
      type: 'fail',
      message: '登录失败，请检查用户名和密码'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.login-actions {
  margin-top: 32px;
}

.login-button {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.footer-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.footer-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}
</style>
