sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/BusyDialog",
	'sap/m/MessageToast',
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, BusyDialog, MessageToast, Device, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.toolpageapp.controller.BaseController", {

		initFragment: function(sFragName, sModelName) {
			var fragment = sap.ui.xmlfragment(this.getView().getId(), sFragName, this);
			this.getView().addDependent(fragment);
			fragment.setModel(new JSONModel(), sModelName);
			fragment.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			return fragment;
		},
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getGlobalModel: function() {
			return this.getOwnerComponent().getModel("globalProperties");
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resource model of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		openBusyDialog: function(oSetting) {
			if (!this.busyDialog) {
				this.busyDialog = new BusyDialog(oSetting);
			} else {
				this.busyDialog.setTitle(oSetting.title);
				this.busyDialog.getText(oSetting.text);
				this.busyDialog.setShowCancelButton(oSetting.showCancelButton);
			}
			this.busyDialog.open();
		},
		closeBusyDialog: function() {
			if (this.busyDialog) {
				this.busyDialog.close();
			}
		},
		/**
		 * Convenience method for getting the control of view by Id.
		 * @public
		 * @param {string} sId id of the control
		 * @returns {sap.m.control} the control
		 */
		getId: function() {
			return this.getView().getId();
		},
		getSId: function(id) {
			return this.getView().getId() + "--" + id;
		},
		/**
		 * Convenience method for getting the control of view by Id.
		 * @public
		 * @param {string} sId id of the control
		 * @returns {sap.m.control} the control
		 */
		toast: function(sMessage) {
			return MessageToast.show(sMessage);
		},

		back: function() {
			window.history.back();
		},

		getDevice: function() {
			return Device;
		},
		dialogClose: function(oSource) {
			oSource.close();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		createModel: function(sName) {
			var model = new JSONModel();
			this.getView().setModel(model, sName);
		},
		onDialogClose: function(e) {
			e.getSource().getParent().close();
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getFilterParmeter: function() {
			return this.getOwnerComponent().getModel("globalFilterParam");
		},
		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {object} the global Propery model
		 */
		getCartModel: function() {
			return this.getOwnerComponent().getModel("CartProperties");
		},
		/**
		 * Convenience method
		 * @returns {object} the application controller
		 */
		getApplication: function() {
			return this.getGlobalModel().getProperty("/application");
		},

		dialogAfterclose: function() {
			if (this._oDialog) {
				this._oDialog.destroy(); //destroy only the content inside the Dialog
			}
		},

		validateEmailGlobal: function(email) {

			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

			if (!mailregex.test(email)) {
				return false;
			}
			return true;
		},

		isLogging: function() {
			var uid = localStorage.getItem("uid");
			var email = localStorage.getItem("email");
			if (!uid) {
				this.getRouter().navTo("loginView");
				this.getGlobalModel().setProperty("/isLogging", 1);
				// MessageBox.error("Xin lỗi! Bạn cần đăng nhập để tiếp tục");
			} else {
				this.getGlobalModel().setProperty("/accountId", uid);
				this.getGlobalModel().setProperty("/username", email);
			}
		}
	});

});