//列表导出数据相关事件
import { jsonExport } from "../jsonUtils";

export default {
    methods: {
        //拉取要导出的数据的回调
        getExportData: function (data) {
            if (data.data.data.data == undefined) {
                this.downloadError = "接口异常，无法拉取数据！";
                return false;
            }

            let that = this;
            data.data.data.data.forEach(function (val) {
                let item = [];
                //将下载的字段名替换成表格的表头名称
                that.columns.forEach(function (v) {
                    //只下载显示的列
                    if (v["show"]) {
                        //过滤HTML标签
                        let label = v["label"].replace(/<[^>]*>/g, "");
                        let value = val[v["prop"]];
                        if (v["options"] != undefined && v["options"] != "") {
                            value = v["options"][value];
                        }
                        item[label] = value;
                    }
                });
                that.exportData.push(item);
            });

            this.percentage = Math.ceil(
                this.downloadCurrentPage / this.totalPages * 100
            );

            //全部拉取完后，开始下载数据
            if (this.downloadCurrentPage == this.totalPages) {
                this.downloadTips = false;
                this.downloadError = "";
                this.percentage = 0;
                this.downloadCurrentPage = 0;
                jsonExport(this.exportData, this.exportFileType, this.tableName);
                this.exportData = [];
            } else {
                this.downloadExport(this.exportFileType);
            }
        },
        //下载导出
        downloadExport: function (type) {
            if (this.total == 0) {
                this.$message.error("列表无数据！");
                return false;
            }
            this.downloadTips = true;
            this.exportFileType = type;
            this.downloadCurrentPage++;
            //逐页拉取数据
            this.pullData(this.downloadCurrentPage, this.getExportData);
        }



    }
}