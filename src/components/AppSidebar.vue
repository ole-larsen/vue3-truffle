
<template>
  <CSidebar
      position="fixed"
      :unfoldable="sidebarUnfoldable"
      :visible="sidebarVisible"
  >

    <CSidebarBrand>
      <img class="sidebar-brand-full" :width="200" :src="logo">
      <CIcon
        custom-class-name="sidebar-brand-narrow"
        :icon="sygnet"
        :height="35"
      />
    </CSidebarBrand>
    
    <CSidebarBrand v-for="(account, provider) in accounts">
      <CWidgetStatsB v-if="account[0]"
        class="mb-3 widget__provider"
        :progress="{ color: 'info', value: 85 }"
        :text="account[0]"
        :title="provider"
        :value="provider"
      />
    </CSidebarBrand>

    <CSidebarToggler
        class="d-none d-lg-flex"
        @click="$store.commit('toggleUnfoldable')"
    />
  </CSidebar>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from   'vue'
import { AppSidebarNav }   from './AppSidebarNav.js'
import { logoNegative }    from '@/assets/brand/logo-negative'
import { sygnet }          from '@/assets/brand/sygnet'
import {useSidebarStore}   from "@/stores/sidebar";
import {useProvidersStore} from "@/stores/provider";
import logo from '@/assets/brand/logo.svg'

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const sidebarStore = useSidebarStore()
    const provider = useProvidersStore()
    const accounts  = computed(() => {
      return provider.getAccounts
    });
    const address  = computed(() => {
      return provider.getNames
    });
    return {
      logo,
      logoNegative,
      sygnet,
      address,
      accounts,
      sidebarUnfoldable: computed(() => false),
      sidebarVisible: computed(() => true),
    }
  },
}
</script>
