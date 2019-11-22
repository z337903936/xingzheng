<template>
    <div class="app-container">
        <el-form
                ref="listForm"
                :rules="listRules"
                :model="list"
                label-position="left"
                label-width="120px"
                style="width: 50%;margin: auto;padding-bottom: 20px"
        >
            <el-divider>痕检信息</el-divider>
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
            <el-form-item label="发案地点" prop="crimeTools">
                <el-input v-model="list.caseAddress"/>
            </el-form-item>
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
                            <el-cascader
                                    :options="caseHappenRegionList"
                                    filterable
                                    v-model="list.caseHappenRegion"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
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
                        <el-form-item label="案件类别" prop="caseType">
                            <el-cascader
                                    :options="caseTypeList"
                                    filterable
                                    v-model="list.caseType"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="主办" prop="mainChargerUid">
                            <el-select v-model="list.mainChargerUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="协办 " prop="supporterUid">

                            <el-select v-model="list.supporterUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
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

                            <el-select v-model="list.photographUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="录像员" prop="cameraUid">
                            <el-select v-model="list.cameraUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
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
                            <el-select v-model="list.medicalUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="现场保护民警 " prop="sceneProtectUid">
                            <el-select v-model="list.sceneProtectUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       placeholder="请选择" center>
                                <el-option
                                        v-for="item in userShowList"
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
                            <el-cascader
                                    :options="sceneTypeList"
                                    filterable
                                    v-model="list.sceneType"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="作案时机" prop="crimeTime">
                            <el-cascader
                                    :options="crimeTimeList"
                                    filterable
                                    v-model="list.crimeTime"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="侵入方式" prop="invadeType">
                            <el-cascader
                                    :options="invadeTypeList"
                                    filterable
                                    v-model="list.invadeType"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="作案出口" prop="escapeType">

                            <el-cascader
                                    :options="escapeTypeList"
                                    filterable
                                    v-model="list.escapeType"
                                    :filter-method="filterSearch"
                                    :show-all-levels="false">
                            </el-cascader>
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

            <el-form-item label-width="auto">
                <el-button type="primary" size="mini" @click="dialogConcernedPersonListForm=true">添加当事人</el-button>
                <el-table
                        :data="list.concernedPersonList"
                        height="200"
                        border
                        max-height="200"
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
                            <span>{{ row.idTypeShow }}</span>
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
                            <span>{{ row.sexShow }}</span>
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
                                    @click="handleEditConcernedPersonListForm(scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDeleteConcernedPersonListForm(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label-width="auto">
                <el-button type="primary" size="mini" @click="dialogLostDetailListForm=true">添加损失情况</el-button>
                <el-table
                        :data="list.lostDetailList"
                        height="200"
                        border
                        max-height="200"
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
                                    @click="handleEditLostDetailListForm( scope.row)">编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDeleteLostDetailListForm(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>



                <el-divider>物证信息</el-divider>
                <el-form-item label-width="auto">
                    <el-button type="primary" size="mini" @click="dialogMaterialListForm=true">添加物证</el-button>
                    <el-table
                            :data="list.materialList"
                            height="200"
                            border
                            max-height="200"
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
                                <span>{{ row.materialTypeShow }}</span>
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
                                <span>{{ row.extractUidShow }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="150">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        @click="handleEditMaterialListForm( scope.row)">编辑</el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDeleteMaterialListForm( scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            <el-form-item style="margin-bottom: 40px;text-align: center;" label-width="auto">

                <el-button type="primary" style="width: 200px"  @click="updateSearch()">保存</el-button>

            </el-form-item>




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
                    <el-cascader
                            :options="idTypeList"
                            filterable
                            v-model="concernedPersonListForm.idType"
                            :filter-method="filterSearch"
                            :show-all-levels="false">
                    </el-cascader>

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
                    <el-select v-model="materialListForm.extractUid"
                               filterable
                               :filter-method="filterUserSearch"
                               @visible-change="restUserSearch"
                               placeholder="请选择" center>
                        <el-option
                                v-for="item in userShowList"
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


    </div>
</template>

<script>
    import { fetchSearch, updateSearch, createPerson, updatePerson, delPerson, createLost, updateLost, delLost,
        createMaterial, updateMaterial, delMaterial, createDocument, updateDocument, delDocument} from '@/api/search'
    import {fetchList} from '@/api/dictionary'
    import { fetchAdminMemberList} from '@/api/permissions'
    export default {
        name: "UpdateSearch",
        data(){
            const max20 = (rule, value, callback) => {
                if (value.length > 20) {
                    callback(new Error('输入过长'))
                } else {
                    callback()
                }
            }
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
                    id:undefined,
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
                    caseAddress:'',
                    lostDetailList:[],
                    concernedPersonList:[],
                    materialList:[],
                    documentList:[],

                },
                listRules:{},
                lostDetailListFormRules:{},
                concernedPersonListFormRules:{},
                materialListFormRules:{},


                dialogLostDetailListForm:false,
                dialogConcernedPersonListForm:false,
                dialogMaterialListForm:false,


                dialogLostDetailListFormMethod:'add',
                dialogConcernedPersonListFormMethod:'add',
                dialogMaterialListFormMethod:'add',



                lostDetailListForm:{
                    id:'',
                    evidenceId:'',
                    name:'',
                    model:'',
                    feather:'',
                    value:'',
                    amount:'',
                    regName:'',
                },
                concernedPersonListForm:{
                    id:'',
                    evidenceId:'',
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
                    evidenceId:'',
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
                    evidenceId:'',
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
                userList: [],
                userShowList: [],
                caseHappenRegionList: [],
                caseTypeList: [],
                sceneTypeList: [],
                crimeTimeList: [],
                invadeTypeList: [],
                escapeTypeList: [],
                idTypeList: [],

            }
        },
        created() {
                const id = this.$route.params && this.$route.params.id;
                this.list.id = id;
                this.fetchData(id);
                this.getUserList()
            this.search('案件类别').then(data=>{
                this.caseTypeList = this.processData(data.list);
            });
            this.search('行政区划').then(data=>{
                this.caseHappenRegionList = this.processData(data.list);
            });
            this.search('作案选择处所').then(data=>{
                this.sceneTypeList = this.processData(data.list);
            });
            this.search('作案时机').then(data=>{
                this.crimeTimeList = this.processData(data.list);
            });
            this.search('侵入方式').then(data=>{
                this.invadeTypeList = this.processData(data.list);
            });
            this.search('作案出口').then(data=>{
                this.escapeTypeList = this.processData(data.list);
            });
            this.search('身份类型').then(data=>{
                this.idTypeList = this.processData(data.list);
            });
        },
        methods:{
            filterUserSearch(value){
                if (value) {
                    this.userShowList = this.userList.filter(data=>{

                        var p =  /^[a-zA-Z]+$/;
                        if (p.test(value)) {
                            if (data.py.toLowerCase().indexOf(value.toLowerCase())>-1)
                                return data
                        }else{
                            if (data.title.indexOf(value)>-1)
                                return data
                        }
                    })
                }else{
                    this.userShowList = this.userList;
                }
            },
            restUserSearch(change){
                if (!change) {
                    this.userShowList = this.userList;
                }

            },
            fetchData(id) {
                fetchSearch(id).then(data => {
                    this.list = data;


                }).catch(err => {
                    console.log(err)
                })
            },
            search(parentName,filter=null){
                return new Promise((resolve, reject) => {
                    const data = {
                        filter:filter,
                        parentName:parentName
                    };
                    resolve(fetchList(data))
                })

            },
            processData(data){
                return data.map(item=>{
                    var sendData = {
                        value:item.name,
                        label:item.name,
                        py:item.pinyinAbbr,
                    }
                    if (item.children.length >0){
                        sendData.children = this.processData(item.children);
                    }

                    return sendData;
                })
            },
            filterSearch(node,value){
                var p =  /^[a-zA-Z]+$/;
                if (p.test(value)){
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase())>-1)
                        return true
                }else{
                    if (node.data.label.indexOf(value)>-1)
                        return true
                }
            },

            updateSearch() {
                this.$refs.listForm.validate(valid => {
                    if (valid) {
                        if (this.list.examBeginTime.toString().length>10)
                            this.list.examBeginTime = this.list.examBeginTime/1000;
                        if (this.list.examEndTime.toString().length>10)
                            this.list.examEndTime = this.list.examEndTime/1000;
                        if (this.list.caseBeginTime.toString().length>10)
                            this.list.caseBeginTime = this.list.caseBeginTime/1000;
                        if (this.list.caseEndTime.toString().length>10)
                            this.list.caseEndTime = this.list.caseEndTime/1000;
                        if (this.list.caseHappenTime.toString().length>10)
                            this.list.caseHappenTime = this.list.caseHappenTime/1000;

                        this.list.caseHappenRegion = this.list.caseHappenRegion.slice(-1)[0];
                        this.list.caseType = this.list.caseType.slice(-1)[0];
                        this.list.sceneType = this.list.sceneType.slice(-1)[0];
                        this.list.crimeTime = this.list.crimeTime.slice(-1)[0];
                        this.list.invadeType = this.list.invadeType.slice(-1)[0];
                        this.list.escapeType = this.list.escapeType.slice(-1)[0];

                        updateSearch(this.list).then(response => {
                            if (response.code === 200) {
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
                    } else {
                        this.$message({
                            message: '操作失败，请检查数据',
                            type: 'error',
                            showClose: true,
                            duration: 2000
                        });
                        return false
                    }
                })

            },
            getUserList() {
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName,
                            py:data.pinyinAbbr,
                        }
                    })
                })
            },
            resetLostDetailListForm() {
                this.lostDetailListForm = {
                    id:'',
                    name: '',
                    model: '',
                    feather: '',
                    value: '',
                    amount: '',
                    regName: '',
                }
                this.dialogLostDetailListFormMethod = 'add'
                // this.dialogLostDetailListFormIndex = ''
            },
            addLostDetailListForm() {
                this.lostDetailListForm.evidenceId = this.list.id;
                createLost(this.lostDetailListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })

                        this.dialogLostDetailListForm = false;
                        this.resetLostDetailListForm();
                        this.fetchData(this.list.id)
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });

            },
            handleEditLostDetailListForm(row) {
                this.lostDetailListForm = Object.assign({}, row) // copy obj
                this.dialogLostDetailListFormMethod = 'edit';
                this.dialogLostDetailListForm = true;

            },
            updateLostDetailListForm() {
                updateLost(this.lostDetailListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                        this.dialogLostDetailListForm = false;
                        this.resetLostDetailListForm();
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },
            handleDeleteLostDetailListForm( row) {
                const sendData={
                    id:row.id,
                    operation:'del',
                }
                delLost(sendData).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },

            resetConcernedPersonListForm() {
                this.concernedPersonListForm = {
                    id:'',
                    name: '',
                    idType: '',
                    idNo: '',
                    sex: '',
                    contactNumber: '',
                    residence: '',
                    huji: '',
                    registerName: '',
                }
                this.dialogConcernedPersonListFormMethod = 'add';
            },
            addConcernedPersonListForm() {
                this.concernedPersonListForm.evidenceId = this.list.id;
                if (this.concernedPersonListForm.idType.constructor === Array) {
                    this.concernedPersonListForm.idType = this.concernedPersonListForm.idType.slice(-1)[0]
                }
                createPerson(this.concernedPersonListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                        this.dialogConcernedPersonListForm = false;
                        this.resetConcernedPersonListForm();
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },
            handleEditConcernedPersonListForm(row) {
                this.concernedPersonListForm = Object.assign({}, row) // copy obj
                this.dialogConcernedPersonListFormMethod = 'edit';
                this.dialogConcernedPersonListForm = true;

            },
            updateConcernedPersonListForm() {
                if (this.concernedPersonListForm.idType.constructor === Array) {
                    this.concernedPersonListForm.idType = this.concernedPersonListForm.idType.slice(-1)[0]
                }
                updatePerson(this.concernedPersonListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                        this.dialogConcernedPersonListForm = false;
                        this.resetConcernedPersonListForm();
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },
            handleDeleteConcernedPersonListForm( row) {
                const sendData={
                    id:row.id,
                    operation:'del',
                }
                delPerson(sendData).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },

            resetMaterialListForm() {
                this.materialListForm = {
                    id:'',
                    name: '',
                    materialNo: '',
                    thirdMaterialNo: '',
                    materialCategory: '',
                    materialType: '',
                    extractTime: '',
                    extractMethod: '',
                    extractUid: '',
                }
                this.dialogMaterialListFormMethod = 'add'
            },
            addMaterialListForm() {
                this.materialListForm.evidenceId = this.list.id;
                createMaterial(this.materialListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                        this.dialogMaterialListForm = false;
                        this.resetMaterialListForm();
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });

            },
            handleEditMaterialListForm( row) {
                this.materialListForm = Object.assign({}, row) // copy obj
                this.dialogMaterialListFormMethod = 'edit';
                this.dialogMaterialListForm = true;

            },
            updateMaterialListForm() {
                updateMaterial(this.materialListForm).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                        this.dialogMaterialListForm = false;
                        this.resetMaterialListForm();
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },
            handleDeleteMaterialListForm( row) {
                const sendData={
                    id:row.id,
                    operation:'del',
                }
                delMaterial(sendData).then(response=>{
                    if (response.code === 200){
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.list.id)
                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
            },


        },
    }
</script>

<style scoped>

</style>