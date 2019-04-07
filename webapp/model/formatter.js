sap.ui.define([
	"sap/base/strings/formatMessage",
	'sap/ui/demo/toolpageapp/controller/BaseController',
	"sap/ui/core/ValueState"
], function(formatMessage, BaseController, ValueState) {
	"use strict";
	return {
		formatMessage: formatMessage,

		/**
		 * @public
		 * @param {boolean} bIsPhone the value to be checked
		 * @returns {string} path to image
		 */
		srcImageValue: function(bIsPhone) {
			var sImageSrc = "";
			if (bIsPhone === false) {
				sImageSrc = "./images/homeImage.jpg";
			} else {
				sImageSrc = "./images/homeImage_small.jpg";
			}
			return sImageSrc;
		},

		shopStatusDesc: function(sStatus) {
			var i18n = this.getResourceBundle();
			switch (sStatus) {
				case 1:
					return i18n.getText("UNACTIVE");
				case 2:
					return i18n.getText("ACTIVE");
				case 3:
					return i18n.getText("BANNED");
				default:
					return "";
			}
		},

		shopStatusState: function(sStatus) {
			switch (sStatus) {
				case 1:
					return ValueState.Warning;
				case 2:
					return ValueState.Success;
				case 3:
					return ValueState.Error;
			}
		},

		roleUser: function(roleId) {
			var i18n = this.getResourceBundle();
			switch (roleId) {
				case 4:
					return i18n.getText("ROLE_ADMIN");
				case 2:
					return i18n.getText("ROLE_PAWNER");
				case 3:
					return i18n.getText("ROLE_SHOP");
				default:
					return "";
			}
		},
		
		roleUserState: function(sStatus) {
			switch (sStatus) {
				case 4:
					return ValueState.Warning;
				case 2:
					return ValueState.Success;
				case 3:
					return ValueState.Error;
			}
		}
	};
});