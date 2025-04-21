// const getGraph = async url => {
//   const response = await fetch(url);
//   return await response.text();
// }

module.exports = json => {
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
  let { stringPermanent, vals, vars, fnStr, coords, p, y, iter, simplex } = json;
  [stringPermanent, fnStr] = [stringPermanent, fnStr].map(
    string => string && string.split("DIV").join("/").split("D").join("/"),
  );

  let inputs = `
    <div><h3>Inputs</h3>
    <ul>
      ${(stringPermanent && !fnStr) ? `<li>expression: ${stringPermanent} </li>` : ""}
      ${fnStr ? `<li>function: ${fnStr} </li>` : ""}
      ${vars ? `<li>variables: <i>${vars.join(", ")}</I> </li>` : ""}
      ${coords ? `<li>coordinates: (${coords.join(", ")}) </li>` : ""}
      ${simplex ? `<li>simplex: ${simplex} </li>` : ""}
    </ul>
  `;

  inputs += "</div>";
  const outputs = `
    <div><h3>Outputs</h3 >
      <ul>
        ${vals ? `<li>value: ${vals[0]} </li>` : ""}
        ${y ? `<li>minimum value: ${y.reduce((sum, val) => sum + val)/y.length} </li>` : ""}
        ${iter ? `<li>number of iterations: ${iter}` : ""}
      </ul>
    </div>
  `;

  html += inputs;
  html += outputs
  return html + "</div></div>";
}
