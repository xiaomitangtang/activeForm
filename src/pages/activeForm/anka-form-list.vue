<template>
    <div class='anka-form'  >
        <div class="anka-form-part" v-for="(tab,index) in anka?anka.children:[]" :key="'form'+index">
            <div class="form-list-title"
                 @drop="dropedOnTitle(tab,index)"
                 @dragover.prevent.stop
                 @dblclick="titleDbClick(tab)"
            >{{tab.child.title}}</div>
            <ul class="form-list-ul" >
                <li class="form-list-item" :class="{'anka-form-active':currenTable===form}"
                    @click="formClick(form,tab)" v-for="(form,index2) in tab.child.containers"
                    :key="'form'+index+index2"
                    draggable="true"
                    @dblclick="itemDbClick(form)"
                    @dragstart="dragStart(tab,form,index,index2)"
                    @drop="dropedOnItem(tab,form,index,index2)" @dragover.prevent.stop
                >{{form.text}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  props: {
    anka: { type: Object },
    currenTable: { type: Object }
  },
  methods: {
    formClick(table, tab) {
      this.$emit("ankaTableClick", { table, tab });
    },
    dragStart(tab, item, index, index2) {
      //
      this.$emit("dragItem_", {
        tab,
        item,
        tabIndex: index,
        itemIndex: index2
      });
    }, //这三个方法均为展示阶段是用不到的方法，所以注释，去掉_既可以使用
    dropedOnTitle(tab, index) {
      this.$emit("dropedOnTitle_", { tab, tabIndex: index });
    }, //这三个方法均为展示阶段是用不到的方法，所以注释，去掉_既可以使用
    dropedOnItem(tab, item, index, index2) {
      this.$emit("dropedOnItem_", {
        tab,
        item,
        tabIndex: index,
        itemIndex: index2
      });
    }, //这三个方法均为展示阶段是用不到的方法，所以注释，去掉_既可以使用
    titleDbClick(tab) {
      //去掉后面的_就可以修改名字，展示阶段不需要此功能所以去掉
      this.$emit("editName_", { type: "tab", tab: tab });
    },
    itemDbClick(form) {
      //去掉后面的_就可以修改名字，展示阶段不需要此功能所以去掉
      this.$emit("editName_", { type: "table", table: form });
    }
  }
  // mounted() {
  //   console.log("anka");
  //   console.log(this.anka);
  //   console.log("currenTable");
  //   console.log(this.currenTable);
  // }
};
</script>
<style lang="less">
.anka-form {
  padding: 20px 0;
  height: 100%;
  overflow: auto;
  background-color: #e3efff;
  .anka-form-part {
    .form-list-title {
      padding-left: 12px;
      font-size: 15px;
      font-weight: 600;
      color: #3c659a;
    }
    .form-list-ul {
      /*margin: 0;*/
      padding: 0;
      list-style: none;
      .form-list-item {
        position: relative;
        border-bottom: 1px dashed #aac3e2;
        line-height: 20px;
        list-style: none;
        font-size: 13px;
        color: #2589df;
        padding: 12px 10px 12px 44px;
        cursor: pointer;
        &::before {
          position: absolute;
          left: 20px;
          /*margin-right: 10px;*/
          font-family: "iconfont";
          content: "\e6a3";
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: #62779d;
        }
        &:first-child {
          border-top: 1px dashed #aac3e2;
        }
      }
      .anka-form-active {
        background-color: #6b94c8;
        color: #ffffff;
        &::before {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
