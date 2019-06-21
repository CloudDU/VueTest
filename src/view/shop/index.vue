<template>
  <div style="width:800px">

    <el-table :data="tableData"
              row-key="id"
              align="left">
      <el-table-column v-for="(item, index) in col"
                       :key="`col_${index}`"
                       :prop="dropCol[index].prop"
                       :label="item.label">
      </el-table-column>
    </el-table>
    <pre style="text-align: left">
      {{dropCol}}
    </pre>
    <hr>
    <pre style="text-align: left">
      {{tableData}}
    </pre>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

export default {
  data () {
    return {
      col: [
        {
          label: '分类',
          prop: 'category'
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
        },
        {
          label: '删除',
          prop: 'delete'
        }
      ],
      dropCol: [
        {
          label: '分类',
          prop: 'category'
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
        },
        {
          label: '删除',
          prop: 'delete'
        }
      ],
      tableData: [
        {
          id: '1111',
          category: '一级分类1',
          showIndex: '111',
          addSonCategory: '01',
          expandChild: '11',
          delete: 'X'
        },
        {
          id: '1112',
          category: '一级分类2',
          showIndex: '1112',
          addSonCategory: '02',
          expandChild: '12',
          delete: 'X2'
        },
        {
          id: '1113',
          category: '一级分类3',
          showIndex: '1113',
          addSonCategory: '03',
          expandChild: '13',
          delete: 'X3'
        }
      ]
    }
  },
  mounted () {
    this.rowDrop()
    this.columnDrop()
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
    // 列拖拽
    columnDrop () {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
