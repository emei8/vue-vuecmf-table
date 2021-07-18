// 导入组件，组件必须声明 name
import vcTable from './src/table.vue'

// 为组件提供 install 安装方法，供按需引入
vcTable.install = function (Vue) {
  Vue.component(vcTable.name, vcTable)
}

// 默认导出组件
export default vcTable