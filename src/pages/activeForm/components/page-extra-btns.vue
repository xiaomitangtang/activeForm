<template>
    <div class='active-form-pagenation-extra-btns'>
        <div :class="{'disable':!add}" @click="btnClick('add')" class="active-form-pagenation-extra-btn iconfont icon-tianjia1 "></div>
        <div :class="{'disable':!copy}" @click="btnClick('copy')" class="active-form-pagenation-extra-btn iconfont icon-fuzhi"></div>
        <div :class="{'disable':!del}" @click="btnClick('del')" class="active-form-pagenation-extra-btn iconfont icon-shanchu1"></div>
        <!--<div :class="{'disable':!save}" @click="btnClick('save')" class="active-form-pagenation-extra-btn iconfont icon-baocun"></div>-->
    </div>
</template>
<script>
export default {
  props: {
    add: { type: Boolean, default: true },
    copy: { type: Boolean, default: true },
    del: { type: Boolean, default: true },
    save: { type: Boolean, default: true }
  },
  data() {
    return {};
  },
  methods: {
    btnClick(type) {
      if (this[type]) {
        this.$emit("btnClick", type);
      }
    }
  }
};
</script>
<style lang="less">
.active-form-pagenation-extra-btns {
  /*margin-left: 5px;*/
}
.active-form-pagenation-extra-btn {
  float: left;
  margin-left: 4px;
  /*padding: 0 6px;*/
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  height: 22px;
  width: 22px;
  line-height: 22px;
  background-color: #d9ebff;
  border: 1px solid #adcae0;
  color: #3a80c1;
  /*border-right: 0;*/
  /*  &:first-child {
    border-radius: 3px 0 0 3px;
  }
  &:last-child {
    border-radius: 0 3px 3px 0;
    border-right: 1px solid #cccccc;
  }*/
  &:active {
    background-color: #3a80c1;
    color: #d8e6f3;
  }
  &.disable {
    background-color: #eaeaea;
    color: #b9b9b9;
    cursor: not-allowed;
  }
}
</style>
