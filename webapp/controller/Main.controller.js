sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.yedas.mm.employees.controller.Main", {
        //ilk yükleme aşamasında bu fonksiyona düşer
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("mainModel");
            this.getView().setModel(this.oModel, "mainModel");

            this.oDataModel = this.getOwnerComponent().getModel();

            this.onConfig();
        },

        //Görsel kısımlar yüklendikten sonra bu kısma düşer
        onAfterRendering : function(){

        },

        //Görsek kısımlar henüz yüklenmeden bu fonksiyona düşer
        onBeforeRendering :function(){

        },

        //Uygulamadan çıktığında bu fonksiyona düşer.
        onExit : function(){

        },

        onConfig : function(){
            var that = this;
            
            sap.ui.core.BusyIndicator.show();
            this.oDataModel.read("/getEmployeesPernrSet",{
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();
                    that.oModel.setProperty("/pernrList", oData.results);
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },


        //Sicil No inputunun search help'i tetiklenir.
        handleValueHelpRequest : function(){
            if (!this.oDialog) {
                this.oDialog = sap.ui.xmlfragment("com.yedas.mm.employees.fragments.SHGetPernrList", this);
                this.getView().addDependent(this.oDialog);
            }
            this.oDialog.open();

        },

        //Pernr SH listesinin seçim eventi
        onDialogClose : function(oEvent){
            var oModel = this.getView().getModel("mainModel"); 
            var oItem = oEvent.getParameter("selectedItem");
            var oContext = oItem.getBindingContext("mainModel").getObject();

            oModel.setProperty("/productName", oContext.name);
        },

        //Personel Ekleme Fonksiyonu
        onAddPers : function(){
            var that = this;
            var userId = this.oModel.getProperty("/Userid");
            var userName = this.oModel.getProperty("/Username");
            var userSName = this.oModel.getProperty("/Usersname");
            var userDep = this.oModel.getProperty("/Departman");
            var userCity = this.oModel.getProperty("/City");
            var userStatu = this.oModel.getProperty("/Statu");
            

            var oData = {
                Userid      : userId,
                Username    : userName,
                Usersname   : userSName,
                Departman   : userDep,
                City        : userCity,
                Statu       : userStatu
            }

            sap.ui.core.BusyIndicator.show();
            this.oDataModel.create("/EmployeesSet", oData, {
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });

        },

        //Personel Update Fonksiyonu
        onUpdatePers : function(){
            var that = this;
            var userId = this.oModel.getProperty("/Userid");
            var userName = this.oModel.getProperty("/Username");
            var userSName = this.oModel.getProperty("/Usersname");
            var userDep = this.oModel.getProperty("/Departman");
            var userCity = this.oModel.getProperty("/City");
            var userStatu = this.oModel.getProperty("/Statu");
            

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
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });

        },


        //İlgili User'ın datasını almak için kullanılır.    
        onGetData : function(oEvent){
            var that = this;
            var userId = this.oModel.getProperty("/Userid");

            sap.ui.core.BusyIndicator.show();
            this.oDataModel.read(`/EmployeesSet(Userid='${userId}')`,{
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();
                    that.oModel.setProperty("/Username", oData.Username);
                    that.oModel.setProperty("/Usersname", oData.Usersname);
                    that.oModel.setProperty("/Departman", oData.Departman);
                    that.oModel.setProperty("/City", oData.City);
                    that.oModel.setProperty("/Statu", oData.Statu);
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });
        },


        //Tüm tablodaki verinin yüklenmesi
        onLoadPers : function(){
            var that = this;
            
            sap.ui.core.BusyIndicator.show();
            this.oDataModel.read("/EmployeesSet",{
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();

                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },

        onDeletePers : function(){
            var userId = this.oModel.getProperty("/Userid");

            if(userId !== ""){

            sap.ui.core.BusyIndicator.show();
            this.oDataModel.remove(`/EmployeesSet(Userid='${userId}')`,{
                success : function(oData, response){
                    sap.ui.core.BusyIndicator.hide();
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                }

            });
            }

            else {
                sap.m.MessageToast.show("User id alanı boş olamaz.");
            }

        }
    });
});
