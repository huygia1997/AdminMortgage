sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";
	var serverInfo = {
		url: "https://backend-mortgage.dfksoft.com/new",
		// url: "http://172.20.10.2:8080", //máy HuyTG
		localUrl: "model",
		useLocal: false
	};
	return {
		getServerInfo: function() {
			return serverInfo;
		},
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		getAllUser: function() {
			var data;
			var url = serverInfo.url + "/danh-sach-nguoi-dung";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getAllCategory: function() {
			var data;
			var url = serverInfo.url + "/get-all-category";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getAllShop: function() {
			var data;
			var url = serverInfo.url + "/quan-ly-cua-hang";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getShopDetail: function(shopId, increaseView) {
			var data;
			var isAdmin = true;
			var url = serverInfo.url + "/thong-tin-cua-hang?shopId=" + shopId + "&increaseView=" + increaseView + "&isAdmin=" + isAdmin;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		activateShop: function(shopId, action) {
			var data;
			var url = serverInfo.url + "/xu-ly-yeu-cau?shopId=" + shopId + "&action=" + action;
			var dataRequest = {
				shopId: shopId,
				action: action
			};
			$.ajax({
				type: "POST",
				url: url,
				data: dataRequest,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getUserDetail: function(userId) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/userDetail.json";
			} else {
				url = serverInfo.url + "/thong-tin-nguoi-dung?userId=" + userId;
			}
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		changeRoleOfUser: function(roleId, email) {
			var data;
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/userDetail.json";
			} else {
				url = serverInfo.url + "/sua-thong-tin-nguoi-dung";
			}
			var dataAjax = {
				roleId: roleId,
				email: email
			};
			$.ajax({
				type: "POST",
				url: url,
				data: dataAjax,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		checkLogin: function(username, password) {
			var data;
			var ajaxData = {
				username: username,
				password: password
			};
			var url;
			if (serverInfo.useLocal) {
				url = serverInfo.localUrl + "/account.json";
			} else {
				url = serverInfo.url + "/dang-nhap";
			}
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				dataType: 'json',
				data: ajaxData,
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getRoleOfUser: function() {
			var data;
			var url = serverInfo.localUrl + "/roleOfUser.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		getStatusShop: function() {
			var data;
			var url = serverInfo.localUrl + "/statusShop.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		createNewCategory: function(catName, catImg) {
			var check;
			var url = serverInfo.url + "/tao-moi-danh-muc?catName=" + catName + "&catImg=" + catImg;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					check = r;
				},
				error: function(e) {
					check = e;
				}

			});
			return check;
		},

		getCategoryDetail: function(catId) {
			var data;
			var url = serverInfo.url + "/thong-tin-danh-muc?catId=" + catId;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		updateCategory: function(categoryId, name, picUrl) {
			var data;
			var url = serverInfo.url + "/chinh-sua-danh-muc?categoryId=" + categoryId + "&name=" + name + "&picUrl=" + picUrl;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = r;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		changeOwnShop: function(shopId, email) {
			var data;
			var url = serverInfo.url + "/thay-doi-quyen-so-huu?shopId=" + shopId + "&email=" + email;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = r;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		},

		updateShopDetail: function(data) {
			var check;
			var url = serverInfo.url + "/thay-doi-thong-tin-cua-hang";
			$.ajax({
				type: "PUT",
				url: url,
				data: data,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					check = r;
				},
				error: function(e) {
					check = e;
				}

			});
			return check;
		},

		getDataCity: function() {
			var data;
			var url = serverInfo.localUrl + "/dataLocation.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}
			});
			return data;
		},

		getDataDistrict: function() {
			var data;
			var url = serverInfo.localUrl + "/dataDistrisct.json";
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}
			});
			return data;
		},

		checkEmail: function(data) {
			var check;
			var url = serverInfo.url + "/kiem-tra-tai-khoan";
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				data: data,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					check = r;
				},
				error: function(e) {
					check = e;
				}
			});
			return check;
		},

		changeStatusOfUser: function(data) {
			var check;
			var url = serverInfo.url + "/thay-doi-trang-thai-tai-khoan";
			$.ajax({
				type: "POST",
				url: url,
				context: this,
				data: data,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					check = r;
				},
				error: function(e) {
					check = e;
				}
			});
			return check;
		},

		getOwnerShopInfo: function(shopId) {
			var data;
			var url = serverInfo.url + "/thong-tin-nguoi-so-huu?shopId=" + shopId;
			$.ajax({
				type: "GET",
				url: url,
				context: this,
				dataType: 'json',
				async: false,
				success: function(d, r, xhr) {
					data = d;
				},
				error: function(e) {
					data = e;
				}

			});
			return data;
		}
	};

});