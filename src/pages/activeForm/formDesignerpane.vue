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
                :key="'item'+rowIndex+colIndex" :span="item.span" :offset="item.offset"  :class="{editItem:edit}"
                @dragstart.native="formItemDragStart(item,$event)" @dragenter.native="dropToIndex=index"
                @dblclick.native="formItemClick({item})">
          <!--<el-button      v-if="edit" size="mini" type="text" icon="el-icon-circle-close"  class="close-item" @click.stop="delFormItem(index,item)"></el-button>-->
          <el-form-item    :label="item.label"  :id="item.elId" :label-width="item.labelWidth?(item.labelWidth+'px'):'1px'"  :prop="item.key">
            <myElement    :draggable="edit"   :formModel="formModel" :innerdata="item"></myElement>
          </el-form-item>
          <div class="resizeBar" v-if="edit" @click.stop.passive @mousedown.stop.prevent="myelformItemResize($event,item)"  ></div>
          <!--      <div class="changeWidthbtns" v-if="edit" @click.stop.prevent>
                  <span @click="changeFormItemWidth(item,'del')" class="el-icon-remove"></span>
                  <span @click="changeFormItemWidth(item,'add')" class="el-icon-circle-plus"></span>
                </div>-->
        </el-col>
      </el-row>
<!--      <template v-for="(item ,index) in tableData">
        &lt;!&ndash;<div style="clear: both" v-if="index%layout===0&&openLayout" :key="'formitemclear'+index"></div>&ndash;&gt;
        <el-col class="my-element"
                :key="panelName+'col'+index" :span="item.span" :offset="item.offset"  :class="{editItem:edit}"
                @dragstart.native="formItemDragStart(item,$event)" @dragenter.native="dropToIndex=index"
                @dblclick.native="formItemClick({index,item})">
          <el-button      v-if="edit" size="mini" type="text" icon="el-icon-circle-close"  class="close-item" @click.stop="delFormItem(index,item)"></el-button>
          <el-form-item   v-if="showformItem" :label="item.label"  :id="item.elId" :label-width="item.labelWidth?(item.labelWidth+'px'):'1px'" :prop="item.key">
            &lt;!&ndash;<myElement    :draggable="edit"   :formModel="formModel" :innerdata="item"></myElement>&ndash;&gt;
          </el-form-item>
          <div class="resizeBar" v-if="edit" @click.stop.passive @mousedown.stop.prevent="myelformItemResize($event,item)"  ></div>
          &lt;!&ndash;      <div class="changeWidthbtns" v-if="edit" @click.stop.prevent>
                  <span @click="changeFormItemWidth(item,'del')" class="el-icon-remove"></span>
                  <span @click="changeFormItemWidth(item,'add')" class="el-icon-circle-plus"></span>
                </div>&ndash;&gt;
        </el-col>
      </template>-->
    </el-form>
  </div>
</template>
<script>
import formDesignerStatic from "./formDesignerStatic";
export default {
  name: "formDesignerpane",
  props: {
    tableData: {
      type: Object,
      default: () => {
        false;
      }
    },
    panelName: { type: String },
    panelID: { type: String },
    totalPage: { default: 1 },
    currentPage: { default: 1 }
  },
  data() {
    return {
      showformItem: false, //控制formItem是否显示的变量
      // formData: {},//
      // formModalData: { settings: {} },//
      nowFormItem: null, //当前表单元素（设计器）
      formItemSettingsValue: formDesignerStatic.formItemSettingsValue, //页面的一些静态数据常量
      dragedItem: null, //当前拖拽的表单元素（设计器）
      dropToIndex: -1, //拖拽至目标的索引（设计器）
      formModel: {}, //当前表单的数据
      formRule: {}, //当前表单的验证规则
      translatedTableDate: {} //转化后的当前显示页面的数据（有了翻页之后貌似没用了，需要修改）
    };
  },
  inject: ["formDedigner"], //注入的formDesigner，可以通过注入此对象操作外部父实例的相关对象
  methods: {
    getSettings: formDesignerStatic.getSettings, //根据表单元素数据获取默认或已有的setting参数，（element）
    getDefauleVal: formDesignerStatic.getDefauleVal, //根据表单元素数据获取默认或者已有val
    getDefaultRule: formDesignerStatic.getDefaultRule, //根据表单元素获取表单校验的规则
    /*    changeFormItemWidth(item, type) {
      if (type === "del") {
        if (item.span < 4) {
          return;
        }
        item.span--;
      } else if (type === "add") {
        if (item.span >= 24) {
          return;
        }
        item.span++;
      }
    },*/
    saveFormStyle(formModalData) {
      if (formModalData.span !== this.nowFormItem.span) {
        formModalData.settings.handleWidth = null;
      }
      if (formModalData.label) {
        formModalData.label = formModalData.label.trim();
      }
      if (formModalData.texts) {
        formModalData.settings.texts = formModalData.texts
          .split("-")
          .slice(0, formModalData.settings.max);
      }
      Object.keys(formModalData).forEach(key => {
        this.nowFormItem[key] = formModalData[key];
      });
    }, //提供给外部调用的方法
    formItemClick({ item }) {
      if (!this.edit) {
        return;
      }
      let temp = Object.assign({}, item);
      temp.settings = Object.assign({}, item.settings);
      this.nowFormItem = item;
      temp.settings = this.getSettings(item);
      this.$emit("formDesignerpaneItemClick", this, temp);
    }, //双击表单控件的方法，打开设置参数弹窗的方法（设计器有效）
    formItemDragStart(item) {
      if (!this.edit) {
        return;
      }
      this.dragedItem = item;
      this.$emit("setNowFormPaneAndnowFormPaneDragItem", this, this.dragedItem);
    }, //拖拽表单元素的start方法
    /* delDragItem() {
      let dragItemIndex = this.tableData.indexOf(this.dragedItem);
      this.tableData.splice(dragItemIndex, 1);
      this.dragedItem = null;
      this.dropToIndex = this.tableData.length - 1;
    },
    dropFromInner() {
      if (this.dragedItem.component === "el-textarea") {
        this.dropToIndex = this.tableData.length - 1;
      }
      if (this.dragedItem.component === "el-upload") {
        this.dropToIndex = this.findLastToIndex(this.tableData.length - 1);
      }
      let dragItemIndex = this.tableData.indexOf(this.dragedItem);
      if (this.dropToIndex + 1 > 0) {
        if (dragItemIndex < this.dropToIndex) {
          this.tableData.splice(this.dropToIndex + 1, 0, this.dragedItem);
          this.tableData.splice(dragItemIndex, 1);
        } else if (dragItemIndex > this.dropToIndex) {
          this.tableData.splice(this.dropToIndex + 1, 0, this.dragedItem);
          this.tableData.splice(dragItemIndex + 1, 1);
        }
      } else {
        this.tableData.splice(dragItemIndex, 1);
        this.tableData.push(this.dragedItem);
      }
      this.dragedItem = null;
    },
    dropFromOuter(com, outDragItem) {
      let tempcom = outDragItem || {
        component: com,
        settings: {},
        span: 24 / this.$store.state.formDesigner.layout,
        label: "",
        key: com + Math.floor(Math.random() * 100000),
        val: "",
        offset: 0,
        isRequire: false,
        dataType: { value: "" },
        labelWidth: 1
      };
      if (com === "el-textarea") {
        this.dropToIndex = -1;
        tempcom.span = 24;
        tempcom.settings = { type: "textarea", rows: 5 };
      }
      if (com === "el-upload") {
        this.dropToIndex = this.findLastToIndex(this.tableData.length - 1);
      }
      if (this.dropToIndex + 1 > 0) {
        this.tableData.splice(this.dropToIndex + 1, 0, tempcom);
      } else {
        if (
          this.tableData.length &&
          this.formItemSettingsValue.mustLastFormItem.indexOf(
            this.tableData[0].component
          ) + 1
        ) {
          this.tableData.splice(0, 0, tempcom);
        } else {
          this.tableData.push(tempcom);
        }
      }
    },
    dropFromPane() {
      this.formDedigner.nowFormPane.delDragItem();
      let outDragItem = this.formDedigner.nowFormPaneDragItem;
      this.dropFromOuter(outDragItem.component, outDragItem);
    },
    drop() {
      if (!this.edit) {
        return;
      }
      let com = this.activeFormDragSrc;
      this.dropToIndex = this.findLastToIndex(this.dropToIndex);
      if (this === this.formDedigner.nowFormPane) {
        // 如果父组件中记录的pane与本身相同，说明是自己内部拖动（包括拖出去又拖回来）
        if (!this.dragedItem) {
          return;
        }
        this.dropFromInner();
      } else if (com && com.startsWith("el-")) {
        // 如果不是内部拖动，先判断是不是设计器拖动过来的elment的组件
        this.dropFromOuter(com);
      } else {
        // 如果不是内部拖动，也不是设计器拖动过来的组件，   在判断是不是从另一个pane拖动过来的，不是则停止
        if (!this.formDedigner.nowFormPane) {
          return;
        }
        this.dropFromPane();
      }
      this.dropToIndex = this.tableData.length - 1;
      this.$emit("setNowFormPaneAndnowFormPaneDragItem", null, null);
      this.activeFormDragSrc = null;
    }, // 拖拽放置目标元素内事件，用于处理表单
    findLastToIndex(toindex) {
      if (
        toindex > -1 &&
        this.formItemSettingsValue.mustLastFormItem.indexOf(
          this.tableData[toindex].component
        ) + 1
      ) {
        return this.findLastToIndex(toindex - 1);
      } else {
        return toindex;
      }
    }, // 为了限制某些元素只能放到最后，对dropToIndex进行一次查询
    myelformItemResize(ev, item) {
      let x = ev.clientX;
      let formWidth = this.$refs.myform.$el.offsetWidth;
      let itemCol = ev.target.offsetParent;
      let itemColW = itemCol.offsetWidth;
      this.formItemMouseMove = e => {
        e = e || event;
        let tempWidth = ((itemColW + (e.clientX - x)) / formWidth) * 100;
        if (tempWidth < 10 || tempWidth > 100) return;
        this.$set(item.settings, "handleWidth", tempWidth + "%");
      };
      window.addEventListener("mousemove", this.formItemMouseMove);
      window.addEventListener("mouseup", this.myelformItemStopResize);
    },
    myelformItemStopResize() {
      window.removeEventListener("mousemove", this.formItemMouseMove);
      window.removeEventListener("mouseup", this.myelformItemStopResize);
    },*/
    validField() {
      let flag = false;
      this.translatedTableDate = {};
      this.$refs.myform.validate(valid => {
        flag = valid;
        // if (!flag) return;
        this.tableData.container.children.forEach(row => {
          row.children.forEach(item => {
            if (item.component === "el-date-picker") {
              this.translatedTableDate[item.key] = window._.isDate(
                this.formModel[item.key]
              )
                ? "TypeIsDate=" + this.formModel[item.key].getTime()
                : "TypeIsDate=" + this.formModel[item.key];
            } else {
              this.translatedTableDate[item.key] = this.formModel[item.key];
            }
            item.val = this.formModel[item.key];
          });
        });
      });
      return flag;
    }, //表单校验的函数，校验的同时同步页面数据到模型中，并返回校验的结果
    /*    delFormItem(index) {
      this.tableData.splice(index, 1);
      this.dropToIndex = this.tableData.length - 1;
    },*/
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
      // clearTimeout(this.setFormModelTimer);
      // this.setFormModelTimer = setTimeout(() => {
      //   if (!model) {
      //     this.changemodel();
      //   }
      // }, 100);
      this.changemodel();
    } //提供给外部进行设置formModel的方法，目前直接使用更新table的方法，后续可以加入自己的过滤逻辑
  },
  components: {
    myElement: () => import("./myElement.vue"),
    mypagenation: () => import("./components/activeFormPagenation.vue")
  },
  computed: {
    edit: {
      get() {
        return this.$store.state.formDesigner.edit;
      }
    },
    openLayout: {
      get() {
        return this.$store.state.formDesigner.openLayout;
      }
    },
    activeFormDragSrc: {
      get() {
        return this.$store.state.formDesigner.activeFormDragSrc;
      },
      set(val) {
        this.$store.commit("formDesigner/setActiveFormDragSrc", val);
      }
    }
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
