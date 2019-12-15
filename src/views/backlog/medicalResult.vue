<template>
    <div class="createPost-container">
        <el-form
                ref="resultFrom"
                :model="resultFrom"
                label-position="left"
                label-width="120px"
                style="width: 80%; margin-left:50px;">

            <el-form-item label="检测结果" prop="result">
                <el-input v-model="resultFrom.result"/>
            </el-form-item>
            <el-form-item label="勘查号" prop="evidenceNo">
                <el-input v-model="resultFrom.evidenceNo"/>
            </el-form-item>
            <el-form-item label="文书号" prop="documentNo">
                <el-input v-model="resultFrom.documentNo"/>
            </el-form-item>
            <el-form-item label="文书日期" prop="sort">
                <el-date-picker
                        v-model="resultFrom.documentDate"
                        type="date"
                        value-format="timestamp"
                        placeholder="选择日期"
                        style="width: 100%">
                </el-date-picker>
            </el-form-item>
            <!--<el-form-item label="是否推送给主办痕检" prop="needToPushToCharger">-->
                <!--<el-checkbox v-model="resultFrom.needToPushToCharger"></el-checkbox>-->
            <!--</el-form-item>-->
            <el-form-item label="任务编号" prop="taskNo">
                <el-input v-model="resultFrom.taskNo"/>
            </el-form-item>
            <el-form-item label="案件类别" prop="caseCategory">
                <el-cascader
                        :options="caseCategoryList"
                        filterable
                        @change="countDict"
                        v-model="resultFrom.caseCategory"
                        :filter-method="remoteSearch"
                        :show-all-levels="false"
                        placeholder="案件类别"
                        style="width: 100%;">
                </el-cascader>
            </el-form-item>
            <el-form-item label="委托日期" prop="delegateTime">
                <el-date-picker
                        v-model="resultFrom.delegateTime"
                        type="date"
                        value-format="timestamp"
                        placeholder="选择日期"
                        style="width: 100%">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="委托单位" prop="delegateOrg">
                <el-input v-model="resultFrom.delegateOrg"/>
            </el-form-item>

            <el-form-item label="委托人" prop="delegateName">
                <el-select v-model="resultFrom.delegateUid"
                           filterable
                           :filter-method="filterUserSearch"
                           @visible-change="restUserSearch"
                           class="filter-item"
                           @change="selectUpdate"
                           value-key="id"
                           style="width: 100%">
                    <el-option
                            v-for="item in userShowList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="简要案情" prop="digest">
                <el-input v-model="resultFrom.digest"/>
            </el-form-item>
            <el-form-item label="死者情况" prop="deathDetail">
                <el-input v-model="resultFrom.deathDetail"/>
            </el-form-item>
            <el-form-item label="提取检材" prop="extractMaterial">
                <el-input v-model="resultFrom.extractMaterial"/>
            </el-form-item>
            <el-form-item label="检材去向" prop="materialTo">
                <el-input v-model="resultFrom.materialTo"/>
            </el-form-item>

            <el-form-item label="鉴定结论" prop="conclusion">
                <el-input v-model="resultFrom.conclusion"/>
            </el-form-item>
            <el-form-item label="检验人" prop="examName">
                <el-select v-model="resultFrom.examUid"
                           filterable
                           :filter-method="filterUserSearch"
                           @visible-change="restUserSearch"
                           class="filter-item"
                           @change="selectUpdate"
                           value-key="id"
                           style="width: 100%">
                    <el-option
                            v-for="item in userShowList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="备注栏" prop="note">
                <el-input v-model="resultFrom.note" type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"/>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;text-align: center;" label-width="100px">
                <el-button v-loading="loading"  style="width: 200px" type="primary"
                           @click="submitForm">保存
                </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    import { medicalDetail,medicalDetails} from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive

    export default {
        name: "medicalResult",
        directives: {waves},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                resultFrom: {
                    id: '',
                    result: '',
                    documentNo: '',
                    documentDate: '',
                    taskNo: '',
                    delegateOrg: '',
                    delegateUid: '',
                    digest: '',
                    deathDetail: '',
                    extractMaterial: '',
                    conclusion: '',
                    examUid: '',
                    materialTo: '',
                    caseCategory: '',
                    note: '',
                    needToPushToCharger: '',
                    usedType: '',
                },
            }
        },
        created() {
            if (this.isEdit) {
                const id = this.$route.params && this.$route.params.id
                this.resultFrom.id = id;
                this.fetchData(id)
            }
        },
        methods:{
            fetchData(id) {
                medicalDetails(id).then(data => {
                    this.resultFrom = Object.assign({}, data);

                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm(){
                let data = Object.assign({}, this.resultFrom)
                if (data.documentDate.toString().length > 10)
                    data.documentDate = parseInt(data.documentDate / 1000);
                    medicalWriteResult(data).then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            });
                            this.dialogresultFrom = false;
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
                }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~@/styles/mixin.scss";

    .createPost-container {
        position: relative;

        .createPost-main-container {
            padding: 40px 45px 20px 50px;

            .postInfo-container {
                position: relative;
                @include clearfix;
                margin-bottom: 10px;

                .postInfo-container-item {
                    float: left;
                }
            }

            .editor-container {
                min-height: 500px;
                margin: 0 0 30px;

                .editor-upload-btn-container {
                    text-align: right;
                    margin-right: 10px;

                    .editor-upload-btn {
                        display: inline-block;
                    }
                }
            }
        }

        .word-counter {
            width: 40px;
            position: absolute;
            right: -10px;
            top: 0px;
        }
    }
</style>

