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
			this.getAllStore(0);
			this.getStatusShop();
		},

		getAllStore: function(keyStatus) {
			var oModelShop = new JSONModel();
			var getdata = models.getAllShop();
			if (getdata) {
				if (keyStatus == 0) {
					oModelShop.setData({
						results: getdata
					});
				} else {
					var arrSort = [];
					for (var i = 0; i < getdata.length; i++) {
						var status = getdata[i].status;
						if (keyStatus == status) {
							arrSort.push(getdata[i]);
						}
					}
					oModelShop.setData({
						results: arrSort
					});
				}

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
			var status = oModelShopDialog.getProperty("/status");
			if (status !== 5) {
				var activeShop = models.activateShop(shopId, true);
				if (activeShop) {
					MessageBox.success("Kích hoạt Cửa hàng thành công!");
					this._detailShopDialog.getModel("listResult").setProperty("/active", false);
					this._detailShopDialog.getModel("listResult").setProperty("/status", activeShop.status);
				} else {
					MessageBox.error("Lỗi hệ thống!");
				}
			} else {
				MessageBox.information("Cửa hàng này không được kích hoạt!");
			}
			this.getAllStore(0);
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
			this.getAllStore(0);
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

		getStatusShop: function() {
			var oModelStatus = new JSONModel();
			var dataRole = models.getStatusShop();
			if (dataRole) {
				oModelStatus.setData({
					results: dataRole
				});
			}
			this.setModel(oModelStatus, "oModelStatus");
		},

		onChangeStatus: function() {
			var keyStatus = this.getView().byId("filterStatus").getSelectedItem().getKey();
			this.getAllStore(keyStatus);
		},

		onUploadPress: function(oEvt) {
			var that = this;
			var oFileUploader = oEvt.getSource();
			var aFiles = oEvt.getParameters().files;
			var currentFile = aFiles[0];
			this.resizeAndUpload(currentFile, {
				success: function(oEvt) {
					oFileUploader.setValue("");
					//Here the image is on the backend, so i call it again and set the image
					// var model = that.getModel("createTrans");
					var getModelShop = that._detailShopDialog.getModel("listResult");
					if (!getModelShop) {
						return;
					}
					getModelShop.setProperty("/avaUrl", encodeURI(oEvt.data.link));
					// pics.push({
					// 	url: encodeURI(oEvt.data.link)
					// });
					getModelShop.updateBindings(true);
				},
				error: function(oEvt) {
					//Handle error here
				}
			});
		},

		resizeAndUpload: function(file, mParams) {
			var that = this;
			var reader = new FileReader();
			reader.onerror = function(e) {
				//handle error here
			};
			reader.onloadend = function() {
				var tempImg = new Image();
				tempImg.src = reader.result;
				tempImg.onload = function() {
					that.uploadFile(tempImg.src, mParams, file);
				};
			};
			reader.readAsDataURL(file);
		},

		uploadFile: function(dataURL, mParams, file) {
			var xhr = new XMLHttpRequest();
			var BASE64_MARKER = 'data:' + file.type + ';base64,';
			var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
			var base64string = dataURL.split(",")[1];

			xhr.onreadystatechange = function(ev) {
				if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
					mParams.success(JSON.parse(xhr.response));
				} else if (xhr.readyState == 4) {
					mParams.error(ev);
				}
			};
			var URL = "https://api.imgur.com/3/upload";
			var fileName = (file.name === "image.jpeg") ? "image_" + new Date().getTime() + ".jpeg" : file.name;
			xhr.open('POST', URL, true);
			xhr.setRequestHeader("Content-type", file.type); //"application/x-www-form-urlencoded");
			xhr.setRequestHeader("Authorization", "Bearer 5c25e781ffc7f495059078408c311799e277d70e"); //"application/x-www-form-urlencoded");
			var data = base64string;
			xhr.send(data);
		}
	});
});