sap.ui.define([
	"sap/ui/demo/toolpageapp/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	'sap/ui/demo/toolpageapp/model/models'
], function(BaseController, MessageToast, JSONModel, MessageBox, models) {
	"use strict";
	return BaseController.extend("sap.ui.demo.toolpageapp.controller.LoginView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf mortgage.pawnshop.view.LoginView
		 */
		onInit: function() {
			var loginModel = new JSONModel({
				username: "",
				password: "",
				failed: false,
				isLogging: false
			});
			this.setModel(loginModel, "loginModel");
		},

		onLoginPressed: function() {
			var emailValue = this.getView().byId("_txtUsername").getValue();
			var checkEmail = this.validateEmailGlobal(emailValue);
			// var loginModel = this.getModel("loginModel");
			var username = this.getView().byId("_txtUsername").getValue();
			var password = this.getView().byId("_txtPassword").getValue();
			// var username = loginModel.getProperty("/username");
			// var password = loginModel.getProperty("/password");
			// 
			if (username === "" || password === "") {
				this.getView().byId("_txtUsername").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("_txtPassword").setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error("Không được để trống!");
			} else if (!checkEmail) {
				//  !checkEmail
				MessageBox.error("Email không đúng định dạng");
			} else {
				var dataLogin = models.checkLogin(username, password);
				// console.log(dataLogin);
				if (dataLogin.status === 401) {
					localStorage.setItem("isLogging", false);
					MessageBox.error("Email hoặc Mật khẩu không đúng!");
				} else if (dataLogin.role.id === 4) {
					// this.getGlobalModel().setProperty("/accountId", dataLogin.id);
					// this.getGlobalModel().setProperty("/username", dataLogin.username);
					// this.getGlobalModel().setProperty("/roleId", dataLogin.role);
					// this.getGlobalModel().setProperty("/password", dataLogin.password);
					this.setAccountUser(dataLogin.username, dataLogin.id, dataLogin.role, dataLogin.password);

					//save_login to LocalStorage
					localStorage.setItem("username", dataLogin.username);
					localStorage.setItem("uid", dataLogin.id);

					this.getRouter().navTo("shopManager");
				} else {
					MessageBox.error("Đăng nhập thất bại!");
				}
			}
		},

		validateEmail: function() {
			var emailValue = this.getView().byId("userName").getValue();

			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!mailregex.test(emailValue)) {
				this.getView().byId("userName").setValueState(sap.ui.core.ValueState.Error);
			}
		},

		onBeforeRendering: function() {},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf mortgage.pawnshop.view.LoginView
		 */
		onAfterRendering: function() {},
		getSavedLoginData: function() {},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf mortgage.pawnshop.view.LoginView
		 */
		onExit: function() {}

	});

});