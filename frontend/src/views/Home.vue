<template>
  <div class="home-page">
    <van-nav-bar
      title="知识付费"
      :fixed="true"
      :z-index="100"
    >
      <template #right>
        <van-icon name="search" size="20" @click="showSearch = true" />
      </template>
    </van-nav-bar>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="content">
        <van-swipe :autoplay="3000" indicator-color="white" class="banner-swipe" :width="750" :height="180">
          <van-swipe-item v-for="item in banners" :key="item.id">
            <img :src="item.image" :alt="item.title" class="banner-image" />
          </van-swipe-item>
        </van-swipe>

        <van-tabs v-model:active="activeCategory" @change="onCategoryChange" class="category-tabs">
          <van-tab v-for="category in categories" :key="category.id" :title="category.name" />
        </van-tabs>

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
      </div>
    </van-pull-refresh>

    <van-popup v-model:show="showSearch" position="top" :style="{ height: '100%' }">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索课程"
        @search="onSearch"
        @cancel="showSearch = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { getHomeData, getCourseList } from '@/api/course'
import { debounce } from '@/utils'

const router = useRouter()
const courseStore = useCourseStore()

const banners = ref([])
const categories = ref([])
const courseList = ref([])
const activeCategory = ref(0)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const showSearch = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const onRefresh = async () => {
  finished.value = false
  currentPage.value = 1
  await loadHomeData()
  refreshing.value = false
}

const onLoad = async () => {
  if (refreshing.value) return
  await loadCourseList()
}

const loadHomeData = async () => {
  try {
    const res = await getHomeData()
    banners.value = res.data.banners || []
    categories.value = res.data.categories || []
    courseList.value = res.data.courses || []
    courseStore.setCourseList(courseList.value)
  } catch (error) {
    console.error('加载首页数据失败:', error)
  }
}

const loadCourseList = async () => {
  try {
    loading.value = true
    const params = {
      category_id: activeCategory.value > 0 ? categories.value[activeCategory.value - 1].id : null,
      page: currentPage.value,
      size: pageSize.value
    }
    const res = await getCourseList(params)
    const newCourses = res.data.list || []
    
    if (currentPage.value === 1) {
      courseList.value = newCourses
    } else {
      courseList.value = [...courseList.value, ...newCourses]
    }
    
    courseStore.setCourseList(courseList.value)
    courseStore.setPageInfo(currentPage.value, pageSize.value, res.data.total || 0)
    
    if (newCourses.length < pageSize.value) {
      finished.value = true
    } else {
      currentPage.value++
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const onCategoryChange = () => {
  currentPage.value = 1
  finished.value = false
  loadCourseList()
}

const onSearch = debounce(() => {
  if (!searchKeyword.value.trim()) {
    return
  }
  router.push({
    path: '/search',
    query: { keyword: searchKeyword.value }
  })
}, 500)

const goToDetail = (id) => {
  router.push(`/course/${id}`)
}

onMounted(() => {
  loadHomeData()
})
</script>

<style lang="scss" scoped>
.home-page {
  padding-top: 46px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding-bottom: 20px;
}

.banner-swipe {
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.category-tabs {
  margin: 0 12px;
  background-color: #fff;
  border-radius: 8px;
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
