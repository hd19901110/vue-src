<template>
  <section class="apis-index-container">
    <base-header v-bind="headers"
      v-on:handleCreate="handleHeaderCreate"
      v-on:handleDelete="handleHeaderDelete"
    />
    <base-table
      v-bind="list"
      v-on:handleSelectionChange="handleSelectionChange"
      v-on:handleSizeChange="handleSizeChange"
      v-on:handleCurrentChange="handleCurrentChange"
      v-on:handleDelete="handleTableDelete"
    >
      <template #dictLabel="scope">
        <el-link :underline="false" class="jee-color" @click="rowHref(scope.scope.row)">{{scope.scope.row.dictLabel}}</el-link>
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
    prop: 'dictLabel',
    label: '字典标签',
    scopeType: 'slot'
  },
  {
    prop: 'dictCode',
    label: '字典编号'
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
  name: 'dictDataIndex',
  mixins: [baseHeader, searchHeader, baseTable, formDialog],
  data () {
    return {
      list: {
        columns,
        api: 'fetchDictDataList',
        params: {
          dictTypeId: this.$route.query.id
        },
        handleColumn: [
          {
            type: 'Delete',
            name: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/dictDataManager/delete', 'POST')
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
            disabled: !this._checkPermission('/cmsadmin/dictDataManager/save', 'POST')
          },
          {
            type: 'Delete',
            text: '删除',
            icon: 'delete',
            disabled: !this._checkPermission('/cmsadmin/dictDataManager/delete', 'POST')
          }
        ],
        title: '',
        showAlertIcon: false,
        paddingBottom: '10px'
        // content: '操作说明'
      },
      addFormLoading: false,
      addForm: {
        dictTypeId: this.$route.query.id,
        dictLabel: '',
        dictCode: '',
        dictType: '',
        isSystem: true,
        sortNum: '',
        remark: ''
      },
      editFormLoading: false,
      editForm: {
        id: '',
        dictLabel: '',
        dictCode: '',
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
        dictLabel: [
          this.$rules.required()
        ],
        dictCode: [
          this.$rules.required()
        ],
        sortNum: [
          this.$rules.required()
        ]
      },
      addRules: {
        dictLabel: [
          this.$rules.required()
        ],
        dictCode: [
          this.$rules.required()
        ],
        sortNum: [
          this.$rules.required()
        ]

      },
      addFormItems: [
        {
          prop: 'dictLabel',
          label: '字典标签',
          placeholder: '请输入字典标签',
          maxLength: 50
        },
        {
          prop: 'dictCode',
          label: '字典编号',
          placeholder: '请输入字典编号'
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
    ...mapState('system', ['reflushYftest'])
  },
  methods: {
    ...mapActions('system', ['ReflushYftest']),
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
      this.$request.fetchDictDataCreate(data).then(res => {
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

      this.$request.fetchDictDataDetail({ id: row.id }).then(res => {
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
      this.$request.fetchDictDataUpdate(data).then(res => {
        if (res.code === 200) {
          this._messageSuccess('save')
          this.fetchTableApi()
          this.ReflushYftest(true)
        }
        this.editFormLoading = false
      }).catch(() => {
        this.editFormLoading = false
      })
    },
    // 发送请求事件
    fetchYftestDelete (ids) {
      this.list.loading = true
      this.$request.fetchDictDataDelete(ids).then(res => {
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
    // 获取字典类型名称
    selectDictTypeById () {
      let params = {
        'id': this.addForm.dictTypeId
      }
      this.$request.fetchDictTypeDetail(params).then(res => {
        if (res.code === 200) {
          this.addForm.dictType = res.data.dictType
        }
      }).then(this.hideTableLoading)
        .catch(this.hideTableLoading)
    }

  },
  mounted () {
    this.fetchTableApi()
    this.selectDictTypeById()
  },
  activated () {
    if (this.reflushYftest) {
      this.fetchTableApi()
      this.ReflushYftest(false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
