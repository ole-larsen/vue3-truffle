import {getCurrentInstance} from "vue";
import { defineStore } from "pinia";

export const useRpcStore = defineStore({
  id: "rpc",
  state: () => ({
    provider:   getCurrentInstance()?.appContext.config.globalProperties.$rpc,
    registered: false,
    connected:  false,
    accounts:   [""],
    address:    "",
    chainID:    0,
    nodeInfo:   ""
  }),
  getters: {
    isRegistered:  (state) => state.registered,
    isConnected:   (state) => state.connected,
    checkMetaMask: (state) => false,
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
          .then((chainID: number | PromiseLike<number>) => {
            this.connected = true
            this.chainID = chainID as number
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
      await this.provider("http://localhost:1111/api/v1/accounts", {
        method: "GET"
      })
      .then((response: Response) => response.json())
      .then((accounts: string[]) => {
        this.accounts = accounts
      })
      .catch((e: Error) => {throw e})
    },
    storeChainId() {
      return this.provider('http://localhost:1111/api/v1/chain_id', {
        method: "GET"
      })
      .then((response: Response) => response.json())
      .then((chainID: string) => {
        console.log(chainID)
      })
      .catch((e: Error) => {throw e})
    }
  }
})