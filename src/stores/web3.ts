
import { defineStore } from "pinia";
import {getCurrentInstance} from "vue";

export const useWeb3Store = defineStore({
  id: "web3",
  state: () => ({
    provider: getCurrentInstance()?.appContext.config.globalProperties.$ethereum,
    isRegistered: false,
    isConnected:  false,
    address:      undefined,
    providerChainID: undefined
  }),
  getters: {
    isConnected: (state) => state.provider.isConnected(),
    isMetaMask: (state)  => false,
  },
  actions: {

  },
});
