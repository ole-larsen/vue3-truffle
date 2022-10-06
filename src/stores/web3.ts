
import { defineStore } from "pinia";
import {getCurrentInstance} from "vue";

export const useWeb3Store = defineStore({
  id: "web3",
  state: () => ({
    provider: getCurrentInstance()?.appContext.config.globalProperties.$web3,
    registered: false,
    connected:  false,
    isMetaMask: false,
    accounts:   [""],
    address:    "",
    chainID: 0,
    nodeInfo: ""
  }),
  getters: {
    isRegistered:  (state) => state.registered,
    isConnected:   (state) => state.connected,
    checkMetaMask: (state) => state.isMetaMask,
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
            this.chainID = parseInt(chainID, 16)
            this.connected = true;
            this.storeNodeInfo()
              .then((nodeInfo: string) => {
                this.nodeInfo = nodeInfo
                console.log(this.chainID, this.nodeInfo)
                return this.chainID
              })
          })
          .catch((e: Error) => {
            this.registered = false;
            throw e
          })
    },
    storeAddress(accounts: string[]) {
      return accounts[0]
    },
    async storeAccounts() {
      await this.provider.eth.getAccounts()
        .then((accounts: string[]) => {
          this.accounts = accounts
        })
        .catch((e: Error) => {throw e})
    },
    storeChainId() {
      return this.provider?.eth.getChainId()
    },
    storeNodeInfo() {
      return this.provider?.eth.getNodeInfo()
    }
  }
});
