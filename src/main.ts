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
app.config.globalProperties.$web3 = new Web3
app.config.globalProperties.$ethereum = window.ethereum
app.use(createPinia());
app.use(router);

app.use(CoreuiVue)
app.provide('icons', icons)
app.component("CIcon", CIcon)
app.component("DocsCallout", DocsCallout)
app.component("DocsExample", DocsExample)

app.mount("#app");