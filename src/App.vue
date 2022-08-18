<template>
  <div>
    <router-view/>
  </div>

</template>

<style lang="scss">
  @import "styles/style.scss";
</style>
<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView } from "vue-router";
import { useProvidersStore } from "@/stores/provider";

const providers = useProvidersStore()

const visible = true;
onBeforeMount(async () => {
  try {
    const registered = await providers.register()
    for (const provider in registered) {
      console.log((registered as any)[provider].getAccounts)
    }
    console.log(registered)
  } catch (e) {
    console.error(e)
  }
})
</script>
