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

	return BaseController.extend("sap.ui.demo.toolpageapp.controller.ShopPending", {
		formatter: formatter,

		onInit: function() {
			var oRouter = this.getRouter();

			oRouter.getRoute("shopPending").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function() {
			this.getShopPending();
		},

		getShopPending: function() {
			var arrList = [];
			var oModelShop = new JSONModel();
			var getdata = models.getAllShop();
			if (getdata) {
				for (var i = 0; i < getdata.length; i++) {
					if (getdata[i].status === 1) {
						arrList.push(getdata[i]);
					}
				}
				oModelShop.setData({
					results: arrList
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

				var getList = models.getShopDetail(shopId, true);
				listDialogModel.setData(getList);
				this._detailShopDialog.setModel(listDialogModel, "listResult");

				var getOwnerShop = models.getOwnerShopInfo(shopId);
				if (getOwnerShop) {
					this._detailShopDialog.getModel("listResult").setProperty("/emailOwerShop", getOwnerShop.username);
				}

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
			var status = oModelShopDialog.getProperty("/status");
			if (status !== 5) {
				var activeShop = models.activateShop(shopId, true);
				if (activeShop) {
					MessageBox.success("Kích hoạt Cửa hàng thành công!");
					this._detailShopDialog.getModel("listResult").setProperty("/active", false);
					this._detailShopDialog.getModel("listResult").setProperty("/status", activeShop.status);
					var getShopPending = models.getAllShop(shopId, true);
					if (getShopPending.length) {
						var arrList = [];
						var count = 0;
						for (var i = 0; i < getShopPending.length; i++) {
							if (getShopPending[i].status === 1) {
								arrList.push(getShopPending[i]);
							}
						}
						for (var j = 0; j < arrList.length; j++) {
							count++;
						}
						this.getGlobalModel().setProperty("/count", count);
						var message = "Có " + count + " Cửa hàng đang chờ đăng kí";
						this.getGlobalModel().setProperty("/message", message);
					} else {
						this.getGlobalModel().setProperty("/message", "");
						this.getGlobalModel().setProperty("/isActive", false);
					}
					this.getGlobalModel().updateBindings(true);
				} else {
					MessageBox.error("Lỗi hệ thống!");
				}
			} else {
				MessageBox.information("Cửa hàng này không được kích hoạt!");
			}
			this.getShopPending();
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
			this.getShopPending();
		}

	});
});