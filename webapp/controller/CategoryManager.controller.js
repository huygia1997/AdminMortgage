sap.ui.define([
	'sap/ui/demo/toolpageapp/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'sap/ui/demo/toolpageapp/model/formatter',
	'sap/ui/demo/toolpageapp/model/models',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Device, formatter, models, Filter, FilterOperator) {
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

		onCreateCate: function() {

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
		}
	});
});