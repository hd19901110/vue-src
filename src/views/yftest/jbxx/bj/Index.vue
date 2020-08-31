<template>
  <section class="apis-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <search-header
      class="search-header"
      v-bind="searchHeader"
      :params="list.params"
      @handleSearch="handleSearch"
      @handleBtn="handleBtn"
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    >
      <template #nd="scope">
        <el-link :underline="false" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.nd}}</el-link>
      </template>
    </base-table>
    <form-dialog
      ref="addDialog"
      :loading="addFormLoading"
      :form="addForm"
      :rules="addRules"
      :formItems="addFormItems"
      v-on:handleConfirm="handleConfirmAdd"
    ></form-dialog>
    <form-dialog
      ref="editDialog"
      title='编辑'
      :loading="editFormLoading"
      :form="editForm"
      :rules="editRules"
      :formItems="addFormItems"
      :buttons="editButton"
      v-on:handleConfirm="handleConfirmEdit"
    >
    </form-dialog>
  </section>
</template>

<script>
import baseHeader from '@/components/mixins/baseHeader'
import searchHeader from '@/components/mixins/searchHeader'
import baseTable from '@/components/mixins/baseTable'
import formDialog from '@/components/mixins/formDialog'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'yfbj',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'nd',
            placeholder: '年度'
          },
          {
            type: 'select',
            value: 'xd',
            placeholder: '学段',
            options: this.$enums.xd

          },
          {
            type: 'searchInput',
            value: 'bjmc',
            placeholder: '班级名称'
          },
          {
            type: 'henderBtns',
            text: '重置',
            command: 'ResetBut'
          }
        ]
      },
      list: {
        columns: [
          {
            label: '年度',
            prop: 'nd',
            scopeType: 'slot'
          },
          {
            label: '学段',
            prop: 'xd',
            formatter: (row, column, cellValue, index) => {
              const options = this.$enums.xd
              const opt = options.find(d => d.value === cellValue)
              return opt ? opt.label : ''
            }
          },
          {
            label: '班级名称',
            prop: 'bjmc'
          }
        ],
        api: 'fetchYfBjList',
        params: {
          xn: '',
          xq: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/yf/bj', 'DELETE')
          }
        ],
        handleColumnProp: {
          width: '75px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/cmsadmin/yf/bj', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/yf/bj', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        nd: '',
        bjmc: '',
        xd: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        nd: '',
        bjmc: '',
        xd: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        nd: [
          this.$rules.required()
        ],
        bjmc: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (this.editForm.nd != '' && this.editForm.bjmc != '') { //eslint-disable-line
                var params = {
                  nd: this.editForm.nd,
                  xd: this.editForm.xd,
                  bjmc: this.editForm.bjmc,
                  id: this.editForm.id
                }
                this.$request.fetchYfBjUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('班级在学年学段下已存在'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addRules: {
        nd: [
          this.$rules.required()
        ],
        bjmc: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (this.addForm.nd != '' && this.addForm.bjmc != '') { //eslint-disable-line
                var params = {
                  nd: this.addForm.nd,
                  xd: this.addForm.xd,
                  bjmc: this.addForm.bjmc
                }
                this.$request.fetchYfBjUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('班级在学年学段下已存在'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]

      },
      addFormItems: [
        {
          prop: 'nd',
          label: '年度',
          placeholder: '请输入年度',
          maxLength: 50
        },
        {
          type: 'select',
          prop: 'xd',
          label: '学段',
          placeholder: '请选择学段',
          options: this.$enums.xd
        },
        {
          prop: 'bjmc',
          label: '班级名称',
          placeholder: '请输入班级名称',
          maxLength: 50
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushYfBj'])
  },
  methods: {
    ...mapActions('system', ['ReflushYfBj']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchYfBjDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchYfBjDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    // 添加页面的action
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.$request.fetchYfBjCreate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
        }
        this.addFormLoading = false
      }).catch(() => {
        this.addFormLoading = false
      })
    },
    // 表格详情
    rowHref (row) {
      this.editFormLoading = true

      this.$request.fetchYfBjDetail({ id: row.id }).then(res => {
        if (res.code === 200) {
          this.editForm = res.data
          this.$refs.editDialog.showDialog()
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 编辑保存
    handleConfirmEdit (data) {
      this.editFormLoading = true
      this.$request.fetchYfBjUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushYfBj(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchYfBjDelete (ids) {
      this.list.loading = true
      this.$request.fetchYfBjDelete(ids).then(res => {
        if (res.code === 200) {
          this._messageSuccess('delete')
          this.fetchTableApi()
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    },
    fetchTableCallBack (res) {
      if (res.code === 200) {
        this.list.data = res.data.content
        this.list.totalCount = res.data.totalElements
      }
    },
    // 搜索重置
    handleBtn (item) {
      if (item.command === 'ResetBut') {
        this.list.params.nd = ''
        this.list.params.xd = ''
        this.list.params.bjmc = ''
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.fetchTableApi()
  },
  activated () {
    if (this.reflushYfBj) {
      this.fetchTableApi()
      this.ReflushYfBj(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
