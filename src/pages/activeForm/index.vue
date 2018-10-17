<template>

<div class="active-form-page">
  <el-row class="active-form-page-head"></el-row>
  <el-row class="active-form-page-body" >
    <div class=" fullhight active-form-page-body-anka-main">
        <div class="active-form-page-body-anka-main-head">{{currentAnka?currentAnka.header.name:'案卡详情'}}</div>
        <div class="active-form-page-body-anka-main-body">
            <div class="fullhight active-form-page-body-anka-main-body-formlist">
                <ankaformList :anka="currentAnka" :currenTable="currenShowTable" @ankaTableClick="ankaTableClick"
                    @dragItem="ankaFormListDragItem"
                    @dropedOnTitle="ankaFormListDropedOnTitle"
                    @dropedOnItem="ankaFormListDropedOnItem"
                              @editName="editName"
                ></ankaformList>
            </div>
            <div class=" fullhight active-form-page-body-anka-main-body-form">
                <formDesigner ref="formdesigner" :data="currentAnka"  :currenTab="currenShowTab" :currentTable="currenShowTable"
                              @currentTableChange="currentTableChange"
                              @addError="addError"
                              @removeError="removeError"
                              @clearErrors="clearErrors"
               ></formDesigner>
            </div>
            <div class="fullhight active-form-page-body-anka-main-body-errors">
                <div v-for="(error,index) in errorsList" :key="index">
                    <div @click="errorClick(error)">{{error.item.label}}</div>
                </div>
            </div>
        </div>
<!--      <el-col class="fullhight" :span="4" ><dragmenu></dragmenu></el-col>
      <el-col class="fullhight"  :span="20" > <formDesigner></formDesigner></el-col>-->
    </div>


  </el-row>
</div>

</template>
<script>
import ankaStaticData from "@/pages/activeForm/ankaStaticData";
export default {
  name: "activeForm",
  data() {
    return {
      currentAnka: ankaStaticData,
      tableList: [],
      formListDragData: null,
      currenShowTable: null,
      currenShowTab: null,
      errorsList: []
    };
  },
  methods: {
    ankaTableClick({ table, tab }) {
      tab.currentTableName = table.text;
      this.currenShowTab = tab;
      this.currenShowTable = table;
      this.$refs.formdesigner.setCurrentTable(table, tab);
    },
    currentTableChange({ table, tab }) {
      this.currenShowTab = tab;
      this.currenShowTable = table;
    },
    ankaFormListDragItem(data) {
      this.formListDragData = data;
    },
    getOrignItem() {
      let dragdata = this.formListDragData;
      return dragdata.tab.child.containers.splice(
        dragdata.tab.child.containers.indexOf(dragdata.item),
        1
      )[0];
    },
    ankaFormListDropedOnTitle({ tab }) {
      tab.child.containers.push(this.getOrignItem());
      this.initTableScroll();
    },
    ankaFormListDropedOnItem({ tab, itemIndex }) {
      tab.child.containers.splice(itemIndex, 0, this.getOrignItem());
      this.initTableScroll();
    },
    initTableScroll() {
      this.$refs.formdesigner.translateAnka();
      setTimeout(() => {
        this.$refs.formdesigner.animateToTab(this.currenShowTab);
      }, 400);
    },
    editName(data) {
      let oldname =
        data.type === "tab" ? data.tab.child.title : data.table.text;
      let title = data.type === "tab" ? "修改tab名" : "修改表名";
      this.$prompt("", { title: title, inputValue: oldname }).then(
        res => {
          if (res.action === "confirm") {
            if (data.type === "tab") {
              data.tab.child.title = res.value;
            } else {
              data.table.text = res.value;
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    addError(data) {
      this.errorsList.push(data);
    },
    removeError(data) {
      let tempIndex = -1;
      this.errorsList.forEach((er, index) => {
        if (er.item.elId === data.item.elId) {
          tempIndex = index;
        }
      });
      if (tempIndex !== -1) {
        this.errorsList.splice(tempIndex, 1);
      }
    },
    clearErrors() {
      this.errorsList = [];
    },
    errorClick(data) {
      this.$refs.formdesigner.animateToError(data);
    }
  },
  mounted() {
    this.currenShowTable = this.currentAnka.children[0].child.containers[0];
    this.$api.activeForm
      .demoData({
        params: {
          akmbbh: "100000231",
          bmsah: "山东省院民（行）违监[2014]37000000003号"
        }
      })
      .then(
        res => {
          this.currentAnka = res.data;
          // console.log(JSON.stringify(this.currentAnka));
          this.currenShowTable = this.currentAnka.children[0].child.containers[0];
        },
        err => {
          console.log(err);
        }
      );
  },
  components: {
    ankaList: () => import("./ankalist"),
    ankaformList: () => import("./anka-form-list.vue"),
    dragmenu: () => import("./dragMenu.vue"),
    formDesigner: () => import("./formDesigner.vue")
  }
};
</script>

<style lang="less">
.active-form-page {
  height: 100%;
  .active-form-page-head {
    height: 60px;
    background-color: #c9e1f7;
  }
  .active-form-page-body {
    height: calc(100% - 60px);
    padding: 10px;
    .active-form-page-body-ankalist {
      float: left;
      width: 150px;
      overflow: auto;
    }
    .active-form-page-body-anka-main {
      float: left;
      width: 100%;
      /*border: 1px solid #abc1de;*/
      .active-form-page-body-anka-main-head {
        width: 100%;
        height: 34px;
        font-size: 14px;
        line-height: 34px;
        padding-left: 15px;
        background-color: #d1e4f6;
        border: 1px solid #abc1de;
      }
      .active-form-page-body-anka-main-body {
        height: calc(100% - 34px);
        width: 100%;
        border: 1px solid #abc1de;
        .active-form-page-body-anka-main-body-formlist {
          float: left;
          width: 200px;
          border-right: 1px solid #abc1de;
        }
        .active-form-page-body-anka-main-body-form {
          float: left;
          padding: 10px 0 10px 10px;
          width: calc(100% - 500px);
        }
        .active-form-page-body-anka-main-body-errors {
          float: left;
          width: 300px;
          padding: 10px 0;
        }
      }
    }
  }
  .fullhight {
    height: 100%;
  }
}
.fl {
  float: left;
}
.fr {
  float: right;
}
</style>
