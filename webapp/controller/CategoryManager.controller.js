sap.ui.define([
	'sap/ui/demo/toolpageapp/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'sap/ui/demo/toolpageapp/model/formatter',
	'sap/ui/demo/toolpageapp/model/models',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/m/MessageBox'
], function(BaseController, JSONModel, Device, formatter, models, Filter, FilterOperator, MessageBox) {
	"use strict";
	return BaseController.extend("sap.ui.demo.toolpageapp.controller.CategoryManager", {
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
			oRouter.getRoute("categoryManager").attachPatternMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function() {
			this.isLogging();
			this.getAllCategory();
		},

		getAllCategory: function() {
			var oModelCate = new JSONModel();
			var getCate = models.getAllCategory();
			if (getCate) {
				oModelCate.setData({
					results: getCate
				});
			}
			this.setModel(oModelCate, "oModelCate");
		},

		onCateDetailPress: function(oEvent) {
			var item = oEvent.getSource();
			var bindingContext = item.getBindingContext("oModelCate");
			if (bindingContext) {
				var cateId = bindingContext.getProperty("id");
				if (!this._cateDetailDialog) {
					this._cateDetailDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.toolpageapp.fragment.CategoryDetail",
						this);
				}
				this.checkDialog = false;
				var oModelCateDetail = new JSONModel();
				var data = models.getCategoryDetail(cateId);
				if (data) {
					oModelCateDetail.setData(data);
				}
				this.setModel(oModelCateDetail, "oModelCateDetail");
			}

			//Set models which is belonged to View to Fragment
			this.getView().addDependent(this._cateDetailDialog);
			this._cateDetailDialog.open();
		},

		onUpdateCate: function() {
			var oModelCateDetail = this.getModel("oModelCateDetail");
			var cateId = oModelCateDetail.getProperty("/id");
			var cateName = oModelCateDetail.getProperty("/categoryName");
			var cateImg = oModelCateDetail.getProperty("/iconUrl");
			var check = models.updateCategory(cateId, cateName, cateImg);
			if (check === "success") {
				MessageBox.success("Cập nhật thành công!");
				this._cateDetailDialog.close();
			} else {
				MessageBox.error("Cập nhật thất bại!");
			}
			this.getAllCategory();
		},

		onCreateCategory: function() {
			if (!this._createCateDialog) {
				this._createCateDialog = sap.ui.xmlfragment(this.getId(), "sap.ui.demo.toolpageapp.fragment.CreateCate",
					this);
			}
			this.checkDialog = true;
			var oModelNewCate = new JSONModel({
				"cateName": "",
				"imgCate": ""
			});

			this._createCateDialog.setModel(oModelNewCate, "oModelNewCate");
			//Set models which is belonged to View to Fragment
			this.getView().addDependent(this._createCateDialog);
			this._createCateDialog.open();
		},

		onFilterCateName: function(oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("categoryName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("ListCategory");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onCreateNewCate: function() {
			var cateName = this.getView().byId("input_cateCreate").getValue();
			var getImg = this.getView().byId("img_cateCreate").getSrc();
			var check = models.createNewCategory(cateName, getImg);
			if (check === "success") {
				MessageBox.success("Tạo danh mục mới thành công!");
				this._createCateDialog.close();
			} else {
				MessageBox.error("Tạo danh mục thất bại!");
			}
			this.getAllCategory();
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

					if (that.checkDialog == true) {
						var getModelCate = that._createCateDialog.getModel("oModelNewCate");
						if (!getModelCate) {
							return;
						}
						getModelCate.setProperty("/imgCate", encodeURI(oEvt.data.link));
						// pics.push({
						// 	url: encodeURI(oEvt.data.link)
						// });
						getModelCate.updateBindings(true);
					} else {
						var oModelCateDetail = that._cateDetailDialog.getModel("oModelCateDetail");
						if (!oModelCateDetail) {
							return;
						}
						oModelCateDetail.setProperty("/iconUrl", encodeURI(oEvt.data.link));
						oModelCateDetail.updateBindings(true);
					}

				},
				error: function(oEvt) {
					//Handle error here
					console.log("error");
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