const base = "https://function-minimizer-adfd6c2c8012.herokuapp.com";

const urlFrags = {
    evaluate_expression: "/evaluate-expression/(6-5sin(4))D(3**2+1)",
    evaluate_function: "/evaluate-function/(x-5sin(y))D(z**2+1)/[x,y,z]/[6,4,3]",
    minimize0: "/minimize/4x**4+2xy+3y**2+4x+5y+6/[x,y]/random",
    minimize1: "/minimize/4x**4+2xy+3y**2+4x+5y+6/[x,y]/[[0,0],[1,0],[0,1]]",
    minimize2: "/minimize/4x**4+2xy+3y**2+4x+5y+6/[x,y]/random/40",
};

const urls = Object.entries(urlFrags).reduce((urls, [name, frag]) => {
    return {...urls, [name]: base + frag};
}, {});

const homePage = `
<head>
    <title>Minimizer</title>
    <script>
    </script>
</head>
<body>
    <div style="padding-top: 20px; padding-left: 40px; padding-right: 40px;">
        <h3><p align=center>Function Minimizer</p></h3>
        <p align=center>
            <a href="https://pknipp.github.io/math">
                Return
            </a> to the Math APIs page.
            </br>
            creator:&nbsp;<a
                href='https://pknipp.github.io/'
                target='_blank' rel='noopener noreferrer'
            >
                Peter Knipp
            </a>
            <br/>
        </p>
        <p><b>Background:</b><br/>
        <div>
            This API finds a local minimum of a multidimensional function if given the function's string representation.  It uses
            <a
                href="https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method"
                target='_blank'
                rel='noopener noreferrer'
            >
                Nelder-Mead method
            </a>,
            as presented on page 292 of Chapter 10 of the 1987 edition of <I>Numerical Recipes</I>, by William Press, Brian Flannery, Saul Teukolsky, and william Vetterling.  In addition to solving this optimization problem, this API also performs two more basic tasks that require the parsing of a string: expression evaluation and function evaluation .
        </div>
        <p><b>Params:</b></p>
        <ul>
            <li>
                <tt>:exprStr</tt> is is a string representation of a valid arithmetic expression.  As such it contains numbers (including <tt>PI</tt> and <tt>E</tt>), parentheses, binary operations (addition, subtraction, multiplication, division, and exponentiation), and unary operations (sin, sqrt, log, etc).  Addition and subtraction are simply represented by <tt>+</tt> and <tt>-</tt>, respectively. Multiplication is represented by <tt>*</tt> or nothing (for the case of implied multiplication). Division is represented by <tt>DIV</tt> or <tt>D</tt>, owing to the fact that the usual symbol for division (<tt>/</tt>) has a special meaning in a url.  Exponentiation may be represented by either <tt>**</tt> or <tt>^</tt>, but the former is preferable owing to the fact that the latter will be replaced by <tt>%5E</tt> in the url.  The unary may be any of the static <tt>Math</tt> methods listed in the
                <a
                    href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math"
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    javascript
                </a> docs. Spaces are allowed but discouraged.
            </li>
            <li>
                <tt>:vars</tt> is is a bracket-delimited list of strings, each of which is the name for a variable which appears in a function (described below).  Each string satisfies the same rules as javascript variables. The first character must be either a letter (upper-case or lower-case) or underscore.  Any subsequent character may be that or a numeral.  No variable name can be a substring of the name of a unary (for which the previous bullet includes a link to a list).
            </li>
            <li>
                <tt>:fnStr</tt> is a string that defines a function.  It includes expressions and variable names, as defined above.
            </li>
            <li>
                <tt>:coords</tt> is a bracket-delimited list of the coordinates of a point (ie, independent variables) where a function is to be evaluated.
            </li>
            <li>
                <tt>:simplex</tt> is the list of <tt>:coords</tt> that constitute a
                    <a
                        href="https://en.wikipedia.org/wiki/Simplex"
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        simplex,
                    </a>
                    a data structure used for function minimization.  A simplex contains one more point than the dimensionality of the space: a segment in one dimension, a triangle in two dimensions, or a tetrahedron in three.  This param is optional, in that you can replace it by <tt>random</tt> if you are willing to allow the API to use a random simplex.
            </li>
            <li>
                <tt>:maxIter</tt> (optional) allows the user to increase above 500 the maximum number of iterations of the Nelder-Mead method, as is sometimes necessary in order to converge to an answer.
            </li>
        </ul>


    <p><b>Endpoints:</b></p>

    <table border="1">
        <thead>
            <tr>
                <th>task</th><th>url fragment(s)</th><th>example(s)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>evaluates an expression</td>
                <td><tt>/evaluate-expression/:exprStr</tt></td>
                <td>
                    <button id="evaluate_expression">
                        CLICK
                    </button>
                    [6 - 5sin(4)] / (3<sup>2</sup> + 1)
                </td>
            </tr>
            <tr>
                <td>evaluates a function</td>
                <td><tt>/evaluate-function/:fnStr/:vars/:coords</tt></td>
                <td>
                    <button id="evaluate_function">
                        CLICK
                    </button>
                    [x - 5sin(y)] / (z<sup>2</sup> + 1)
                    <br/>evaluated at (x, y, z) = (6, 4, 3)
                </td>
            </tr>
            <tr>
                <td rowspan="3">minimizes a function</td>
                <td><tt>/minimize/:fnStr/:vars/random</tt></td>
                <td>
                    <button id="minimize0">
                        CLICK
                    </button>
                    4x<sup>4</sup> + 2xy + 3y<sup>2</sup> + 4x + 5y + 6
                    <br/>minimized with a random simplex
                </td>
            </tr>
            <tr>
                <td><tt>/minimize/:fnStr/:vars/:simplex</tt></td>
                <td>
                    <button id="minimize1">
                        CLICK
                    </button>
                    same as above, but specifying a simplex
                </td>
            </tr>
            <tr>
                <td><tt>/minimize/:fnStr/:vars/random/40</tt></td>
                <td>
                    <button id="minimize2">
                        CLICK
                    </button>
                    same as first example, but reducing iteration-limit from 500 to 40
                </td>
            </tr>
        </tbody>
    </table>

    <p>
        <b>Note:</b>
        If you want the response as json rather than as html, simply insert <tt>api</tt> after <tt>...heroku.com</tt> in the address.
    </p>
    <script>
      const buttons = Array.from(document.getElementsByTagName("button"));
      const setExample = example => {
        window.location.href = ${JSON.stringify(urls)}[example];
      };
      buttons.forEach(button => {
        const example = button.getAttribute("id");
        button.addEventListener("click", e => setExample(example));
      });
    </script>
</body>`;
module.exports = homePage;
