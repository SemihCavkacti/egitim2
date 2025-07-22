sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.yedas.mm.employees.controller.Main", {
        //ilk yükleme aşamasında bu fonksiyona düşer
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("mainModel");
            this.getView().setModel(this.oModel, "mainModel");

            this.oDataModel = this.getOwnerComponent().getModel();

            //Sayfa yönlendirmelerinde kullanıcılacak tanımlama
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.getRoute("main").attachPatternMatched(this._onObjectMatched, this);

            this.onConfig();
            this.onLoadPers();

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

        _onObjectMatched : function(oEvent){
            this.onLoadPers();
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

        onSelectEmployees : function(oEvent){
            var oItem = oEvent.getParameter("listItem").getBindingContext("mainModel").getObject();
            var userId = oItem.Userid;

            
            this._oRouter.navTo("Detail",{pernr : userId});
            


        },

        //Pernr SH listesinin seçim eventi
        onDialogClose : function(oEvent){
            var oModel = this.getView().getModel("mainModel"); 
            var oItem = oEvent.getParameter("selectedItem");
            var oContext = oItem.getBindingContext("mainModel").getObject();

            oModel.setProperty("/Userid", oContext.Sicilno);
            oModel.setProperty("/Username", oContext.Username);
            oModel.setProperty("/Usersname", oContext.Usersname);
        },

        //Personel Ekleme Fonksiyonu
        onAddPers : function(){
            var that = this;
            var oSelectItem = this.getView().byId("id_citySelect");
            var userId = this.oModel.getProperty("/Userid");
            var userName = this.oModel.getProperty("/Username");
            var userSName = this.oModel.getProperty("/Usersname");
            var userDep = this.oModel.getProperty("/Departman");
            var userCity = oSelectItem.getSelectedItem().mProperties.text;
            var userStatu = (this.oModel.getProperty("/persStatu") == true) ? 'X' : '';
            

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
                    MessageBox.success("İşlem Başarı ile gerçekleşti!");
                    that.onLoadPers();
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Bir hata oluştu!");
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
                    that.oModel.setProperty("/employees", oData.results);
                    that.oModel.setProperty("/count", oData.results.length);
                },
                error : function(oError){
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Bir hata oluştu!");
                }
            });
        },

        //Satır bazlı personel silme işlemi gerçekleştirilir.
        onDeletePers : function(oEvent){
            var that = this;
            var oContent = oEvent.getSource().getBindingContext("mainModel");
            var userId = oContent.getObject().Userid;

            if(userId !== ""){
            MessageBox.success("User Id'si" + userId + "olan satır silinecektir." + "Emin misiniz ?", {
                title : "İşlem Türü",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.OK,
                onClose: function (sAction) {
					if(sAction == "OK") {
                         sap.ui.core.BusyIndicator.show();
                        that.oDataModel.remove(`/EmployeesSet(Userid='${userId}')`,{
                            success : function(oData, response){
                                sap.ui.core.BusyIndicator.hide();
                                MessageBox.success("Silme işlemi başarı ile gerçekleşti!");
                                that.onLoadPers();

                            },
                            error : function(oError){
                                sap.ui.core.BusyIndicator.hide();
                                MessageBox.error("Bir hata oluştu!");
                        }

            });
                    }
                    else {
                        return;
                    }

				},
                dependentOn: this.getView()

            });
            }
            
            else {
                sap.m.MessageToast.show("User id alanı boş olamaz.");
            }

        }
    });
});
