// const getGraph = async url => {
//   const response = await fetch(url);
//   return await response.text();
// }

module.exports = (json, title) => {
  let html = `
    <html
      xml:lang="en"
      lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
    >
    <body>
    <div style="padding-top: 20px; padding-left: 40px; padding-right: 40px;">
      <div>
        <h2>${title}</h2>
        <a href="https://function-minimizer-adfd6c2c8012.herokuapp.com/">
          Return
        </a> to main page.
  `;

  if (json.error) return `${html}<br/><br/><div><b>Error:</b> ${json.error}</div>`;
  let { stringPermanent, vals, vars, fnStr, coords, p, y, iter, simplex, warnings } = json;
  [stringPermanent, fnStr] = [stringPermanent, fnStr].map(
    string => string && string.split("DIV").join("/").split("D").join("/").split("^").join("**"),
  );
  if (p) {
    const pNew = new Array(vars.length).fill(0);
    for (let i = 0; i < y.length; i++) {
      for (let j = 0; j < vars.length; j++) {
        pNew[j] += p[i][j];
      }
    }
    p = pNew.map(val => val / y.length);
    y = y.reduce((yTotal, yOne) => yTotal + yOne) / y.length;
  }

  let inputs = `
    <div><h3>Input(s):</h3>
    <ul>
      ${(stringPermanent && !fnStr) ? `<li>expression: ${stringPermanent} </li>` : ""}
      ${fnStr ? `<li>function: ${fnStr} </li>` : ""}
      ${vars ? `<li>variables: <i>${vars.join(", ")}</I> </li>` : ""}
      ${coords ? `<li>coordinates: (${coords.join(", ")}) </li>` : ""}
      ${simplex ? `<li>simplex: ${JSON.stringify(simplex)} </li>` : ""}
    </ul>
  `;

  inputs += "</div>";
  const outputs = `
    <div><h3>Output(s):</h3 >
      <ul>
        ${iter ? `
          <li>number of iterations needed to reach minimum: ${iter} </li>
          <li> dependent variable: ${y} </li>
          <li> independent variables:
            <ul>
              ${vars.map((varName, i) => `
                <li>
                  <I>${varName}</I> = ${p[i]}
                </li>
              `).join("")}
            </ul>
          </li>` : ""
        }
        ${vals ? `<li>value: ${vals[0]} </li>` : ""}
        ${warnings.length ? `<li>warnings: <ul>${warnings.map(warning => `<li>${warning}</li>`).join("")}</ul>` : ""}
      </ul>
    </div>
  `;

  html += inputs;
  html += outputs
  return html + "</div></div>";
}
