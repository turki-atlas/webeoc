// Author : Alharith
// Date : 05 may 2019
// Usage : to define common functions that used in most of pages 

// Add Outer HTML to JQUERY
jQuery.fn.outerHTML = function(s) {
    return s ?
        this.before(s).remove() :
        jQuery("<p>").append(this.eq(0).clone()).html();
};

jQuery.extend(jQuery.expr[':'], {
    focusable: function(el, index, selector) {
        return $(el).is('a, button, :input, [tabindex]');
    }
});



$(document).ready(function() {
    $(window).keydown(function(event) {

        var element = event.target.nodeName.toLowerCase();
        if ((event.keyCode == 13) && element != 'textarea') {
            event.preventDefault();
            // Get all focusable elements on the page
            var $canfocus = $(':focusable');
            var index = $canfocus.index(document.activeElement) + 1;
            if (index >= $canfocus.length) index = 0;
            $canfocus.eq(index).focus();
        }
    });
});


// Events Area 
$(document).ready(function() {

    $(".cMetroCallFromBoads").click(function(e) {
        var currentMenuTitle = $(this).data("pagetitle");
        var originalMenuItem = $(window.parent.parent.document).find('[role*="menuitem"]').find("span:contains('" + currentMenuTitle + "')").filter(function() {
            return $(this).text() === currentMenuTitle ? true : false;
        });
        if (originalMenuItem.length > 0) {
            $(originalMenuItem).click();
        }
        //$(window.parent.parent.document).find('[role*="menuitem"]').find("span:contains('"+currentMenuTitle+"')").parents('[role*="menuitem"]').click();
    });
    $("a.cMetroCallFromBoadsNewWindow").click(function(e) {
        var currentClass = $(this).attr("class");
        var currentMenuTitle = $(this).data("pagetitle");
        var originalMenuItem = $(window.parent.parent.document).find('[role*="menuitem"]').find("span:contains('" + currentMenuTitle + "')");
        if (originalMenuItem.length > 0) {
            if (currentClass.indexOf('transform') < 0) {
                originalMenuItem.parent().parent().find('[title="New Window"]').find("i").click();
            }
        }
    });

    $(".cKPI").click(function(e) {
        var currentMenuTitle = $(this).find("h5.title").data("view");
        var originalMenuItem = $(window.parent.parent.document).find('[title*="' + currentMenuTitle + '"]');
        if (originalMenuItem.length > 0) {
            $(originalMenuItem).find("a")[0].click();
        }
    });
    $(".tableDataGrid tr td:not(:last-child)").click(function() {
        if ($(this).children('a').length == 0) {
            $(this).parent().find(".columnButton").click();
        }
    });
    // Custome Close button to avoid missing Add The Close Button for LightBox 
    if ($(parent.parent.document).find(".lightboxcontainer").length > 0) {
        var closeButton = $('<button class="btn btn-danger cLightBoxClose"><i class="fas fa-times-circle"></i></button>').attr("onclick", "parent.pageBoard.BoardMgr.CloseDialog();");
        $(parent.parent.document).find(".lightboxcontainer").append(closeButton);
    }

    $("[id*=searchfield]").attr("placeholder", "بحث");

    //$(".cDatePicker").attr("type", "date");
    $(".cDatePicker").each(function() {
        var currentValue = $(this).val();
        currentValue = currentValue.split(" ")[0];
        var allDate = currentValue.split('/');
        currentValue = allDate[2] + "-" + allDate[0] + "-" + allDate[1];
        $(this).attr("type", "date");
        $(this).val(currentValue);
    });

    intitialzeAdvancedFilter();
    IntializeSearch();
    InitializeSectionCollapse();
    //Initialize ToolTips
    $('[data-toggle="tooltip"]').tooltip();
    $(".numeric").attr("type", "number");

});

function IntializeSearch() {

    $("#bSearch").click(function() {
        sys_SearchFilter.applySearch();
    });
    $("#bClearSearch").click(function() {
        sys_SearchFilter.clearAllInputs();
    });

}

function intitialzeAdvancedFilter() {
    // Advanced Filters
    $(".cAdvancedFiter span").click(function() {
        ShowAgencyLoading("body");
        $(this).parent().find("button").click();
    });
    $(".cAdvancedFiter .cActiveFilter").each(function() {
        var current = $(this);
        current.parent().parent().find("span").append("&nbsp;").append(current);
    });

}

function InitializeSectionCollapse() {
    $(".SectionCollapse > .CollapseButton").click(function() {
        var currentButton = $(this);
        if (currentButton.parent().hasClass("active")) {
            currentButton.parent().removeClass("active");
            currentButton.parent().find(".form-row").slideUp(200);
        } else {
            currentButton.parent().addClass("active");
            currentButton.parent().find(".form-row").slideDown(200);
        }
    });
}

function AjaxGet(varURL, varData, OnSuccess, OnError) {
    $.ajax({
        url: varURL,
        dataType: "json",
        type: "GET",
        contentType: 'application/json; charset=utf-8',
        data: varData,
        async: true,
        processData: false,
        cache: false,
        success: OnSuccess,
        error: OnError
    });
}

// WebEoc Functions 

function getData(BoardName, DisplayName, OnSuccess) {
    $.ajax({
        async: true,
        contentType: 'application/json',
        type: 'GET',
        success: OnSuccess,
        url: '../api/rest.svc/board/' + BoardName + '/display/' + DisplayName,
        error: function() {
            hidegencyLoading();
        }
    });
}

function getFilterdData(BoardName, DisplayNamer, AndOr, Items, viewFilters, OnSuccess, OnError, IsAsync) {
    $.ajax({
        async: IsAsync ? IsAsync : true,
        contentType: 'application/json',
        data: JSON.stringify({
            customFilter: {
                viewFilters: viewFilters,
                boolean: AndOr,
                items: Items
            }
        }),
        success: OnSuccess,
        type: (AndOr == null ? 'Get' : 'Post'),
        url: '../api/rest.svc/board/' + BoardName + '/display/' + DisplayNamer
    });
}

function getDataWithPagination(BoardName, DisplayName, AndOr, Items, viewFilters, PageNumber, OnSuccess, NoOfPages) {
    $.ajax({
        headers: { 'X-Paging-PageSize': NoOfPages ? NoOfPages : '100' },
        async: true,
        contentType: 'application/json',
        data: AndOr == null ? null : JSON.stringify({
            customFilter: {
                viewFilters: viewFilters,
                boolean: AndOr,
                items: Items
            }
        }),
        success: OnSuccess,
        type: (AndOr == null ? 'Get' : 'Post'),
        url: '../api/rest.svc/board/' + BoardName + '/display/' + DisplayName + '/page/' + PageNumber

    });
}

function UpdateRecord(BoardName, InputName, dataid, dataObject, OnSuccess, OnError, IsAsync) {
    $.ajax({
        async: IsAsync ? IsAsync : true,
        contentType: 'application/json',
        data: JSON.stringify({ 'data': JSON.stringify(dataObject) }),
        type: 'POST',
        url: '../api/rest.svc/board/' + BoardName + '/input/' + InputName + (dataid != null ? '/' + dataid : ""),
        success: OnSuccess,
        error: OnError
    });
}

function SaveFile(BoardName, InputName, dataid, FieldName, File, OnSuccess, OnError) {
    var formData = new FormData();
    formData.append('attachmentFileData', File, File.name);
    $.ajax({
        contentType: false,
        data: formData,
        processData: false,
        type: 'POST',
        url: '../api/rest.svc/board/' + BoardName + '/input/' + InputName + '/' + dataid + "/attachments/" + FieldName,
        success: OnSuccess,
        error: OnError
    });
}

function GetDataByID(BoardName, DisplayName, dataid, OnSuccess) {
    $.ajax({
        async: false,
        contentType: 'application/json',
        success: OnSuccess,
        type: 'Get',
        url: '../api/rest.svc/board/' + BoardName + '/display/' + DisplayName + '/' + dataid
    });
}

// End WebEOC Functions

function LeftPad(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}

// Stop Watch 
var Stopwatch = function(elem, options) {
    //var timer = createTimer(),

    var offset,
        clock,
        interval;

    // default options
    options = options || {};
    this.delay = options.delay || 1000;
    this.Interval = options.Interval;
    this.IntervalAction = options.IntervalAction;
    // append elements     
    //elem.append(timer);

    // initialize
    reset();

    // private functions
    //function createTimer() {
    //  return document.createElement("span");
    // }

    function createButton(action, handler) {
        var a = document.createElement("a");
        a.href = "#" + action;
        a.innerHTML = action;
        a.addEventListener("click", function(event) {
            handler();
            event.preventDefault();
        });
        return a;
    }

    function start() {
        if (!interval) {
            offset = Date.now();
            interval = setInterval(update, this.delay);
        }
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    function reset() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        clock = 0;
        render(0);
    }

    function update() {
        clock += delta();
        render();
    }

    function render() {
        if (this.Interval) {
            if (parseInt(clock / 1000) % this.Interval == 0 && parseInt(clock / 1000) != 0) {
                this.IntervalAction();
            }
        }
        var Time = parseInt(clock / 1000);
        /////ddd
        var Hours = Math.floor(Time / 3600);
        var Minutes = Math.floor((Time - (Hours * 3600)) / 60);
        var Seconds = Time - (Hours * 3600) - (Minutes * 60);
        /////
        elem.find("#Hours").html(LeftPad(Hours, '0', 2));
        elem.find("#Minutes").html(LeftPad(Minutes, '0', 2));
        elem.find("#Seconds").html(LeftPad(Seconds, '0', 2));
    }

    function delta() {
        var now = Date.now(),
            d = now - offset;

        offset = now;
        return d;
    }

    // public API
    this.Start = start;
    this.Stop = stop;
    this.Reset = reset;
    return this;
};
//

function updateClockDisplay(selectedDate) {

    var currentDate = selectedDate;
    updateInternally();

    function updateInternally() {
        if ($('.cTimeContainer')) {
            currentDate.setSeconds(currentDate.getSeconds() + 1);
            document.getElementById('clock').innerHTML = formatDate(currentDate);
            setTimeout(updateInternally, 1000);
        }
    }
}

function formatDate(date) {
    var dayOfWeek;
    var monthName;

    switch (date.getDay()) {
        case 0:
            dayOfWeek = "الأحد";
            break;
        case 1:
            dayOfWeek = "الإثنين";
            break;
        case 2:
            dayOfWeek = "الثلاثاء";
            break;
        case 3:
            dayOfWeek = "الأربعاء";
            break;
        case 4:
            dayOfWeek = "الخميس";
            break;
        case 5:
            dayOfWeek = "الجمعة";
            break;
        case 6:
            dayOfWeek = "السبت";
            break;
    }

    switch (date.getMonth()) {
        case 0:
            monthName = "يناير";
            break;
        case 1:
            monthName = "فبراير";
            break;
        case 2:
            monthName = "مارس";
            break;
        case 3:
            monthName = "ابريل";
            break;
        case 4:
            monthName = "مايو";
            break;
        case 5:
            monthName = "يونيو";
            break;
        case 6:
            monthName = "يوليو";
            break;
        case 7:
            monthName = "اغسطس";
            break;
        case 8:
            monthName = "سبتمبر";
            break;
        case 9:
            monthName = "اكتوبر";
            break;
        case 10:
            monthName = "نوفمبر";
            break;
        case 11:
            monthName = "ديسمبر";
            break;
    }
    document.getElementById('dt').innerHTML = date.getDate() + " " + monthName + " " + date.getFullYear();
    document.getElementById('da').innerHTML = dayOfWeek;
    document.getElementById('time').innerHTML = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2);


    return dayOfWeek + ", " +
        date.getDate() + " " +
        monthName + " " +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
}

function getElapsedTime(FromDate, CurrentDate) {
    // get total seconds between the times
    var delta = Math.abs(FromDate - CurrentDate) / 1000;
    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    var seconds = delta % 60; // in theory the modulus is not required

    return { "Days": days, "Hours": hours, "Minutes": minutes, "Seconds": seconds }
}
// to Read Specific Query String Value 
function getQuerystring(key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
}
//END
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}

function downloadFile(fileData, fileName) {
    var a = document.createElement('a');
    a.download = fileName;
    a.href = fileData;
    a.dataset.downloadurl = [a.download, a.href].join(':');
    a.click();
}

function scrollToDiv(divID) {
    $('html, body').animate({
        scrollTop: $("#" + divID).offset().top
    }, 1000);
}
const getSumOfArray = arr => arr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);

function ShowAgencyLoading(containerString) {
    $(containerString).append('<div class="AgencyLoading"><div><img src="AtlasSuit/Images/imgLogoSmall.png" class="SpinImage"/><p>الرجاء الانتظار</p></div></div>');
}

function hidegencyLoading() {
    $(".AgencyLoading").remove();
}

function buildLocationDropDowns() {
    if ($("#dAllAreas").html() != "") {
        var jsonAllAreas = JSON.parse($("#dAllAreas").html());
        var AllEmirates = jsonAllAreas.reduce(function(result, current) {
            result[current.Emirate] = result[current.Emirate] || [];
            result[current.Emirate].push(current);
            return result;
        }, {});
        $.each(AllEmirates, function(key, value) {
            $("#sEmirate").append($('<option/>').text(key).val(key));
        });

        // Filter Areas
        $("#sEmirate").change(function() {
            $("#sArea").empty();
            $("#sArea").append($('<option>--اختر--</option>'));
            var filterdAreas = $.grep(jsonAllAreas, function(v) {
                return v.Emirate === $("#sEmirate").val();
            });
            var allAreas = filterdAreas.reduce(function(result, current) {
                result[current.AreaName] = result[current.AreaName] || [];
                result[current.AreaName].push(current);
                return result;
            }, {});

            $.each(allAreas, function(key, value) {
                $("#sArea").append($('<option/>').text(key).val(key));
            });
        });



        // Filter Places
        $("#sArea").change(function() {
            $("#sPlace").empty();
            $("#sPlace").append($('<option>--اختر--</option>'));
            var filerdPlaces = $.grep(jsonAllAreas, function(v) {
                return v.Emirate === $("#sEmirate").val() &&
                    v.AreaName === $("#sArea").val();
            });

            var allPlaces = filerdPlaces.reduce(function(result, current) {
                result[current.PlaceArabicName] = result[current.PlaceArabicName] || [];
                result[current.PlaceArabicName].push(current);
                return result;
            }, {});

            $.each(allPlaces, function(key, value) {
                $("#sPlace").append($('<option/>').text(key).val(key));
            });

        });
        // Filter LandMarks
        $("#sPlace").change(function() {
            $("#sLandMark").empty();
            $("#sLandMark").append($('<option>--اختر--</option>'));
            var filerdLandmarks = $.grep(jsonAllAreas, function(v) {
                return v.Emirate === $("#sEmirate").val() &&
                    v.AreaName === $("#sArea").val() &&
                    v.PlaceArabicName === $("#sPlace").val();
            });

            $.each(filerdLandmarks, function(key, value) {
                $("#sLandMark").append($('<option/>').text(value.LandmarkName).val(value.LandmarkName).data("latitude", value.Latitude).data("longitude", value.Longitude));
            });

        });

        // Select on Map
        $("#sLandMark").change(function() {
            var selectedItem = $("option:selected", this);
            $("[name=SelectedLocation]").val("POINT(" + selectedItem.data("longitude") + " " + selectedItem.data("latitude") + ")");
            $("[name=latitude]").val(selectedItem.data("latitude"));
            $("[name=longitude]").val(selectedItem.data("longitude"));
        });

        // Fill Saved Values //
        if ($("#sEmirate").val() != "") {
            var currentEmirate = $("#sEmirate").val();
            var currentArea = $("#sArea").val();
            var currentPlace = $("#sPlace").val();
            var currentLandMark = $("#sLandMark").val();

            $("#sEmirate [selected=yes]").remove();
            $("#sEmirate").val(currentEmirate);
            $("#sEmirate").change();

            $("#sArea").val(currentArea);
            $("#sArea").change();

            $("#sPlace").val(currentPlace);
            $("#sPlace").change();

            $("#sLandMark").val(currentLandMark);
        }

    }
}

// New Organisation Chart 
$.fn.SOrgChartDisplay = function(ChartOptions) {
    var CurrentObject = $(this);
    var ItemTemplate = '<div class="OrgItem"><div class="OrgItemContainer"  data-id="{ID}" ><i class="fas fa-caret-left IconCollapse" data-id="{ID}" data-level="{TreeLevel}"></i><span>{ItemName}</span>{Buttons}</div><div class="OrgSons"></div></div>';
    var Buttons = ''
    ItemTemplate = ItemTemplate.replace("{Buttons}", Buttons);

    var Data = ChartOptions.Data;
    CurrentObject.addClass("SOrgChart");
    if (CurrentObject.data("direction") == "RTL") {
        CurrentObject.addClass("RTL")
    }
    //console.log(Data);
    if (Data) {
        $(Data).each(function(CurrentRowIndex, CurrentRow) {

            var parentIndex = Data.findIndex(function(element) {
                return element.HRDepartmentID == CurrentRow.HRDepartmentParentID;
            });

            //console.log(parentIndex);

            if (parentIndex == -1) {
                var CurrentItem = ItemTemplate.replace("{ItemName}", CurrentRow.DepartmentNameAR).replace(/{ID}/g, CurrentRow.HRDepartmentID).replace("{TreeLevel}", 1);
                CurrentObject.append(CurrentItem);
                //return false;
            }
        });
    }

    // Events 
    // Expand 
    $(CurrentObject).on("click", ".IconCollapse", function(Event) {

        Event.stopPropagation();
        // Filter The Data 
        var CurrentButton = $(this);
        var TreeLevel = parseInt(CurrentButton.data("level")) + 1;
        var ThisItem = CurrentButton.parent().parent().find(".OrgSons");
        if (CurrentButton.hasClass("fa-caret-left")) {
            CurrentButton.removeClass("fa-caret-left");
            CurrentButton.addClass("fa-caret-down");
        } else {
            CurrentButton.removeClass("fa-caret-down");
            CurrentButton.addClass("fa-caret-left");
            ThisItem.empty();
            return;
        }



        ThisItem.attr("style", "padding-right:" + (TreeLevel + 40) + "px");
        ThisItem.empty();
        var DataSons = $.grep(Data, function(v) {
            return v.HRDepartmentParentID === CurrentButton.data("id");
        });
        $(DataSons).each(function(CurrentRowIndex, CurrentRow) {
            var CurrentItem = ItemTemplate.replace("{ItemName}", CurrentRow.DepartmentNameAR).replace(/{ID}/g, CurrentRow.HRDepartmentID).replace("{TreeLevel}", TreeLevel);
            ThisItem.append(CurrentItem);

            // check if Sons Exists // 
            var SonIndex = Data.findIndex(function(element) {
                return element.HRDepartmentParentID == CurrentRow.HRDepartmentID;
            });
            if (SonIndex == -1) {
                ThisItem.find(".IconCollapse[data-id=" + CurrentRow.HRDepartmentID + "]").hide();
            }
        });
    });

    // Click on Item
    $(CurrentObject).on("click", ".OrgItemContainer", function() {
        var SelectedID = $(this).data("id");
        var SelectedIndex = Data.findIndex(function(element) {
            return element.HRDepartmentID == SelectedID;
        });

        ChartOptions.OnItemClick(Data[SelectedIndex]);

    });

}

function buildOrganistionChart(callBack) {
    var AllBuildings = [];
    if ($("#dAllBuilding").html() != "" && $("#dAllBuilding").html() != null) {
        AllBuildings = JSON.parse($("#dAllBuilding").html());
        $("#Building").append($('<option></option>').text("المــبــنـــى").val(""));
        fillBuildings();
    }

    getData('Organisation Structure', 'Department Display Rest - User', ShowItems);

    $("[name=OrgUnit] , [name=OrgUnitName] , #bSearchOrg").click(function() {
        $('#modelSelectOrgUnit').modal('show');
    });

    function ShowItems(Departments) {
        $("#divTreeHolder").SOrgChartDisplay({ Data: Departments, OnItemClick: OnItemClick });
    }

    function OnItemClick(SelectedItem) {
        $("[name=OrgUnit]").val(SelectedItem.HRDepartmentID);
        $("[name=OrgUnitName]").val(SelectedItem.DepartmentNameAR);
        $("[name=Hierarchy]").val(SelectedItem.Hierarchy);
        $('#modelSelectOrgUnit').modal('hide');
        // Check if there is Building Drop Down then fill it/Depending on Sector
        fillBuildings();

        if (callBack) {
            callBack(SelectedItem);
        }
    }

    function fillBuildings() {
        if ($("#Building").length > 0) {
            $("#Building").empty();
            $("#Building").append($('<option></option>').text("المــبــنـــى").val(""));
            //console.log(AllBuildings);
            var filteredBuildings = AllBuildings.filter(function(arrItem) {
                return arrItem.OrgUnit == $("[name=OrgUnit]").val();
            });
            $.each(filteredBuildings, function(Index, Building) {
                /// $("#Building").val($("#sBuilding").html());
                var IsSelected = false;
                if ($("#sBuilding").html() == Building.BuildingID) {
                    IsSelected = true;
                }

                $("#Building").append($("<option></option>")
                    .text(Building.BuildingName)
                    .val(Building.BuildingID)
                    .attr("data-latitude", Building.latitude)
                    .attr("data-longitude", Building.longitude)
                    .prop("selected", true)
                );
            });
        }
    }

    $('#modelSelectOrgUnit').on('show.bs.modal', function(e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog modal-lg animate__animated animate__zoomInDown');
    });
    $('#modelSelectOrgUnit').on('hide.bs.modal', function(e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog modal-lg animate__animated animate__zoomOutDown');
    });
}

function buildOrganistionChartFilter(callBack) {
    $("#divTreeHolder").empty();
    getData('Organisation Structure', 'Department Display Rest - User', ShowItems);

    $("#bSearchOrgUnit").click(function() {
        $('#modelSelectOrgUnit').modal('show');
    });

    $("#bClearSearchOrgUnit").click(function() {
        $('#OrgUnitFilter input[type="text"]').val('');
        sys_SearchFilter.applySearch();
    });

    if ($('#OrgUnitFilter input[type="text"]').val() != '') {
        $("#bSearchOrgUnit").addClass("pulse");
        $("#bSearchOrgUnit").attr("data-original-title", "فلترة حسب الوحدة التنظيمية - مطبق");
        $("#bClearSearchOrgUnit").show();
    } else {
        $("#bClearSearchOrgUnit").hide();
    }
    $('[data-toggle="tooltip"]').tooltip();

    function ShowItems(Departments) {
        $("#divTreeHolder").SOrgChartDisplay({ Data: Departments, OnItemClick: OnItemClick });
    }

    function OnItemClick(SelectedItem) {
        $('#OrgUnitFilter input[type="text"]').val('%||' + SelectedItem.HRDepartmentID + '||%');
        sys_SearchFilter.applySearch();
        $('#modelSelectOrgUnit').modal('hide');
        if (callBack) {
            callBack(SelectedItem);
        }
    }

    function percentage(percent, total) {
        return (percent / 100) * total;
    }

    function openDetailPanelX(panelId) {
        var windowWwidth = $(window).width();
        var percentResult = percentage(35, windowWwidth) + 'px';
        // show the panel
        $('#' + panelId)
            .addClass(panelId + '-open')
            .css({ flex: '1 0 ' + percentResult });
    }

    $('#modelSelectOrgUnit').on('show.bs.modal', function(e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog modal-lg animate__animated animate__zoomInDown');
    });
    $('#modelSelectOrgUnit').on('hide.bs.modal', function(e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog modal-lg animate__animated animate__zoomOutDown');
    });
}