var ergebnisseTemplate, kandidatenTemplate;
function getSearchUrlForForm() {
  street = d3.select("#search #street").property("value")
  nr = d3.select("#search #nr").property("value");
  return "http://pollfinder-codeformuenster.rhcloud.com/find/"+street+"/"+nr+"";
}
function displayResultsForWahlbezirk(wahlbezirkNr) {
  d3.select("#infos").style("display","block");
  d3.select("#wahlbezirk").html(wahlbezirkNr);
  wahlDaten = wahlDataForBezirkNumber(wahlbezirkNr);
  partyList = getSortedPartyList(wahlDaten.partyPercentages);
  html = ergebnisseTemplate({parties: partyList});
  d3.select("#last-results-content").html(html);
  d3.json("candidates.json", function(err, daten) {
    wahlbezirkNrInt = parseInt(wahlbezirkNr);
    kandidaten = daten[wahlbezirkNrInt];
    html = kandidatenTemplate({candidates: kandidaten});
    d3.select("#candidates-content").html(html);
    d3.select("#loading").style("display","none");
  });
}
d3.csv("results.csv", function(err, daten) {
  wahldaten = daten;
  addData();
  var ergebnisseSource   = d3.select("#ergebnisse-template").html();
  var candidateSource   = d3.select("#kandidaten-template").html();
  ergebnisseTemplate =  _.template(ergebnisseSource);
  kandidatenTemplate =  _.template(candidateSource);
});
d3.select("#search #submit").on("click", function(d) {
  d3.select("#loading").style("display","block");
  url = getSearchUrlForForm();
  d3.json(url, function(err, data) {
    if(data) {
      wahlbezirkNr = data.wahlbezirk_nr
      displayResultsForWahlbezirk(wahlbezirkNr);
    }
  });
});
d3.select("#select select").on("change", function(d) {
  wahlbezirkNr = ('0'+this.value).slice(-2);
  displayResultsForWahlbezirk(wahlbezirkNr);
});
d3.select("#select #submit-select").on("click", function(d) {
   wahlbezirkNr = d3.select("#select option[selected=selected]").val();
  debugger
});
d3.selectAll("#tabs li")
.datum(function() { return this.dataset; })
.on("click", function(d) {
  d3.selectAll("#tabs li").classed("active", false);
  d3.select(this).classed("active", true);
  if(d.type == "1") {
    d3.select("#search").style("display", "block");
    d3.select("#select").style("display", "none");
  }else {
    d3.select("#search").style("display", "none");
    d3.select("#select").style("display", "block");
  }
})
