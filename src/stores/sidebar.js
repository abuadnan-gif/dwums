// // src/stores/sidebar.js
// import { defineStore } from 'pinia'

// export const useSidebarStore = defineStore('sidebar', {
//   state: () => ({
//     activeDropdown: null, // currently open dropdown ID
//     collapsed: false,
//     isDark: false
//   }),

//   actions: {
//     toggleDropdown(id) {
//       this.activeDropdown = this.activeDropdown === id ? null : id
//     },

//     closeAll() {
//       this.activeDropdown = null
//     },

//     toggleCollapse() {
//       this.collapsed = !this.collapsed
//       if (this.collapsed) {
//         this.activeDropdown = null
//       }
//     },

//     setTheme(isDark) {
//       this.isDark = isDark
//     }
//   }
// })
