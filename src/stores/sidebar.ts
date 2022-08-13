import { defineStore } from "pinia";

export const useSidebarStore = defineStore({
    id: "sidebar",
    state: () => ({
        sidebarVisible: true,
        sidebarUnfoldable: false,
    }),
    getters: {
        toggleSidebar(state) {
            state.sidebarVisible = !state.sidebarVisible
        },
        toggleUnfoldable(state) {
            state.sidebarUnfoldable = !state.sidebarUnfoldable
        },
        getSidebarUnfoldable(state) {
            return state.sidebarUnfoldable
        },
        getSidebarVisible(state) {
            return state.sidebarVisible
        }
    }
});