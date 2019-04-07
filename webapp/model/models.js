sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";
	var serverInfo = {
		url: "http://113.161.84.125:8089/new",
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

		getShopDetail: function(shopId) {
			var data;
			var url = serverInfo.url + "/thong-tin-cua-hang?shopId=" + shopId;
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
				url = serverInfo.url + "/sua-thong-tin-nguoi-dung?roleId=" + roleId + "&email=" + email;
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
		}
	};

});