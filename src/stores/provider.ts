import {defineStore} from "pinia";
import {useMetaMaskStore} from "@/stores/metamask";
import {useWeb3Store} from "@/stores/web3";

export const useProvidersStore = defineStore("provider", {
    state: () => ({
        providers: {
            metamask: useMetaMaskStore(),
                web3: useWeb3Store()
            }
        }),
    actions: {
        register() {
            return {
                metamask: this.providers.metamask,
                web33: this.providers.web3
            }
        }
    }
});