sap.ui.define([
	'sap/ui/demo/toolpageapp/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'sap/ui/demo/toolpageapp/model/formatter',
	'sap/ui/demo/toolpageapp/model/models',
	'sap/m/MessageBox',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Device, formatter, models, MessageBox, Filter, FilterOperator) {
	"use strict";
	return BaseController.extend("sap.ui.demo.toolpageapp.controller.ShopManager", {
		formatter: formatter,

		onInit: function() {
			var oRouter = this.getRouter();

			var oViewModel = new JSONModel({
				isPhone: Device.system.phone
			});
			this.setModel(oViewModel, "view");
			Device.media.attachHandler(function(oDevice) {
				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
			}.bind(this));

			oRouter.getRoute("shopManager").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function() {
			this.getAllStore();
		},

		getAllStore: function() {
			var oModelShop = new JSONModel();
			var getdata = models.getAllShop();
			if (getdata) {
				oModelShop.setData({
					results: getdata
				});
			}
			this.setModel(oModelShop, "oModelShop");
		},

		onShopDetail: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelShop");
			if (bindingContext) {
				var shopId = bindingContext.getProperty("id");
				if (!this._detailShopDialog) {
					this._detailShopDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.toolpageapp.fragment.ShopDetail",
						this);
				}
				var listDialogModel = new JSONModel();

				var getList = models.getShopDetail(shopId);
				listDialogModel.setData(getList);
				this._detailShopDialog.setModel(listDialogModel, "listResult");

				var status = getList.status;
				if (status !== 2) {
					this._detailShopDialog.getModel("listResult").setProperty("/active", true);
				} else {
					this._detailShopDialog.getModel("listResult").setProperty("/active", false);
				}
				var oModelCate = new JSONModel();
				var getCate = getList.categoryItems;
				oModelCate.setData({
					results: getCate
				});
				this._detailShopDialog.setModel(oModelCate, "oModelCate");
				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._detailShopDialog);
				this._detailShopDialog.open();
			}
		},

		onActiveShop: function() {
			var oModelShopDialog = this._detailShopDialog.getModel("listResult");
			var shopId = oModelShopDialog.getProperty("/id");
			if (shopId) {
				var activeShop = models.activateShop(shopId, true);
				if (activeShop) {
					MessageBox.success("Kích hoạt Cửa hàng thành công!");
					this._detailShopDialog.getModel("listResult").setProperty("/active", false);
					this._detailShopDialog.getModel("listResult").setProperty("/status", activeShop.status);
				} else {
					MessageBox.error("Lỗi hệ thống!");
				}
			}
			this.getAllStore();
		},

		onUnActiveShop: function() {
			var oModelShopDialog = this._detailShopDialog.getModel("listResult");
			var shopId = oModelShopDialog.getProperty("/id");
			if (shopId) {
				var activeShop = models.activateShop(shopId, false);
				if (activeShop) {
					MessageBox.success("Hủy Cửa hàng thành công!");
					this._detailShopDialog.getModel("listResult").setProperty("/active", true);
					this._detailShopDialog.getModel("listResult").setProperty("/status", activeShop.status);
					// this._detailShopDialog.getModel("listResult").updateBindings(true);
				} else {
					MessageBox.error("Lỗi hệ thống!");
				}
			}
			this.getAllStore();
		},
		
		onFilterShopName: function(oEvent) { 
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("shopName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("ListShop");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});