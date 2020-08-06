<template>
  <section class="service-index">
    <iframe :src="url" width="100%" height="100%">
        <!-- IE：你们都看我干吗，我现在也是支持的 -->
    </iframe>
  </section>
</template>
<script>
export default {
  name: 'serviceIndex',
  data () {
    return {
      name: '服务市场'
    }
  },
  computed: {
    url () {
      let host = window.location.host
      // let host = '192.168.0.200:8700'
      // let src = 'http://order.yun.jeecms.com/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host
      let src = 'http://order.yun.jeecms.com/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=cmsadmin' + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName')
      // let src = 'http://localhost:8081/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=cmsadmin' + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName')
      return src
    }
  }
}
</script>
<style>
.service-index {
  width:100%;
  height:100%;
}
</style>
