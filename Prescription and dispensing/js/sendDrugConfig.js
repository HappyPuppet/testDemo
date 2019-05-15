/**
 * Created by Sean.S on 2018/9/29.
 */
//路由----------------------------
this.urlHead='http://10.0.0.244';
//发药搜索路由
this.sendDrugUrl=urlHead+'/medicalData/apis/apiData_MN.apl?model=fy&key=';
//缴费搜索路由
this.openDrugUrl=urlHead+'/medicalData/apis/apiData_MN.apl?model=jf&key=';
//详细用药信息路由
this.detailDrugInf=urlHead+'/medicalData/apis/apiData_MN.apl?model=list&key=';
//发药路由
this.reallyDrugSendUrl=urlHead+'/medicalData/apis/apiData_MN.apl?model=bjfy&key=';
//缴费路由
this.reallyDrugPayUrl=urlHead+'/medicalData/apis/apiData_MN.apl?model=bjjf&key=';