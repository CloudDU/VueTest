<template>
  <div>
    <div class="exam_structure">

      <div v-for="warnning in warnnings" style="margin-bottom: 10px;">
        <el-alert
          :title="warnning"
          type="info"
          show-icon
        />
      </div>

      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>

      <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <el-tooltip v-show="expandStatus" content="展开全部" placement="bottom" effect="light">
            <el-button type="success" icon="el-icon-caret-bottom" circle size="small" @click="toggleExpand" />
          </el-tooltip>

          <el-tooltip v-show="!expandStatus" content="收起全部" placement="bottom" effect="light">
            <el-button type="success" icon="el-icon-caret-right" circle size="small" @click="toggleExpand" />
          </el-tooltip>

          <el-tooltip content="导出店内分类" placement="bottom" effect="light">
            <el-button type="success" icon="el-icon-download" circle size="small" />
          </el-tooltip>
          <el-tooltip content="新增一级分类" placement="bottom" effect="dark" @click="add_new_question">
            <el-button type="warning" icon="el-icon-circle-plus-outline" circle size="small" />
          </el-tooltip>
          <el-tooltip content="删除店内所有分类" placement="bottom" effect="dark">
            <el-button type="danger" icon="el-icon-delete" circle size="small" />
          </el-tooltip>
        </el-row>
      </div>
      </el-card>
<!--      <el-button type="primary" size="small" class="add_new_question" @click="add_new_question"><i></i>添加父节点</el-button>-->
    </div>

    <div class="question_info_lists">

      <el-tree ref="tree" :key="tree_key" :data="treeData" node-key="id" :render-content="renderContent"
               :expand-on-click-node="false" :default-expanded-keys="defaultExpand" show-checkbox
               :filter-node-method="filterNode" @node-drag-start="handleDragStart"
               @node-drag-enter="handleDragEnter"
               @node-drag-leave="handleDragLeave"
               @node-drag-over="handleDragOver"
               @node-drag-end="handleDragEnd"
               @node-drop="handleDrop"
               draggable :allow-drop="allowDrop"
               :allow-drag="allowDrag"
               default-expand-all
      ></el-tree>

      <el-row class="add_question" v-show="add_question_flag">

        <el-col :span="12">

          <el-input v-model="new_question_name" placeholder="请输入大题名称"></el-input>

        </el-col>

        <el-col :span="12">

          <el-button size="mini" class="btn_sure" @click.stop="add_question_sure">确定</el-button>

          <el-button size="mini" class="btn_cancel" @click.stop="add_question_cancel">取消</el-button>

        </el-col>

      </el-row>

    </div>

  </div>
</template>

<script>
export default {
  name: 'tree1',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    toggleExpand () {
      this.expandStatus = !this.expandStatus
    },
    // 添加新大题
    add_new_question () {
      this.add_question_flag = true
    },

    add_question_sure () { // 确定
      const nodeObj = {id: '', label: this.new_question_name, isEdit: false, children: []}
      this.treeData.push(nodeObj)
      this.add_question_flag = false
    },

    add_question_cancel () { // 取消
      this.add_question_flag = false

      this.new_question_name = ''
    },

    //      增加
    append (store, node, data) {
      var maxid = '20'
      // 新增数据
      const nodeapp = {id: ++maxid, label: '增加节点', isEdit: false, children: []}
      data.children.push(nodeapp)
      if (!node.expanded) {
        node.expanded = true
      }
      const parent = node.parent
      const children = parent.data
      const cIndex = children.findIndex(d => d.id === data.id)
      const tempChildrenNodex2 = children[cIndex] // 拿到被添加的上一级
      console.log(tempChildrenNodex2.children[cIndex - 1])
    },

    // 修改
    nodeEdit (ev, store, data) {
      data.isEdit = true

      this.$nextTick(() => {
        const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')

        !$input ? '' : $input.focus()
      })
    },

    edit_sure (ev, data) {
      const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')

      if (!$input) {
        return false
      } else {
        data.label = $input.value

        data.isEdit = false
      }
    },

    // 节点删除

    nodeDelete (node, data) {
      const parent = node.parent

      const children = parent.data.children || parent.data

      const index = children.findIndex(d => d.id === data.id)

      children.splice(index, 1)
    },

    // 节点上移

    nodeUp (node, data) {
      const parent = node.parent

      const children = parent.data.children || parent.data

      const cIndex = children.findIndex(d => d.id === data.id)

      if (parent.level === 0 && cIndex === 0) {
        return
      } else if (parent.level !== 0 && cIndex === 0) { // 不同父节点中移动
        alert('不同父节点中移动')

        // const parent2 = parent.parent

        // const children2 = parent2.data.children || parent2.data

        // const pIndex2 = parseInt(children2.findIndex(p => p.id === parent.data.id), 10) - 1

        // if (pIndex2 < 0) return

        // children2[pIndex2].children.push(data)

        // children.splice(cIndex, 1)

        // this.defaultExpand[0] = children2[pIndex2].id
      } else if ((parent.level === 0 && cIndex !== 0) || (parent.level !== 0 && cIndex !== 0)) {
        const tempChildrenNodex1 = children[cIndex - 1]

        const tempChildrenNodex2 = children[cIndex]

        this.$set(children, cIndex - 1, tempChildrenNodex2)

        this.$set(children, cIndex, tempChildrenNodex1)

        this.defaultExpand[0] = data.id
      }

      this.tree_key++
    },

    // 节点下移

    nodeDown (store, node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const cIndex = children.findIndex(d => d.id === data.id)
      const cLength = children.length - 1 // 最边上的节点
      const allLevel = store.data.length - 1 // 树的深度

      if (parent.level === allLevel && cIndex === cLength) { // 最最末的节点
        return
      } else if (parent.level !== allLevel && cIndex === cLength) { // 父节点不同
        alert('不能移动')
        // const parent2 = parent.parent

        // const children2 = parent2.data.children || parent2.data

        // const pIndex2 = parseInt((children2.findIndex(p => p.id === parent.data.id)), 10)

        // if (pIndex2 === allLevel) return

        // children2[pIndex2 + 1].children.push(data)

        // children.splice(cIndex, 1)

        // this.defaultExpand[0] = children2[pIndex2 + 1].id
      } else if ((parent.level === allLevel && cIndex !== cLength) || (parent.level !== allLevel && cIndex !== cLength)) { // 父节点相同
        const tempChildrenNodex1 = children[cIndex + 1]

        const tempChildrenNodex2 = children[cIndex]

        this.$set(children, cIndex + 1, tempChildrenNodex2)

        this.$set(children, cIndex, tempChildrenNodex1)

        this.defaultExpand[0] = data.id
      }

      this.tree_key++
    },

    showOrEdit (data) {
      if (data.isEdit) {
        return <input type="text" value={data.label} on-blur={ev => this.edit_sure(ev, data)}/>
      } else {
        return <span className="node_labe">{data.label}</span>
      }
    },
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    // 结构树操作group node,

    renderContent (h, {node, data, store}) {
      return (

        <span>

          <span class="el-icon-document">

            {this.showOrEdit(data)}

          </span>

          <div class="tree_node_op" style="  float: right">

            <i class="el-icon-edit" on-click={(ev) => this.nodeEdit(ev, store, data)}></i>

            <i class="el-icon-delete" on-click={() => this.nodeDelete(node, data)}></i>

            <i class="el-icon-upload2" on-click={() => this.nodeUp(node, data)}></i>

            <i class="el-icon-download" on-click={() => this.nodeDown(store, node, data)}></i>
            <i class="el-icon-plus" on-click={() => this.append(store, node, data)}></i>

          </div>

        </span>)
    }

  },
  data () {
    return {
      filterText: '',
      warnnings: [
        '你可以建立二级分类，若店内一级分类有子分类时，将无法删除，您做的更改2小时后可更新到当当网相关页。',
        '设置首页默认功能：值打开店铺首页时，默认显示该分类的商品列表。'
      ],
      expandStatus: true,
      treeData: [{

        id: 1,

        label: '一级 1',

        isEdit: false,

        children: [{

          id: 4,

          label: '二级 1-1',

          isEdit: false,

          children: [{id: 9, label: '三级 1-1-1', isEdit: false, children: []}, {
            id: 10,
            label: '三级 1-1-2',
            isEdit: false,
            children: []
          }, {
            id: 11,
            label: '三级 1-1-3',
            isEdit: false,
            children: []
          }]

        },

        {

          id: 12,

          label: '二级 1-2',

          isEdit: false,

          children: []

        },

        {

          id: 13,

          label: '二级 1-3',

          isEdit: false,

          children: []

        }]

      },

      {

        id: 2,

        label: '一级 2',

        isEdit: false,

        children: [{id: 5, label: '二级 2-1', isEdit: false, children: []}, {
          id: 6,
          label: '二级 2-2',
          isEdit: false,
          children: []
        }]

      },

      {

        id: 3,

        label: '一级 3',

        isEdit: false,

        children: [
          {id: 7, label: '二级 3-1', isEdit: false, children: []},
          {
            id: 8,
            label: '二级 3-2',
            isEdit: false,
            children: []
          }]

      }],

      add_question_flag: false,

      new_question_name: '',

      tree_key: 0,

      defaultExpand: []

    }
  }

}
</script>

<style scoped>

</style>
