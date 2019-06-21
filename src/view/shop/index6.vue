<template>
  <div class="app-container">
    <el-form ref="form" :model="form" >
      <div v-for="(warnning, index) of warnnings" :key="index" style="margin-bottom: 10px;">
        <el-alert :title="warnning" type="info" show-icon/>
      </div>

      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row>
              <el-tooltip v-show="expandStatus" content="展开全部" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-caret-bottom" circle size="small" @click="toggleExpand" style="margin-left:10px;" />
              </el-tooltip>

              <el-tooltip v-show="!expandStatus" content="收起全部" placement="bottom" effect="light">
                <el-button type="success" icon="el-icon-caret-right" circle size="small" @click="toggleExpand" />
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
          <div>
            <el-form-item>
              <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                :default-expand-all=expandAll
                :default-expanded-keys="defaultExpandKey"
                :expand-on-click-node="false"
                :render-content="renderContent"
                @node-drag-start="handleDragStart"
                @node-drag-enter="handleDragEnter"
                @node-drag-leave="handleDragLeave"
                @node-drag-over="handleDragOver"
                @node-drag-end="handleDragEnd"
                @node-drop="handleDrop"
                draggable
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                :check-strictly="true"
                :highlight-current="true"
                ref="tree"
                @check-change="checkChange"
                @node-click="nodeClick"
                :default-checked-keys="[editCheckId]"
              />
            </el-form-item>
          </div>
        </el-card>
      </el-row>

      <el-form-item style="margin-top: 20px">
        <el-button type="success" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let id = 1000
const result = {'showIndex': 1,
  'cates': [
    {
      id: 1,
      cateId: '1111',
      categoryName: '一级11112',
      isEdit: false,
      priority: 0,
      pid: '',
      children: [
        {
          id: 4,
          cateId: '11111',
          categoryName: '二级11111',
          isEdit: false,
          priority: 0,
          pid: '1',
          children: []
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
      children: [
        {
          id: 5,
          cateId: '222221',
          categoryName: '二级2222-1',
          isEdit: false,
          priority: 0,
          expandChild: '',
          pid: '2'
        },
        {
          id: 6,
          cateId: '222222',
          categoryName: '二级22222-2',
          isEdit: false,
          expandChild: '',
          priority: 1,
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
      children: [
        {
          id: 7,
          cateId: '33331',
          categoryName: '二级33333-1',
          isEdit: false,
          priority: 0,
          expandChild: '',
          pid: '3'
        },
        {
          id: 8,
          cateId: '33332',
          categoryName: '二级33333-2',
          isEdit: false,
          expandChild: '',
          priority: 1,
          pid: '3'
        },
        {
          id: 9,
          cateId: '33333',
          categoryName: '二级 3-3',
          isEdit: false,
          expandChild: '',
          priority: 2,
          pid: '3'
        }
      ]
    }
  ]}
const data = result.cates
const showIndex = result.showIndex
export default {
  data () {
    return {
      warnnings: [
        '你可以建立二级分类，若店内一级分类有子分类时，将无法删除，您做的更改2小时后可更新到当当网相关页。',
        '设置首页默认功能：值打开店铺首页时，默认显示该分类的商品列表。'
      ],
      form: {},
      expandStatus: true,
      expandAll: false,
      editCheckId: showIndex,
      defaultExpandKey: [3],
      data: JSON.parse(JSON.stringify(data))
    }
  },
  methods: {
    toggleExpand () {
      this.expandStatus = !this.expandStatus
      this.$nextTick(() => {
        this.expandAll = !this.expandAll
        for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
          this.$refs.tree.store._getAllNodes()[i].expanded = this.expandAll
        }
      })
    },
    append (data, e) {
      console.log(data, '-----------------..>', e)
      console.log(data, '-----------------..>', this.$refs.tree)
      if (!data.pid || data.pid == 0) {
        this.$nextTick(() => {
          this.$refs.tree.defaultExpandedKeys.push(data.id)
        })
        const newChild = {
          id: '',
          priority: data.priority++,
          categoryName: '请修改二级分类名称',
          pid: data.id,
          isEdit: false,
          children: []
        }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      }
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
    },

    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log(
        'tree drag enter: ',
        dropNode.categoryName,
        '----->node:',
        draggingNode
      )
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log(
        'tree drag leave: ',
        dropNode.categoryName,
        '----->node:',
        draggingNode
      )
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log(
        'tree drag over: ',
        dropNode.categoryName,
        '----->node:',
        draggingNode
      )
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drag end: ',
        dropNode && dropNode.categoryName,
        dropType,
        '----->node:',
        draggingNode
      )
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log(
        'tree drop: ',
        dropNode.categoryName,
        dropType,
        '----->node:',
        draggingNode
      )
    },
    allowDrop (draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          return type === 'prev'
        }
      } else {
        // 不同级进行处理
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.categoryName.indexOf('三级 3-2-2') === -1
    },
    nodeEdit (ev, store, data) {
      data.isEdit = true

      // this.$nextTick(() => {
      //   console.log(ev,"))", data,"___________________121",store)
      //   const $input =
      //     ev.target.parentNode.parentNode.querySelector("input") ||
      //     ev.target.parentElement.parentElement.querySelector("input");
      //   console.log($input, "___________________121")
      //   !$input ? "" : $input.focus();
      // });
    },
    edit_sure (ev, data) {
      // const $input = ev.target.parentNode.parentNode.querySelector('input') || ev.target.parentElement.parentElement.querySelector('input')
      const $input = ev.target
      if (!$input) {
        return false
      } else {
        data.categoryName = $input.value
        data.isEdit = false
      }
    },
    inputChange (ev, data) {
      console.log('input...', ev, '---------+++', this.$refs)
      if (ev.length > 30) {
        return false
      }
    },
    showOrEdit (data) {
      if (data.isEdit) {
        // return <input type="text" value={data.categoryName} on-blur={ev => this.edit_sure(ev, data)}/>
        return <el-tooltip class="item" effect="dark" content="只能输入不超过30个字的内容" disabled placement="top"><el-input type="text" size='mini' v-model={data.categoryName} maxlength={30} autofocus show-word-limit='true' on-input={ev => this.inputChange(ev, data)} on-blur={ev => this.edit_sure(ev, data)}></el-input></el-tooltip>
      } else {
        return <span title="分类名称">{data.categoryName}</span>
      }
      // this.$nextTick(() => {
      //   console.log(ev,"))", data,"___________________121",store)
      //   const $input =
      //     ev.target.parentNode.parentNode.querySelector("input") ||
      //     ev.target.parentElement.parentElement.querySelector("input");
      //   console.log($input, "___________________121")
      //   !$input ? "" : $input.focus();
      // });
    },
    renderContent (h, { node, data, store }) {
      console.log(h, '_--h', node, '---node', data, '_---data', store)
      return (
        <span class='custom-tree-node'>
          <span style="margin-right:10px;" title="分类id">{data.cateId}</span>
          {this.showOrEdit(data)}
          <span style="float:right; margin-left:30px; padding:0 10px 0 10px;">
            {node.level == 2 ? '' : <el-button size='mini' type='text' on-click={ (ev) => this.append(data, ev) }>增加子分类</el-button>}
            <el-button size='mini' type='text' on-click={ (ev) => this.nodeEdit(ev, store, data) }>修改</el-button>
            {node.level == 2 ? '' : <el-checkbox size='mini' type='text' border>是否展开子分类</el-checkbox>}
            <el-button size='mini' type='text' on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    },

    checkChange (item, node, self) {
      if (node == true) { // 点击未选中复选框
        this.editCheckId = item.id
        this.$refs.tree.setCheckedKeys([item.id])
      } else {
        if (this.editCheckId == item.id) { // 点击已选中的复选框，保证至少一个选中
          this.$refs.tree.setCheckedKeys([item.id])
        }
      }
    },
    nodeClick (item, node, self) {
      // 选择节点时buchu
      // this.editCheckId = item.id
      // this.$refs.tree.setCheckedKeys([item.id])
    },
    onSubmit () {
      console.log('提交...', this.$refs.tree.data)
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    color: red;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
