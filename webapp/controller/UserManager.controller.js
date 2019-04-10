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
			this.getListUser(1);
			this.getRolesOfUser();
		},

		getListUser: function(keyRole) {
			var data = models.getAllUser();
			if (data) {
				var oModelUser = new JSONModel();
				if (keyRole == 1) {
					oModelUser.setData({
						results: data
					});
				} else {
					var arrSort = [];
					for (var i = 0; i < data.length; i++) {
						var role = data[i].role;
						var roleId = role.id;
						if (keyRole == roleId) {
							arrSort.push(data[i]);
						}
					}
					oModelUser.setData({
						results: arrSort
					});
				}

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
			var getModel = this._detailUserDialog.getModel("listResult");
			var getRole = getModel.getProperty("/role");
			var role = getRole.id;
			var email = getModel.getProperty("/email");
			if (role !== roleAdmin) {
				var changeRole = models.changeRoleOfUser(roleAdmin, email);
				if (changeRole.role.id === 4) {
					MessageBox.success("Thay đổi thành công!");
					this.getListUser(1);
					this._detailUserDialog.close();
				} else {
					MessageBox.error("Lỗi hệ thống!");
				}
			} else {
				MessageBox.error("Không thể thay đổi quyền hiện tại!");
			}
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
		},

		getRolesOfUser: function() {
			var oModelRole = new JSONModel();
			var dataRole = models.getRoleOfUser();
			if (dataRole) {
				oModelRole.setData({
					results: dataRole
				});
			}
			this.setModel(oModelRole, "oModelRole");
		},

		onChangeRole: function() {
			var keyRole = this.getView().byId("filterRole").getSelectedItem().getKey();
			this.getListUser(keyRole);
		},

		onBanUser: function() {
			var roleAdmin = 4;
			var getModel = this._detailUserDialog.getModel("listResult");
			var getId = getModel.getProperty("/accountId");
			var getRole = getModel.getProperty("/role");
			var role = getRole.id;
			if (role !== roleAdmin) {
				var data = {
					accountId: getId,
					status: 3
				};
				var setRole = models.changeStatusOfUser(data);
				if (setRole === "success") {
					MessageBox.success("Thay đổi thành công!");
					this.getListUser(1);
					this._detailUserDialog.close();
				} else {
					MessageBox.error("Thay đổi không thành công!");
				}
			} else {
				MessageBox.error("Không thể thay đổi trạng thái của Quản Trị Viên!");
			}
		},

		onActiveUser: function() {
			var roleAdmin = 4;
			var getModel = this._detailUserDialog.getModel("listResult");
			var getId = getModel.getProperty("/accountId");
			var getRole = getModel.getProperty("/role");
			var role = getRole.id;
			if (role !== roleAdmin) {
				var data = {
					accountId: getId,
					status: 1
				};
				var setRole = models.changeStatusOfUser(data);
				if (setRole === "success") {
					MessageBox.success("Thay đổi thành công!");
					this.getListUser(1);
					this._detailUserDialog.close();
				} else {
					MessageBox.error("Thay đổi không thành công!");
				}
			} else {
				MessageBox.error("Không thể thay đổi trạng thái của Quản Trị Viên!");
			}
		}
	});
});