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
      <template #xn="scope">
        <el-link :underline="false" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.xn}}</el-link>
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
  name: 'yfXnXq',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'xn',
            placeholder: '学年'
          },
          {
            type: 'select',
            value: 'xq',
            placeholder: '学期',
            options: this.$enums.xnxq

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
            label: '学年',
            prop: 'xn',
            scopeType: 'slot'
          },
          {
            label: '学期',
            prop: 'xq',
            formatter: (row, column, cellValue, index) => {
              const options = this.$enums.xnxq
              const opt = options.find(d => d.value === cellValue)
              return opt ? opt.label : ''
            }
          }
        ],
        api: 'fetchYfXnxqList',
        params: {
          xn: '',
          xq: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/yf/xnxq', 'DELETE')
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
            disabled: !this._checkPermission('/cmsadmin/yf/xnxq', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/yf/xnxq', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        xn: '',
        xq: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        xn: '',
        xq: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        xn: [
          this.$rules.required(),
          this.$rules.numhnum()
        ],
        xq: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (this.editForm.xn != '' && this.editForm.xq != '') { //eslint-disable-line
                var params = {
                  xn: this.editForm.xn,
                  xq: this.editForm.xq,
                  id: this.editForm.id
                }
                this.$request.fetchYfXnxqUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('学年学期已存在'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addRules: {
        xn: [
          this.$rules.required(),
          this.$rules.numhnum()
        ],
        xq: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (this.addForm.xn != '' && this.addForm.xq != '') { //eslint-disable-line
                var params = {
                  xn: this.addForm.xn,
                  xq: this.addForm.xq
                }
                this.$request.fetchYfXnxqUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('学年学期已存在'))
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
          prop: 'xn',
          label: '学年',
          placeholder: '请输入学年2020-2021',
          maxLength: 50
        },
        {
          type: 'select',
          prop: 'xq',
          label: '学期',
          placeholder: '请选择学期',
          options: this.$enums.xnxq
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushYfXnxq'])
  },
  methods: {
    ...mapActions('system', ['ReflushYfXnxq']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchYfXnxqDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchYfXnxqDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    // 添加页面的action
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.$request.fetchYfXnxqCreate(data).then(res => {
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

      this.$request.fetchYfXnxqDetail({ id: row.id }).then(res => {
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
      this.$request.fetchYfXnxqUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushYfxnxq(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchYfXnxqDelete (ids) {
      this.list.loading = true
      this.$request.fetchYfXnxqDelete(ids).then(res => {
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
        this.list.params.xn = ''
        this.list.params.xq = ''
        this.fetchTableApi()
      }
    }
  },
  mounted () {
    this.fetchTableApi()
  },
  activated () {
    if (this.reflushYfXnxq) {
      this.fetchTableApi()
      this.ReflushYfXnxq(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
