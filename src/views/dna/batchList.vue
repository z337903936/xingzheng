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
            <el-table-column label="物证库编号"  align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/dna/edit-dna/'+row.evidenceMaterial.id">
                        <el-button type="primary" size="mini"  icon="el-icon-edit" >编辑</el-button>
                    </router-link>
                    <el-button type="success" size="mini" style="width: 90px" icon="el-icon-tickets" @click="handleWriteResult(row)">
                        填写结果
                    </el-button>
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

        <el-dialog title="填写结果" :close-on-click-modal="false" :visible.sync="dialogResultFrom" width="50%">
            <el-form
                    ref="ResultFrom"
                    :model="ResultFrom"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检验人" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验单位" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">

                        <el-form-item label="检材类型" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验结果" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="比中人员" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="身份证号" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="比中时间" prop="name">
                            <el-date-picker
                                    v-model="ResultFrom.documentDate"
                                    type="date"
                                    value-format="timestamp"
                                    placeholder="选择日期"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>

                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="户籍地" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="利用情况" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="是否推送痕检" prop="name">
                            <el-input v-model="ResultFrom.needToPushToCharger"/>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="鉴定文书号" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="是否移交鉴定文书" prop="name">
                            <el-input v-model="ResultFrom.result"/>
                        </el-form-item>

                    </el-col>
                </el-row>
              <!--  <el-form-item label="检测结果" prop="name">
                    <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                <el-form-item label="文书号" prop="name">
                    <el-input v-model="ResultFrom.documentNo"/>
                </el-form-item>
                <el-form-item label="利用情况" prop="usedType">
                    <el-select v-model="ResultFrom.usedType" placeholder="请选择" style="width: 100%;">
                        <el-option
                                v-for="item in usedType"
                                :key="item.title"
                                :label="item.title"
                                :value="item.title"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="文书日期" prop="sort">
                    <el-date-picker
                            v-model="ResultFrom.documentDate"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width: 100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否推送给主办痕检" prop="needToPushToCharger">
                    <el-checkbox v-model="ResultFrom.needToPushToCharger"></el-checkbox>
                </el-form-item>-->

            <el-divider content-position="left">物证信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="物证名称" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取位置" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">

                    <el-form-item label="提取方法" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可靠程度" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>

                </el-col>

                <el-col :span="12">
                    <el-form-item label="提取人" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取时间" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>

                </el-col>

            </el-row>
            <el-divider content-position="left">案件信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="勘查号" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件编号" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发案时间 " prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件类别" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发案地点" prop="name">
                        <el-input v-model="ResultFrom.result"/>
                    </el-form-item>
                </el-col>

            </el-row>
                <el-form-item label="物证是否入库" prop="name">
                    <el-input v-model="ResultFrom.result"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogResultFrom = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="writeResult()">
                    确 定
                </el-button>
            </div>
        </el-dialog>
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
    import {writeResult} from '@/api/backlog'

    export default {
        name: 'materialBatch',
        directives: {waves},
        data() {
            return {
                usedType: [
                    {
                        title: '查档认定'
                    }, {
                        title: '鉴定认定'
                    }, {
                        title: '串并认定'
                    }, {
                        title: '排除嫌疑'
                    }, {
                        title: '其他利用'
                    }, {
                        title: '尚未利用'
                    }
                ],
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
                dialogResultFrom: false,
                ResultFrom: {
                    id: '',

                    result: '',
                    documentNo: '',
                    documentDate: '',
                    hasTransfered: '',
                    needToPushToCharger: '',
                    usedType: '',
                },

            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.getList(id)
        },
        methods: {
            handleWriteResult(task) {
                this.dialogResultFrom = true;

                this.ResultFrom.id = task.id
            },
            writeResult() {
                let data = Object.assign({}, this.ResultFrom)
                if (data.documentDate.toString().length > 10)
                    data.documentDate = parseInt(data.documentDate / 1000);
                writeResult(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        });
                        this.dialogResultFrom = false;
                        this.getList();
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
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
