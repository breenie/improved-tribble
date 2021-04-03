// Multiple class attributes on table data elements
// Using slim jquery (doesn't include $.ajax)

$(document).ready(() => {
  $("td.padding").on("click", e => {
    selectInvestor($(e.currentTarget).attr("id").split("-").pop());
  });
});

function updateMatches() {
  //console.log("Updating");
  $("html, body").css("cursor", "wait");
  var rules = [];
  var ruleCheckboxes = $(".rule-checkbox");
  var numRules = $(".rule-checkbox").length;
  for (var i = 0; i < numRules; i++) {
    var rule = ruleCheckboxes[i];
    if (rule.checked) {
      //console.log(rule.id );
      rules.push(rule.id);
    }
  }
  var myJsonString = JSON.stringify(rules);
  var investorId = $("#investor").val();
  //console.log(rules);
  //console.log(myJsonString);

  $.ajax({
    type: "POST",
    url: "http://54.184.227.39:9010/api/matching/match/" + investorId,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (result, status) {
      if (result) {
        //console.log("Result: ", result);
        $("#result tr").remove();
        var selectiontable = $("#result");
        $.each(result, function (i, row) {
          //console.log("row", row);
          var tr = $("<tr></tr>");
          tr.append($("<td>" + row.id + "</td>"));
          tr.append($("<td class='cell_email'>" + row.companyName + "</td>"));
          //tr.append($("<td class='cell_phone'>" + row.phone +  "</td>"));
          tr.append(
            $(
              "<td><a href='/admin/match/" +
                investorId +
                "/" +
                row.id +
                "' target='_blank'><img src='/img/info.png' class='infoimage'/></a></td>"
            )
          );
          selectiontable.append(tr);
        });

        $("html, body").css("cursor", "auto");
      } else {
        $("html, body").css("cursor", "auto");
        console.log("error");
      }
    },

    data: myJsonString,
  });
}

function selectInvestor(id) {
  $(".investor").removeClass("selected_investor");
  $("#investor-" + id).addClass("selected_investor");
  $("#investor").val(id).change();

  const investorId = id;

  $.ajax({
    type: "GET",
    url: "http://54.184.227.39:9010/api/investor/" + investorId,
    //contentType: "application/json; charset=utf-8",
    //dataType: "json",
    success: function ({ companyName, country, ...result }, status, xhr) {
      if (result) {
        $("#selected-company-info")
          .empty()
          .append($("<span />").text(companyName), $("<span />").text(country));
        updateMatches();

        console.log("Investor: ", result);
      } else {
        console.log("error");
      }
    },
  });
}

// function updateInvestor() {
//   var investorId = $("#investor").val();
//   $.ajax({
//     type: "GET",
//     url: "http://54.184.227.39:9010/api/investor/" + investorId,
//     //contentType: "application/json; charset=utf-8",
//     //dataType: "json",
//     success: function (result, status, xhr) {
//       if (result) {
//         console.log("Investor: ", result);
//       } else {
//         console.log("error");
//       }
//     },
//   });
// }
