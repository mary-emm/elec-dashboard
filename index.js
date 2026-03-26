const slider = document.getElementById("myRange");
const selectedYear = document.getElementById("selectedYear");

const geYear = [
  1969, 1974, 1978, 1982, 1986, 1990, 1995, 1999, 2004, 2008, 2013, 2018, 2022,
];

// set initial year
selectedYear.innerText = geYear[slider.value];

// fetch data
async function loadData(year) {
  const res = await fetch(`data/main/${year}.json`);
  const data = await res.json();
  return data;
}

// group by state
function groupByState(data) {
  const grouped = {};

  data.forEach((d) => {
    if (!grouped[d.STATE]) {
      grouped[d.STATE] = [];
    }
    grouped[d.STATE].push(d);
  });

  return grouped;
}

// color mapping
function getColor(party) {
  if (party === "PN" || party === "GS" || party === "PAS") return "#588157";
  if (party === "BN") return "#4f7d8e";
  if (party === "PH" || party === "PR" || party === "PKR" || party === "BA")
    return "#c94c4c";
  if (party === "MUDA") return "#b5b2b2";
  if (party === "INDEPENDENT") return "#FFEE91";
  if (party === "KDM") return "#FDC3A1";
  if (party === "WARISAN" || party === "DAP") return "#D989B5";
  if (party === "GRS" || party === "GSABAH") return "#863A6F";
  if (party === "GPS") return "#DEF5E5";
  if (party === "PBM") return "#FFC18E";
}
// tested
// render chart
function render(data) {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  const grouped = groupByState(data);

  Object.keys(grouped).forEach((state) => {
    const stateDiv = document.createElement("div");
    stateDiv.className = "state";

    grouped[state].forEach((p) => {
      const block = document.createElement("div");
      block.className = "parliament";

      // apply color here
      block.style.background = getColor(p.WINNING_PARTY_MAIN);

      block.onclick = () => {
        console.log("clicked:", p);

        showDetail(p); // we’ll create this next
      };

      stateDiv.appendChild(block);
    });

    const label = document.createElement("div");
    label.className = "state-label";
    label.textContent = state;

    stateDiv.appendChild(label);
    chart.appendChild(stateDiv);
  });
}

function getParties(data) {
  const set = new Set();

  data.forEach((d) => {
    set.add(d.WINNING_PARTY_MAIN);
  });

  return Array.from(set);
}

function renderLegend(data) {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";

  const parties = getParties(data);

  parties.forEach((party) => {
    const row = document.createElement("div");
    row.className = "legend-item";

    const colorBox = document.createElement("div");
    colorBox.className = "legend-color";
    colorBox.style.background = getColor(party);

    const label = document.createElement("span");
    label.textContent = party;

    row.appendChild(colorBox);
    row.appendChild(label);
    legend.appendChild(row);
  });
}

// slider update
slider.oninput = async function () {
  const year = geYear[this.value];
  selectedYear.innerText = year;

  const data = await loadData(year);
  render(data);
  renderLegend(data);
};

// initial load (important)
(async function init() {
  const year = geYear[slider.value];
  const data = await loadData(year);
  render(data);
})();
