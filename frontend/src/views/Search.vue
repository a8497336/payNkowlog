<template>
  <div class="search-page">
    <van-nav-bar
      title="搜索"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="search" size="20" @click="showSearch = true" />
      </template>
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="content">
        <div class="course-list">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-for="course in courseList"
              :key="course.id"
              class="course-item"
              @click="goToDetail(course.id)"
            >
              <img :src="course.cover" :alt="course.title" class="course-cover" />
              <div class="course-info">
                <div class="course-title">{{ course.title }}</div>
                <div class="course-meta">
                  <span class="lecturer">{{ course.lecturer }}</span>
                  <span class="sales">{{ course.sales }}人已学</span>
                </div>
                <div class="course-price">
                  <span class="price">¥{{ course.price }}</span>
                  <span v-if="course.original_price" class="original-price">¥{{ course.original_price }}</span>
                </div>
              </div>
            </div>
          </van-list>
        </div>

        <van-empty v-if="!loading && courseList.length === 0" description="暂无搜索结果" />
      </div>
    </van-pull-refresh>

    <van-popup v-model:show="showSearch" position="top" :style="{ height: '100%' }">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索课程"
        @search="onSearch"
        @cancel="showSearch = false"
        autofocus
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { searchCourses } from '@/api/course'

const router = useRouter()
const route = useRoute()
const courseStore = useCourseStore()

const courseList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const isLoading = ref(false)
const showSearch = ref(true)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const onClickLeft = () => {
  router.back()
}

const onRefresh = async () => {
  finished.value = false
  currentPage.value = 1
  await loadSearchResults()
  refreshing.value = false
}

const onLoad = async () => {
  if (refreshing.value || isLoading.value) return
  await loadSearchResults()
}

const loadSearchResults = async () => {
  if (!searchKeyword.value.trim()) {
    return
  }

  try {
    isLoading.value = true
    loading.value = true
    const params = {
      keyword: searchKeyword.value,
      page: currentPage.value,
      size: pageSize.value
    }
    const res = await searchCourses(params)
    const newCourses = res.data.list || []
    
    if (currentPage.value === 1) {
      courseList.value = newCourses
    } else {
      courseList.value = [...courseList.value, ...newCourses]
    }
    
    if (newCourses.length < pageSize.value) {
      finished.value = true
    } else {
      currentPage.value++
    }
  } catch (error) {
    console.error('加载搜索结果失败:', error)
  } finally {
    loading.value = false
    isLoading.value = false
  }
}

const onSearch = () => {
  if (!searchKeyword.value.trim()) {
    return
  }
  showSearch.value = false
  currentPage.value = 1
  finished.value = false
  loadSearchResults()
}

const goToDetail = (id) => {
  router.push(`/course/${id}`)
}

onMounted(() => {
  const keyword = route.query.keyword
  if (keyword) {
    searchKeyword.value = decodeURIComponent(keyword)
    showSearch.value = false
    loadSearchResults()
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  padding-top: 46px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding-bottom: 20px;
}

.course-list {
  padding: 12px;
}

.course-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  cursor: pointer;
}

.course-cover {
  width: 120px;
  height: 90px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
}

.course-price {
  display: flex;
  align-items: baseline;
  margin-top: 8px;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #ff6b6b;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 6px;
}
</style>
