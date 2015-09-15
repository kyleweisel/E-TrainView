var REFRESH_TIMEOUT_MS = 15000;

function pad(a,b){return(1e15+a+"").slice(-b)}

function loadTrainData() {

  var date = new Date();
  var dateString = date.getFullYear() + "-" + (pad(date.getMonth()+1, 2)) + "-" + pad(date.getDate(), 2) + " at " + date.getHours() + ":" + pad(date.getMinutes(), 2);
  var textStaticData1 = "<table><tr><td>Train No.</td><td >Route</td><td>Service</td><!--<td>Last Pos.</td>--><td>Next Station</td><td>Status</td></tr><tr><td class=\"center\" colspan=\"5\">Location data provided by SEPTA.  All trains operate via Philadelphia.  Valid as of " + dateString + ".</td></tr>";
  var textStaticData2 = "</table>";
  var textDynamicData = "";
  $.ajax({
      url: 'http://www3.septa.org/hackathon/TrainView/',
      dataType: 'jsonp',
      success: function(response){
          var len = response.length;
          for(var i=0;i<len;i++){
              jsonData = response[i];
              var minsLate = parseInt(jsonData.late);
              var fixedService = (jsonData.service == "LOCAL" ? "local" : jsonData.service);
              fixedService = fixedService.charAt(0).toUpperCase() + fixedService.slice(1);
              var status = (parseInt(jsonData.late) == 0 ? "On Time" : jsonData.late + "m late");
              var cellClass = "";
              if (minsLate < 2) {
                cellClass = "green";
              }
              if (minsLate >= 2) {
                cellClass = "orange";
              }
              if (minsLate >= 10) {
                cellClass = "red";
              }

              textDynamicData += "<tr><td class=\"center\">" + jsonData.trainno + "</td><td>" +  jsonData.SOURCE + " to " + jsonData.dest + "</td><td class=\"center\">" + fixedService + "</td><!--<td>" + jsonData.lat + ", " + jsonData.lon + "</td>--><td class=\"center\">" + jsonData.nextstop + "</td><td class=\"" + cellClass + " center\">" + status + "</td></tr>";
            }
          $('#trainViewTableWrapper').html(textStaticData1 + textDynamicData + textStaticData2);
      }
  });
  setTimeout(function(){loadTrainData()}, REFRESH_TIMEOUT_MS);
}
