/**
 * Created by Sean.S on 2018/9/28.
 */

$(document).ready(function(){
    //定义全局变量
    var ifshowBottomBtn=false,tipAlertTimeout;

    //页面加载
    function pageLoad(){
        var mySendOrPay=localStorage.sendOrPay;
        if(mySendOrPay=="发药"){
            $('#operation-category>option:first-child').text(mySendOrPay);
            $('#sendDrugBtn').show();
            $('#payDrugBtn').hide();
        }else if(mySendOrPay=="缴费"){
            $('#operation-category>option:first-child').text(mySendOrPay);
            $('#sendDrugBtn').hide();
            $('#payDrugBtn').show();
        }else{
            return false
        }
    }
    pageLoad();

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

    //设置默认日期为当天
    $('#start-date').val(today());
    $('#end-date').val(today());

    //左侧表单Ajax
    function leftTableAjax(){
        var operationCategory=$('#operation-category').val();
        var startTime=$('#start-date').val();
        var endTime=$('#end-date').val();
        var patientId=$('#Patient').val();
        if(operationCategory=="发药"){
            $.ajax({
                url :sendDrugUrl+patientId+"&s="+startTime+"&e="+endTime,
                type : "POST",
                dataType:'json',
                data : {},
                success:function(data){
                    var html='';
                    for(var i=0;i<data.length;i++){
                        html+='<tr data-rno='+data[i].RNO+' data-patientId='+data[i].PATIENT_ID+'>'+
                            '<td>'+data[i].NAME+'</td>'+
                            '<td>'+data[i].DEPT_NAME+'</td>'+
                            '<td>'+data[i].stat+'</td>'+
                            '</tr>';
                    }
                    $('.table-box>table>tbody').html(html);
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });

        }else if(operationCategory=="缴费"){
            $.ajax({
                url :openDrugUrl+patientId+"&s="+startTime+"&e="+endTime,
                type : "POST",
                dataType:'json',
                data : {},
                success:function(data){
                    console.log(data);
                    var html='';
                    for(var i=0;i<data.length;i++){
                        html+='<tr data-rno='+data[i].RNO+' data-patientId='+data[i].PATIENT_ID+'>'+
                            '<td>'+data[i].NAME+'</td>'+
                            '<td>'+data[i].DEPT_NAME+'</td>'+
                            '<td>'+data[i].stat+'</td>'+
                            '</tr>';
                    }
                    $('.table-box>table>tbody').html(html);

                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }else{

        }
    }
    //点击收搜按钮事件
    $('.searchBtn').on('click',function(){
        leftTableAjax();
    });

    //病人ID输入框按下enter事件
    $('#Patient').on('focus',function(){
        $('#Patient').on('keydown',function(){
            if(event.keyCode==13){
                leftTableAjax();

            }

        })

    });




    //左侧表单每一行的单机事件

    $(document).on('click','.table-box>table>tbody>tr',function(){
        var nowState=$(this).children('td:nth-child(3)').text();
        $(this).css({background:"pink"});
        $(this).siblings().css({background:"white"});
        var rno=$(this).attr('data-rno');
        var patientId=$(this).attr('data-patientId');
        var operationCategory=$('#operation-category').val();
        var myurlFrmURl;
        if(operationCategory=="发药"){
            myurlFrmURl=detailDrugInf+patientId+'&rno='+rno+"&frm=fy";
        }else if(operationCategory=="缴费"){
            myurlFrmURl=detailDrugInf+patientId+'&rno='+rno+"&frm=jf";
        }else{
            return false;
        }
        $.ajax({
            url :myurlFrmURl,
            type : "POST",
            dataType:'json',
            data : {},
            success:function(data){
                $('.in-cfh').text(data.BASE.ORDERED_BY);
                $('.in-patientName').text(data.BASE.NAME);
                $('.in-patienSex').text(data.BASE.SEX);
                $('.in-patientAge').text(data.BASE.AGE);
                $('.in-dignosisNumber').text(data.BASE.CLINIC_NO);
                $('.in-department').text(data.BASE.DEPT_NAME);
                $('.in-clinc').text(data.BASE.DIAG_DESC);
                $('.in-count').text(data.BASE.PRICE);
                $('.in-date').text(data.BASE.VISIT_DATE);
                $('.in-doctor').text(data.BASE.DOCTOR);
                //判断是否通过
                $('.biao-IfPass').show();
                if(nowState=='拒'){
                    $('.biao-IfPass>img').hide();
                    $('.biao-IfPass>img').css({cursor:'inherit' });
                    $('.ReviewResults-Box>iframe').attr('src',data.BASE.EURL);
                    if(data.BASE.EURL){
                        $('.IfPass-no').css({cursor:'pointer' });
                    }else{
                        $('.IfPass-no').css({cursor:'inherit' });
                    }

                    $('.IfPass-no').show();
                }else if(nowState=='过'){
                    //为空就通过
                    $('.biao-IfPass>img').hide();
                    $('.biao-IfPass>img').css({cursor:'inherit' });
                    $('.IfPass-ok').show();
                }else if(nowState=='审'){
                    $('.biao-IfPass>img').hide();
                    $('.biao-IfPass>img').css({cursor:'inherit' });
                    $('.IfPass-load').show();
                }else if(nowState=='警'){
                    $('.biao-IfPass>img').hide();
                    $('.biao-IfPass>img').css({cursor:'inherit' });
                    if(data.BASE.EURL){
                        $('.IfPass-warn').css({cursor:'pointer' });
                    }else{
                        $('.IfPass-warn').css({cursor:'inherit' });
                    }
                    $('.ReviewResults-Box>iframe').attr('src',data.BASE.EURL);
                    $('.IfPass-warn').show();
                }


                var ifShowBtn=data.BASE.hideBotton;
                if(ifShowBtn){
                    ifshowBottomBtn=false;
                }else{
                    ifshowBottomBtn=true;
                }
                //给按钮添加data属性
                $('.section-right-box-bottom>button').attr('data-rno',rno);
                $('.section-right-box-bottom>button').attr('data-id',patientId);

                var html='';
                for(var i=0;i<data.DRUG.length;i++){
                    var allcount=data.DRUG[i].AMOUNT+""+data.DRUG[i].UNITS;
                    var onceSize=data.DRUG[i].DOSAGE+""+data.DRUG[i].DOSAGE_UNITS;
                    html+='<tr>'+
                    '<td>'+data.DRUG[i].DRUG_NAME+'</td>'+
                    '<td>'+allcount+'</td>'+
                    '<td>'+onceSize+'</td>'+
                    '<td>'+data.DRUG[i].ADMINISTRATION+'</td>'+
                    '</tr>';
                }
                $('.biao-RP-tableBox>table>tbody').html(html);

            },
            error : function(XMLHttpRequest, textStatus, errorThrown){
                console.log(errorThrown);
            }
        });
    });

    //未通过图片的点击事件
    $('.IfPass-no').on('click',function(){
        var reasonSrc=$('.ReviewResults-Box>iframe').attr('src');
        if(reasonSrc){
            $('.alertBox').show();
        }else{
            return false
        }

    });

    //警图片的点击事件
    $('.IfPass-warn').on('click',function(){
        var reasonSrc=$('.ReviewResults-Box>iframe').attr('src');
        if(reasonSrc){
            $('.alertBox').show();
        }else{
            return false
        }

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
                    myThis.animate({left:_x+"px",top:_y+"px"},5,'linear');
                });
            });

            $(document).mouseup(function(){
                $(".alertBox").css("cursor","default");
                $(this).unbind("mousemove");
            });
        });
    }
    myAlertDrag();

    //审查弹窗点击X的关闭事件
    $('.rbh-box>div:nth-child(2)>img:nth-child(1)').on('click',function(){
        $('.ReviewResults-Box').hide();
        $('.ReviewResults-Box').css({width:'50%',height:"60vh",left:'25%',top:"25%"});
    });
    //审查弹窗点击正方形的放大和还原事件
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
    });

    //审查弹窗点击缩小的事件
    $('.rbh-box>div:nth-child(2)>img:nth-child(3)').on('click',function(){
        $('.ReviewResults-Box').css({width:'10%',height:"45px",minHeight: "45px"});
    });

    //发药按钮点击事件
    $('#sendDrugBtn').on('click',function(){
        var patientNmae=$('.in-patientName').text();
        var patientRno=$(this).attr('data-rno');
        var patientId=$(this).attr('data-id');
        if(patientNmae){
            if(ifshowBottomBtn){
                $.ajax({
                    url :reallyDrugSendUrl+patientId+"&rno="+patientRno,
                    type : "POST",
                    dataType:'json',
                    data : {
                        fstat:1
                    },
                    success:function(data){
                        if(data.err==0){
                            tipAlertShow('操作成功！');
                            $('.table-box>table>tbody').empty();
                            $('.in-cfh').text('');
                            $('.in-patientName').text('');
                            $('.in-patienSex').text('');
                            $('.in-patientAge').text('');
                            $('.in-dignosisNumber').text('');
                            $('.in-department').text('');
                            $('.in-clinc').text('');
                            $('.in-count').text('');
                            $('.in-date').text('');
                            $('.in-doctor').text('');
                            $('.biao-IfPass>img').hide();
                            $('.ReviewResults-Box').hide();
                            $('.biao-RP-tableBox>table>tbody').empty();
                        }
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown){
                        console.log(errorThrown);
                    }
                });
            }else{
                tipAlertShow('药师审核未通过,不支持该操作！');
            }

        }else{
            tipAlertShow('信息不全，无法操作！');
            return false;
        }

    });



    //缴费按钮点击事件
    $('#payDrugBtn').on('click',function(){
        var patientNmae=$('.in-patientName').text();
        var patientRno=$(this).attr('data-rno');
        var patientId=$(this).attr('data-id');
        if(patientNmae){
            if(ifshowBottomBtn){
                $.ajax({
                    url :reallyDrugPayUrl+patientId+"&rno="+patientRno,
                    type : "POST",
                    dataType:'json',
                    data : {
                        fstat:1
                    },
                    success:function(data){
                        if(data.err==0){
                            tipAlertShow('操作成功！');
                            $('.table-box>table>tbody').empty();
                            $('.in-cfh').text('');
                            $('.in-patientName').text('');
                            $('.in-patienSex').text('');
                            $('.in-patientAge').text('');
                            $('.in-dignosisNumber').text('');
                            $('.in-department').text('');
                            $('.in-clinc').text('');
                            $('.in-count').text('');
                            $('.in-date').text('');
                            $('.in-doctor').text('');
                            $('.biao-IfPass>img').hide();
                            $('.ReviewResults-Box').hide();
                            $('.biao-RP-tableBox>table>tbody').empty();
                        }

                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown){
                        console.log(errorThrown);
                    }
                });
            }else{
                tipAlertShow('药师审核未通过,不支持该操作！');
            }
        }else{
            tipAlertShow('信息不全，无法操作！');
            return false;
        }

    });


    //作废按钮
    $('#cancelBtn').on('click',function(){
        var mySendOrPay=localStorage.sendOrPay;
        if(mySendOrPay=="发药"){
            var patientNmae=$('.in-patientName').text();
            var patientRno=$('#sendDrugBtn').attr('data-rno');
            var patientId=$('#sendDrugBtn').attr('data-id');
            if(patientNmae){
                $.ajax({
                    url :reallyDrugSendUrl+patientId+"&rno="+patientRno,
                    type : "POST",
                    dataType:'json',
                    data : {
                        fstat:2
                    },
                    success:function(data){
                        if(data.err==0){
                            tipAlertShow('该药方已经作废！');
                            $('.table-box>table>tbody').empty();
                            $('.in-cfh').text('');
                            $('.in-patientName').text('');
                            $('.in-patienSex').text('');
                            $('.in-patientAge').text('');
                            $('.in-dignosisNumber').text('');
                            $('.in-department').text('');
                            $('.in-clinc').text('');
                            $('.in-count').text('');
                            $('.in-date').text('');
                            $('.in-doctor').text('');
                            $('.biao-IfPass>img').hide();
                            $('.ReviewResults-Box').hide();
                            $('.biao-RP-tableBox>table>tbody').empty();
                        }
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown){
                        console.log(errorThrown);
                    }
                });
            }else{
                tipAlertShow('请先选取左侧表格中要操作的行！');
                return false;
            }

        }else if(mySendOrPay=="缴费"){
            var patientNmae=$('.in-patientName').text();
            var patientRno=$('#payDrugBtn').attr('data-rno');
            var patientId=$('#payDrugBtn').attr('data-id');
            if(patientNmae){
                $.ajax({
                    url :reallyDrugPayUrl+patientId+"&rno="+patientRno,
                    type : "POST",
                    dataType:'json',
                    data : {
                        fstat:2
                    },
                    success:function(data){
                        if(data.err==0){
                            tipAlertShow('该缴费单已经作废！');
                            $('.table-box>table>tbody').empty();
                            $('.in-cfh').text('');
                            $('.in-patientName').text('');
                            $('.in-patienSex').text('');
                            $('.in-patientAge').text('');
                            $('.in-dignosisNumber').text('');
                            $('.in-department').text('');
                            $('.in-clinc').text('');
                            $('.in-count').text('');
                            $('.in-date').text('');
                            $('.in-doctor').text('');
                            $('.biao-IfPass>img').hide();
                            $('.ReviewResults-Box').hide();
                            $('.biao-RP-tableBox>table>tbody').empty();
                        }

                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown){
                        console.log(errorThrown);
                    }
                });
            }else{
                tipAlertShow('请先选取左侧表格中要操作的行！');
                return false;
            }

        }else{
            return false
        }
    });

});






    //固定左侧表头
$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.table-box');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.table-box>table>thead').style.transform = 'translate(0, '+(this.scrollTop)+'px)';
    });
});

//固定右侧表头
$(document).ready(function(){
    var $ = document.querySelector.bind(document);
    var boxEle = $('.biao-RP-tableBox');
    boxEle.addEventListener('scroll', function(e) {
        this.querySelector('.biao-RP-tableBox>table>thead').style.transform = 'translate(0, '+(this.scrollTop)+'px)';
    });
});


