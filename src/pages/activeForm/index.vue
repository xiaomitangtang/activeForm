<template>

<div class="active-form-page">

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
    </div>
  </el-row>
</div>

</template>
<script>
import ankaStaticData from "@/pages/activeForm/ankaStaticData"; //这是一个静态的案卡数据
import ankaParamsList from "./ankaParamsListData"; //这个是案卡参数下拉框列表的数据
import ruleData from "./rulesParser/data.json"; //这是默认的案卡规则
window.ruleData = ruleData; //将默认的案卡规则进行赋值

export default {
  name: "activeForm",
  data() {
    return {
      ankaParamsList: ankaParamsList, //案卡参数下拉框的数据
      currentAnkaParam: ankaParamsList[1], //当前展示的案卡
      currentAnka: ankaStaticData, //当前展示的案卡数据，（经过formDesigner转换之前的数据）
      currenShowTable: null,
      currenShowTab: null,
      errorsList: [],
      columns: [
        {
          text: "事件",
          value: "event",
          width: 200
        },
        {
          text: "ID",
          value: "id"
        },
        {
          text: "时间线",
          value: "timeLine"
        },
        {
          text: "备注",
          value: "comment"
        }
      ],
      data: [
        {
          id: 0,
          event: "事件1",
          timeLine: 50,
          comment: "无"
        },
        {
          id: 1,
          event: "事件1",
          timeLine: 100,
          comment: "无",
          children: [
            {
              id: 2,
              event: "事件2",
              timeLine: 10,
              comment: "无"
            },
            {
              id: 3,
              event: "事件3",
              timeLine: 90,
              comment: "无",
              children: [
                {
                  id: 4,
                  event: "事件4",
                  timeLine: 5,
                  comment: "无"
                },
                {
                  id: 5,
                  event: "事件5",
                  timeLine: 10,
                  comment: "无"
                },
                {
                  id: 6,
                  event: "事件6",
                  timeLine: 75,
                  comment: "无",
                  children: [
                    {
                      id: 7,
                      event: "事件7",
                      timeLine: 50,
                      comment: "无",
                      children: [
                        {
                          id: 71,
                          event: "事件71",
                          timeLine: 25,
                          comment: "xx"
                        },
                        {
                          id: 72,
                          event: "事件72",
                          timeLine: 5,
                          comment: "xx"
                        },
                        {
                          id: 73,
                          event: "事件73",
                          timeLine: 20,
                          comment: "xx"
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: "事件8",
                      timeLine: 25,
                      comment: "无"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
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
        let formData = await this.$api.activeForm.formData({ params });
        let formValid = await this.$api.activeForm.formValid({ params });
        // console.log(formValid);
        window.ruleData = formValid.data; //将获取到的验证规则挂载到window上，方便其他地方获取
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
    }, //获取服务端的数据，以及验证规则，并转换后台数据
    watchUrl() {
      this.getAnKaByParams(this.$route.query);
    }
  },
  watch: {
    currentAnkaParam(n) {
      this.getAnKaByParams(n);
      let newUrl = `#/activeForm?akmbbh=${n.akmbbh}&bmsah=${n.bmsah}`;
      window.history.pushState("", "", newUrl);
    } //监控当前的案卡参数，及时根据当前的参数获取当前的案卡信息
  },
  mounted() {
    this.getAnKaByParams(this.$route.query);
    window.addEventListener("popstate", this.watchUrl); //添加用户对url的手动更改的监听，如果用户更改了url的参数，重新发送请求
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.watchUrl); //组件卸载时，移除本组件对用户修改url的监听事件
  },
  components: {
    ankaformList: () => import("./anka-form-list.vue"), //这个组件是界面左侧的案卡tab和table的展示列表
    formDesigner: () => import("./formDesigner.vue"), //这个是案卡展示的主界面位于中间
    errorsList: () => import("./error-list.vue") //这个是案卡错误信息的展示列表
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
