<template>
    <div class='swx-search-tree' @click="searchTreeClick" ref="treeBox">
        <el-input v-if="!multiple" size="mini" :value="inputText" @input="selfInput"
                  :readOnly="readonly"
                  class="swx-input swx-input-mini" @click.native="searchTreeInputClick" :clearable="true" @clear="clear" v-bind="inputBind"></el-input>
        <div v-else class="tags-box" @click="searchTreeInputClick">
            <span class="el-tag el-tag--info el-tag--small"
                  v-for="(item,index) in valArr" :key="'tag'+index"
            >{{item.label}}<i class="el-tag__close el-icon-close" @click.stop="deleteTag(item)"></i></span>
            <input ref="searchInput" class="search-input" type="text" v-model="filterText" :style="searchInputStyle">
        </div>
        <transition name="searchTreeFade">
            <div class="swx-search-tree-treebox" :style="treeboxStyle"  v-show="showtree" @click.stop>
                <el-tree
                        :show-checkbox="multiple"
                        ref="searchtree"
                        class="swx-tree-arrow-style-two  swx-checkbox"
                        :data="treeData"
                        node-key="id"
                        :check-on-click-node="false"
                        :expand-on-click-node="true"
                        @node-click="nodeClick"
                        :filter-node-method="filterNode"
                        :render-content="renderContent"
                        @check-change="checkedNodeChange"
                        v-bind="treeBind"
                        :option="treeOptions"
                >
                </el-tree>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
  name: "swx-search-tree",
  props: {
    value: {
      type: [String, Array, Number, Object],
      default: ""
    },
    treeData: { type: Array, default: () => [] },
    treeOptions: {
      type: Object,
      default: () => ({
        label: "label",
        children: "children",
        disabled: "disabled",
        isLeaf: "isLeaf"
      })
    },
    treeBind: {
      type: Object,
      default: () => ({})
    },
    inputBind: { type: Object },
    closeOnClickTree: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    filterNode: {
      type: Function,
      default: function(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      focus: false,
      showtree: false,
      inputText: "",
      filterText: "",
      valArr: [],
      treeboxStyle: {},
      tempTreeData: [
        { label: "111", children: [{ label: "1-1-1" }, { label: "1-1-2" }] }
      ]
    };
  },
  methods: {
    searchTreeInputClick(e) {
      if (this.multiple) {
        this.$refs.searchInput.focus();
      }
      if (!this.showtree) {
        this.setTreeSelect();
      }
      let x = e.clientX - e.layerX;
      let y = e.clientY - e.layerY;
      this.treeboxStyle = {
        width: this.$refs.treeBox.offsetWidth + "px",
        left: x + "px",
        top: y + 30 + "px"
      };
      this.showtree = true;
    },
    searchTreeClick() {
      this.focus = true;
    },
    clear() {
      this.inputText = "";
      this.filterText = "";
    },
    selfInput(val) {
      this.inputText = val;
      this.filterText = val;
    },
    nodeClick(data, node, com) {
      if (!this.multiple) {
        this.inputText = node.label;
        this.filterText = "";
        this.$emit("treeNodeClick", data, node, com);
        this.$emit("input", data.id);
        if (this.closeOnClickTree && !this.multiple) {
          this.showtree = false;
        }
      }
    },
    deleteTag(item) {
      this.$refs.searchtree.setChecked(item.id, false);
      this.checkedNodeChange();
    },
    renderContent(h, { node }) {
      let temClass = "swx-icon-span swx-icon-span-" + node.level;
      return (
        <span>
          <span class={temClass} />
          {node.data.label}
        </span>
      );
    },
    resetFunc() {
      if (!this.focus) {
        this.showtree = false;
      }
      this.focus = false;
    },
    checkedNodeChange() {
      let checkedNodes = this.$refs.searchtree.getCheckedNodes();
      this.valArr = checkedNodes;
    },
    setTreeSelect() {
      clearTimeout(this.setTreeCheckedTimer);
      if (this.value.length === 0) return;
      this.setTreeCheckedTimer = setInterval(() => {
        if (!this.$refs.searchtree || !this.treeData.length) return;
        if (this.multiple) {
          this.$refs.searchtree.setCheckedKeys(this.value);
          // this.checkedNodeChange();
        } else {
          this.$refs.searchtree.setCurrentKey(this.value, true);
          let currentNode = this.$refs.searchtree.getCurrentNode();
          if (currentNode) {
            this.inputText = currentNode.label;
            this.$emit("input", currentNode.key);
          }
        }
        clearTimeout(this.setTreeCheckedTimer);
      }, 60);
    }
  },
  watch: {
    filterText(val) {
      this.$refs.searchtree.filter(val);
    },
    valArr(n) {
      this.$emit("input", n.map(i => i.id));
    },
    treeData() {
      this.setTreeSelect();
    }
  },

  mounted() {
    this.inputText = this.value;
    // this.setTreeSelect();
    document.addEventListener("click", this.resetFunc);
    document
      .getElementById("tablebox")
      .addEventListener("scroll", this.resetFunc);
  },
  computed: {
    searchInputStyle() {
      return { width: this.filterText.length * 8 + 12 + "px" };
    }
  },
  beforeDestroy() {
    clearTimeout(this.setTreeCheckedTimer);
    document.removeEventListener("click", this.resetFunc);
    document
      .getElementById("tablebox")
      .removeEventListener("scroll", this.resetFunc);
  }
};
</script>
<style lang="less" scoped>
.swx-search-tree {
  position: relative;
  .swx-search-tree-treebox {
    position: fixed;
    width: 100%;
    min-height: 150px;
    max-height: 150px;
    margin-top: 10px;
    z-index: 10;
    padding: 10px;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    overflow: auto;
  }
  .resizeBar {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 20px;
    height: 20px;
    background-color: rgba(204, 182, 70, 0.8);
    cursor: nwse-resize;
  }
}
.searchTreeFade-enter-active,
.searchTreeFade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.searchTreeFade-enter,
.searchTreeFade-leave-active {
  opacity: 0;
  transform: translateY(-15px);
}
.search-input {
  border: 0;
  margin-left: 3px;
  outline: none;
  max-width: 100%;
}
.tags-box {
  border: 1px solid #cccccc;
  border-radius: 4px;
}
.el-tag {
  margin: 2px;
}
</style>
