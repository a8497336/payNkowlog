import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePayStore = defineStore('pay', () => {
  const currentOrder = ref(null)
  const selectedCoupon = ref(null)
  const couponList = ref([])
  const finalAmount = ref(0)
  const isPaying = ref(false)
  const payResult = ref(null)

  const setCurrentOrder = (order) => {
    currentOrder.value = order
  }

  const setSelectedCoupon = (coupon) => {
    selectedCoupon.value = coupon
  }

  const setCouponList = (list) => {
    couponList.value = list
  }

  const setFinalAmount = (amount) => {
    finalAmount.value = amount
  }

  const setPaying = (paying) => {
    isPaying.value = paying
  }

  const setPayResult = (result) => {
    payResult.value = result
  }

  const calculateFinalAmount = (price) => {
    let amount = price
    if (selectedCoupon.value) {
      amount = Math.max(0, amount - selectedCoupon.value.amount)
    }
    finalAmount.value = amount
    return amount
  }

  const resetPayState = () => {
    currentOrder.value = null
    selectedCoupon.value = null
    finalAmount.value = 0
    isPaying.value = false
    payResult.value = null
  }

  return {
    currentOrder,
    selectedCoupon,
    couponList,
    finalAmount,
    isPaying,
    payResult,
    setCurrentOrder,
    setSelectedCoupon,
    setCouponList,
    setFinalAmount,
    setPaying,
    setPayResult,
    calculateFinalAmount,
    resetPayState
  }
})
