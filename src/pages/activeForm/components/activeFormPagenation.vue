<template>
    <div class='active-form-pagenation'>
        <swxpagenation style="float: left;" :elProps="elProps"></swxpagenation>
        <extrabtn style="float: left;" @btnClick="btnClick" v-bind="extraBtns"></extrabtn>
        <div style="clear: both"></div>
    </div>
</template>
<script>
export default {
  props: {
    elProps: { type: Object, default: () => ({ total: 5, "page-size": 1 }) },
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
    btnClick: window._.debounce(type => {
      console.log(type);
    }, 1000)
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
