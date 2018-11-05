<template>

<div class="active-form-page">
    <loading v-if="loading"></loading>
    <!--<el-row class="active-form-page-head" style="border: 1px solid #000;"></el-row>-->
  <el-row  class="active-form-page-body" >
    <div class=" fullhight active-form-page-body-anka-main">
        <div class="active-form-page-body-anka-main-head">{{currentAnka?currentAnka.header.name:'案卡详情'}}
            <el-select style="float: right;" v-model="currentAnkaParam" :value-key="'akmbbh'">
                <el-option v-for="(param,index) in ankaParamsList" :key="'ankaParam'+ index"  :value="param" :label="param.bmsah"></el-option>
            </el-select>
        </div>
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
                <errorsList :errors="errorsList" @errorClick="errorClick"></errorsList>
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
import ankaParamsList from "./ankaParamsListData";
import ruleData from "./rulesParser/data.json";
window.ruleData = ruleData;
export default {
  name: "activeForm",
  data() {
    return {
      // currentAnka: null,
      ankaParamsList: ankaParamsList,
      currentAnkaParam: ankaParamsList[1],
      currentAnka: ankaStaticData,
      tableList: [],
      formListDragData: null,
      currenShowTable: null,
      currenShowTab: null,
      errorsList: [],
      loading: false
    };
  },
  methods: {
    ankaTableClick({ table, tab }) {
      this.currenShowTab = tab;
      this.currenShowTable = table;
      this.$refs.formdesigner.setCurrentTable(table, tab);
    }, //左侧table列表的table项点击事件，用于设置当前显示的tab和table
    currentTableChange({ table, tab }) {
      this.currenShowTab = tab;
      this.currenShowTable = table;
    }, //formDesigner中显示当前的table和tab滚动都按一定程度触发的事件，用于同步当前显示的tab和table
    ankaFormListDragItem(data) {
      this.formListDragData = data;
    }, //左侧table或者tab拖拽start事件，用于记录拖拽的信息
    getOrignItem() {
      let dragdata = this.formListDragData;
      return dragdata.tab.child.containers.splice(
        dragdata.tab.child.containers.indexOf(dragdata.item),
        1
      )[0];
    }, //提供的一个方法，用于获取拖拽的原始item，此方法会将目标item从原数组中取出，如不改变请自己放回去
    ankaFormListDropedOnTitle({ tab }) {
      tab.child.containers.push(this.getOrignItem());
      this.initTableScroll();
    }, //左侧拖拽item放于tab上时触发的事件，
    ankaFormListDropedOnItem({ tab, itemIndex }) {
      tab.child.containers.splice(itemIndex, 0, this.getOrignItem());
      this.initTableScroll();
    }, //左侧拖拽item放于table上时触发的事件，
    initTableScroll() {
      this.$refs.formdesigner.translateAnka();
      setTimeout(() => {
        this.$refs.formdesigner.animateToTab(this.currenShowTab);
      }, 400);
    }, //当数据发生改变时，将服务端数据转化，并移动视图
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
    }, //编辑左侧tab或者table的名字
    addError(data) {
      let errorsList = [...this.errorsList];
      if (!errorsList.indexOf(data) + 1) {
        errorsList.push(data);
      }
      this.errorsList = errorsList;
    }, //当验证不通过时，将错误信息记录于一个数组中
    removeError(data) {
      this.errorsList = this.errorsList.filter(er => {
        return er.item.elId !== data.item.elId;
      });
    }, //当验证通过时，移出errorslist当中的对应数据
    clearErrors() {
      this.errorsList = [];
    }, //清空移出errorslist当中的对应数据
    errorClick(data) {
      this.$refs.formdesigner.animateToError(data);
    }, //当用于点击错误条目时，页面滚动至对应的tab
    async getAnKaByParams(params) {
      try {
        let formData = await this.$api.activeForm.formData({
          params
        });
        let formValid = await this.$api.activeForm.formValid({ params });
        window.ruleData = formValid.data; //将获取到的验证规则挂载到window上，方便其他地方获取
        this.loading = false;
        let tempCurrentAnka = formData.data.child;
        tempCurrentAnka.children.forEach((item, i) => {
          item.pageData = formData.data.pageData[i];
        }); //对李小虎的接口数据进行处理，整合布局数据以及翻页纯数据
        this.currentAnka = tempCurrentAnka;
        this.currenShowTable = this.currentAnka.children[0].child.containers[0];
      } catch (e) {
        console.log("请求数据出现了问题");
        console.log(e);
      }
    } //获取服务端的数据，以及验证规则，并转换后台数据
  },
  watch: {
    currentAnkaParam(n) {
      this.getAnKaByParams(n);
    } //监控当前的案卡参数，及时根据当前的参数获取当前的案卡信息
  },
  mounted() {
    this.currenShowTable = this.currentAnka.children[0].child.containers[0];
    this.getAnKaByParams(this.currentAnkaParam);
  },
  components: {
    ankaList: () => import("./ankalist"),
    ankaformList: () => import("./anka-form-list.vue"),
    dragmenu: () => import("./dragMenu.vue"),
    formDesigner: () => import("./formDesigner.vue"),
    loading: () => import("./components/loading.vue"),
    errorsList: () => import("./error-list.vue")
  }
};
</script>

<style lang="less">
.active-form-page {
  height: 100%;
  /*.active-form-page-head {*/
  /*height: 60px;*/
  /*background-color: #c9e1f7;*/
  /*}*/
  .active-form-page-body {
    height: 100%;
    /*padding: 10px;*/
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
        height: 36px;
        font-size: 14px;
        line-height: 36px;
        padding-left: 15px;
        background-color: #5580b7;
        border: 1px solid #adc0e0;
        color: #ffffff;
      }
      .active-form-page-body-anka-main-body {
        height: calc(100% - 36px);
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
          padding: 30px 20px;
          background-color: #f1f7ff;
          border-left: 1px solid #d6dfef;
          cursor: pointer;
          overflow: auto;
          .error-item {
            font-size: 12px;
            line-height: 24px;
            color: #c92b2b;
          }
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
