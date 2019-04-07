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
	return BaseController.extend("sap.ui.demo.toolpageapp.controller.UserManager", {
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

			oRouter.getRoute("userManager").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {
			this.getAllUser();
		},

		getAllUser: function() {
			var data = models.getAllUser();
			if (data) {
				var oModelUser = new JSONModel();
				oModelUser.setData({
					results: data
				});
				this.setModel(oModelUser, "oModelUser");
			}
		},

		onUserDetailPress: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelUser");
			if (bindingContext) {
				var userId = bindingContext.getProperty("accountId");
				if (!this._detailUserDialog) {
					this._detailUserDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.toolpageapp.fragment.UserDetail",
						this);
				}
				var listDialogModel = new JSONModel();

				var getList = models.getUserDetail(userId);
				listDialogModel.setData(getList);
				this._detailUserDialog.setModel(listDialogModel, "listResult");

				var oModelItem = new JSONModel();
				var listItem = getList.listFavoriteItem;
				oModelItem.setData({
					results: listItem
				});
				this.setModel(oModelItem, "oModelItem");

				var oModelShop = new JSONModel();
				var listShop = getList.listFavoriteShop;
				oModelShop.setData({
					results: listShop
				});
				this.setModel(oModelShop, "oModelShop");

				//Set models which is belonged to View to Fragment
				this.getView().addDependent(this._detailUserDialog);
				this._detailUserDialog.open();
			}
		},

		onActiveRoleAdmin: function() {
			var roleAdmin = 4;
			var email = this._detailUserDialog.getModel("listResult").getProperty("/email");
			var changeRole = models.changeRoleOfUser(roleAdmin, email);
			if (changeRole.role.id === 4) {
				MessageBox.success("Thay đổi thành công!");
			} else {
				MessageBox.error("Lỗi hệ thống!");
			}
			this.getAllUser();
		},
		
		onFilterUserName: function(oEvent) { 
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("name", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("ListUser");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		}
	});
});