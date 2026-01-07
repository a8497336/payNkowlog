<template>
  <div class="course-detail-page">
    <van-nav-bar
      title="课程详情"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />

    <div class="content" v-if="courseDetail">
      <div class="course-cover">
        <img :src="courseDetail.cover" :alt="courseDetail.title" />
      </div>

      <div class="course-info">
        <h1 class="course-title">{{ courseDetail.title }}</h1>
        <div class="course-meta">
          <span class="lecturer">讲师：{{ courseDetail.lecturer }}</span>
          <span class="sales">{{ courseDetail.sales }}人已学</span>
        </div>
        <div class="course-price">
          <span class="price">¥{{ courseDetail.price }}</span>
          <span v-if="courseDetail.original_price" class="original-price">¥{{ courseDetail.original_price }}</span>
        </div>
      </div>

      <div class="course-intro">
        <div class="section-title">课程简介</div>
        <div class="intro-content" v-html="courseDetail.intro"></div>
      </div>

      <div class="course-chapters">
        <div class="section-title">课程章节</div>
        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item
            v-for="(chapter, index) in chapterList"
            :key="chapter.id"
            :name="chapter.id"
          >
            <template #title>
              <div class="chapter-title">
                <span class="chapter-index">{{ index + 1 }}.</span>
                <span class="chapter-name">{{ chapter.title }}</span>
                <span v-if="chapter.is_try" class="try-badge">试看</span>
                <span class="chapter-duration">{{ formatTime(chapter.duration) }}</span>
              </div>
            </template>
            <div class="chapter-actions">
              <van-button
                type="primary"
                size="small"
                @click="playChapter(chapter)"
              >
                {{ chapter.is_try ? '免费试看' : '立即播放' }}
              </van-button>
            </div>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>

    <div class="bottom-bar">
      <van-button
        type="primary"
        size="large"
        block
        @click="handlePurchase"
        :disabled="isPurchased"
      >
        {{ isPurchased ? '已购买' : '立即购买' }}
      </van-button>
    </div>

    <van-popup v-model:show="showPayPopup" position="bottom" round>
      <PayPopup :course="courseDetail" @close="showPayPopup = false" @success="onPaySuccess" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCourseStore } from '@/stores/course'
import { getCourseDetail, getCourseChapters } from '@/api/course'
import { checkCourseAccess } from '@/api/user'
import { formatTime } from '@/utils'
import PayPopup from '@/components/PayPopup.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const courseStore = useCourseStore()

const courseDetail = ref(null)
const chapterList = ref([])
const activeNames = ref([])
const isPurchased = ref(false)
const showPayPopup = ref(false)

const courseId = computed(() => route.params.id)

const onClickLeft = () => {
  router.back()
}

const loadCourseDetail = async () => {
  try {
    const res = await getCourseDetail(courseId.value)
    courseDetail.value = res.data
    courseStore.setCourseDetail(res.data)
  } catch (error) {
    console.error('加载课程详情失败:', error)
  }
}

const loadChapterList = async () => {
  try {
    const res = await getCourseChapters(courseId.value)
    chapterList.value = res.data || []
    courseStore.setChapterList(res.data || [])
  } catch (error) {
    console.error('加载章节列表失败:', error)
  }
}

const checkAccess = async () => {
  if (!userStore.isLogin) return
  try {
    const res = await checkCourseAccess(courseId.value)
    isPurchased.value = res.data.hasAccess
  } catch (error) {
    console.error('检查购买权限失败:', error)
  }
}

const playChapter = async (chapter) => {
  if (!userStore.isLogin) {
    router.push('/')
    return
  }

  if (!chapter.is_try && !isPurchased.value) {
    showPayPopup.value = true
    return
  }

  router.push(`/play/${courseId.value}/${chapter.id}`)
}

const handlePurchase = () => {
  if (!userStore.isLogin) {
    router.push('/')
    return
  }
  showPayPopup.value = true
}

const onPaySuccess = () => {
  isPurchased.value = true
  showPayPopup.value = false
}

onMounted(() => {
  loadCourseDetail()
  loadChapterList()
  checkAccess()
})
</script>

<style lang="scss" scoped>
.course-detail-page {
  padding-top: 46px;
  padding-bottom: 60px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.content {
  padding-bottom: 20px;
}

.course-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.course-info {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.course-price {
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 24px;
  font-weight: 600;
  color: #ff6b6b;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 8px;
}

.course-intro,
.course-chapters {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #ff6b6b;
}

.intro-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.chapter-title {
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 12px;
}

.chapter-index {
  color: #999;
  margin-right: 4px;
}

.chapter-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.try-badge {
  display: inline-block;
  padding: 2px 6px;
  background-color: #ff6b6b;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
  margin-left: 8px;
}

.chapter-duration {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.chapter-actions {
  padding: 12px 0;
  text-align: center;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}
</style>
