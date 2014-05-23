var wahldaten;
partyNames = { "spd": "SPD", "cdu": "CDU", "die_linke": "Die Linke", "gruene": "Grüne", "piraten": "Piraten", "fdp": "FDP", "oedp": "ÖDP", "uwg_ms": "UWG Ms" }
function partyName(accronym) {
  return partyNames[accronym];
}
function makeParty(d,partyName) {
  return  { 
    party: partyName, 
    votes: parseInt(d[partyName]) || 0,
    percentage: (parseInt(d[partyName]) * 100 / parseInt(d.waehler_insgesamt) ) || 0
  };
}
function getWinner(parties) {
  return _.max(parties, function(d) { return d.votes; }).party;
}
function addData() {
  wahldaten.map(function(d) { 
    parties = ["spd","cdu","die_linke","gruene","piraten","fdp","oedp","uwg_ms"].map(function(partyName) { return makeParty(d,partyName) });
    d.winner = getWinner(parties);
    d.partyPercentages = parties;
    d.winning_percentage = (d[d.winner] / d.waehler_insgesamt);
    return d;
  });
}
function wahlDataForBezirk(d) {
  wahlbezirk = d.properties.wahlbezirk;
  daten = wahlDataForBezirkNumber(wahlbezirk);
  return daten;
}
function wahlDataForBezirkNumber(bezirkNumber) { 
  daten = _.find(wahldaten, function(d) { return d.wahlbezirk_nr === bezirkNumber; } )
  return daten;
}
function winner(d) {
  daten = wahlDataForBezirk(d);
  return daten.winner;
}
function percentageOpacity(d) {
  daten = wahlDataForBezirk(d);
  return daten.winning_percentage+0.3;
}
function getSortedPartyList(parties) {
  partyList = _.sortBy(parties, function(party) { return party.percentage}).reverse();
  return partyList;
}
function partyPercentagesHtml(parties) {
  partyList = _.sortBy(parties, function(party) { return party.percentage}).reverse();//.forEach(function(d) {
  context = { parties: partyList };
  html = templates["detail"](context);
  return html;
}
function addDetailData(d) {
  daten = wahlDataForBezirk(d);
  html = "<h2>"+d.properties.bezirkname+"</h2>"
  html += partyPercentagesHtml(daten.partyPercentages);

  d3.select("#detail")
  .style("display", "block")
  .html(html);
}
