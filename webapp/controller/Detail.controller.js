sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.yedas.mm.employees.controller.Detail", {
        //ilk yükleme aşamasında bu fonksiyona düşer
        onInit: function () {

            //Global olarak projede kullanacağımız mainmodel(jsonmodel)
            this.oModel = this.getOwnerComponent().getModel("mainModel");
            this.getView().setModel(this.oModel, "mainModel");

            //Global olarak projemizde kullacağımız oData model(backend işlemlerini gerçekleştirmek için)
            this.oDataModel = this.getOwnerComponent().getModel();

            //Sayfa yönlendirmelerinde kullanıcılacak tanımlama
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

        },

        _onObjectMatched : function(oEvent){
            var argument = oEvent.getParameter("arguments");

            this.onGetData(argument.pernr);
        },

        //İlgili User'ın datasını almak için kullanılır.    
        onGetData : function(userId){
            var that = this;

            sap.ui.core.BusyIndicator.show();
            this.oDataModel.read(`/EmployeesSet(Userid='${userId}')`,{
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();
                    that.oModel.setProperty("/DetailUserid", oData.Userid);
                    that.oModel.setProperty("/DetailUsername", oData.Username);
                    that.oModel.setProperty("/DetailUsersname", oData.Usersname);
                    that.oModel.setProperty("/DetailDepartman", oData.Departman);
                    that.oModel.setProperty("/DetailCity", oData.City);
                    that.oModel.setProperty("/DetailStatu", (oData.Statu === 'X') ? true : false);
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });
        },

        //Personel Update Fonksiyonu
        onUpdatePers : function(){
            var that = this;
            var userId = this.oModel.getProperty("/DetailUserid");
            var userName = this.oModel.getProperty("/DetailUsername");
            var userSName = this.oModel.getProperty("/DetailUsersname");
            var userDep = this.oModel.getProperty("/DetailDepartman");
            var userCity = this.oModel.getProperty("/DetailCity");
            var userStatu = (this.oModel.getProperty("/DetailStatu") === true) ? 'X' : '';
            

            var oData = {
                Userid      : userId,
                Username    : userName,
                Usersname   : userSName,
                Departman   : userDep,
                City        : userCity,
                Statu       : userStatu
            }

            sap.ui.core.BusyIndicator.show();
            this.oDataModel.update(`/EmployeesSet(Userid='${userId}')`, oData, {
                success : function(oData, response){
                sap.ui.core.BusyIndicator.hide();
                MessageBox.success("User Id'si" + userId + "olan satır güncellendi!", {
                title : "İşlem Türü",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
					if(sAction == "OK") {   
                        //that._oRouter.navBack();
                        that._oRouter.navTo("main", {});
                    }
                    else {
                        return;
                    }

				},
                dependentOn: that.getView()

                });
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });

        },

    });
});