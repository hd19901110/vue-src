<script>
import moment from 'moment'
import Detail from './Detail'
import { deepClone } from '@/utils'
export default {
  extends: Detail,
  name: 'contentCreate',
  provide () {
    return {
      changeColumn: ''
      // changeCurrentTab: ''
    }
  },
  data () {
    return {
      excludeList: ['imageUpload', 'singleImage', 'audioUpload', 'videoUpload', 'fileUpload'],
      bttons: [
        {
          name: '1',
          label: '存为初稿',
          icon: 'baocun',
          disabled: !this._checkPermission('/cmsadmin/contentext', 'PUT')
        },
        {
          name: '2',
          label: '发布',
          icon: 'fabu',
          disabled: !this._checkPermission('/cmsadmin/contentext', 'PUT')
        },
        {
          name: '3',
          label: '存为草稿',
          icon: 'cunweicaogao',
          disabled: !this._checkPermission('/cmsadmin/contentext', 'PUT')
        },
        {
          name: '12',
          label: '提交审核',
          icon: 'shenhe',
          disabled: !this._checkPermission('/cmsadmin/contentext', 'PUT')
        }
      ],
      handleHeaders: [],
      channelDefault: {}
    }
  },
  methods: {
    moment,
    handleSubmit (e, btn) {
      console.log(btn)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$request.fetchContentCreate(this.getFormData).then(res => {
            if (res.code === 200) {
              if (res.data === 10) {
                let _this = this
                this.examineObj = {
                  title: '',
                  icon: '',
                  text: '智能审核中，请稍后...',
                  visible: true,
                  showClose: false
                }
                setTimeout(function () {
                  _this.examineObj.visible = false
                  _this.removeTab(_this.$route.fullPath)
                  _this.$routerLink('/content/index', 'audit')
                }, 2000)
              } else {
                this._messageSuccess('create')
                this.removeTab(this.$route.fullPath)
                this.$routerLink('/content/index', 'list')
              }
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // detailResetData (list) {
    //   let data = deepClone(list)
    //   let excludeList = ['content', ...this.excludeList]
    //   // 去除多余数组
    //   let RowList = data.map((d) => {
    //     // 判断是否有多数组
    //     if (d.length > 1) {
    //       let list = [d[0], d[1]]
    //       return list
    //     } else if (excludeList.indexOf(d[0][0].type) !== -1) {
    //       let obj = {
    //         type: d[0][0].type,
    //         index: d[0][0].index,
    //         name: d[0][0].name,
    //         list: d[0]
    //       }
    //       return obj
    //     } else {
    //       return d[0][0]
    //     }
    //   })
    //   return RowList
    // },
    setHeaderBths (status) {
      // let arr = []
      // if (status) {
      //   // 工作流
      //   arr = ['12', '1', '3']
      // } else {
      //   // 非工作流
      //   arr = ['1', '2', '3']
      // }
      // if (this.contentTree.data[0].children[0] && !this.contentTree.data[0].children[0].publishContentAble) {
      //   this.bttons.find(d => d.name === '2').disabled = true
      // } else {
      //   this.bttons.find(d => d.name === '2').disabled = false
      // }
      // this.headers = arr.map(v => {
      //   return this.bttons.find(d => d.name === v)
      // })
      // this.filterDisBtn(this.headers, -1)
    },
    setChannelDefault (channelId) {
      if ('viewControl' in this.form || 'allowComment' in this.form) {
        if (channelId) {
          this.$request.fetchChannelDefaults(channelId).then(res => {
            if (res.code === 200) {
              this.channelDefault = res.data
              if ('viewControl' in this.form) {
                this.form.viewControl = res.data.viewControl === 1 ? 1 : 2
              }
              if ('allowComment' in this.form) {
                this.form.allowComment = res.data.allowComment
              }
            }
          })
        } else {
          this.form.viewControl = this.channelDefault.viewControl === 1 ? 1 : 2
          this.form.allowComment = this.channelDefault.allowComment
        }
      }
    },
    // 获取新增字段
    fetchContentDetailAdd  () {
      var _this = this
      _this.loading = true
      _this.$request.fetchContentPlus(_this.contentId).then(res => {
        if (res.code === 200) {
          _this.detail = {
            renderingField: res.data.enableJson
          }
          let dataField = {
            modelId: _this.contentId,
            modelName: _this.$route.query.modelName || '',
            channelId: _this.channelId
          }
          const { formListBase, formListExtend } = res.data.enableJson || {}
          if (formListBase instanceof Array && formListBase.length) {
            // _this.detail.formListBase = _this.detailResetData(formListBase)
            _this.$set(_this.detail, 'formListBase', _this.detailResetData(formListBase))
          } else {
            _this.detail.formListBase = []
          }
          if (formListExtend instanceof Array && formListExtend.length) {
            // _this.detail.formListExtend = _this.detailResetData(formListExtend)
            _this.$set(_this.detail, 'formListExtend', _this.detailResetData(formListExtend))
          } else {
            _this.detail.formListExtend = []
          }
          _this.restListData(dataField)
          _this.resetKey()
          _this.setForm()
          this.setDefaultContentTab()
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    detailResetData (list) {
      let data = deepClone(list)
      let excludeList = ['content', ...this.excludeList]
      // 去除多余数组
      // 返回空数据[[]]时会报异常
      let RowList = data.filter(d => d[0].length > 0).map((d) => {
        // 判断是否有多数组
        if (d.length > 1) {
          let list = []
          d.forEach(item => {
            // 判断是否有多个数据并且是需要合并的
            if (item.length > 1 && excludeList.indexOf(item[0].type) !== -1) {
              let obj = {
                type: item[0].type,
                index: item[0].index,
                name: item[0].name,
                list: item,
                canDelete: item[0].canDelete,
                value: {
                  name: item[0].value.name
                }
              }
              list.push([obj])
            } else {
              list.push([item[0]])
            }
          })
          return list
        } else if (excludeList.indexOf(d[0][0].type) !== -1) {
          let obj = {
            type: d[0][0].type,
            index: d[0][0].index,
            name: d[0][0].name,
            list: d[0],
            value: {
              name: d[0][0].value.name
            }
          }
          return obj
        } else {
          return d[0][0]
        }
      })
      // console.log('数据过滤')
      return RowList
    }
  },
  watch: {
    'form.channelId': function (newData) {
      this.setChannelDefault(newData)
    },
    sourceObj (val) {
      this.detail.dataField.contentSourceId = val
      this.setForm()
    }
  }
}
</script>
