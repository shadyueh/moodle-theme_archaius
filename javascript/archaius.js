/*  

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

This plugin is part of Archaius theme, if you use it outside the theme
you should create your own styles. You can use archaius stylesheet as
a example.

@copyright  2013 Daniel Munera Sanchez

*/

//I am using !function(){}(); because (function()()) has problem with
// Moodle javascript compression.
! function(window,$, undefined){

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
        regex = new RegExp(matchParams.join('')
                   .replace(/^\s+|\s+$/g,''), regexFlags);
        return regex.test($(elem)[attr.method](attr.property));
    }

    window.ArchaiusJSEffects = (function(){
        var ArchaiusJSEffectsInstance;

        var createArchaiusJSEffects = function(){
            var regionPost = $("#region-post");
            var regionPre = $("#region-pre"); 
            var regionCenterPre = $('#region-center-pre');
            var regionCenterPost = $('#region-center-post'); 
            var mediaQueries = Modernizr.mq('only all');

            var animateRegion = function(
                region,
                main,
                cssRuleRegion,
                cssRuleMain){

                region.velocity(cssRuleRegion,400,null);
                main.velocity(cssRuleMain ,400,null);

            }
            var hideShowBlocks = function(){
                var regionMain = $("#region-main");
                var reportRegionPre = $("#report-region-pre");
                if(reportRegionPre.length > 0){
                    var reportRegionContent =  
                        $(".report-page").find(".main-report-content");
                    $("#regions-control").append("<div id='move-region' class='move'></div>");
                    $("#move-region").on("click", { region : reportRegionPre ,
                    main : reportRegionContent },function(event){
                        var data = event.data;
                        if(!($(this).hasClass("hidden-region"))){
                            $("#move-region").addClass("hidden-region");
                            animateRegion(
                                reportRegionPre,
                                reportRegionContent,
                                {'margin-left':'-=220px'},
                                {'width':'100%'}
                            );
                        }else{
                            $("#move-region").removeClass("hidden-region");
                            animateRegion(
                                reportRegionPre,
                                reportRegionContent,
                                {'margin-left' : '+=220px'},
                                {'width' : '75%'}
                            );
                        }
                    });
                }
                if(regionPre.length > 0 ){
                    $("#regions-control").append("<div id='move-region' class='move'></div>");
                    $("#move-region").on("click", function(){
                        var $this = $(this);
                        if(!($(this).hasClass("hidden-region"))){
                            $this.addClass("hidden-region");
                            animateRegion(
                                regionPre,
                                regionMain,
                                {'left' : '-=200px'},
                                {'margin-left' :'-=200px'}
                            );
                        }else{
                            $this.removeClass("hidden-region");
                            animateRegion(
                                regionPre,
                                regionMain,
                                {'left':'+=200px'},
                                {'margin-left':'+=200'}
                            );
                        }
                    });
                }
                if(regionPost.length > 0){
                    $("#regions-control")
                        .append("<div id='move-region-right' class='move'></div>");
                    $("#move-region-right").on("click",function(){
                        var $this = $(this);
                        if(!($this.hasClass("hidden-region"))){
                            $this.addClass("hidden-region");  
                            animateRegion(
                                regionPost,
                                regionMain,
                                {'left':'+=200px'},
                                {'margin-right' : '-=200px'}
                            );
                        }else{
                            $this.removeClass("hidden-region");
                            animateRegion(
                                regionPost,
                                regionMain,
                                {'left' : '-=200px'},
                                {'margin-right' : '+=200px'}
                            );
                        }
                    });
                } 
            };
                
            var topicsCourseMenu = function(active){
                var topics = $('ul.topics'); //unordered list of topics.  
                var editing = $('div.commands').length > 0;            
                //Verify if we are in the man view of chapters.                                                                                                                               
                if(($("div.summary").length > 2) && (topics.length != 0)
                    && active != 0 && !(editing)){

                    // course sections.                                                                         
                    var sections = topics.find('li.section.main');
                    var tabSelector = "h3.sectionname";
                    if(topics.find(tabSelector).length != topics.find("li.section.main").length ){
                        sections.each(function(index){
                                $this = $(this);
                                if($this.find("h3.sectionname").length == 0){
                                    $this.find("div.summary").prepend(
                                        "<h3 class='sectionname'> Topic " + index  + "</h3>");
                                }

                            });
                    }
                    var topicTab = topics.find(tabSelector);
                    topicTab
                        .addClass("topic-tab")
                        .removeClass("accesshide"); //this hide first tab when it doesnt have title
                    topicTab.prepend("<span class='triangle'></span>");
                    //update the sections variable after prepend the first section.                                                                                                                   
                    sections = topics.find('li.section.main');
                    //put each summary as a tab (outside of the container).                                                                                                                           
                    sections.each(function(){$(this).before($(this).find(tabSelector))});
                    topicTab.bind("click", function(){
                            var content = $(this).next();
                            if($(this).hasClass("current")){
                                $(this).removeClass("current");
                                content.slideUp();
                            } else {
                                $(this).addClass("current");
                                content.slideDown();
                            }
                        });
                }else if(active == false){
                        topics.find('li.section.main').show();
                }else{
                    //If there is only one topic, display it.                                                                                                                                         
                    $("li.section.main").css("display","block");
                }
            };

            var expandBank = function(questionBank){
                var viewPortWidth = $(window).width();
                if(viewPortWidth <= 768){
                    $("#quizcontentsblock").after($('.questionbankwindow.block'));
                }else{
                    questionBank.find('.header').first().find(".title")
                    .append("<a id = 'expand-bank' class='shrink"+
                    " btn-warning btn pretty-link-button'>expand</input>");
                    var page = $('#page-mod-quiz-edit div.quizcontents');
                    $('#expand-bank').on("click",function(){
                        var $this = $(this);
                        if($this.hasClass("shrink")){
                            $this.removeClass("shrink");
                            $this.html("shrink");
                            animateRegion(
                                questionBank,
                                page,
                                {'width' : '50%'},
                                {'width' : '50%'}
                            );
                        }else{
                            $this.addClass("shrink");
                            $this.html("expand");
                            animateRegion(
                                questionBank,
                                page,
                                {'width' : '30%'},
                                {'width' : '70%'}
                            );
                        }
                    });
                }
            };
            var organizeBlockSummary = function(){
                var blockSummary = $('#inst2');
                if(blockSummary.prev(".header-tab").length == 0){
                    var header = $('#region-post .header-tab:first');
                    var clon = header.clone();
                    clon.find("h2").html("");
                    blockSummary.before(clon);
                }
            };    
            var organizeRegionCenter = function(region){
                if((region.length != 0) && ($(".commands").length == 0)){
                    region.find(".header-tab").on("click",function(){
                        $(this).next().slideToggle( "slow");
                    });              
                }else{
                    region.find(".commands").each(function(){
                        $(this).appendTo($(this).parent().parent().parent().prev());
                    });
                    region.find("div:regex(id,inst)").show();
                }    
            };

            var startSlideShow = function(activatePausePlay,slideshowTimeout){
                var pausePlay = parseInt(activatePausePlay);
                if((".rslides").length > 0){
                    var options = {
                        'auto' : true,
                        'speed' : 800,
                        'timeout' : (slideshowTimeout + 800),
                        'pausePlay' : pausePlay,
                        'pager' : true,
                        'nav' : true,
                        'maxwidth' : 'auto',
                        'namespace' : "large-btns",
                        'callback' : function(){ 
                            $(".rslides_container").addClass("ready");
                        }
                    }
                    $(".rslides").responsiveSlides(options);
                }
            };

            var initSlideshow = 
                function(activatePausePlay, slideshowTimeout, confirmationDeleteSlide,noSlides){
                    startSlideShow(activatePausePlay,slideshowTimeout);
                    $("#toggle-admin-menu").on("click",function(){
                        $(this).next().slideToggle();
                    });
                    //Delete slideshow using AJAX to avoid page reload.
                    $(".delete-slide").on("click",function(event){
                        event.preventDefault();
                        $this = $(this);
                        if(confirm(confirmationDeleteSlide)){
                            var url = $this.attr("href") + "&ajax=1";
                            $.get(url , function(data) {
                                $(".rslides_container").html("");
                                $('.rslides_container').html(data);
                                startSlideShow(activatePausePlay,slideshowTimeout);
                                var index = $(".delete-slide").index($this);
                                var slidesTable = $(".admin-options table"); 
                                if(slidesTable.find("tr").length > 2){
                                    $this.closest("tr").remove();
                                }else{
                                    slidesTable.remove();
                                    $(".admin-options").append("<h2>" + noSlides +"</h2>");
                                }
                                $(".admin-options .notice").show().html("<p>Slide deleted</p>")
                                    .delay( 1000 ).fadeOut('slow');
                            });
                        }
                    });
            };

            var getDistanceToParent = function(item,parentSelector,KingOfParent){
                return item.parents(KingOfParent).length;
            };
            var checkOnResize = function(){
                var viewPortWidth = $(window).width();
                var mobileCustommenu = $("#mobile-custommenu");
                var pageHeader = $("#page-header");
                if(viewPortWidth <= 768){
                    if(mediaQueries == false){
                        $("html").addClass("no-media-queries");
                    }
                    $("#custommenu").addClass("collapsed");
                    if(mobileCustommenu.length == 0 ){
                        pageHeader.append("<nav id='mobile-custommenu' class='collapsed'></nav>"); 
                        
                        $(".wrapper-header-info").append("<div class='menu-icon deactive'></div>");
                        if($("#custommenu").length > 0){
                            var items = $("#custommenu ul li a");
                            var clonedItems = items.clone();
                            $.each(items,function(index){
                                var $this = $(this);
                                var hierarchy = getDistanceToParent($this,"custommenu","div");
                                //Coefficient to calculate the hierarchy of 
                                //menu items is 4 (minimum number of elements to the parent element)
                                if(hierarchy > 4){
                                    var hierarchyLevel = (hierarchy - 4) / 2;
                                    var hierarchyLine = "";
                                    for(var i=0;i<hierarchyLevel;i++){
                                        hierarchyLine += "- ";    
                                    }
                                    var content = hierarchyLine.concat(" ",$this.text());
                                    clonedItems.eq(index).text(content);
                                }
                                clonedItems.eq(index).removeClass();
                            });
                            $("#mobile-custommenu").append(clonedItems);  
                        }
                    }else{
                        pageHeader.find(".menu-icon").show();
                    }
                }else{
                    if(mediaQueries == false){
                        $("html").removeClass("no-media-queries");
                    }
                    $("#custommenu").removeClass("collapsed");
                    mobileCustommenu.hide();
                    pageHeader.find(".menu-icon").hide();
                    mobileCustommenu.addClass("collapsed");
                }
                return viewPortWidth;   
            };
            var initEffects = function(){
                organizeRegionCenter(regionCenterPre);
                organizeRegionCenter(regionCenterPost);
                organizeBlockSummary();

                if(regionPre.length != 0){
                        regionPre.archaiusCustomBlocks();
                }
                if(regionPost.length != 0 ){
                    regionPost.archaiusCustomBlocks({regionLocation: "post"});
                }
                if($("#report-region-pre").length > 0){   
                    $("#report-region-pre").archaiusCustomBlocks();
                }
                var questionBank = $(".questionbankwindow.block");
                if(questionBank.length > 0 && !(questionBank.hasClass("collapsed"))){
                    expandBank($(".questionbankwindow.block"));
                }
                //add search form to the header page
                $('.page-header-top div.top-inner').prepend($('div.footer form.adminsearchform')); 
                //remove search button                                   
                $("#page-header form.adminsearchform input:regex(type,submit)").remove(); 
                $('#region-post-box').prepend($('.blogsearchform'));

                var windowSize = checkOnResize();
                if(windowSize >= 768 ){
                    $("#custommenu").removeClass("collapsed");
                }
                $("#page-header").on("click",".menu-icon",function(){
                    var $this = $(this);
                    if($this.hasClass("deactive")){
                        $this.removeClass("deactive");
                        $this.addClass("active");
                    }else{
                        $this.removeClass("active");
                        $this.addClass("deactive");
                    }
                    $("#mobile-custommenu").slideToggle();
                });  

                if($("#custommenu").length > 0 || $("div.langmenu").length > 0){
                    $(window).resize(function() {
                        //resize just happened, pixels changed
                        checkOnResize();
                    });    
                }
            };
            return {
                    hideShowBlocks: hideShowBlocks,
                    topicsCourseMenu : topicsCourseMenu,
                    initSlideshow :  initSlideshow,
                    initEffects: initEffects 
            };
        };

        return {        
            getInstance: function(){
            if(!ArchaiusJSEffectsInstance){
                    ArchaiusJSEffectsInstance = createArchaiusJSEffects(); 
            }
            return ArchaiusJSEffectsInstance;
            }
        };

    })();
}(window,jQuery);

ArchaiusJSEffects.getInstance().initEffects();