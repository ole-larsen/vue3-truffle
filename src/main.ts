import Web3 from "web3";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import CoreuiVue from "@coreui/vue";
import { iconsSet as icons } from "./assets/icons"
import CIcon from "@coreui/icons-vue";
import DocsCallout from "./components/DocsCallout.vue";
import DocsExample from "./components/DocsExample.vue";

const app = createApp(App);

const web3 = new Web3(Web3.givenProvider??new Web3.providers.HttpProvider(import.meta.env.VITE_WEB3_PROVIDER))

if (window.ethereum) {
    app.config.globalProperties.$ethereum = window.ethereum
}
if (web3) {
    app.config.globalProperties.$web3 = web3
}
// window.bind solve Fetch TypeError: Failed to execute 'fetch' on 'Window': Illegal invocation
app.config.globalProperties.$rpc = window.fetch.bind(window)

app.use(createPinia());
app.use(router);

app.use(CoreuiVue)
app.provide('icons', icons)
app.component("CIcon", CIcon)
app.component("DocsCallout", DocsCallout)
app.component("DocsExample", DocsExample)

app.mount("#app");