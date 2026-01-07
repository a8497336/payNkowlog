<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="avatar">
        <img :src="userInfo?.avatar || '/default-avatar.png'" :alt="userInfo?.nickname" />
      </div>
      <div class="info">
        <div class="nickname">{{ userInfo?.nickname || '未登录' }}</div>
        <div class="member-level">{{ memberLevelText }}</div>
      </div>
      <van-button v-if="!userStore.isLogin" type="primary" size="small" @click="goToLogin">
        立即登录
      </van-button>
    </div>

    <div class="menu-list">
      <van-cell-group>
        <van-cell
          title="已购课程"
          is-link
          @click="goToPurchased"
        >
          <template #icon>
            <van-icon name="video-o" size="20" color="#ff6b6b" />
          </template>
        </van-cell>
        <van-cell
          title="观看历史"
          is-link
          @click="goToHistory"
        >
          <template #icon>
            <van-icon name="clock-o" size="20" color="#ff6b6b" />
          </template>
        </van-cell>
        <van-cell
          title="我的订单"
          is-link
          @click="goToOrders"
        >
          <template #icon>
            <van-icon name="balance-list-o" size="20" color="#ff6b6b" />
          </template>
        </van-cell>
        <van-cell
          title="优惠券"
          is-link
          @click="goToCoupons"
        >
          <template #icon>
            <van-icon name="coupon-o" size="20" color="#ff6b6b" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group style="margin-top: 12px;">
        <van-cell
          title="设置"
          is-link
          @click="goToSettings"
        >
          <template #icon>
            <van-icon name="setting-o" size="20" color="#ff6b6b" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-button
      v-if="userStore.isLogin"
      type="danger"
      block
      style="margin: 24px 16px;"
      @click="handleLogout"
    >
      退出登录
    </van-button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserProfile } from '@/api/user'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const userInfo = ref(null)

const memberLevelText = computed(() => {
  if (!userInfo.value) return '游客'
  const levels = {
    0: '普通会员',
    1: 'VIP会员',
    2: 'SVIP会员'
  }
  return levels[userInfo.value.member_level] || '普通会员'
})

const loadUserInfo = async () => {
  if (!userStore.isLogin) return
  try {
    const res = await getUserProfile()
    userInfo.value = res.data
    userStore.setUserInfo(res.data)
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

const goToLogin = () => {
  router.push('/')
}

const goToPurchased = () => {
  router.push('/purchased')
}

const goToHistory = () => {
  router.push('/history')
}

const goToOrders = () => {
  router.push('/orders')
}

const goToCoupons = () => {
  router.push('/coupons')
}

const goToSettings = () => {
  router.push('/settings')
}

const handleLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？'
  }).then(() => {
    userStore.logout()
    userInfo.value = null
    router.push('/')
  }).catch(() => {})
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: #fff;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  margin-right: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.info {
  flex: 1;
}

.nickname {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.member-level {
  font-size: 12px;
  opacity: 0.9;
}

.menu-list {
  padding: 16px;
}

:deep(.van-cell) {
  padding: 16px;
  
  .van-icon {
    margin-right: 12px;
  }
}
</style>
