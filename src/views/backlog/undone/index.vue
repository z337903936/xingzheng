<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"

                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"

        >
            <el-table-column type="expand" ref="expand">
                <template slot-scope="{row}">
                    <el-form label-position="left" inline class="table-expand" v-if="row.fromStep === '接警'">
                        <el-form-item label="报告人">
                            <span>{{ row.record.reporter }}</span>
                        </el-form-item>
                        <el-form-item label="报告单位">
                            <span>{{ row.record.reportOrg }}</span>
                        </el-form-item>
                        <el-form-item label="接警时间">
                            <span>{{  pareTime(row.record.receiptTime) }}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{ row.record.contactPhoneNumber }}</span>
                        </el-form-item>
                        <el-form-item label="案件类别">
                            <span>{{ row.record.caseCategory }}</span>
                        </el-form-item>
                        <el-form-item label="案发时间">
                            <span>{{ pareTime(row.record.caseTime)  }}</span>
                        </el-form-item>
                        <el-form-item label="警情号">
                            <span>{{ row.record.instanceNo }}</span>
                        </el-form-item>
                        <el-form-item label="案发地点">
                            <span>{{ row.record.caseAddress }}</span>
                        </el-form-item>
                        <el-form-item label="案发摘要">
                            <span>{{ row.record.caseDigest }}</span>
                        </el-form-item>
                        <el-form-item label="损失情况">
                            <span>{{ row.record.lostDetail }}</span>
                        </el-form-item>
                        <el-form-item label="技术值班队长">
                            <span>{{ row.record.monitorName }}</span>
                        </el-form-item>
                        <el-form-item label="值班技术员">
                            <span>{{ row.record.techName }}</span>
                        </el-form-item>
                        <el-form-item label="大队值班领导">
                            <span>{{ row.record.leaderName }}</span>
                        </el-form-item>
                        <el-form-item label="接警人">
                            <span>{{ row.record.receiptName }}</span>
                        </el-form-item>
                        <el-form-item label="驾驶员">
                            <span>{{ row.record.driverName }}</span>
                        </el-form-item>
                    </el-form>
                    <!--<el-form label-position="left" inline class="table-expand" v-if="row.fromStep === '物证'">-->
                    <!--<el-form-item label="物证编号">-->
                    <!--<span>{{ row.material.thirdMaterialNo }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="物证细类">-->
                    <!--<span>{{ row.material.noned }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="物证类别">-->
                    <!--<span>{{ row.material.materialCategory }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="物证类型">-->
                    <!--<span>{{ row.material.materialType }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="可靠程度">-->
                    <!--<span>{{ row.material.reliabilityLevel }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="遗留部位">-->
                    <!--<span>{{ row.material.stayPart }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="提取方法">-->
                    <!--<span>{{ row.material.extractMethod }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="利用情况">-->
                    <!--<span>{{ row.material.usedType }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="提取日期">-->
                    <!--<span>{{  pareTime(row.material.extractTime) }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="提取人">-->
                    <!--<span>{{ row.material.extractName }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="物证名称">-->
                    <!--<span>{{ row.material.name }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="特征描述">-->
                    <!--<span>{{ row.material.note }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="是否转移">-->
                    <!--<span>{{ row.material.hasTransfered ? '是':'否' }}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item label="物证图片">-->
                    <!--<span>-->
                    <!--<el-image-->
                    <!--style="width: 100px; height: 100px"-->
                    <!--:src="row.material.imgUrl"-->
                    <!--fit="fit"></el-image>-->
                    <!--</span>-->
                    <!--</el-form-item>-->

                    <!--</el-form>-->

                    <el-form label-position="left" inline class="table-expand" v-else-if="row.fromStep === '痕检'">
                        <el-form-item label="任务号">
                            <span>{{ row.evidence.thirdEvidenceNo }}</span>
                        </el-form-item>

                        <el-form-item label="尸检号">
                            <span>{{ row.evidence.autopsyNo }}</span>
                        </el-form-item>
                        <el-form-item label="勘查开始">
                            <span>{{   pareTime(row.evidence.examBeginTime) }}</span>
                        </el-form-item>
                        <el-form-item label="勘查结束">
                            <span>{{  pareTime(row.evidence.examEndTime) }}</span>
                        </el-form-item>
                        <el-form-item label="发案开始">
                            <span>{{   pareTime(row.evidence.caseBeginTime)}}</span>
                        </el-form-item>
                        <el-form-item label="发案结束">
                            <span>{{  pareTime(row.evidence.caseEndTime) }}</span>
                        </el-form-item>
                        <el-form-item label="发案地点">
                            <span>{{ row.evidence.caseAddress }}</span>
                        </el-form-item>
                        <el-form-item label="案件类别">
                            <span>{{ row.evidence.caseCategory }}</span>
                        </el-form-item>
                        <el-form-item label="现场保护情况">
                            <span>{{ row.evidence.sceneProtect }}</span>
                        </el-form-item>
                        <el-form-item label="发案区划">
                            <span>{{ row.evidence.caseHappenRegion }}</span>
                        </el-form-item>
                        <el-form-item label="主办">
                            <span>{{ row.evidence.mainChargerName }}</span>
                        </el-form-item>
                        <el-form-item label="协办">
                            <span>{{ row.evidence.supporterName }}</span>
                        </el-form-item>
                        <el-form-item label="照相">
                            <span>{{ row.evidence.photographName }}</span>
                        </el-form-item>
                        <el-form-item label="录像">
                            <span>{{ row.evidence.cameraName }}</span>
                        </el-form-item>
                        <el-form-item label="法医">
                            <span>{{ row.evidence.medicalName }}</span>
                        </el-form-item>
                        <el-form-item label="现场保护民警">
                            <span>{{ row.evidence.sceneProtectUid }}</span>
                        </el-form-item>
                        <el-form-item label="处所">
                            <span>{{ row.evidence.sceneType }}</span>
                        </el-form-item>
                        <el-form-item label="作案时机">
                            <span>{{ row.evidence.crimeTime }}</span>
                        </el-form-item>
                        <el-form-item label="侵入方式">
                            <span>{{ row.evidence.invadeType }}</span>
                        </el-form-item>
                        <el-form-item label="作案出口">
                            <span>{{ row.evidence.escapeType }}</span>
                        </el-form-item>
                        <el-form-item label="作案人数">
                            <span>{{ row.evidence.crimePeoples }}</span>
                        </el-form-item>

                        <el-form-item label="作案工具">
                            <span>{{ row.evidence.crimeTools }}</span>
                        </el-form-item>

                        <el-form-item label="警情号">
                            <span>{{ row.evidence.instanceNo }}</span>
                        </el-form-item>

                        <el-form-item label="案件编号">
                            <span>{{ row.evidence.caseNo }}</span>
                        </el-form-item>

                        <el-form-item label="现勘号">
                            <span>{{ row.evidence.thirdEvidenceNo }}</span>
                        </el-form-item>

                        <el-form-item label="勘查号">
                            <span>{{ row.evidence.selfEvidenceNo }}</span>
                        </el-form-item>

                        <el-form-item label="作案过程">
                            <span>{{ row.evidence.crimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="是否有监控">
                            <span>{{ row.evidence.hasCamera ? '是':'否' }}</span>
                        </el-form-item>

                        <el-form-item label="是否十类案件">
                            <span>{{ row.evidence.isTenCase ? '是':'否'  }}</span>
                        </el-form-item>

                        <el-form-item label="是否死亡案件">
                            <span>{{ row.evidence.isDeathCase ? '是':'否'  }}</span>
                        </el-form-item>

                    </el-form>
                </template>

            </el-table-column>
            <el-table-column label="任务单号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务类型" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务详情" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>


            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" icon="el-icon-document-checked"
                               @click="handleAction(row,true)" v-if="row.status===1 && row.stepName === '物证入库'">
                        同意入库
                    </el-button>
                    <el-button type="warning" size="small" icon="el-icon-document-delete"
                               @click="handleAction(row,false)" v-if="row.status===1 && row.stepName === '物证入库'">
                        拒绝入库
                    </el-button>
                    <el-button type="primary" size="small" icon="el-icon-document-checked"
                               @click="handleAcceptTask(row)"
                               v-if="row.status===1 && row.stepName !== '痕检现勘' && row.stepName !== '物证入库'">
                        接收任务
                    </el-button>
                    <el-button type="primary" size="small" icon="el-icon-document-checked"
                               @click="handleAcceptTaskSeach(row)" v-if="row.status===1 && row.stepName === '痕检现勘'">
                        接收任务
                    </el-button>
                    <el-button type="success" size="small" icon="el-icon-tickets" @click="handleWriteResult(row)"
                               v-if="row.status===2 && row.stepName !== '痕检现勘' && row.stepName !== '物证入库' && row.stepName !== '接警'">
                        填写结果
                    </el-button>
                    <router-link :to="'/search/update-search/'+row.evidenceId"
                                 v-if="row.status===2 && row.stepName==='痕检现勘'">
                        <el-button icon="el-icon-edit" type="primary" size="small">编辑现勘</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>

        <!--<el-pagination-->
        <!--background-->
        <!--layout="prev, pager, next"-->
        <!--:page-count="pages"-->
        <!--:current-page.sync="listQuery.page"-->
        <!--@current-change="getList"-->
        <!--@size-change="getList"-->
        <!--&gt;-->
        <!--</el-pagination>-->
        <el-dialog title="接受任务" :close-on-click-modal="false" :visible.sync="dialogFormAccept" width="50%">
            <el-form
                    ref="acceptTaskFrom"
                    :model="acceptTaskFrom"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">

                <el-form-item label="送检单位" prop="name">
                    <el-input v-model="acceptTaskFrom.requireOrg"/>
                </el-form-item>


                <el-form-item label="送检时间" prop="sort">
                    <el-date-picker
                            v-model="acceptTaskFrom.requireTime"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width: 100%"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAccept = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="acceptTask()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="填写结果" :close-on-click-modal="false" :visible.sync="dialogResultFrom" width="50%">
            <el-form
                    ref="ResultFrom"
                    :model="ResultFrom"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">
                <div v-if="isDNA">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="移交人" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="移交日期" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="简要案情" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="鉴定文书号" prop="name">

                            </el-form-item>
                        </el-col>
                    </el-row>

                </div>
                <div v-if="isForensic">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="移交人" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="死者名字" prop="name">

                            </el-form-item>
                        </el-col>

                    <el-col :span="12">
                        <el-form-item label="简要案情" prop="name">

                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="尸检号" prop="name">

                        </el-form-item>
                    </el-col>
                    </el-row>
                </div>
                <div v-if="isFinger">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="移交人" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="移交日期" prop="name">

                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="鉴定文书号" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="比中嫌疑人" prop="name">

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="简要案情" prop="name">

                    </el-form-item>
                </div>
                <div v-if="isElectron">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="移交人" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="移交日期" prop="name">

                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="鉴定文书号" prop="name">

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="简要案情" prop="name">

                            </el-form-item>
                        </el-col>
                    </el-row>

                </div>
                <el-divider></el-divider>
               <!-- <el-divider content-position="left">检验信息</el-divider>
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
                <el-form-item label="检验结果" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="比中时间" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>

                <el-col :span="12">
                <el-form-item label="姓名" prop="name">
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
                <el-form-item label="户籍地址" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>

                </el-row>
                <el-divider content-position="left">物证信息</el-divider>
                <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="物证名称" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="提取方法" prop="name">
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

                <el-col :span="12">
                <el-form-item label="可靠程度" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="利用情况" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>

                </el-row>
                <el-divider content-position="left">案件信息</el-divider>
                <el-row :gutter="20">
                <el-col :span="12">
                <el-form-item label="物证名称" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="提取方法" prop="name">
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

                <el-col :span="12">
                <el-form-item label="可靠程度" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                <el-form-item label="利用情况" prop="name">
                <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                </el-col>

                </el-row>-->
                <el-form-item label="检测结果" prop="name">
                    <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                <el-form-item label="文书号" prop="name">
                    <el-input v-model="ResultFrom.documentNo"/>
                </el-form-item>
                <el-form-item label="利用情况" prop="usedType">
                    <el-select v-model="ResultFrom.usedType" placeholder="请选择">
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
                </el-form-item>
                <div v-if="isForensic">
                    <el-form-item label="委托单位" prop="delegateOrg">
                        <el-input v-model="ResultFrom.delegateOrg"/>
                    </el-form-item>
                    <el-form-item label="委托人" prop="delegateName">
                        <el-input v-model="ResultFrom.delegateName"/>
                    </el-form-item>
                    <el-form-item label="简要案情" prop="digest">
                        <el-input v-model="ResultFrom.digest"/>
                    </el-form-item>
                    <el-form-item label="死者情况" prop="deathDetail">
                        <el-input v-model="ResultFrom.deathDetail"/>
                    </el-form-item>
                    <el-form-item label="委托目的" prop="delegateReason">
                        <el-input v-model="ResultFrom.delegateReason"/>
                    </el-form-item>
                    <el-form-item label="鉴定结论" prop="conclusion">
                        <el-input v-model="ResultFrom.conclusion"/>
                    </el-form-item>
                    <el-form-item label="鉴定人" prop="examName">
                        <el-input v-model="ResultFrom.examName"/>
                    </el-form-item>
                    <el-form-item label="协办" prop="supportName">
                        <el-input v-model="ResultFrom.supportName"/>
                    </el-form-item>
                    <el-form-item label="案件类别" prop="caseCategory">
                        <el-cascader
                                :options="caseCategoryList"
                                filterable
                                @change="countDict"
                                v-model="ResultFrom.caseCategory"
                                :filter-method="remoteSearch"
                                :show-all-levels="false"
                                placeholder="案件类别"
                                style="width: 100%;">
                        </el-cascader>

                    </el-form-item>
                    <el-form-item label="是否移交" prop="hasTransfered">
                        <el-checkbox v-model="ResultFrom.hasTransfered"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="文书发放" prop="hasTransfered">
                        <el-checkbox v-model="ResultFrom.hasTransfered"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="备注栏" prop="deathDetail">
                        <el-input v-model="ResultFrom.deathDetail" type="textarea"
                                  :autosize="{ minRows: 2, maxRows: 4}"/>
                    </el-form-item>
                </div>

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
<style scoped>
    .el-table >>> .el-table__expanded-cell[class*="cell"] {
        background-color: #f0f0f0 !important;
    }

    .table-expand {
        font-size: 0;

    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-row {
        margin-bottom: 20px;
    }

</style>


<script>
    import {accetpTask, taskList, writeResult} from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'

    export default {
        name: "Backlog",
        filters: {

            statusFilter(status) {
                const statusMap = {
                    1: '未领取',
                    2: '进行中',
                    3: '已完成'
                }
                return statusMap[status]
            }
        },
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
                list: [],
                tableKey: 0,
                listLoading: false,
                dialogFormAccept: false,
                acceptTaskFrom: {
                    stepId: '',
                    requireOrg: '',
                    requireTime: '',
                },
                dialogResultFrom: false,
                isForensic: false,
                isDNA: false,
                isFinger: false,
                isElectron: false,
                ResultFrom: {
                    id: '',
                    stepId: '',
                    result: '',
                    documentNo: '',
                    documentDate: '',
                    delegateOrg: '',
                    delegateName: '',
                    digest: '',
                    deathDetail: '',
                    delegateReason: '',
                    conclusion: '',
                    examName: '',
                    supportName: '',
                    caseCategory: '',
                    hasTransfered: '',
                    needToPushToCharger: '',
                    usedType: '',
                },
                caseCategoryList: [],


            }
        },
        created() {
            this.getList();
            this.search('案件类别').then(response => {
                this.caseCategoryList = this.processData(response.list)
            });
        },
        methods: {
            handleAction(val, type) {
                const sendData = {
                    stepId: val.id,
                    agree: type,
                };
                accetpTask(sendData).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
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
            countDict(val) {
                val = val.slice(-1)[0]
                const send = {
                    name: val
                };
                this.$store.dispatch('PostUserUseDict', send)
            },
            pareTime(time) {
                if (time) {
                    return this.formatDate(time * 1000)
                } else {
                    return ''
                }
            },
            formatDate(now) {
                var time = new Date(now)
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            getList() {
                this.listLoading = true;
                const data = {
                    status: 1
                }
                taskList(data).then(response => {
                    this.list = response.list
                    // this.pages = response.pages

                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
            },
            search(parentName, filter = null) {
                return new Promise((resolve, reject) => {
                    const data = {
                        filter: filter,
                        parentName: parentName
                    }
                    resolve(fetchList(data))
                })
            },
            remoteSearch(node, value) {
                var p = /^[a-zA-Z]+$/;
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1)
                        return true
                } else {
                    if (node.data.label.indexOf(value) > -1)
                        return true
                }
            },
            processData(data) {
                return data.map(item => {
                    var sendData = {
                        value: item.name,
                        label: item.name,
                        py: item.pinyinAbbr
                    }
                    if (item.children.length > 0) {
                        sendData.children = this.processData(item.children)
                    }

                    return sendData
                })
            },
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        return true
                    }
                } else {
                    if (node.data.label.indexOf(value) > -1) {
                        return true
                    }
                }
            },
            handleWriteResult(task) {
                this.dialogResultFrom = true;
                if (task.stepName === '法医现勘') {
                    this.isForensic = true
                    this.ResultFrom.caseCategory = task.evidence.caseCategory
                    this.ResultFrom.selfEvidenceNo = task.evidence.selfEvidenceNo
                    this.ResultFrom.caseCategory = task.evidence.caseCategory
                    this.ResultFrom.caseCategory = task.evidence.caseCategory
                } else {
                    this.isForensic = false
                }
                this.ResultFrom.stepId = task.id
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

            handleAcceptTaskSeach(task) {
                let data = this.acceptTaskFrom;
                data.stepId = task.id
                accetpTask(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
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
            handleAcceptTask(task) {
                this.dialogFormAccept = true;
                this.acceptTaskFrom.stepId = task.id
                if (task) {

                }
            },
            acceptTask() {
                let data = this.acceptTaskFrom;
                if (data.requireTime.toString().length > 10)
                    data.requireTime = parseInt(data.requireTime / 1000);
                accetpTask(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogFormAccept = false;
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
        }
    }
</script>
