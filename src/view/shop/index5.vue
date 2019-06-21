<template>
  <div>
    <el-form ref="form" :model="form">
      <div v-for="(warnning, index) of warnnings" :key="index" style="margin-bottom: 10px;">
        <el-alert :title="warnning" type="info" show-icon/>
      </div>

      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-tooltip v-show="expandStatus" content="展开全部" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-caret-bottom" circle size="small" @click="toggleExpand"
                           style="margin-left:10px;"/>
              </el-tooltip>

              <el-tooltip v-show="!expandStatus" content="收起全部" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-caret-right" circle size="small" @click="toggleExpand"/>
              </el-tooltip>

              <el-tooltip content="导出店内分类" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-download" circle size="small" @click="exportCate"/>
              </el-tooltip>
              <el-tooltip content="新增一级分类" placement="bottom" effect="dark">
                <el-button type="warning" icon="el-icon-circle-plus-outline" circle size="small" @click="addFirstCate"/>
              </el-tooltip>
              <el-tooltip content="删除店内所有分类" placement="bottom" effect="dark">
                <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteAll"/>
              </el-tooltip>
            </el-row>
          </div>

          <el-table
            :data="tableData"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'childs', hasChildren: 'hasChildren'}">
            <el-table-column
              prop="categoryName"
              label="分类"
              width="180">
            </el-table-column>
            <el-table-column
              prop="showIndex"
              label="是否在首页展示商品"
              width="180">
              <template scope="scope">
                <el-radio class="radio" v-model="radio" :label="scope.row.cateId">&nbsp;{{scope.row.showIndex}}
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              prop="expandChild"
              label="是否展开子分类">
              <template scope="scope" >
                <el-checkbox  :v-model="scope.row.expandChild >0" label="1"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">添加子分类</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>
    </el-form>

  </div>
</template>
<script>
import Sortable from 'sortablejs'
const result = {'showIndex': 1,
  'cates': [
    {
      id: 1,
      cateId: '1111',
      categoryName: '一级11112',
      isEdit: false,
      priority: 0,
      pid: '',
      childs: [
        {
          id: 4,
          cateId: '11111',
          categoryName: '二级11111',
          isEdit: false,
          priority: 0,
          pid: '1',
          childs: []
        }
      ]
    },
    {
      id: 2,
      cateId: '2222',
      categoryName: '一级2222',
      isEdit: false,
      priority: 0,
      expandChild: 0,
      pid: '',
      childs: [
        {
          id: 5,
          cateId: '222221',
          categoryName: '二级2222-1',
          isEdit: false,
          priority: 0,
          expandChild: '',
          childs: [],
          pid: '2'
        },
        {
          id: 6,
          cateId: '222222',
          categoryName: '二级22222-2',
          isEdit: false,
          expandChild: '',
          priority: 1,
          childs: [],
          pid: '2'
        }
      ]
    },
    {
      id: 3,
      cateId: '3333',
      categoryName: '一级3333',
      isEdit: false,
      priority: 0,
      expandChild: 1,
      pid: '',
      childs: [
        {
          id: 7,
          cateId: '33331',
          categoryName: '二级33333-1',
          isEdit: false,
          priority: 0,
          expandChild: '',
          childs: [],
          pid: '3'
        },
        {
          id: 8,
          cateId: '33332',
          categoryName: '二级33333-2',
          isEdit: false,
          expandChild: '',
          priority: 1,
          childs: [],
          pid: '3'
        },
        {
          id: 9,
          cateId: '33333',
          categoryName: '二级 3-3',
          isEdit: false,
          expandChild: '',
          priority: 2,
          childs: [],
          pid: '3'
        }
      ]
    }
  ]}
const data = result.cates
const showIndex = result.showIndex
const tableData1 = [
  {
    id: '1111',
    categoryName: '一级分类1',
    showIndex: '111',
    addSonCategory: '01',
    expandChild: '11'
  },
  {
    id: '1112',
    categoryName: '一级分类2',
    showIndex: '',
    addSonCategory: '02',
    expandChild: '12',
    childs: [
      {
        id: '111101',
        categoryName: '2级分类111'
        // showIndex: '',
        // addSonCategory: '01',
        // expandChild: '11',
      },
      {
        id: '111102',
        categoryName: '2级分类222'
        // showIndex: '',
        // addSonCategory: '01',
        // expandChild: '11',
      }
    ]
  },
  {
    id: '1113',
    categoryName: '一级分类3',
    showIndex: '',
    addSonCategory: '03',
    expandChild: '13'
  }
]
export default {
  data () {
    return {
      tableData: data,
      warnnings: [
        '你可以建立二级分类，若店内一级分类有子分类时，将无法删除，您做的更改2小时后可更新到当当网相关页。',
        '设置首页默认功能：值打开店铺首页时，默认显示该分类的商品列表。'
      ]
    }
  },
  mounted () {
    this.rowDrop()
  },
  methods: {
    // 行拖拽
    rowDrop () {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        onEnd ({newIndex, oldIndex}) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0]
          _this.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    toggleExpand () {
      this.expandStatus = !this.expandStatus
      this.$nextTick(() => {
        this.expandAll = !this.expandAll
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.expandAll
        }
      })
    },
    remove (node, data) {
      if (data.children && data.children.length > 0) {
        alert('该分类有子分类不能删除！')
      } else {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      }
    },

    addFirstCate () {
      console.log('>>>>>')
      var len = this.$refs.tree.data.length
      const newFirstCate = {
        id: '',
        priority: len,
        categoryName: '请修改一级分类名称',
        pid: '',
        isEdit: false,
        children: []
      }
      console.log(this.$refs.tree.data)
      this.$refs.tree.data.push(newFirstCate)
      console.log(this.$refs.tree.data)
    },

    exportCate () {
      console.log('导出全部分类')
    },

    deleteAll () {
      console.log('删除全部分类')
    }
  }
}
</script>
