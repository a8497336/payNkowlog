<template>
  <div class="video-play-page">
    <div class="video-container">
      <video
        ref="videoPlayer"
        class="video-js vjs-big-play-centered vjs-fluid"
        controls
        playsinline
        webkit-playsinline
      ></video>
      <div class="watermark" v-if="userInfo">{{ userInfo.nickname }}</div>
    </div>

    <div class="chapter-list">
      <div class="chapter-header">
        <h3>课程章节</h3>
        <span class="current-chapter">{{ currentChapterTitle }}</span>
      </div>
      <van-list>
        <div
          v-for="(chapter, index) in chapterList"
          :key="chapter.id"
          class="chapter-item"
          :class="{ active: chapter.id === currentChapterId }"
          @click="switchChapter(chapter)"
        >
          <span class="chapter-index">{{ index + 1 }}</span>
          <span class="chapter-name">{{ chapter.title }}</span>
          <span class="chapter-duration">{{ formatTime(chapter.duration) }}</span>
        </div>
      </van-list>
    </div>

    <van-popup v-model:show="showTryViewLock" :close-on-click-overlay="false">
      <div class="try-view-lock">
        <van-icon name="lock" size="48" color="#ff6b6b" />
        <h3>试看结束</h3>
        <p>购买课程后即可观看完整内容</p>
        <van-button type="primary" block @click="handlePurchase">立即购买</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCourseStore } from '@/stores/course'
import { usePlayStore } from '@/stores/play'
import { getCourseChapters } from '@/api/course'
import { getSignUrl, saveProgress } from '@/api/video'
import { checkCourseAccess } from '@/api/user'
import { formatTime } from '@/utils'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const courseStore = useCourseStore()
const playStore = usePlayStore()

const videoPlayer = ref(null)
const player = ref(null)
const chapterList = ref([])
const currentChapterId = ref(null)
const currentChapterTitle = ref('')
const showTryViewLock = ref(false)
const tryViewTimer = ref(null)
const progressSaveTimer = ref(null)

const courseId = computed(() => route.params.courseId)
const chapterId = computed(() => route.params.chapterId)
const userInfo = computed(() => userStore.userInfo)
const isTryView = computed(() => playStore.isTryView)
const tryViewDuration = computed(() => playStore.tryViewDuration)

const initPlayer = async () => {
  try {
    const res = await getSignUrl({
      video_id: chapterId.value
    })
    const videoUrl = res.data.url
    
    if (player.value) {
      player.value.dispose()
    }

    player.value = videojs(videoPlayer.value, {
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }],
      controls: true,
      autoplay: true,
      preload: 'auto',
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'playbackRateMenuButton',
          'fullscreenToggle'
        ]
      }
    })

    player.value.ready(() => {
      player.value.on('timeupdate', handleTimeUpdate)
      player.value.on('ended', handleVideoEnded)
      player.value.on('play', () => {
        if (isTryView.value) {
          tryViewTimer.value = setTimeout(() => {
            player.value.pause()
            showTryViewLock.value = true
          }, tryViewDuration.value * 1000)
        }
      })
      player.value.on('pause', () => {
        if (tryViewTimer.value) {
          clearTimeout(tryViewTimer.value)
        }
      })
    })

    playStore.setVideoUrl(videoUrl)
  } catch (error) {
    console.error('初始化播放器失败:', error)
  }
}

const handleTimeUpdate = () => {
  if (!player.value) return
  
  const currentTime = player.value.currentTime()
  const duration = player.value.duration()
  
  playStore.setProgress(currentTime)
  playStore.setDuration(duration)
}

const handleVideoEnded = () => {
  saveVideoProgress()
  const currentIndex = chapterList.value.findIndex(c => c.id === currentChapterId.value)
  if (currentIndex < chapterList.value.length - 1) {
    switchChapter(chapterList.value[currentIndex + 1])
  }
}

const saveVideoProgress = async () => {
  try {
    await saveProgress({
      course_id: courseId.value,
      chapter_id: currentChapterId.value,
      progress: Math.floor(playStore.progress)
    })
  } catch (error) {
    console.error('保存播放进度失败:', error)
  }
}

const switchChapter = async (chapter) => {
  if (chapter.id === currentChapterId.value) return
  
  currentChapterId.value = chapter.id
  currentChapterTitle.value = chapter.title
  playStore.setCurrentChapter(chapter.id)
  
  const chapterData = chapterList.value.find(c => c.id === chapter.id)
  playStore.setTryView(chapterData.is_try)
  playStore.setTryViewDuration(chapterData.try_duration || 180)
  
  await initPlayer()
}

const handlePurchase = () => {
  showTryViewLock.value = false
  router.push(`/course/${courseId.value}`)
}

const loadChapterList = async () => {
  try {
    const res = await getCourseChapters(courseId.value)
    chapterList.value = res.data || []
    
    const currentChapter = chapterList.value.find(c => c.id === chapterId.value)
    if (currentChapter) {
      currentChapterTitle.value = currentChapter.title
      playStore.setTryView(currentChapter.is_try)
      playStore.setTryViewDuration(currentChapter.try_duration || 180)
    }
  } catch (error) {
    console.error('加载章节列表失败:', error)
  }
}

onMounted(async () => {
  currentChapterId.value = chapterId.value
  playStore.setCurrentCourse(courseId.value)
  playStore.setCurrentChapter(chapterId.value)
  
  await loadChapterList()
  await initPlayer()
  
  progressSaveTimer.value = setInterval(saveVideoProgress, 5000)
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
  }
  if (tryViewTimer.value) {
    clearTimeout(tryViewTimer.value)
  }
  if (progressSaveTimer.value) {
    clearInterval(progressSaveTimer.value)
  }
  saveVideoProgress()
})
</script>

<style lang="scss" scoped>
.video-play-page {
  width: 100%;
  min-height: 100vh;
  background-color: #000;
  padding-bottom: 20px;
}

.video-container {
  position: relative;
  width: 100%;
  background-color: #000;
  
  :deep(.video-js) {
    width: 100%;
    height: auto;
  }
}

.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: rgba(255, 255, 255, 0.1);
  pointer-events: none;
  user-select: none;
  font-weight: bold;
  white-space: nowrap;
}

.chapter-list {
  background-color: #fff;
  padding: 16px;
  min-height: calc(100vh - 56.25vw);
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .current-chapter {
    font-size: 12px;
    color: #ff6b6b;
  }
}

.chapter-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  
  &.active {
    background-color: #fff5f5;
    
    .chapter-name {
      color: #ff6b6b;
    }
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.chapter-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.chapter-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-duration {
  font-size: 12px;
  color: #999;
  margin-left: 12px;
}

.try-view-lock {
  padding: 32px 24px;
  text-align: center;
  
  .van-icon {
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
  }
}
</style>
