import {getCurrentInstance} from "vue";
import { defineStore } from "pinia";

export const useMetaMaskStore = defineStore({
  id: "metaMask",
  state: () => ({
    provider: getCurrentInstance()?.appContext.config.globalProperties.$ethereum,
    registered: false,
    connected:  false,
    accounts:   [""],
    address:    "",
    chainID:    0,
    nodeInfo:   ""
  }),
  getters: {
    isRegistered:  (state) => state.registered,
    isConnected:   (state) => state.provider.isConnected(),
    checkMetaMask: (state) => state.provider.isMetaMask,
    getChainID:    (state) => state.chainID,
    getAccounts:   (state) => state.accounts,
    getNodeInfo:   (state) => state.nodeInfo
  },
  actions: {
    register() {
      if (!this.provider) {
        return this.registered = false
      }
      this.registered = true

      return this.storeChainId()
          .then((chainID: string) => {
            this.connected = this.provider.isConnected()
            this.chainID = parseInt(chainID, 16)
            console.log(this.chainID)
            return this.chainID
          })
          .catch((e: Error) => {
            this.registered = false
            this.connected = false
            throw e
          })
    },
    storeAddress(accounts: string[]) {
      return accounts[0]
    },
    async storeAccounts() {
      await this.provider?.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          this.accounts = accounts
        })
        .catch((e: Error) => {throw e})
    },
    storeChainId() {
      return this.provider?.request({ method: 'eth_chainId' })
    }
  }
});