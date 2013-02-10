/*                                                                                                                                                                                           
  Author: Daniel Munera Sanchez                                                                                                                                                              
  Description: Adding accordion effect to blocks moodle and overlay to login page,
               Slider to the home page and fixing small details
*/

//REGEX BY JAMES PADOLSEY
$.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
    validLabels = /^(data|css):/,
    attr = {
	method: matchParams[0].match(validLabels) ?
	matchParams[0].split(':')[0] : 'attr',
	property: matchParams.shift().replace(validLabels,'')
    },
    regexFlags = 'ig',
    regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test($(elem)[attr.method](attr.property));
}

//Customize tabs effect jquerytools
$.tools.tabs.addEffect("slide", function(i, done) {
    this.getPanes().slideUp().css({opacity: 0.5});
    this.getPanes().eq(i).slideDown(function()  {
	       $(this).css({opacity: 1.0});
	       done.call();
    });
});

//Script to modify the moodle menu, adding the accodion effect with all tabs on top
function customizeMenu(region,regionLocation){
    $('#mod_quiz_navblock').attr('id', 'inst'); //to add quiz navigation mod to the menu.
    var $tabsId = "tabs-" + regionLocation;
    region.find('.region-content').attr('id',$tabsId);
    region.find('.block.block_adminblock').attr('id','inst');
    var tabs = $("#" + $tabsId);
    tabs.prepend($('div.header-tab', region));
    var subcont = region.find("div:regex(id, inst)",tabs);
    tabs.tabs(subcont, {tabs: 'div.header-tab', effect: 'slide', initialIndex: 0});
    
    //Avoid first efect when the page is loaded
    $(subcont).css("display","none");
    subcont.first().css("display","block");
    //add Rounded borders to the first tab                                                                                            
    $('div.header-tab:first',tabs).css({
	    '-moz-border-radius':'5px 5px 0px 0px',
		'border-radius':'5px 5px 0px 0px'
     });
    $.map($(".header .commands") , function(item , index){ 
        $(".header-tab").eq(index).append(item);
    });

}

function hideShowBlocks(){
	if($("#region-pre").length > 0 ){
		$("#page").prepend("<div id='move-region' width= " + $("#region-pre").css("width") + "></div>");
		$("#move-region").on("click",function(){
			if(!($(this).hasClass("hidden-region"))){
                $("#move-region").addClass("hidden-region");
				$("#region-pre").animate({
			    	'left' : '-=' + $("#move-region").attr("width")
	        	},400,null);
	        	$("#region-main").animate({
			    	'margin-left' : "-=" + $("#move-region").attr("width")
	        	},400,null);
			}else{
                $("#move-region").removeClass("hidden-region");
				$("#region-pre").animate({
			    	'left' : "+=" +  $("#move-region").attr("width")
	        	},400, null);
	        	$("#region-main").animate({
			    	'margin-left' : "+=" + $("#move-region").attr("width")
	        	},400,null);
			}
		});
	}
	if($("#region-post").length > 0){
		$("#page").prepend("<div id='move-region-right' width=" + $("#region-post").css("width") + "></div>");
		$("#move-region-right").on("click",function(){
		if(!($(this).hasClass("hidden-region"))){
            $("#move-region-right").addClass("hidden-region");  
			$("#region-post").animate({
		    	'left' : '+=' + $("#move-region").attr("width")
        	},400,null);
        	$("#region-main").animate({
		    	'margin-right' : "-=" + $("#move-region-right").attr("width")
        	},400,null);
		}else{
            $("#move-region-right").removeClass("hidden-region");
			$("#region-post").animate({
		    	'left' : "-=" + $("#move-region-right").attr("width")
        	},400,null);
        	$("#region-main").animate({
		    	'margin-right' : "+=" + $("#move-region-right").attr("width")
        	},400,null);
		}

		});
	}
}


//Function to expand and shrink the question bank div. 
function expandBank(questionBank){
    questionBank.find('.header').first().find(".title").append("<span id = 'expand-bank' class='shrink'>expand</span>");
    var page = $('#page-mod-quiz-edit div.quizcontents');
    $('#expand-bank').on("click",function(){
            var $this = $(this);
            if($this.hasClass("shrink")){
                questionBank.animate({
                        'width' : '50%'
                    },300,null);
                page.animate({
                        'width' : '50%'
                            },300,null);

                $this.removeClass("shrink");
                $this.html("shrink");

            }else{
                questionBank.animate({
                        'width' : '30%'
                    },300,null);
                page.animate({
                        'width' : '70%'
                            },300,null);
                $this.addClass("shrink");
                $this.html("expand");
            }
        });
}

//Script to PIE project to add  CSS3 on IE                     
function apply_PIE(selector){
    $(function() {
	    if (window.PIE) {
		$(selector).each(function() {
			PIE.attach(this);
		    });
	    }
	});
}

function organize_block_summary(){
    var blockSummary = $('#inst2 .corner-box');
    if(blockSummary.find(".header").length == 0){
	var header = $('#region-post .header:first');
	var clon = header.clone();
	clon.find("h2").html("");
	blockSummary.prepend(clon);
    }

}


$('document').ready(function(){ 
	
	//Execute PIE for main objects                                                                                                                                               
	apply_PIE("#page , .images, #adminsearchquery,div.logininfo a.login" +
      "#custommenu .yui3-menu-horizontal .yui3-menu-content li a , h2.pretty");
	var regionPre = $('#region-pre');
	var regionPost = $('#region-post');
	organize_block_summary();
	if(regionPre.length != 0){
	    customizeMenu(regionPre,"pre");
	}
	if(regionPost.length != 0){
	    customizeMenu(regionPost,"post");        	
    }

    hideShowBlocks();

    if($(".questionbankwindow.block").length > 0){
		expandBank($(".questionbankwindow.block"));
    }

    if($("#custommenu .custom_menu_submenu").length > 0 ){
    	$("#custommenu .custom_menu_submenu").each(function(){
    		$this = $(this);
    		if($this.parents().length == 8 ){
    			$this.prepend("<div class='arrow-up'></div>");

    		}else{
    			$this.prepend("<div class='arrow-right'></div>");
    			$(".custom_menu_submenu .yui3-menu-content li").each(function(){
    				var item = $(this);
    				//alert(item.find("div.custom_menu_submenu").length);
    				if(item.find("div.custom_menu_submenu").length > 0){
    					item.on("hover",function(){
    						$(this).find("div.custom_menu_submenu .yui3-menu-content").css({
    							"position" : "absolute" ,
    							"left" : "8px" ,
    							"margin-top" : (parseInt($(this).css("height") + 20) * (-1)) + "px"
    						});

    					});
    				}
    			});
    		}
    	});
    }

    $('#page-header').prepend($('div.footer form.adminsearchform')); //add search form to the header page                                                                      
    $("#page-header form.adminsearchform input:regex(type,submit)").remove(); //remove search button                                                                                      
	$("#adminsearchquery").attr("placeholder","search"); //add placeholder to search input                                                                                           
    $('#region-post-box').prepend($('.blogsearchform')); //put blog search in a better position        
});

