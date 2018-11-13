<template>
  <div class='form-designer-main'>
    <el-row class="form-designer-main-header" >
      <span class="form-designer-main-header-text">{{translatedAnKa.header.name}}</span>
    </el-row>
    <div class="form-desgner-tables" ref="tablebox" id="tablebox" @scroll.passive="tableBoxScroll"
        @mousewheel="tableMouseWheel">
      <div class="form-designer-main-tabs"  v-for="(tab , tabIndex) in  translatedAnKa.children  "  ref="tab" :key="'ankatable'+tabIndex">
        <mypagenation v-if="tab.child.more"
                style="margin-bottom: 10px;margin-left: 10px;"
                      :elProps="{total:tab.pageData?tab.pageData.length : 1,'page-size':1,'current-page':tab.currentPage}"
                      @menuClick="pageMenuClick({type:'tab',tab:tab,tabIndex,data:$event})"
                      @pageChange="pageChange({type:'tab',tab:tab,tabIndex,data:$event})"
        ></mypagenation>
        <el-row class="form-designer-pane" >
          <formDesignerpane v-if="tab.child.containers.length===1"  class="form-designer-pain-main"
                             ref="mainpain"
                             :panelName="tab.child.title"
                             :panelID="tab.child.id"
                             :tableData="tab.child.containers[0]"
                            :totalPage="getPanelTotalPage(tab)"
                            :currentPage="getPanelCurrentPage(tab)"
                             @formDesignerpaneItemClick="formDesignerpaneItemClick"
                             @setNowFormPaneAndnowFormPaneDragItem="setNowFormPaneAndnowFormPaneDragItem"
                             @PanelMounted="PanelMounted" @PanelDestory="PanelDestory"
                             @panelUpdated="panelUpdated"
                            @addError="addError"
                            @removeError="removeError"
                            @menuClick="pageMenuClick({type:'table',tab:tab,tabIndex,tableIndex:0,data:$event})"
                            @pageChange="pageChange({type:'table',tab:tab,tabIndex,tableIndex:0,data:$event})"
          ></formDesignerpane>

          <el-tabs v-else   type="card"
                          class= "form-tabs swx-tabs swx-tabs-card"
                   :value="tab.currentTableName" @input="tabsValueChange(tab,$event)"
                          @tab-click="tabPanelClick(tabIndex,$event)">
                   <el-tab-pane v-for="(table,tableIndex) in tab.child.containers" :label="table.text" :name="table.text" :key="table.text"

                   >
                     <formDesignerpane     @formDesignerpaneItemClick="formDesignerpaneItemClick"
                                           :tableData="table"
                                           :panelName="tab.child.title"
                                           :panelID="tab.child.id"
                                           :totalPage="getPanelTotalPage(tab,tableIndex+1)"
                                           :currentPage="getPanelCurrentPage(tab,tableIndex+1)"
                                           @setNowFormPaneAndnowFormPaneDragItem="setNowFormPaneAndnowFormPaneDragItem"
                                           @PanelMounted="PanelMounted" @PanelDestory="PanelDestory"
                                           @panelUpdated="panelUpdated"
                                           @addError="addError"
                                           @removeError="removeError"
                                           @menuClick="pageMenuClick({type:'table',tab:tab,tabIndex,tableIndex,data:$event})"
                                           @pageChange="pageChange({type:'table',tab:tab,tabIndex,tableIndex,data:$event})"
                     ></formDesignerpane>

                   </el-tab-pane>
                 </el-tabs>
        </el-row>
      </div>
    </div>
    <div class="form-designer-setting">
      <el-button-group  style=" float: right;" >
        <el-button class="swx-btn-primary swx-btn-size-mini"  @click="mysubmit" >保存</el-button>
      </el-button-group>
    </div>
  </div>
</template>
<script>
import formDesignerStatic from "./formDesignerStatic";
let justSave = "justSave";
export default {
  name: "formDesigner",
  props: {
    data: { type: Object },
    currenTab: { type: Object },
    currentTable: { type: Object }
  },
  data() {
    return {
      formItemSettingsValue: formDesignerStatic.formItemSettingsValue, //页面中的一些静态的常量
      translatedAnKa: { header: { name: "" }, children: [] }, //用于渲染页面的案卡数据（根据服务端数据转化过后的数据，包含翻页数据）
      panels: [], //记录当前页面中panel的数据
      tableItems: [] //所有表单元素平铺之后的数据，方便验证
    };
  },
  provide() {
    return {
      formDedigner: this
    };
  },
  methods: {
    translateFormItem: formDesignerStatic.translateFormItem, //转化数据的方法，单位位每一个控件
    getAllPanes() {
      return this.panels;
    }, //获取当前设计器中所有panel的方法
    validateAllPanels() {
      this.$emit("clearErrors");
      return this.getAllPanes()
        .map(item => item.validField())
        .every(i => i);
    }, //调用当前设计器中所有的table进行表单验证
    mysubmit() {
      let formValid = this.validateAllPanels();
      this.$notify({
        title: "表单验证",
        message: formValid ? "通过" : "未通过",
        type: formValid ? "success" : "error"
      });
      let Data = this.translatedAnKa.children.map(tab => {
        this.saveTabValue(tab, tab.currentPage - 1, justSave);
        return tab.pageData;
      });
      console.log(this.translatedAnKa);
      console.log("DataData");
      console.log(Data);
      console.log(JSON.stringify(Data));
      this.$api.activeForm.saveAnKa(Data).then(
        res => {
          this.$notify({
            title: "温馨提示",
            message: res.success ? "保存成功" : res.message,
            type: res.success ? "success" : "error"
          });
        },
        err => {
          console.log(err);
        }
      );
    }, //点击保存按钮向后台提交数据的方法
    getAllTableItem() {
      return this.tableItems;
    }, //将当前设计器中所有的表中的数据，平铺为表单元素的数组，方便其他地方使用
    panelUpdated() {
      this.setSrollList();
    }, //当设计器中的panel更新时，从新获取一下最新的panel的位置，用于滚动
    setSrollList() {
      clearTimeout(this.setScrollListTimer);
      this.setScrollListTimer = setTimeout(() => {
        this.tablelistScrollList = this.$refs.tab.map(i => i.offsetTop);
      }, 200);
    }, //一个抽取的保存panel位置的方法，已经使用定时器进行了截流，不会立即保存，而是有延迟debounce效果
    initTable(tab, table, tabIndex, tableIndex) {
      return {
        text: table.text,
        more: table.more,
        container: {
          controlType: table.container.controlType,
          children: table.container.children.map(row => {
            return {
              children: row.children.map(item => {
                let tempItem = this.translateFormItem(
                  item,
                  tabIndex,
                  tableIndex
                );
                this.tableItems.push(tempItem);
                return tempItem;
              })
            };
          })
        }
      };
    }, //转化table的方法，用于将老版本的案卡系统的数据转化为当前的表数据
    PanelMounted(panel) {
      if (panel) {
        this.panels.push(panel);
      }
    }, //panel的挂载事件，当panel挂载时，保存panel
    PanelDestory(panel) {
      if (panel) {
        this.panels.splice(this.panels.indexOf(panel), 1);
      }
    }, //panel的卸载事件，当panel卸载时，移除
    tableBoxScroll(e) {
      if (this.changing) return;
      if (!this.tablelistScrollList) return;
      this.scrollCount = this.scrollCount ? this.scrollCount + 1 : 1;
      if (this.scrollCount % 3 !== 0) return;
      let scrollTop = e.target.scrollTop;
      let near = this.tablelistScrollList.map(i => Math.abs(i - scrollTop));
      let min = Math.min(...near);
      if (min < 20) {
        let tab = this.data.children[near.indexOf(min)];
        let currentTableName = this.translatedAnKa.children[near.indexOf(min)]
          .currentTableName;
        let table = tab.child.containers.filter(
          tb => tb.text === currentTableName
        )[0];
        this.$emit("currentTableChange", {
          tab,
          table
        });
      }
    }, //设计器中的容器框滚动事件，用于同步设计器中的容器与左侧的导航
    tableMouseWheel() {
      if (!this.changing) return;
      clearInterval(this.scrollTimer);
      this.changing = false;
    }, //在容器中滚动鼠标滚轮事件，用于停止正在进行的滚动，将用户的滚动优先级提到最高
    animateToTab(n) {
      if (!this.tablelistScrollList) return;
      let target = this.tablelistScrollList[this.data.children.indexOf(n)];
      this.animateTo(target);
    }, //当currenttab改变时，将容器滚动到相应的位置
    animateToError(data) {
      let errTab = this.translatedAnKa.children[data.item.tabIndex];
      let errorTable = errTab.child.containers[data.item.tableIndex];
      errTab.currentTableName = errorTable.text;
      this.$nextTick(() => {
        let targetEl = document.getElementById(data.item.elId);
        let tablistY =
          targetEl.offsetParent.offsetParent.offsetParent.offsetParent
            .offsetTop;
        let tempElToTabList =
          targetEl.offsetParent.offsetParent.offsetParent.offsetTop;
        let errorTab = this.data.children[data.item.tabIndex];
        if (errorTab.child.containers.length === 1) {
          this.animateTo(tempElToTabList + tablistY);
        } else if (errorTab.child.containers.length > 1) {
          tablistY =
            targetEl.offsetParent.offsetParent.offsetParent.offsetParent
              .offsetParent.offsetTop;
          this.animateTo(tempElToTabList + tablistY);
        }
      });
    }, //当用户点击错误提示时，将容器滚动到相对应的错误位置
    animateTo(target) {
      this.changing = true;
      clearInterval(this.scrollTimer);
      let tablebox = document.getElementById("tablebox");
      let llast = -1;
      let last = tablebox.scrollTop;
      let step = 10;
      this.scrollTimer = setInterval(() => {
        llast = last;
        tablebox.scrollTop = last + (target - last) / step;
        last = tablebox.scrollTop;
        if (Math.abs(target - last) < 3) {
          clearInterval(this.scrollTimer);
          tablebox.scrollTop = target;
          this.changing = false;
        } else if (Math.abs(target - last) < 10) {
          step = 2;
        } else if (Math.abs(target - last) < 30) {
          step = 3;
        } else if (Math.abs(target - last) < 100) {
          step = 5;
        } else if (llast === last) {
          clearInterval(this.scrollTimer);
        }
      }, 20);
    }, //一个抽取的滚动容器到指定位置的方法，
    translateAnka() {
      let tempAnka = {};
      this.tableItems = [];
      if (this.data) {
        tempAnka.header = this.data.header;
        tempAnka.controlType = this.data.controlType;
        tempAnka.children = this.data.children.map((tab, tabIndex) => {
          return {
            currentTableName: tab.child.containers[0].text,
            pageData: tab.pageData || null,
            currentPage: 1,
            child: {
              controlType: tab.child.controlType,
              id: tab.child.id,
              more: tab.child.more,
              title: tab.child.titlem,
              currentPage: 1,
              containers: tab.child.containers.map((table, tableIndex) => {
                return this.initTable(tab, table, tabIndex, tableIndex);
              })
            }
          };
        });
      }
      this.translatedAnKa = tempAnka;
      // this.initPanelsFormModal();
      this.initTabPageData();
    }, //将老版本的案卡系统的数据进行转化为本系统所需要的数据
    initPanelsFormModal() {
      clearInterval(this.initFormTimer);
      let tableNum = 0;
      this.translatedAnKa.children.forEach(tab => {
        tableNum += tab.child.containers.length;
      });
      this.initFormTimer = setInterval(() => {
        if (this.getAllPanes().length === tableNum) {
          this.getAllPanes().forEach(item => item.changemodel());
          this.setSrollList();
          clearInterval(this.initFormTimer);
          this.$emit("clearErrors");
          console.log("数据加载完成");
        } else {
          console.log("数据正在加载");
        }
      }, 100);
    }, //刷新panel的方法
    isAllPanelMounted() {
      let tableNum = 0;
      this.translatedAnKa.children.forEach(tab => {
        tableNum += tab.child.containers.length;
      });
      return this.getAllPanes().length === tableNum;
    }, //判断是否所有的panel已经mounted的函数。
    setCurrentTable(table, tab) {
      this.translatedAnKa.children[
        this.data.children.indexOf(tab)
      ].currentTableName =
        table.text;
    }, //用户点击左侧导航时，同步本设计器中的table
    tabPanelClick(tabindex, event) {
      let tab = this.data.children[tabindex];
      let table = tab.child.containers.filter(tb => tb.text === event.name)[0];
      this.$emit("currentTableChange", {
        tab,
        table
      });
    }, //用户选中tab的某一项触发的事件，用以同步当前显示的tab和table
    tabsValueChange(tab, val) {
      tab.currentTableName = val;
      this.setSrollList();
    }, //当tab的table发生改变时，同步当前显示的table的同时，更新当前各个tab的位置信息数组tablelistScrollList
    addError(data) {
      this.$emit("addError", data);
    }, //将panel中emit出来的错误向上传递到index中
    removeError(data) {
      this.$emit("removeError", data);
    }, //将panel中emit出来的错误向上传递到index中
    getTableByTableData(table) {
      return this.getAllPanes().filter(panel => {
        return panel.tableData === table;
      })[0];
    }, //根据table数据获取对应的table所在panel实例的方法，利用引用传值进行匹配
    setTableValue(table, data, flag) {
      let tempTableData = {};
      table.container.children.forEach(row => {
        row.children.forEach(item => {
          tempTableData[item.key] = item.val;
          if (flag === justSave) return;
          if (!data) {
            item.val = null;
          } else {
            item.val = data[item.key];
          }
        });
      });
      if (flag !== justSave) {
        this.getTableByTableData(table).setFromModel();
      }
      return tempTableData;
    }, //设置panel展示数据的方法，将会返回设置好的数据
    setTabValue(tab, data, flag) {
      let pagedata = tab.child.containers.map((table, index) => {
        let tempTableData = null;
        if (data) {
          tempTableData = this.setTableValue(
            table,
            data.tabPageData[index]
              ? data.tabPageData[index][data.currentTablePages[index] - 1]
              : {},
            flag
          );
        } else {
          tempTableData = this.setTableValue(table);
        }
        if (data && data.tabPageData[index]) {
          data.tabPageData[index].splice(
            data.currentTablePages[index] - 1,
            1,
            tempTableData
          );
          return data.tabPageData[index];
        } else {
          return [tempTableData];
        }
      });
      let currentTablePages = data
        ? data.currentTablePages
        : tab.child.containers.map(() => 1);
      return { tabPageData: pagedata, currentTablePages };
    }, //设置tab展示数据的方法，将会返回设置好的tab数据
    saveTabValue(tab, pageIndex, flag) {
      tab.pageData[pageIndex] = this.setTabValue(
        tab,
        tab.pageData[pageIndex],
        flag
      );
    }, //保存tab数据的方法，将会修改pageData中相对应的数据
    saveTableValue(tab, tableIndex, tabpage, data) {
      let tempTableaData = this.setTableValue(
        data.table,
        tab.pageData[tabpage].tabPageData[tableIndex][
          tab.pageData[tabpage].currentTablePages[tableIndex] - 1
        ]
      );
      this.setTableValue(
        data.table,
        tab.pageData[tabpage].tabPageData[tableIndex][data.page - 1]
      );
      tab.pageData[tabpage].tabPageData[tableIndex][
        tab.pageData[tabpage].currentTablePages[tableIndex] - 1
      ] = tempTableaData;
    }, //保存table数据的方法，在翻页时使用，保存当前显式页面的数据，然后设置对应页面的数据
    initTabPageData() {
      clearTimeout(this.iniTabPageDataTimer);
      this.iniTabPageDataTimer = setInterval(() => {
        if (!this.isAllPanelMounted()) return;
        clearTimeout(this.iniTabPageDataTimer);
        let tempTranslatedAnka = Object.assign({}, this.translatedAnKa);
        tempTranslatedAnka.children.forEach(tab => {
          tab.pageData = tab.pageData ? tab.pageData : [this.setTabValue(tab)];
          this.setTabValue(tab, tab.pageData[0]);
        });
        this.translatedAnKa = tempTranslatedAnka;
      }, 300);
    }, //对translatedAnka页面数据进行翻页数据初始化的方法。
    async pageMenuClick({ type, tab, tableIndex, data }) {
      let formValid = this.validateAllPanels();
      // if (!formValid) return;
      console.log(formValid);
      if (type === "tab") {
        if (data === "add") {
          if (!tab.pageData) {
            tab.pageData = [this.setTabValue(tab), this.setTabValue(tab)];
          } else {
            this.saveTabValue(tab, tab.currentPage - 1);
            tab.pageData.push(this.setTabValue(tab));
          }
          tab.currentPage = tab.pageData.length;
        } else if (data === "del") {
          let deleteData = tab.pageData[tab.currentPage - 1];
          let flag = await this.deleteTableOrTab("tab", deleteData); //调用后台接口删除
          if (!flag) return; //如果后台删除失败，页面不执行删除逻辑
          if (tab.pageData.length === 1) {
            this.setTabValue(tab);
            tab.pageData = [this.setTabValue(tab)];
          } else {
            this.setTabValue(tab);
            tab.pageData.splice(tab.currentPage - 1, 1);
            tab.currentPage = tab.currentPage > 1 ? tab.currentPage - 1 : 1;
            this.setTabValue(tab, tab.pageData[tab.currentPage - 1]);
          }
        }
      } else if (type === "table") {
        let currentTable = tab.child.containers[tableIndex];
        if (data.data === "add") {
          tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].splice(
            tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] - 1,
            1,
            this.setTableValue(currentTable)
          );
          tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].push(
            this.setTableValue(currentTable)
          );
          tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] =
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].length;
        } else if (data.data === "del") {
          // console.log(tab.currentPage);
          // console.log(type, tab, tableIndex, data);
          let deleteData =
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex][
              tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] -
                1
            ];
          let flag = await this.deleteTableOrTab("table", deleteData); //调用后台接口删除
          if (!flag) return; //如果后台删除失败，页面不执行删除逻辑
          this.setTableValue(currentTable);
          if (
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].length ===
            1
          ) {
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex] = [
              this.setTableValue(currentTable)
            ];
          } else {
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].splice(
              tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] -
                1,
              1
            );
          }
          let currentTablePages =
            tab.pageData[tab.currentPage - 1].currentTablePages;
          currentTablePages[tableIndex] =
            currentTablePages[tableIndex] > 1
              ? currentTablePages[tableIndex] - 1
              : 1;

          this.setTableValue(
            currentTable,
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex][
              currentTablePages[tableIndex] - 1
            ]
          );
        }
      }
      this.translatedAnKa = Object.assign({}, this.translatedAnKa);
      this.$emit("clearErrors");
    }, //翻页组件的点击事件。包括了tab的翻页以及table的翻页
    pageChange({ type, tab, tableIndex, data }) {
      let formValid = this.validateAllPanels();
      // if (!formValid) return;
      console.log(formValid);
      if (type === "tab") {
        this.saveTabValue(tab, tab.currentPage - 1);
        this.setTabValue(tab, tab.pageData[data - 1]);
        tab.currentPage = data;
      } else if (type === "table") {
        this.saveTableValue(tab, tableIndex, tab.currentPage - 1, data);
        tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] =
          data.page;
      }
      this.translatedAnKa = Object.assign({}, this.translatedAnKa);
      this.$emit("clearErrors");
    }, //翻页组件的翻页事件，包括了tab的翻页以及table的翻页
    getPanelTotalPage(tab, tableIndex) {
      if (!tab.pageData) return 1;
      if (!tableIndex) {
        return tab.pageData[tab.currentPage - 1].tabPageData[0]
          ? tab.pageData[tab.currentPage - 1].tabPageData[0].length
          : 1;
      } else {
        return tab.pageData[tab.currentPage - 1].tabPageData[tableIndex - 1]
          ? tab.pageData[tab.currentPage - 1].tabPageData[tableIndex - 1].length
          : 1;
      }
    }, //用于获取对应table的页数的方法，如果存在tableIndex，说明这个tab有多个table，传入的是遍历的索引，否则为tab只有一个table
    getPanelCurrentPage(tab, tableIndex) {
      if (!tab.pageData) return 1;
      if (!tableIndex) {
        return tab.pageData[tab.currentPage - 1].currentTablePages[0];
      } else {
        return tab.pageData[tab.currentPage - 1].currentTablePages[
          tableIndex - 1
        ];
      }
    }, //用于获取对应table的当前页码的方法，如果存在tableIndex，说明这个tab有多个table，传入的是遍历的索引，否则为tab只有一个table
    deleteTableOrTab(type, data) {
      console.log("deleteTableOrTab");
      console.log(data);
      let p = new Promise(sucess => {
        if (type === "tab") {
          this.$api.activeForm.deleteTab(data).then(
            res => {
              console.log(res);
              sucess(true);
            },
            err => {
              console.log(err);
              sucess(false);
            }
          );
        } else {
          this.$api.activeForm.deleteTable(data).then(
            res => {
              console.log(res);
              sucess(true);
            },
            err => {
              console.log(err);
              sucess(false);
            }
          );
        }
      });
      return p;
    }
  },
  components: {
    myElement: () => import("./myElement.vue"),
    formDesignerpane: () => import("./formDesignerpane.vue"),
    mypagenation: () => import("./components/activeFormPagenation.vue")
  },
  computed: {
    edit: {
      get() {
        return this.$store.state.formDesigner.edit;
      }
    },
    editVal() {
      return this.edit ? "关闭编辑" : "编辑";
    },
    showallSetting: {
      get() {
        return this.$store.state.formDesigner.allSettting;
      },
      set(val) {
        this.$store.commit("formDesigner/setAllSettting", val);
      }
    },
    openLayout: {
      get() {
        return this.$store.state.formDesigner.openLayout;
      },
      set(val) {
        this.$store.commit("formDesigner/setOpenLayout", val);
      }
    },
    hasFile() {
      return this.getAllTableItem().some(i => {
        return ["el-upload", "el-image"].indexOf(i.component) > -1;
      });
    }
  },
  watch: {
    data() {
      this.translateAnka();
    },
    currenTab(n) {
      this.animateToTab(n);
    }
  },
  mounted() {
    this.translateAnka();
  }
};
</script>
<style lang="less">
.form-designer-main {
  position: relative;
  height: 100%;
  padding-right: 10px;
  overflow: auto;
  .form-designer-main-header {
    height: 40px;
    line-height: 30px;
    padding-bottom: 10px;
    text-align: left;
    border-bottom: 1px solid #d3d3d3;
    .form-designer-main-header-text {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      /*border-left: 3px solid #134b89;*/
      padding-left: 10px;
      font-size: 24px;
      color: #333333;
    }
  }
  .form-designer-main-tabs {
    margin: 10px 20px 0;
    padding-top: 4px;
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .form-desgner-tables {
    height: calc(100% - 40px);
    border: 1px solid #adc0e0;
    padding-bottom: 40px;
    overflow: auto;
  }
  .form-designer-setting {
    position: absolute;
    bottom: 4px;
    right: 0;
    width: 100%;
    height: 30px;
    padding-right: 40px;
  }
}

.form-designer-pane {
  position: relative;
  /*height: calc(100% - 30px);*/
  background-color: #fff;
  padding: 0;
  border-radius: 10px;
  .form-designer-pain-main {
    width: 100%;
    /*overflow: hidden;*/
  }
  .myform-el-row {
    padding: 0 10px;
    margin: 0 !important;
    box-sizing: border-box;
  }
}
.el-tabs {
  height: 100%;
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__content {
    height: calc(100% - 50px);
    .el-tab-pane {
      height: 100%;
      overflow: auto;
    }
  }
}
.form-tabs {
  /*padding: 0 10px;*/
}
.target {
  position: relative;
  height: 100%;
  min-width: 600px;
  background-color: #fff;
  padding: 3px 0;
  border-radius: 10px;
}
.radio-group-data,
.check-group-data,
.remoteURL {
  width: 100% !important;
}

.radio-group-data .el-form-item__content,
.check-group-data .el-form-item__content {
  width: calc(100% - 135px);
}

.radio-group-data .el-form-item__content .el-input {
  width: 30%;
}

.check-group-data .el-form-item__content .el-input {
  width: 15%;
}

.remoteURL .el-form-item__content {
  width: calc(100% - 130px);
}

.designer-dialog .el-form-item {
  width: calc(33% - 10px);
}
.el-form-item {
  margin-bottom: 0px !important;
}

.close-item {
  position: absolute;
  z-index: 3;
  right: 0;
  top: 0;
  padding: 2px;
  color: #ccc;
}
.editItem {
  /*border: 1px solid #efefef;*/
  /*border-radius: 5px;*/
  /*background-color: #cccccc;*/
}
.resizeBar {
  position: absolute;
  right: -25px;
  top: 50%;
  z-index: 2;
  margin-top: -20px;
  height: 56px;
  width: 50px;
  background-color: red;
  opacity: 0;
  cursor: col-resize;
}
.my-element {
  position: relative;
  padding: 5px 10px 0 10px !important;
  /*min-height: 64px;*/
  /*border: 1px solid #000;*/
  /*overflow: hidden;*/
  .el-checkbox,
  .el-radio {
    margin-bottom: 0;
  }
  .el-range-editor {
    position: absolute;
  }
  .el-form-item--mini {
    min-height: 28px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-color-picker,
    .el-range-editor {
      height: 28px;
    }

    .el-rate {
      padding: 6px 0;
    }
  }
  .el-form-item--small {
    min-height: 32px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 32px;
    }
    .el-rate {
      padding: 8px 0;
    }
  }
  .el-form-item--medium {
    min-height: 36px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 36px;
    }
    .el-rate {
      padding: 9px 0;
    }
  }
  .el-form-item--default {
    min-height: 40px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 40px;
    }
    .el-rate {
      padding: 12px 0;
    }
  }
  .el-slider {
    padding: 1px 0;
  }
  .el-color-picker,
  .el-input-number,
  .el-input,
  .el-select,
  .el-cascader {
    display: block;
  }
  .el-form-item__content {
  }
  .el-form-item__label {
    max-height: 40px;
    margin-bottom: 0;
    line-height: 16px;
    font-size: 12px;
  }
  .changeWidthbtns,
  .close-item {
    display: none;
  }
}
.my-element:hover {
  .changeWidthbtns,
  .close-item {
    display: block;
  }
}
.changeWidthbtns {
  position: absolute;
  right: -5px;
  top: 50%;
  z-index: 2;
  margin-top: -10px;
  height: 20px;
  width: 40px;
  user-select: none;
  span {
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #a4a4a4;
    }
  }
}

.el-form-item__error {
  opacity: 0;
  height: 0;
}
.el-tab-pane {
  display: block !important;
  &[aria-hidden="true"] {
    height: 0 !important;
    opacity: 0;
  }
}
</style>
