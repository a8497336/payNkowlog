<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="register-title">知识付费</h1>
        <p class="register-subtitle">创建新账号</p>
      </div>

      <van-form @submit="onSubmit" class="register-form">
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
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' }
          ]"
          clearable
        >
          <template #left-icon>
            <van-icon name="lock" />
          </template>
        </van-field>

        <van-field
          v-model="formData.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次密码不一致' }
          ]"
          clearable
        >
          <template #left-icon>
            <van-icon name="lock" />
          </template>
        </van-field>

        <div class="register-actions">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
            loading-text="注册中..."
            class="register-button"
          >
            注册
          </van-button>
        </div>
      </van-form>

      <div class="register-footer">
        <p class="footer-text">已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { register } from '@/api/user'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)

const validateConfirmPassword = (val) => {
  return val === formData.value.password
}

const onSubmit = async () => {
  try {
    loading.value = true

    const res = await register({
      username: formData.value.username,
      password: formData.value.password
    })

    if (res.code === 200) {
      showToast({
        type: 'success',
        message: '注册成功'
      })

      setTimeout(() => {
        router.push('/login')
      }, 500)
    } else {
      showToast({
        type: 'fail',
        message: res.message || '注册失败'
      })
    }
  } catch (error) {
    console.error('注册失败:', error)
    showToast({
      type: 'fail',
      message: error.response?.data?.message || '注册失败，请稍后重试'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.register-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.register-form {
  margin-bottom: 24px;
}

.register-actions {
  margin-top: 32px;
}

.register-button {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.register-footer {
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
