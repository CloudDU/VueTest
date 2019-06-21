<template>
  <div>
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
      <el-table :data="tableData"
                style="width: 100%; margin-bottom: 20px;"
                row-key="id"
                default-expand-all
                :tree-props="{children:'childs', hasChildren:'hasChildren'}"
      >
        <el-table-column v-for="(item, index) in col"
                         :key="`col_${index}`"
                         :prop="dropCol[index].prop"
                         :label="item.label"
        >
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <!--          <el-input-->
            <!--            v-model="search"-->
            <!--            size="mini"-->
            <!--            placeholder="输入关键字搜索"/>-->
            <span>操作</span>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">Edit
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

const colHeader = [
  {
    label: '分类',
    prop: 'categoryName'
  },
  {
    label: '是否在首页展示商品',
    prop: 'showIndex'
  },
  {
    label: '添加子分类',
    prop: 'addSonCategory'
  },
  {
    label: '展开子分类',
    prop: 'expandChild'
  }
]
const dropCol = [
  {
    label: '分类',
    prop: 'categoryName'
  },
  {
    label: '是否在首页展示商品',
    prop: 'showIndex'
  },
  {
    label: '添加子分类',
    prop: 'addSonCategory'
  },
  {
    label: '展开子分类',
    prop: 'expandChild'
  }
]

const tableData = [
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
    showIndex: '1112',
    addSonCategory: '02',
    expandChild: '12',
    childs: [
      {
        id: '111101',
        categoryName: '2级分类111'
        // showIndex: '111',
        // addSonCategory: '01',
        // expandChild: '11',
      },
      {
        id: '111102',
        categoryName: '2级分类222'
        // showIndex: '111',
        // addSonCategory: '01',
        // expandChild: '11',
      }
    ]
  },
  {
    id: '1113',
    categoryName: '一级分类3',
    showIndex: '1113',
    addSonCategory: '03',
    expandChild: '13'
  }
]
export default {
  data () {
    return {
      col: colHeader,
      dropCol: dropCol,
      tableData: tableData
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
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
      // remove(row)
    }

  }
}
</script>
<style scoped>
</style>
