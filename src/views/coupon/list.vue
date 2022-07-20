<template>
  <a-card>
    <top-action :layout="['slot', 'refresh']">
      <a-button type='primary' size='small'>新增</a-button>
    </top-action>
  </a-card>
</template>

<script setup>
import TopAction from '@/components/common/TopAction'</script>
<style lang='scss' scoped>

</style>
