<template>
  <div class="pay-popup">
    <div class="popup-header">
      <h3>确认订单</h3>
      <van-icon name="cross" @click="handleClose" />
    </div>

    <div class="course-info" v-if="course">
      <img :src="course.cover" :alt="course.title" class="course-cover" />
      <div class="course-detail">
        <div class="course-title">{{ course.title }}</div>
        <div class="course-price">¥{{ course.price }}</div>
      </div>
    </div>

    <div class="coupon-section">
      <div class="section-title">优惠券</div>
      <div class="coupon-list">
        <div
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="coupon-item"
          :class="{ selected: selectedCoupon?.id === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">¥{{ coupon.amount }}</div>
          <div class="coupon-info">
            <div class="coupon-desc">满{{ coupon.min_amount }}元可用</div>
            <div class="coupon-expire">{{ formatDate(coupon.expire_time) }}</div>
          </div>
          <van-icon v-if="selectedCoupon?.id === coupon.id" name="success" color="#ff6b6b" />
        </div>
        <div
          class="coupon-item"
          :class="{ selected: !selectedCoupon }"
          @click="selectCoupon(null)"
        >
          <div class="coupon-amount">不使用优惠券</div>
        </div>
      </div>
    </div>

    <div class="payment-section">
      <div class="section-title">支付方式</div>
      <div class="payment-methods">
        <div class="payment-item active">
          <van-icon name="wechat" size="24" color="#07c160" />
          <span>微信支付</span>
          <van-icon name="success" color="#ff6b6b" />
        </div>
      </div>
    </div>

    <div class="amount-section">
      <div class="amount-label">实付金额</div>
      <div class="amount-value">¥{{ finalAmount }}</div>
    </div>

    <div class="popup-footer">
      <van-button
        type="primary"
        size="large"
        block
        :loading="isPaying"
        @click="handlePay"
      >
        立即支付
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePayStore } from '@/stores/pay'
import { getUserCoupons } from '@/api/user'
import { createOrder, initiateWxPay } from '@/api/order'
import { showToast, showLoadingToast, closeToast } from 'vant'

const props = defineProps({
  course: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const userStore = useUserStore()
const payStore = usePayStore()

const couponList = ref([])
const selectedCoupon = ref(null)
const isPaying = ref(false)

const availableCoupons = computed(() => {
  if (!props.course) return []
  return couponList.value.filter(coupon => 
    !coupon.is_used && 
    coupon.min_amount <= props.course.price &&
    new Date(coupon.expire_time) > new Date()
  )
})

const finalAmount = computed(() => {
  if (!props.course) return '0.00'
  let amount = props.course.price
  if (selectedCoupon.value) {
    amount = Math.max(0, amount - selectedCoupon.value.amount)
  }
  return amount.toFixed(2)
})

const loadCoupons = async () => {
  try {
    const res = await getUserCoupons()
    couponList.value = res.data || []
    payStore.setCouponList(res.data || [])
  } catch (error) {
    console.error('加载优惠券失败:', error)
  }
}

const selectCoupon = (coupon) => {
  selectedCoupon.value = coupon
  payStore.setSelectedCoupon(coupon)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}到期`
}

const handlePay = async () => {
  if (!props.course) return
  
  try {
    isPaying.value = true
    showLoadingToast({
      message: '创建订单中...',
      forbidClick: true
    })

    const orderRes = await createOrder({
      course_id: props.course.id,
      coupon_id: selectedCoupon.value?.id || null
    })

    closeToast()
    showLoadingToast({
      message: '调起支付...',
      forbidClick: true
    })

    const payRes = await initiateWxPay({
      order_id: orderRes.data.order_id
    })

    closeToast()

    const payParams = payRes.data
    
    const onBridgeReady = () => {
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        {
          appId: payParams.appId,
          timeStamp: payParams.timeStamp,
          nonceStr: payParams.nonceStr,
          package: payParams.package,
          signType: payParams.signType,
          paySign: payParams.paySign
        },
        (res) => {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            showToast({
              message: '支付成功',
              type: 'success'
            })
            emit('success')
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            showToast({
              message: '支付已取消',
              type: 'fail'
            })
          } else {
            showToast({
              message: '支付失败',
              type: 'fail'
            })
          }
        }
      )
    }

    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
      }
    } else {
      onBridgeReady()
    }
  } catch (error) {
    closeToast()
    showToast({
      message: error.message || '支付失败',
      type: 'fail'
    })
  } finally {
    isPaying.value = false
  }
}

const handleClose = () => {
  emit('close')
}

onMounted(() => {
  loadCoupons()
})
</script>

<style lang="scss" scoped>
.pay-popup {
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .van-icon {
    font-size: 20px;
    color: #999;
    cursor: pointer;
  }
}

.course-info {
  display: flex;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.course-cover {
  width: 80px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.course-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
}

.coupon-section,
.payment-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.coupon-list {
  max-height: 200px;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  border-radius: 8px;
  margin-bottom: 8px;
  color: #fff;
  cursor: pointer;
  
  &.selected {
    border: 2px solid #ff6b6b;
  }
  
  &:last-child {
    background: #f0f0f0;
    color: #333;
    
    &.selected {
      border-color: #ff6b6b;
    }
  }
}

.coupon-amount {
  font-size: 24px;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.coupon-info {
  flex: 1;
}

.coupon-desc {
  font-size: 14px;
  margin-bottom: 4px;
}

.coupon-expire {
  font-size: 12px;
  opacity: 0.8;
}

.payment-methods {
  .payment-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 8px;
    
    &.active {
      background-color: #fff5f5;
      border: 1px solid #ff6b6b;
    }
    
    span {
      flex: 1;
      margin-left: 12px;
      font-size: 14px;
      color: #333;
    }
  }
}

.amount-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.amount-label {
  font-size: 14px;
  color: #666;
}

.amount-value {
  font-size: 24px;
  font-weight: 600;
  color: #ff6b6b;
}

.popup-footer {
  margin-top: 20px;
}
</style>
