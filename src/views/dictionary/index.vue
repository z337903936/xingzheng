<template>
    <div>
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="ID" prop="id" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件编号" min-width="50px">
                <template slot-scope="{row}">
                    <span>{{ row.caseNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="接警时间" width="150px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报告人" min-width="150px">
                <template slot-scope="{row}">
                    <span>{{ row.reporter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报告单位" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reportOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系方式" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategoryId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleUpdate(row)">
                        编辑
                    </el-button>
                    <el-button size="mini" type="success">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit"
                    @pagination="getList"/>
    </div>
</template>

<script>
    import {fetchList, fetchArticle, createArticle, updateArticle} from '@/api/dictionary'
    export default {
        name: "Dictionary",
        data(){
            return{
                tableKey: 0,
                list: null,
                total: 0,
                page: 1,
                limit: 20,
                listLoading: true,
            }

        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.total = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                })
            },
        }
    }
</script>

<style scoped>

</style>
