<template>
  <section class="service-index">
    <iframe :src="url" width="100%" height="100%">
        <!-- IE：你们都看我干吗，我现在也是支持的 -->
    </iframe>
  </section>
</template>

<script>
export default {
  name: 'sms',
  // mixins: [baseHeader, baseForm],
  data () {
    return {
      name: '服务市场'
    }
  },
  computed: {
    url () {
      let host = window.location.host
      // let host = '192.168.0.150:8501'
      // let host = '192.168.0.200:8700'
      // let src = 'http://order.yun.jeecms.com/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host+ '&siteId=' + localStorage.getItem('siteId')
      let src = 'http://order.yun.jeecms.com/#/service/apply/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=cmsadmin' + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName') + '&type=' + '短信服务' + '&ShowHide=' + true
      // let src = 'http://order2.yun.jeecms.com/#/service/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=cmsadmin'+ '&siteId=' + localStorage.getItem('siteId')
      // let src = 'http://192.168.0.151:8081/#/service/apply/index?token=' + localStorage.getItem('JEECMS-Auth-Token') + '&url=' + host + '&prefix=cmsadmin' + '&siteId=' + localStorage.getItem('siteId') + '&siteName=' + localStorage.getItem('siteName') + '&type=' + '短信服务' + '&ShowHide=' + true +'&auth=' + true
      return src
    }
  },
  methods: {
  },
  created () {
  },
  watch: {
  }
}
</script>

<style>
.service-index {
  width:100%;
  height:100%;
}
</style>
<style lang="scss" scoped>
// .system-setting-container{
//   font-size: 16px;
//   header{
//     padding-bottom: 20px;
//     span{
//       padding-right: 10px;
//     }
//   }
//   .el-alert{
//     margin-bottom: 20px;
//   }
// }

</style>
