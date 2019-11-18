<template>
        <div >
            <el-form
                    ref="listForm"
                    :rules="listRules"
                    :model="list"
                    label-position="left"
                    label-width="120px"
                    style="display: flex;"
            >
                <div style="width: 700px;margin-left: 150px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="勘查开始" prop="examBeginTime">
                                <el-date-picker
                                        v-model="list.examBeginTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="勘查结束" prop="examEndTime">
                                <el-date-picker
                                        v-model="list.examEndTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="案件开始" prop="caseBeginTime">
                                <el-date-picker
                                        v-model="list.caseBeginTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件结束" prop="caseEndTime">
                                <el-date-picker
                                        v-model="list.caseEndTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="发案日期" prop="caseHappenTime">
                                <el-date-picker
                                        v-model="list.caseHappenTime"
                                        type="date"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发案区划" prop="caseHappenRegion">
                                <el-input v-model="list.caseHappenRegion"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="现场保护情况" prop="sceneProtect">
                                <el-select v-model="list.sceneProtect" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in sceneProtectType"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件类型 " prop="caseType">
                                <el-input v-model="list.caseType"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="当事人">
                        <el-button type="primary" size="mini" @click="dialogConcernedPersonListForm=true">添加当事人</el-button>
                        <el-table
                                :data="list.concernedPersonList"
                                height="250"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    label="名字"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="idType"
                                    label="证件类型"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.idType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="idNo"
                                    label="证件号">
                                <template slot-scope="{row}">
                                    <span>{{ row.idNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="sex"
                                    label="性别">
                                <template slot-scope="{row}">
                                    <span>{{ row.sex }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="contactNumber"
                                    label="联系电话">
                                <template slot-scope="{row}">
                                    <span>{{ row.contactNumber }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="residence"
                                    label="常住地址">
                                <template slot-scope="{row}">
                                    <span>{{ row.residence }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="huji"
                                    label="户籍">
                                <template slot-scope="{row}">
                                    <span>{{ row.huji }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="registerName"
                                    label="登记人">
                                <template slot-scope="{row}">
                                    <span>{{ row.registerName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="150">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEditConcernedPersonListForm(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDeleteConcernedPersonListForm(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="损失情况">
                        <el-button type="primary" size="mini" @click="dialogLostDetailListForm=true">添加损失情况</el-button>
                        <el-table
                                :data="list.lostDetailList"
                                height="250"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="name"
                                    label="名字"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.name }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="model"
                                    label="型号"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.model }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="feather"
                                    label="特征">
                                <template slot-scope="{row}">
                                    <span>{{ row.feather }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    label="价值">
                                <template slot-scope="{row}">
                                    <span>{{ row.value }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="amount"
                                    label="数量">
                                <template slot-scope="{row}">
                                    <span>{{ row.amount }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="regName"
                                    label="登记人">
                                <template slot-scope="{row}">
                                    <span>{{ row.regName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="150">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEditLostDetailListForm(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDeleteLostDetailListForm(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="主办" prop="mainChargerUid">
                                <el-select v-model="list.mainChargerUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="协办 " prop="supporterUid">

                                <el-select v-model="list.supporterUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="照相员" prop="photographUid">

                                <el-select v-model="list.photographUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="录像员" prop="cameraUid">
                                <el-select v-model="list.cameraUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="法医" prop="medicalUid">
                                <el-select v-model="list.medicalUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="现场保护民警 " prop="sceneProtectUid">
                                <el-select v-model="list.sceneProtectUid" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in userList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="是否有监控" prop="hasCamera">
                        <el-checkbox v-model="list.hasCamera"></el-checkbox>
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="处所" prop="sceneType">
                                <el-input v-model="list.sceneType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作案时机" prop="crimeTime">
                                <el-date-picker
                                        v-model="list.crimeTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="侵入方式" prop="invadeType">
                                <el-input v-model="list.invadeType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作案出口" prop="escapeType">
                                <el-input v-model="list.escapeType"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="作案人数" prop="crimePeoples">
                                <el-select v-model="list.crimePeoples" placeholder="请选择" center>
                                    <el-option
                                            v-for="item in crimePeoplesType"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作案工具" prop="crimeTools">
                                <el-input v-model="list.crimeTools"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="作案过程" prop="crimeDetail">
                        <el-input v-model="list.crimeDetail" type="textarea"/>
                    </el-form-item>
                    <el-form-item label="是否十类案件" prop="isTenCase">
                        <el-checkbox v-model="list.isTenCase"></el-checkbox>
                    </el-form-item>
                    <el-form-item label="是否死亡案件" prop="isDeathCase">
                        <el-checkbox v-model="list.isDeathCase"></el-checkbox>
                    </el-form-item>
                </div>

                <div style="width: 700px;margin-left: 30px">
                    <el-divider>物证信息</el-divider>
                    <el-form-item label-width="auto">
                        <el-button type="primary" size="mini" @click="dialogMaterialListForm=true">添加物证</el-button>
                        <el-table
                                :data="list.materialList"
                                height="250"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="materialNo"
                                    label="物证编码"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.materialNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="thirdMaterialNo"
                                    label="物证库编号"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.thirdMaterialNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="materialCategory"
                                    label="物证类别">
                                <template slot-scope="{row}">
                                    <span>{{ row.materialCategory }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="materialType"
                                    label="物证类型">
                                <template slot-scope="{row}">
                                    <span>{{ row.materialType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="extractTime"
                                    label="提取日期">
                                <template slot-scope="{row}">
                                    <span>{{ row.extractTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="extractMethod"
                                    label="提取方法">
                                <template slot-scope="{row}">
                                    <span>{{ row.extractMethod }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="extractUid"
                                    label="提取人">
                                <template slot-scope="{row}">
                                    <span>{{ row.extractUid }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="150">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEditMaterialListForm(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDeleteMaterialListForm(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label-width="auto">
                        <el-button type="primary" size="mini" @click="dialogdocumentListForm=true">添加文书</el-button>
                        <el-table
                                :data="list.documentList"
                                height="250"
                                border
                                style="width: 100%">
                            <el-table-column
                                    prop="documentSeqNo"
                                    label="文书编号"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.documentSeqNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="documentNo"
                                    label="文书号"
                            >
                                <template slot-scope="{row}">
                                    <span>{{ row.documentNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="documentType"
                                    label="文书种类">
                                <template slot-scope="{row}">
                                    <span>{{ row.documentType }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="materialName"
                                    label="关联物证名称">
                                <template slot-scope="{row}">
                                    <span>{{ row.materialName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="evidenceNo"
                                    label="关联勘查号">
                                <template slot-scope="{row}">
                                    <span>{{ row.evidenceNo }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="submitUid"
                                    label="提交人">
                                <template slot-scope="{row}">
                                    <span>{{ row.submitUid }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="reliabilityLevel"
                                    label="可靠程度">
                                <template slot-scope="{row}">
                                    <span>{{ row.regName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="hasPutInStorage"
                                    label="是否入库">
                                <template slot-scope="{row}">
                                    <span>{{ row.hasPutInStorage }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="hasTransfered"
                                    label="是否移交">
                                <template slot-scope="{row}">
                                    <span>{{ row.hasTransfered }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" width="150">
                                <template slot-scope="scope">
                                    <el-button
                                            size="mini"
                                            @click="handleEditdocumentListForm(scope.$index, scope.row)">编辑</el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            @click="handleDeletedocumentListForm(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>

                    </el-form-item>

                    <div class="action" v-if="showNext&&lastStep">
                        <el-button type="primary" style="float: right" @click="addSearch(lastStep&& !is_detail)">下一个步骤</el-button>
                    </div>

                    <div class="action" v-if="showNext&&!lastStep">
                        <el-button type="primary" style="float: right" @click="addSearch(lastStep)">保存</el-button>
                    </div>
                </div>
            </el-form>

            <el-dialog title="添加损失情况" :visible.sync="dialogLostDetailListForm" width="30%">
                <el-form
                        ref="lostDetailListForm"
                        :rules="lostDetailListFormRules"
                        :model="lostDetailListForm"
                        label-position="left"
                        label-width="100px"
                        style="width: 400px; margin-left:50px;">

                    <el-form-item label="名字" prop="name">
                        <el-input v-model="lostDetailListForm.name"/>
                    </el-form-item>
                    <el-form-item label="型号" prop="model">
                        <el-input v-model="lostDetailListForm.model"/>
                    </el-form-item>
                    <el-form-item label="特征" prop="feather">
                        <el-input v-model="lostDetailListForm.feather"/>
                    </el-form-item>
                    <el-form-item label="价值" prop="value">
                        <el-input v-model="lostDetailListForm.value"/>
                    </el-form-item>
                    <el-form-item label="数量" prop="amount">
                        <el-input v-model="lostDetailListForm.amount"/>
                    </el-form-item>
                    <el-form-item label="登记人" prop="regName">
                        <el-input v-model="lostDetailListForm.regName"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogLostDetailListForm = false">
                        取 消
                    </el-button>
                    <el-button type="primary" @click="dialogLostDetailListFormMethod=== 'add'?addLostDetailListForm():updateLostDetailListForm()">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog title="添加当事人" :visible.sync="dialogConcernedPersonListForm" width="30%">
                <el-form
                        ref="concernedPersonListForm"
                        :rules="concernedPersonListFormRules"
                        :model="concernedPersonListForm"
                        label-position="left"
                        label-width="100px"
                        style="width: 400px; margin-left:50px;">

                    <el-form-item label="名字" prop="name">
                        <el-input v-model="concernedPersonListForm.name"/>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="idType">
                        <el-select v-model="concernedPersonListForm.idType" placeholder="请选择" center>
                            <el-option
                                    v-for="item in idType"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号" prop="idNo">
                        <el-input v-model="concernedPersonListForm.idNo"/>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="concernedPersonListForm.sex" placeholder="请选择" center>
                            <el-option
                                    v-for="item in sex"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>
                        <el-input v-model="concernedPersonListForm.sex"/>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="contactNumber">
                        <el-input v-model="concernedPersonListForm.contactNumber"/>
                    </el-form-item>
                    <el-form-item label="常住地址" prop="residence">
                        <el-input v-model="concernedPersonListForm.residence"/>
                    </el-form-item>
                    <el-form-item label="户籍" prop="huji">
                        <el-input v-model="concernedPersonListForm.huji"/>
                    </el-form-item>
                    <el-form-item label="登记人" prop="registerName">
                        <el-input v-model="concernedPersonListForm.registerName"/>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogConcernedPersonListForm = false">
                        取 消
                    </el-button>
                    <el-button type="primary" @click="dialogConcernedPersonListFormMethod==='add'?addConcernedPersonListForm():updateConcernedPersonListForm()">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog title="添加物证" :visible.sync="dialogMaterialListForm" width="30%">
                <el-form
                        ref="materialListForm"
                        :rules="materialListFormRules"
                        :model="materialListForm"
                        label-position="left"
                        label-width="100px"
                        style="width: 400px; margin-left:50px;">

                    <el-form-item label="物证编码" prop="materialNo">
                        <el-input v-model="materialListForm.materialNo"/>
                    </el-form-item>
                    <el-form-item label="物证库编号" prop="thirdMaterialNo">
                        <el-input v-model="materialListForm.thirdMaterialNo"/>
                    </el-form-item>
                    <el-form-item label="物证类别" prop="materialCategory">
                        <el-input v-model="materialListForm.materialCategory"/>
                    </el-form-item>
                    <el-form-item label="物证类型" prop="materialType">
                        <el-select v-model="materialListForm.materialType" placeholder="请选择" center>
                            <el-option
                                    v-for="item in materialType"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="提取日期" prop="extractTime">
                        <el-input v-model="materialListForm.extractTime"/>
                    </el-form-item>
                    <el-form-item label="提取方法" prop="extractMethod">
                        <el-input v-model="materialListForm.extractMethod"/>
                    </el-form-item>
                    <el-form-item label="提取人" prop="extractUid">
                        <el-select v-model="documentListForm.extractUid" placeholder="请选择" center>
                            <el-option
                                    v-for="item in userList"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogMaterialListForm = false">
                        取 消
                    </el-button>
                    <el-button type="primary" @click="dialogMaterialListFormMethod === 'add'?addMaterialListForm():updateMaterialListForm()">
                        确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog title="添加文书" :visible.sync="dialogdocumentListForm" width="30%">
                <el-form
                        ref="documentListForm"
                        :rules="documentListFormRules"
                        :model="documentListForm"
                        label-position="left"
                        label-width="100px"
                        style="width: 400px; margin-left:50px;">

                    <el-form-item label="文书编号" prop="documentSeqNo">
                        <el-input v-model="documentListForm.documentSeqNo"/>
                    </el-form-item>
                    <el-form-item label="文书号" prop="documentNo">
                        <el-input v-model="documentListForm.documentNo"/>
                    </el-form-item>
                    <el-form-item label="文书类型" prop="documentType">
                        <el-select v-model="concernedPersonListForm.idType" placeholder="请选择" center>
                            <el-option
                                    v-for="item in idType"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>
                        <el-input v-model="documentListForm.documentType"/>
                    </el-form-item>
                    <el-form-item label="关联物证名称" prop="materialName">
                        <el-input v-model="documentListForm.materialName"/>
                    </el-form-item>
                    <el-form-item label="关联勘查号" prop="evidenceNo">
                        <el-input v-model="documentListForm.evidenceNo"/>
                    </el-form-item>
                    <el-form-item label="可靠程度" prop="reliabilityLevel">
                        <el-input v-model="documentListForm.reliabilityLevel"/>
                    </el-form-item>
                    <el-form-item label="是否已入库" prop="hasPutInStorage">
                        <el-input v-model="documentListForm.hasPutInStorage"/>
                    </el-form-item>
                    <el-form-item label="是否已转交·" prop="hasTransfered">
                        <el-input v-model="documentListForm.hasTransfered"/>
                    </el-form-item>
                    <el-form-item label="提交人" prop="submitUid">
                        <el-select v-model="documentListForm.submitUid" placeholder="请选择" center>
                            <el-option
                                    v-for="item in userList"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"/>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogdocumentListForm = false">
                        取 消
                    </el-button>
                    <el-button type="primary" @click="dialogdocumentListFormMethod === 'add'?adddocumentListForm():updatedocumentListForm()">
                        确 定
                    </el-button>
                </div>
            </el-dialog>


        </div>

</template>

<script>
    import { fetchList,fetchTask,createTask,updateTask,nextTask,groupList } from '@/api/task'
    import {  createSearch }  from '@/api/search'
    import { fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: "addSearch",
        props: {
            parentId: {
                type: Number,
                default: 0
            },
            is_detail: {
                type: Boolean,
                default: false
            },
            detailData: {
                type: Object,
                default: {}
            }
        },
        data(){
            return {
                sceneProtectType:[
                    {
                        id:1,
                        title:'未移动',
                    }, {
                        id:2,
                        title:'已复原',
                    },{
                        id:3,
                        title:'不明显',
                    },{
                        id:4,
                        title:'一般' ,
                    },{
                        id:5,
                        title:'混乱',
                    },{
                        id:6,
                        title:'其他',
                    },
                ],
                crimePeoplesType:[
                    {
                        id:0,
                        title:'不确定',
                    }, {
                        id:1,
                        title:'1人',
                    }, {
                        id:2,
                        title:'两个',
                    },{
                        id:3,
                        title:'多人',
                    }
                ],
                idType:[
                    {
                        id:1,
                        title:'身份证',
                    }, {
                        id:2,
                        title:'护照',
                    }, {
                        id:3,
                        title:'军人证',
                    },{
                        id:4,
                        title:'学生证',
                    }
                ],
                sex:[
                    {
                        id:0,
                        title:'未知',
                    }, {
                        id:1,
                        title:'男',
                    }, {
                        id:2,
                        title:'女',
                    }
                ],
                documentType:[
                    {
                        id:1,
                        title:'DNA鉴定书',
                    }, {
                        id:2,
                        title:'指纹鉴定书',
                    }, {
                        id:3,
                        title:'理化鉴定书',
                    },{
                        id:4,
                        title:'其他鉴定书',
                    },
                ],
                materialType:[
                    {
                        id:1,
                        title:'指纹印',
                    }, {
                        id:2,
                        title:'DNA',
                    }, {
                        id:3,
                        title:'鞋印',
                    },{
                        id:4,
                        title:'工痕',
                    },{
                        id:4,
                        title:'微量物证',
                    },
                ],
                list:{
                    id:'',
                    caseId:'',
                    examBeginTime:'',
                    examEndTime:'',
                    caseBeginTime:'',
                    caseEndTime:'',
                    caseHappenTime:'',
                    caseHappenRegion:'',
                    sceneProtect:'',
                    caseType:'',
                    mainChargerUid:'',
                    supporterUid:'',
                    photographUid:'',
                    cameraUid:'',
                    medicalUid:'',
                    sceneProtectUid:'',
                    hasCamera:'',
                    isTenCase:'',
                    isDeathCase:'',
                    sceneType:'',
                    crimeTime:'',
                    invadeType:'',
                    escapeType:'',
                    crimeTools:'',
                    crimeDetail:'',
                    crimePeoples:'',
                    lostDetailList:[],
                    concernedPersonList:[],
                    materialList:[],
                    documentList:[],

                },
                listRules:{},
                lostDetailListFormRules:{},
                concernedPersonListFormRules:{},
                materialListFormRules:{},
                documentListFormRules:{},

                dialogLostDetailListForm:false,
                dialogConcernedPersonListForm:false,
                dialogMaterialListForm:false,
                dialogdocumentListForm:false,

                dialogLostDetailListFormMethod:'add',
                dialogConcernedPersonListFormMethod:'add',
                dialogMaterialListFormMethod:'add',
                dialogdocumentListFormMethod:'add',

                dialogLostDetailListFormIndex:'',
                dialogConcernedPersonListFormIndex:'',
                dialogMaterialListFormIndex:'',
                dialogdocumentListFormIndex:'',

                dialogAlarmGroup:false,
                lostDetailListForm:{
                    id:'',
                    name:'',
                    model:'',
                    feather:'',
                    value:'',
                    amount:'',
                    regName:'',
                },
                concernedPersonListForm:{
                    id:'',
                    name:'',
                    idType:'',
                    idNo:'',
                    sex:'',
                    contactNumber:'',
                    residence:'',
                    huji:'',
                    registerName:'',
                },
                materialListForm:{
                    id:'',
                    name:'',
                    materialNo:'',
                    thirdMaterialNo:'',
                    materialCategory:'',
                    materialType:'',
                    extractTime:'',
                    extractMethod:'',
                    extractUid:'',
                },
                documentListForm:{
                    id:'',
                    name:'',
                    documentSeqNo:'',
                    documentNo:'',
                    documentType:'',
                    materialName:'',
                    evidenceNo:'',
                    submitUid:'',
                    reliabilityLevel:'',
                    hasPutInStorage:'',
                    hasTransfered:'',
                },
                groupList: [],
                userList: [],
                next: '',
                showNext: true,
                lastStep:true,
            }
        },
        created() {
            if (this.is_detail) {
                if (this.detailData.currentUserId !== this.detailData.stepHanlderUid){
                    this.showNext=false;
                }
                this.lastStep = this.detailData.isLast;
                this.list = Object.assign({}, this.detailData)// copy obj
            }
            this.getGroup()
            this.getUserList()
        },
        methods:{
            getGroup() {
                groupList({}).then(response => {
                    this.groupList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.groupName
                        }
                    })
                })
            },
            getUserList(){
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName
                        }
                    })
                })
            },
            resetLostDetailListForm() {
                this.lostDetailListForm={
                    name:'',
                    model:'',
                    feather:'',
                    value:'',
                    amount:'',
                    regName:'',
                }
                this.dialogLostDetailListFormMethod='add'
                this.dialogLostDetailListFormIndex=''
            },
            addLostDetailListForm(){
                this.list.lostDetailList.push(this.lostDetailListForm);
                this.dialogLostDetailListForm = false;
                this.resetLostDetailListForm();
            },
            handleEditLostDetailListForm(index, row){
                this.lostDetailListForm = Object.assign({}, row) // copy obj
                this.dialogLostDetailListFormIndex = index;
                this.dialogLostDetailListFormMethod = 'edit';
                this.dialogLostDetailListForm = true;

            },
            updateLostDetailListForm(){
                var temp =  Object.assign({}, this.lostDetailListForm)// copy obj
                this.list.lostDetailList.splice(this.dialogLostDetailListFormIndex,1, temp)
                this.dialogLostDetailListForm = false;
                this.resetLostDetailListForm();
            },
            handleDeleteLostDetailListForm(index, row){
                this.list.lostDetailList.splice(index, 1);
            },

            resetConcernedPersonListForm() {
                this.concernedPersonListForm={
                    name:'',
                    idType:'',
                    idNo:'',
                    sex:'',
                    contactNumber:'',
                    residence:'',
                    huji:'',
                    registerName:'',
                }
                this.dialogConcernedPersonListFormMethod = 'add';
                this.dialogConcernedPersonListFormIndex = '';
            },
            addConcernedPersonListForm(){

                this.list.concernedPersonList.push(this.concernedPersonListForm);
                this.dialogConcernedPersonListForm = false;
                this.resetConcernedPersonListForm();
            },
            handleEditConcernedPersonListForm(index, row){
                this.concernedPersonListForm = Object.assign({}, row) // copy obj
                this.dialogConcernedPersonListFormMethod = 'edit';
                this.dialogConcernedPersonListFormIndex = index;
                this.dialogConcernedPersonListForm = true;

            },
            updateConcernedPersonListForm(){
                var temp =  Object.assign({}, this.concernedPersonListForm)// copy obj
                this.list.concernedPersonList.splice(this.dialogConcernedPersonListFormIndex,1, temp)
                this.dialogConcernedPersonListForm = false;
                this.resetConcernedPersonListForm();
            },
            handleDeleteConcernedPersonListForm(index, row){
                this.list.concernedPersonList.splice(index, 1);
            },

            resetMaterialListForm() {
                this.materialListForm={
                    name:'',
                    materialNo:'',
                    thirdMaterialNo:'',
                    materialCategory:'',
                    materialType:'',
                    extractTime:'',
                    extractMethod:'',
                    extractUid:'',
                }
                this.dialogMaterialListFormMethod='add'
                this.dialogMaterialListFormIndex=''
            },
            addMaterialListForm(){
                this.list.materialList.push(this.materialListForm);
                this.dialogMaterialListForm = false;
                this.resetMaterialListForm();
            },
            handleEditMaterialListForm(index, row){
                this.materialListForm = Object.assign({}, row) // copy obj
                this.dialogMaterialListFormIndex = index;
                this.dialogMaterialListFormMethod = 'edit';
                this.dialogMaterialListForm = true;

            },
            updateMaterialListForm(){
                var temp =  Object.assign({}, this.materialListForm)// copy obj
                this.list.materialList.splice(this.dialogMaterialListFormIndex,1, temp)

                this.dialogMaterialListForm = false;
                this.resetMaterialListForm();
            },
            handleDeleteMaterialListForm(index, row){
                this.list.materialList.splice(index, 1);
            },

            resetdocumentListForm() {
                this.documentListForm={
                    name:'',
                    documentSeqNo:'',
                    documentNo:'',
                    documentType:'',
                    materialName:'',
                    evidenceNo:'',
                    submitUid:'',
                    reliabilityLevel:'',
                    hasPutInStorage:'',
                    hasTransfered:'',
                }
                this.dialogdocumentListFormMethod='add'
                this.dialogdocumentListFormIndex=''
            },
            adddocumentListForm(){
                this.list.documentList.push(this.documentListForm);
                this.dialogdocumentListForm = false;
                this.resetdocumentListForm();
            },
            handleEditdocumentListForm(index, row){
                this.documentListForm = Object.assign({}, row) // copy obj
                this.dialogdocumentListFormIndex = index;
                this.dialogdocumentListFormMethod = 'edit';
                this.dialogdocumentListForm = true;

            },
            updatedocumentListForm(){
                var temp =  Object.assign({}, this.documentListForm)// copy obj
                this.list.documentList.splice(this.dialogdocumentListFormIndex,1, temp)
                this.dialogdocumentListForm = false;
                this.resetdocumentListForm();
            },
            handleDeletedocumentListForm(index, row){
                this.list.documentList.splice(index, 1);
            },
            addSearch(){
                this.$refs.listForm.validate(valid => {
                    if (valid) {
                            this.list.caseId = this.parentId;
                            this.list.examBeginTime = this.list.examBeginTime/1000;
                            this.list.examEndTime = this.list.examEndTime/1000;
                            this.list.caseBeginTime = this.list.caseBeginTime/1000;
                            this.list.caseEndTime = this.list.caseEndTime/1000;
                            this.list.caseHappenTime = this.list.caseHappenTime/1000;
                            this.list.crimeTime = this.list.crimeTime/1000;
                            createSearch(this.list).then(response => {
                                if (response.code === 200) {
                                    this.$parent.setTaskStep(response.id);
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 2000
                                    })
                                }else{
                                    this.$message({
                                        message: response.reason,
                                        type: 'success',
                                        showClose: true,
                                        duration: 2000
                                    })
                                }
                            })
                        }
                })
            },
        }
    }
</script>

<style scoped>
    .main {
        width: 100%;
        margin-top: 100px;
    }

    .action {
        width: 600px;
        margin: auto;
    }
</style>