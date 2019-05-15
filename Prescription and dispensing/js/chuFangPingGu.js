/**
 * Created by Sean.S on 2018/5/24.
 */

$(function(){




    //弹窗区域  lgy-----------------------------------------------------------------
    //定义全局变量
    var dataClickInf,dataClickFreqency,dataClickWay,ifInputSelected=false,medicineInfUrl,tipAlertTimeout,groupCount= 0,departID,doctorNum,isAlertFocus=true,MedicineSign= 0,thisOperation,operationID;




    //分别点击弹窗右上交“X”关闭对应弹窗，改变对应td中的data-isClick值
    function closeAlert(){
        $('.medicineInformation-BOx header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#medicineInf-firstTr~tr>td:nth-child(5)').attr('data-isClick',"false");
            dataClickInf=false;
            $('.medicineInformation-BOx tr').eq(0).siblings().remove();
            $('.medicineInformation-BOx .f1>div>span').text(0);
        });

        $('.medicineFrequency-BOx header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#medicineInf-firstTr~tr>td:nth-child(14)').attr('data-isClick',"false");
            dataClickFreqency=false;
            $('.medicineFrequency-BOx tr').eq(0).siblings().remove();
            $('.medicineFrequency-BOx .f1>div>span').text(0);
        });

        $('.medicineWay-BOx header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#medicineInf-firstTr~tr>td:nth-child(13)').attr('data-isClick',"false");
            dataClickWay=false;
            $('.medicineWay-BOx tr').eq(0).siblings().remove();
            $('.medicineWay-BOx .f1>div>span').text(0);
        });

        $('.ClinicDepartment-Box header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#p-Clinic-Department').removeAttr('disabled');
            $('.ClinicDepartment-Box tr').eq(0).siblings().remove();
            $('.ClinicDepartment-Box .f1>div>span').text(0);
        });

        $('.mannagerDoctor-Box header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#p-doctor').removeAttr('disabled');
            $('.mannagerDoctor-Box tr').eq(0).siblings().remove();
            $('.mannagerDoctor-Box .f1>div>span').text(0);
        });

        $('.operationName-Box header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
            $('#p-operationName').removeAttr('disabled');
            $('.operationName-Box tr').eq(0).siblings().remove();
            $('.operationName-Box .f1>div>span').text(0);
        });


        //
        $('.bookTip-Box header>div:nth-child(2)').on('click',function(){
            $('.flex-body-right>div').css({zIndex:'0',opacity:"0"});
            $('.flex-body-right>div').eq(0).css({zIndex:'1',opacity:"1"});
            //$('.bookTip-body .bookTip-body-content').css({flex:'1'});
            //$('.bookTip-body .bookTip-body-content').eq(0).css({flex:'8'});
            $('.bookTip-body .bookTip-body-content').eq(0).click();
            $(this).parent('header').parent('div').parent('div').hide();

        });


        $('.medicineBook-Box header>div:nth-child(2)').on('click',function(){
            $(this).parent('header').parent('div').parent('div').hide();
        });

        //审查弹窗点击X的关闭事件
        $('.rbh-box>div:nth-child(2)>img:nth-child(1)').on('click',function(){
            $('.ReviewResults-Box').hide();
            $('.ReviewResults-Box').css({width:'50%',height:"60vh",left:'25%',top:"25%"});

            ifSendcheck=false;
            $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});
        });
        //审查弹窗点击正方形的放大he还原事件
        $('.rbh-box>div:nth-child(2)>img:nth-child(2)').on('click',function(){
           var dataIsBig=$(this).attr('data-isBig');
            if(dataIsBig=='false'){
                $(this).attr('src','../img/back.png');
                $(this).attr('data-isBig','true');
                $('.ReviewResults-Box').css({width:'100%',height:"100vh",left:'0',top:"0",minHeight: "585px"});
            }else if(dataIsBig=='true'){
                $(this).attr('src','../img/fangDa.png');
                $(this).attr('data-isBig','false');
                $('.ReviewResults-Box').css({width:'60%',height:"60vh",left:'20%',top:"25%",minHeight: "585px"});
            }else{
                return false;
            }
            $('.userMedicine-inf').show();
        });

        //审查弹窗点击缩小的事件
        $('.rbh-box>div:nth-child(2)>img:nth-child(3)').on('click',function(){
            $('ReviewResults-Box').css({width:'10%',height:"45px",minHeight: "45px"});
            $('.userMedicine-inf').hide();
        });


        //省查结果不通过弹窗返回修改事件
        $('.forbiddenBox-btn').on('click',function(){
            $('.noPassBox').hide();
            $('.ReviewResults-Box').hide();
            $('#reasonDetail').val('');

            //关闭医师干预倒计时
            cutDown=0;
            $('#cutDownSpan').text(cutDown);
            $('.cutDown').hide();
            clearInterval(cutDownInterval);
        });

        //强制提交按钮事件
        $('.forbiddenBox-btn2').on('click',function(){
            CompulsorySubmission();
        });
        //双签执行按钮
        $('.forbiddenBox-btnDoubleDoIt').on('click',function(){
            doubleCheckPass(ifOther);
        });

        //返回修改事件
        $('.f-btn-back').on('click',function(){
            $('.ReviewResults-Box').hide();
            ifSendcheck=false;
            $('.userModels>.userModels-sedExamination').css({background:"grey",cursor:"auto"});

        });


        //提请审核事件
        $('.f-btn-submit').on('click',function(){
            sendCheck();

        });

        //忽略（双签）按钮点击事件
        $('.forbiddenBox-btnIgnore').on('click',function(){
            IgnoreCheck();
        });


        //医师检验结果提交原因点击事件
        $('input:radio[name="reason"]').change(function () {
            if($("#needReasonInput").is(":checked")){
                $('.insistOnMedication-form-reasonDetail>textarea').attr('disabled',true);
                ifOther=false;
            }
            if($("#otherReasonInput").is(":checked")){
               $('.insistOnMedication-form-reasonDetail>textarea').attr('disabled',false);
                ifOther=true;
            }
        })
    }
    closeAlert();

    //弹窗的拖动事件
    function myAlertDrag(){
        $(document).ready(function(){
            $(".alertBox").mousedown(function(e){ //e鼠标事件
                $(this).css("cursor","move");//改变鼠标指针的形状
                var myThis=$(this);
                var offset = $(this).offset();//DIV在页面的位置
                var x = e.pageX - offset.left;//获得鼠标指针离DIV元素左边界的距离
                var y = e.pageY - offset.top;//获得鼠标指针离DIV元素上边界的距离
                $(document).bind("mousemove",function(ev){ //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件
                    $(".alertBox").stop();//加上这个之后

                    var _x = ev.pageX - x;//获得X轴方向移动的值
                    var _y = ev.pageY - y;//获得Y轴方向移动的值
                    if(isAlertFocus){
                        myThis.animate({left:_x+"px",top:_y+"px"},5,'linear');
                    }
                });
            });

            $(document).mouseup(function(){
                $(".alertBox").css("cursor","default");
                $(this).unbind("mousemove");
            });
        });
    }
    //myAlertDrag();

    //双击或者单机+enter用药信息中的表格弹出对应的弹窗
    function AlertSHow(){
        //给未来元素绑定事件要绑在静态元素中。双击直接打开对应弹窗，单机改变对应td中的'data-isClick值
        $(document).on('dblclick','#medicineInf-firstTr~tr>td:nth-child(5)',function(){
            $('.medicineInformation-BOx').show();
            $('#medicineInf-firstTr~tr').find("td:nth-child(5)").attr('data-isClick',"false");
            $(this).attr('data-isClick',"true");
            dataClickInf=true;
        });
        $(document).on('click','#medicineInf-firstTr~tr>td:nth-child(5)',function(){
            var isClick=$(this).attr('data-isClick');
            if(isClick=="true"){
                dataClickInf=false;
                $('#medicineInf-firstTr~tr>td:nth-child(5)').attr('data-isClick',"false");
            }else{
                $('#medicineInf-firstTr~tr').find("td:nth-child(5)").attr('data-isClick',"false");
                $(this).attr('data-isClick',"true");
                dataClickInf=true;
            }
        });


        $(document).on('dblclick','#medicineInf-firstTr~tr>td:nth-child(14)',function(){
            var td5=$(this).parent('tr').find('td:nth-child(5)').text();
            if(td5){
                $(this).attr('contenteditable','true');
                $('.medicineFrequency-BOx').show();
                $('#medicineInf-firstTr~tr').find("td:nth-child(14)").attr('data-isClick',"false");
                $(this).attr('data-isClick',"true");
                dataClickFreqency=false;
            }else{
                tipAlertShow('该项必须得有药品名称才可编辑');
            }

        });
        $(document).on('click','#medicineInf-firstTr~tr>td:nth-child(14)',function(){
            var td5=$(this).parent('tr').find('td:nth-child(5)').text();
            if(td5){
                $(this).attr('contenteditable','true');
                var isClick=$(this).attr('data-isClick');
                if(isClick=="true"){
                    dataClickFreqency=false;
                    $('#medicineInf-firstTr~tr>td:nth-child(14)').attr('data-isClick',"false");
                }else{
                    dataClickFreqency=true;
                    $('#medicineInf-firstTr~tr').find("td:nth-child(14)").attr('data-isClick',"false");
                    $(this).attr('data-isClick',"true");
                }
            }else{
                tipAlertShow('该项必须得有药品名称才可编辑');
            }


        });


        $(document).on('dblclick','#medicineInf-firstTr~tr>td:nth-child(13)',function(){
            var td5=$(this).parent('tr').find('td:nth-child(5)').text();
            if(td5){
                $('.medicineWay-BOx').show();
                $('#medicineInf-firstTr~tr').find("td:nth-child(13)").attr('data-isClick',"false");
                $(this).attr('data-isClick',"true");
                dataClickWay=false;
            }else{
                tipAlertShow('该项必须得有药品名称才可编辑');
            }

        });
        $(document).on('click','#medicineInf-firstTr~tr>td:nth-child(13)',function(){
            var td5=$(this).parent('tr').find('td:nth-child(5)').text();
            if(td5){
                var isClick=$(this).attr('data-isClick');
                if(isClick=="true"){
                    dataClickWay=false;
                    $('#medicineInf-firstTr~tr>td:nth-child(13)').attr('data-isClick',"false");
                }else{
                    dataClickWay=true;
                    $('#medicineInf-firstTr~tr').find("td:nth-child(13)").attr('data-isClick',"false");
                    $(this).attr('data-isClick',"true");
                }
            }else{
                tipAlertShow('该项必须得有药品名称才可编辑');
            }
        });

        //enter键按下时根据对应td的状态来显示对应的弹窗
        $(document).on('keydown',function(){
            if((window.event.keyCode)==13){
                if(dataClickInf){
                    $('.medicineInformation-BOx').show();
                }
                if(dataClickFreqency){
                    $('.medicineFrequency-BOx').show();
                }
                if(dataClickWay){
                    $('.medicineWay-BOx').show();
                }
            }

        });

        //点击每个弹窗底部的取消按钮关闭当前窗口
        $('.f1>div>button:nth-child(2)').on('click',function(){
            $(this).parent('div').parent('div').parent('footer').parent('div').parent('div').hide();
        });

        //就诊科室底部点击取消按钮,关闭就诊科室输入框禁用
        $('.ClinicDepartment-Box .f1>div>button:nth-child(2)').on('click',function(){
            $(this).parent('div').parent('div').parent('footer').parent('div').parent('div').hide();
            $('#p-Clinic-Department').removeAttr('disabled');
        });

        //主管医生底部点击取消按钮,关闭就主管医生输入框禁用
        $('.mannagerDoctor-Box .f1>div>button:nth-child(2)').on('click',function(){
            $(this).parent('div').parent('div').parent('footer').parent('div').parent('div').hide();
            $('#p-doctor').removeAttr('disabled');
        });


        //手术信息底部点击取消按钮,关闭手术信息输入框禁用
        $('.operationName-Box .f1>div>button:nth-child(2)').on('click',function(){
            $(this).parent('div').parent('div').parent('footer').parent('div').parent('div').hide();
            $('#p-operationName').removeAttr('disabled');
        });



        //所有弹窗左上角获得焦点时不可移动弹窗
        $('.alertBox-box .s1>input').focus(function(){
            isAlertFocus=false;
        });
        //所有弹窗左上角失去焦点时可移动弹窗
        $('.alertBox-box .s1>input').blur(function(){
            isAlertFocus=true;
        });
        //所有弹窗table中的每一行的选中状态(单机和双击)
        //药品信息单双击
        $(document).on('click','.medicineInformation-BOx tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.medicineInformation-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineInformation-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineInformation-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $('.medicineInformation-BOx tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.medicineInformation-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineInformation-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineInformation-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.medicineInformation-BOx tr:nth-child(1)~tr',function(){
            $('.medicineInformation-BOx tr').css({backgroundColor:"#FFFFFF"});
            $('.medicineInformation-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.medicineInformation-BOx tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });





        //药品频次单双击
        $(document).on('click','.medicineFrequency-BOx tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.medicineFrequency-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineFrequency-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineFrequency-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $('.medicineFrequency-BOx tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.medicineFrequency-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineFrequency-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineFrequency-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.medicineFrequency-BOx tr:nth-child(1)~tr',function(){
            $('.medicineFrequency-BOx tr').css({backgroundColor:"#FFFFFF"});
            $('.medicineFrequency-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.medicineFrequency-BOx tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });

        //药品途径单双击
        $(document).on('click','.medicineWay-BOx tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.medicineWay-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineWay-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineWay-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $('.medicineWay-BOx tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.medicineWay-BOx tr').css({backgroundColor:"#FFFFFF"});
                $('.medicineWay-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.medicineWay-BOx tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.medicineWay-BOx tr:nth-child(1)~tr',function(){
            $('.medicineWay-BOx tr').css({backgroundColor:"#FFFFFF"});
            $('.medicineWay-BOx tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.medicineWay-BOx tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });

        //就诊科室单双击
        $(document).on('click','.ClinicDepartment-Box tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.ClinicDepartment-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.ClinicDepartment-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.ClinicDepartment-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $('.ClinicDepartment-Box tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.ClinicDepartment-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.ClinicDepartment-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.ClinicDepartment-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.ClinicDepartment-Box tr:nth-child(1)~tr',function(){
            $('.ClinicDepartment-Box tr').css({backgroundColor:"#FFFFFF"});
            $('.ClinicDepartment-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.ClinicDepartment-Box tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });

        //主管医生单双击
        $(document).on('click','.mannagerDoctor-Box tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.mannagerDoctor-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.mannagerDoctor-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.mannagerDoctor-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $('.mannagerDoctor-Box tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.mannagerDoctor-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.mannagerDoctor-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.mannagerDoctor-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.mannagerDoctor-Box tr:nth-child(1)~tr',function(){
            $('.mannagerDoctor-Box tr').css({backgroundColor:"#FFFFFF"});
            $('.mannagerDoctor-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.mannagerDoctor-Box tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });


        //手术信息单双击
        $(document).on('click','.operationName-Box tr:nth-child(1)~tr',function(){
            var statusChoose=$(this).attr('isChoosed');
            if(statusChoose=="true"){
                $('.operationName-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.operationName-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.operationName-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $('.operationName-Box tr:nth-child(1)~tr').attr('isChoosed','false');
            }else{
                $('.operationName-Box tr').css({backgroundColor:"#FFFFFF"});
                $('.operationName-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
                $('.operationName-Box tr:nth-child(1)').css({backgroundColor:"white"});
                $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
                $(this).siblings().attr('isChoosed','false');
            }

        });
        $(document).on('dblclick','.operationName-Box tr:nth-child(1)~tr',function(){
            $('.operationName-Box tr').css({backgroundColor:"#FFFFFF"});
            $('.operationName-Box tr:nth-child(2n+1)').css({backgroundColor:"#f8f8f8"});
            $('.operationName-Box tr:nth-child(1)').css({backgroundColor:"white"});
            $(this).css({backgroundColor:"#e9f6ff"}).attr('isChoosed','true');
            $(this).siblings().attr('isChoosed','false');
        });


        //点击药品信息弹窗查询弹窗右上角的查询,可以查询药品信息Ajax
        function searchInforAjax(){
            var medicineNam=$('.medicineInformation-BOx .s1>input').val();
            if(!medicineNam.trim()){
                tipAlertShow('请先输入药品名称');
                return false;
            }

            var url=urlHead+"/medicalData/apis/apiData_H.apl?model=yp&key="+medicineNam+"";
            $.ajax({
                url :url ,
                type : "POST",
                dataType:'json',
                data : {},
                success : function(data){
                    medicineInfUrl=url;
                    var html='<tr>'+
                        '<td>药品名称</td>'+
                        '<td>剂型</td>'+
                        '<td>规格</td>'+
                        '<td>厂家</td>'+
                        '<td>给药单位</td>'+
                        '</tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        var greyTd;
                        if(data[i].DRUG_STATUS=='0'){
                            greyTd='<td class="greyTd" data-stopReason='+data[i].REASON+' data-drugStatus='+data[i].DRUG_STATUS+'>'+data[i].DRUG_NAME+'</td>';
                        }else{
                            greyTd='<td  data-drugStatus='+data[i].DRUG_STATUS+'>'+data[i].DRUG_NAME+'</td>';
                        }
                        html+='<tr data-myid='+i+'>'+
                            greyTd+
                            '<td>'+data[i].DRUG_FORM+'</td>'+
                            '<td>'+data[i].DRUG_SPEC+'</td>'+
                            '<td>'+data[i].FIRM_ID+'</td>'+
                            '<td>'+data[i].DOSE_UNITS+'</td>'+
                            '</tr>';
                    }
                    $('.medicineInformation-BOx .s2>table').html(html);
                    $('.medicineInformation-BOx .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });

        }
        $('.medicineInformation-BOx .s1>button').on('click',function(){
            searchInforAjax();
        });

        //药品信息左上角输入框获得焦点时按下entr可以查询药品信息
        $('.medicineInformation-BOx .s1>input').on('focus',function(){
            $('.medicineInformation-BOx .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    searchInforAjax();
                }

            });
        });
        //点击药品信息弹窗右下角“确认”按钮完成药品信息添加到主页面药品信息栏
        $('.medicineInformation-BOx .f1 button:nth-child(1)').on('click',function(){
            var myTrId,drugStatus,stopReason;
            $.ajax({
                url :medicineInfUrl,
                type : "POST",
                dataType:'json',
                data : {},
                success:function(data){
                    $('.medicineInformation-BOx tr:nth-child(1)~tr').each(function(){
                        var thisIsChoosed=$(this).attr('isChoosed');
                        if(thisIsChoosed=="true"){
                            myTrId=$(this).attr('data-myid');
                            drugStatus=$(this).children('td').attr('data-drugStatus');
                            stopReason=$(this).children('td').attr('data-stopReason');
                            if(drugStatus=='0'){
                                tipAlertShow(stopReason);
                                return false;
                            }

                            $('#medicineInf-firstTr~tr td:nth-child(5)').each(function(){
                                var thischecked1=$(this).attr('data-isclick');
                                if(thischecked1=='true'){
                                    //添加药品栏标志
                                    MedicineSign++;
                                    $(this).parent('tr').attr('Medicine-sign',MedicineSign);
                                    //判断说明书编号是否存在
                                    var bookCOde=data[myTrId].SMSSID;
                                    if(bookCOde){
                                      $(this).find('img').css({ visibility: "visible"}).attr('book-code',bookCOde);
                                    }else{
                                        $(this).find('img').css({ visibility: "hidden"}).removeAttr('book-code');
                                    }
                                    $(this).find('span').text(data[myTrId].DRUG_NAME);
                                    $(this).parent('tr').children('input').val(data[myTrId].DRUG_CODE);
                                    $(this).parent('tr').find('td:nth-child(6)').text(data[myTrId].DRUG_FORM);
                                    $(this).parent('tr').find('td:nth-child(7)').text(data[myTrId].DRUG_SPEC);
                                    $(this).parent('tr').find('td:nth-child(8)').text(data[myTrId].FIRM_ID);
                                    $(this).parent('tr').find('td:nth-child(10)').text(data[myTrId].UNITS);
                                    $(this).parent('tr').find('td:nth-child(12)').text(data[myTrId].DOSE_UNITS);
                                    $('.medicineInformation-BOx tr').eq(0).siblings().remove();
                                    $('.medicineInformation-BOx').hide();
                                    dataClickInf=false;
                                    $(this).attr('data-isClick',"false");
                                    $('.medicineInformation-BOx .f1>div>span').text(0);
                                }
                            })
                        }
                    });
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        });

        //双击药品信息弹窗中table的每一行弹出药品提示
        $(document).on('dblclick','.medicineInformation-BOx tr:nth-child(1)~tr',function(){
            //新修改，弹出yaopin药品提示框
            var myTrId,bookCOde,drugCOde,drugName,html1,html3,drugStatus,stopReason;
            $.ajax({
                url:medicineInfUrl,
                type:'post',
                dataType:'json',
                data:{},
                success:function(data){
                    $('.medicineInformation-BOx tr:nth-child(1)~tr').each(function(){
                        var thisIsChoosed=$(this).attr('isChoosed');
                                if(thisIsChoosed=="true"){
                                    myTrId=$(this).attr('data-myid');
                                    drugStatus=$(this).children('td').attr('data-drugStatus');
                                    stopReason=$(this).children('td').attr('data-stopReason');


                                    myTrId=$(this).attr('data-myid');
                                   bookCOde=data[myTrId].SMSSID;
                                  drugCOde=data[myTrId].DRUG_CODE;
                                    drugName=data[myTrId].DRUG_NAME;
                                    $.ajax({
                                        url:urlHead+"/medicalData/apis/apiData_H.apl?model=ZYTS&sid="+bookCOde+"&key="+drugCOde,
                                        type:'post',
                                        dataType:"json",
                                        data:{},
                                        success:function(re){
                                            //药品名称加载
                                            $('.bookTip-Box header>div:nth-child(1)>span').text(drugName);

                                            //判断显示说明书

                                            if(bookCOde){
                                                $('.flex-footer-left>img:nth-child(1)').show().attr('book-code',bookCOde);
                                            }else{
                                                $('.flex-footer-left>img:nth-child(1)').hide().removeAttr('book-code');
                                            }




                                            html1=re.YYTSMSG;
                                            $('.flex-body-right>div:nth-child(1)').children('.flex-body-right-body2').html(html1);

                                            //判断显示底部右下角的几个图标
                                            $('.flex-footer-right>img').hide();
                                            if(re.YYTS.BASIC.indexOf('11')!=-1){
                                                $('.flex-footer-right>img').eq(0).show();
                                            }
                                            if(re.YYTS.BASIC.indexOf('21')!=-1){
                                                $('.flex-footer-right>img').eq(1).show();
                                            }
                                            if(re.YYTS.INSURANCE&&(re.YYTS.INSURANCE.indexOf('30')==-1)){
                                                $('.flex-footer-right>img').eq(2).show();
                                            }
                                            if(re.YYTS.ANALEPTIC=='1'){
                                                $('.flex-footer-right>img').eq(3).show();
                                            }

                                            //加载重要提示--------------------------------------------
                                            $('.flex-body-right>div:nth-child(2)').children('div:nth-child(2)').text(re.ZYTS);

                                            //加载驾药提示------------------------------------------
                                            html3='';
                                            if(re.JYTS){
                                                for(var i=0;i<re.JYTS.length;i++){
                                                    html3+= '<span>【'+(re.JYTS)[i].title+'】</span>'+
                                                        '<div>'+(re.JYTS)[i].value+'</div>';
                                                }
                                            }

                                            $('.flex-body-right>div:nth-child(3)').children('.flex-body-right-body').html(html3);


                                            $('.bookTip-Box').show();
                                        }
                                    });



                                    if(drugStatus=='0'){
                                        tipAlertShow(stopReason);
                                        return false;
                                    }


                                    $('#medicineInf-firstTr~tr td:nth-child(5)').each(function(){
                                        var thischecked1=$(this).attr('data-isclick');
                                        if(thischecked1=='true'){
                                            //添加药品栏标志
                                            MedicineSign++;
                                            $(this).parent('tr').attr('Medicine-sign',MedicineSign);
                                            if(bookCOde){
                                                $(this).find('img').css({ visibility: "visible"}).attr('book-code',bookCOde);
                                            }else{
                                                $(this).find('img').css({ visibility: "hidden"}).removeAttr('book-code');
                                            }
                                            $(this).find('span').text(data[myTrId].DRUG_NAME);
                                            $(this).parent('tr').children('input').val(data[myTrId].DRUG_CODE);
                                            $(this).parent('tr').find('td:nth-child(6)').text(data[myTrId].DRUG_FORM);
                                            $(this).parent('tr').find('td:nth-child(7)').text(data[myTrId].DRUG_SPEC);
                                            $(this).parent('tr').find('td:nth-child(8)').text(data[myTrId].FIRM_ID);
                                            $(this).parent('tr').find('td:nth-child(10)').text(data[myTrId].UNITS);
                                            $(this).parent('tr').find('td:nth-child(12)').text(data[myTrId].DOSE_UNITS);
                                            $('.medicineInformation-BOx tr').eq(0).siblings().remove();
                                            $('.medicineInformation-BOx').hide();
                                            dataClickInf=false;
                                            $(this).attr('data-isClick',"false");
                                            $('.medicineInformation-BOx .f1>div>span').text(0);
                                        }
                                    })



                                }

                    });

                }
            });






            //
            //var myTrId,drugStatus,stopReason;
            //$.ajax({
            //    url :medicineInfUrl,
            //    type : "POST",
            //    dataType:'json',
            //    data : {},
            //    success:function(data){
            //        $('.medicineInformation-BOx tr:nth-child(1)~tr').each(function(){
            //            var thisIsChoosed=$(this).attr('isChoosed');
            //            if(thisIsChoosed=="true"){
            //                myTrId=$(this).attr('data-myid');
            //                drugStatus=$(this).children('td').attr('data-drugStatus');
            //                stopReason=$(this).children('td').attr('data-stopReason');
            //                if(drugStatus=='0'){
            //                    tipAlertShow(stopReason);
            //                    return false;
            //                }
            //
            //
            //                $('#medicineInf-firstTr~tr td:nth-child(5)').each(function(){
            //                    var thischecked1=$(this).attr('data-isclick');
            //                    if(thischecked1=='true'){
            //                        //添加药品栏标志
            //                        MedicineSign++;
            //                        $(this).parent('tr').attr('Medicine-sign',MedicineSign);
            //                        //判断说明书编号是否存在
            //                        var bookCOde=data[myTrId].SMSSID;
            //                        if(bookCOde){
            //                            $(this).find('img').css({ visibility: "visible"}).attr('book-code',bookCOde);
            //                        }else{
            //                            $(this).find('img').css({ visibility: "hidden"}).removeAttr('book-code');
            //                        }
            //                        $(this).find('span').text(data[myTrId].DRUG_NAME);
            //                        $(this).parent('tr').children('input').val(data[myTrId].DRUG_CODE);
            //                        $(this).parent('tr').find('td:nth-child(6)').text(data[myTrId].DRUG_FORM);
            //                        $(this).parent('tr').find('td:nth-child(7)').text(data[myTrId].DRUG_SPEC);
            //                        $(this).parent('tr').find('td:nth-child(8)').text(data[myTrId].FIRM_ID);
            //                        $(this).parent('tr').find('td:nth-child(10)').text(data[myTrId].UNITS);
            //                        $(this).parent('tr').find('td:nth-child(12)').text(data[myTrId].DOSE_UNITS);
            //                        $('.medicineInformation-BOx tr').eq(0).siblings().remove();
            //                        $('.medicineInformation-BOx').hide();
            //                        dataClickInf=false;
            //                        $(this).attr('data-isClick',"false");
            //                        $('.medicineInformation-BOx .f1>div>span').text(0);
            //                    }
            //                })
            //            }
            //        });
            //    },
            //    error : function(XMLHttpRequest, textStatus, errorThrown){
            //        console.log(errorThrown);
            //    }
            //});
        });

        //点击book图标，弹出说明书
        $(document).on('click','#medicineInf-firstTr~tr td:nth-child(5)>img,.flex-footer-left>img:nth-child(1)',function(){
            var thisBookCode=$(this).attr('book-code');
            var thisBookName=$(this).next().text();
            $('.medicineBook-Box').show();
            $.ajax({
                url :urlHead+'/medicalData/apis/apiData_S.apl?sid='+thisBookCode,
                type : "POST",
                dataType:'json',
                data : {},
                success:function(date){
                    var lg=date.data.length;
                    var html='';
                    for (var i=0;i<lg;i++){
                        html+='<li>'+
                        '<div>【'+date.data[i].title+'】<a name='+i+'></a></div>'+
                        '<div>'+date.data[i].value+'</div>'+
                        '</li>';
                    }
                    $('.bookBody-body>ul').html(html);

                    var htmlMiaoDIan='';
                    for (var j=0;j<lg;j++){
                        htmlMiaoDIan+= '<li><a href=#'+j+'>【'+date.data[j].title+'】</a><div></div></li>';
                    }
                    $('.maoDian-box>ul').html(htmlMiaoDIan);
                    $('#myBookNmae').text(thisBookName);


                    //同时默认点击第一个
                    $('.maoDian-box>ul>li:first-child').children('a')[0].click();
                    $('.maoDian-box').scrollTop(0);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        });

        //说明书右侧导航条单机选中效果
        $(document).on('click','.maoDian-box li',function(){
            $('.maoDian-box li').find('a').css({color:"#545555"});
            $('.maoDian-box li').find('div').css({backgroundColor:"#545555"});
            $(this).find('div').css({backgroundColor:"#02cb90"});
            $(this).find('a').css({color:"#02cb90"});
        });

        //说明书右侧导航条颜色随着内容的改变而相应的改变
        $('.bookBody-body').scroll(function() {
            var count=-1;
            $('.bookBody-body li').each(function(){
                var top=$(this).position().top;
                if(top<0){
                    count++
                }
            });
            if(count==-1){
                $('.maoDian-box li').find('a').css({color:"#545555"});
                $('.maoDian-box li').find('div').css({backgroundColor:"#545555"});
                $('.maoDian-box li').eq(0).find('div').css({backgroundColor:"#02cb90"});
                $('.maoDian-box li').eq(0).find('a').css({color:"#02cb90"});
            }else{
                $('.maoDian-box li').find('a').css({color:"#545555"});
                $('.maoDian-box li').find('div').css({backgroundColor:"#545555"});
                $('.maoDian-box li').eq(count+1).find('div').css({backgroundColor:"#02cb90"});
                $('.maoDian-box li').eq(count+1).find('a').css({color:"#02cb90"});
            }
        });

        //点击用药频次弹窗查询弹窗右上角的查询,可以查询用药频次Ajax
        function medicineFreqencyAjax(){
            var medicineFrequncy=$('.medicineFrequency-BOx .s1>input').val();
            if(!medicineFrequncy.trim()){
                tipAlertShow('请先输入用药频次');
                return false;
            }

            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=yf&key="+medicineFrequncy+"",
                data:{},
                dataType:'json',
                success:function(data){
                    var html= '<tr><td>用药频次</td></tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        html+='<tr><td>'+data[i].FREQ_DESC+'</td></tr>';
                    }
                    $('.medicineFrequency-BOx .s2>table').html(html);
                    $('.medicineFrequency-BOx .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }
        $('.medicineFrequency-BOx .s1>button').on('click',function(){
            medicineFreqencyAjax();
        });
        //用药频次左上角输入框获得焦点时按下entr可以查用药频次
        $('.medicineFrequency-BOx .s1>input').on('focus',function(){
            $('.medicineFrequency-BOx .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    medicineFreqencyAjax();
                }

            });
        });

        //点击用药频次弹窗右下角“确认”按钮完成用药频次添加到主页面药品信息栏
        $('.medicineFrequency-BOx .f1 button:nth-child(1)').on('click',function(){
            var thisFrequency;
            $('.medicineFrequency-BOx tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    thisFrequency=$(this).find('td:nth-child(1)').text();
                    $('#medicineInf-firstTr~tr td:nth-child(14)').each(function(){
                        var thischecked2=$(this).attr('data-isclick');
                        if(thischecked2=='true'){
                            $(this).text(thisFrequency);
                            $('.medicineFrequency-BOx tr').eq(0).siblings().remove();
                            $('.medicineFrequency-BOx').hide();
                            dataClickFreqency=false;
                            $(this).attr('data-isClick',"false");
                            $('.medicineFrequency-BOx .f1>div>span').text(0);
                        }
                    })
                }
            });
        });

        //双击给药频次弹窗中table的每一行实给药频次添加到主页面药品信息栏
        $(document).on('dblclick','.medicineFrequency-BOx tr:nth-child(1)~tr',function(){
            var thisFrequency;
            $('.medicineFrequency-BOx tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    thisFrequency=$(this).find('td:nth-child(1)').text();
                    $('#medicineInf-firstTr~tr td:nth-child(14)').each(function(){
                        var thischecked2=$(this).attr('data-isclick');
                        if(thischecked2=='true'){
                            $(this).text(thisFrequency);
                            $('.medicineFrequency-BOx tr').eq(0).siblings().remove();
                            $('.medicineFrequency-BOx').hide();
                            dataClickFreqency=false;
                            $(this).attr('data-isClick',"false");
                            $('.medicineFrequency-BOx .f1>div>span').text(0);
                        }
                    })
                }
            });
        });

        //点击给药途径弹窗查询弹窗右上角的查询,可以查询给药途径Ajax
        function medicineWayAjax(){
            var medicineWay=$('.medicineWay-BOx .s1>input').val();
            if(!medicineWay.trim()){
                tipAlertShow('请先输入给药途径名称');
                return false;
            }

            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=tj&key="+medicineWay+"",
                data:{},
                dataType:'json',
                success:function(data){
                    var html= '<tr><td>给药途径</td></tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        html+='<tr><td>'+data[i].ADMINISTRATION_NAME+'</td></tr>';
                    }
                    $('.medicineWay-BOx .s2>table').html(html);
                    $('.medicineWay-BOx .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }
        $('.medicineWay-BOx .s1>button').on('click',function(){
            medicineWayAjax();
        });
        //用药途径左上角输入框获得焦点时按下entr可以查用药途径
        $('.medicineWay-BOx .s1>input').on('focus',function(){
            $('.medicineWay-BOx .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    medicineWayAjax();
                }

            });
        });


        //点击给药途径弹窗右下角“确认”按钮完成给药途径添加到主页面药品信息栏
        $('.medicineWay-BOx .f1 button:nth-child(1)').on('click',function(){
            var thisWay;
            $('.medicineWay-BOx tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    thisWay=$(this).find('td:nth-child(1)').text();
                    $('#medicineInf-firstTr~tr td:nth-child(13)').each(function(){
                        var thischecked2=$(this).attr('data-isclick');
                        if(thischecked2=='true'){
                            $(this).text(thisWay);
                            $('.medicineWay-BOx tr').eq(0).siblings().remove();
                            $('.medicineWay-BOx').hide();
                            dataClickWay=false;
                            $(this).attr('data-isClick',"false");
                            $('.medicineWay-BOx .f1>div>span').text(0);
                        }
                    })
                }
            });
        });

        //双击给药途径弹窗中table的每一行实现给药途径添加到主页面药品信息栏
        $(document).on('dblclick','.medicineWay-BOx tr:nth-child(1)~tr',function(){
            var thisWay;
            $('.medicineWay-BOx tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    thisWay=$(this).find('td:nth-child(1)').text();
                    $('#medicineInf-firstTr~tr td:nth-child(13)').each(function(){
                        var thischecked2=$(this).attr('data-isclick');
                        if(thischecked2=='true'){
                            $(this).text(thisWay);
                            $('.medicineWay-BOx tr').eq(0).siblings().remove();
                            $('.medicineWay-BOx').hide();
                            dataClickWay=false;
                            $(this).attr('data-isClick',"false");
                            $('.medicineWay-BOx .f1>div>span').text(0);
                        }
                    })
                }
            });
        });



        //药品详细信息弹窗左侧栏点击事件
         $('.bookTip-body .bookTip-body-content').on('click',function(){
             var title=$(this).attr('title');

             $('.bookTip-body .bookTip-body-content').css({flex:"1",backgroundColor:"#ccc"});
             $('.bookTip-body-content>img').hide();
             $('.bookTip-body-content>img:nth-child(1)').show();
             $('.bookTip-body-content>div').hide();
             $(this).css({flex:"1",backgroundColor:"#02cb90"});
             $(this).children('img:nth-child(2)').show();
             $(this).children('div').show();

             if(title=='药品基本信息'){
                    $('.flex-body-right>div').animate({opacity:'0',zIndex:"0"},50,"linear");
                 $('.flex-body-right>div:nth-child(1)').animate({opacity:'1',zIndex:"1"},50,"linear");
             }else if(title=='医院重要提示'){
                 $('.flex-body-right>div').animate({opacity:'0',zIndex:"0"},50,"linear");
                 $('.flex-body-right>div:nth-child(2)').animate({opacity:'1',zIndex:"1"},50,"linear");
             }else if(title=='驾药信息提示'){
                 $('.flex-body-right>div').animate({opacity:'0',zIndex:"0"},50,"linear");
                 $('.flex-body-right>div:nth-child(3)').animate({opacity:'1',zIndex:"1"},50,"linear");
             }else{
                 return false;
             }
         }) ;

        //小图标跳转驾药助手页面
        //驾咬助手图片点击链接
        $('.flex-footer-left>img:nth-child(2)').on('click',function(){
            window.open(urlHead+'/JYZS/common/html/drugInformation.html');
        });
    }
    AlertSHow();

    //病人基本信息区域  lgy----------------------------------------------------------------------------
    //获取今天日期的函数
    function today(){
        var today=new Date();
        var h=today.getFullYear();
        var m=today.getMonth()+1;
        var d=today.getDate();
        m= m<10?"0"+m:m;   //  这里判断月份是否<10,如果是在月份前面加'0'
        d= d<10?"0"+d:d;        //  这里判断日期是否<10,如果是在日期前面加'0'
        return h+"-"+m+"-"+d;
    }

    //设置默认就诊日期为当天
    $('#p-clinic-Date').val(today());
    //设置默认出生日期为当天
    $('#p-birth').val(today());

    function patientInf(){
        //当妊娠状态为“是”的时候，后面的孕期可选
        $('#p-pregnancyState').on('change',function(){
            var pregnancyState=$(this).find("option:selected").text();
            if(pregnancyState=="是"){
                $('#p-pregnancy').removeAttr('disabled');
            }else{
                $('#p-pregnancy').attr({disabled:"disabled"});
                $('#p-pregnancy').val('');
            }
        });
        //孕期、身高、门诊/住院次数只能输入正数
        $('#p-pregnancy,#p-height,#p-mzAndZycs').on('keyup',function(){
            if(this.value.length==1){
                this.value=this.value.replace(/[^1-9]/g,'')
            }else{
                this.value=this.value.replace(/\D/g,'')
            }
        });

        $('#p-pregnancy,#p-height,#p-mzAndZycs').on('afterpaste',function(){
            if(this.value.length==1){
                this.value=this.value.replace(/[^1-9]/g,'0')
            }else{
                this.value=this.value.replace(/\D/g,'')
            }
        });

        $('#p-sex').on('change',function(){
            var  val=$(this).val();
            if(val=='男'){
                $('#p-lactationStatus').attr('disabled',true);
                $('#p-pregnancyState').attr('disabled',true);
                $('#p-pregnancy').attr('disabled',true);
                $('#p-pregnancy').val('');
                $('#p-lactationStatus').find("option").attr("selected",false);
                $('#p-lactationStatus').find("option:contains('否')").attr("selected",true);
                $('#p-pregnancyState').find("option").attr("selected",false);
                $('#p-pregnancyState').find("option:contains('否')").attr("selected",true);
            }else{
                $('#p-lactationStatus').attr('disabled',false);
                $('#p-pregnancyState').attr('disabled',false);
                if($('#p-pregnancyState').val()=='是'){
                    $('#p-pregnancy').attr('disabled',false);
                }

            }
        });


        //体重最多保留一位小数
        $('#p-weight').on('keyup',function(){
            this.value = this.value.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
            this.value = this.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
            this.value = this.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
            this.value = this.value.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');//只能输入两个小数
            if(this.value.indexOf(".")< 0 && this.value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                this.value= parseFloat(this.value);
            }
        });



        //处方来源选择变化，导致用药信息显示不同的样式
        $('#p-door').on('change',function(){
            var newVal=$(this).val();

            //隐藏显示医嘱类型列
            if(newVal=='住院'){
                $('.medicineInf-body>table tr').each(function(){
                    $(this).find('td:nth-child(3)').removeClass('hideTr');
                    $(this).find('td:nth-child(16)').removeClass('hideTr');
                    $(this).find('td:nth-child(17)').removeClass('hideTr');
                });
            }else{
                $('.medicineInf-body>table tr').each(function(){
                    $(this).find('td:nth-child(3)').addClass('hideTr');
                    $(this).find('td:nth-child(16)').addClass('hideTr');
                    $(this).find('td:nth-child(17)').addClass('hideTr');
                });
            }

            if(newVal=='门诊'){
                $('.medicineInf-btn>button:nth-child(4)').hide();
                $('.medicineInf-btn>button:nth-child(5)').hide();
                $('.medicineInf-body>table tr').each(function(){
                    $(this).find('td:nth-child(4)').addClass('hideTr');
                });
            }else{
                $('.medicineInf-btn>button:nth-child(4)').show();
                $('.medicineInf-btn>button:nth-child(5)').show();
                $('.medicineInf-body>table tr').each(function(){
                    $(this).find('td:nth-child(4)').removeClass('hideTr');
                });
            }



        });

        //插件--------------
        $('#tags').tagsInput();

        //就诊科室输入框获得焦点弹出就诊科室
        $('#p-Clinic-Department').on('focus',function(){
            $('.ClinicDepartment-Box').show();
            $('#p-Clinic-Department').attr('disabled','disabled');
        });

        //就诊科室弹出框右上角点击查询弹出科室信息table的Ajax
        function clincDepartmentAjax(){
            var PatientClinicDepartment=$('.ClinicDepartment-Box .s1>input').val();
            if(!PatientClinicDepartment.trim()){
                tipAlertShow('请输入科室名称');
                return false;
            }

            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=ks&key="+PatientClinicDepartment+"",
                data:{},
                dataType:'json',
                success:function(data){
                    var html= '<tr><td>科室代码</td><td>科室名称</td></tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        html+='<tr><td>'+data[i].DEPT_CODE+'</td><td>'+data[i].DEPT_NAME+'</td><input value='+JSON.stringify(data[i])+' type="hidden"/></tr>';
                    }
                    $('.ClinicDepartment-Box .s2>table').html(html);
                    $('.ClinicDepartment-Box .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }
        $('.ClinicDepartment-Box .s1>button').on('click',function(){
            clincDepartmentAjax();
        });
        //就诊科室弹出框左上角输入框获得焦点时按下entr可以查就诊科室
        $('.ClinicDepartment-Box .s1>input').on('focus',function(){
            $('.ClinicDepartment-Box .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    clincDepartmentAjax();
                }

            });
        });

        //就诊科室弹出框右下角点击"确定"实现将科室名称打印在主页面的就诊科室输入框；
        $('.ClinicDepartment-Box .f1 button:nth-child(1)').on('click',function(){
            var thisDepartment;
            $('.ClinicDepartment-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    departID=$(this).find('td:nth-child(1)').text();
                    thisDepartment=$(this).find('td:nth-child(2)').text();
                    $('#p-Clinic-Department').val(thisDepartment);
                    $('.ClinicDepartment-Box tr').eq(0).siblings().remove();
                    $('.ClinicDepartment-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-Clinic-Department').removeAttr('disabled');
                    $('.ClinicDepartment-Box .f1>div>span').text(0);
                    $('.mannagerDoctor-Box .s1>input').attr('data-ksid',departID);
                    $('#p-doctor').val('');
                    doctorNum='';
                }
            });
        });

        //双击就诊科室弹窗中table的每一行实现就诊科室添加到主页面病人信息栏
        $(document).on('dblclick','.ClinicDepartment-Box tr:nth-child(1)~tr',function(){
            var thisDepartment;
            $('.ClinicDepartment-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    departID=$(this).find('td:nth-child(1)').text();
                    thisDepartment=$(this).find('td:nth-child(2)').text();
                    $('#p-Clinic-Department').val(thisDepartment);
                    $('.ClinicDepartment-Box tr').eq(0).siblings().remove();
                    $('.ClinicDepartment-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-Clinic-Department').removeAttr('disabled');
                    $('.ClinicDepartment-Box .f1>div>span').text(0);
                    $('.mannagerDoctor-Box .s1>input').attr('data-ksid',departID);
                    $('#p-doctor').val('');
                    doctorNum='';
                }
            });
        });


        //主管医生输入框获得焦点弹出主管医生
        $('#p-doctor').on('focus',function(){
            $('.mannagerDoctor-Box').show();
            $('#p-doctor').attr('disabled','disabled');
        });

        //主管医生弹出框右上角点击查询弹出主管医生table的Ajax
        function mannagerDoctorAjax(){
            var PatientmannagerDoctor=$('.mannagerDoctor-Box .s1>input').val();
            if(!PatientmannagerDoctor.trim()){
                tipAlertShow('请输入医生信息');
                return false;
            }

            var ksid=$('.mannagerDoctor-Box .s1>input').attr('data-ksid');
            //console.log(ksid);
            //判断医生选取了科室
            if(ksid){
                PatientmannagerDoctor=PatientmannagerDoctor+"&ksid="+ksid;
            }
            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=ys&key="+PatientmannagerDoctor+"",
                data:{},
                dataType:'json',
                success:function(data){
                    var html= '<tr><td>医师编号</td><td>医师名称</td><td>科室编码</td><td>科室名称</td></tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        html+='<tr><td data-id='+data[i].ID+'>'+data[i].NO+'</td><td>'+data[i].NAME+'</td><td>'+data[i].DEPT_CODE+'</td><td>'+data[i].DEPT_NAME+'</td></tr>';
                    }
                    $('.mannagerDoctor-Box .s2>table').html(html);
                    $('.mannagerDoctor-Box .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }
        $('.mannagerDoctor-Box .s1>button').on('click',function(){
            mannagerDoctorAjax();
        });

        //主管医生弹出框左上角输入框获得焦点时按下entr可以主管医生
        $('.mannagerDoctor-Box .s1>input').on('focus',function(){
            $('.mannagerDoctor-Box .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    mannagerDoctorAjax();
                }

            });
        });

        //主管医生弹出框右下角点击"确定"实现将科室名称打印在主页面的主管医生输入框；
        $('.mannagerDoctor-Box .f1 button:nth-child(1)').on('click',function(){
            var thisMannagerDoctor;
            $('.mannagerDoctor-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    doctorNum=$(this).find('td:nth-child(1)').attr('data-id');
                    thisMannagerDoctor=$(this).find('td:nth-child(2)').text();
                    $('#p-doctor').val( thisMannagerDoctor);
                    $('.mannagerDoctor-Box tr').eq(0).siblings().remove();
                    $('.mannagerDoctor-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-doctor').removeAttr('disabled');
                    $('.mannagerDoctor-Box .f1>div>span').text(0);
                }
            });
        });

        //双击主管医生弹窗中table的每一行主管医生信息添加到主页面病人基本信息栏
        $(document).on('dblclick','.mannagerDoctor-Box tr:nth-child(1)~tr',function(){
            var thisMannagerDoctor;
            $('.mannagerDoctor-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    doctorNum=$(this).find('td:nth-child(1)').attr('data-id');
                    thisMannagerDoctor=$(this).find('td:nth-child(2)').text();
                    $('#p-doctor').val( thisMannagerDoctor);
                    $('.mannagerDoctor-Box tr').eq(0).siblings().remove();
                    $('.mannagerDoctor-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-doctor').removeAttr('disabled');
                    $('.mannagerDoctor-Box .f1>div>span').text(0);
                }
            });
        });


        //手术输入框获得焦点弹出手术名称
        $('#p-operationName').on('focus',function(){
            $('.operationName-Box').show();
            $('#p-operationName').attr('disabled','disabled');
        });

        //手术弹出框右上角点击查询弹出手术table的Ajax
        function operationNameAjax(){
            var PatientClinicDepartment=$('.operationName-Box .s1>input').val();
            if(!PatientClinicDepartment.trim()){
                tipAlertShow('请输入手术名称');
                return false;
            }

            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=SS&key="+PatientClinicDepartment+"",
                data:{},
                dataType:'json',
                success:function(data){
                    var html= '<tr><td>手术编码</td><td>手术名称</td></tr>';
                    var lg=data.length;
                    for(var i=0;i<lg;i++){
                        html+='<tr><td>'+data[i].OPERATION_CODE+'</td><td>'+data[i].OPERATION_NAME+'</td><input value='+JSON.stringify(data[i])+' type="hidden"/></tr>';
                    }
                    $('.operationName-Box .s2>table').html(html);
                    $('.operationName-Box .f1>div>span').text(lg);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }
        $('.operationName-Box .s1>button').on('click',function(){
            operationNameAjax();
        });
        //就诊科室弹出框左上角输入框获得焦点时按下entr可以查就诊科室
        $('.operationName-Box .s1>input').on('focus',function(){
            $('.operationName-Box .s1>input').on('keydown',function(){
                if((window.event.keyCode)==13){
                    operationNameAjax();
                }

            });
        });

        //就诊科室弹出框右下角点击"确定"实现将科室名称打印在主页面的就诊科室输入框；
        $('.operationName-Box .f1 button:nth-child(1)').on('click',function(){
            var thisDepartment;
            $('.operationName-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    operationID=$(this).find('td:nth-child(1)').text();
                    thisOperation=$(this).find('td:nth-child(2)').text();
                    $('#p-operationName').val(thisOperation);
                    $('.operationName-Box tr').eq(0).siblings().remove();
                    $('.operationName-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-operationName').removeAttr('disabled');
                    $('.operationName-Box .f1>div>span').text(0);
                }
            });
        });

        //双击就诊科室弹窗中table的每一行实现就诊科室添加到主页面病人信息栏
        $(document).on('dblclick','.operationName-Box tr:nth-child(1)~tr',function(){
            var thisDepartment;
            $('.operationName-Box tr:nth-child(1)~tr').each(function(){
                var thisIsChoosed=$(this).attr('isChoosed');
                if(thisIsChoosed=="true"){
                    operationID=$(this).find('td:nth-child(1)').text();
                    thisOperation=$(this).find('td:nth-child(2)').text();
                    $('#p-operationName').val(thisOperation);
                    $('.operationName-Box tr').eq(0).siblings().remove();
                    $('.operationName-Box').hide();
                    $(this).attr('data-isClick',"false").css({background:"white"});
                    $('#p-operationName').removeAttr('disabled');
                    $('.operationName-Box .f1>div>span').text(0);
                }
            });
        });

    }
    patientInf();

    //模板调用区域 lgy------------------------------------------------------------------------------------------------------------
    function modelUse() {
        //例子下拉框默认赋值
        $.ajax({
            type:'post',
            url:urlHead+"/medicalData/apis/apiData_H.apl?model=base&key=XBYY_1",
            data:{},
            dataType:'json',
            success:function(data){
                var html='<option value="nono">选择示例</option>';
                var lg=data.menu.length;
                for(var i=0;i<lg;i++){
                    html+='<option value='+data.menu[i].value+'>'+data.menu[i].name+'</option>'
                }
                $('#choose-example').html(html);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });

        //例子下拉框选中事件
        $('#choose-example').on('change',function(){
            var val=$(this).val();
            if(val=='nono'){
                return false;
            }
            $.ajax({
                type:'post',
                url:urlHead+"/medicalData/apis/apiData_H.apl?model=base&key="+val,
                data:{},
                dataType:'json',
                success:function(data){

                    //科室代码和医生编号赋值
                    departID=data.data.BRJBXX.JZKSDM;
                        doctorNum=data.data.BRJBXX.YSBH;

                    $('#p-ID').val(data.data.BRJBXX.BRID);
                    $('#p-name').val(data.data.BRJBXX.HZXM);
                    $('#p-mzOrZy').val(data.data.BRJBXX.MZZYH);
                    $('.mannagerDoctor-Box .s1>input').attr('data-ksid',departID);
                    if(data.data.BRJBXX.XB=='男'){
                        $('#p-sex').find("option").attr("selected",false);
                        $('#p-sex').find("option:contains('男')").attr("selected",true);

                        $('#p-lactationStatus').attr('disabled',true);
                        $('#p-pregnancyState').attr('disabled',true);
                        $('#p-pregnancy').attr('disabled',true);
                        $('#p-pregnancy').val('');

                        $('#p-lactationStatus').find("option").attr("selected",false);
                        $('#p-lactationStatus').find("option:contains('否')").attr("selected",true);
                        $('#p-pregnancyState').find("option").attr("selected",false);
                        $('#p-pregnancyState').find("option:contains('否')").attr("selected",true);

                    }else if(data.data.BRJBXX.XB=='女'){
                        $('#p-sex').find("option").attr("selected",false);
                        $('#p-sex').find("option:contains('女')").attr("selected",true);

                        $('#p-lactationStatus').attr('disabled',false);
                        $('#p-pregnancyState').attr('disabled',false);
                        if($('#p-pregnancyState').val()=='是'){
                            $('#p-pregnancy').attr('disabled',false);
                        }
                    }else{
                        $('#p-sex').find("option").attr("selected",false);
                        $('#p-sex').find("option:contains('请选择')").attr("selected",true);

                        $('#p-lactationStatus').attr('disabled',false);
                        $('#p-pregnancyState').attr('disabled',false);
                        if($('#p-pregnancyState').val()=='是'){
                            $('#p-pregnancy').attr('disabled',false);
                        }
                    }

                    $('#p-birth').val(data.data.BRJBXX.CSRQ);
                    $('#p-height').val(data.data.BRJBXX.SG);
                    $('#p-weight').val(data.data.BRJBXX.TZ);
                    if(data.data.BRJBXX.BRZT==1){
                        $('#p-lactationStatus').find("option").attr("selected",false);
                        $('#p-lactationStatus').find("option:contains('是')").attr("selected",true);


                    }else if(data.data.BRJBXX.BRZT==0){
                        $('#p-lactationStatus').find("option").attr("selected",false);
                        $('#p-lactationStatus').find("option:contains('否')").attr("selected",true);

                    }else{
                        $('#p-lactationStatus').find("option").attr("selected",false);
                        $('#p-lactationStatus').find("option:contains('请选择')").attr("selected",true);

                    }

                    if(data.data.BRJBXX.RCZT==1){
                        $('#p-pregnancyState').find("option").attr("selected",false);
                        $('#p-pregnancyState').find("option:contains('是')").attr("selected",true);

                        $('#p-pregnancy').removeAttr('disabled');

                    }else if(data.data.BRJBXX.RCZT==0){
                        $('#p-pregnancyState').find("option").attr("selected",false);
                        $('#p-pregnancyState').find("option:contains('否')").attr("selected",true);

                        $('#p-pregnancy').attr({disabled:"disabled"});
                        $('#p-pregnancy').val('');
                    }else{
                        $('#p-pregnancyState').find("option").attr("selected",false);
                        $('#p-pregnancyState').find("option:contains('请选择')").attr("selected",true);

                        $('#p-pregnancy').removeAttr('disabled');
                    }


                    $('#p-pregnancy').val(data.data.BRJBXX.YQ);
                    $('#p-mzAndZycs').val(data.data.BRJBXX.MZZYCS);
                    $('#p-Clinic-Department').val(data.data.BRJBXX.JZKS);
                    $('#p-doctor').val(data.data.BRJBXX.ZGYS);
                    $('#p-clinic-Date').val(data.data.BRJBXX.JZRQ);
                    //诊断
                    if(data.data.ZD.DiseaseName){
                        var ZD=data.data.ZD.DiseaseName.replace(/;/g,',');
                        $('#tags').importTags(ZD);

                    }else{
                        $('#tags').importTags('');
                    }

                     //慢性病
                    if(data.data.BRJBXX.MXB==1){
                        $('#p-chronicDisease').find("option").attr("selected",false);
                        $('#p-chronicDisease').find("option:contains('普通慢性病')").attr("selected",true);


                    }else if(data.data.BRJBXX.MXB==2){
                        $('#p-chronicDisease').find("option").attr("selected",false);
                        $('#p-chronicDisease').find("option:contains('特殊慢性病')").attr("selected",true);

                    }else{
                        $('#p-chronicDisease').find("option").attr("selected",false);
                        $('#p-chronicDisease').find("option:contains('请选择')").attr("selected",true);

                    }


                    $('#p-operationName').val(data.data.BRJBXX.SSMC);
                    operationID=data.data.BRJBXX.SSBM;

                    if(data.data.BRJBXX.CFLY==1){
                        $('#p-door').find("option").attr("selected",false);
                        $('#p-door').find("option:contains('门诊')").attr("selected",true);

                        //设置成组按钮的显示
                        $('.medicineInf-btn>button:nth-child(4)').hide();
                        $('.medicineInf-btn>button:nth-child(5)').hide();

                         //长期临时医嘱的显示
                        var html='<tr id="medicineInf-firstTr">'+
                            '<td>警</td>'+
                            '<td>选</td>'+
                            '<td class="hideTr">医嘱类型</td>'+
                            '<td class="hideTr">组</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/> 药品名称</td>'+
                            '<td>剂型</td>'+
                            '<td>规格</td>'+
                            '<td>厂家</td>'+
                            '<td>药品数量</td>'+
                            '<td>数量单位</td>'+
                            '<td>单次用量</td>'+
                            '<td>用量单位</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/>途径</td>'+
                            '<td data-isClick="false">频次</td>'+
                            '<td>用药天数</td>'+
                            '<td class="hideTr">滴速</td>'+
                            '<td class="hideTr">滴注时间</td>'+
                            '</tr>';

                        for(var i=0;i<data.data.YYXX.length;i++){
                            MedicineSign++;
                            var bookAndDrug;
                            if(data.data.YYXX[i].SMSSID){
                              bookAndDrug='<td data-isClick="false"><img src="../img/book.png" book-code='+data.data.YYXX[i].SMSSID+' alt="bookPicture" style="visibility: visible"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }else{
                                bookAndDrug='<td data-isClick="false"><img src="../img/book.png"  alt="bookPicture"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }
                            html+='<tr medicine-sign='+MedicineSign+'>'+
                                '<td><img src="../img/fobiden.png" alt="fobiden.png"/></td>'+
                                '<td><input type="checkbox" checked /></td>'+
                                ' <td class="hideTr"> <select><option selected>长期医嘱</option><option >临时医嘱</option></select></td>'+
                                '<td class="hideTr"><div class="" data-group='+data.data.YYXX[i].Z+'><div></div></div></td>'+
                                bookAndDrug+
                                '<td>'+data.data.YYXX[i].JX+'</td>'+
                                '<td>'+data.data.YYXX[i].GG+'</td>'+
                                '<td>'+data.data.YYXX[i].CJ+'</td>'+
                                '<td contenteditable="true">'+(data.data.YYXX[i].YPSL).split('|')[1]+'</td>'+
                                '<td>'+data.data.YYXX[i].SLDW+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].DCYL+'</td>'+
                                '<td>'+data.data.YYXX[i].YLDW+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].TJ+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].PC+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].YYTS+'</td>'+
                                '<td class="hideTr" contenteditable="true">10</td>'+
                                '<td class="hideTr" contenteditable="true">20</td>'+
                                '<input type="hidden" value='+data.data.YYXX[i].YPDM+' />'+
                                '</tr>';
                        }

                        $('.medicineInf-body>table').html(html);

                    }else if(data.data.BRJBXX.CFLY==2){
                        $('#p-door').find("option").attr("selected",false);
                        $('#p-door').find("option:contains('急诊')").attr("selected",true);

                        //设置成组按钮的显示
                        $('.medicineInf-btn>button:nth-child(4)').show();
                        $('.medicineInf-btn>button:nth-child(5)').show();

                        //长期临时医嘱的显示
                        var html='<tr id="medicineInf-firstTr">'+
                            '<td>警</td>'+
                            '<td>选</td>'+
                            '<td class="hideTr">医嘱类型</td>'+
                            '<td>组</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/> 药品名称</td>'+
                            '<td>剂型</td>'+
                            '<td>规格</td>'+
                            '<td>厂家</td>'+
                            '<td>药品数量</td>'+
                            '<td>数量单位</td>'+
                            '<td>单次用量</td>'+
                            '<td>用量单位</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/>途径</td>'+
                            '<td data-isClick="false">频次</td>'+
                            '<td>用药天数</td>'+
                            '<td class="hideTr">滴速</td>'+
                            '<td class="hideTr">滴注时间</td>'+
                            '</tr>';

                        for(var i=0;i<data.data.YYXX.length;i++){
                            MedicineSign++;
                            var bookAndDrug;
                            if(data.data.YYXX[i].SMSSID){
                                bookAndDrug='<td data-isClick="false"><img src="../img/book.png" book-code='+data.data.YYXX[i].SMSSID+' alt="bookPicture" style="visibility: visible"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }else{
                                bookAndDrug='<td data-isClick="false"><img src="../img/book.png"  alt="bookPicture"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }
                            html+='<tr medicine-sign='+MedicineSign+'>'+
                                '<td><img src="../img/fobiden.png" alt="fobiden.png"/></td>'+
                                '<td><input type="checkbox" checked /></td>'+
                                '<td class="hideTr"> <select><option selected>长期医嘱</option><option >临时医嘱</option></select></td>'+
                                '<td><div class="" data-group='+data.data.YYXX[i].Z+'><div></div></div></td>'+
                                bookAndDrug+
                                '<td>'+data.data.YYXX[i].JX+'</td>'+
                                '<td>'+data.data.YYXX[i].GG+'</td>'+
                                '<td>'+data.data.YYXX[i].CJ+'</td>'+
                                '<td contenteditable="true">'+(data.data.YYXX[i].YPSL).split('|')[1]+'</td>'+
                                '<td>'+data.data.YYXX[i].SLDW+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].DCYL+'</td>'+
                                '<td>'+data.data.YYXX[i].YLDW+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].TJ+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].PC+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].YYTS+'</td>'+
                                '<td class="hideTr" contenteditable="true">10</td>'+
                                '<td class="hideTr" contenteditable="true">20</td>'+
                                '<input type="hidden" value='+data.data.YYXX[i].YPDM+' />'+
                                '</tr>';
                        }

                        $('.medicineInf-body>table').html(html);



                    }else if(data.data.BRJBXX.CFLY==3){
                        $('#p-door').find("option").attr("selected",false);
                        $('#p-door').find("option:contains('住院')").attr("selected",true);

                        //设置成组按钮的显示
                        $('.medicineInf-btn>button:nth-child(4)').show();
                        $('.medicineInf-btn>button:nth-child(5)').show();

                        //长期临时医嘱的显示
                        var html='<tr id="medicineInf-firstTr">'+
                            '<td>警</td>'+
                            '<td>选</td>'+
                            '<td>医嘱类型</td>'+
                            '<td>组</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/> 药品名称</td>'+
                            '<td>剂型</td>'+
                            '<td>规格</td>'+
                            '<td>厂家</td>'+
                            '<td>药品数量</td>'+
                            '<td>数量单位</td>'+
                            '<td>单次用量</td>'+
                            '<td>用量单位</td>'+
                            '<td data-isClick="false" class="td-img"><img src="../img/redStar.png" alt="红色星星"/>途径</td>'+
                            '<td data-isClick="false">频次</td>'+
                            '<td>用药天数</td>'+
                            '<td>滴速</td>'+
                            '<td>滴注时间</td>'+
                            '</tr>';

                        for(var i=0;i<data.data.YYXX.length;i++){
                            MedicineSign++;
                            var bookAndDrug;
                            if(data.data.YYXX[i].SMSSID){
                                bookAndDrug='<td data-isClick="false"><img src="../img/book.png" book-code='+data.data.YYXX[i].SMSSID+' alt="bookPicture" style="visibility: visible"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }else{
                                bookAndDrug='<td data-isClick="false"><img src="../img/book.png"  alt="bookPicture"/><span>'+data.data.YYXX[i].YPMC+'</span></td>'
                            }

                            var YZ;
                            if(data.data.YYXX[i].YZLX=='1'){
                                YZ='<td> <select><option selected>长期医嘱</option><option >临时医嘱</option></select></td>';
                            }else if(data.data.YYXX[i].YZLX=='0'){
                                YZ='<td> <select><option>长期医嘱</option><option selected>临时医嘱</option></select></td>';
                            }
                            html+='<tr medicine-sign='+MedicineSign+'>'+
                                '<td><img src="../img/fobiden.png" alt="fobiden.png"/></td>'+
                                '<td><input type="checkbox" checked /></td>'+
                                YZ+
                                '<td><div class="" data-group='+data.data.YYXX[i].Z+'><div></div></div></td>'+
                                bookAndDrug+
                                '<td>'+data.data.YYXX[i].JX+'</td>'+
                                '<td>'+data.data.YYXX[i].GG+'</td>'+
                                '<td>'+data.data.YYXX[i].CJ+'</td>'+
                                '<td contenteditable="true">'+(data.data.YYXX[i].YPSL).split('|')[1]+'</td>'+
                                '<td>'+data.data.YYXX[i].SLDW+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].DCYL+'</td>'+
                                '<td>'+data.data.YYXX[i].YLDW+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].TJ+'</td>'+
                                '<td data-isClick="false">'+data.data.YYXX[i].PC+'</td>'+
                                '<td contenteditable="true">'+data.data.YYXX[i].YYTS+'</td>'+
                                '<td contenteditable="true">10</td>'+
                                '<td contenteditable="true">20</td>'+
                                '<input type="hidden" value='+data.data.YYXX[i].YPDM+' />'+
                                '</tr>';
                        }

                        $('.medicineInf-body>table').html(html);
                    }

                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        });


        //点击“清空按钮重置病人信息并且删除药品信息”
        $('.userModels-clear').on('click', function () {
            var r=confirm("是否清空页面数据!");
            if (r==true)
            {
                location.reload();
                //alert("操作成功!");
            }
            else
            {
                //alert("已取消清空操作!");
            }


        });

        //一个去掉字符串空格的方法
        function deletSpace(myString){
            var str=myString.replace(/\s/g, "");
            return str;
        }

        //点击处方审查提交病人药品信息
        $('.userModels-examination').on('click', function () {

            //病人基本信息数据区域------------
          BRJBXX=new PatientInf();
            var BRID=$('#p-ID').val();
            var HZXM = $('#p-name').val();
            var MZZYH=$('#p-mzOrZy').val();
            var XB = $('#p-sex>option:selected').val();
            if (XB == "请选择") {
                XB = "不详";
            }

            var CSRQ = $('#p-birth').val();
            var SG = $('#p-height').val() + "";
            var TZ = $('#p-weight').val() + "";

            var BRZT = $('#p-lactationStatus>option:selected').val();
            if (BRZT == "请选择") {
                BRZT = -1;
            } else if (BRZT == "是") {
                BRZT = 1;
            } else if (BRZT == "否") {
                BRZT = 0;
            }

            var RCZT = $('#p-pregnancyState>option:selected').val();
            if (RCZT == "请选择") {
                RCZT = -1;
            } else if (RCZT == "是") {
                RCZT = 1;
            } else if (RCZT == "否") {
                RCZT = 0;
            }

            var YQ = $('#p-pregnancy').val();
            var JZKS = $('#p-Clinic-Department').val();
            var ZGYS = $('#p-doctor').val();
            var CFLY = $('#p-door>option:selected').val();

            var JZRQ=$('#p-clinic-Date').val();
            if(CFLY=="门诊"){
                CFLY=1;
            }else if(CFLY=="急诊"){
                CFLY=2;
            }else if(CFLY=="住院"){
                CFLY=3;
            }


            var MXB=$('#p-chronicDisease>option:selected').val();
            if(MXB=="请选择"){
                MXB=0;
            }else if(MXB=="普通慢性病"){
                MXB=1;
            }else if(MXB=="特殊慢性病"){
                MXB=2;
            }


            var SSMC=$('#p-operationName').val();
            var SSBM=operationID;

            var KSDM=departID;
            var YSBH=doctorNum;

            //门诊住院次数
            var MZZYCS=$('#p-mzAndZycs').val();

            BRJBXX.BRID=BRID;
            BRJBXX.HZXM=HZXM;
            BRJBXX.MZZYH=MZZYH;
            BRJBXX.XB=XB;
            BRJBXX.CSRQ=CSRQ;
            BRJBXX.SG=SG;
            BRJBXX.TZ=TZ;
            BRJBXX.BRZT=BRZT;
            BRJBXX.RCZT=RCZT;
            BRJBXX.YQ=YQ;
            BRJBXX.JZKS=JZKS;
            BRJBXX.JZKSDM=KSDM;
            BRJBXX.ZGYS=ZGYS;
            BRJBXX.YSBH=YSBH;
            BRJBXX.JZRQ=JZRQ;
            BRJBXX.CFLY=CFLY;
            BRJBXX.MXB=MXB;
            BRJBXX.SSMC=SSMC;
            BRJBXX.SSBM=SSBM;
            BRJBXX.MZZYCS=MZZYCS;
            //诊断信息数据区域------------------
            var zd= [];
            ZD=new DiagnosisInfo();
            $('.tag>span').each(function (index, element) {
                var zdmy=deletSpace($(this).text());
                zd[index] =zdmy;
            });
            ZD.DiseaseName=zd.join(';');
            //用药信息数据区域----------------------------
            var  countTrYES = -1;
            //每次审查刷新用药数据为空数组
            YYXX=[];
            $('#medicineInf-firstTr~tr').each(function () {
                var Ynmae = $(this).find('td:nth-child(5)').text();
                if (Ynmae) {
                    countTrYES++;
                    var yyxx = {};
                    //药品代码
                    var ypdm=$(this).children('input').val();
                    yyxx.YPDM=ypdm;
                    var yzlx = $(this).find('td:nth-child(3)>select>option:selected').val();
                                    if (yzlx == "长期医嘱") {
                            yzlx = 1 + "";
                        } else if (yzlx == "临时医嘱") {
                            yzlx = 0 + "";
                        } else {

                    }
                    yyxx.YZLX = yzlx;
                    var z=$(this).find('td:nth-child(4)>div').attr('data-group');
                    if(z==undefined||z=="undefined"){
                        z="";
                    }
                    yyxx.Z =z;
                    yyxx.YPMC = $(this).find('td:nth-child(5)').text();
                    yyxx.JX = $(this).find('td:nth-child(6)').text();
                    yyxx.GG = $(this).find('td:nth-child(7)').text();
                    yyxx.CJ = $(this).find('td:nth-child(8)').text();
                    //药品数量单=规格|药品数量
                    var ypsl=$(this).find('td:nth-child(9)').text();
                    var gg=$(this).find('td:nth-child(7)').text();
                    ypsl=gg+"|"+ypsl;
                    yyxx.YPSL = ypsl;
                    yyxx.SLDW = $(this).find('td:nth-child(10)').text();
                    yyxx.DCYL = $(this).find('td:nth-child(11)').text();
                    yyxx.YLDW = $(this).find('td:nth-child(12)').text();
                    yyxx.TJ = $(this).find('td:nth-child(13)').text();
                    yyxx.PC = $(this).find('td:nth-child(14)').text();
                    yyxx.YYTS = $(this).find('td:nth-child(15)').text();
                    yyxx.DS = $(this).find('td:nth-child(16)').text();
                    yyxx.DZSJ = $(this).find('td:nth-child(17)').text();
                    //添加药品栏标志
                    yyxx.YPINDX=$(this).attr('Medicine-sign');
                    YYXX[countTrYES]=new DrugUseInfo();
                    YYXX[countTrYES]= yyxx;
                }
            });
            var myObj = {};
            myObj.BRJBXX=BRJBXX;
            myObj.ZD=ZD;
            myObj.YYXX=YYXX;
            //console.log(myObj);
            if(!myObj.BRJBXX.JZKS){
                tipAlertShow('请填写就诊科室！');
                return false;
            }
            for(var x=0;x<myObj.YYXX.length;x++){
                if(!myObj.YYXX[x].YPMC){
                    tipAlertShow('请补全药品名称！');
                    return false;
                }else if(!myObj.YYXX[x].TJ){
                    tipAlertShow('请补全用药途径！');
                    return false;
                }else{

                }
            }
            doCheck();
        });

        //发送点击事件
        $('.userModels-sedExamination').on('click',function(){
            successSend();
        });

        //发药点击事件
        $('.sendDrugBtn').on('click',function(){
                var mytype=$(this).text();
                localStorage.setItem('sendOrPay',mytype);
            location.href='./drugDelivery.html';
        });

        //缴费点击事件
        $('.payBtn').on('click',function(){
            var mytype=$(this).text();
            localStorage.setItem('sendOrPay',mytype);
            location.href='./drugDelivery.html';
        });

    }
    modelUse();




    //药品信息区域 lgy------------------------------------------------------------------------
    function medicineInformationArea(){
        //光标定位
        function setSelectionRange(input, selectionStart, selectionEnd) {
            if (input.setSelectionRange) {
                console.log(123);
                input.focus();
                input.setSelectionRange(selectionStart, selectionEnd);
            }
            else if (input.createTextRange) {
                console.log(456);
                var range = input.createTextRange();
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        }
        //药品信息表格中药品数量、单次用量、用药天数表单验证
        //$(document).on('keyup','#medicineInf-firstTr~tr>td:nth-child(9)',function(){
        //    var val=$(this).text();
        //        if(val.length==1){
        //            this.innerText=this.innerText.replace(/[^1-9]/g,'');
        //            var sr=$(this).get(0);
        //            var len=sr.innerText.length;
        //            setSelectionRange(sr,len,len);
        //        }else{
        //
        //            this.innerText=this.innerText.replace(/\D/g,'');
        //
        //            var sr=$(this).get(0);
        //            var len=sr.innerText.length;
        //            setSelectionRange(sr,len,len);
        //        }
        //
        //});
        //$(document).on('keyup','#medicineInf-firstTr~tr>td:nth-child(11)',function(){
        //    var val=$(this).text();
        //    if(val.length==1){
        //        this.innerText=this.innerText.replace(/[^1-9]/g,'')
        //    }else{
        //        this.innerText=this.innerText.replace(/\D/g,'')
        //    }
        //});
        //$(document).on('keyup','#medicineInf-firstTr~tr>td:nth-child(15)',function(){
        //    var val=$(this).text();
        //    if(val.length==1){
        //        this.innerText=this.innerText.replace(/[^1-9]/g,'')
        //    }else{
        //        this.innerText=this.innerText.replace(/\D/g,'')
        //    }
        //});








        //药品信息栏每一行的选中状态
        $(document).on('click','#medicineInf-firstTr~tr',function(){
            $('#medicineInf-firstTr~tr').css({background:"white"});
            $('#medicineInf-firstTr~tr:nth-child(2n+1)').css({background:"#f8f8f8"});
            $(this).css({background:"#e9f6ff"});
        });
        //点击添加可添加一行用药信息栏
        $('.medicineInf-btn>button:nth-child(1)').on('click',function(){
            var html='';
            var CFLY = $('#p-door>option:selected').val();
            if(CFLY=='住院'){
                var group='';
                if(CFLY=='门诊'){
                    group='<td class="hideTr"><div class=""><div></div></div></td>';

                }else{
                    group='<td><div class=""><div></div></div></td>';
                }
                html+= '<tr>'+
                    '<td><img src="../img/fobiden.png" alt="fobiden.png"/></td>'+
                    '<td><input type="checkbox" checked /></td>'+
                    ' <td> <select><option selected>长期医嘱</option><option >临时医嘱</option></select></td>'+
                    group+
                    '<td data-isClick="false"><img src="../img/book.png" alt="bookPicture"/><span></span></td>'+
                    '<td></td>'+
                    '<td></td>'+
                    '<td></td>'+
                    '<td contenteditable="true">1</td>'+
                    '<td></td>'+
                    '<td contenteditable="true">0.00</td>'+
                    '<td></td>'+
                    '<td data-isClick="false"></td>'+
                    '<td data-isClick="false"></td>'+
                    '<td contenteditable="true">1</td>'+
                    '<td contenteditable="true"></td>'+
                    '<td contenteditable="true"></td>'+
                    '<input type="hidden"/>'+
                    '</tr>';
            }else{
                var group='';
                if(CFLY=='门诊'){
                    group='<td class="hideTr"><div class=""><div></div></div></td>';

                }else{
                    group='<td><div class=""><div></div></div></td>';
                }
                html+= '<tr>'+
                    '<td><img src="../img/fobiden.png" alt="fobiden.png"/></td>'+
                    '<td><input type="checkbox" checked /></td>'+
                    ' <td class="hideTr"> <select><option selected>长期医嘱</option><option >临时医嘱</option></select></td>'+
                    group+
                    '<td data-isClick="false"><img src="../img/book.png" alt="bookPicture"/><span></span></td>'+
                    '<td></td>'+
                    '<td></td>'+
                    '<td></td>'+
                    '<td contenteditable="true">1</td>'+
                    '<td></td>'+
                    '<td contenteditable="true">0.00</td>'+
                    '<td></td>'+
                    '<td data-isClick="false"></td>'+
                    '<td data-isClick="false"></td>'+
                    '<td contenteditable="true">1</td>'+
                    '<td contenteditable="true" class="hideTr"></td>'+
                    '<td contenteditable="true" class="hideTr"></td>'+
                    '<input type="hidden"/>'+
                    '</tr>';
            }



            $('.medicineInf-body>table').append(html);
        });

        //勾上该行选后点击“删除”可删除这一行用药信息栏
        $('.medicineInf-btn>button:nth-child(2)').on('click',function(){
            var selectedGroupTop=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineHeader').length;
            var selectedGroupBottom=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineFooter').length;
            var selectedGroupBody=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineBodyYes').length;
            if(selectedGroupTop>=1||selectedGroupBottom>=1||selectedGroupBody>=1){
                tipAlertShow('要想删除已设置成组的行，请先取消成组');
                return false;
            }else{
                var checkedLg=$('.medicineInf-body input:checked').length;
                if(checkedLg<1){
                    tipAlertShow('请先勾选要删除的行');
                    return false;
                }

                $('.medicineInf-body input:checked').parent('td').parent('tr').remove();
                $('#medicineInf-firstTr~tr').css({background:"white"});
                $('#medicineInf-firstTr~tr:nth-child(2n+1)').css({background:"#f8f8f8"});
            }

        });

        //点击”清空“删除除了第一行后的所有tr
        $('.medicineInf-btn>button:nth-child(3)').on('click',function(){
            var r=confirm("是否清空用药信息表格数据!");
            if (r==true)
            {
                ifInputSelected=false;
                $('#medicineInf-firstTr~tr').remove();
                //alert("操作成功!");
            }
            else
            {
                //alert("已取消清空操作!");
            }

        });

        //药品设置成组-------------------
        // 点击开始设置成组/结束设置成组的切换
        $('.medicineInf-btn>button:nth-child(4)').on('click',function(){
            var stratGroup=$(this).attr('strat-group');
            if(stratGroup=='true'){
                var selBody=$('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr');
                var count= 0,lg=selBody.length;
                var frequencyCompare=selBody.eq(0).find('td:nth-child(14)').text();
                var wayCompare=selBody.eq(0).find('td:nth-child(13)').text();
                var comparelg=0;
                //判断是否有已经设置成组的组
                var selectedGroupTop=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineHeader').length;
                var selectedGroupBottom=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineFooter').length;
                var selectedGroupBody=$('.medicineInf-body input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('.groupLineBodyYes').length;
                if(selectedGroupTop>=1||selectedGroupBottom>=1||selectedGroupBody>=1){
                    tipAlertShow('不能从其他组里选行设置成组');
                    return false;
                }
                //判断是否都相邻
                if(lg>=3){
                    selBody.each(function(index,element){
                        //判断途径和频次一样且不为空
                        var thisFrequencyCompare=$(this).find('td:nth-child(14)').text();
                        var thisWayCompare=$(this).find('td:nth-child(13)').text();
                        if((thisFrequencyCompare==frequencyCompare)&&(thisWayCompare==wayCompare)&&frequencyCompare&&wayCompare){
                            comparelg++;
                        }
                        if(index!=0&&index!=lg-1){
                            var bottomLg=$(this).next().find('input:checked').length;
                            var topLg=$(this).prev().find('input:checked').length;
                            if(bottomLg==1&&topLg==1){

                            }else{
                                count++;
                            }
                        }

                    });
                }else if(lg==2){
                    selBody.each(function(){
                        var thisFrequencyCompare=$(this).find('td:nth-child(14)').text();
                        var thisWayCompare=$(this).find('td:nth-child(13)').text();
                        if((thisFrequencyCompare==frequencyCompare)&&(thisWayCompare==wayCompare)&&frequencyCompare&&wayCompare){
                            comparelg++;
                        }
                        var bottomLg=$(this).next().find('input:checked').length;
                        var topLg=$(this).prev().find('input:checked').length;
                        if((bottomLg+topLg)==1){

                        }else{
                            count++;
                        }
                    });
                }else{
                    tipAlertShow("设置成组医嘱至少需要选中两条医嘱！");
                    return false;
                }


                if(comparelg==lg){
                    if(count>=1){
                        tipAlertShow("全部相邻的才能设置成组");
                    }else{
                        groupCount++;
                        $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('div').attr('class','groupLineBodyYes');
                        $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').eq(0).find('td:nth-child(4)').children('div').attr('class','groupLineHeader');
                        $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').eq(lg-1).find('td:nth-child(4)').children('div').attr('class','groupLineFooter');
                        $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('div').attr('data-group',groupCount);
                        ifInputSelected=false;
                        $(this).attr('strat-group','false');
                        $(this).find('span').text('开始设置成组');
                        tipAlertShow("已经结束设置成组");
                    }
                }else{
                    tipAlertShow("[给药途径、频次]内容不一致，不允许设置成组医嘱！");
                    return false;
                }
            }else if(stratGroup=='false'){
                $(this).attr('strat-group','true');
                $(this).find('span').text('结束设置成组');
                tipAlertShow('开始设置成组');
            }else{
                return false;
            }
            //ifInputSelected=true;
        });


        //取消设置成组
        $('.medicineInf-btn>button:nth-child(5)').on('click',function(){
            var selBody=$('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr');
            var count= 0,lg=selBody.length;
            //判断头和尾巴是否同时都是组员
            var headerLg=selBody.eq(0).find('td:nth-child(4)').children('.groupLineHeader').length;
            var footerLg=selBody.eq(lg-1).find('td:nth-child(4)').children('.groupLineFooter').length;
            if((headerLg==1)&&(footerLg==1)){
                if(lg>=2){
                    selBody.each(function(index,element){
                        if(index!=0&&index!=lg-1){
                            var bottomLg=$(this).next().find('input:checked').length;
                            var topLg=$(this).prev().find('input:checked').length;
                            if(bottomLg==1&&topLg==1){
                                var ifBody=$(this).find('td:nth-child(4)').children('.groupLineBodyYes').length;
                                if(ifBody==1){
                                    count++;
                                }
                            }else{
                                tipAlertShow('请选择已设置成组的医嘱！');
                                return false;
                            }
                        }

                    });
                }else{
                    tipAlertShow('请选择已设置成组的医嘱！');
                    return false;
                }
            }
            if((count+2)==lg){
                $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('div').attr('class','');
                $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').eq(0).find('td:nth-child(4)').children('div').attr('class','');
                $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').eq(lg-1).find('td:nth-child(4)').children('div').attr('class','');
                $('#medicineInf-firstTr~tr input:checked').parent('td').parent('tr').find('td:nth-child(4)').children('div').removeAttr('data-group');
            }else{
                tipAlertShow('请选择已设置成组的医嘱！');
                return false;
            }
        });

        //图片src拼接+“1”函数
        function imgAdd1(string){
            var arry=string.split('.png');
            arry[0]=arry[0]+"1.png";
            var newSrc=arry.join('');
            return newSrc;
        }
        //图片src拼接-“1”函数
        function imgSub1(string){
            var arry=string.split('.png');
            arry[0]=arry[0].slice(0,-1);
            arry[0]=arry[0]+".png";
            var newSrc=arry.join('');
            return newSrc;
        }

        //用药信息右上角按钮移动上去改变字体颜色和背景图
        $('.medicineInf-btn>button').hover(function(){
            var mySrc=$(this).find('img').attr('src');
            var newSrc=imgAdd1(mySrc);
            $(this).find('span').css({color:"#ffdf00"});
            $(this).find('img').attr('src',newSrc);
        },function(){
            var mySrc=$(this).find('img').attr('src');
            var newSrc=imgSub1(mySrc);
            $(this).find('span').css({color:"#333"});
            $(this).find('img').attr('src',newSrc);
        });

        //点击“警”里面的灯显示处方审查弹窗 .attr('ssid',date.SSID)
        //$(document).on('click','#medicineInf-firstTr~tr>td:nth-child(1)>img',function(){
        //    var ypdm=$(this).parent('td').parent('tr').attr('medicine-sign');
        //    var ssid=$(this).attr('SSID');
        //
        //    console.log(ypdm);
        //    console.log(ssid);
        //    $.ajax({
        //        type: "post",
        //        url: doCheckUrl,
        //        dataType:'json',
        //        data:{
        //            INDEX:ypdm,
        //            SSID:ssid
        //        },
        //        success: function (date) {
        //            if(date.NO==0){
        //                $('.ReviewResults-Box>iframe').attr('src',date.DATA);
        //                $('.ReviewResults-Box').show();
        //            }
        //            console.log(date);
        //        },
        //        error : function(XMLHttpRequest, textStatus, errorThrown){
        //            console.log(errorThrown);
        //        }
        //    });
        //});
    }
    medicineInformationArea();

    //驾咬助手图片点击链接
    $('.jazsLink>img').on('click',function(){
       window.open(urlHead+'/JYZS/index.html');
    });

    //小提示弹窗的函数
    function tipAlertShow(myString){
        clearTimeout(tipAlertTimeout);
        $('.tipBody span').text(myString);
        $('.tipAlert').slideDown();
        tipAlertTimeout=setTimeout(function(){
            $('.tipAlert').slideUp();
        },2000);
    }



});


//固定药品信息表头
$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.medicineInf-body');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('#medicineInf-firstTr').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});

//固定各弹窗表头
$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.medicineInformation-BOx .s2');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.medicineInformation-BOx .s2 tr:nth-child(1)').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});

$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.medicineFrequency-BOx .s2');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.medicineFrequency-BOx .s2 tr:nth-child(1)').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});

$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.medicineWay-BOx .s2');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.medicineWay-BOx .s2 tr:nth-child(1)').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});

$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.ClinicDepartment-Box .s2');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.ClinicDepartment-Box .s2 tr:nth-child(1)').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});

$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.mannagerDoctor-Box .s2');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.mannagerDoctor-Box .s2 tr:nth-child(1)').style.transform = 'translate(0, '+(this.scrollTop-1)+'px)';
    });
});