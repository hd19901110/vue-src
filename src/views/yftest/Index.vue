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
    ></search-header>
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    >
      <template #name="scope">
        <el-link :underline="false" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.name}}</el-link>
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

const columns = [
  {
    prop: 'name',
    label: '姓名',
    scopeType: 'slot'
  },
  {
    prop: 'sex',
    label: '性别',
    formatter: (row, column, cellValue, index) => {
       const options = [
              {
               label: '男',
                value: '1'
              },
              {
                  label: '女',
                  value: '2'
              },
              {
                  label: '人妖',
                  value: '3'
              },
              {
                  label: '鬼',
                  value: '4'
              },
              {
                  label: '魔',
                  value: '5'
              }
          ]
          const opt = options.find(d => d.value === cellValue)
          return opt ? opt.label : ''
      }
  },
  {
    prop: 'age',
    label: '年龄'
  },
    {
        prop: 'height',
        label: '身高'
    },
    {
        prop: 'weight',
        label: '体重'
    }

]

export default {
  name: 'yftestIndex',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'name',
            placeholder: '姓名'
          },
          {
            type: 'input',
            value: 'sex',
            placeholder: '性别'
          },
            {
                type: 'searchInput',
                value: 'age',
                placeholder: '年龄'
            }
        ]
      },
      list: {
        columns,
        api: 'fetchYftestList',
        params: {
          name: '',
          sex: '',
          age: ''
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/apis', 'DELETE')
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
            disabled: !this._checkPermission('/cmsadmin/apis', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/apis', 'DELETE')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        name: '',
        sex: '',
        age: '',
        height: '',
        weight: ''
      },
      editFormLoading: false,
      editForm: {
          id: '',
          name: '',
          sex: '',
          age: '',
          height: '',
          weight: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        requestMethod: [
          this.$rules.required()
        ],
        name: [
          this.$rules.required()
        ],
        apiUrl: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  url: value,
                  id: this.editForm.id,
                  requestMethod: this.editForm.requestMethod
                }
                this.$request.fetchApisUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('API地址不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      addRules: {
        requestMethod: [
          this.$rules.required()
        ],
        ssname: [
          this.$rules.required()
        ],
        apiUrl: [
          this.$rules.required(),
          {
            validator: (rule, value, callback) => {
              if (value) {
                var params = {
                  url: value,
                  requestMethod: this.addForm.requestMethod
                }
                this.$request.fetchApisUnique(params).then(res => {
                  if (res.code === 200 && res.data) {
                    callback()
                  } else {
                    callback(new Error('API地址不能重复'))
                  }
                })
              }
            },
            trigger: 'blur'
          }
        ],
          age: [
              this.$rules.required(),
              this.$rules.number(),
              this.$rules.rangeNum(1, 200)
          ]

      },
      addFormItems: [
        {
          prop: 'name',
          label: '姓名',
          placeholder: '请输入姓名',
          maxLength: 50
        },
        {
          type: 'select',
          prop: 'sex',
          label: '性别',
          placeholder: '请选择',
            options: [
                {
                    label: '男',
                    value: 1
                },
                {
                    label: '女',
                    value: 2
                },
                {
                    label: '人妖',
                    value: 3
                },
                {
                    label: '鬼',
                    value: 4
                },
                {
                    label: '魔',
                    value: 5
                }
            ]
        },
        {
          prop: 'age',
          label: '年龄',
          placeholder: '请输入年龄',
        },
        {
          prop: 'height',
          label: '身高',
          placeholder: '请输入身高',
          maxLength: 75
        },
          {
              prop: 'weight',
              label: '体重',
              placeholder: '请输入体重',
              maxLength: 75
          }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushApi'])
  },
  methods: {
    ...mapActions('system', ['ReflushApi']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchApisDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchApisDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
      // 添加页面的action
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.$request.fetchYfTestCreate(data).then(res => {
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

      this.$request.fetchYfTestDetail({ id: row.id }).then(res => {
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
      this.$request.fetchApisUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushApi(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchApisDelete (ids) {
      this.list.loading = true
      this.$request.fetchApisDelete(ids).then(res => {
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
    }
  },
  mounted () {
    this.fetchTableApi()
  },
  activated () {
    if (this.reflushApi) {
      this.fetchTableApi()
      this.ReflushApi(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
