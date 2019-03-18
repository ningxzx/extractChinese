<template>
  <div class="supplier-order-manage">
    <bread-crumb></bread-crumb>
    <div class="main-content">
      <div class="manage-state">
        <div class="main-state-search">
          <div class="search-content">
            <el-row>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32">{{$t('supplierOrderManage.orderNumber')}}&nbsp;</el-col>
                  <el-col :span="16">
                    <el-input v-model="searchCondition.orderNumber" :placeholder="$t('supplierOrderManage.inputOrderNum')" maxlength="25"></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32">{{$t("customs.Customs declaration type")}}&nbsp;</el-col>
                  <el-col :span="16">
                    <el-select v-model="searchCondition.customsType" style="width:100%" @change="searchByConditon(true)">
                      <el-option label="$t('customs.All')" value="0"></el-option>
                      <el-option label="$t('customs.Export')" value="1"></el-option>
                      <el-option label="$t('customs.At most 5 statements can be uploaded')" value="2"></el-option>
                      <el-option label="$t('customs.Import with tax refund') " value="3"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32">{{$t("customs.Customs Broker Name")}}&nbsp;</el-col>
                  <el-col :span="16">
                    <el-input v-model="searchCondition.broker" placeholder="请输入报关行名称"></el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="search-content">
            <el-row>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32">{{$t("customs.Customs Declaration Status")}}&nbsp;</el-col>
                  <el-col :span="16">
                    <el-select v-model="searchCondition.declarationStatus" placeholder="$t('customs.Please select customs declaration status')" style="width:100%" @change="searchByConditon(true)">
                      <el-option :label="item" v-for="(item,index) in declarationStatusArr" :key="index" :value="index"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32">{{$t("customs.Order Status")}}&nbsp;</el-col>
                  <el-col :span="16">
                    <el-select v-model="searchCondition.orderStatus" style="width:100%" @change="searchByConditon(true)">
                      <el-option :label="item" v-for="(item,index) in orderStatusArr" :key="index" :value="index"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div class="search-btn">
            <el-row>
              <el-col :span="6">
                <el-row>
                  <el-col :span="8" class="t-right line-height-32"></el-col>
                  <el-col :span="16">
                    <el-button class="order-search" @click="searchByConditon(true)" type="primary">{{$t('supplierOrderManage.search')}}</el-button>
                    <el-button class="order-search" @click="refreshList()">{{$t("customs.Empty")}}</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="order-list">
        <div class="table-head">
          <ul>
            <li class="width-13 text-hide">{{$t("customs.Customs declaration type")}}</li>
            <li class="width-13 text-hide">{{$t("customs.Customs Broker")}}</li>
            <li class="width-18">{{$t("customs.Goods Information")}}</li>
            <li class="width-16">物流信息（起运/到港时间）</li>
            <li class="width-14 text-hide">{{$t("customs.Customs Declaration Status")}}</li>
            <li class="width-10">{{$t("customs.Order Status")}}</li>
            <li :class="{'width-16': isZh, 'width-25': !isZh}">{{$t('supplierOrderManage.operation')}}</li>
            <li class="no-data" v-show="tableData.length === 0">{{$t('supplierOrderManage.noData')}}</li>
          </ul>
        </div>
        <div class="table-body">
          <ul class="clear">
            <li class="li-item" v-for="(item, outterIndex) in tableData" :key="outterIndex">
              <div class="li-head">
                <ul class="clear">
                  <li class="li-head-fir text-hidden" :title="item.number">{{$t('supplierOrderManage.orderNumber')}}{{item.number}}</li>
                  <li class="li-head-sec" :title="item.orderTime | moment('YYYY-MM-DD HH:mm:ss')">{{$t('supplierOrderManage.orderTime')}}{{item.orderTime | moment("YYYY-MM-DD HH:mm:ss")}}</li>
                </ul>
              </div>
              <div class="li-body">
                <ul class="clear">
                  <li class="width-13">
                    <div v-if="item.customsType === 1">{{$t("customs.Export")}}</div>
                    <div v-else-if="item.customsType === 2">{{$t("customs.At most 5 statements can be uploaded")}}</div>
                    <div v-else-if="item.customsType === 3">{{$t("customs.Import with tax refund")}}</div>
                  </li>
                  <li class="width-13 text-hide">{{item.broker}}</li>
                  <li class="width-18 text-hide" :title="item.goodsInfo">{{item.goodsInfo}}</li>
                  <li class="width-16 text-hide">{{item.logisInfo}}</li>
                  <li class="width-14 text-hide" :title="declarationStatusArr[item.declarationStatus]">{{declarationStatusArr[item.declarationStatus] }}</li>
                  <li class="width-10 text-hide">{{orderStatusArr[item.orderStatus] }}</li>
                  <!-- <li :class="{'width-16': isZh, 'width-25': !isZh}" class="left-operate"> -->
                  <li class="width-16 left-operate">
                    <div class="operate-btn">
                      <div v-for="opeate in item.operation" :key="opeate">
                        <!-- 下单 -->
                        <a class="a-click block" v-if="opeate ===1">下单</a>
                        <!-- 查看订单详情 -->
                        <router-link class="a-click block" v-if="opeate ===2" :to="{ path: `/usercenter/${accountType}/orderManagement/customsOrderDetail`, query: {orderNumber: item.number} }">{{$t('supplierOrderManage.viewOrderDetails')}}</router-link>

                        <!-- 关闭订单 -->
                        <a v-if="opeate===3" class="a-click block" @click="openCloseOrderAlert(item)">{{$t("customs.Close the order")}}</a>
                        <!-- 签订协议 -->
                        <a v-if="opeate===4" class="a-click block" @click="openDeclarationAudit(item)">{{$t("customs.Sign the agreement")}}</a>
                        <!-- 上传报关资料 -->
                        <a v-if="opeate===5" class="a-click block" @click="openDeclarationBill(item,true)">{{$t("customs.Upload customs declaration materials")}}</a>
                        <!-- 重新上传报关资料 -->
                        <a v-if="opeate===6" class="a-click block" @click="openDeclarationBill(item,false)">{{$t("customs.Upload the customs declaration documents again")}}</a>
                        <!-- 确认收预付款 -->
                        <a v-if="opeate===7" class="a-click block" @click="openFinalPay(item,false)">{{$t("customs.Pay advance payment")}}</a>
                        <!-- 确认收尾款 -->
                        <a v-if="opeate===8" class="a-click block" @click="openFinalPay(item,true)">付尾款</a>
                        <!-- 异常订单 -->
                        <a v-if="opeate===9" class="a-click block" @click="openAbnormalOrder(item)">{{$t("customs.Exceptional order")}}</a>
                        <!-- 确认账单 -->
                        <a v-if="opeate===10" class="a-click block" @click="openUploadBill(item)">{{$t("customs.Confirm the bill")}}</a>
                        <!-- 确认异常订单 -->
                        <a v-if="opeate===11" class="a-click block" @click="openIsAbnormalOrder(item)">{{$t("customs.Confirm the exceptional order")}}</a>
                        <!-- 撤销申请 -->
                        <a v-if="opeate===12" class="a-click block" @click="openCancelApplication(item)">{{$t("customs.Revoke the application")}}</a>
                        <!-- 申请发票 -->
                        <a v-if="opeate===13" class="a-click block" @click="openApplicationInvoice(item)">{{$t("customs.Apply for an invoice")}}</a>
                        <!-- 评价 -->
                        <a v-if="opeate===14" class="a-click block" @click="openEvalation(item)">{{$t("customs.Comments")}}</a>

                        <!-- 拒绝异常订单 -->
                        <!-- <a v-if="opeate===15" class="a-click block" @click="openIsAbnormalOrder(item)">拒绝异常</a> -->
                        <!-- 拒绝协议/订单 -->
                        <!-- <a
                          v-if="opeate===16"
                          class="a-click block"
                          @click="openIsAbnormalOrder(item)"
                        >拒绝协议/订单</a>-->
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div class="table-controll">
          <div class="page-size-choose left">
            <ul @click="changePageSize($event)">
              <li class="page-choose-title">{{$t('supplierOrderManage.pageSize')}}：</li>
              <li class="choose-li" :class="{'active': activePageSize === '10'}">10</li>
              <li class="choose-li" :class="{'active': activePageSize === '30'}">30</li>
              <li class="choose-li" :class="{'active': activePageSize === '50'}">50</li>
            </ul>
          </div>
          <el-pagination background layout="total,prev, pager, next, jumper" :total="pageControll.totalSize" :pageSize="pageControll.pageSize" :currentPage.sync="pageControll.pageNum" @current-change="handleCurrentChange" class="right pagination"></el-pagination>
        </div>
      </div>
      <a href id="downloadDoc"></a>
    </div>
    <!-- 申请发票 -->
    <el-dialog title="申请开票" :visible.sync="dialog.confirmApplicationInvoice" width="700px" class="upload-contract">
      <div class="invoice" v-if="invoiceInfo">
        <div class="invoice-item">
          <span class="lable">{{$t("customs.Invoice Type")}}</span>
          <span class="radioGroup">
            <el-radio-group v-model="isElectron" @change="changeElectron">
              <el-radio :label="0">{{$t("customs.General Value Added Tax Invoice (Electronic)")}}</el-radio>
              <el-radio :label="1">增值税专用发票</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="invoice-item">
          <span class="lable">{{$t("customs.Invoicing Information")}}</span>
          <div class="invoice-form">
            <div class="form-item">
              <span class="form-label">{{$t("customs.Company Name")}} ：</span>
              <span class="form-content">{{invoiceInfo.defaultCompanyName}}</span>
            </div>
            <div class="form-item">
              <span class="form-label">{{$t("customs.Taxpayer Identification Number")}} ：</span>
              <span class="form-content">{{invoiceInfo.defaultTaxpayerNum }}</span>
            </div>
            <div class="form-item" v-if="isElectron==1">
              <span class="form-label">{{$t("customs.Opening Bank")}} ：</span>
              <span class="form-content">
                <el-input v-model="invoiceInfo.defaultBankName" placeholder="请输入开户行" maxlength="200" style="width: 300px"></el-input>
              </span>
            </div>
            <div class="form-item" v-if="isElectron==1">
              <span class="form-label">{{$t("customs.Account Number")}} ：</span>
              <span class="form-content">
                <el-input style=" width: 300px" v-model="invoiceInfo.defaultAccountNum" placeholder="请输入账号" maxlength="50"></el-input>
              </span>
            </div>
          </div>
        </div>
        <div class="invoice-item">
          <span class="lable" style="width:100%">
            <span class="required-icon">*</span>
            $t('customs.Delivery address')
            <span class="tip">（请选择收件地址）</span>
          </span>
          <div class="invoice-address" v-if="invoiceInfo">
            <div class="address-item" v-for="(item,index) in invoiceInfo.list" :key="index" :class="item.selected==1?'is-default':''" @click="setDefault(item,index)">
              <div class="address-list-default supplier-icons" v-if="item.selected==1"></div>
              <i class="iconfont icon-dui default-icon" v-if="item.selected==1"></i>
              <div class="item-line">
                <span class="item-label">{{$t("customs.Recipient")}}</span>
                <span class="item-content">{{item.receiver}}</span>
              </div>
              <div class="item-line" v-if="isElectron==0">
                <span class="item-label">{{$t("customs.E-mail address")}}</span>
                <span class="item-content">{{item.email}}</span>
              </div>
              <div class="item-line" v-if="isElectron==1">
                <span class="item-label">联系方式：</span>
                <span class="item-content">{{item.contact}}</span>
              </div>
              <div class="item-line" v-if="isElectron==1">
                <span class="item-label">联系地址：</span>
                <span class="item-content">{{item.receiveAddress}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="invoice-item" v-if="isElectron==0">
          <router-link tag="a" :to="{ path: `/usercenter/${accountType}/systemSetting/customsAddress` }" class="address-link">{{$t("customs.Electronic Invoice Address Management")}}></router-link>
        </div>
        <div class="invoice-item" v-else>
          <router-link tag="a" :to="{ path:`/usercenter/${accountType}/systemSetting/customsAddress`}" class="address-link">{{$t("customs.Address management")}}></router-link>
        </div>
      </div>

      <div class="center" style="margin-top:20px">
        <el-button type="warning" class="tip-btn advance-btn" @click="applicationInvoice">{{$t('orderDialog.confirm')}}</el-button>
        <el-button class="tip-btn advance-btn" @click="dialog.confirmApplicationInvoice = false">{{$t('orderDialog.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 付款 -->
    <el-dialog title="$t('customs.Pay')" :visible.sync="dialog.confirmFinalPay" width="600px">
      <div class="table-list" v-if="payOrder" style="margin-bottom:10px">
        <ul>
          <li class="frist-line">{{$t("customs.Payment method")}}</li>
          <li>
            <el-radio-group v-model="payOrder.paidType">
              <el-radio :label="0">线上支付</el-radio>
              <el-radio :label="1">{{$t("customs.Offline payment")}}</el-radio>
            </el-radio-group>
          </li>
          <li v-if="payOrder.paidType==0">{{$t("customs.Amount of the payment")}}{{payOrder.customsCurrency}}{{payOrder.price}}</li>
        </ul>
      </div>
      <div v-if="payOrder">
        <div v-if="payOrder.paidType==1">
          <div class="form-upload-part">
            <h4>{{$t("customs.Upload the bank receipt")}}</h4>
            <p>（支持文件：图片、pdf，文件大小不超过10M，至少上传一个。最多上传5个）}</p>
            <label for="form2upload">
              +$t('customs.Upload')
              <input type="file" accept="application/pdf,image/*" id="form2upload" name="form2upload" v-on:change="uploadReceiptFile($event)">
            </label>
            <ul class="upload-list">
              <li v-for="(item,index) in payOrder.files" :key="index">
                <span class="ellipsis" :title="item.fileName">{{item.fileName}}</span>
                <div class="preview-btn">
                  <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                  <i class="iconfont icon-shanchu" @click="deleteReceiptFile(index)"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="center" style="margin-top:20px">
        <el-button type="warning" class="tip-btn advance-btn" @click="finalPay">{{$t('orderDialog.confirm')}}</el-button>
        <el-button class="tip-btn advance-btn" @click="dialog.confirmFinalPay = false">{{$t('orderDialog.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Close the order')" :visible.sync="dialog.confirmCloseOrder" width="600px">
      <div class="center">
        <el-form label-width="100px">
          <el-form-item label="$t('customs.Reasons for closing the order')">
            <el-input type="textarea" :rows="5" placeholder="$t('customs.Please enter the reasons of closing the order')" v-model="selectedRow.reason"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="advance-btn" @click="confirmCloseOrder">{{$t("customs.Confirm")}}</el-button>
        <el-button class="advance-btn" @click="dialog.confirmCloseOrder = false">{{$t("customs.Cancel")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Reject order exception')" :visible.sync="dialog.refuseAbnormalOrder" width="600px">
      <div class="center">
        <el-form label-width="100px">
          <el-form-item label="$t('customs.Reject order exception')">
            <el-input type="textarea" :rows="5" placeholder="请输入拒绝订单异常原因（500字符内）" v-model="selectedRow.reason"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="advance-btn" @click="refuseAbnormalOrder">{{$t("customs.Confirm")}}</el-button>
        <el-button class="advance-btn" @click="dialog.refuseAbnormalOrder = false">{{$t("customs.Cancel")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Comments')" :visible.sync="dialog.confirmEvaluation" width="600px">
      <div>
        <el-form label-width="100px">
          <el-form-item label="$t('customs.Star rating')">
            <el-rate v-model="selectedRow.star " :colors="['#e96c7d','#e96c7d','#e96c7d']" class="rate"></el-rate>
          </el-form-item>
          <el-form-item label="$t('customs.Content')">
            <el-input type="textarea" :rows="5" placeholder="请输入评价内容（500字符以内）" v-model="selectedRow.content" maxlength="500"></el-input>
          </el-form-item>
        </el-form>
        <div class="center">
          <el-button type="warning" class="advance-btn" @click="evaluate">{{$t("customs.Confirm")}}</el-button>
          <el-button class="advance-btn" @click="dialog.confirmCloseOrder = false">{{$t("customs.Cancel")}}</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Customs declaration exception')" :visible.sync="dialog.confirmAbnormalDeclare" width="600px">
      <div class="center">
        <el-form label-width="100px">
          <el-form-item label="报关异常描述：">
            <el-input type="textarea" :rows="5" placeholder="请输入报关异常原因" v-model="selectedRow.reason"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="advance-btn" @click="abnormalDeclare">{{$t("customs.Confirm")}}</el-button>
        <el-button class="advance-btn" @click="dialog.confirmAbnormalDeclare = false">{{$t("customs.Cancel")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Reject the bill')" :visible.sync="dialog.confirmRefuseBill" width="600px">
      <div class="center">
        <el-form label-width="100px">
          <el-form-item label="$t('customs.Reasons for rejecting the bill')">
            <el-input type="textarea" :rows="5" placeholder="请输入拒绝账单原因" v-model="selectedRow.reason"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="advance-btn" @click="postBill(false)">{{$t("customs.Confirm")}}</el-button>
        <el-button class="advance-btn" @click="dialog.confirmRefuseBill = false;dialog.confirmUploadBill=true">{{$t("customs.Cancel")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Exceptional order')" :visible.sync="dialog.confirmAbnormalOrder" width="600px">
      <div class="center">
        <el-form label-width="100px">
          <el-form-item label="$t('customs.Reasons of the exceptional order')">
            <el-input type="textarea" :rows="5" placeholder="请输入异常订单原因" v-model="selectedRow.reason"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="advance-btn" @click="abnormalOrder">{{$t("customs.Confirm")}}</el-button>
        <el-button class="advance-btn" @click="dialog.confirmAbnormalOrder = false">{{$t("customs.Cancel")}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Revoke the application')" :visible.sync="dialog.confirmCancelApplication" width="600px">
      <div>
        <p align="center">
          <i class="iconfont icon-iconfontxiaogantanhao icon-common"></i>
        </p>
        <p align="center" class="tip-text" style="margin-bottom:20px">您确定要撤销异常订单的申请！</p>
        <el-row class="center">
          <el-col :span="24">
            <el-button type="warning" class="tip-btn advance-btn" @click="cancelApplication">{{$t('orderDialog.confirm')}}</el-button>
            <el-button class="tip-btn advance-btn center" @click="dialog.confirmCancelApplication = false">{{$t('orderDialog.cancel')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Confirm the bill')" :visible.sync="dialog.confirmUploadBill" width="700px" class="upload-contract">
      <div class="table-list" v-if="payInfo" style="margin-bottom:10px">
        <ul>
          <li v-for="(item,index) in payInfo.billInfo" :key="index">
            <span class="filename-download normal-title ellipsis" :title="item.fileName">{{$t("customs.Bill information")}}{{item.fileName}}</span>
            <div class="preview-btn">
              <span>
                <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                <span class="action-preview" v-if="item.fileUrl" @click="downloadFile(item.fileUrl)">{{$t("customs.Download")}}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="table-list" v-if="payInfo" style="margin-bottom:10px">
        <ul>
          <li v-for="(item,index) in payInfo.files" :key="index">
            <span class="filename-download normal-title ellipsis" :title="item.fileName">{{$t("customs.Attachment")}}{{item.fileName}}</span>
            <div class="preview-btn">
              <span>
                <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                <span class="action-preview" v-if="item.fileUrl" @click="downloadFile(item.fileUrl)">{{$t("customs.Download")}}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="table-list" v-if="payInfo">
        <ul>
          <li>{{$t("customs.Total fees ")}} {{payInfo.customsCurrency}}{{payInfo.customsPrice+payInfo.customsPriceEnd}}</li>
          <li>
            $t('customs.Amount paid')
            {{payInfo.customsCurrency}}
            <span>{{payInfo.customsPrice}}</span>
          </li>
          <li>
            $t('customs.Amount remaining'){{payInfo.customsCurrency}}
            <span>{{payInfo.customsPriceEnd}}</span>
          </li>
        </ul>
      </div>
      <el-row class="center">
        <el-col :span="24">
          <el-button type="warning" class="tip-btn advance-btn center" @click="postBill(true)">{{$t("customs.Confirm the bill")}}</el-button>
          <el-button type="info" class="tip-btn advance-btn center" @click="dialog.confirmUploadBill = false;dialog.confirmRefuseBill=true" style="margin-bottom:10px">{{$t("customs.Reject the bill")}}</el-button>
          <el-button class="tip-btn advance-btn center" @click="dialog.confirmUploadBill = false">{{$t('orderDialog.cancel')}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :title="customsTitle" :visible.sync="dialog.confirmUploadDeclaration" width="700px" class="upload-contract">
      <el-form>
        <!-- 上传报关所需资料start -->
        <el-form-item>
          <div class="form-upload-part">
            <h4>
              $t('customs.Materials for customs declaration')
              <span v-if="customsInfo">{{customsInfo.needInfo}}</span>
            </h4>
            <p>（支持文件：图片、pdf，文件大小不超过10M；至少上传1个，最多上传20个）}</p>
            <label for="form4upload">
              +$t('customs.Upload')
              <input type="file" accept="application/pdf,image/*" id="form4upload" name="form4upload" v-on:change="uploadCustomsFile($event)">
            </label>
            <ul class="upload-list" v-if="customsInfo">
              <li v-for="(item,index) in customsInfo.files" :key="index">
                <span v-if="item.status===1" class="icon-customs">
                  <i class="iconfont icon-xuanzhong"></i>
                </span>
                <span v-else-if="item.status===2" class="icon-customs">
                  <i class="iconfont icon-jiufuqianbaoicon08"></i>
                </span>
                <span class="ellipsis" :title="item.fileName">{{item.fileName}}</span>
                <div class="preview-btn">
                  <span>
                    <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                    <span class="action-preview" v-if="item.fileUrl" @click="downloadFile(item.fileUrl)">{{$t("customs.Download")}}</span>
                  </span>
                  <i class="iconfont icon-shanchu" @click="deleteCustomsFile(index)"></i>
                </div>
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form>
      <el-row class="center">
        <el-col :span="24">
          <el-button type="warning" class="tip-btn advance-btn center" @click="postDeclaration">{{$t('orderDialog.confirm')}}</el-button>
          <el-button class="tip-btn advance-btn center" @click="dialog.confirmUploadDeclaration = false">{{$t('orderDialog.cancel')}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 上传协议 -->
    <el-dialog title="上传协议" :visible.sync="dialog.confirmAuditDeclaration" width="600px">
      <div class="table-list" style="margin-bottom:10px">
        <ul>
          <li class="frist-line">
            <span class="lable">{{$t("customs.Customs broker uploads the agreement")}}</span>
          </li>
          <li v-for="(item,index) in declarationAuditInfo" :key="index">
            <span class="filename-download normal-title ellipsis" :title="item.fileName">{{item.fileName}}</span>
            <div class="preview-btn">
              <span>
                <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                <span class="action-preview" v-if="item.fileUrl" @click="downloadFile(item.fileUrl)">{{$t("customs.Download")}}</span>
              </span>
              <span v-if="item.status===3">
                <el-button class="defaultBtn" @click="confirmAudit(index)">{{$t("customs.Accept")}}</el-button>
                <el-button class="defaultBtn" @click="refusalAudit(index)">{{$t("customs.Reject")}}</el-button>
              </span>
              <span v-else-if="item.status===1" class="icon-btn">
                <i class="iconfont icon-xuanzhong"></i>
              </span>
              <span v-else-if="item.status===2" class="icon-btn">
                <i class="iconfont icon-jiufuqianbaoicon08"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="isPass==2">
        <el-input type="textarea" :rows="5" placeholder="请填写拒绝协议原因（500字符内）" v-model="selectedRow.reason"></el-input>
      </div>
      <div v-else-if="isPass==1" style="margin-bottom:20px">
        <div class="form-upload-part">
          <h4>{{$t("customs.Upload the agreement")}}</h4>
          <p>（支持文件：图片、pdf，文件大小不超过10M，最多上传5个）}</p>
          <label for="form2upload">
            +$t('customs.Upload')
            <input type="file" accept="application/pdf,image/*" id="form2upload" name="form2upload" v-on:change="uploadDeclarationFile($event)">
          </label>
          <ul class="upload-list">
            <li v-for="(item,index) in declarationFiles" :key="index">
              <span class="ellipsis" :title="item.fileName">{{item.fileName}}</span>
              <div class="preview-btn">
                <span>
                  <span class="action-preview" v-if="item.fileUrl" @click="previewFile(item.fileUrl)">{{$t("customs.Preview")}}</span>
                  <span class="action-preview" v-if="item.fileUrl" @click="downloadFile(item.fileUrl)">{{$t("customs.Download")}}</span>
                </span>
                <i class="iconfont icon-shanchu" @click="deleteDeclarationFile(index)"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="center">
        <el-button type="warning" class="tip-btn advance-btn" @click="auditDeclaration">{{$t('orderDialog.confirm')}}</el-button>
        <el-button class="tip-btn advance-btn" @click="dialog.confirmAuditDeclaration = false">{{$t('orderDialog.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Confirm the exceptional order')" :visible.sync="dialog.isAbnormalOrder" width="600px">
      <div class="center">
        <el-form label-width="120px">
          <el-form-item label="$t('customs.Reasons of the exceptional order') ：">
            <span class="item-content">{{refuseReason}}</span>
          </el-form-item>
        </el-form>
        <el-button type="warning" @click="affirmAbnormalOrder" style="margin-bottom:10px">{{$t("customs.Confirm the exceptional order")}}</el-button>
        <el-button type="info" @click="dialog.refuseAbnormalOrder=true;dialog.isAbnormalOrder = false">拒绝异常订单</el-button>
        <el-button class="tip-btn advance-btn" @click="dialog.isAbnormalOrder = false">{{$t('orderDialog.cancel')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog title="$t('customs.Preview')" :visible.sync="imgDialog" width="36%">
      <div class="img-dialog">
        <img v-if="bigImg" :src="bigImg">
      </div>
      <p slot="footer" class="dialog-footer indent-none" align="center">
        <el-button type="warning" @click.stop="imgDialog=false">{{$t("customs.Confirm ")}}</el-button>
      </p>
    </el-dialog>
    <!-- 公共上传框 -->
    <input type="file" @change="uploadFile($event)" class="hide" ref="upload">
    <a href class="hide" ref="downloadTool"></a>
  </div>
</template>

<script>
import breadCrumb from '@/components/common/breadCrumb'
import {
  searchOrderList,
  closeOrder,
  uploadFile,
  getOrderBill,
  postBill,
  declareCustoms,
  declareCustomsRe,
  abnormalOrder,
  queryOrderPay,
  abnormalDeclare,
  getDownloadParam,
  confirmOrderPay,
  confirmOrderPayOnline,
  queryOrderSign,
  postOrderAudit,
  confirmAbnormal,
  refuseAbnormal,
  cancelAbnormal,
  evaluateOrder,
  refuseOrderAudit,
  getAbnormalRason,
  getInvoice,
  getInvoiceInit,
  postInvoice,
  getCustomsInfo
} from '@/api/clientOrder'
import { Loading } from 'element-ui'
import moment from 'moment'
export default {
  name: 'orderManage',
  components: {
    breadCrumb
  },
  data() {
    return {
      imgDialog: false,
      bigImg: null, // 是否查看大图
      tableData: [],
      dialog: {
        bill: false,
        confirmCloseOrder: false, // 关闭订单弹窗
        confirmEvaluation: false, // 评价弹窗
        confirmUploadBill: false, // 确认账单弹窗
        confirmRefuseBill: false, // 拒绝账单弹窗
        confirmUploadDeclaration: false, // 上传报关单弹窗
        confirmAbnormalOrder: false, // 异常订单弹窗
        confirmFinalPay: false, // 尾款弹窗
        confirmAbnormalDeclare: false, // 报关异常弹窗
        confirmAuditDeclaration: false, // 审核报关异常弹窗
        isAbnormalOrder: false, // 是否异常订单弹窗
        refuseAbnormalOrder: false, // 拒绝异常订单弹窗
        confirmCancelApplication: false, // 申请撤销弹窗
        confirmApplicationInvoice: false // 申请发票弹窗
      },
      activePageSize: '10',
      pageControll: {
        pageNum: 1,
        pageSize: 10,
        totalPage: 1,
        totalSize: 1
      },
      searchCondition: {
        broker: '',
        customsType: '0',
        declarationStatus: 0,
        orderNumber: '',
        orderStatus: 0,
        pageNum: 1,
        pageSize: 10
      },
      selectedRow: {
        orderNumber: '',
        declarationNumber: '',
        orderStatus: 0,
        declarationStatus: 0,
        reason: '',
        content: '',
        refuseIds: [],
        star: 0
      },
      declarationStatusArr: [
        '$t('customs.All status')',
        '$t('customs.Order unconfirmed')',
        '$t('customs.Customs declaration documents to be uploaded by the Entrusting Party')',
        '$t('customs.Customs declaration documents to be audited by the Customs Broker')',
        '$t('customs.Customs declaration materials passed the review')',
        '$t('customs.Customs declaration materials failed to pass the review')',
        '$t('customs.To be declared by the Customs Broker')',
        '$t('customs.Customs declaration in progress')',
        '$t('customs.Customs declaration in progress')-异常',
        '$t('customs.Customs cleared')',
        '$t('customs.Customs Declaration Form to be uploaded by the Customs Broker')',
        '$t('customs.Customs Declaration Form uploaded')'
      ],
      orderStatusArr: [
        '$t('customs.All types')',
        '$t('customs.Order to be confirmed by the Customs Broker')',
        '$t('customs.Agreement to be signed by the Entrusting Party')',
        '$t('customs.Order rejected by the Entrusting Party')',
        '$t('customs.Advance payment to be paid by the Entrusting Party')',
        '待报关行收预付款',
        '$t('customs.Customs broker has received the advance payment')',
        '$t('customs.Bill to be uploaded by the Customs Broker')',
        '$t('customs.Statement to be confirmed by the Entrusting Party')',
        '$t('customs.Statement rejected by the Entrusting Party')',
        '$t('customs.Balance payment to be paid by the Entrusting Party')',
        '$t('customs.Balance payment to be received by the Customs Broker')',
        '$t('customs.Customs broker has received the balance payment')',
        '$t('customs.Completed')',
        '$t('customs.Order closed')',
        '$t('customs.Order dispute')',
        '$t('customs.Order exception')',
        '$t('customs.Exceptional order to be confirmed by the Customs Broker')',
        '$t('customs.Exceptional order to be confirmed by the Entrusting Party')'
      ],
      billFiles: [],
      attachmentFiles: [],
      declarationFiles: [],
      customsInfo: null,
      billPrice: '',
      payInfo: null,
      payOrder: null,
      invoiceInfo: null,
      userId: null,
      isPass: 3,
      declarationAuditInfo: null,
      fristUploadCustoms: false,
      customsTitle: '',
      customsRe: false,
      userSidList: [],
      responsiblePerson: '',
      mainUserSid: '',
      otherBillList: [],
      isZh: false,
      advanced: false,
      isElectron: 0,
      refuseReason: '',
      accountType: ''
    }
  },
  computed: {
    language() {
      return this.$i18n.locale
    },
    pageSizeFlag() {
      return this.pageControll.pageSize
    }
  },
  mounted() {
    const userInfo = this.$store.state.userInfo
    this.userId = userInfo.userId
    this.accountType = userInfo.types[0].type == 1 ? 'purchaser' : 'supplier'

    if (this.$i18n.locale === 'en') {
      this.isZh = false
    } else {
      this.isZh = true
    }
    this.queryFirstOrder()
  },
  watch: {
    language(val) {
      this.lang = val
      if (this.lang === 'en') {
        this.isZh = false
      } else {
        this.isZh = true
      }
    },
    pageSizeFlag(newVal) {
      this.activePageSize = newVal + ''
    }
  },
  methods: {
    queryFirstOrder() {
      let tempObj = {
        broker: this.searchCondition.broker,
        customsType: this.searchCondition.customsType,
        declarationStatus: this.searchCondition.declarationStatus,
        orderNumber: this.searchCondition.orderNumber,
        orderStatus: this.searchCondition.orderStatus,
        pageNum: this.searchCondition.pageNum,
        pageSize: this.searchCondition.pageSize
      }
      this.queryOrderInfoWithCondition(tempObj)
    },
    queryOrderInfoWithCondition(params = {}) {
      let loadingInstance = Loading.service({
        fullscreen: true
      })
      searchOrderList(params)
        .then(res => {
          loadingInstance.close()
          if (res.code !== '1') {
            this.tableData = res.data.data.map(x => {
              x.logisInfo = x.logisInfo
                ? moment(x.logisInfo).format('YYYY-MM-DD')
                : '-'
              return x
            })
            this.pageControll.totalPage = res.data.totalPage
            this.pageControll.totalSize = res.data.totalSize
          }
        })
        .catch(error => {
          console.log(error)
          loadingInstance.close()
        })
    },
    // 条件查询
    searchByConditon(isClickSearch) {
      if (isClickSearch) {
        this.pageControll.pageSize = 10
        this.pageControll.pageNum = 1
      }
      this.searchCondition.pageSize = this.pageControll.pageSize
      this.searchCondition.pageNum = this.pageControll.pageNum
      this.queryFirstOrder()
    },
    refreshList() {
      this.pageControll.pageSize = 10
      this.pageControll.pageNum = 1
      this.searchCondition.pageSize = this.pageControll.pageSize
      this.searchCondition.pageNum = this.pageControll.pageNum
      this.searchCondition = {
        broker: '',
        customsType: '0',
        declarationStatus: 0,
        orderNumber: '',
        orderStatus: 0,
        pageNum: 1,
        pageSize: 10
      }
      this.queryFirstOrder()
    },
    openCloseOrderAlert(row) {
      // 打开关闭订单弹窗
      this.dialog.confirmCloseOrder = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
    },
    openCancelApplication(row) {
      // 打开申请撤销弹窗
      this.dialog.confirmCancelApplication = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
    },
    openEvalation(row) {
      // 打开评价弹窗
      this.dialog.confirmEvaluation = true
      this.selectedRow.orderNumber = row.number
    },
    openApplicationInvoice(row) {
      // 打开申请发票弹窗
      this.dialog.confirmApplicationInvoice = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      getInvoice()
        .then(res => {
          if (res.code === '0') {
            res.data.list.forEach(item => {
              if (item.isDefault === 1) {
                item.selected = 1
              }
            })
            this.invoiceInfo = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    openUploadBill(row) {
      // 打开确认账单弹窗
      this.dialog.confirmUploadBill = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      this.selectedRow.reason = ''
      getOrderBill({ orderNumber: this.selectedRow.orderNumber })
        .then(res => {
          if (res.code === '0') {
            this.payInfo = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    openDeclarationBill(row, fristUpload) {
      // 打开上传报关资料弹窗
      this.dialog.confirmUploadDeclaration = true
      this.customsInfo = null
      this.fristUploadCustoms = fristUpload
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      if (fristUpload) {
        this.customsTitle = '$t('customs.Upload customs declaration materials')'
        this.customsRe = false
      } else {
        this.customsTitle = '$t('customs.Upload the customs declaration documents again')'
        this.customsRe = true
      }
      getCustomsInfo({ orderNumber: this.selectedRow.orderNumber })
        .then(res => {
          if (res.code === '0') {
            this.customsInfo = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    openAbnormalOrder(row) {
      // 打开异常订单弹窗
      this.dialog.confirmAbnormalOrder = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
    },
    openIsAbnormalOrder(row) {
      // 打开是否异常订单弹窗
      this.dialog.isAbnormalOrder = true
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      getAbnormalRason({ orderNumber: this.selectedRow.orderNumber })
        .then(res => {
          if (res.code === '0') {
            this.refuseReason = res.data.reason
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    openFinalPay(row, isFinal) {
      // 打开收尾款弹窗
      this.dialog.confirmFinalPay = true
      this.advanced = isFinal
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      let params = {
        advanced: !isFinal,
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus
      }
      queryOrderPay(params)
        .then(res => {
          if (res.code === '0') {
            let result = res.data
            result.paidType = 0
            result.files = []
            this.payOrder = result
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    openDeclarationAudit(row) {
      // 打开上传协议弹窗
      this.dialog.confirmAuditDeclaration = true
      this.declarationFiles = []
      this.isPass = 3
      this.selectedRow.refuseIds = []
      this.selectedRow.orderNumber = row.number
      this.selectedRow.declarationStatus = row.declarationStatus
      this.selectedRow.orderStatus = row.orderStatus
      queryOrderSign({ orderNumber: this.selectedRow.orderNumber })
        .then(res => {
          if (res.code === '0') {
            this.declarationAuditInfo = res.data.map(x => {
              x.status = 3
              return x
            })
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    evaluate() {
      // 评价订单
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        content: this.selectedRow.content,
        star: this.selectedRow.star
      }
      evaluateOrder(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmEvaluation = false
            this.selectedRow.content = ''
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    finalPay() {
      // 确认收尾款或预付款
      if (this.payOrder.paidType === 0) {
        var params = {
          orderNumber: this.selectedRow.orderNumber,
          declarationStatus: this.selectedRow.declarationStatus,
          orderStatus: this.selectedRow.orderStatus,
          advanced: !this.advanced,
          price: this.payOrder.price
        }
        confirmOrderPayOnline(params)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmFinalPay = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      } else {
        if (this.payOrder.files && !this.payOrder.files.length) {
          this.$message.warning('$t('customs.Please upload the bank receipts')')
          return false
        }
        let params = {
          orderNumber: this.selectedRow.orderNumber,
          declarationStatus: this.selectedRow.declarationStatus,
          orderStatus: this.selectedRow.orderStatus,
          advanced: !this.advanced,
          fileApis: this.payOrder.files
        }
        confirmOrderPay(params)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmFinalPay = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      }
    },
    cancelApplication() {
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus
      }
      cancelAbnormal(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmCancelApplication = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    abnormalOrder() {
      // 异常订单原因
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus,
        reason: this.selectedRow.reason
      }
      abnormalOrder(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmAbnormalOrder = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.selectedRow.reason = ''
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    affirmAbnormalOrder() {
      // 确认异常订单
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus
      }
      confirmAbnormal(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.isAbnormalOrder = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    refuseAbnormalOrder() {
      // 拒绝异常订单
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus,
        reason: this.selectedRow.reason
      }
      refuseAbnormal(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.refuseAbnormalOrder = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    confirmCloseOrder() {
      // 确认关闭订单
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus,
        reason: this.selectedRow.reason
      }
      closeOrder(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmCloseOrder = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.selectedRow.reason = ''
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    abnormalDeclare() {
      // 确认报关异常
      var params = {
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus,
        reason: this.selectedRow.reason
      }
      abnormalDeclare(params)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmAbnormalDeclare = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.selectedRow.reason = ''
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    /** 上传账单 */
    uploadBillFile(event) {
      const reg = /^image\/(png)?(jpg)?(jpeg)?$/
      const type = reg.test(event.currentTarget.files[0].type)
      if (!event.currentTarget.files[0].name) {
        return
      }
      if (this.billFiles.length > 5) {
        this.$message.error('账单最多上传5个！')
        return (event.target.value = '')
      }
      const isPDF =
        event.currentTarget.files[0].type === 'application/pdf' ||
        event.currentTarget.files[0].type === 'application/PDF'
      const isLt10M = event.currentTarget.files[0].size / 1024 / 1024 < 10

      if (!isPDF && !type) {
        return this.$message.error('仅支持PDF和图片')
      }
      if (!isLt10M) {
        return this.$message.error('文件大小不得超过10M')
      }
      let fileName = event.currentTarget.files[0].name
      uploadFile(fileName, event.target.files[0], this.userId)
        .then(res => {
          this.billFiles.push({
            fileName: fileName,
            fileUrl: res,
            status: 1
          })
          event.target.value = ''
        })
        .catch(() => {
          event.target.value = ''
        })
    },
    // 上传水单
    uploadReceiptFile(event) {
      const reg = /^image\/(png)?(jpg)?(jpeg)?$/
      const type = reg.test(event.currentTarget.files[0].type)
      if (!event.currentTarget.files[0].name) {
        return
      }
      if (this.payOrder.files.length > 5) {
        this.$message.error('附件最多上传5个！')
        return (event.target.value = '')
      }
      const isPDF =
        event.currentTarget.files[0].type === 'application/pdf' ||
        event.currentTarget.files[0].type === 'application/PDF'
      const isLt10M = event.currentTarget.files[0].size / 1024 / 1024 < 10

      if (!isPDF && !type) {
        return this.$message.error('仅支持PDF和图片')
      }
      if (!isLt10M) {
        return this.$message.error('文件大小不得超过10M')
      }
      let fileName = event.currentTarget.files[0].name
      uploadFile(fileName, event.target.files[0], this.userId)
        .then(res => {
          this.payOrder.files.push({
            fileName: fileName,
            fileUrl: res,
            status: 3
          })
          event.target.value = ''
        })
        .catch(() => {
          event.target.value = ''
        })
    },
    // 协议文件
    uploadDeclarationFile(event) {
      const reg = /^image\/(png)?(jpg)?(jpeg)?$/
      const type = reg.test(event.currentTarget.files[0].type)
      if (!event.currentTarget.files[0].name) {
        return
      }
      if (this.declarationFiles.length > 5) {
        this.$message.error('协议文件最多上传5个！')
        return (event.target.value = '')
      }
      const isPDF =
        event.currentTarget.files[0].type === 'application/pdf' ||
        event.currentTarget.files[0].type === 'application/PDF'
      const isLt10M = event.currentTarget.files[0].size / 1024 / 1024 < 10

      if (!isPDF && !type) {
        return this.$message.error('仅支持PDF和图片')
      }
      if (!isLt10M) {
        return this.$message.error('文件大小不得超过10M')
      }
      let fileName = event.currentTarget.files[0].name
      uploadFile(fileName, event.target.files[0], this.userId)
        .then(res => {
          console.log(res)
          this.declarationFiles.push({
            fileName: fileName,
            fileUrl: res,
            status: 3
          })
          event.target.value = ''
        })
        .catch(() => {
          event.target.value = ''
        })
    },
    // 报关上传文件
    uploadCustomsFile(event) {
      const reg = /^image\/(png)?(jpg)?(jpeg)?$/
      const type = reg.test(event.currentTarget.files[0].type)
      if (!event.currentTarget.files[0].name) {
        return
      }
      if (this.customsInfo.files.length > 20) {
        this.$message.error('报关所需文件最多上传20个！')
        return (event.target.value = '')
      }
      const isPDF =
        event.currentTarget.files[0].type === 'application/pdf' ||
        event.currentTarget.files[0].type === 'application/PDF'
      const isLt10M = event.currentTarget.files[0].size / 1024 / 1024 < 10

      if (!isPDF && !type) {
        return this.$message.error('仅支持PDF和图片')
      }
      if (!isLt10M) {
        return this.$message.error('文件大小不得超过10M')
      }
      let fileName = event.currentTarget.files[0].name
      uploadFile(fileName, event.target.files[0], this.userId)
        .then(res => {
          console.log(res)
          this.customsInfo.files.push({
            fileName: fileName,
            fileUrl: res,
            status: 3
          })
          event.target.value = ''
        })
        .catch(() => {
          event.target.value = ''
        })
    },
    // 预览
    previewFile(url) {
      const ext = url.slice(-3)
      if (ext === 'pdf') {
        // pdf链接
        this.$loading({ fullscreen: true })
        getDownloadParam({ fileUrl: url })
          .then(res => {
            this.$loading().close()
            if (res.code === '0') {
              window.open('/static/pdf/web/viewer.html?file=' + res.data)
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$loading().close()
          })
      } else {
        this.imgDialog = true
        this.bigImg = url
      }
    },
    deleteBillFile(index) {
      this.billFiles.splice(index, 1)
    },
    deleteAttachmentFile(index) {
      this.attachmentFiles.splice(index, 1)
    },
    deleteDeclarationFile(index) {
      this.declarationFiles.splice(index, 1)
    },
    deleteReceiptFile(index) {
      this.payOrder.files.splice(index, 1)
    },
    deleteCustomsFile(index) {
      this.customsInfo.files.splice(index, 1)
    },
    // 上传账单到后台
    postBill(pass) {
      var parmes = {
        confirm: pass,
        reason: this.selectedRow.reason,
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus
      }
      postBill(parmes)
        .then(res => {
          if (res.code === '0') {
            if (pass) {
              this.dialog.confirmUploadBill = false
            } else {
              this.dialog.confirmRefuseBill = false
            }
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    // 上传报关资料到后台
    postDeclaration() {
      if (this.customsInfo.files.length <= 0) {
        this.$message.warning('$t('customs.Please fill in the customs declaration documents ')')
        return false
      }
      var parmes = {
        fileApis: this.customsInfo.files,
        orderNumber: this.selectedRow.orderNumber,
        declarationStatus: this.selectedRow.declarationStatus,
        orderStatus: this.selectedRow.orderStatus
      }
      if (this.customsRe) {
        declareCustomsRe(parmes)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmUploadDeclaration = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      } else {
        declareCustoms(parmes)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmUploadDeclaration = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      }
    },
    // 报关审核通过
    confirmAudit(index) {
      this.declarationAuditInfo[index].status = 1
      if (this.declarationAuditInfo.every(item => item.status === 1)) {
        this.isPass = 1
      }
    },
    // 报关审核拒绝
    refusalAudit(index) {
      this.declarationAuditInfo[index].status = 2
      this.selectedRow.refuseIds.push(this.declarationAuditInfo[index].id)
      this.isPass = 2
    },
    // 签订协议
    auditDeclaration() {
      if (this.declarationAuditInfo.some(item => item.status === 3)) {
        this.$message.warning('请对所有协议进行处理，选择同意或拒绝！')
        return false
      }
      if (this.isPass === 1) {
        var parmes = {
          fileApis: this.declarationFiles,
          orderNumber: this.selectedRow.orderNumber,
          declarationStatus: this.selectedRow.declarationStatus,
          orderStatus: this.selectedRow.orderStatus
        }
        if (this.declarationFiles.length <= 0) {
          this.$message.warning('请上传至少1个协议文件！')
          return false
        }
        if (this.declarationFiles.length > 5) {
          this.$message.warning('协议文件最多上传5个！')
          return false
        }
        postOrderAudit(parmes)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmAuditDeclaration = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      } else if (this.isPass === 2) {
        if (!this.selectedRow.reason.trim()) {
          this.$message.warning('$t('customs.Please enter the reasons of rejection')')
          return false
        }
        let parmes = {
          refuseIds: this.selectedRow.refuseIds,
          orderNumber: this.selectedRow.orderNumber,
          declarationStatus: this.selectedRow.declarationStatus,
          orderStatus: this.selectedRow.orderStatus,
          reason: this.selectedRow.reason
        }
        refuseOrderAudit(parmes)
          .then(res => {
            if (res.code === '0') {
              this.dialog.confirmAuditDeclaration = false
              this.$message.success(this.$t('supplierOrderManage.success'))
              this.refreshList()
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('supplierOrderManage.failed'))
          })
      } else {
        this.$message.warning('请对所有协议进行处理，选择同意或拒绝！')
      }
    },
    changeElectron() {
      if (this.isElectron === 0) {
        getInvoice()
          .then(res => {
            if (res.code === '0') {
              res.data.list.forEach(item => {
                if (item.isDefault === 1) {
                  item.selected = 1
                }
              })
              this.invoiceInfo = res.data
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      } else {
        getInvoiceInit()
          .then(res => {
            if (res.code === '0') {
              res.data.list.forEach(item => {
                if (item.isDefault === 1) {
                  item.selected = 1
                }
              })
              this.invoiceInfo = res.data
            } else {
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    },
    // 设置默认地址
    setDefault(item, index) {
      let invoiceInfo = Object.assign({}, this.invoiceInfo)
      invoiceInfo.list.forEach(a => {
        if (a.id == item.id) {
          a.selected = 1
        } else {
          a.selected = 0
        }
      })
      this.invoiceInfo = invoiceInfo
    },
    // 申请开票
    applicationInvoice() {
      const selectInvoiceItem = this.invoiceInfo.list.filter(
        item => item.selected == 1
      )[0]
      if (this.isElectron === 0 && !selectInvoiceItem) {
        this.$message.warning('$t('customs.Please select the electronic invoice address')')
        return false
      } else if (this.isElectron !== 0 && !selectInvoiceItem) {
        this.$message.warning('$t('customs.Please select the delivery address')')
        return false
      }
      var parmes = {
        accountNum: this.invoiceInfo.defaultAccountNum,
        bankName: this.invoiceInfo.defaultBankName,
        companyName: this.invoiceInfo.defaultCompanyName,
        contact: selectInvoiceItem.contact,
        email: selectInvoiceItem.email,
        orderNumber: this.selectedRow.orderNumber,
        receiveAddress: selectInvoiceItem.receiveAddress,
        receiver: selectInvoiceItem.receiver,
        taxpayerNum: this.invoiceInfo.defaultTaxpayerNum,
        type: this.isElectron
      }
      postInvoice(parmes)
        .then(res => {
          if (res.code === '0') {
            this.dialog.confirmApplicationInvoice = false
            this.$message.success(this.$t('supplierOrderManage.success'))
            this.refreshList()
          } else {
            console.log(res)
            if (res.data) {
              this.$message.error(res.data[0])
            } else {
              this.$message.error(res.msg)
            }
          }
        })
        .catch(() => {
          this.$message.error(this.$t('supplierOrderManage.failed'))
        })
    },
    // 下载文件
    downloadFile(url) {
      this.$loading({ fullscreen: true })
      getDownloadParam({ filePath: url })
        .then(res => {
          this.$loading().close()
          if (res.code === '0') {
            // window.open('/static/pdf/web/viewer.html?file=' + res.data);
            document.getElementById('downloadDoc').href = res.data
            document.getElementById('downloadDoc').click()
          } else if (res.code === '2') {
            document.getElementById('downloadDoc').href = url
            document.getElementById('downloadDoc').click()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {
          this.$loading().close()
        })
    },
    changePageSize(e) {
      if (e.target.className === 'page-choose-title') {
        return
      }
      if (e.target.nodeName === 'UL') {
        return
      }
      this.pageControll.pageSize = parseInt(e.target.innerHTML)
      this.searchByConditon()
    },
    handleCurrentChange(val) {
      this.pageControll.pageNum = val
      this.searchByConditon()
    },
    changeOrderStatus(status, time) {
      this.clearData()
      this.activeButton = status
      this.searchCondition.goodsStatus = status
      this.searchCondition.timeCondition = time
      this.searchByConditon(true)
    }
  }
}
</script>

<style lang="less">
.supplier-order-manage .el-dialog__body {
  padding: 30px 20px;
}
.el-select-dropdown__item.selected {
  color: #fd4743;
}

.supplier-order-manage {
  overflow: hidden;
  .invoice {
    padding: 0 20px;
    .invoice-item {
      margin-bottom: 30px;
      .lable {
        font-weight: 600;
        font-size: 14px;
        color: #444444;
        display: inline-block;
        width: 76px;
        .tip {
          font-weight: 500;
          color: #aaaaaa;
        }
      }

      .radioGroup {
        .el-radio__label {
          color: #444444;
        }
      }
      .invoice-form {
        padding: 20px 0 0;
        .form-item {
          margin-bottom: 14px;
          .form-label {
            color: #666666;
            width: 120px;
            text-align: right;
            display: inline-block;
          }
          .form-content {
            color: #444444;
          }
        }
      }
      .required-icon {
        color: #e96c7d;
      }
      .invoice-address {
        .address-item {
          border: solid 1px #cccccc;
          margin: 10px 0;
          padding: 10px 20px;
          position: relative;
          cursor: pointer;
          .supplier-icons {
            width: 0;
            height: 0;
            border-width: 27px 0 0 27px;
            border-style: solid;
            border-color: #e96c7d transparent transparent transparent;
            position: relative;
          }
          .address-list-default {
            position: absolute;
            background-position: -210px -45px;
            width: 27px;
            height: 27px;
            float: right;
            right: 0;
            top: 0;
          }
          .default-icon {
            color: #fff;
            position: absolute;
            display: block;
            font-size: 14px;
            top: 2px;
            right: 2px;
          }
          .item-line {
            line-height: 30px;
            .item-label {
              color: #666666;
            }
            .item-content {
              color: #444;
            }
          }
        }
        .is-default {
          border: 1px solid #e96c7d;
        }
      }
      .address-link {
        color: #6996d6;
        cursor: pointer;
        text-decoration: none;
      }
    }
  }
  .el-button:active {
    border-color: #ccc;
  }

  .el-select .el-input.is-focus .el-input__inner {
    border-color: #eceef2;
  }

  /* 分页默认样式修改 */
  .el-pagination {
    text-align: right;
    padding: 18px 0;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #eceef2;
    color: #fd4743;
    border: 1px solid #fd4743;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #eceef2;
    border: 1px solid #c4c6cf;
  }

  .el-pager li {
    background-color: #eceef2;
  }

  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #fd4743;
    border: 1px solid #fd4743;
  }

  .pointer {
    cursor: pointer;
  }

  .main-content {
    .manage-state {
      background-color: #fff;
      padding: 10px 0 0;

      .main-state-tab {
        min-width: 1400px;

        .firstOrderExperience {
          position: absolute;
          right: 60px;
          top: 46px;
        }

        .first-order-wrap {
          width: 300px;
          padding: 20px;
          margin-top: 10px;
          text-align: left;
          border: solid 2px #fd4743;

          .title {
            font-size: 16px;
            color: #fd4743;
          }

          .order-number {
            span {
              font-size: 14px;
              color: #6996d6;
            }
          }

          p {
            a {
              color: #6897d6;
            }
          }
        }
      }

      .main-state-search {
        min-width: 1400px;
      }

      .tab-row {
        height: 50px;
        line-height: 45px;
      }

      .tab-button {
        height: 36px;
        line-height: 36px;
        // width: 100px;
        padding: 0 10px;
        background-color: #f3f6fb;
        border-radius: 4px;
        border: 1px solid #dae2ed;
        margin-right: 5px;
        text-align: center;
        outline: none;
        cursor: pointer;

        &.button-active {
          background-color: #fd4743;
          color: #fff;
        }
      }

      .tab-button-zh {
        width: 106px;
      }

      .tab-button-en {
        padding: 0 10px;
      }

      .t-right {
        text-align: right;
      }

      .main-state-search {
        padding: 20px 0 28px 0;
        margin-bottom: 30px;
        .search-content {
          margin-bottom: 15px;
          .t-right {
            color: #000000;
          }
        }
        .search-btn {
        }
        // .order-search {
        //   margin-left: 20px;
        // }
      }
    }

    .select-condition {
      height: 64px;
      line-height: 64px;
      width: 100%;

      .hide-close-order {
        margin-left: 15px;
      }

      .release-time-choose {
        background-color: #eceef2;
      }
    }

    .order-list {
      width: 100%;

      .table-head {
        width: 100%;
        height: 48px;
        line-height: 48px;
        background-color: #f3f6fb;
        border: 1px solid #dae2ed;
        margin-bottom: 16px;

        ul {
          width: 100%;
          height: 100%;
          li {
            float: left;
          }
        }

        .no-data {
          width: 100%;
          text-align: center;
          color: #444;
          height: 60px;
          line-height: 58px;
          background-color: #fff;
        }
      }

      .table-body {
        width: 100%;

        ul {
          width: 100%;

          li {
            float: left;
          }
        }

        .status-name-li {
          display: table;
          height: 100px;
          line-height: 20px;

          .status-name {
            display: table-cell;
            vertical-align: middle;
            padding-left: 10px;
          }
        }

        .li-item {
          width: 100%;
          margin-bottom: 12px;
          border: 1px solid #dae2ed;
          background-color: #fff;

          .li-head {
            min-height: 40px;
            line-height: 40px;
            background-color: #f3f6fb;

            ul {
              position: relative;
            }

            .li-head-fir,
            .li-head-fou,
            .li-head-sec,
            .li-head-thr {
              position: absolute;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .li-head-fir {
              width: 24%;
              left: 16px;
            }

            .li-head-sec {
              width: 20%;
              left: 26%;
            }

            .li-head-thr {
              left: 35%;
              width: 11%;
            }

            .score {
              position: absolute;
              left: 50%;
              width: 14%;

              .el-rate {
                min-height: 40px;
                line-height: 40px;

                .el-rate__item {
                  vertical-align: unset;
                }
              }
            }

            .responsible-person {
              left: 66%;
              width: 14%;
              position: absolute;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            .li-head-fou {
              text-align: right;
              right: 12px;
              width: 18%;
            }
          }

          .li-body {
            width: 100%;
            min-height: 100px;
            line-height: 100px;

            .left-operate {
              position: relative;
              min-height: 100px;
              line-height: 20px;
              .operate-btn {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                transform: translate(-50%, -50%);
                div {
                  display: inline-block;
                  padding: 2px 8px;
                }
              }
            }
            ul {
              position: relative;
            }

            .show-less-icon,
            .show-more-icon {
              position: absolute;
              left: 0;
              height: 20px;
              line-height: 20px;
              font-weight: 900;
              width: 32%;
              text-align: center;

              i {
                font-size: 20px;
                cursor: pointer;
              }
            }

            .show-more-icon {
              top: 82px;
            }

            .show-less-icon {
              bottom: 0;
            }

            .goods-li-head {
              .goods-list-hide {
                padding-left: 0;
                width: 100%;
                height: 100%;
                float: left;

                .goods-list-hide-li {
                  padding-left: 0;
                  width: 100%;
                  height: 100%;
                  padding-bottom: 16px;

                  .product-name-img {
                    margin-top: 0;
                  }
                }
              }
            }

            .product-name-img {
              float: left;
              margin-top: 16px;
              width: 70px;
              height: 70px;
              padding: 2px;
              border: 1px solid #ccc;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .product-name-detail {
              margin-top: 16px;
              overflow: hidden;
              color: #6996d6;
              text-align: left;
              height: 68px;
              padding-top: 4px;

              .product-contain-color {
                color: #999999;
              }

              .product-name-left {
                float: left;
                padding: 0 10px;
                height: 60px;
                line-height: 20px;
                width: 45%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }

              .product-quantity-right {
                position: relative;
                float: left;
                width: 30%;
                height: 60px;

                .quantity {
                  margin-top: 20px;
                  height: 20px;
                  line-height: 20px;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                .each-product-money {
                  position: absolute;
                  right: 0;
                  bottom: 0;
                  height: 20px;
                  line-height: 20px;
                  color: #fd4743;
                  width: 100%;
                  text-align: center;
                }
              }
            }
          }
        }
      }

      .table-controll {
        width: 100%;

        .page-size-choose {
          padding-top: 17px;
          height: 28px;
          line-height: 28px;

          ul li {
            float: left;
          }

          // .page-choose-title {
          //   width: 75px;
          // }
          .choose-li {
            width: 36px;
            text-align: center;
            cursor: pointer;
            border-right: 1px solid #dcdee3;
          }
        }
      }
    }

    .red-color {
      color: #fd4743;
    }

    .width-7 {
      width: 7%;
    }

    .text-hide {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .width-7_5 {
      width: 7.5%;
      padding-left: 5px;
    }

    .width-13 {
      width: 13%;
      padding-left: 10px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .width-5 {
      width: 5%;
      padding-right: 10px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .width-10 {
      width: 10%;
      padding-right: 10px;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .width-14 {
      width: 14%;
      padding-left: 18px;
    }
    .width-16 {
      width: 16%;
      padding-left: 18px;
    }
    .width-18 {
      width: 18%;
      padding-left: 18px;
    }

    .width-25 {
      width: 25%;
      height: 100%;
    }

    .width-22 {
      width: 22%;
      padding-left: 18px;
    }

    .width-28 {
      width: 28%;
      padding-left: 18px;
    }

    .operate {
      position: relative;
      height: 100px;
    }

    .money-color {
      color: #fd4743;
    }

    .money-overflow {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .block {
      display: block;
      height: 20px;
      line-height: 20px;
    }

    .be-center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      line-height: 0;
      transform: translate(-50%, -50%);
    }

    .right-operate {
      vertical-align: top;
    }
  }
  .center {
    text-align: center;
    .item-content {
      line-height: 40px;
      display: block;
    }
  }

  .a-click {
    text-decoration: none;
    color: #6996d6;
    cursor: pointer;
  }

  .tip-text {
    font-size: 16px;
    color: #444444;
  }

  .txt-warning {
    color: #fd4743;
  }

  .tip-btn {
    margin: 30px 42% 40px;
  }

  .advance-btn {
    margin: 10px 10px 20px;
  }

  .note-text {
    border: 1px solid #e6e6e6;
    background: #f4f4f4;
    height: 60px;
    padding: 10px;
    line-height: 22px;
    margin-bottom: 24px;
  }

  .upload-document {
    .asterisk {
      color: #fd4743;
    }

    .document-title {
      height: 40px;
      line-height: 40px;
    }

    .upload {
      height: 40px;
      line-height: 40px;
      color: #6996d6;
      border: 1px solid #dcdee3;
      padding: 0 30px;

      // cursor: pointer;
      .other-bill-item {
        height: 100%;
      }
    }

    .otherBill {
      color: #6996d6;
      border: 1px solid #dcdee3;
      padding: 5px 30px;
      cursor: pointer;

      .other-bill-item {
        padding: 5px 0;
      }
    }

    // .uploaded{
    //     cursor: pointer;
    // }
    .add-more {
      text-align: center;
      color: #6996d6;
      cursor: pointer;
      padding: 5px 0;
    }

    .upload-file-name {
      width: 40%;
      display: inline-block;
      text-align: left;
      cursor: pointer;
    }

    .delete-btn {
      display: inline-block;
      text-align: right;
      float: right;
      cursor: pointer;
    }

    .file-limit {
      margin-top: 20px;
      text-align: center;
    }
  }

  .pending-deliver {
    color: #fd4743;
    margin-top: 5px;
  }

  .icon-iconfontxiaogantanhao {
    color: #fd4743;
  }

  .icon-common {
    font-size: 100px;
  }

  .rate {
    width: 140px;
    display: inline-block;
    padding-left: 6px;
    vertical-align: middle;
  }
  .table-list {
    border: 1px solid #dae2ed;
    margin-bottom: 34px;
    ul {
      .frist-line {
        background-color: #f3f6fb;
        .lable {
          color: #333;
        }
      }
      li {
        border-bottom: 1px solid #dae2ed;
        height: 40px;
        line-height: 40px;
        padding-left: 12px;
        clear: both;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: #f5f7fa;
          transition: background-color 0.25s ease;
        }
        .defaultBtn {
          padding: 5px 10px;
          margin-left: 4px;
        }
      }
    }
  }

  .active {
    color: #fd4743;
  }

  .pagination {
    margin-top: 17px;
  }

  .line-height-32 {
    height: 32px;
    line-height: 32px;
  }

  .upload-advance-pic,
  .upload-contract {
    padding-top: 20px;

    .mention {
      padding: 12px;
      font-size: 13px;
      color: #777777;
      background-color: #f4f4f4;
      border: 1px solid #e6e6e6;
      line-height: 20px;
    }

    .mention-warning {
      color: #fd4743;
    }

    .button {
      margin: 24px 0 12px;

      .button-choose,
      .button-delete,
      .button-upload {
        height: 28px;
        line-height: 26px;
        border-radius: 3px;
        border: 1px solid #c4c6cf;
        background-color: #f7f8fa;
      }

      .button-choose {
        width: 44px;
      }

      .button-upload {
        // width: 114px;
        padding: 0 4px;
        cursor: pointer;
      }

      .button-delete {
        width: 70px;
        cursor: pointer;
      }
    }

    .contract-item {
      border-top: none;
      margin-bottom: 28px;

      .item-li {
        padding-left: 12px;
        line-height: 38px;
        height: 38px;
        border-top: 1px solid #dcdee3;

        .item-li-check {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .upload-contract {
    .content {
      width: 100%;
      height: 100%;

      .a-click-block {
        display: inline-block;
        height: 100%;
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .right {
        float: right;
        padding-right: 30px;
      }
    }
  }

  .upload-advance-pic {
    .button {
      margin-top: 0;
    }

    .title {
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: 900;
    }

    .contract-item {
      margin-bottom: 12px;
    }

    .mention {
      margin-bottom: 27px;
    }
  }

  .inline {
    display: inline-block;
  }

  .icon-qq {
    position: absolute;
    top: 1px;
    left: 0;
    padding: 0 4px;
    color: #6996d6;
    cursor: pointer;
  }

  .underline {
    text-decoration: underline;
  }

  .icon-btn {
    width: 110px;
    display: inline-block;
    text-align: center;
    .icon-xuanzhong {
      font-size: 20px;
      color: #35b4a1;
      vertical-align: middle;
    }
  }

  .icon-jiufuqianbaoicon08 {
    font-size: 16px;
    color: #e96c7d;
    vertical-align: middle;
  }
  .preview-btn {
    float: right;
    margin-right: 18px;
    .action-preview {
      cursor: pointer;
      font-size: 13px;
      color: #6996d6;
      margin-right: 4px;
    }
  }
  .form-upload-part {
    background-color: #f3f6fb;
    border: solid 1px #dae2ed;
    text-align: center;
    overflow: hidden;
    input {
      display: none;
    }

    h4 {
      font-size: 14px;
      line-height: normal;
      color: #666666;
      font-weight: bold;
      margin-top: 20px;
    }
    h3 {
      font-size: 14px;
      line-height: normal;
      color: #666666;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    p {
      font-size: 13px;
      line-height: normal;
      color: #888;
      margin-top: 10px;
    }

    label {
      line-height: normal;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
      padding: 6px 20px;
      margin-top: 10px;
      color: #6996d6;
    }

    .upload-list {
      text-align: left;
      li {
        height: 40px;
        background-color: #fff;
        border-bottom: solid 1px #e6e6e6;
        line-height: 40px;
        padding: 0 15px;
        clear: both;
        .ellipsis {
          display: inline-block;
          width: 400px;
          height: 40px;
        }
        .preview-btn {
          margin-right: 0;
        }
        .icon-customs {
          width: 30px;
          display: inline-block;
          .icon-jiufuqianbaoicon08 {
            color: #e96c7d;
            float: left;
            cursor: none;
          }
          .icon-xuanzhong {
            font-size: 20px;
            color: #35b4a1;
            float: left;
            cursor: none;
          }
        }
        i {
          clear: both;
          float: right;
          color: #999;
          font-size: 16px;
          cursor: pointer;
          margin-left: 6px;
        }
        &:first-child {
          border-top: solid 1px #dae2ed;
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .form-input-part {
    display: flex;
    border-bottom: 1px solid #dae2ed;
    border-left: 1px solid #dae2ed;
    border-right: 1px solid #dae2ed;
    span {
      width: 24px;
      text-align: right;
    }
    .el-input {
      flex: 1;
      input {
        border: none;
      }
    }
  }
  .text-hidden {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .left {
    float: left;
  }

  .w-70 {
    width: 70%;
  }

  .w-64 {
    width: 64%;
  }

  .max-180 {
    max-width: 180px;
  }

  .dialog-width {
    .el-dialog {
      width: 600px;
    }
  }

  .item-li-a {
    width: 70%;
    display: inline-block;
    vertical-align: middle;
  }

  .contract-border {
    border: 1px solid #dcdee3;
  }

  .border-top {
    border-top: 1px solid #dcdee3;
  }
  .img-dialog {
    text-align: center;
    padding: 20px;
    img {
      max-width: 100%;
      max-height: 500px;
    }
  }
}
</style>
