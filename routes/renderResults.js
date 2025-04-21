// const getGraph = async url => {
//   const response = await fetch(url);
//   return await response.text();
// }

module.exports = async json => {
  let html = `
    <html
      xml:lang="en"
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
    >
    <body>
    <div style="padding-top: 20px; padding-left: 40px; padding-right: 40px;">
      <div>
        <h2>Function minimizer</h2>
        <a href="https://function-minimizer-adfd6c2c8012.herokuapp.com/">
          Return
        </a> to main page.
  `;

  if (json.error) return `${html}<br/><br/><div><b>Error:</b> ${json.error}</div>`;
  const message = json.message;

  let inputs = `
    <div><h3>Inputs</h3>
  `;

  inputs += "</div>";
  const outputs = `
    <div><h3>Outputs</h3 >
      <div><b>Best path:</b> ${json.path.map(index => {
        const sets = coordinateSets;
        const hasLabels = !!sets && (sets[index][2] !== undefined);
        return hasLabels ? sets[index][2] : index;
      }).join("&rarr;")}</div>
      <div>
        ${(!hasSecondaryCosts ? "<b>Primary cost:</b>": `<b>Time:</b>`)} ${json.costs[0].toFixed(2)} ${!hasSecondaryCosts ? "" : "hours" }
        ${hasSecondaryCosts ? `<br/><b>Distance:</b> ${json.costs[1].toFixed(2)} miles` : ""}
      </div>
    </div>
  `;

  html += inputs;
  html += outputs
  return html + "</div></div>";
}
