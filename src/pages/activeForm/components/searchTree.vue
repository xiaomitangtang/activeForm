<template>
    <div class='swx-search-tree'>
        <el-input v-if="!multiple" size="mini" :value="inputText" @input="selfInput"
                  :readOnly="readonly"
                  class="swx-input swx-input-mini" @click.native.stop="searchTreeInputClick" :clearable="true" @clear="clear" v-bind="inputBind"></el-input>
        <div v-else class="tags-box" @click.stop="searchTreeInputClick" @click="$refs.searchInput.focus()">
            <span class="el-tag el-tag--info el-tag--small"
                  v-for="(item,index) in valArr" :key="'tag'+index"
                  @click.stop="deleteTag(item)"
            >{{item.label}}<i class="el-tag__close el-icon-close"></i></span>
            <input ref="searchInput" class="search-input" type="text" v-model="filterText" :style="searchInputStyle">
        </div>
        <transition name="searchTreeFade">
            <div class="swx-search-tree-treebox"  v-if="showtree" @click.stop>
                <el-tree
                        ref="searchtree"
                        class="swx-tree-arrow-style-two  swx-checkbox"
                        :data="tempTreeData"
                        :expand-on-click-node="true"
                        @node-click="nodeClick"
                        :filter-node-method="filterNode"
                        :render-content="renderContent"
                        v-bind="treeBind"
                        :option="treeOptions"
                >
                </el-tree>
                <!--<div class="resizeBar"  @mousedown.stop="openResize" @mouseup.stop="closeResize"></div>-->
            </div>
        </transition>
    </div>
</template>
<script>
// import Popper from "element-ui/src/utils/vue-popper";
export default {
  name: "swx-search-tree",
  // mixins: [Popper],
  props: {
    value: {
      type: [String, Array, Number],
      default: ""
    },
    treeData: { type: Array, default: () => [{ label: "111" }] },
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
      type: Object
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
      showtree: false,
      inputText: "",
      filterText: "",
      valArr: [],
      tempTreeData: [
        { label: "111", children: [{ label: "1-1-1" }, { label: "1-1-2" }] }
      ]
    };
  },
  methods: {
    /*  openResize(e) {
      console.log("openResize", e);
    },
    closeResize(e) {
      console.log("closeResize", e);
    },*/
    searchTreeInputClick() {
      this.showtree = true;
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
        if (this.closeOnClickTree) {
          this.showtree = false;
        }
      } else {
        let temArr = [...this.valArr];
        if (this.valArr.filter(i => i.label === node.label).length > 0) return;
        temArr.push(node);
        this.valArr = temArr;
      }
    },
    deleteTag(item) {
      this.valArr = this.valArr.filter(i => i.label !== item.label);
    },
    renderContent(h, { node }) {
      let temClass = "swx-icon-span swx-icon-span-" + node.level;
      return (
        <span>
          <span class={temClass} />
          {node.data.label}
        </span>
      );
    }
  },
  watch: {
    filterText(val) {
      this.$refs.searchtree.filter(val);
    },
    value(n) {
      this.$emit("input", n);
    },
    valArr(n) {
      this.$emit("input", n);
    }
  },

  mounted() {
    this.resetFunc = () => {
      this.showtree = false;
    };
    this.inputText = this.value;
    document.addEventListener("click", this.resetFunc);
  },
  computed: {
    searchInputStyle() {
      return { width: this.filterText.length * 8 + 12 + "px" };
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.resetFunc);
  }
};
</script>
<style lang="less" scoped>
.swx-search-tree {
  position: relative;
  .swx-search-tree-treebox {
    position: absolute;
    width: 100%;
    min-height: 150px;
    max-height: 250px;
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
