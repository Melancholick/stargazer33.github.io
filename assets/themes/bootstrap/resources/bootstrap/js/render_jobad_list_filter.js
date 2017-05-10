/**
* Decorate tags from given array into html string, set of labeled tags.
* @param {array} tags; ex: row.tagsNames1, row.tags; 
* @return {string} rtTags, a sum decorated tags;
*/
function tagsDeco(tags) {
    var appendValue = "";
    var rtTags = "";
    for (i = 0; i < tags.length; i++) {
        appendValue = '<span class = "tag label label-primary labelTag">' + tags[i] + '</span>';
        rtTags = rtTags.concat(appendValue);
    }
    return rtTags;
}
/**
* Shows loading indicator while table is loading.
* if there is less than 50 elements to load, than there is no load indicator;
*/
function tableLoad() {
    if (($.grep(json_data, grepFunc)).length <= 50) {
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
    } else {
        $(".loader").show();
        $("#table").hide();
        $table = $('#table').bootstrapTable('load', $.grep(json_data, grepFunc));
        $(".loader").hide();
        $("#table").show();
    }
}
/**
* Main script, executes after page is ready.
*/
$(document).ready(function(){
    try {
/**
* Default filter for table.
*/
    var filterTag = ['REMOTE1_100'];
    $(".loader").hide();
/**
* Function that setups table. Look wenzhixin documentation for details.
*/
    $(function () {
        var $table = $('#table').bootstrapTable({data: json_data,
         smartDisplay:1,
         detailFormatter: detailFormatter,
         detailView: 1,
         showHeader: 0,
         columns: [{
            title: "",
            field: "title",
            class: "spanLink",
            formatter:titleFormatter
          }, {
            title: "",
            field: "published",
            class: "spanLink",
            formatter:publishedFormatter
          }]
        });
/**
* Greps data from json_data, for table.
* @param {json_data} item array from json_data; 
* @return {array} elements which tags are true to filtering tags, and will be shown in table;
*/
        grepFunc = function (item) {
/**
* Checks if element has filtered tags.
* @param {array} item.tags array with tags; 
* @return {boolean} true if every tag to filter are met in tags of element;
*/
            function hasTag(element) {
                return element == filterTag;
            }
            return item.tags.some(hasTag);
        };
/**
* Loading table with filtered by default data.
*/
        tableLoad();
    });
/**
* If requested URL has a #hash part, then we click on element which id=hash. 
*/
   var hash = window.location.hash.substr(1);
    if (!(hash == null)){
        setTimeout(function(){
            document.getElementById(hash).click();
        }, 100);
    }
/**
* Click on row = click to open detailed view
*/
    $("#table").on("click", "tr", function(){
        $(this).find(".detail-icon").trigger("click");
    });
} catch(err) {
console.log(err);
}
});
/**
* Formating data from json_data for detailed view of every row.
* for every key:value dictionaries of row it decorates and pushes strings to html.
*/
function detailFormatter(index, row) {
    var html = [];
    var sourceName  = "";
    var passUrl = "";
    html.push('<span class="detailFooter"></span> <div class="detailContent">');
    $.each(row, function (key, value) {
        if (key == "title"){
        } else if (key == "url") {
            passUrl = '<div class="row"><div class="col-xs-6">'+ '<a href="' + value + '">View original job desription <i class="fa fa-external-link" aria-hidden="true"></i></a>' +' </div><div class="col-xs-6 text-right">'+'<a href="#' + row.id + '">Get shareable link <i class="fa fa-link" aria-hidden="true"></i></a>'+'</div> </div>';
            html.push(passUrl);
        } else if (key == "content") {
            html.push('<p>' + value + '</p>' + passUrl + '</div><span class="detailFooter"></span>');
        } else if (key == "sourceName") {
            sourceName = value;
        } else {

        }
    });
    return html.join('');
}
/**
* Formater for published column.
* @param {string} value; value of item.published for this row;
* @var {string} publishedDay; split from value only the part with day and month;
* @return {string} decorated publishedDay;
*/
function publishedFormatter(value) {
    var publishedDay = value.split(",")[0];
    return '<p class="publishedDate">' + publishedDay + '</p>';
}
/**
* Formatter for title column.
* @param {dictionary} data; json_data;
* @param {dictionary} row; array of key:value dictionaries of item from json_data;
* @param {string} value; value of item.title for this row;
* @return {string} decorated labelTags;
*/
function titleFormatter(data, row, value) {
    var tagsNames1 = tagsDeco(row.tagsNames1);
    var tagsNames2 = tagsDeco(row.tagsNames2);
    var labelTags = tagsNames1 + tagsNames2;
    return '<a class="detail-icon" href="#"><i class="fa fa-plus-square-o iconStyle"></i></a> ' + row.title + '<br>' + labelTags;
}