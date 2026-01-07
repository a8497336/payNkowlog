import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayStore = defineStore('play', () => {
  const currentCourseId = ref(null)
  const currentChapterId = ref(null)
  const videoUrl = ref('')
  const progress = ref(0)
  const duration = ref(0)
  const isPlaying = ref(false)
  const playbackRate = ref(1)
  const isFullscreen = ref(false)
  const isTryView = ref(false)
  const tryViewDuration = ref(180)

  const setCurrentCourse = (courseId) => {
    currentCourseId.value = courseId
  }

  const setCurrentChapter = (chapterId) => {
    currentChapterId.value = chapterId
  }

  const setVideoUrl = (url) => {
    videoUrl.value = url
  }

  const setProgress = (progressValue) => {
    progress.value = progressValue
  }

  const setDuration = (durationValue) => {
    duration.value = durationValue
  }

  const setPlaying = (playing) => {
    isPlaying.value = playing
  }

  const setPlaybackRate = (rate) => {
    playbackRate.value = rate
  }

  const setFullscreen = (fullscreen) => {
    isFullscreen.value = fullscreen
  }

  const setTryView = (isTry) => {
    isTryView.value = isTry
  }

  const setTryViewDuration = (duration) => {
    tryViewDuration.value = duration
  }

  const resetPlayState = () => {
    currentCourseId.value = null
    currentChapterId.value = null
    videoUrl.value = ''
    progress.value = 0
    duration.value = 0
    isPlaying.value = false
    playbackRate.value = 1
    isFullscreen.value = false
    isTryView.value = false
  }

  return {
    currentCourseId,
    currentChapterId,
    videoUrl,
    progress,
    duration,
    isPlaying,
    playbackRate,
    isFullscreen,
    isTryView,
    tryViewDuration,
    setCurrentCourse,
    setCurrentChapter,
    setVideoUrl,
    setProgress,
    setDuration,
    setPlaying,
    setPlaybackRate,
    setFullscreen,
    setTryView,
    setTryViewDuration,
    resetPlayState
  }
})
