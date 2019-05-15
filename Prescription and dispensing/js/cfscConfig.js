/**
 * Created by Sean.S on 2018/6/1.
 */
//定义localStorage存储的值
//发药还是缴费
//sendOrPay

    //点击”处方审查“的URL
this.urlHead='http://10.0.0.244';
this.url=urlHead+"/medicalData/webserver/doCheck.apl";
this.doCheckUrl =urlHead+"/medicalData/webserver/doCheck.apl";
//判断审查状态路由
this.sendCHeckUrL=urlHead+"/medicalData/apis/apiData_MN.apl?model=ck&key=";



this.config=function(){
    this.HZLX='2';  //HZLX:回执类型,1、警示级别+json，2、警示级别及Html、show
    this.SHOW='1';
    this.SAVE='0';
    this.BEHAVIOR='0';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
};
//-----------------------------------------------------------------------------------------------
var BRJBXX={}; //病人基本信息
var ZD={};        //诊断
var YYXX=new Array();   //用药信息
var ifSendcheck=false;
var tipAlertTimeout2;
var xx=null;
var cutDownInterval=null; //倒计时
var cutDown=null; //倒计时

//双签界面勾选其他没有
var ifOther=false;
//病人基本信息
this.PatientInf=function(){
    this.BRID='';  //BRID:病人ID
    this.HZXM='';  //HZXM:患者姓名(病人姓名)
    this.MZZYH=''; //MZZYH:门诊住院号
    this.XB='';    //XB:性别
    this.CSRQ='';  //CSRQ:出生日期
    this.SG='';    //SG:身高
    this.TZ='';    //TZ:体重
    this.BRZT='';  //BRZT:哺乳状态
    this.RCZT='';  //RCZT:妊娠状态
    this.YQ='';    //YQ:孕期
    this.JZKS='';  //JZKS:就诊科室
    this.JZKSDM='';  //KSDM:就诊科室代码
    this.ZGYS='';  //ZGYS:主管医生(就诊医师)
    this.YSBH='';  //YSBH:医师编号
    this.JZRQ='';  //JZRQ:就诊日期
    this.CFLY='';  //CFLY:处方来源
    this.MZZYCS='';  //MZZYCS:门诊住院次数
    this.MXB='';  //MXB:慢性病
    this.SSMC='';  //SSMC:手术名称
    this.SSBM='';  //SSBM:手术编码
};

//诊断
this.DiagnosisInfo=function(){
    this.DiseaseName='';  //DiseaseName:诊断
};

//用药信息
this.DrugUseInfo=function(){
    this.YPDM='';  //YZLX:药品代码
    this.YZLX =''; //YZLX:医嘱类型
    this.Z ='';    //Z:组
    this.YPMC =''; //YPMC:药品名称
    this.JX='';    //JX:剂型
    this.GG='';    //GG:规格
    this.CJ='';    //CJ:厂家
    this.YPSL =''; //YPSL:药品数量
    this.SLDW = '';//SLDW:数量单位
    this.DCYL = '';//DCYL:单次用药
    this.YLDW =''; //YLDW:用量单位
    this.TJ = '';  //TJ:途径
    this.PC = '';  //PC:频次
    this.YYTS =''; //YYTS:用药天数
    this.YPINDX =''; //YPINDX:药品唯一标识
    this.DS='';  //MZZYCS:滴速
    this.DZSJ='';  //MXB:滴注时间
};


//弹出函数
function tipAlertShow(myString){
    clearTimeout(tipAlertTimeout2);
    $('.tipBody span').text(myString);
    $('.tipAlert').slideDown();
    tipAlertTimeout2=setTimeout(function(){
        $('.tipAlert').slideUp();
    },2000);
}

//      判断正整数
function isPositiveInteger(s){//是否为正整数
    var re = /^[0-9]+$/ ;
    return re.test(s)
}

//      判断正数
function isPositive(num){
    var reg = /^\d+(?=\.{0,1}\d+$|$)/
    if(reg.test(num)){
        return true;
    }else{
        return false ;
    }

}
//      不为0开头的正则
function ifNotZeroStart(num){
    var reg = /^[1-9][0-9]*$/
    if(reg.test(num)){
        return true;
    }else{
        return false ;
    }

}

//处方审查AJAX
function doCheck()
{
    //clearInterval(cutDownInterval);
    //重置单选框he文本域
    $('#needReasonInput').prop('checked',true);
    $('#otherReasonInput').prop('checked',false);
    $('#reasonDetail').attr('disabled',true);
    $('#reasonDetail').val('');
    ifOther=false;
    var rightInput=true;
    $('#medicineInf-firstTr~tr').each(function(){
        if(!isPositiveInteger($(this).find('td:nth-child(9)').text())){
            tipAlertShow('药品数量应该为正整数！');
            rightInput=false;
            return false;
        }

        if($(this).find('td:nth-child(9)').text().length>8){
            tipAlertShow('药品数量最多输入8位！');
            rightInput=false;
            return false;
        }



        if(!isPositiveInteger($(this).find('td:nth-child(15)').text())){
            tipAlertShow('用药天数应该为正整数！');
            rightInput=false;
            return false;
        }
        if($(this).find('td:nth-child(15)').text().length>8){
            tipAlertShow('用药天数最多输入8位！');
            rightInput=false;
            return false;
        }



        if(BRJBXX.CFLY==3){
            if(!isPositiveInteger($(this).find('td:nth-child(16)').text())&&($(this).find('td:nth-child(16)').text())){
                tipAlertShow('滴速应该为正整数！');
                rightInput=false;
                return false;
            }
            if(($(this).find('td:nth-child(16)').text().length>8)&&($(this).find('td:nth-child(16)').text())){
                tipAlertShow('滴速最多输入8位！');
                rightInput=false;
                return false;
            }

            if(!isPositiveInteger($(this).find('td:nth-child(17)').text())&&($(this).find('td:nth-child(17)').text())){
                tipAlertShow('滴注时间应该为正整数！');
                rightInput=false;
                return false;
            }
            if(($(this).find('td:nth-child(17)').text().length>8)&&($(this).find('td:nth-child(17)').text())){
                tipAlertShow('滴注时间最多输入8位！');
                rightInput=false;
                return false;
            }
        }



        if(!isPositive($(this).find('td:nth-child(11)').text())){
            tipAlertShow('单次用量应该为正数！');
            rightInput=false;
            return false;
        }
        if($(this).find('td:nth-child(11)').text().length>8){
            tipAlertShow('单次用量最多输入8位！');
            rightInput=false;
            return false;
        }




    });

    if(!rightInput){
        return false;
    }


    //隐藏忽略双签
    $('.forbiddenBox-btnIgnore').hide();
    var localCon = new config();
    localCon.HZLX = 2;
    localCon.SHOW='1';
    localCon.SAVE='0';
    localCon.BEHAVIOR='0';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
    $.ajax({
        type: "post",
        url: doCheckUrl,
        dataType:'json',
        data:{CONFIG:JSON.stringify(localCon),BRJBXX:JSON.stringify(BRJBXX),ZD:JSON.stringify(ZD),YYXX:JSON.stringify(YYXX)},
        success: function (date) {
            if(date.NO==0){
                $('.ReviewResults-Box>iframe').attr('src',date.DATA);
                $('.ReviewResults-Box').show();
                ifSendcheck=false;
                $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});
            }else{
                ifSendcheck=true;
                $('.userModels>.userModels-sedExamination').css({background:"#02cb90",cursor:"pointer"});
            }
            if(date.LJ==1){
                $('.f-btn-submit').hide();
                $('.f-btn-stopSubmit').show();
                ifSendcheck=false;
                $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});
                $('.leftForbiddenShow').css({display:"inline-block"});
            }else{
                $('.f-btn-submit').show();
                $('.f-btn-stopSubmit').hide();
                $('.leftForbiddenShow').css({display:"none"});

            }
            $('#medicineInf-firstTr~tr').each(function(){

                //先判断有药品名称否
                var medicineName=$(this).find('td:nth-child(5)').text();
                if(medicineName){
                    var leve=parseInt($(this).attr('Medicine-sign'));
                    var myleve=eval(date.XLEVEL);
                    var newLeve=myleve[leve];
                    switch(newLeve){
                        case 1:$(this).children('td:nth-child(1)').find('img').attr('src','../img/fobiden.png').css({visibility: "visible"});break;
                        case 2:$(this).children('td:nth-child(1)').find('img').attr('src','../img/Notrecommend.png').css({visibility: "visible"});break;
                        case 3:$(this).children('td:nth-child(1)').find('img').attr('src','../img/Carefuluse.png').css({visibility: "visible"});break;
                        case 4:$(this).children('td:nth-child(1)').find('img').attr('src','../img/focus.png').css({visibility: "visible"});break;
                        case 5:$(this).children('td:nth-child(1)').find('img').attr('src','../img/tip.png').css({visibility: "visible"});break;
                        default :$(this).children('td:nth-child(1)').find('img').attr('src','../img/pass.png').css({visibility: "visible"});break;
                    }
                }

            });


        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });

}


// 进度条增长
function stepprocessbar() {
    var pb = document.getElementById("processbar");
    pb.value = pb.value + 1;

    // 进度显示label
    //var processlabel = document.getElementById("processvalue");
    //processlabel.innerText= pb.value + '%';
    //processlabel.textContent = pb.value + '%';// FF 不支持innerText

    if (pb.value <99) {
        setTimeout(function () {
            stepprocessbar();
        }, 50)
    }
}

// 重置进度条
function resetprocess() {
    var pb = document.getElementById("processbar");
    if (pb.value != 100) return;
    document.getElementById("processbar").value = 0;
    stepprocessbar();
}


//发送没问题的审查AJaX
function successSend(){
    if(ifSendcheck){
        //数据落地
        var localCon = new config();
        localCon.HZLX = 2;
        localCon.SHOW='0';
        localCon.SAVE='1';
        localCon.BEHAVIOR='0';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
        $.ajax({
            type: "post",
            url: doCheckUrl,
            dataType:'json',
            data:{CONFIG:JSON.stringify(localCon),BRJBXX:JSON.stringify(BRJBXX),ZD:JSON.stringify(ZD),YYXX:JSON.stringify(YYXX)},
            success: function (date) {
                ifSendcheck=false;
                $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});

                tipAlertShow('发送成功');
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    }
}

//忽略双签
function IgnoreCheck(){
    var localCon = new config();
    localCon.HZLX = 2;
    localCon.SHOW='0';
    localCon.SAVE='1';
    localCon.BEHAVIOR='4';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
    $.ajax({
        type: "post",
        url: doCheckUrl,
        dataType:'json',
        data:{CONFIG:JSON.stringify(localCon),BRJBXX:JSON.stringify(BRJBXX),ZD:JSON.stringify(ZD),YYXX:JSON.stringify(YYXX)},
        success: function (date) {
            ifSendcheck=false;
            $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});

            $('.ReviewResults-Box').hide();
            tipAlertShow('忽略双签成功');
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}


//提交审查
function sendCheck(){
    clearTimeout(xx);

    $('.MaskWindow').show();
    //数据落地
    var localCon = new config();
    localCon.HZLX = 2;
    localCon.SHOW='0';
    localCon.SAVE='1';
    localCon.BEHAVIOR='1';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
    $.ajax({
        type: "post",
        url: doCheckUrl,
        dataType:'json',
        data:{CONFIG:JSON.stringify(localCon),BRJBXX:JSON.stringify(BRJBXX),ZD:JSON.stringify(ZD),YYXX:JSON.stringify(YYXX)},
        success: function (date) {
            ifSendcheck=false;
            $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});

            xx=setTimeout(function(){

            },2000);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });


    //不停发送Ajax判断审查状态
    var pb = document.getElementById("processbar");
    pb.value = 0;
    stepprocessbar();
    var setTimoutSendCheck=setInterval(function(){
        clearInterval(cutDownInterval);
        $.ajax({
            type: "post",
            url: sendCHeckUrL+BRJBXX.BRID,
            dataType:'json',
            data:{},
            success: function (date) {


                $('.MaskWindow').hide();
                //先判断医师是否在线
                if(date[0].ONLINE==1){

                    //只显示返回he提交申请
                    $('.f-btn>button').hide();
                    $('.f-btn-back').show();
                    $('.f-btn-submit').show();

                    $('.forbiddenBox').show();
                    if(date[0].stat=="审"){
                        $('.mycheckRuslt-bbbox').text("您的处方/医嘱已提交，正在等待审方药师审核，请稍等...");
                        var pb = document.getElementById("processbar");
                        pb.value = 0;
                        stepprocessbar();
                    }else if(date[0].stat=="过"){
                        var pb = document.getElementById("processbar");
                        pb.value = 100;
                        $('.mycheckRuslt-bbbox').text("审方药师审核已通过");
                        $('.ReviewResults-Box').hide();
                        setTimeout(function(){
                            $('.mycheckRuslt-bbbox').text("");
                            $('.forbiddenBox').hide();
                        },1000);
                        clearInterval(setTimoutSendCheck);
                    }else if(date[0].stat=="拒"){
                        //启动医师干预倒计时
                        cutDown=date[0].t;
                        $('.cutDown').show();
                        cutDownInterval=setInterval(function(){
                            if(cutDown>0){
                                $('#cutDownSpan').text(cutDown);
                                $('.cutDown').show();
                                cutDown--;
                            }else{
                                cutDown=0;
                                $('#cutDownSpan').text(cutDown);
                                $('.cutDown').hide();
                                $('.noPassBox').hide();

                                $('.ReviewResults-Box').hide();
                                ifSendcheck=false;
                                $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});

                                clearInterval(cutDownInterval);
                            }

                        },1000);


                        var pb = document.getElementById("processbar");
                        pb.value = 0;
                        $('.forbiddenBox').hide();
                        $('.noPassBox').show();
                        $('.forbiddenBox-btnDoubleDoIt').show();
                        if(date[0].QZTJ==1){
                            $('.forbiddenBox-btn2').show();
                        }else{
                            $('.forbiddenBox-btn2').hide();
                        }
                        $('.mycheckRuslt-bbbox').text("");

                        //未通过审查页面加载数据
                        var myInformation=JSON.parse(date[0].CHECK_MSG);

                        $('#checkDoctorName').text(myInformation.pharName);
                        var html='';

                        for(var i=0 ;i<myInformation.problems.length;i++){
                            var myImg='';
                            if(myInformation.problems[i].xLevel==1){
                              myImg='<img src="../img/fobiden.png" alt="禁用图标"/>';
                            }else if(myInformation.problems[i].xLevel==2){
                                myImg='<img src="../img/Notrecommend.png" alt="不推荐图标"/>';
                            }else if(myInformation.problems[i].xLevel==3){
                                myImg='<img src="../img/Carefuluse.png" alt="慎用图标"/>';
                            }else if(myInformation.problems[i].xLevel==4){
                                myImg='<img src="../img/focus.png" alt="关注图标"/>';
                            }else{

                            }
                            html+= '<li>'+
                                        '<div>'+
                                        '<span>'+(i+1)+'</span>.'+
                                        myImg+
                                        '<span>'+myInformation.problems[i].sourceName+'</span>'+
                                        '</div>'+
                                        '<div>'+myInformation.problems[i].describeColorTitle+'</div>'+
                                    '</li>';

                        }
                        $('#noPassBoxUl').html(html);
                        $('#feedback-content').val(myInformation.checkMsg);
                        clearInterval(setTimoutSendCheck);
                    }else{

                    }
                }else{
                    //关闭医师干预倒计时
                    cutDown=0;
                    $('#cutDownSpan').text(cutDown);
                    $('.cutDown').hide();
                    clearInterval(cutDownInterval);

                    tipAlertShow('审核医师不在岗');
                    //只显示忽略双签和返回修改
                    $('.f-btn>button').hide();
                    $('.f-btn-back').show();
                    $('.forbiddenBox-btnIgnore').show();
                    clearInterval(setTimoutSendCheck);
                }

            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    },1000);


}
//双签提交
function doubleCheckPass(val){

    //关闭医师干预倒计时
    cutDown=0;
    $('#cutDownSpan').text(cutDown);
    $('.cutDown').hide();
    clearInterval(cutDownInterval);

    //发送用药理由
    var drugUseReason=$('#reasonDetail').val();
    var myReason;

    if(val){
         if(!(drugUseReason.trim())){
             tipAlertShow('请填写用药理由或者勾选“患者病情需要”单选框');
             return false;
         }else{
             $('.MaskWindow').show();
             myReason=drugUseReason;
         }
    }else{
        $('.MaskWindow').show();
        myReason='患者病情需要';
    }


    var localCon = new config();
    localCon.HZLX = 2;
    localCon.SHOW = '0';
    localCon.SAVE = '1';
    localCon.BEHAVIOR='2';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
    $.ajax({
        type: "post",
        url: doCheckUrl,
        dataType: 'json',
        data: {
            CONFIG: JSON.stringify(localCon),
            BRJBXX: JSON.stringify(BRJBXX),
            ZD: JSON.stringify(ZD),
            YYXX: JSON.stringify(YYXX),
            YYLY:myReason
        },
        success: function (date) {
            ifSendcheck=false;
            $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });


    //不停发送Ajax判断审查状态
    var pb = document.getElementById("processbar");
    pb.value = 0;
    stepprocessbar();
    var setTimoutSendCheck2=setInterval(function(){

        $.ajax({
            type: "post",
            url: sendCHeckUrL+BRJBXX.BRID,
            dataType:'json',
            data:{},
            success: function (date) {
                //CHECK_MSG   CHECK_STATUS
                $('.MaskWindow').hide();

                $('.forbiddenBox').show();
                $('.ReviewResults-Box').hide();
                if(date[0].CHECK_STATUS=='14'){
                    $('.forbiddenBox').hide();
                    $('.noPassBox').hide();
                    $('#reasonDetail').val('');
                    tipAlertShow('医师处方双签申请超时');
                    clearInterval(setTimoutSendCheck2);
                }else if(date[0].CHECK_STATUS=='13'){
                    $('.forbiddenBox').hide();
                    $('.noPassBox').hide();
                    $('#reasonDetail').val('');
                    tipAlertShow('审方药师未双签但给予通过');
                    clearInterval(setTimoutSendCheck2);
                }else if(date[0].CHECK_STATUS=='16'){
                    var pb = document.getElementById("processbar");
                    pb.value = 100;
                    $('.forbiddenBox').hide();
                    $('.noPassBox').hide();
                    $('#reasonDetail').val('');
                    tipAlertShow('双签执行通过');
                    clearInterval(setTimoutSendCheck2);
                }else if(date[0].CHECK_STATUS=='22'){




                    $('.forbiddenBox').hide();
                    $('.noPassBox').show();
                    $('.forbiddenBox-btnDoubleDoIt').hide();
                    tipAlertShow('双签执行未通过');

                    var myInformation=JSON.parse(date[0].DOUBLE_MSG);
                    $('#checkDoctorName').text(myInformation.pharName);
                    var html='';

                    for(var i=0 ;i<myInformation.problems.length;i++){
                        var myImg='';
                        if(myInformation.problems[i].xLevel==1){
                            myImg='<img src="../img/fobiden.png" alt="禁用图标"/>';
                        }else if(myInformation.problems[i].xLevel==2){
                            myImg='<img src="../img/Notrecommend.png" alt="不推荐图标"/>';
                        }else if(myInformation.problems[i].xLevel==3){
                            myImg='<img src="../img/Carefuluse.png" alt="慎用图标"/>';
                        }else if(myInformation.problems[i].xLevel==4){
                            myImg='<img src="../img/focus.png" alt="关注图标"/>';
                        }else{

                        }
                        html+= '<li>'+
                            '<div>'+
                            '<span>'+(i+1)+'</span>.'+
                            myImg+
                            '<span>'+myInformation.problems[i].sourceName+'</span>'+
                            '</div>'+
                            '<div>'+myInformation.problems[i].describeTitle+'</div>'+
                            '</li>';

                    }
                    $('#noPassBoxUl').html(html);
                    $('#feedback-content').val(myInformation.checkMsg);

                    clearInterval(setTimoutSendCheck2);

                }else{
                    $('.mycheckRuslt-bbbox').text("您的双签要求已提交，正在等待审方药师双签，请稍等...");
                    var pb = document.getElementById("processbar");
                    pb.value = 0;
                    stepprocessbar();
                }

            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    },1000);

}


//强制提交
function CompulsorySubmission() {
    //关闭医师干预倒计时
    cutDown=0;
    $('#cutDownSpan').text(cutDown);
    $('.cutDown').hide();
    clearInterval(cutDownInterval);

    var localCon = new config();
    localCon.HZLX = 2;
    localCon.SHOW = '0';
    localCon.SAVE = '999';
    localCon.BEHAVIOR='3';   //0自查,1提请药师审查,2双签,3强制提交,4医生签字执行
    $.ajax({
        type: "post",
        url: doCheckUrl,
        dataType: 'json',
        data: {
            CONFIG: JSON.stringify(localCon),
            BRJBXX: JSON.stringify(BRJBXX),
            ZD: JSON.stringify(ZD),
            YYXX: JSON.stringify(YYXX)
        },
        success: function (date) {
            //console.log(date);
            $('.noPassBox').hide();
            $('.ReviewResults-Box').hide();
            tipAlertShow('强制提交成功');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });

}




