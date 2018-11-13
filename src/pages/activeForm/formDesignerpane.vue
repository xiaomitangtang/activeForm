<template>
  <div class='target' @drop.stop.prevent="drop" @dragover.prevent.stop >
    <mypagenation v-if="tableData.more"
                  :elProps="{total:totalPage,'page-size':1,'current-page':currentPage}"
                  style="margin-left: 10px;"
                  @menuClick="pageMenuClick({table:tableData,data:$event})"
                  @pageChange="pageChange({table:tableData,page:$event})"
    ></mypagenation>
    <el-form ref="myform" v-if="showformItem" :model="formModel" :rules="formRule" label-position="left">
      <el-row class="myform-el-row" :gutter="5" v-for="(row,rowIndex) in tableData.container.children" :key="'tablerow'+rowIndex">
        <el-col class="my-element"
                v-for="(item,colIndex) in row.children" v-if="item.exist"
                :key="'item'+rowIndex+colIndex" :span="item.span" :offset="item.offset"
               >
          <el-form-item    :label="item.label"  :id="item.elId" :label-width="item.labelWidth?(item.labelWidth+'px'):'1px'"  :prop="item.key">
            <myElement       :formModel="formModel" :innerdata="item"></myElement>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import formDesignerStatic from "./formDesignerStatic";
export default {
  name: "formDesignerpane",
  inject: ["formDedigner"],
  props: {
    tableData: {
      type: Object,
      default: () => ({})
    },
    panelName: { type: String },
    panelID: { type: String },
    totalPage: { default: 1 },
    currentPage: { default: 1 }
  },
  data() {
    return {
      showformItem: false, //控制formItem是否显示的变量
      formModel: {}, //当前表单的数据
      formRule: {} //当前表单的验证规则
    };
  },
  methods: {
    getSettings: formDesignerStatic.getSettings, //根据表单元素数据获取默认或已有的setting参数，（element）
    getDefauleVal: formDesignerStatic.getDefauleVal, //根据表单元素数据获取默认或者已有val
    getDefaultRule: formDesignerStatic.getDefaultRule, //根据表单元素获取表单校验的规则
    validField() {
      let flag = false;
      this.translatedTableDate = {};
      this.$refs.myform.validate(valid => {
        flag = valid;
        // if (!flag) return;
        this.tableData.container.children.forEach(row => {
          row.children.forEach(item => {
            item.val = this.formModel[item.key];
          });
        });
      });
      return flag;
    }, //表单校验的函数，校验的同时同步页面数据到模型中，并返回校验的结果
    changemodel() {
      let tempmodel = {};
      let temprule = {};
      this.showformItem = false;
      this.tableData.container.children.forEach(row => {
        row.children.forEach(item => {
          tempmodel[item.key] = this.getDefauleVal(item);
          temprule[item.key] = this.getDefaultRule(item, tempmodel[item.key]);
        });
      });
      this.formModel = tempmodel;
      this.formRule = temprule;
      this.$nextTick(() => {
        this.showformItem = true;
      });
    }, //更新panel的表单的方法，将会重新获取form的数据
    pageMenuClick(data) {
      this.$emit("menuClick", data);
    }, //将翻页组件的点击事件传递到formDesigner
    pageChange(data) {
      this.$emit("pageChange", data);
    }, //将翻页组件的单页事件传递到formDesigner
    setFromModel() {
      this.changemodel();
    } //提供给外部进行设置formModel的方法，目前直接使用更新table的方法，后续可以加入自己的过滤逻辑
  },
  components: {
    myElement: () => import("./myElement.vue"),
    mypagenation: () => import("./components/activeFormPagenation.vue")
  },
  updated() {
    this.$emit("panelUpdated");
  },
  watch: {
    tableData() {
      this.changemodel();
    }
  },
  mounted() {
    this.$emit("PanelMounted", this);
  },
  beforeDestroy() {
    this.$emit("PanelDestory", this);
  }
};
</script>
