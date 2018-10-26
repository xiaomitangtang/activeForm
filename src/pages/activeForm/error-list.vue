<template>
    <div>
        <div style="border-bottom: 1px solid #ccc;padding-bottom: 10px;margin-bottom: 10px;">验证</div>
        <div v-for="(error,index) in errors" :key="index">
            <el-tooltip :content="error.item.errMsg||'错误信息'" effect="light" placement="top-start" >
                <div class="error-item" @click="$emit('errorClick',error)">{{error.item.label}}</div>
            </el-tooltip>

        </div>
    </div>

</template>

<script>
export default {
  name: "error-list",
  props: {
    errors: { type: Array, default: () => [] }
  }
};
</script>
