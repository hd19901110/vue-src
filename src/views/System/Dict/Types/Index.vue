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
      <template #dictName="scope">
        <el-link :underline="false" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.dictName}}</el-link>
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
    prop: 'dictName',
    label: '字典名称',
    scopeType: 'slot'
  },
  {
    prop: 'dictType',
    label: '字典类型'
  },
  {
    prop: 'isSystem',
    label: '系统内置',
    formatter: (row, column, cellValue, index) => {
      const options = [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
      const opt = options.find(d => d.value === cellValue)
      return opt ? opt.label : ''
    }
  },
  {
    prop: 'sortNum',
    label: '排序'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

export default {
  name: 'dictTypeIndex',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      searchHeader: {
        searchItems: [
          {
            type: 'input',
            value: 'dictName',
            placeholder: '字典名称'
          },
          {
            type: 'searchInput',
            value: 'dictType',
            placeholder: '字典类型'
          },
          {
            type: 'henderBtns',
            text: '重置',
            command: 'ResetBut'
          }
        ]
      },
      list: {
        columns,
        api: 'fetchDictTypeList',
        params: {
          dictName: '',
          dictType: ''
        },
        handleColumn: [
          {
            type: 'Link',
            name: '数据列表',
            notDisabled: true,
            icon: 'paixu1',
            href: '/system/dict/datas/index'
          },
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/dictTypeManager/delete', 'POST')
          }
        ],
        handleColumnProp: {
          width: '180px'
        }
      },
      headers: {
        buttons: [
          {
            type: 'Create',
            text: '新建',
            icon: 'xinjian',
            disabled: !this._checkPermission('/cmsadmin/dictTypeManager/save', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/dictTypeManager/delete', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        dictName: '',
        dictType: '',
        isSystem: true,
        sortNum: '',
        remark: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        dictName: '',
        dictType: '',
        isSystem: true,
        sortNum: '',
        remark: ''
      },
      editButton: [
        {
          text: 'global.save',
          type: 'Submit'
        }
      ],
      editRules: {
        dictName: [
          this.$rules.required()
        ],
        dictType: [
          this.$rules.required()
        ],
        sortNum: [
          this.$rules.required()
        ]
      },
      addRules: {
        dictName: [
          this.$rules.required()
        ],
        dictType: [
          this.$rules.required()
        ],
        sortNum: [
          this.$rules.required()
        ]

      },
      addFormItems: [
        {
          prop: 'dictName',
          label: '字典名称',
          placeholder: '请输入字典名称',
          maxLength: 50
        },
        {
          prop: 'dictType',
          label: '字典类型',
          placeholder: '请输入字典类型'
        },
        {
          type: 'select',
          prop: 'isSystem',
          label: '系统内置',
          placeholder: '请选择',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        {
          prop: 'sortNum',
          label: '排序',
          placeholder: '请输入排序值',
          maxLength: 75
        },
        {
          prop: 'remark',
          label: '备注',
          placeholder: '请输入备注',
          maxLength: 75
        }
      ]
    }
  },
  computed: {
    ...mapState('system', ['reflushDictType'])
  },
  methods: {
    ...mapActions('system', ['ReflushDictType']),
    // 表格操作按钮
    handleTableDelete (row, index) {
      this._confirmDelete().then(() => {
        this.fetchYftestDelete([row.id])
      })
    },
    // 顶部操作按钮
    handleHeaderCreate () {
      this.$refs.addDialog.showDialog()
    },
    handleHeaderDelete () {
      if (this.list.selectedKeys.length) {
        this._confirmDelete().then(() => {
          this.fetchYftestDelete(this.list.selectedKeys)
        })
      } else {
        this._messageOne()
      }
    },
    // 添加页面的action
    handleConfirmAdd (data, btn) {
      this.addFormLoading = true
      this.$request.fetchDictTypeCreate(data).then(res => {
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

      this.$request.fetchDictTypeDetail({ id: row.id }).then(res => {
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
      this.$request.fetchDictTypeUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushDictType(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchYftestDelete (ids) {
      this.list.loading = true
      this.$request.fetchDictTypeDelete(ids).then(res => {
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
        this.list.params.dictName = ''
        this.list.params.dictType = ''
        this.fetchTableApi()
      }
    }

  },
  mounted () {
    this.fetchTableApi()
  },
  activated () {
    if (this.reflushDictType) {
      this.fetchTableApi()
      this.ReflushDictType(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
