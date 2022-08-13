
<template>
  <CSidebar
      position="fixed"
      :unfoldable="sidebarUnfoldable"
      :visible="sidebarVisible"
  >

    <CSidebarBrand>
      <CIcon
          custom-class-name="sidebar-brand-full"
          :icon="logoNegative"
          :height="35"
      />
      {{ address }}

      <CIcon
          custom-class-name="sidebar-brand-narrow"
          :icon="sygnet"
          :height="35"
      />
    </CSidebarBrand>
    <AppSidebarNav />
    <CSidebarToggler
        class="d-none d-lg-flex"
        @click="$store.commit('toggleUnfoldable')"
    />
  </CSidebar>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '@/assets/brand/logo-negative'
import { sygnet } from '@/assets/brand/sygnet'
import {useSidebarStore} from "@/stores/sidebar";
import {useProvidersStore} from "@/stores/provider";
export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const sidebarStore = useSidebarStore()
    const providers = useProvidersStore().register()
    const address  = computed(() => {
      return providers.metamask.$state.address;
    });
    return {
      logoNegative,
      sygnet,
      address,
      sidebarUnfoldable: computed(() => false),
      sidebarVisible: computed(() => true),
    }
  },
}
</script>
