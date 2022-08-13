<template>
  <div>
    <router-view />
  </div>

</template>

<style lang="scss">
  @import "styles/style.scss";
</style>
<script setup lang="ts">
import { computed } from 'vue'
import {onBeforeMount} from "vue";
import { RouterView } from "vue-router";
import {useProvidersStore} from "@/stores/provider";

const providers = useProvidersStore().register()
const address  = computed(() => {
  return providers.metamask.$state.address;
});
const visible = true;
onBeforeMount(() => {
  providers.metamask.register()
  providers.metamask.connect().then(() => {
    console.log(providers.metamask.$state, address)
  })
})
</script>
