import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  const courseList = ref([])
  const courseDetail = ref(null)
  const chapterList = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const hasMore = ref(true)

  const setCourseList = (list) => {
    courseList.value = list
  }

  const appendCourseList = (list) => {
    courseList.value = [...courseList.value, ...list]
  }

  const setCourseDetail = (detail) => {
    courseDetail.value = detail
  }

  const setChapterList = (list) => {
    chapterList.value = list
  }

  const setPageInfo = (page, size, totalNum) => {
    currentPage.value = page
    pageSize.value = size
    total.value = totalNum
    hasMore.value = page * size < totalNum
  }

  const resetCourseList = () => {
    courseList.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  return {
    courseList,
    courseDetail,
    chapterList,
    currentPage,
    pageSize,
    total,
    hasMore,
    setCourseList,
    appendCourseList,
    setCourseDetail,
    setChapterList,
    setPageInfo,
    resetCourseList
  }
})
