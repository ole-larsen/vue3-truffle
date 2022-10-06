import {defineStore} from "pinia";
import {useMetaMaskStore} from "@/stores/metamask";
import {useWeb3Store} from "@/stores/web3";
import { useRpcStore } from "./rpc";

export const useProvidersStore = defineStore("provider", {
    state: () => ({
        providers: {
            metamask: useMetaMaskStore(),
                web3: useWeb3Store(),
                 rpc: useRpcStore()
        },
        metamask: {
            accounts: [""],
            name: ""
        },
        web3: {
            accounts: [""],
            name: ""
        },
        rpc: {
            accounts: [""],
            name: ""
        }
    }),
    getters: {
        getAccounts: (state): {
            [provider: string]: string[]
        } => { 
            return {
                metamask: state.metamask.accounts,
                web3:     state.web3.accounts,
                 rpc:     state.rpc.accounts
            }
        },
        getNames: (state): {
            [provider: string]: string
        } => { 
            return {
                metamask: state.metamask.name,
                web3:     state.web3.name,
                 rpc:     state.rpc.name
            }
        }
    },
    actions: {
        async register() {
            const providers: any = this.getProviders()
            const promises = []
            for (const provider in providers) {
                promises.push(providers[provider].register())
                promises.push(providers[provider].storeAccounts())
            }
            try {
                await Promise.all(promises)
            } catch (e) {
                console.error(e)
            }

            this.storeAccounts()
            this.storeNames()
            return this.providers
        },
        getProviders() {
            return {
                metamask: this.providers.metamask,
                    web3: this.providers.web3,
                     rpc: this.providers.rpc
            }
        },
        getProvider() {
            return this.providers.metamask.provider ?? this.providers.web3.provider ?? this.providers.rpc.provider
        },
        storeAccounts() {
            this.metamask.accounts = this.providers.metamask.getAccounts
            this.web3.accounts     = this.providers.web3.getAccounts
            this.rpc.accounts      = this.providers.rpc.getAccounts
        },
        storeNames() {
            this.metamask.name = "metamask"
            this.web3.name     = "web3"
            this.rpc.name      = "rpc"
        }
    }
});