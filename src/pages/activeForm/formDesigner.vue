<template>
  <div class='form-designer-main' @drop.stop.prevent @dragover.prevent>
    <el-row class="form-designer-main-header" >
      <span class="form-designer-main-header-text">{{translatedAnKa.header.name}}</span>
    </el-row>
    <div class="form-desgner-tables" ref="tablebox" id="tablebox" @scroll.passive="tableBoxScroll"
        @mousewheel="tableMouseWheel"
    >

      <div class="form-designer-main-tabs"  v-for="(tab , tabIndex) in  translatedAnKa.children  "  ref="tab" :key="'ankatable'+tabIndex">
        <mypagenation v-if="tab.child.more" style="margin-bottom: 10px;margin-left: 10px;"
                      :elProps="{total:tab.pageData?tab.pageData.length : 1,'page-size':1,'current-page':tab.currentPage}"
                      @menuClick="pageMenuClick({type:'tab',tab:tab,tabIndex,data:$event})"
                      @pageChange="pageChange({type:'tab',tab:tab,tabIndex,data:$event})"
        ></mypagenation>
        <el-row class="form-designer-pane" >
          <formDesignerpane v-if="tab.child.containers.length===1"  class="form-designer-pain-main"
                             ref="mainpain"
                             :panelName="tab.child.title"
                             :panelID="tab.child.id"
                             :tableData="tab.child.containers[0]"
                            :totalPage="getPanelTotalPage(tab)"
                            :currentPage="getPanelCurrentPage(tab)"
                             @formDesignerpaneItemClick="formDesignerpaneItemClick"
                             @setNowFormPaneAndnowFormPaneDragItem="setNowFormPaneAndnowFormPaneDragItem"
                             @PanelMounted="PanelMounted" @PanelDestory="PanelDestory"
                             @panelUpdated="panelUpdated"
                            @addError="addError"
                            @removeError="removeError"
                            @menuClick="pageMenuClick({type:'table',tab:tab,tabIndex,tableIndex:0,data:$event})"
                            @pageChange="pageChange({type:'table',tab:tab,tabIndex,tableIndex:0,data:$event})"
          ></formDesignerpane>

          <el-tabs v-else   type="card"
                          class= "form-tabs swx-tabs swx-tabs-card"
                          :editable="edit"   :value="tab.currentTableName" @input="tabsValueChange(tab,$event)"
                          @tab-click="tabPanelClick(tabIndex,$event)">
                   <el-tab-pane v-for="(table,tableIndex) in tab.child.containers" :label="table.text" :name="table.text" :key="table.text"

                   >
                     <formDesignerpane     @formDesignerpaneItemClick="formDesignerpaneItemClick"
                                           :tableData="table"
                                           :panelName="tab.child.title"
                                           :panelID="tab.child.id"
                                           :totalPage="getPanelTotalPage(tab,tableIndex+1)"
                                           :currentPage="getPanelCurrentPage(tab,tableIndex+1)"
                                           @setNowFormPaneAndnowFormPaneDragItem="setNowFormPaneAndnowFormPaneDragItem"
                                           @PanelMounted="PanelMounted" @PanelDestory="PanelDestory"
                                           @panelUpdated="panelUpdated"
                                           @addError="addError"
                                           @removeError="removeError"
                                           @menuClick="pageMenuClick({type:'table',tab:tab,tabIndex,tableIndex,data:$event})"
                                           @pageChange="pageChange({type:'table',tab:tab,tabIndex,tableIndex,data:$event})"
                     ></formDesignerpane>
                   </el-tab-pane>
                 </el-tabs>
        </el-row>
      </div>
    </div>
    <div class="form-designer-setting">
      <!--      <el-col :span="24" style="text-align: right">
               <el-select size="mini" v-if="edit" v-model="layout" style="margin-right: 10px;">
                 <el-option v-for="item in formItemSettingsValue.layoutList" :label="item.text" :value="item.val"
                            :key="item.val"></el-option>
               </el-select>
               &lt;!&ndash;<el-switch v-if="edit" v-model="openLayout" style="margin-right: 20px;" active-text="限制" inactive-text="不限制"></el-switch>&ndash;&gt;
               <el-checkbox v-if="edit" v-model="openLayout">限制</el-checkbox>
               <el-checkbox v-if="edit" v-model="showallSetting" style="margin-right: 20px;">全配置</el-checkbox>
               <el-button size="mini" v-if="edit" @click="addpane">添加/修改pane</el-button>
               <el-button size="mini" v-if="edit&&showtaps" @click="delpane">删除pane</el-button>
               <el-button size="mini" type="primary" @click="changemodel">{{editVal}}</el-button>
               <el-button size="mini" @click="mysubmit">查看/保存</el-button>
             </el-col>-->
      <el-button-group  style=" float: right;" >
        <!--<el-button   size="mini" v-if="edit" @click="addpane">添加/修改pane</el-button>-->
        <!--<el-button  size="mini" v-if="edit&&showtaps" @click="delpane">删除pane</el-button>-->
        <!--<el-button size="mini" @click="changemodel">{{editVal}}</el-button>-->
        <el-button class="swx-btn-primary swx-btn-size-mini"  @click="mysubmit" >保存</el-button>
      </el-button-group>
      <el-checkbox  style=" float: right;margin-right: 10px;"  v-if="edit" v-model="showallSetting">全配置</el-checkbox>
        <!--<el-checkbox  style=" float: right;margin-right: 10px;" v-if="edit" v-model="openLayout">限制</el-checkbox>
        <el-select size="mini" v-if="edit" v-model="layout" style="float: right;">
        <el-option v-for="item in formItemSettingsValue.layoutList" :label="item.text" :value="item.val"
                   :key="item.val"></el-option>
      </el-select>-->
    </div>
    <el-dialog class="designer-dialog" title="表单设置" :visible.sync="dialogFormVisible" width="1200px">
      <el-form :inline="true" label-width="120px">
        <el-row> <!--输入框-->
          <el-form-item label="元素键名">
            <el-input v-model="formModalData.key" placeholder="key为必填项"></el-input>
          </el-form-item>
          <el-form-item label="元素label">
            <el-input v-model.trim="formModalData.label"></el-input>
          </el-form-item>
          <el-form-item label="是否必须">
            <el-checkbox v-model="formModalData.isRequire"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="formModalData.isRequire&&formModalData.component==='el-input'" label="字段类型">
            <el-select v-model="formModalData.dataType">
              <el-option v-for="item in formItemSettingsValue.dateTypeList" :label="item.label" :value="item"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'placeholder')" label="placeholder">
            <el-input v-model="formModalData.settings.placeholder" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'active-text')" label="active-text">
            <el-input v-model="formModalData.settings['active-text']"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'inactive-text')" label="inactive-text">
            <el-input v-model="formModalData.settings['inactive-text']"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'texts')" label="texts">
            <el-input v-model="formModalData.texts" placeholder="使用'-'隔开"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'start-placeholder')" label="start-placeholder">
            <el-input v-model="formModalData.settings['start-placeholder']"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'end-placeholder')" label="end-placeholder">
            <el-input v-model="formModalData.settings['end-placeholder']"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'format')" label="format">
            <el-input v-model="formModalData.settings.format" placeholder="请使用日期的标准"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'range-separator')" label="range-separator">
            <el-input v-model="formModalData.settings['range-separator']" placeholder="范围分隔符"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings, 'default-value')" label="default-value">
            <el-input v-model="formModalData.settings['default-value']" placeholder="需要被new Date()解析"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'default-time')" label="default-time">
            <el-input v-model="formModalData.settings['default-time']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'tabindex')" label="tabindex">
            <el-input v-model="formModalData.settings.tabindex" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'score-template')" label="score-template">
            <el-input v-model="formModalData.settings['score-template']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'height')" label="height">
            <el-input v-model="formModalData.settings.height" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'max-height')" label="max-height">
            <el-input v-model="formModalData.settings['max-height']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'debounce')" label="debounce">
            <el-input v-model.number="formModalData.settings.debounce" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timeselectpicker-options')" label="start">
            <el-input v-model="formModalData.settings['timeselectpicker-options'].start" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timeselectpicker-options')" label="end">
            <el-input v-model="formModalData.settings['timeselectpicker-options'].end" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timeselectpicker-options')" label="minTime">
            <el-input v-model="formModalData.settings['timeselectpicker-options'].minTime"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timeselectpicker-options')" label="step">
            <el-input v-model="formModalData.settings['timeselectpicker-options'].step" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timeselectpicker-options')" label="maxTime">
            <el-input v-model="formModalData.settings['timeselectpicker-options'].maxTime"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timepicker-options')" label="selectableRange">
            <el-input v-model="formModalData.settings['timepicker-options'].selectableRange"
                      placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'timepicker-options')" label="format">
            <el-input v-model="formModalData.settings['timepicker-options'].format" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'radiolabel')" label="radiolabel">
            <el-input v-model="formModalData.settings.radiolabel" placeholder="radio的value"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'no-data-text')" label="no-data-text">
            <el-input v-model="formModalData.settings['no-data-text']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'value-key')" label="value-key">
            <el-input v-model="formModalData.settings['value-key']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'uploadtip')" label="uploadtip">
            <el-input v-model="formModalData.settings.uploadtip" placeholder="上传提示文字"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'accept')" label="accept">
            <el-input v-model="formModalData.settings.accept" placeholder="上传文件限制类型"></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'row-class-name')" label="row-class-name">
            <el-input v-model="formModalData.settings['row-class-name']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'cell-class-name')" label="cell-class-name">
            <el-input v-model="formModalData.settings['cell-class-name']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'header-row-class-name')" label="header-row-class-name">
            <el-input v-model="formModalData.settings['header-row-class-name']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'header-cell-class-name')" label="header-cell-class-name">
            <el-input v-model="formModalData.settings['header-cell-class-name']" placeholder=""></el-input>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'empty-text')" label="empty-text">
            <el-input v-model="formModalData.settings['empty-text']" placeholder=""></el-input>
          </el-form-item>

        </el-row>
        <el-row><!--计步器-->
          <el-form-item label="元素宽度" v-if="formModalData.component!=='el-textarea'">
            <el-input-number v-model.number="formModalData.span" :min="1" :max="24"></el-input-number>
          </el-form-item>
      <!--    <el-form-item label="label宽度">
            <el-input-number v-model.number="formModalData.labelWidth"  :min="1"  ></el-input-number>
          </el-form-item>-->
          <el-form-item label="列偏移"  v-if="formModalData.component!=='el-textarea'">
            <el-input-number v-model.number="formModalData.offset" :min="0"  :max="24" ></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'type') && formModalData.settings.type==='textarea'"
                        label="textareaRows">
            <el-input-number v-model.number="formModalData.settings.rows" :min="1" :max="99"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'minlength')" label="minLength">
            <el-input-number v-model.number="formModalData.settings.minlength" :min="1" :max="24"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'maxlength')" label="maxLength">
            <el-input-number v-model.number="formModalData.settings.maxlength" :min="1" :max="24"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'min')" label="min">
            <el-input-number v-model.number="formModalData.settings.min"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'max')" label="max">
            <el-input-number v-model.number="formModalData.settings.max"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'step')" label="step">
            <el-input-number v-model.number="formModalData.settings.step"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'precision')" label="precision">
            <el-input-number v-model.number="formModalData.settings.precision" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'low-threshold')" label="low-threshold">
            <el-input-number v-model.number="formModalData.settings['low-threshold']"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'high-threshold')" label="high-threshold">
            <el-input-number v-model.number="formModalData.settings['high-threshold']"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'multiple-limit')" label="multiple-limit">
            <el-input-number v-model.number="formModalData.settings['multiple-limit']" :min="0"
                             :max="99"></el-input-number>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'limit')" label="limit">
            <el-input-number v-model.number="formModalData.settings.limit"></el-input-number>
          </el-form-item>
        </el-row>
        <el-row>
          <!--下拉选择-->
          <el-form-item v-if="isSettingVisible(formModalData.settings,'type')&&formModalData.component!=='el-textarea'" label="input框类型">
            <el-select v-model="formModalData.settings.type">
              <el-option v-for="item in formItemSettingsValue.inputType" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'controls-position')" label="controls-position">
            <el-select v-model="formModalData.settings['controls-position']">
              <el-option label="default" value="default"></el-option>
              <el-option label="right" value="right"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'color-format')" label="color-format">
            <el-select v-model="formModalData.settings['color-format']">
              <el-option label="rgb" value="rgb"></el-option>
              <el-option label="hsl" value="hsl"></el-option>
              <el-option label="hsv" value="hsv"></el-option>
              <el-option label="hex" value="hex"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'datepickertype')" label="type">
            <el-select v-model="formModalData.settings.datepickertype">
              <el-option v-for="item in formItemSettingsValue.datepickerTypes" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
          </el-form-item>
      <!--    <el-form-item v-if="isSettingVisible(formModalData.settings,'size')" label="size">
            <el-select v-model="formModalData.settings.size">
              <el-option label="large" value="large"></el-option>
              <el-option label="medium " value="medium "></el-option>
              <el-option label="small" value="small"></el-option>
              <el-option label="mini" value="mini"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item v-if="isSettingVisible(formModalData.settings,'align')" label="align">
            <el-select v-model="formModalData.settings.align">
              <el-option v-for="item in formItemSettingsValue.alignList" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'prefix-icon')" label="prefix-icon">
            <el-select v-model="formModalData.settings['prefix-icon']">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'clear-icon')" label="clear-icon">
            <el-select v-model="formModalData.settings['clear-icon']">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'suffix-icon')" label="suffix-icon">
            <el-select v-model="formModalData.settings['suffix-icon']">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'auto-complete')" label="auto-complete">
            <el-select v-model="formModalData.settings['auto-complete']">
              <el-option key="off" label="off" value="off"></el-option>
              <el-option key="on" label="on" value="on"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'resize')" label="resize">
            <el-select v-model="formModalData.settings.resize">
              <el-option v-for="item in formItemSettingsValue.resizeList" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'void-icon-class')" label="void-icon-class">
            <el-select v-model="formModalData.settings['void-icon-class']">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'disabled-void-icon-class')"
                        label="disabled-void-icon-class">
            <el-select v-model="formModalData.settings['disabled-void-icon-class']">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'icon-classes')" label="icon-classes1">
            <el-select v-model="formModalData.settings['icon-classes'][0]">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'icon-classes')" label="icon-classes2">
            <el-select v-model="formModalData.settings['icon-classes'][1]">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'icon-classes')" label="icon-classes3">
            <el-select v-model="formModalData.settings['icon-classes'][2]">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'input-size')" label="input-size">
            <el-select v-model="formModalData.settings['input-size']">
              <el-option v-for="item in formItemSettingsValue.inputSizeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'expand-trigger')" label="expand-trigger">
            <el-select v-model="formModalData.settings['expand-trigger']">
              <el-option v-for="item in formItemSettingsValue.triggerList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'buttonType')" label="buttonType">
            <el-select v-model="formModalData.settings.buttonType">
              <el-option v-for="item in formItemSettingsValue.buttonTypeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'icon')" label="icon">
            <el-select v-model="formModalData.settings.icon">
              <el-option v-for="item in formItemSettingsValue.iconsList" :key="item" :label="item" :value="item">
                <i :class="item"></i>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'list-type')" label="list-type">
            <el-select v-model="formModalData.settings['list-type']">
              <el-option v-for="item in formItemSettingsValue.listTypeList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'tooltip-effect')" label="tooltip-effect">
            <el-select v-model="formModalData.settings['tooltip-effect']">
              <el-option label="dark" value="dark"></el-option>
              <el-option label="light " value="light "></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <!--选框-->
          <el-form-item v-if="isSettingVisible(formModalData.settings,'auto-upload')" label="auto-upload">
            <el-checkbox v-model="formModalData.settings['auto-upload']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'selfhandleFile')" label="selfhandleFile">
            <el-checkbox v-model="formModalData.settings.selfhandleFile">不使用控件上传，自己处理就勾选</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'disabled')" label="disabled">
            <el-checkbox v-model="formModalData.settings.disabled">禁用</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'controls')" label="controls">
            <el-checkbox v-model="formModalData.settings.controls">controls</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'allow-half')" label="allow-half">
            <el-checkbox v-model="formModalData.settings['allow-half']">allow-half</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-text')" label="show-text">
            <el-checkbox v-model="formModalData.settings['show-text']">文字分数不能同时显示</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-score')" label="show-score">
            <el-checkbox v-model="formModalData.settings['show-score']">文字分数不能同时显示</el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-alpha')" label="show-alpha">
            <el-checkbox v-model="formModalData.settings['show-alpha']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'readonly')" label="readonly">
            <el-checkbox v-model="formModalData.settings['readonly']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'editable')" label="editable">
            <el-checkbox v-model="formModalData.settings['editable']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'clearable')" label="clearable">
            <el-checkbox v-model="formModalData.settings['clearable']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'unlink-panels')" label="unlink-panels">
            <el-checkbox v-model="formModalData.settings['unlink-panels']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'autofocus')" label="autofocus">
            <el-checkbox v-model="formModalData.settings.autofocus"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-input')" label="show-input">
            <el-checkbox v-model="formModalData.settings['show-input']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-input-controls')" label="show-input-controls">
            <el-checkbox v-model="formModalData.settings['show-input-controls']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-stops')" label="show-stops">
            <el-checkbox v-model="formModalData.settings['show-stops']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-tooltip')" label="show-tooltip">
            <el-checkbox v-model="formModalData.settings['show-tooltip']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'range')" label="range">
            <el-checkbox v-model="formModalData.settings.range"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'vertical')" label="vertical">
            <el-checkbox v-model="formModalData.settings.vertical"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'is-range')" label="is-range">
            <el-checkbox v-model="formModalData.settings['is-range']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'arrow-control')" label="arrow-control">
            <el-checkbox v-model="formModalData.settings['arrow-control']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'border')" label="border">
            <el-checkbox v-model="formModalData.settings.border"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'radiobutton')" label="radioButton">
            <el-checkbox v-model="formModalData.settings.radiobutton"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'checkbutton')" label="checkbutton">
            <el-checkbox v-model="formModalData.settings.checkbutton"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'checked')" label="checked">
            <el-checkbox v-model="formModalData.settings.checked"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'indeterminate')" label="indeterminate">
            <el-checkbox v-model="formModalData.settings.indeterminate"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'multiple')" label="multiple">
            <el-checkbox v-model="formModalData.settings.multiple"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'collapse-tags')" label="collapse-tags">
            <el-checkbox v-model="formModalData.settings['collapse-tags']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'automatic-dropdown')" label="automatic-dropdown">
            <el-checkbox v-model="formModalData.settings['automatic-dropdown']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'remote')" label="远程获取数据">
            <el-checkbox v-model="formModalData.settings['remote']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-all-levels')" label="show-all-levels">
            <el-checkbox v-model="formModalData.settings['show-all-levels']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'change-on-select')" label="change-on-select">
            <el-checkbox v-model="formModalData.settings['change-on-select']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'plain')" label="plain">
            <el-checkbox v-model="formModalData.settings.plain"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'round')" label="round">
            <el-checkbox v-model="formModalData.settings.round"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-file-list')" label="show-file-list">
            <el-checkbox v-model="formModalData.settings['show-file-list']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'drag')" label="drag">
            <el-checkbox v-model="formModalData.settings.drag"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'stripe')" label="stripe">
            <el-checkbox v-model="formModalData.settings.stripe"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'fit')" label="fit">
            <el-checkbox v-model="formModalData.settings.fit"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'show-header')" label="show-header">
            <el-checkbox v-model="formModalData.settings['show-header']"></el-checkbox>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'highlight-current-row')"
                                       label="highlight-current-row">
          <el-checkbox v-model="formModalData.settings['highlight-current-row']"></el-checkbox>
        </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'default-expand-all')"
                        label="default-expand-all">
            <el-checkbox v-model="formModalData.settings['default-expand-all']"></el-checkbox>
          </el-form-item>

        </el-row>
        <el-row>
          <!--颜色选择器-->
          <el-form-item v-if="isSettingVisible(formModalData.settings,'colors')" label="colors1">
            <el-color-picker v-model="formModalData.settings.colors[0]"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'colors')" label="colors2">
            <el-color-picker v-model="formModalData.settings.colors[1]"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'colors')" label="colors3">
            <el-color-picker v-model="formModalData.settings.colors[2]"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'void-color')" label="void-color">
            <el-color-picker v-model="formModalData.settings['void-color']"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'disabled-void-color')" label="disabled-void-color">
            <el-color-picker v-model="formModalData.settings['disabled-void-color']"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'text-color')" label="text-color">
            <el-color-picker v-model="formModalData.settings['text-color']"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'fill')" label="fill">
            <el-color-picker v-model="formModalData.settings.fill"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'active-color')" label="active-color">
            <el-color-picker v-model="formModalData.settings['active-color']"></el-color-picker>
          </el-form-item>
          <el-form-item v-if="isSettingVisible(formModalData.settings,'inactive-color')" label="inactive-color">
            <el-color-picker v-model="formModalData.settings['inactive-color']"></el-color-picker>
          </el-form-item>
        </el-row>
        <!--一整行-->
        <el-form-item v-if="isSettingVisible(formModalData.settings,'select-data')&&!formModalData.settings.remote"
                      label="select-data" class="radio-group-data">
          <el-row v-for="(item,index) in formModalData.settings['select-data']" :key="index">
            <el-input v-model="item.value" placeholder="radio的text"></el-input>
            <el-input v-model="item.label" placeholder="radio的value"></el-input>
            <el-checkbox v-model="item.disabled">disabled</el-checkbox>
            <el-button size="mini" @click="groupAddItem(formModalData.settings['select-data'],index,'option')">+
            </el-button>
            <el-button size="mini" @click="groupDelItem(formModalData.settings['select-data'],index,'option')">-
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item v-if="isSettingVisible(formModalData.settings,'radio-group-data')" label="radio-group-data"
                      class="radio-group-data">
          <el-row v-for="(item,index) in formModalData.settings['radio-group-data']" :key="index">
            <el-input v-model="item.text" placeholder="radio的text"></el-input>
            <el-input v-model="item.label" placeholder="radio的value"></el-input>
            <el-checkbox v-model="item.disabled">disabled</el-checkbox>
            <el-checkbox v-model="item.border">border</el-checkbox>
            <el-button size="mini" @click="groupAddItem(formModalData.settings['radio-group-data'],index,'radio')">+
            </el-button>
            <el-button size="mini" @click="groupDelItem(formModalData.settings['radio-group-data'],index,'radio')">-
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item v-if="isSettingVisible(formModalData.settings,'check-group-data')" label="check-group-data"
                      class="check-group-data">
          <el-row v-for="(item,index) in formModalData.settings['check-group-data']" :key="index">
            <el-input v-model="item.text" placeholder="check的text"></el-input>
            <el-input v-model="item.label" placeholder="check的value"></el-input>
            <el-checkbox v-model="item.disabled">disabled</el-checkbox>
            <el-checkbox v-model="item.border">border</el-checkbox>
            <el-checkbox v-model="item.checked">checked</el-checkbox>
            <el-checkbox v-model="item.indeterminate">indeterminate</el-checkbox>
            <el-button size="mini" @click="groupAddItem(formModalData.settings['check-group-data'],index,'checkbox')">
              +
            </el-button>
            <el-button size="mini" @click="groupDelItem(formModalData.settings['check-group-data'],index,'checkbox')">
              -
            </el-button>
          </el-row>
        </el-form-item>
        <el-form-item v-if="isSettingVisible(formModalData.settings,'uploadUrl')" label="上传地址" class="uploadUrl">
          <el-input v-model="formModalData.settings.uploadUrl" placeholder="上传文件地址"></el-input>
        </el-form-item>
        <el-form-item v-if="isSettingVisible(formModalData.settings,'remoteUrl')&&formModalData.settings.remote"
                      label="远程地址" class="remoteURL">
          <el-input v-model="formModalData.settings['remoteUrl']"
                    placeholder="可以直接get请求的地址，返回参数包含status=success data=[]"></el-input>
        </el-form-item>
        <el-form-item v-if="isSettingVisible(formModalData.settings,'tableColumns')" label="tableColumns"
                      class="check-group-data">
          <el-row v-for="(item,index) in formModalData.settings['tableColumns']" :key="index">
            <el-input size="mini" v-model="item.label" placeholder="显示标题label"></el-input>
            <el-input size="mini" v-model="item.prop" placeholder="数据字段prop"></el-input>
            <el-input size="mini" v-model="item.width" placeholder="列宽width"></el-input>
            <el-select size="mini"  v-model="item.align">
              <el-option v-for="item in formItemSettingsValue.alignList" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
            <el-select size="mini"  v-model="item.fixed">
              <el-option v-for="item in formItemSettingsValue.fixedList" :label="item" :value="item"
                         :key="item"></el-option>
            </el-select>
            <el-checkbox v-model="item['show-overflow-tooltip']">show-overflow-tooltip</el-checkbox>
            <el-checkbox v-model="item.border">border</el-checkbox>
            <el-button size="mini" @click="groupAddItem(formModalData.settings['tableColumns'],index,'tableColumns')">
              +
            </el-button>
            <el-button size="mini" @click="groupDelItem(formModalData.settings['tableColumns'],index,'tableColumns')">
              -
            </el-button>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFormStyle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import formDesignerStatic from "./formDesignerStatic";

export default {
  name: "formDesigner",
  props: {
    data: { type: Object },
    currenTab: { type: Object },
    currentTable: { type: Object }
  },
  data() {
    return {
      showtaps: false,
      nowformPaneName: "first",
      formModalData: { settings: {}, isRequire: false },
      formItemSettingsValue: formDesignerStatic.formItemSettingsValue,
      nowFormPane: null,
      nowFormPaneDragItem: null,
      dropToIndex: -1,
      dialogFormVisible: false,
      translatedAnKa: { header: { name: "" }, children: [] },
      panels: [],
      tableItems: [],
      scrollTimer: null,
      errors: []
    };
  },
  provide() {
    return {
      formDedigner: this
    };
  },
  methods: {
    translateFormItem: formDesignerStatic.translateFormItem,
    groupAddItem: formDesignerStatic.groupAddItem,
    groupDelItem: formDesignerStatic.groupDelItem,
    isSettingVisible: formDesignerStatic.isSettingVisible,
    saveFormStyle() {
      this.nowFormPane.saveFormStyle(this.formModalData);
      this.dialogFormVisible = false;
    },
    formDesignerpaneItemClick(pane, item) {
      this.nowFormPane = pane;
      this.formModalData = item;
      this.dialogFormVisible = true;
    }, //名字有误，实际上是打开设置面板的方法
    setNowFormPaneAndnowFormPaneDragItem(pane, dragItem) {
      this.nowFormPane = pane;
      this.nowFormPaneDragItem = dragItem;
    }, //拖拽表单元素时，记录当前拖动的panel以及拖动的表单元素
    getAllPanes() {
      return this.panels;
    }, //获取当前设计器中所有panel的方法
    validateAllPanels() {
      this.$emit("clearErrors");
      return this.getAllPanes()
        .map(item => item.validField())
        .every(i => i);
    }, //调用当前设计器中所有的table进行表单验证
    mysubmit() {
      let formValid = this.validateAllPanels();
      this.$notify({
        title: "表单验证",
        message: formValid ? "通过" : "未通过",
        type: formValid ? "success" : "error"
      });
      let Data = this.translatedAnKa.children.map(tab => {
        this.saveTabValue(tab, tab.currentPage - 1, "notClearValid");
        this.setTabValue(
          tab,
          tab.pageData[tab.currentPage - 1],
          "notClearValid"
        );
        return tab.pageData;
      });
      console.log(this.translatedAnKa);
      console.log("DataData");
      console.log(Data);
      console.log(JSON.stringify(Data));

      // console.log(JSON.stringify(this.translatedAnKa));
    }, //点击保存按钮向后台提交数据的方法
    getAllTableItem() {
      return this.tableItems;
    }, //将当前设计器中所有的表中的数据，平铺为表单元素的数组，方便其他地方使用
    panelUpdated() {
      this.setSrollList();
    }, //当设计器中的panel更新时，从新获取一下最新的panel的位置，用于滚动
    setSrollList() {
      clearTimeout(this.setScrollListTimer);
      this.setScrollListTimer = setTimeout(() => {
        this.tablelistScrollList = this.$refs.tab.map(i => i.offsetTop);
      }, 200);
    }, //一个抽取的保存panel位置的方法，已经使用定时器进行了截流，不会立即保存，而是有延迟debounce效果
    initTable(tab, table, tabIndex, tableIndex) {
      return {
        text: table.text,
        more: table.more,
        container: {
          controlType: table.container.controlType,
          children: table.container.children.map(row => {
            return {
              children: row.children.map(item => {
                let tempItem = this.translateFormItem(
                  item,
                  tabIndex,
                  tableIndex
                );
                this.tableItems.push(tempItem);
                return tempItem;
              })
            };
          })
        }
      };
    }, //转化table的方法，用于将老版本的案卡系统的数据转化为当前的表数据
    PanelMounted(panel) {
      if (panel) {
        this.panels.push(panel);
      }
    }, //panel的挂载事件，当panel挂载时，保存panel
    PanelDestory(panel) {
      if (panel) {
        this.panels.splice(this.panels.indexOf(panel), 1);
      }
    }, //panel的卸载事件，当panel卸载时，移除
    tableBoxScroll(e) {
      if (this.changing) return;
      this.scrollCount = this.scrollCount ? this.scrollCount + 1 : 1;
      if (this.scrollCount % 3 !== 0) return;
      let scrollTop = e.target.scrollTop;
      let near = this.tablelistScrollList.map(i => Math.abs(i - scrollTop));
      let min = Math.min(...near);
      if (min < 20) {
        let tab = this.data.children[near.indexOf(min)];
        let currentTableName = this.translatedAnKa.children[near.indexOf(min)]
          .currentTableName;
        let table = tab.child.containers.filter(
          tb => tb.text === currentTableName
        )[0];
        this.$emit("currentTableChange", {
          tab,
          table
        });
      }
    }, //设计器中的容器框滚动事件，用于同步设计器中的容器与左侧的导航
    tableMouseWheel() {
      if (!this.changing) return;
      clearInterval(this.scrollTimer);
      this.changing = false;
    }, //在容器中滚动鼠标滚轮事件，用于停止正在进行的滚动，将用户的滚动优先级提到最高
    animateToTab(n) {
      if (!this.tablelistScrollList) return;
      let target = this.tablelistScrollList[this.data.children.indexOf(n)];
      this.animateTo(target);
    }, //当currenttab改变时，将容器滚动到相应的位置
    animateToError(data) {
      let errTab = this.translatedAnKa.children[data.item.tabIndex];
      let errorTable = errTab.child.containers[data.item.tableIndex];
      errTab.currentTableName = errorTable.text;
      this.$nextTick(() => {
        let targetEl = document.getElementById(data.item.elId);
        let tablistY =
          targetEl.offsetParent.offsetParent.offsetParent.offsetParent
            .offsetTop;
        let tempElToTabList =
          targetEl.offsetParent.offsetParent.offsetParent.offsetTop;
        let errorTab = this.data.children[data.item.tabIndex];
        if (errorTab.child.containers.length === 1) {
          this.animateTo(tempElToTabList + tablistY);
        } else if (errorTab.child.containers.length > 1) {
          tablistY =
            targetEl.offsetParent.offsetParent.offsetParent.offsetParent
              .offsetParent.offsetTop;
          this.animateTo(tempElToTabList + tablistY);
        }
      });
    }, //当用户点击错误提示时，将容器滚动到相对应的错误位置
    animateTo(target) {
      this.changing = true;
      clearInterval(this.scrollTimer);
      let tablebox = document.getElementById("tablebox");
      let llast = -1;
      let last = tablebox.scrollTop;
      let step = 10;
      this.scrollTimer = setInterval(() => {
        llast = last;
        tablebox.scrollTop = last + (target - last) / step;
        last = tablebox.scrollTop;
        if (Math.abs(target - last) < 3) {
          clearInterval(this.scrollTimer);
          tablebox.scrollTop = target;
          this.changing = false;
        } else if (Math.abs(target - last) < 10) {
          step = 2;
        } else if (Math.abs(target - last) < 30) {
          step = 3;
        } else if (Math.abs(target - last) < 100) {
          step = 5;
        } else if (llast === last) {
          clearInterval(this.scrollTimer);
        }
      }, 20);
    }, //一个抽取的滚动容器到指定位置的方法，
    translateAnka() {
      let tempAnka = {};
      this.tableItems = [];
      if (this.data) {
        tempAnka.header = this.data.header;
        tempAnka.controlType = this.data.controlType;
        tempAnka.children = this.data.children.map((tab, tabIndex) => {
          return {
            currentTableName: tab.child.containers[0].text,
            pageData: null,
            currentPage: 1,
            child: {
              controlType: tab.child.controlType,
              id: tab.child.id,
              more: tab.child.more,
              title: tab.child.titlem,
              currentPage: 1,
              containers: tab.child.containers.map((table, tableIndex) => {
                return this.initTable(tab, table, tabIndex, tableIndex);
              })
            }
          };
        });
      }
      this.translatedAnKa = tempAnka;
      this.initPanelsFormModal();
      this.initTabPageData();
    }, //将老版本的案卡系统的数据进行转化为本系统所需要的数据
    initPanelsFormModal() {
      clearInterval(this.initFormTimer);
      let tableNum = 0;
      this.translatedAnKa.children.forEach(tab => {
        tableNum += tab.child.containers.length;
      });
      this.initFormTimer = setInterval(() => {
        if (this.getAllPanes().length === tableNum) {
          this.getAllPanes().forEach(item => item.changemodel());
          this.setSrollList();
          clearInterval(this.initFormTimer);
          this.$emit("clearErrors");
          console.log("数据加载完成");
        } else {
          console.log("数据正在加载");
        }
      }, 100);
    }, //刷新panel的方法
    setCurrentTable(table, tab) {
      this.translatedAnKa.children[
        this.data.children.indexOf(tab)
      ].currentTableName =
        table.text;
    }, //用户点击左侧导航时，同步本设计器中的table
    tabPanelClick(tabindex, event) {
      let tab = this.data.children[tabindex];
      let table = tab.child.containers.filter(tb => tb.text === event.name)[0];
      this.$emit("currentTableChange", {
        tab,
        table
      });
    }, //用户选中
    tabsValueChange(tab, val) {
      tab.currentTableName = val;
      this.setSrollList();
    },
    addError(data) {
      this.$emit("addError", data);
    },
    removeError(data) {
      this.$emit("removeError", data);
    },
    getTableByTableData(table) {
      return this.getAllPanes().filter(panel => {
        return panel.tableData === table;
      })[0];
    },
    setTableValue(table, data, flag) {
      let tempTableData = {};
      table.container.children.forEach(row => {
        row.children.forEach(item => {
          tempTableData[item.key] = item.val;
          if (flag === "notClearValid") return;
          if (!data) {
            item.val = null;
          } else {
            item.val = data[item.key];
          }
        });
      });
      if (flag !== "notClearValid") {
        this.getTableByTableData(table).setFromModel();
      }
      return tempTableData;
    },
    setTabValue(tab, data, flag) {
      let pagedata = tab.child.containers.map((table, index) => {
        let tempTableData = null;
        if (data) {
          tempTableData = this.setTableValue(
            table,
            data.tabPageData[index][data.currentTablePages[index] - 1],
            flag
          );
        } else {
          tempTableData = this.setTableValue(table);
        }
        if (data) {
          data.tabPageData[index].splice(
            data.currentTablePages[index] - 1,
            1,
            tempTableData
          );
          return data.tabPageData[index];
        } else {
          return [tempTableData];
        }
      });
      let currentTablePages = data
        ? data.currentTablePages
        : tab.child.containers.map(() => 1);
      return { tabPageData: pagedata, currentTablePages };
    },
    saveTabValue(tab, pageIndex, flag) {
      tab.pageData[pageIndex] = this.setTabValue(
        tab,
        tab.pageData[pageIndex],
        flag
      );
    },
    saveTableValue(tab, tableIndex, tabpage, data) {
      let tempTableaData = this.setTableValue(
        data.table,
        tab.pageData[tabpage].tabPageData[tableIndex][
          tab.pageData[tabpage].currentTablePages[tableIndex] - 1
        ]
      );
      this.setTableValue(
        data.table,
        tab.pageData[tabpage].tabPageData[tableIndex][data.page - 1]
      );
      tab.pageData[tabpage].tabPageData[tableIndex][
        tab.pageData[tabpage].currentTablePages[tableIndex] - 1
      ] = tempTableaData;
    },
    initTabPageData() {
      clearTimeout(this.iniTabPageDataTimer);
      this.iniTabPageDataTimer = setTimeout(() => {
        let tempTranslatedAnka = Object.assign({}, this.translatedAnKa);
        tempTranslatedAnka.children.forEach(tab => {
          tab.pageData = [this.setTabValue(tab)];
          this.setTabValue(tab, tab.pageData[0]);
        });
        this.translatedAnKa = tempTranslatedAnka;
      }, 300);
    },
    pageMenuClick({ type, tab, tabIndex, tableIndex, data }) {
      let formValid = this.validateAllPanels();
      if (formValid) return;
      if (type === "tab") {
        if (data === "add") {
          if (!tab.pageData) {
            tab.pageData = [this.setTabValue(tab), this.setTabValue(tab)];
          } else {
            this.saveTabValue(tab, tab.currentPage - 1);
            tab.pageData.push(this.setTabValue(tab));
          }
          tab.currentPage = tab.pageData.length;
        } else if (data === "del") {
          if (tab.pageData.length === 1) {
            this.setTabValue(tab);
            tab.pageData = [this.setTabValue(tab)];
          } else {
            this.setTabValue(tab);
            tab.pageData.splice(tab.currentPage - 1, 1);
            tab.currentPage = tab.currentPage > 1 ? tab.currentPage - 1 : 1;
            this.setTabValue(tab, tab.pageData[tab.currentPage - 1]);
          }
        }
      } else if (type === "table") {
        let currentTable = tab.child.containers[tableIndex];
        if (data.data === "add") {
          console.log(type, tab, tabIndex, tableIndex, data);
          tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].splice(
            tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] - 1,
            1,
            this.setTableValue(currentTable)
          );
          tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].push(
            this.setTableValue(currentTable)
          );
          tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] =
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].length;
        } else if (data.data === "del") {
          this.setTableValue(currentTable);
          if (
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].length ===
            1
          ) {
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex] = [
              this.setTableValue(currentTable)
            ];
          } else {
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex].splice(
              tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] -
                1,
              1
            );
          }
          let currentTablePages =
            tab.pageData[tab.currentPage - 1].currentTablePages;
          currentTablePages[tableIndex] =
            currentTablePages[tableIndex] > 1
              ? currentTablePages[tableIndex] - 1
              : 1;

          this.setTableValue(
            currentTable,
            tab.pageData[tab.currentPage - 1].tabPageData[tableIndex][
              currentTablePages[tableIndex] - 1
            ]
          );
        }
      }
      this.translatedAnKa = Object.assign({}, this.translatedAnKa);
      this.$emit("clearErrors");
    },
    pageChange({ type, tab, tabIndex, tableIndex, data }) {
      let formValid = this.validateAllPanels();
      if (formValid) return;
      if (type === "tab") {
        this.saveTabValue(tab, tab.currentPage - 1);
        this.setTabValue(tab, tab.pageData[data - 1]);
        tab.currentPage = data;
        if (tabIndex) {
          console.log("这句代码是为了让eslint通过,并不会执行");
        }
      } else if (type === "table") {
        // console.log(type, tab, tabIndex, tableIndex, data);
        this.saveTableValue(tab, tableIndex, tab.currentPage - 1, data);
        tab.pageData[tab.currentPage - 1].currentTablePages[tableIndex] =
          data.page;
      }
      this.translatedAnKa = Object.assign({}, this.translatedAnKa);
      this.$emit("clearErrors");
    },
    getPanelTotalPage(tab, tableIndex) {
      if (!tab.pageData) return 1;
      if (!tableIndex) {
        return tab.pageData[tab.currentPage - 1].tabPageData[0].length;
      } else {
        return tab.pageData[tab.currentPage - 1].tabPageData[tableIndex - 1]
          .length;
      }
    },
    getPanelCurrentPage(tab, tableIndex) {
      if (!tab.pageData) return 1;
      if (!tableIndex) {
        return tab.pageData[tab.currentPage - 1].tabPageData[0].length;
      } else {
        return tab.pageData[tab.currentPage - 1].tabPageData[tableIndex - 1]
          .length;
      }
    }
  },
  components: {
    myElement: () => import("./myElement.vue"),
    formDesignerpane: () => import("./formDesignerpane.vue"),
    mypagenation: () => import("./components/activeFormPagenation.vue")
  },
  computed: {
    edit: {
      get() {
        return this.$store.state.formDesigner.edit;
      }
    },
    editVal() {
      return this.edit ? "关闭编辑" : "编辑";
    },
    showallSetting: {
      get() {
        return this.$store.state.formDesigner.allSettting;
      },
      set(val) {
        this.$store.commit("formDesigner/setAllSettting", val);
      }
    },
    openLayout: {
      get() {
        return this.$store.state.formDesigner.openLayout;
      },
      set(val) {
        this.$store.commit("formDesigner/setOpenLayout", val);
      }
    },
    hasFile() {
      return this.getAllTableItem().some(i => {
        return ["el-upload", "el-image"].indexOf(i.component) > -1;
      });
    }
  },
  watch: {
    data() {
      this.translateAnka();
    },
    currenTab(n) {
      this.animateToTab(n);
    }
  },
  mounted() {
    this.translateAnka();
  }
};
</script>
<style lang="less">
.form-designer-main {
  position: relative;
  height: 100%;
  padding-right: 10px;
  overflow: auto;
  .form-designer-main-header {
    height: 40px;
    line-height: 30px;
    padding-bottom: 10px;
    text-align: left;
    border-bottom: 1px solid #d3d3d3;
    .form-designer-main-header-text {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      /*border-left: 3px solid #134b89;*/
      padding-left: 10px;
      font-size: 24px;
      color: #333333;
    }
  }
  .form-designer-main-tabs {
    margin: 10px 20px 0;
    padding-top: 10px;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
  .form-desgner-tables {
    height: calc(100% - 40px);
    border: 1px solid #adc0e0;
    padding-bottom: 40px;
    overflow: auto;
  }
  .form-designer-setting {
    position: absolute;
    bottom: 4px;
    right: 0;
    width: 100%;
    height: 30px;
    padding-right: 40px;
  }
}

.form-designer-pane {
  position: relative;
  /*height: calc(100% - 30px);*/
  background-color: #fff;
  padding: 0;
  border-radius: 10px;
  .form-designer-pain-main {
    width: 100%;
    /*overflow: hidden;*/
  }
  .myform-el-row {
    padding: 0 10px;
    margin: 0 !important;
    box-sizing: border-box;
  }
}
.el-tabs {
  height: 100%;
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__content {
    height: calc(100% - 50px);
    .el-tab-pane {
      height: 100%;
      overflow: auto;
    }
  }
}
.form-tabs {
  /*padding: 0 10px;*/
}
.target {
  position: relative;
  height: 100%;
  min-width: 600px;
  background-color: #fff;
  padding: 10px 0;
  border-radius: 10px;
}
.radio-group-data,
.check-group-data,
.remoteURL {
  width: 100% !important;
}

.radio-group-data .el-form-item__content,
.check-group-data .el-form-item__content {
  width: calc(100% - 135px);
}

.radio-group-data .el-form-item__content .el-input {
  width: 30%;
}

.check-group-data .el-form-item__content .el-input {
  width: 15%;
}

.remoteURL .el-form-item__content {
  width: calc(100% - 130px);
}

.designer-dialog .el-form-item {
  width: calc(33% - 10px);
}
.el-form-item {
  margin-bottom: 0px !important;
}

.close-item {
  position: absolute;
  z-index: 3;
  right: 0;
  top: 0;
  padding: 2px;
  color: #ccc;
}
.editItem {
  /*border: 1px solid #efefef;*/
  /*border-radius: 5px;*/
  /*background-color: #cccccc;*/
}
.resizeBar {
  position: absolute;
  right: -25px;
  top: 50%;
  z-index: 2;
  margin-top: -20px;
  height: 56px;
  width: 50px;
  background-color: red;
  opacity: 0;
  cursor: col-resize;
}
.my-element {
  position: relative;
  padding: 5px 10px 0 10px !important;
  /*min-height: 64px;*/
  /*border: 1px solid #000;*/
  /*overflow: hidden;*/
  .el-checkbox,
  .el-radio {
    margin-bottom: 0;
  }
  .el-range-editor {
    position: absolute;
  }
  .el-form-item--mini {
    min-height: 28px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-color-picker,
    .el-range-editor {
      height: 28px;
    }

    .el-rate {
      padding: 6px 0;
    }
  }
  .el-form-item--small {
    min-height: 32px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 32px;
    }
    .el-rate {
      padding: 8px 0;
    }
  }
  .el-form-item--medium {
    min-height: 36px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 36px;
    }
    .el-rate {
      padding: 9px 0;
    }
  }
  .el-form-item--default {
    min-height: 40px;
    .el-rate,
    .el-slider,
    .el-checkbox-group,
    .el-upload,
    .el-color-picker,
    .el-range-editor {
      height: 40px;
    }
    .el-rate {
      padding: 12px 0;
    }
  }
  .el-slider {
    padding: 1px 0;
  }
  .el-color-picker,
  .el-input-number,
  .el-input,
  .el-select,
  .el-cascader {
    display: block;
  }
  .el-form-item__content {
  }
  .el-form-item__label {
    max-height: 40px;
    margin-bottom: 0;
    line-height: 16px;
    font-size: 12px;
  }
  .changeWidthbtns,
  .close-item {
    display: none;
  }
}
.my-element:hover {
  .changeWidthbtns,
  .close-item {
    display: block;
  }
}
.changeWidthbtns {
  position: absolute;
  right: -5px;
  top: 50%;
  z-index: 2;
  margin-top: -10px;
  height: 20px;
  width: 40px;
  user-select: none;
  span {
    color: #ccc;
    cursor: pointer;
    &:hover {
      color: #a4a4a4;
    }
  }
}

.el-form-item__error {
  opacity: 0;
  height: 0;
}
.el-tab-pane {
  display: block !important;
  &[aria-hidden="true"] {
    height: 0 !important;
    opacity: 0;
  }
}
</style>
