<template>
    <div class="app-container">

        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="物证名称"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.name	 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特征描述"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类型"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证编码"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="物证库编号"  align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别"   align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="遗留部位" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.stayPart }}</span>
                </template>
            </el-table-column>
            <el-table-column label="可靠程度" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.reliabilityLevel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.usedType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<router-link :to="'/search/show-search/'+row.evidenceMaterialId">-->
                        <!--<el-button type="success" size="mini" >查看</el-button>-->
                    <!--</router-link>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :page-count="pages"
                :current-page.sync="listQuery.page"
                @current-change="getList"
                @size-change="getList"
                :hide-on-single-page="paginationShow"
                style="float: right;margin-top: 15px"
        >
        </el-pagination>

    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {  batchMaterialList } from '@/api/common'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'

    export default {
        name: 'materialBatch',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                listQuery: {
                    page: 1,
                    batchId: undefined,
                },


            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.getList(id)
        },
        methods: {
            getList(id) {
                this.listQuery.batchId = id
                this.listLoading = true;
                batchMaterialList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },

        }
    }
</script>
