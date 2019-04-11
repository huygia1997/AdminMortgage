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
	var gMap;
	return BaseController.extend("sap.ui.demo.toolpageapp.controller.ShopManager", {
		formatter: formatter,

		onInit: function() {
			var oRouter = this.getRouter();

			// check verify email
			this.checkVerifyEmail = false;

			var oViewModel = new JSONModel({
				isPhone: Device.system.phone
			});

			var oModel = new sap.ui.model.json.JSONModel();
			this.setModel(oModel, "dataCity");

			this.setModel(oViewModel, "view");
			Device.media.attachHandler(function(oDevice) {
				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
			}.bind(this));

			oRouter.getRoute("shopManager").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function() {
			this.isLogging();
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
				this.getDataCity();

				this._detailShopDialog.open();

				//set map
				this.getView().byId("map_canvas").addStyleClass("myMap");
				var mapOptions = {
					center: new google.maps.LatLng(0, 0),
					zoom: 10,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var getDomRef = this.getView().byId("map_canvas").getDomRef();
				gMap = new google.maps.Map(getDomRef, mapOptions);
				this.setLocation();
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

		onUpdateShopDetail: function() {
			var shopDetail = this._detailShopDialog.getModel("listResult").getData();
			var data = {
				shopId: shopDetail.id,
				shopName: shopDetail.shopName,
				facebook: shopDetail.facebook,
				email: shopDetail.email,
				phoneNumber: shopDetail.phoneNumber,
				addressId: shopDetail.addressId,
				districtId: shopDetail.districtId,
				policy: shopDetail.policy,
				address: shopDetail.fullAddress,
				longtitude: shopDetail.longtitude,
				latitude: shopDetail.latitude,
				avaUrl: shopDetail.avaUrl,
				status: shopDetail.status
			};
			var check = models.updateShopDetail(data);
			if (check === "success") {
				MessageBox.success("Cập nhật thành công!");
				this.getAllStore(0);
				this._detailShopDialog.close();
			} else {
				MessageBox.error("Cập nhật không thành công!");
			}
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
		},

		getDataCity: function() {
			//get data city
			var dataCiti = models.getDataCity();
			if (dataCiti) {
				var oModelCiti = this.getModel("dataCity");

				oModelCiti.setProperty("/results", dataCiti);
				oModelCiti.setProperty("/selectedCity", dataCiti[0].id);
				oModelCiti.updateBindings();
			}
			//get data district
			var dataDistrict = models.getDataDistrict();
			if (dataDistrict) {
				var dataDis = [];
				for (var i = 0; i < dataDistrict.length; i++) {
					dataDis.push(dataDistrict[i]);
				}

				var oModelDis = new JSONModel();
				oModelDis.setData({
					results: dataDis
				});
				this.setModel(oModelDis, "dataDis");
				this.onChangeCity();
			}
		},

		onChangeCity: function() {
			var cityModel = this.getModel("dataCity");
			if (cityModel) {
				// var cityContext = this.getView().byId("filterCity").getSelectedItem().getKey();
				var keyCity = cityModel.getProperty("/selectedCity");
				this.getDistrictByCity(keyCity);
			}
		},

		getDistrictByCity: function(cityId) {
			var filters = [];
			var cityIdFilter = new sap.ui.model.Filter({
				path: "cityId",
				operator: "EQ",
				value1: cityId
			});
			filters.push(cityIdFilter);
			this.byId("filterDistrict").getBinding("items").filter(filters);
		},

		getLocationFromInput: function() {
			var that = this;
			var getModel = this._detailShopDialog.getModel("listResult");
			var getAddress = getModel.getProperty("/fullAddress");
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'address': getAddress
			}, function(results, status) {
				if (status === 'OK') {
					gMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: gMap,
						position: results[0].geometry.location,
						draggable: true
					});
					that.getLatLng(marker);
				} else {
					MessageBox.error("Địa chỉ bạn nhập chưa đúng!");
				}
			});
		},

		getLatLng: function(marker) {
			google.maps.event.addListener(marker, 'dragend', function(marker) {
				var latLng = marker.latLng;
				var currentLatitude = latLng.lat();
				var currentLongitude = latLng.lng();
				console.log(currentLatitude, currentLongitude);
				this._detailShopDialog.getModel("listResult").setProperty("/latitude", currentLatitude);
				this._detailShopDialog.getModel("listResult").setProperty("/longtitude", currentLongitude);
			});
		},

		setLocation: function() {
			var lat = this._detailShopDialog.getModel("listResult").getProperty("/latitude");
			var lng = this._detailShopDialog.getModel("listResult").getProperty("/longtitude");
			var latLong = new google.maps.LatLng(lat, lng);
			var myEmail = this.getGlobalModel().getProperty("/username");
			var content = "<h3>" + myEmail + "</h3>";

			console.log(content);
			var marker = new google.maps.Marker({
				position: latLong,
				map: gMap,
				draggable: true,
			});
			var infowindow = new google.maps.InfoWindow({
				content: content
			});
			marker.addListener('click', function() {
				infowindow.open(gMap, marker);
			});
			google.maps.event.addListener(marker, 'dragend', function(marker) {
				var latLng = marker.latLng;
				var currentLatitude = latLng.lat();
				var currentLongitude = latLng.lng();
				// console.log(currentLatitude, currentLongitude);
			});
			marker.setMap(gMap);

			gMap.setZoom(15);
			gMap.setCenter(marker.getPosition());
		},

		checkEmail: function() {
			var getValue = this.getView().byId("input_checkEmail").getValue();
			if (getValue !== "") {
				var data = {
					email: getValue
				};
				var check = models.checkEmail(data);
				if (check === "success") {
					MessageBox.success("Email được quyền chuyển thành Cửa hàng");
					this.checkVerifyEmail = true;
				} else {
					MessageBox.error("Email không được quyền!");
					this.checkVerifyEmail = false;
				}
			}
		},

		onChangeOwnShop: function() {
			var check = this.checkVerifyEmail;
			if (check === true) {
				var shopId = this._detailShopDialog.getModel("listResult").getProperty("/id");
				var email = this.getView().byId("input_checkEmail").getValue();
				var change = models.changeOwnShop(shopId, email);
				if (change === "success") {
					MessageBox.success("Kích hoạt tài khoản thành chủ Cửa hàng thành công!");
					this._detailShopDialog.close();
				} else {
					MessageBox.error("Kích hoạt thất bại!");
				}
			} else {
				MessageBox.error("Bạn phải kiểm tra Email trước khi chuyển quyền Cửa hàng!");
			}
		}
	});
});