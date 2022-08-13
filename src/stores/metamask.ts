import {getCurrentInstance} from "vue";
import { defineStore } from "pinia";

export const useMetaMaskStore = defineStore({
  id: "metaMask",
  state: () => ({
    provider: getCurrentInstance()?.appContext.config.globalProperties.$ethereum,
    registered: false,
    connected:  false,
    address:    "",
    chainID: 0
  }),
  getters: {
    isRegistered: (state) => state.registered,
    isConnected:  (state) => state.provider.isConnected(),
    isMetaMask:   (state) => state.provider.isMetaMask,
  },
  actions: {
    register() {
      this.registered = true
      this.connected = this.provider.isConnected()
      console.log(this.connected)
      return this.provider.request({ method: 'eth_chainId' })
          .then((chainID: string) => {
            this.chainID = parseInt(chainID, 16)
          })
    },
    connect() {
      return this.provider.request({ method: 'eth_requestAccounts' })
          .then((accounts: string[]) => {
            this.address = accounts[0]
          })
    }
  },
});