<template>
    <div class='active-form-pagenation'>
        <swxpagenation style="float: left;" :elProps="elProps"
                       @current-change="pageChange"
                       @size-change="pageSizeChange"
                       @prev-click="preClick"
                       @next-click="nextClick"
        ></swxpagenation>
        <extrabtn style="float: left;" @btnClick="btnClick" v-bind="extraBtns"></extrabtn>
        <div style="clear: both"></div>
    </div>
</template>
<script>
export default {
  props: {
    elProps: { type: Object, default: () => ({ total: 2, "page-size": 1 }) },
    extraBtns: {
      type: Object,
      default: () => ({
        add: true,
        copy: true,
        del: true,
        save: true
      })
    }
  },
  data() {
    return {};
  },
  methods: {
    btnClick(type) {
      this.$emit("menuClick", type);
    },
    pageChange(page) {
      this.$emit("pageChange", page);
    },
    preClick() {
      // console.log(page);
    },
    nextClick() {
      // console.log(page);
    },
    pageSizeChange() {
      // console.log(size);
    }
  },
  components: {
    swxpagenation: () => import("./swx-pagenation.vue"),
    extrabtn: () => import("./page-extra-btns.vue")
  }
};
</script>
<style>
.active-form-pagenation {
  /*height: 40px;*/
}
</style>
