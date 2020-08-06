<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'

export default {
  name: 'APP',
  methods: {
    ...mapActions('app', ['changeTheme', 'changeLang'])
  },
  created () {
    const theme = window.localStorage.getItem('theme') || 'custom-grayBlue'
    this.changeTheme(theme)
    const lang = window.localStorage.getItem('lang') || 'cn'
    this.changeLang(lang)
    this.$i18n.locale = lang
    window.localStorage.setItem('base', process.env.VUE_APP_API_HOST)
  }
}
</script>

<style lang="scss">
.app-container{
  height: 100vh!important;
  -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
