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
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="勘查结束" prop="examEndTime">
            <el-date-picker
              v-model="list.examEndTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择时间"
              style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发案开始" prop="caseBeginTime">
            <el-date-picker
              v-model="list.caseBeginTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择时间"
              style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发案结束" prop="caseEndTime">
            <el-date-picker
              v-model="list.caseEndTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择时间"
              style="width: 100%"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="发案地点" prop="crimeTools">
            <el-input v-model="list.caseAddress"/>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="案件类别" prop="caseCategory">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="caseCategoryPopover">
              常用字典
              <ul>
                <li v-for="item in caseTypeUserList"><el-link @click="list.caseCategory=item.dictName" >{{ item.dictName }}</el-link></li>
              </ul>
            <el-cascader
              :options="caseTypeList"
              v-model="list.caseCategory"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'案件类别')"
              @visible-change="caseCategoryPopover = !caseCategoryPopover"
              slot="reference"
              filterable
              style="width: 100%"
              :props="emitProps"
              />
            </el-popover>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="现场保护情况" prop="sceneProtect">
            <el-select v-model="list.sceneProtect" placeholder="请选择" center style="width: 100%">
              <el-option
                v-for="item in sceneProtectType"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发案区划" prop="caseHappenRegion">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="caseHappenRegionPopover">
              常用字典
              <ul>
                <li v-for="item in caseHappenRegionUserList"><el-link @click="list.caseHappenRegion=item.dictName" >{{ item.dictName }}</el-link></li>
              </ul>
            <el-cascader
              :options="caseHappenRegionList"
              v-model="list.caseHappenRegion"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'行政区划')"
              @visible-change="caseHappenRegionPopover = !caseHappenRegionPopover"
              slot="reference"
              :props="emitProps"
              filterable
              style="width: 100%"
            />
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="主办" prop="mainChargerUid">
            <el-select
              v-model="list.mainChargerUid"
              :filter-method="filterUserSearch"
              filterable
              disabled
              placeholder="请选择"
              center
              style="width: 100%"
              @visible-change="restUserSearch">
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

            <el-select
              v-model="list.supporterUidArray"
              :filter-method="filterUserSearch"
              filterable
              placeholder="请选择"
              center
              multiple
              style="width: 100%"
              @visible-change="restUserSearch"
              @change="selectUpdate">
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
          <el-form-item label="照相" prop="photographUid">

            <el-select
              v-model="list.photographUid"
              :filter-method="filterUserSearch"
              filterable
              placeholder="请选择"
              center
              style="width: 100%"
              @visible-change="restUserSearch">
              <el-option
                v-for="item in userShowList"
                :key="item.id"
                :label="item.title"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="录像" prop="cameraUid">
            <el-select
              v-model="list.cameraUid"
              :filter-method="filterUserSearch"
              filterable
              placeholder="请选择"
              center
              style="width: 100%"
              @visible-change="restUserSearch">
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
            <el-select v-model="list.medicalUid" placeholder="请选择" center style="width: 100%">
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
            <el-select
              v-model="list.sceneProtectUid"
              :filter-method="filterUserSearch"
              filterable
              placeholder="请选择"
              center
              style="width: 100%"
              @visible-change="restUserSearch">
              <el-option
                v-for="item in sceneProtectUidList"
                :key="item.id"
                :label="item.title"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="处所" prop="sceneType">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="sceneTypePopover">
              常用字典
              <ul>
                <li v-for="item in sceneTypeUserList">
                  <el-link @click="list.sceneType = item.dictName" >{{ item.dictName }}</el-link>
                </li>
              </ul>
            <el-cascader
              :options="sceneTypeList"
              v-model="list.sceneType"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'作案选择处所')"
              @visible-change="sceneTypePopover = !sceneTypePopover"
              slot="reference"
              filterable
              :props="props"
              style="width: 100%"/>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作案时机" prop="crimeTime">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="crimeTimePopover">
              常用字典
              <ul>
                <li v-for="item in crimeTimeUserList"><el-link @click="list.crimeTime=item.dictName" >{{ item.dictName }}</el-link></li>
              </ul>
            <el-cascader
              :options="crimeTimeList"
              v-model="list.crimeTimeArray"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'作案时机')"
              @visible-change="crimeTimePopover = !crimeTimePopover"
              slot="reference"
              :props="props"
              filterable
              style="width: 100%"/>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="侵入方式" prop="invadeType">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="invadeTypePopover">
              常用字典
              <ul>
                <li v-for="item in invadeTypeUserList"><el-link @click="list.invadeType=item.dictName" >{{ item.dictName }}</el-link></li>
              </ul>
            <el-cascader
              :options="invadeTypeList"
              v-model="list.invadeType"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'侵入方式')"
              @visible-change="invadeTypePopover = !invadeTypePopover"
              slot="reference"
              filterable
              :props="props"
              style="width: 100%"/>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作案出口" prop="escapeType">
            <el-popover
                    placement="left"
                    width="200"
                    trigger="manual"
                    v-model="escapeTypePopover">
              常用字典
              <ul>
                <li v-for="item in escapeTypeUserList"><el-link @click="list.escapeType=item.dictName" >{{ item.dictName }}</el-link></li>
              </ul>
            <el-cascader
              :options="escapeTypeList"
              v-model="list.escapeType"
              :filter-method="filterSearch"
              :show-all-levels="false"
              @change="countDict($event,'作案出口')"
              @visible-change="escapeTypePopover = !escapeTypePopover"
              slot="reference"
              filterable
              :props="props"
              style="width: 100%"/>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="作案人数" prop="crimePeoples">
            <el-select v-model="list.crimePeoples" placeholder="请选择" center style="width: 100%">
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="警情号" prop="instanceNo">
            <el-input v-model="list.instanceNo"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件编号" prop="caseNo">
            <el-input v-model="list.caseNo"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="现勘号" prop="thirdEvidenceNo">
            <el-input v-model="list.thirdEvidenceNo"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="勘查号" prop="selfEvidenceNo" >
            <el-input v-model="list.selfEvidenceNo" placeholder="系统自动生成" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="作案过程" prop="crimeDetail">
        <el-input v-model="list.crimeDetail" type="textarea"/>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="是否有监控" prop="hasCamera">
            <el-checkbox v-model="list.hasCamera"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否十类案件" prop="isTenCase" >
            <el-checkbox v-model="list.isTenCase"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否死亡案件" prop="isDeathCase">
            <el-checkbox v-model="list.isDeathCase"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label-width="auto">
        <el-button type="primary" size="mini" @click="dialogConcernedPersonListForm=true">添加当事人</el-button>
        <el-table
          :data="list.concernedPersonList"
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
            label="身份类型"
            align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.idType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="idNo" align="center"
            label="证件号" width="175">
            <template slot-scope="{row}">
              <span>{{ row.idNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别" align="center">
            <template slot-scope="{row}">
              <span>{{ row.sexShow }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="contactNumber" width="120"
            label="联系电话" align="center">
            <template slot-scope="{row}">
              <span>{{ row.contactNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="residence"  width="160"
            label="常住地址" align="center">
            <template slot-scope="{row}">
              <span>{{ row.residence }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150" align="center">
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
      <el-form-item label-width="auto">
        <el-button type="primary" size="mini" @click="dialogSuspectPersonListForm=true">添加嫌疑人</el-button>
        <el-table
                :data="list.suspectPersonList"

                border
                max-height="150"
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
                  prop="idNo" align="center"
                  label="证件号" width="175">
            <template slot-scope="{row}">
              <span>{{ row.idNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="solveMethod"
                  label="侦破方式" align="center">
            <template slot-scope="{row}">
              <span>{{ row.solveMethod }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="crimeDetail" width="120"
                  label="作案特点" align="center">
            <template slot-scope="{row}">
              <span>{{ row.crimeDetail }}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="crackStatus" width="120"
                  label="状态" align="center">
            <template slot-scope="{row}">
              <span>{{ row.crackStatus===1?'待破':row.crackStatus===2?'已技术比中':'已破' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                      size="mini"
                      @click="handleEditSuspectPersonListForm(scope.$index, scope.row)">编辑</el-button>
              <el-button
                      size="mini"
                      type="danger"
                      @click="handleDeleteSuspectPersonListForm(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label-width="auto">
        <el-button type="primary" size="mini" @click="dialogLostDetailListForm=true">添加损失情况</el-button>
        <el-table
          :data="list.lostDetailList"

          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名字" align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="model"
            label="型号" align="center"
          >
            <template slot-scope="{row}">
              <span>{{ row.model }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="feather"
            label="特征" align="center">
            <template slot-scope="{row}">
              <span>{{ row.feather }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="价值" align="center">
            <template slot-scope="{row}">
              <span>{{ row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="数量" align="center">
            <template slot-scope="{row}">
              <span>{{ row.amount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="150" align="center">
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

      <el-divider>物证信息</el-divider>
      <el-form-item label-width="auto">
        <el-button type="primary" size="mini" @click="handleClickToAddMaterial">添加物证</el-button>
        <el-button type="primary" size="mini" @click="submitTask">批量提交物证</el-button>
        <el-button type="primary" size="mini" @click="submitMaterialOutStock">批量借出物证</el-button>
        <el-button type="primary" size="mini" @click="submitMaterialinStock">批量存入物证库</el-button>
        <el-table
          :data="list.materialList"
          border

          row-key="id"
          @selection-change="selectTask"
        >
          <el-table-column
            v-model="taskId"
            type="selection"
            width="55"/>
          <el-table-column
            prop="materialNo"
            label="物证编码" align="center"
            width="140"
          >
            <template slot-scope="{row}">
              <span>{{ row.materialNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="thirdMaterialNo"
            label="物证库编号" align="center"
            width="140"
          >
            <template slot-scope="{row}">
              <span>{{ row.thirdMaterialNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="materialCategory" align="center"
            label="物证类别">
            <template slot-scope="{row}">

              <span>{{ row.materialCategory }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="extractTime"
            label="提取日期" align="center"
            width="100px">
            <template slot-scope="{row}">
              <span v-if="row.extractTime !== ''">{{ row.extractTime*1000 | parseTime('{y}-{m}-{d}') }}</span>
              <span v-else/>
            </template>
          </el-table-column>
          <el-table-column
            prop="extractMethod" align="center"
            label="提取方法">
            <template slot-scope="{row}">
              <span>{{ row.extractMethod }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="extractUid" align="center"
            label="提取人">
            <template slot-scope="{row}">
              <span>{{ row.extractName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="extractUid"
            label="图片" align="center"
            width="200">
            <template slot-scope="{row}">
              <span><img :src="row.imgUrl" height="100"></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEditMaterialListForm(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteMaterialListForm( scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <div style="margin: 40px 0;text-align: center;" >
        <el-button v-loading="loading" type="primary" style="width: 200px" @click="submitForm()">保存</el-button>
      </div>

    </el-form>

    <el-dialog
      :visible.sync="dialogPoint"
      title="提示"
      width="30%"
    >
      <span>添加物证必须先保存现勘记录，是否保存现勘记录</span>
      <span slot="footer" class="dialog-footer">

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPoint = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="toAddMaterial">
            确 定
          </el-button>
        </div>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogLostDetailListForm" title="损失情况" width="30%">
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
          <el-input v-model="lostDetailListForm.value" type="number" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input v-model="lostDetailListForm.amount"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLostDetailListForm = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="dialogLostDetailListFormMethod=== 'add'?addLostDetailListForm():updateLostDetailListForm()">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogSuspectPersonListForm" title="嫌疑人" width="30%">
      <el-form
              ref="lostDetailListForm"
              :rules="suspectPersonListFormRules"
              :model="suspectPersonListForm"
              label-position="left"
              label-width="100px"
              style="width: 400px; margin-left:50px;">

        <el-form-item label="名字" prop="name">
          <el-input v-model="suspectPersonListForm.name"/>
        </el-form-item>
        <el-form-item label="证件号" prop="idNo">
          <el-input v-model="suspectPersonListForm.idNo"/>
        </el-form-item>
        <el-form-item label="侦破方式" prop="solveMethod">
          <el-select v-model="suspectPersonListForm.solveMethod"
                     filterable
                     @change="countDictSelect"
                     default-first-option
                     placeholder="请选择"
                      style="width: 100%">
            <el-option
                    v-for="item in solveMethodList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="作案特点" prop="crimeDetail">
          <el-input v-model="suspectPersonListForm.crimeDetail"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSuspectPersonListForm = false">
          取 消
        </el-button>
        <el-button
                type="primary"
                @click="dialogSuspectPersonListFormMethod=== 'add'?addSuspectPersonListForm():updateSuspectPersonListForm()">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" :visible.sync="dialogConcernedPersonListForm" title="当事人" width="30%">
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
        <el-form-item label="身份类型" prop="idType" >
          <el-popover
                  placement="left"
                  width="200"
                  trigger="manual"
                  v-model="reportOrgPopover">
            常用字典
            <ul>
              <li v-for="item in idTypeUserList"><el-link @click="concernedPersonListForm.idType=item.dictName" >{{ item.dictName }}</el-link></li>
            </ul>
          <el-cascader
            :options="idTypeList"
            v-model="concernedPersonListForm.idType"
            :filter-method="filterSearch"
            @change="countDict($event,'身份类型')"
            @visible-change="reportOrgPopover = !reportOrgPopover"
            slot="reference"
            :props="emitProps"
            :show-all-levels="false"
            filterable
            style="width: 100%"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="证件号" prop="idNo">
          <el-input v-model="concernedPersonListForm.idNo"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="concernedPersonListForm.sex" placeholder="请选择" center style="width: 100%">
            <el-option
              v-for="item in sex"
              :key="item.id"
              :label="item.title"
              :value="item.id"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="concernedPersonListForm.contactNumber"/>
        </el-form-item>
        <el-form-item label="常住地址" prop="residence">
          <el-input v-model="concernedPersonListForm.residence"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConcernedPersonListForm = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="dialogConcernedPersonListFormMethod==='add'?addConcernedPersonListForm():updateConcernedPersonListForm()">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogMaterialListForm" :close-on-click-modal="false" title="物证" width="50%">
      <el-form
        ref="materialListForm"
        :rules="materialListFormRules"
        :model="materialListForm"
        label-position="left"
        label-width="100px"
        :before-close="handleClose"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="物证编号" prop="thirdMaterialNo">
              <el-input v-model="materialListForm.thirdMaterialNo" :disabled="true" placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物证类别" prop="materialCategory">
              <el-popover
                      placement="left"
                      width="200"
                      trigger="manual"
                      v-model="materialCategoryPopover">
                常用字典
                <ul>
                  <li v-for="item in materialCategoryUserList"><el-link @click="materialChange(item.dictName);materialListForm.materialCategory=item.dictName" >{{ item.dictName }}</el-link></li>
                </ul>
                <el-cascader
                        ref="materialCategoryList"
                        :options="materialCategoryList"
                        v-model="materialListForm.materialCategory"
                        :filter-method="filterSearch"
                        :show-all-levels="false"
                        @change="countDictMaterial($event,'物证类型')"
                        @visible-change="materialCategoryPopover = !materialCategoryPopover"
                        slot="reference"
                        filterable
                        style="width: 100%"/>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可靠程度" prop="reliabilityLevel">
              <el-select v-model="materialListForm.reliabilityLevel" placeholder="请选择">
                <el-option
                        v-for="item in reliabilityLevel"
                        :key="item.title"
                        :label="item.title"
                        :value="item.title"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="遗留部位" prop="stayPart">
              <el-input v-model="materialListForm.stayPart"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提取方法" prop="extractMethod">
              <el-input v-if="isInput" v-model="materialListForm.extractMethod"/>
              <el-select v-model="materialListForm.extractMethod"
                         filterable
                         @change="countDictSelect"
                         default-first-option
                         v-if="!isInput"
                         placeholder="请选择"
                         style="width: 100%">
                <el-option
                        v-for="item in extractMethodList"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="利用情况" prop="usedType">
              <el-select v-model="materialListForm.usedType" placeholder="请选择">
                <el-option
                  v-for="item in usedType"
                  :key="item.title"
                  :label="item.title"
                  :value="item.title"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="提取日期" prop="extractTime">

              <el-date-picker
                v-model="materialListForm.extractTime"
                type="date"
                value-format="timestamp"
                placeholder="选择时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提取人" prop="extractUid">
              <el-select
                v-model="materialListForm.extractUid"
                :filter-method="filterUserSearch"
                filterable
                placeholder="请选择"
                center
                style="width: 100%"
                @visible-change="restUserSearch">
                <el-option
                  v-for="item in userShowList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-form-item label="物证名称" prop="name">
              <el-input v-model="materialListForm.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="特征描述" prop="note">
          <el-input v-model="materialListForm.note" type="textarea"/>
        </el-form-item>


        <el-form-item label="物证图片" prop="registerName">
          <Upload v-model="materialListForm.imgUrl" @tell="setStayPart"/>
        </el-form-item>
      </el-form>
      <el-button
              type="primary" style="float: right"
              @click="dialogMaterialListFormMethod === 'add'?addMaterialListForm():updateMaterialListForm()">
        保存
      </el-button>
      <el-table
              ref="materialPhotoList"
              :data="materialPhotoList"
              current-row-key="id"
              highlight-current-row
              @current-change="handleCurrentChange"
              :row-class-name="tableRowClassName"
              style="width: 100%">
        <el-table-column
                type="index"
                width="50">
        </el-table-column>
        <el-table-column label="物证编号"  align="center" >
          <template slot-scope="{row}">
            <span>{{ row.materialNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物证类型"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.materialCategoryShow }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提取日期"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.extractTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提取人"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.extractName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.status?'已保存':'未保存' }}</span>
          </template>
        </el-table-column>
      </el-table>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMaterialListForm = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { createSearch, fetchSearch, updateSearch, createPerson, updatePerson, delPerson, createLost, updateLost, delLost,
  createMaterial, updateMaterial, delMaterial, submitMaterial,submitMaterialinStock,submitMaterialOutStock, createDocument,
  updateDocument, delDocument,createSuspect, updateSuspect, delSuspect } from '@/api/search'
import {fetchList,userDictList} from '@/api/dictionary'
import { fetchAdminMemberList } from '@/api/permissions'
import Upload from '@/components/Upload/SingleImage3'
import {parseTime} from '@/utils'

export default {
  name: 'MenberDetail',
  components: { Upload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const max20 = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error('输入过长'))
      } else {
        callback()
      }
    }
    return {
      props: {
        multiple: true,
        emitPath:false
      },
      emitProps:{
        emitPath:false
      },
      tableKey: 0,
      dialogPoint: false,
      sceneProtectUidList: [
        {
          id: 0,
          title: '无'
        }, {
          id: 1,
          title: '有'
        }
      ],
      sceneProtectType: [
        {
          id: 1,
          title: '未移动'
        }, {
          id: 2,
          title: '已复原'
        }, {
          id: 3,
          title: '不明显'
        }, {
          id: 4,
          title: '一般'
        }, {
          id: 5,
          title: '混乱'
        }, {
          id: 6,
          title: '其他'
        }
      ],
      crimePeoplesType: [
        {
          id: 0,
          title: '不确定'
        }, {
          id: 1,
          title: '1人'
        }, {
          id: 2,
          title: '两个'
        }, {
          id: 3,
          title: '多人'
        }
      ],
      idType: [
        {
          id: 1,
          title: '身份证'
        }, {
          id: 2,
          title: '护照'
        }, {
          id: 3,
          title: '军人证'
        }, {
          id: 4,
          title: '学生证'
        }
      ],
      sex: [
        {
          id: 0,
          title: '未知'
        }, {
          id: 1,
          title: '男'
        }, {
          id: 2,
          title: '女'
        }
      ],
      documentType: [
        {
          id: 1,
          title: 'DNA鉴定书'
        }, {
          id: 2,
          title: '指纹鉴定书'
        }, {
          id: 3,
          title: '理化鉴定书'
        }, {
          id: 4,
          title: '其他鉴定书'
        }
      ],
      materialType: [
        {
          id: 1,
          title: '指纹印'
        }, {
          id: 2,
          title: 'DNA'
        }, {
          id: 3,
          title: '鞋印'
        }, {
          id: 4,
          title: '工痕'
        }, {
          id: 5,
          title: '微量物证'
        }
      ],
      reliabilityLevel: [
        {
          title: '是'
        }, {
          title: '疑似'
        }, {
          title: '其他'
        }
      ],
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
      list: {
        id: null,
        examBeginTime: '',
        examEndTime: '',
        caseBeginTime: '',
        caseEndTime: '',
        caseHappenTime: '',
        caseHappenRegion: '',
        sceneProtect: '',
        caseCategory: '',
        mainChargerUid: '',
        supporterUid: '',
        supporterUidArray: [],
        photographUid: '',
        cameraUid: '',
        medicalUid: '',
        sceneProtectUid: '',
        hasCamera: '',
        isTenCase: '',
        isDeathCase: '',
        sceneType: '',
        crimeTime: '',
        crimeTimeArray: [],
        invadeType: '',
        escapeType: '',
        crimeTools: '',
        crimeDetail: '',
        crimePeoples: '',
        caseAddress: '',
        instanceNo: this.$store.getters.instanceNo,
        caseNo: this.$store.getters.caseNo,
        thirdEvidenceNo: this.$store.getters.evidenceNo,
        selfEvidenceNo: '',
        lostDetailList: [],
        concernedPersonList: [],
        materialList: [],
        suspectPersonList: [],
        documentList: []

      },
      listRules: {},
      lostDetailListFormRules: {},
      concernedPersonListFormRules: {},
      materialListFormRules: {},
      suspectPersonListFormRules: {},

      loading: false,
      dialogLostDetailListForm: false,
      dialogConcernedPersonListForm: false,
      dialogMaterialListForm: false,
      dialogSuspectPersonListForm: false,

      dialogLostDetailListFormMethod: 'add',
      dialogConcernedPersonListFormMethod: 'add',
      dialogMaterialListFormMethod: 'add',
      dialogSuspectPersonListFormMethod: 'add',

      dialogSuspectPersonListFormIndex:'',
      taskId: [],
      materialCategoryList: [],
      searchId: null,

      suspectPersonListForm: {
        id: '',
        evidenceId: '',
        name: '',
        idNo: '',
        solveMethod: '',
        crimeDetail: '',
      },

      lostDetailListForm: {
        id: '',
        evidenceId: '',
        name: '',
        model: '',
        feather: '',
        value: '',
        amount: '',

      },
      concernedPersonListForm: {
        id: '',
        evidenceId: '',
        name: '',
        idType: '',
        idNo: '',
        sex: '',
        contactNumber: '',
        residence: '',

      },
      materialListForm: {
        id: '',
        evidenceId: '',
        hasTransfered: false,
        materialNo: '',
        thirdMaterialNo: '',
        materialCategory: '',
        materialCategoryShow: '',
        materialType: '',
        extractTime: (new Date()).valueOf(),
        extractMethod: '',
        extractUid: '',
        extractName: '',
        imgUrl: '',
        stayPart: '',
        reliabilityLevel: '',
        usedType: '',
        name: '',
        note: '',
        noned: '',
        index: '',

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
      handprintMethodList: [],
      footprintMethodList: [],
      toolMethodList: [],
      bulletMethodList: [],
      extractMethodList: [],
      idTypeUserList: [],

      caseTypeUserList: [],
      sceneTypeUserList: [],
      crimeTimeUserList: [],
      invadeTypeUserList: [],
      escapeTypeUserList: [],
      caseHappenRegionUserList: [],
      handprintMethodUserList: [],
      footprintMethodUserList: [],
      toolMethodUserList: [],
      bulletMethodUserList: [],
      extractMethodUserList: [],
      reportOrgUserList: [],
      materialCategoryUserList: [],

      solveMethodList:[],

      isInput:false,
      caseCategoryPopover:false,
      caseHappenRegionPopover:false,
      crimeTimePopover:false,
      sceneTypePopover:false,
      invadeTypePopover:false,
      escapeTypePopover:false,
      materialCategoryPopover:false,
      reportOrgPopover:false,

      isDna:false,
      isFingerprint:false,
      materialPhotoList:[],
      currenTable:'',


    }
  },
  watch: {
    'list.concernedPersonList': {
      handler(newData, oldData) {
        if (newData.length > 0) {
         var count = 0;
          newData.map(item=>{
            if (item.idType === '死者'){
              count++
            }
          })
          if (count)
            this.list.isDeathCase = true;
          else
            this.list.isDeathCase = false
        } else {
          this.list.isDeathCase = false
        }
      },
      deep: true,
      immediate: true
    },
    'materialListForm.materialCategory': {
      handler(newData, oldData) {

        if (newData){
          if (newData.constructor === Array) {
            this.isFingerprint = false
            this.isDna = false
            if (newData.indexOf('手印物证') > -1 ) {
              this.isInput = false
              this.isFingerprint = true
              this.extractMethodList = this.handprintMethodList;
            }else if (newData.indexOf('足迹物证') > -1){
              this.isInput = false
              this.extractMethodList = this.footprintMethodList;
            } else if (newData.indexOf('工具痕迹') > -1){
              this.isInput = false
              this.extractMethodList = this.toolMethodList;
            } else if (newData.indexOf('枪弹物证') > -1){
              this.isInput = false
              this.extractMethodList = this.bulletMethodList;
            }else if (newData.indexOf('生物物证') > -1){
              this.isInput = false
              this.isDna = true
            }else{
              this.isInput = true

            }
            this.materialListForm.materialCategoryShow= this.materialListForm.materialCategory.slice(-1)[0]
            // this.$set(this.materialPhotoList,this.materialListForm.index,this.materialListForm);
          }
        }
      },
      deep: true,
      immediate: true
    },
    'materialListForm.extractUid': {
      handler(newData, oldData) {
        this.userList.map(data=>{
          if (this.materialListForm.extractUid ===data.id) {
            this.materialListForm.extractName = data.title;
          }
        })
      },
      deep: true,
      immediate: true
    },
    'list.caseAddress': {
      handler(newData, oldData) {
          this.concernedPersonListForm.residence = newData;
      },
      deep: true,
      immediate: true
    },
    'list.caseCategory': {
      handler(newData, oldData) {
        if (newData.indexOf("十类案件") > -1) {
          this.list.isTenCase = true
        }else{
          this.list.isTenCase = false
        }

      },
      deep: true,
      immediate: true
    },
    'list.supporterUidArray': {
      handler(newData, oldData) {
        if (newData){
          if (newData.length > 0) {
            this.list.photographUid = newData[0]
          }else{
            this.list.photographUid = '';
          }
        }

      },
      deep: true,
      immediate: true
    },
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id)
      this.list.id = id

    }else{
      this.list.mainChargerUid = this.$store.getters.id;
      this.list.examBeginTime = (new Date() ).valueOf()+ 30 * 60 * 1000;
      this.list.examEndTime = (new Date()).valueOf() + 120 * 60 * 1000;
      this.list.caseHappenTime = (new Date()).valueOf();
      this.list.caseBeginTime = (new Date()).valueOf();
      this.list.caseEndTime = (new Date()).valueOf();
    }


    this.getUserList();
    this.search('案件类别').then(data => {
      this.caseTypeList = this.processData(data.list)
    })

    this.search('行政区划').then(data => {
      this.caseHappenRegionList = this.processData(data.list)
    })

    this.search('作案选择处所').then(data => {
      this.sceneTypeList = this.processData(data.list)
    })

    this.search('作案时机').then(data => {
      this.crimeTimeList = this.processData(data.list)
    })

    this.search('侵入方式').then(data => {
      this.invadeTypeList = this.processData(data.list)
    })

    this.search('作案出口').then(data => {
      this.escapeTypeList = this.processData(data.list)
    })

    this.search('身份类型').then(data => {
      this.idTypeList = this.processData(data.list)
    })

    this.search('物证类型').then(data => {
      this.materialCategoryList = this.processData(data.list)
    })

    this.search('手印提取方法').then(data => {
      this.handprintMethodList = this.processData(data.list)
    })

    this.search('足迹提取方法').then(data => {
      this.footprintMethodList = this.processData(data.list)
    })

   this.search('工具提取方法').then(data => {
      this.toolMethodList = this.processData(data.list)
    })

   this.search('枪弹提取方法').then(data => {
      this.bulletMethodList = this.processData(data.list)
    })
    this.search('侦破方式').then(data => {
      this.solveMethodList = this.processData(data.list)
    })

    this.getUserDict('案件类别').then(data => {
      this.caseTypeUserList = data.list
    })
    this.getUserDict('行政区划').then(data => {
      this.caseHappenRegionUserList = data.list
    })
    this.getUserDict('作案选择处所').then(data => {
      this.sceneTypeUserList = data.list
    })
    this.getUserDict('作案时机').then(data => {
      this.crimeTimeUserList = data.list
    })
    this.getUserDict('侵入方式').then(data => {
      this.invadeTypeUserList = data.list
    })
    this.getUserDict('作案出口').then(data => {
      this.escapeTypeUserList = data.list
    })
    this.getUserDict('身份类型').then(data => {
      this.idTypeUserList = data.list
    })
    this.getUserDict('物证类型').then(data => {
      this.materialCategoryUserList = data.list
    })
    this.getUserDict('手印提取方法').then(data => {
      this.handprintMethodUserList = data.list
    })
    this.getUserDict('足迹提取方法').then(data => {
      this.footprintMethodUserList = data.list
    })
    this.getUserDict('工具提取方法').then(data => {
      this.toolMethodUserList = data.list
    })
   this.getUserDict('枪弹提取方法').then(data => {
      this.bulletMethodUserList = data.list
    })

  },
  methods: {
    materialChange(val){
      this.isFingerprint = false
      this.isDna = false
      var data = this.searchMaterial(this.materialCategoryList,val);
      if (data === '手印物证' ) {
        this.isInput = false
        this.isFingerprint = true
        this.extractMethodList = this.handprintMethodList;
      }else if (data === '足迹物证'){
        this.isInput = false
        this.extractMethodList = this.footprintMethodList;
      } else if (data === '工具痕迹'){
        this.isInput = false
        this.extractMethodList = this.toolMethodList;
      } else if (data === '枪弹物证'){
        this.isInput = false
        this.extractMethodList = this.bulletMethodList;
      }else if (data === '生物物证'){
        this.isInput = false
        this.isDna = true
      }else{
        this.isInput = true

      }
    },
    searchMaterial(val,change){
      var result='';
      val.map(item=>{
        if (item.children){
          item.children.map(data=>{
            if (change === data.label)
              result = item.label;
            if (data.children){
              data.children.map(data2=>{
                if (change === data2.label)
                  result = item.label;

              })
            }
          })
        }
      });
      return result;
    },
    handleClose(){
      if (this.isEdit)
        this.submitForm()
      this.fetchData(this.list.id);
    },
    handleCurrentChange(row){
      if (row.status){
        this.dialogMaterialListFormMethod = 'edit';
      }else{
        this.dialogMaterialListFormMethod = 'add';
      }
      console.log(this.dialogMaterialListFormMethod);
      this.materialListForm = row;

    },
     tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
       },
    setStayPart(val) {
      var data ={
        id: '',
        materialNo: '',
        hasTransfered: false,
        thirdMaterialNo: '',
        materialCategory: '',
        materialCategoryShow: '',
        materialType: '',
        extractTime: (new Date()).valueOf(),
        extractMethod: '',
        extractUid: '',
        extractName: '',
        imgUrl: val.imgUrl,
        stayPart: val.originalFileName,
        reliabilityLevel: '',
        usedType: '',
        name: val.originalFileName,
        note: '',
        noned: '',
        evidenceId: this.list.id,
        status:0,
      };
      this.materialPhotoList.push(data);
    },
    getUserDict(parentName){
      return new Promise((resolve, reject) => {
        const data = {
          cateName:parentName
        };
        resolve(userDictList(data))
      })
    },
    countDict(val,type){
      if (val) {
        if (val.constructor === Array){
          val.map(data=>{
            const send={
              name:data,
              cateName:type
            };
            this.$store.dispatch('PostUserUseDict', send)
          })
        }else{
          const send={
            name:val,
            cateName:type
          };
          this.$store.dispatch('PostUserUseDict', send)
        }
      }
    },

    countDictMaterial(val,type){
      val = val.slice(-1)[0];
      const send={
        name:val,
        cateName:type
      };
      this.$store.dispatch('PostUserUseDict', send)

    },
    countDictSelect(val){
      if (val) {
        const send={
          name:val
        };
        this.$store.dispatch('PostUserUseDict', send)
      }

    },
    selectUpdate(val) {
      this.$forceUpdate()
    },


    selectTask(selection) {
      this.taskId = selection.map(data => {
        return data.id
      })
    },
    submitTask() {
      const data = {
        list: this.taskId
      }
      submitMaterial(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
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
    submitMaterialOutStock() {
      const data = {
        list: this.taskId
      }
      submitMaterialOutStock(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
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
    submitMaterialinStock() {
      const data = {
        list: this.taskId
      }
      submitMaterialinStock(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
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

    fetchData(id) {
      fetchSearch(id).then(data => {
        this.list = data
        this.list = this.changeTime(this.list, false)

        if (this.list.supporterUid){
          this.list.supporterUidArray = this.list.supporterUid.split(',').map(data => {
            return parseInt(data)
          })
        }

        if (this.list.sceneProtect === 0)
          this.list.sceneProtect = '';
        if (this.list.photographUid === 0)
          this.list.photographUid = '';
        if (this.list.medicalUid === 0)
          this.list.medicalUid = '';
        if (this.list.cameraUid === 0)
          this.list.cameraUid = '';

        if (this.list.crimeTime){
          this.list.crimeTimeArray = JSON.parse(this.list.crimeTime)
        }
        if (this.list.sceneType){
          this.list.sceneType = JSON.parse(this.list.sceneType)
        }
        if (this.list.invadeType){
          this.list.invadeType = JSON.parse(this.list.invadeType)
        }
        if (this.list.escapeType){
          this.list.escapeType = JSON.parse(this.list.escapeType)
        }

      }).catch(err => {
        console.log(err)
      })
    },
    getUserList() {
      fetchAdminMemberList({}).then(response => {
        this.userList = response.list.map(data => {
          return {
            id: data.id,
            title: data.realName,
            py: data.pinyinAbbr
          }
        })
        this.userShowList = this.userList
      })
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
        if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
      } else {
        if (node.data.label.indexOf(value) > -1) { return true }
      }
    },
    filterUserSearch(value) {
      if (value) {
        this.userShowList = this.userList.filter(data => {
          var p = /^[a-zA-Z]+$/
          if (p.test(value)) {
            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return data }
          } else {
            if (data.title.indexOf(value) > -1) { return data }
          }
        })
      } else {
        this.userShowList = this.userList
      }
    },
    restUserSearch(change) {
      if (!change) {
        this.userShowList = this.userList
      }
    },
    resetLostDetailListForm() {
      this.lostDetailListForm = {
        name: '',
        model: '',
        feather: '',
        value: '',
        amount: '',
      }
      this.dialogLostDetailListFormMethod = 'add'
      this.dialogLostDetailListFormIndex = ''
    },
    addLostDetailListForm() {
      if (this.isEdit) {
        this.lostDetailListForm.evidenceId = this.list.id
        createLost(this.lostDetailListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.dialogLostDetailListForm = false
            this.resetLostDetailListForm()
            this.fetchData(this.list.id)
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.list.lostDetailList.push(this.lostDetailListForm)
        this.dialogLostDetailListForm = false
        this.resetLostDetailListForm()
      }
    },
    handleEditLostDetailListForm(index, row) {
      this.lostDetailListForm = Object.assign({}, row) // copy obj
      this.dialogLostDetailListFormIndex = index
      this.dialogLostDetailListFormMethod = 'edit'
      this.dialogLostDetailListForm = true
    },
    updateLostDetailListForm() {
      if (this.isEdit) {
        updateLost(this.lostDetailListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
            this.dialogLostDetailListForm = false
            this.resetLostDetailListForm()
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        var temp = Object.assign({}, this.lostDetailListForm)// copy obj
        this.list.lostDetailList.splice(this.dialogLostDetailListFormIndex, 1, temp)
        this.dialogLostDetailListForm = false
        this.resetLostDetailListForm()
      }
    },
    handleDeleteLostDetailListForm(index, row) {
      if (this.isEdit) {
        const sendData = {
          id: row.id,
          operation: 'del'
        }
        delLost(sendData).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.list.lostDetailList.splice(index, 1)
      }
    },

    resetSuspectPersonListForm() {
      this.suspectPersonListForm = {
        name: '',
        model: '',
        feather: '',
        value: '',
        amount: '',
      }
      this.dialogSuspectPersonListFormMethod = 'add'
      this.dialogSuspectPersonListFormIndex = ''
    },
    addSuspectPersonListForm() {
      if (this.isEdit) {
        this.suspectPersonListForm.evidenceId = this.list.id;
        console.log(this.suspectPersonListForm.evidenceId);
        createSuspect(this.suspectPersonListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.dialogSuspectPersonListForm = false
            this.resetSuspectPersonListForm()
            this.fetchData(this.list.id)
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.list.suspectPersonList.push(this.suspectPersonListForm)
        this.dialogSuspectPersonListForm = false
        this.resetSuspectPersonListForm()
      }
    },
    handleEditSuspectPersonListForm(index, row) {
      this.suspectPersonList = Object.assign({}, row) // copy obj
      this.dialogSuspectPersonListFormIndex = index
      this.dialogSuspectPersonListFormMethod = 'edit'
      this.dialogSuspectPersonListForm = true
    },
    updateSuspectPersonListForm() {
      if (this.isEdit) {
        updateSuspect(this.suspectPersonListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
            this.dialogSuspectPersonListForm = false
            this.resetSuspectPersonListForm()
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        var temp = Object.assign({}, this.suspectPersonListForm)// copy obj
        this.list.suspectPersonList.splice(this.dialogSuspectPersonListFormIndex, 1, temp)
        this.dialogSuspectPersonListForm = false
        this.resetSuspectPersonListForm()
      }
    },
    handleDeleteSuspectPersonListForm(index, row) {
      if (this.isEdit) {
        const sendData = {
          id: row.id,
          operation: 'del'
        }
        delSuspect(sendData).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.list.suspectPersonList.splice(index, 1)
      }
    },

    resetConcernedPersonListForm() {
      this.concernedPersonListForm = {
        name: '',
        idType: '',
        idNo: '',
        sex: '',
        contactNumber: '',
        residence: this.list.caseAddress,

      }
      this.dialogConcernedPersonListFormMethod = 'add'
      this.dialogConcernedPersonListFormIndex = ''
    },
    addConcernedPersonListForm() {
      if (this.concernedPersonListForm.idType.constructor === Array) {
        this.concernedPersonListForm.idType = this.concernedPersonListForm.idType.slice(-1)[0]
      }
      if (this.isEdit) {
        this.concernedPersonListForm.evidenceId = this.list.id
        createPerson(this.concernedPersonListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
            this.dialogConcernedPersonListForm = false
            this.resetConcernedPersonListForm()
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.sex.map(data => {
          if (data.id == this.concernedPersonListForm.sex) {
            this.concernedPersonListForm.sexShow = data.title
          }
        })

        this.list.concernedPersonList.push(this.concernedPersonListForm)
        this.dialogConcernedPersonListForm = false
        this.resetConcernedPersonListForm()
      }
    },
    handleEditConcernedPersonListForm(index, row) {
      this.concernedPersonListForm = Object.assign({}, row) // copy obj
      this.dialogConcernedPersonListFormMethod = 'edit'
      this.dialogConcernedPersonListFormIndex = index
      this.dialogConcernedPersonListForm = true
    },
    updateConcernedPersonListForm() {
      if (this.concernedPersonListForm.idType.constructor === Array) {
        this.concernedPersonListForm.idType = this.concernedPersonListForm.idType.slice(-1)[0]
      }
      if (this.isEdit) {
        updatePerson(this.concernedPersonListForm).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
            this.dialogConcernedPersonListForm = false
            this.resetConcernedPersonListForm()
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.sex.map(data => {
          if (data.id == this.concernedPersonListForm.sex) {
            this.concernedPersonListForm.sexShow = data.title
          }
        })

        var temp = Object.assign({}, this.concernedPersonListForm)// copy obj
        this.list.concernedPersonList.splice(this.dialogConcernedPersonListFormIndex, 1, temp)
        this.dialogConcernedPersonListForm = false
        this.resetConcernedPersonListForm()
      }
    },
    handleDeleteConcernedPersonListForm(index, row) {
      if (this.isEdit) {
        const sendData = {
          id: row.id,
          operation: 'del'
        }
        delPerson(sendData).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              showClose: true,
              duration: 2000
            })
            if (this.isEdit)
              this.submitForm()
            this.fetchData(this.list.id)
          } else {
            this.$message({
              message: response.reason,
              type: 'success',
              showClose: true,
              duration: 2000
            })
          }
        })
      } else {
        this.list.concernedPersonList.splice(index, 1)
      }
    },
    resetMaterialListForm() {
      const change = {
        id: '',
        materialNo: '',
        hasTransfered: false,
        thirdMaterialNo: '',
        materialCategory: '',
        materialType: '',
        extractTime: (new Date()).valueOf(),
        extractMethod: '',
        extractUid: '',
        imgUrl: '',
        stayPart: '',
        reliabilityLevel: '',
        usedType: '',
        name: '',
        note: '',
        noned: '',
        evidenceId: this.list.id
      }
      this.materialListForm = Object.assign({}, change) // copy obj
      this.dialogMaterialListFormMethod = 'add'
    },
    handleClickToAddMaterial() {
      this.resetMaterialListForm()
      if (this.list.id == null) {
        this.dialogPoint = true
      } else {
        this.dialogMaterialListForm = true
      }


    },
    toAddMaterial() {
      if (this.list.id == null) {
        this.submitForm(true)
      }
    },
    addMaterialListForm() {
      var data =Object.assign({}, this.materialListForm)

      if (data.materialCategory.constructor === Array) {
        data.materialCategory = data.materialCategoryShow
      }

      if (data.extractTime.toString().length > 10) { data.extractTime = parseInt(data.extractTime / 1000) }
      createMaterial(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          this.materialListForm.materialNo = response.materialNo;
          this.materialListForm.status = 1;
          this.$set(this.materialPhotoList,this.materialListForm.index,this.materialListForm);
          // if (thi
          // s.isEdit)
          //   this.submitForm()
          // this.fetchData(this.list.id)
          // this.dialogMaterialListForm = false
          this.resetMaterialListForm()
        } else {
          this.$message({
            message: response.reason,
            type: 'success',
            showClose: true,
            duration: 2000
          })
        }
      })

      // }else{
      //     this.materialType.map(data=>{
      //         if (data.id == this.materialListForm.materialType){
      //             this.materialListForm.materialTypeShow = data.title
      //         }
      //     })
      //     this.userList.map(data=>{
      //         if (data.id == this.materialListForm.extractUid){
      //             this.materialListForm.extractUidShow = data.title
      //         }
      //     })
      //     this.list.materialList.push(this.materialListForm);
      //     this.dialogMaterialListForm = false;
      //     this.resetMaterialListForm();
      // }
    },
    handleEditMaterialListForm(row) {
      row.extractTime = row.extractTime * 1000
      this.materialListForm = Object.assign({}, row) // copy obj
      this.dialogMaterialListFormMethod = 'edit'
      this.dialogMaterialListForm = true
    },
    updateMaterialListForm() {
      // if (this.isEdit) {
      var data =Object.assign({}, this.materialListForm)

      if (data.materialCategory.constructor === Array) {
        data.materialCategory = data.materialCategoryShow
      }

      if (data.extractTime.toString().length > 10) { data.extractTime = parseInt(data.extractTime / 1000) }

      updateMaterial(data).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          // this.dialogMaterialListForm = false
          // if (this.isEdit)
          //   this.submitForm()
          // this.fetchData(this.list.id)
          this.resetMaterialListForm()
        } else {
          this.$message({
            message: response.reason,
            type: 'success',
            showClose: true,
            duration: 2000
          })
        }
      })
      // }else{
      //     this.materialType.map(data=>{
      //         if (data.id == this.materialListForm.materialType){
      //             this.materialListForm.materialTypeShow = data.title
      //         }
      //     })
      //     this.userList.map(data=>{
      //         if (data.id == this.materialListForm.extractUid){
      //             this.materialListForm.extractUidShow = data.title
      //         }
      //     })
      //     var temp = Object.assign({}, this.materialListForm)// copy obj
      //     this.dialogMaterialListForm = false;
      //     this.resetMaterialListForm();
      // }
    },
    handleDeleteMaterialListForm(row) {
      // if (this.isEdit) {
      const sendData = {
        id: row.id,
        operation: 'del'
      }
      delMaterial(sendData).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            showClose: true,
            duration: 2000
          })
          if (this.isEdit)
            this.submitForm()
          this.fetchData(this.list.id)
        } else {
          this.$message({
            message: response.reason,
            type: 'success',
            showClose: true,
            duration: 2000
          })
        }
      })
      // }else{
      //     this.list.materialList.splice(index, 1);
      // }
    },
    changeTime(data, type) {
      if (type) {
        if (data.examBeginTime.toString().length > 10) { data.examBeginTime = parseInt(data.examBeginTime / 1000) }
        if (data.examEndTime.toString().length > 10) { data.examEndTime = parseInt(data.examEndTime / 1000) }
        if (data.caseBeginTime.toString().length > 10) { data.caseBeginTime = parseInt(data.caseBeginTime / 1000) }
        if (data.caseEndTime.toString().length > 10) { data.caseEndTime = parseInt(data.caseEndTime / 1000) }
        if (data.caseHappenTime.toString().length > 10) { data.caseHappenTime = parseInt(data.caseHappenTime / 1000) }
      } else {

        if (data.examBeginTime.toString().length === 10) { data.examBeginTime = parseInt(data.examBeginTime * 1000) }
        if (data.examEndTime.toString().length === 10) { data.examEndTime = parseInt(data.examEndTime * 1000) }
        if (data.caseBeginTime.toString().length === 10) { data.caseBeginTime = parseInt(data.caseBeginTime * 1000) }
        if (data.caseEndTime.toString().length === 10) { data.caseEndTime = parseInt(data.caseEndTime * 1000) }
        if (data.caseHappenTime.toString().length === 10) { data.caseHappenTime = parseInt(data.caseHappenTime * 1000) }
      }
      return data
    },
    submitForm(toAddMaterial = false) {
      this.$refs.listForm.validate(valid => {
        if (valid) {
          var data = Object.assign({}, this.list)
          data.caseId = this.caseId
          data = this.changeTime(data, true)
          if (data.instanceNo === this.$store.getters.instanceNo) {
            data.instanceNo = ''
          } if (data.caseNo === this.$store.getters.caseNo) {
            data.caseNo = ''
          } if (data.thirdEvidenceNo === this.$store.getters.evidenceNo) {
            data.thirdEvidenceNo = ''
          }

          if (data.supporterUidArray){
            if (data.supporterUidArray.length > 0) {
              data.supporterUid = data.supporterUidArray.join(',')
            }
          }
          if (data.crimeTimeArray) {
            if (data.crimeTimeArray.length > 0) {
              data.crimeTime = JSON.stringify(data.crimeTimeArray)
            }
          }

          if (data.sceneType) {
            if (data.sceneType.length > 0) {
              data.sceneType = JSON.stringify(data.sceneType)
            }
          }

          if (data.invadeType) {
            if (data.invadeType.length > 0) {
              data.invadeType = JSON.stringify(data.invadeType)
            }
          }

          if (data.escapeType) {
            if (data.escapeType.length > 0) {
              data.escapeType = JSON.stringify(data.escapeType)
            }
          }


          if (data.caseHappenRegion.constructor === Array) {
            data.caseHappenRegion = data.caseHappenRegion.slice(-1)[0]
          }
          if (data.caseCategory.constructor === Array) {
            data.caseCategory = data.caseCategory.slice(-1)[0]
          }
          if (data.sceneType.constructor === Array) {
            data.sceneType = data.sceneType.slice(-1)[0]
          }

          if (data.invadeType.constructor === Array) {
            data.invadeType = data.invadeType.slice(-1)[0]
          }
          if (data.escapeType.constructor === Array) {
            data.escapeType = data.escapeType.slice(-1)[0]
          }
          this.loading = true
          if (this.isEdit) {
            updateSearch(data).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
              } else {
                this.$message({
                  message: response.reason,
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
              }
            })
            this.loading = false
          } else {
            createSearch(data).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })

                this.list = this.changeTime(this.list, false)

                if (toAddMaterial) {
                  const id = response.id
                  this.isEdit = true
                  this.materialListForm.evidenceId = id
                  this.searchId = id
                  this.list.id = id
                  this.dialogPoint = false
                }else{
                  this.$router.push({
                    path: '/search/index',
                    query: {
                      t: +new Date()
                    }
                  })
                  this.$store.dispatch('delView', this.$route)
                }

              } else {
                this.$message({
                  message: response.reason,
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
              }
            })
            this.loading = false
          }
        } else {
          this.$message({
            message: '操作失败，请检查数据',
            type: 'error',
            showClose: true,
            duration: 2000
          })
          this.loading = false
          return false
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
