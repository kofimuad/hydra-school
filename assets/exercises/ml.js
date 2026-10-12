/* Practice for the Machine Learning specialization (holbertonschool-machine_learning). NumPy runs in the browser via Pyodide. */
(function () {
  const EX = (window.EX = window.EX || {});
  const head = "#!/usr/bin/env python3\n";
  const np = { packages: ["numpy"] };
  const py = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "python", file, p, start, sol, tests }, extra || {});
  const id = (path) => "ml-" + path.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const set = (path, obj) => { EX[id(path)] = obj; };
  const stub = (doc, sig) => `${head}"""${doc}"""\n\n\ndef ${sig}:\n    """${doc}"""\n    pass\n`;

  /* ---------------- math ---------------- */
  set("math/0x00-linear_algebra", {
    quiz: [
      ["What is the shape of [[1, 2, 3], [4, 5, 6]]?", ["[3, 2]", "[2, 3]", "[6]", "[2]"], 1],
      ["When can you multiply matrix A (m×n) by B (p×q)?", ["Always", "When n == p", "When m == q", "When m == p"], 1],
      ["What is the transpose of a 2×3 matrix?", ["2×3", "3×2", "3×3", "2×2"], 1],
      ["What does broadcasting do in NumPy?", ["Sends data over a network", "Stretches arrays of compatible shapes so element-wise ops work", "Sorts arrays", "Copies arrays to the GPU"], 1],
      ["What does <code>np.matmul(A, B)</code> compute?", ["Element-wise product", "Matrix product", "Dot product of flattened arrays only", "Sum"], 1],
    ],
    tasks: [
      py("Size Me Please", "2-size_me_please.py", "<p>Write <code>def matrix_shape(matrix):</code> that calculates the shape of a matrix (a list of integers). All elements in the same dimension are the same type/shape. No numpy.</p>", stub("Shape of a matrix", "matrix_shape(matrix)"),
        head + '"""Shape of a matrix"""\n\n\ndef matrix_shape(matrix):\n    """Returns the shape of a nested list"""\n    shape = []\n    while isinstance(matrix, list):\n        shape.append(len(matrix))\n        matrix = matrix[0] if matrix else None\n    return shape\n',
        [{ main: 'matrix_shape = __import__("2-size_me_please").matrix_shape\nprint(matrix_shape([[1, 2], [3, 4]]))\nprint(matrix_shape([[[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15]], [[16, 17, 18, 19, 20], [21, 22, 23, 24, 25], [26, 27, 28, 29, 30]]]))\n', out: "[2, 2]\n[2, 3, 5]\n" }]),
      py("Flip Me Over", "3-flip_me_over.py", "<p>Write <code>def matrix_transpose(matrix):</code> that returns the transpose of a 2D matrix as a new matrix.</p>", stub("Transpose", "matrix_transpose(matrix)"),
        head + '"""Transpose"""\n\n\ndef matrix_transpose(matrix):\n    """Returns the transpose of a 2D matrix"""\n    return [list(row) for row in zip(*matrix)]\n',
        [{ main: 'f = __import__("3-flip_me_over").matrix_transpose\nprint(f([[1, 2], [3, 4], [5, 6]]))\nprint(f([[1, 2, 3]]))\n', out: "[[1, 3, 5], [2, 4, 6]]\n[[1], [2], [3]]\n" }]),
      py("Across The Planes", "5-across_the_planes.py", "<p>Write <code>def add_matrices2D(mat1, mat2):</code> adding two 2D matrices element-wise. Return a new matrix, or None if the shapes differ.</p>", stub("Add matrices", "add_matrices2D(mat1, mat2)"),
        head + '"""Add matrices"""\n\n\ndef add_matrices2D(mat1, mat2):\n    """Adds two 2D matrices element-wise"""\n    if len(mat1) != len(mat2) or any(len(a) != len(b) for a, b in zip(mat1, mat2)):\n        return None\n    return [[x + y for x, y in zip(a, b)] for a, b in zip(mat1, mat2)]\n',
        [{ main: 'f = __import__("5-across_the_planes").add_matrices2D\nprint(f([[1, 2], [3, 4]], [[5, 6], [7, 8]]))\nprint(f([[1, 2]], [[1], [2]]))\n', out: "[[6, 8], [10, 12]]\nNone\n" }]),
      py("Ridin' Bareback", "8-ridin_bareback.py", "<p>Write <code>def mat_mul(mat1, mat2):</code> performing matrix multiplication (no numpy). Return None if they can't be multiplied.</p>", stub("Matrix multiplication", "mat_mul(mat1, mat2)"),
        head + '"""Matrix multiplication"""\n\n\ndef mat_mul(mat1, mat2):\n    """Multiplies two 2D matrices"""\n    if len(mat1[0]) != len(mat2):\n        return None\n    return [[sum(a * b for a, b in zip(row, col)) for col in zip(*mat2)] for row in mat1]\n',
        [{ main: 'f = __import__("8-ridin_bareback").mat_mul\nprint(f([[1, 2], [3, 4], [5, 6]], [[1, 2, 3, 4], [5, 6, 7, 8]]))\nprint(f([[1, 2]], [[1, 2]]))\n', out: "[[11, 14, 17, 20], [23, 30, 37, 44], [35, 46, 57, 68]]\nNone\n" }]),
      py("Bracing The Elements (numpy)", "12-bracin_the_elements.py", "<p>Write <code>def np_elementwise(mat1, mat2):</code> returning a tuple with the element-wise sum, difference, product and quotient. No loops or conditions — use numpy operators.</p>", stub("Element-wise operations", "np_elementwise(mat1, mat2)"),
        head + '"""Element-wise operations"""\n\n\ndef np_elementwise(mat1, mat2):\n    """Returns sum, difference, product and quotient"""\n    return (mat1 + mat2, mat1 - mat2, mat1 * mat2, mat1 / mat2)\n',
        [{ main: 'import numpy as np\nf = __import__("12-bracin_the_elements").np_elementwise\na = np.array([[11, 22, 33], [44, 55, 66]])\nb = np.array([[1, 2, 3], [4, 5, 6]])\nfor r in f(a, b):\n    print(r)\nprint(f(a, 2)[0])\n', out: "[[12 24 36]\n [48 60 72]]\n[[10 20 30]\n [40 50 60]]\n[[ 11  44  99]\n [176 275 396]]\n[[11. 11. 11.]\n [11. 11. 11.]]\n[[13 24 35]\n [46 57 68]]\n" }], np),
    ],
  });
  set("math/0x01-plotting", {
    quiz: [
      ["Which chart type shows the distribution of one numeric variable?", ["Pie chart", "Histogram", "Line chart", "Scatter plot"], 1],
      ["Which matplotlib function sets the y-axis to a log scale?", ["plt.log()", "plt.yscale('log')", "plt.ylog()", "plt.axis('log')"], 1],
      ["When is a scatter plot the right choice?", ["Showing parts of a whole", "Showing the relationship between two numeric variables", "Showing one value", "Showing categories over time"], 1],
      ["What does <code>plt.subplot(3, 2, 1)</code> select?", ["3 figures", "The first cell of a 3-row × 2-column grid", "Row 3 col 2", "A 3D plot"], 1],
    ],
    tasks: [],
    manual: ["Plot y = x³ as a red line, a scatter of height vs weight, an exponential decay with log scale, and a stacked bar chart of fruit", "Put all 5 plots in one figure with <code>plt.subplot2grid</code>"],
  });
  set("math/0x02-calculus", {
    quiz: [
      ["What is the derivative of x³?", ["3x", "3x²", "x²", "x⁴/4"], 1],
      ["What is ∑ i for i = 1..n?", ["n²", "n(n+1)/2", "n!", "2ⁿ"], 1],
      ["Chain rule: d/dx f(g(x)) = ?", ["f'(x)g'(x)", "f'(g(x))·g'(x)", "f(g'(x))", "f'(x)+g'(x)"], 1],
      ["What is ∫ 2x dx?", ["x² + C", "2 + C", "x + C", "2x² + C"], 0],
      ["What's the partial derivative of x·y with respect to y?", ["y", "x", "xy", "1"], 1],
    ],
    tasks: [
      py("Our life is the sum total of all the decisions we make", "9-sum_total.py", "<p>Write <code>def summation_i_squared(n):</code> calculating ∑ i² for i = 1..n, <strong>without loops</strong>. If n isn't a valid number (an int ≥ 1), return None.</p>", stub("Sum of squares", "summation_i_squared(n)"),
        head + '"""Sum of squares"""\n\n\ndef summation_i_squared(n):\n    """Returns the sum of i squared from 1 to n"""\n    if not isinstance(n, int) or n < 1:\n        return None\n    return n * (n + 1) * (2 * n + 1) // 6\n',
        [{ main: 'f = __import__("9-sum_total").summation_i_squared\nprint(f(5), f(1), f(100), f(0), f("5"))\n', out: "55 1 338350 None None\n" }]),
      py("Derive happiness in oneself from a good day's work", "10-matisse.py", "<p>Write <code>def poly_derivative(poly):</code>. <code>poly</code> is a list of coefficients where the index is the power of x (<code>[5, 3, 0, 1]</code> = x³ + 3x + 5). Return the derivative's coefficients; if the derivative is 0, return <code>[0]</code>. If poly isn't valid, return None.</p>", stub("Polynomial derivative", "poly_derivative(poly)"),
        head + '"""Polynomial derivative"""\n\n\ndef poly_derivative(poly):\n    """Returns the derivative of a polynomial"""\n    if not isinstance(poly, list) or not poly or not all(isinstance(c, (int, float)) for c in poly):\n        return None\n    d = [i * c for i, c in enumerate(poly)][1:]\n    return d if any(d) else [0]\n',
        [{ main: 'f = __import__("10-matisse").poly_derivative\nprint(f([5, 3, 0, 1]))\nprint(f([5]))\nprint(f([]))\nprint(f("x"))\n', out: "[3, 0, 3]\n[0]\nNone\nNone\n" }]),
      py("Integrate", "17-integrate.py", "<p>Write <code>def poly_integral(poly, C=0):</code> returning the integral's coefficients (C is the constant). Whole-number coefficients must be ints. The list should be as small as possible. Return None if poly or C isn't valid.</p>", stub("Polynomial integral", "poly_integral(poly, C=0)"),
        head + '"""Polynomial integral"""\n\n\ndef poly_integral(poly, C=0):\n    """Returns the integral of a polynomial"""\n    if not isinstance(poly, list) or not poly or not isinstance(C, int) or not all(isinstance(c, (int, float)) for c in poly):\n        return None\n    res = [C]\n    for i, c in enumerate(poly):\n        v = c / (i + 1)\n        res.append(int(v) if v == int(v) else v)\n    while len(res) > 1 and res[-1] == 0:\n        res.pop()\n    return res\n',
        [{ main: 'f = __import__("17-integrate").poly_integral\nprint(f([5, 3, 0, 1]))\nprint(f([0]))\nprint(f([1, 2], C=3))\nprint(f([], 2))\n', out: "[0, 5, 1.5, 0, 0.25]\n[0]\n[3, 1, 1]\nNone\n" }]),
    ],
  });
  set("math/0x03-probability", {
    quiz: [
      ["What does a Poisson distribution model?", ["Heights of people", "The number of events in a fixed interval given an average rate λ", "Coin flips until success", "A uniform choice"], 1],
      ["What's the difference between a PMF and a PDF?", ["None", "PMF is for discrete variables, PDF for continuous ones", "PDF is discrete", "PMF is a cumulative function"], 1],
      ["What does a CDF give you?", ["P(X = x)", "P(X ≤ x)", "The mean", "The variance"], 1],
      ["In a normal distribution, about what % of values lie within 1 standard deviation of the mean?", ["50%", "68%", "95%", "99.7%"], 1],
    ],
    tasks: [
      py("Poisson", "poisson.py", "<p>Create a class <code>Poisson</code> (no imports): <code>__init__(self, data=None, lambtha=1.)</code> — if data is None use lambtha (must be positive, else <code>ValueError(\"lambtha must be a positive value\")</code>); otherwise data must be a list (<code>TypeError(\"data must be a list\")</code>) with at least two values (<code>ValueError(\"data must contain multiple values\")</code>) and lambtha is its mean (float). Add <code>pmf(k)</code> and <code>cdf(k)</code> (k cast to int; 0 if out of range). Use <code>e = 2.7182818285</code>.</p>",
        head + '"""Poisson distribution"""\n\n\nclass Poisson:\n    """Represents a Poisson distribution"""\n    pass\n',
        head + '"""Poisson distribution"""\n\n\nclass Poisson:\n    """Represents a Poisson distribution"""\n    e = 2.7182818285\n\n    def __init__(self, data=None, lambtha=1.):\n        if data is None:\n            if lambtha <= 0:\n                raise ValueError("lambtha must be a positive value")\n            self.lambtha = float(lambtha)\n        else:\n            if not isinstance(data, list):\n                raise TypeError("data must be a list")\n            if len(data) < 2:\n                raise ValueError("data must contain multiple values")\n            self.lambtha = float(sum(data) / len(data))\n\n    def pmf(self, k):\n        """P(X = k)"""\n        k = int(k)\n        if k < 0:\n            return 0\n        fact = 1\n        for i in range(2, k + 1):\n            fact *= i\n        return (self.lambtha ** k) * (self.e ** -self.lambtha) / fact\n\n    def cdf(self, k):\n        """P(X <= k)"""\n        k = int(k)\n        if k < 0:\n            return 0\n        return sum(self.pmf(i) for i in range(k + 1))\n',
        [{ main: 'Poisson = __import__("poisson").Poisson\np = Poisson(data=[4, 6, 3, 5, 2, 8])\nprint("Lambtha:", p.lambtha)\np2 = Poisson(lambtha=5)\nprint("P(9):", round(p2.pmf(9), 8))\nprint("F(9):", round(p2.cdf(9), 8))\nprint(p2.pmf(-1), p2.cdf(-2))\nfor kw in [{"lambtha": -1}, {"data": "x"}, {"data": [1]}]:\n    try:\n        Poisson(**kw)\n    except Exception as e:\n        print(type(e).__name__, e)\n', out: "Lambtha: 4.666666666666667\nP(9): 0.03626558\nF(9): 0.96817194\n0 0\nValueError lambtha must be a positive value\nTypeError data must be a list\nValueError data must contain multiple values\n" }]),
    ],
  });
  set("pipeline/0x00-pandas", {
    quiz: [
      ["What is a pandas DataFrame?", ["A plot", "A 2D labelled table of columns (Series)", "A NumPy dtype", "A database"], 1],
      ["How do you select the column 'Close'?", ["df.Close() ", "df['Close']", "df.get_col(Close)", "df[Close]"], 1],
      ["What does <code>df.fillna(method='ffill')</code> do?", ["Deletes NaNs", "Fills missing values with the previous valid value", "Fills with 0", "Sorts"], 1],
      ["What does <code>df.groupby('A').mean()</code> return?", ["The overall mean", "The mean of each column for each value of A", "A plot", "The first row of each group"], 1],
    ],
    tasks: [],
    manual: ["Load the Coinbase/Bitstamp CSVs, rename columns, convert timestamps, fill missing values, slice, concatenate and plot daily data"],
  });
  set("math/0x04-convolutions_and_pooling", {
    quiz: [
      ["With a 3×3 kernel, 'valid' convolution on a 28×28 image gives…", ["28×28", "26×26", "30×30", "9×9"], 1],
      ["What padding gives a 'same' convolution for a 3×3 kernel?", ["0", "1", "2", "3"], 1],
      ["What does stride 2 do?", ["Doubles the image", "Moves the kernel 2 pixels at a time (output about half the size)", "Uses 2 kernels", "Adds 2 pixels of padding"], 1],
      ["What does max pooling keep in each window?", ["The average", "The maximum value", "The first value", "All values"], 1],
    ],
    tasks: [
      py("Valid Convolution", "0-convolve_grayscale_valid.py", "<p>Write <code>def convolve_grayscale_valid(images, kernel):</code>. <code>images</code> has shape (m, h, w); <code>kernel</code> has shape (kh, kw). Return the convolved images (m, h-kh+1, w-kw+1). You may use only two for loops (over the output height and width) — let numpy do the rest.</p>", head + '"""Valid convolution"""\nimport numpy as np\n',
        head + '"""Valid convolution"""\nimport numpy as np\n\n\ndef convolve_grayscale_valid(images, kernel):\n    """Valid convolution on grayscale images"""\n    m, h, w = images.shape\n    kh, kw = kernel.shape\n    out = np.zeros((m, h - kh + 1, w - kw + 1))\n    for i in range(h - kh + 1):\n        for j in range(w - kw + 1):\n            out[:, i, j] = np.sum(images[:, i:i + kh, j:j + kw] * kernel, axis=(1, 2))\n    return out\n',
        [{ main: 'import numpy as np\nf = __import__("0-convolve_grayscale_valid").convolve_grayscale_valid\nimages = np.arange(2 * 4 * 5).reshape(2, 4, 5)\nkernel = np.array([[1, 0], [0, -1]])\nout = f(images, kernel)\nprint(out.shape)\nprint(out[0])\nprint(f(np.ones((1, 3, 3)), np.ones((3, 3))))\n', out: "(2, 3, 4)\n[[-6. -6. -6. -6.]\n [-6. -6. -6. -6.]\n [-6. -6. -6. -6.]]\n[[[9.]]]\n" }], np),
    ],
  });
  set("math/0x05-advanced_linear_algebra", {
    quiz: [
      ["What is det([[a, b], [c, d]])?", ["ad + bc", "ad − bc", "ab − cd", "ac − bd"], 1],
      ["A matrix is invertible exactly when…", ["It's square", "Its determinant is non-zero", "It's symmetric", "It has no zeros"], 1],
      ["What's an eigenvector of A?", ["Any vector", "A non-zero vector v with Av = λv", "A row of A", "The inverse of A"], 1],
      ["A symmetric matrix with all eigenvalues &gt; 0 is…", ["Singular", "Positive definite", "Negative definite", "Orthogonal"], 1],
    ],
    tasks: [
      py("Determinant", "0-determinant.py", "<p>Write <code>def determinant(matrix):</code> (no numpy). <code>matrix</code> must be a list of lists (<code>TypeError(\"matrix must be a list of lists\")</code>) and square (<code>ValueError(\"matrix must be a square matrix\")</code>). The list <code>[[]]</code> is the 0×0 matrix: its determinant is 1.</p>", stub("Determinant", "determinant(matrix)"),
        head + '"""Determinant"""\n\n\ndef determinant(matrix):\n    """Returns the determinant of a square matrix"""\n    if not isinstance(matrix, list) or not matrix or not all(isinstance(r, list) for r in matrix):\n        raise TypeError("matrix must be a list of lists")\n    if matrix == [[]]:\n        return 1\n    n = len(matrix)\n    if any(len(r) != n for r in matrix):\n        raise ValueError("matrix must be a square matrix")\n    if n == 1:\n        return matrix[0][0]\n    if n == 2:\n        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]\n    total = 0\n    for j in range(n):\n        sub = [row[:j] + row[j + 1:] for row in matrix[1:]]\n        total += ((-1) ** j) * matrix[0][j] * determinant(sub)\n    return total\n',
        [{ main: 'f = __import__("0-determinant").determinant\nprint(f([[]]), f([[5]]), f([[1, 1], [1, 1]]), f([[5, 7], [2, 6]]))\nprint(f([[2, -3, 1], [2, 0, -1], [1, 4, 5]]), f([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))\nfor m in [[1, 2], [[1, 2, 3], [4, 5, 6]]]:\n    try:\n        f(m)\n    except Exception as e:\n        print(type(e).__name__, e)\n', out: "1 5 0 16\n49 0\nTypeError matrix must be a list of lists\nValueError matrix must be a square matrix\n" }]),
    ],
  });
  set("math/0x06-multivariate_prob", {
    quiz: [
      ["What does the covariance matrix's diagonal contain?", ["Means", "Variances of each variable", "Correlations", "Zeros"], 1],
      ["Correlation values lie between…", ["0 and 1", "−1 and 1", "0 and ∞", "−∞ and ∞"], 1],
      ["What does a correlation of 0 mean?", ["Independent for sure", "No linear relationship", "Perfect relationship", "Error"], 1],
    ],
    tasks: [
      py("Mean and Covariance", "0-mean_cov.py", "<p>Write <code>def mean_cov(X):</code>. X has shape (n, d). Return <code>mean</code> (shape (1, d)) and <code>cov</code> (d, d) — the sample covariance (divide by n − 1). Don't use <code>np.cov</code>. Raise <code>TypeError(\"X must be a 2D numpy.ndarray\")</code> or <code>ValueError(\"X must contain multiple data points\")</code> when appropriate.</p>", head + '"""Mean and covariance"""\nimport numpy as np\n',
        head + '"""Mean and covariance"""\nimport numpy as np\n\n\ndef mean_cov(X):\n    """Returns the mean and covariance of X"""\n    if not isinstance(X, np.ndarray) or X.ndim != 2:\n        raise TypeError("X must be a 2D numpy.ndarray")\n    n = X.shape[0]\n    if n < 2:\n        raise ValueError("X must contain multiple data points")\n    mean = X.mean(axis=0, keepdims=True)\n    D = X - mean\n    return mean, D.T @ D / (n - 1)\n',
        [{ main: 'import numpy as np\nf = __import__("0-mean_cov").mean_cov\nX = np.array([[1., 2.], [3., 6.], [5., 10.], [7., 2.]])\nm, c = f(X)\nprint(m)\nprint(np.allclose(c, np.cov(X, rowvar=False)), c.shape)\ntry:\n    f(np.array([[1, 2]]))\nexcept ValueError as e:\n    print(e)\n', out: "[[4. 5.]]\nTrue (2, 2)\nX must contain multiple data points\n" }], np),
    ],
  });
  set("math/0x07-bayesian_prob", {
    quiz: [
      ["Bayes' rule: P(A|B) = ?", ["P(B|A)P(A)/P(B)", "P(A)P(B)", "P(B|A)/P(A)", "P(A)+P(B)"], 0],
      ["What's the prior?", ["The data", "What you believed before seeing the data", "The posterior", "The likelihood"], 1],
      ["What's the likelihood P(data | θ)?", ["The probability of the parameter", "How probable the observed data is for a given parameter value", "The evidence", "Always 1"], 1],
    ],
    tasks: [
      py("Likelihood", "0-likelihood.py", "<p>A drug causes a side effect with an unknown probability. Write <code>def likelihood(x, n, P):</code> returning, for each hypothetical probability in <code>P</code> (a 1D numpy array), the likelihood of seeing x patients with the side effect out of n (binomial). Validate: n must be a positive integer, x an integer ≥ 0 and ≤ n, P a 1D array with values in [0, 1] (use the ALX messages: <code>n must be a positive integer</code>, <code>x must be an integer that is greater than or equal to 0</code>, <code>x cannot be greater than n</code>, <code>P must be a 1D numpy.ndarray</code>, <code>All values in P must be in the range [0, 1]</code>).</p>", head + '"""Likelihood"""\nimport numpy as np\n',
        head + '"""Likelihood"""\nimport numpy as np\n\n\ndef likelihood(x, n, P):\n    """Binomial likelihood of x out of n for each p in P"""\n    if not isinstance(n, int) or n <= 0:\n        raise ValueError("n must be a positive integer")\n    if not isinstance(x, int) or x < 0:\n        raise ValueError("x must be an integer that is greater than or equal to 0")\n    if x > n:\n        raise ValueError("x cannot be greater than n")\n    if not isinstance(P, np.ndarray) or P.ndim != 1:\n        raise TypeError("P must be a 1D numpy.ndarray")\n    if np.any(P < 0) or np.any(P > 1):\n        raise ValueError("All values in P must be in the range [0, 1]")\n    comb = np.prod(np.arange(n - x + 1, n + 1, dtype=float) / np.arange(1, x + 1, dtype=float))\n    return comb * P ** x * (1 - P) ** (n - x)\n',
        [{ main: 'import numpy as np\nf = __import__("0-likelihood").likelihood\nP = np.linspace(0, 1, 11)\nprint(["{:.4e}".format(v) for v in f(26, 130, P)])\nfor args in [(1, 0, P), (5, 3, P), (1, 2, np.array([1.5]))]:\n    try:\n        f(*args)\n    except Exception as e:\n        print(e)\n', out: "['0.0000e+00', '2.7133e-04', '8.7180e-02', '3.0735e-03', '5.9370e-07', '1.1439e-12', '1.0926e-20', '6.1015e-32', '9.5442e-49', '1.0060e-78', '0.0000e+00']\nn must be a positive integer\nx cannot be greater than n\nAll values in P must be in the range [0, 1]\n" }], np),
    ],
  });

  /* ---------------- supervised learning ---------------- */
  const NEURON = head + '"""Neuron"""\nimport numpy as np\n\n\nclass Neuron:\n    """A single neuron performing binary classification"""\n\n    def __init__(self, nx):\n        if not isinstance(nx, int):\n            raise TypeError("nx must be an integer")\n        if nx < 1:\n            raise ValueError("nx must be a positive integer")\n        self.__W = np.random.randn(1, nx)\n        self.__b = 0\n        self.__A = 0\n\n    @property\n    def W(self):\n        return self.__W\n\n    @property\n    def b(self):\n        return self.__b\n\n    @property\n    def A(self):\n        return self.__A\n\n    def forward_prop(self, X):\n        """Sigmoid activation of W.X + b"""\n        self.__A = 1 / (1 + np.exp(-(self.__W @ X + self.__b)))\n        return self.__A\n\n    def cost(self, Y, A):\n        """Logistic regression cost"""\n        m = Y.shape[1]\n        return -np.sum(Y * np.log(A) + (1 - Y) * np.log(1.0000001 - A)) / m\n';
  set("supervised_learning/0x00-binary_classification", {
    quiz: [
      ["What does the sigmoid function output?", ["Any real number", "A value between 0 and 1", "0 or 1 only", "A vector"], 1],
      ["What does gradient descent do?", ["Finds the gradient once", "Repeatedly moves parameters in the direction that reduces the cost", "Randomly searches", "Increases the cost"], 1],
      ["Why use 1.0000001 − A instead of 1 − A in the cost?", ["Speed", "To avoid log(0) when A is exactly 1", "Style", "To regularize"], 1],
      ["What is backpropagation?", ["Running the network backwards to predict", "Computing gradients of the cost w.r.t. every weight using the chain rule", "Re-training from scratch", "A type of layer"], 1],
      ["What is the shape of W for a neuron with nx inputs?", ["(nx, 1)", "(1, nx)", "(nx, nx)", "(1, 1)"], 1],
    ],
    tasks: [
      py("Neuron: init, forward propagation and cost", "neuron.py", "<p>Write a class <code>Neuron</code>: <code>__init__(self, nx)</code> validates nx (<code>TypeError(\"nx must be an integer\")</code>, <code>ValueError(\"nx must be a positive integer\")</code>), sets private <code>W</code> (random normal, shape (1, nx)), <code>b = 0</code>, <code>A = 0</code> with getters. <code>forward_prop(X)</code> computes the sigmoid of W·X + b, stores it in A and returns it. <code>cost(Y, A)</code> returns the logistic regression cost, using <code>1.0000001 - A</code> to avoid division by zero.</p>",
        head + '"""Neuron"""\nimport numpy as np\n\n\nclass Neuron:\n    """A single neuron performing binary classification"""\n    pass\n', NEURON,
        [{ main: 'import numpy as np\nNeuron = __import__("neuron").Neuron\nnp.random.seed(0)\nn = Neuron(3)\nprint(n.W.shape, n.b, n.A)\nX = np.array([[1., 0.5], [0., 2.], [-1., 1.]])\nA = n.forward_prop(X)\nprint(A.shape, bool(np.all((A > 0) & (A < 1))), A is n.A)\nprint(np.round(n.cost(np.array([[1, 0]]), np.array([[0.9, 0.2]])), 6))\nfor bad in ["3", 0]:\n    try:\n        Neuron(bad)\n    except Exception as e:\n        print(type(e).__name__, e)\n', out: "(1, 3) 0 0\n(1, 2) True True\n0.164252\nTypeError nx must be an integer\nValueError nx must be a positive integer\n" }], np),
    ],
    manual: ["Add <code>evaluate</code>, <code>gradient_descent</code> and <code>train</code>, then build <code>NeuralNetwork</code> (1 hidden layer) and <code>DeepNeuralNetwork</code>, and train on the cat dataset"],
  });
  set("supervised_learning/0x01-multiclass_classification", {
    quiz: [
      ["What does softmax output?", ["One probability", "A probability distribution over classes (sums to 1)", "Logits", "A one-hot vector"], 1],
      ["What is one-hot encoding of label 2 with 4 classes?", ["[2]", "[0, 0, 1, 0]", "[0, 1, 0, 0]", "[1, 1, 0, 0]"], 1],
      ["Which cost goes with softmax for multiclass?", ["Mean squared error", "Categorical cross-entropy", "Hinge loss", "L1"], 1],
    ],
    tasks: [
      py("One-Hot Encode", "0-one_hot_encode.py", "<p>Write <code>def one_hot_encode(Y, classes):</code> converting a numeric label vector (shape (m,)) into a one-hot matrix of shape (classes, m). Return None on failure (e.g. bad types, a label ≥ classes).</p>", head + '"""One-hot encode"""\nimport numpy as np\n',
        head + '"""One-hot encode"""\nimport numpy as np\n\n\ndef one_hot_encode(Y, classes):\n    """Converts labels to a one-hot matrix"""\n    if not isinstance(Y, np.ndarray) or Y.ndim != 1 or not isinstance(classes, int) or classes <= np.max(Y):\n        return None\n    one_hot = np.zeros((classes, Y.shape[0]))\n    one_hot[Y, np.arange(Y.shape[0])] = 1\n    return one_hot\n',
        [{ main: 'import numpy as np\nf = __import__("0-one_hot_encode").one_hot_encode\nY = np.array([5, 0, 4, 1, 9, 2, 1, 3, 1, 4])\nprint(f(Y, 10))\nprint(f(Y, 3))\n', out: "[[0. 1. 0. 0. 0. 0. 0. 0. 0. 0.]\n [0. 0. 0. 1. 0. 0. 1. 0. 1. 0.]\n [0. 0. 0. 0. 0. 1. 0. 0. 0. 0.]\n [0. 0. 0. 0. 0. 0. 0. 1. 0. 0.]\n [0. 0. 1. 0. 0. 0. 0. 0. 0. 1.]\n [1. 0. 0. 0. 0. 0. 0. 0. 0. 0.]\n [0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]\n [0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]\n [0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]\n [0. 0. 0. 0. 1. 0. 0. 0. 0. 0.]]\nNone\n" }], np),
      py("One-Hot Decode", "1-one_hot_decode.py", "<p>Write <code>def one_hot_decode(one_hot):</code> converting a one-hot matrix (classes, m) back into a vector of labels (m,). Return None on failure.</p>", head + '"""One-hot decode"""\nimport numpy as np\n',
        head + '"""One-hot decode"""\nimport numpy as np\n\n\ndef one_hot_decode(one_hot):\n    """Converts a one-hot matrix to labels"""\n    if not isinstance(one_hot, np.ndarray) or one_hot.ndim != 2:\n        return None\n    return np.argmax(one_hot, axis=0)\n',
        [{ main: 'import numpy as np\nf = __import__("1-one_hot_decode").one_hot_decode\noh = np.eye(4)[:, [2, 0, 3, 3, 1]]\nprint(f(oh))\nprint(f(np.array([1, 2])))\n', out: "[2 0 3 3 1]\nNone\n" }], np),
    ],
  });
  set("supervised_learning/0x02-tensorflow", {
    quiz: [
      ["What is a tensor?", ["A neural layer", "A multi-dimensional array", "A loss function", "An optimizer"], 1],
      ["In TensorFlow 2, how are operations executed by default?", ["Only inside sessions", "Eagerly (immediately), like NumPy", "Only on GPU", "Lazily in graphs only"], 1],
      ["What does <code>tf.GradientTape</code> do?", ["Records operations to compute gradients", "Saves models", "Plots loss", "Loads data"], 0],
    ],
    tasks: [],
    manual: ["Install TensorFlow 2 locally (or use Google Colab) and build/train the MNIST network from the project, the TF2 way (<code>tf.keras</code> + <code>GradientTape</code>)"],
  });
  set("supervised_learning/0x03-optimization", {
    quiz: [
      ["Why normalize input features?", ["To save memory", "So gradient descent converges faster and features are on similar scales", "To remove outliers", "It's required by NumPy"], 1],
      ["What does momentum add to gradient descent?", ["Randomness", "A moving average of past gradients to smooth and speed up updates", "Regularization", "A bigger learning rate"], 1],
      ["Which optimizer combines momentum and RMSProp?", ["SGD", "Adam", "Adagrad", "Newton"], 1],
      ["What does batch normalization normalize?", ["The weights", "Each layer's pre-activations over a mini-batch", "The labels", "The learning rate"], 1],
    ],
    tasks: [
      py("Normalization Constants", "0-norm_constants.py", "<p>Write <code>def normalization_constants(X):</code> returning the mean and standard deviation of each feature of X (shape (m, nx)).</p>", head + '"""Normalization constants"""\nimport numpy as np\n',
        head + '"""Normalization constants"""\nimport numpy as np\n\n\ndef normalization_constants(X):\n    """Returns the mean and std of each feature"""\n    return X.mean(axis=0), X.std(axis=0)\n',
        [{ main: 'import numpy as np\nf = __import__("0-norm_constants").normalization_constants\nX = np.array([[1., 10.], [3., 30.], [5., 50.]])\nm, s = f(X)\nprint(m)\nprint(np.round(s, 4))\n', out: "[ 3. 30.]\n[ 1.633  16.3299]\n" }], np),
      py("Moving Average", "4-moving_average.py", "<p>Write <code>def moving_average(data, beta):</code> returning the list of exponentially weighted moving averages of <code>data</code>, <strong>with bias correction</strong>.</p>", stub("Moving average", "moving_average(data, beta)"),
        head + '"""Moving average"""\n\n\ndef moving_average(data, beta):\n    """Bias-corrected exponentially weighted moving averages"""\n    v, out = 0, []\n    for t, x in enumerate(data, 1):\n        v = beta * v + (1 - beta) * x\n        out.append(v / (1 - beta ** t))\n    return out\n',
        [{ main: 'f = __import__("4-moving_average").moving_average\ndata = [72, 78, 71, 68, 66, 69, 79, 79, 65, 64]\nprint([round(x, 4) for x in f(data, 0.9)])\n', out: "[72.0, 75.1579, 73.6236, 71.9884, 70.526, 70.2004, 71.8871, 73.136, 71.8078, 70.6091]\n" }]),
    ],
  });
  set("supervised_learning/0x04-error_analysis", {
    quiz: [
      ["Precision = ?", ["TP / (TP + FN)", "TP / (TP + FP)", "TN / (TN + FP)", "(TP + TN) / total"], 1],
      ["Sensitivity (recall) = ?", ["TP / (TP + FN)", "TP / (TP + FP)", "TN / (TN + FP)", "FP / total"], 0],
      ["High bias usually means…", ["Overfitting", "Underfitting (the model is too simple)", "Too much data", "Perfect model"], 1],
      ["High variance usually means…", ["Underfitting", "Overfitting (great on train, poor on dev)", "Low accuracy everywhere", "No errors"], 1],
    ],
    tasks: [
      py("Create Confusion", "0-create_confusion.py", "<p>Write <code>def create_confusion_matrix(labels, logits):</code>. Both are one-hot arrays of shape (m, classes): <code>labels</code> the true labels and <code>logits</code> the predictions. Return the confusion matrix (classes, classes): rows = true labels, columns = predicted labels.</p>", head + '"""Confusion matrix"""\nimport numpy as np\n',
        head + '"""Confusion matrix"""\nimport numpy as np\n\n\ndef create_confusion_matrix(labels, logits):\n    """Rows: true labels, columns: predictions"""\n    return labels.T @ logits\n',
        [{ main: 'import numpy as np\nf = __import__("0-create_confusion").create_confusion_matrix\neye = np.eye(3)\nlabels = eye[[0, 0, 1, 2, 2, 2]]\nlogits = eye[[0, 1, 1, 2, 0, 2]]\nprint(f(labels, logits))\n', out: "[[1. 1. 0.]\n [0. 1. 0.]\n [1. 0. 2.]]\n" }], np),
      py("Sensitivity and Precision", "1-sensitivity.py", "<p>Write <code>def sensitivity(confusion):</code> and <code>def precision(confusion):</code> (in the same file) returning, for each class, TP/(TP+FN) and TP/(TP+FP) as numpy arrays. Rows are true labels, columns predictions.</p>", head + '"""Sensitivity and precision"""\nimport numpy as np\n',
        head + '"""Sensitivity and precision"""\nimport numpy as np\n\n\ndef sensitivity(confusion):\n    """TP / (TP + FN) per class"""\n    return np.diag(confusion) / confusion.sum(axis=1)\n\n\ndef precision(confusion):\n    """TP / (TP + FP) per class"""\n    return np.diag(confusion) / confusion.sum(axis=0)\n',
        [{ main: 'import numpy as np\nm = __import__("1-sensitivity")\nc = np.array([[8., 2., 0.], [1., 6., 3.], [0., 1., 9.]])\nprint(np.round(m.sensitivity(c), 4))\nprint(np.round(m.precision(c), 4))\n', out: "[0.8 0.6 0.9]\n[0.8889 0.6667 0.75  ]\n" }], np),
    ],
  });
  set("supervised_learning/0x05-regularization", {
    quiz: [
      ["What does L2 regularization add to the cost?", ["The sum of absolute weights", "λ/(2m) × the sum of squared weights", "Dropout", "Noise"], 1],
      ["What does dropout do during training?", ["Removes layers", "Randomly zeroes some activations so the network doesn't rely on single neurons", "Stops training early", "Lowers the learning rate"], 1],
      ["What is early stopping?", ["Training for 1 epoch", "Stopping when the validation cost stops improving", "Stopping at random", "Using a small batch"], 1],
    ],
    tasks: [
      py("L2 Regularization Cost", "0-l2_reg_cost.py", "<p>Write <code>def l2_reg_cost(cost, lambtha, weights, L, m):</code> returning the cost of the network with L2 regularization. <code>weights</code> is a dict with keys <code>W1</code>…<code>WL</code> (and biases, which are not regularized).</p>", head + '"""L2 regularization cost"""\nimport numpy as np\n',
        head + '"""L2 regularization cost"""\nimport numpy as np\n\n\ndef l2_reg_cost(cost, lambtha, weights, L, m):\n    """Cost with L2 regularization"""\n    norm = sum(np.sum(np.square(weights["W{}".format(i)])) for i in range(1, L + 1))\n    return cost + lambtha / (2 * m) * norm\n',
        [{ main: 'import numpy as np\nf = __import__("0-l2_reg_cost").l2_reg_cost\nw = {"W1": np.array([[1., 2.], [3., 4.]]), "b1": np.ones((2, 1)), "W2": np.array([[1., -1.]]), "b2": np.ones((1, 1))}\nprint(round(float(f(0.5, 0.1, w, 2, 10)), 6))\n', out: "0.66\n" }], np),
    ],
  });
  const quizOnly = (path, quiz, manual) => set(path, { quiz, tasks: [], manual });
  quizOnly("supervised_learning/0x06-keras", [["What's the difference between the Sequential and Functional Keras APIs?", ["None", "Sequential is a plain stack of layers; Functional allows any graph (multiple inputs/outputs, skips)", "Functional is older", "Sequential supports branches"], 1], ["Which callback stops training when validation loss stops improving?", ["ModelCheckpoint", "EarlyStopping", "LearningRateScheduler", "TensorBoard"], 1], ["What does <code>model.compile</code> set?", ["The layers", "The optimizer, loss and metrics", "The data", "The batch size"], 1]], ["Build, train, validate, save and load a Keras model for MNIST with early stopping and learning-rate decay"]);
  set("supervised_learning/0x07-cnn", {
    quiz: [["Why do CNNs work well on images?", ["They're fully connected", "Shared kernels detect local patterns anywhere in the image (translation invariance) with few parameters", "They don't need training", "They use sigmoid"], 1], ["What does a pooling layer reduce?", ["The number of channels", "The spatial size (height/width)", "The batch size", "The learning rate"], 1], ["LeNet-5 was designed for…", ["Speech", "Handwritten digit recognition", "Translation", "Games"], 1]],
    tasks: [
      py("Pooling Forward Prop (max)", "2-pool_forward.py", "<p>Write <code>def pool_forward(A_prev, kernel_shape, stride=(1, 1), mode='max'):</code>. A_prev has shape (m, h, w, c); kernel_shape is (kh, kw); stride is (sh, sw); mode is <code>max</code> or <code>avg</code>. Return the output of the pooling layer (no padding).</p>", head + '"""Pooling forward"""\nimport numpy as np\n',
        head + '"""Pooling forward"""\nimport numpy as np\n\n\ndef pool_forward(A_prev, kernel_shape, stride=(1, 1), mode="max"):\n    """Forward propagation over a pooling layer"""\n    m, h, w, c = A_prev.shape\n    kh, kw = kernel_shape\n    sh, sw = stride\n    oh, ow = (h - kh) // sh + 1, (w - kw) // sw + 1\n    out = np.zeros((m, oh, ow, c))\n    op = np.max if mode == "max" else np.mean\n    for i in range(oh):\n        for j in range(ow):\n            out[:, i, j, :] = op(A_prev[:, i * sh:i * sh + kh, j * sw:j * sw + kw, :], axis=(1, 2))\n    return out\n',
        [{ main: 'import numpy as np\nf = __import__("2-pool_forward").pool_forward\nA = np.arange(16, dtype=float).reshape(1, 4, 4, 1)\nprint(f(A, (2, 2), (2, 2))[0, :, :, 0])\nprint(f(A, (2, 2), (2, 2), "avg")[0, :, :, 0])\nprint(f(A, (3, 3)).shape)\n', out: "[[ 5.  7.]\n [13. 15.]]\n[[ 2.5  4.5]\n [10.5 12.5]]\n(1, 2, 2, 1)\n" }], np),
    ],
    manual: ["Implement conv_forward / conv_backward / pool_backward and build LeNet-5 in Keras"],
  });
  quizOnly("supervised_learning/0x08-deep_cnns", [["What problem do ResNet skip connections solve?", ["Overfitting", "Vanishing gradients / degradation in very deep networks", "Small datasets", "Slow inference"], 1], ["What is a 1×1 convolution used for in Inception?", ["Blurring", "Reducing (or changing) the number of channels cheaply", "Pooling", "Padding"], 1], ["What's special about DenseNet?", ["No convolutions", "Each layer receives the feature maps of all previous layers", "It's shallow", "It uses RNNs"], 1]], ["Implement an inception block, a ResNet identity block and projection block, and DenseNet-121 in Keras"]);
  quizOnly("supervised_learning/0x09-transfer_learning", [["What is transfer learning?", ["Moving data between servers", "Reusing a model trained on one task as the starting point for another", "Training two models together", "Copying weights randomly"], 1], ["Why freeze the base model's layers at first?", ["To save disk", "To keep the pretrained features while training the new head", "To speed up inference", "It's required by Keras"], 1]], ["Fine-tune a Keras Application (e.g. ResNet50/EfficientNet) on CIFAR-10 to ≥ 87% accuracy and write a blog post about it"]);
  quizOnly("supervised_learning/0x0A-object_detection", [["What does IoU measure?", ["Image quality", "Overlap of two boxes: intersection / union", "Model accuracy", "Box size"], 1], ["What does non-max suppression do?", ["Removes the best box", "Keeps the highest-scoring box and removes overlapping duplicates", "Adds anchors", "Normalizes boxes"], 1], ["What are anchor boxes?", ["Ground truth boxes", "Predefined box shapes the network predicts offsets from", "Bounding labels", "Image borders"], 1]], ["Implement the YOLO v3 class: process outputs, filter boxes, non-max suppression, load images, show boxes, predict"]);
  quizOnly("supervised_learning/0x0B-face_verification", [["What does triplet loss compare?", ["Three classes", "An anchor with a positive (same person) and a negative (different person)", "Three images of the same person", "Three models"], 1], ["Why align faces before embedding them?", ["Speed", "So eyes/nose land in the same place, making embeddings comparable", "Color correction", "Compression"], 1]], ["Implement face alignment with dlib, the TripletLoss layer, and a verification pipeline"]);
  quizOnly("supervised_learning/0x0D-RNNs", [["What problem do LSTMs/GRUs address?", ["Overfitting", "Vanishing gradients over long sequences", "Image size", "Too many classes"], 1], ["What is a bidirectional RNN?", ["Two stacked RNNs", "An RNN reading the sequence forward and backward", "An RNN with two outputs", "A CNN"], 1]], ["Implement RNN, GRU and LSTM cells and forward propagation in NumPy"]);
  quizOnly("supervised_learning/0x0E-time_series", [["Why is time-series data split by time and not randomly?", ["Speed", "To avoid training on the future (data leakage)", "It's easier", "Random splits don't exist"], 1], ["What is a sliding window?", ["A GUI element", "Using the last N steps as input to predict the next", "A dropout type", "A learning rate schedule"], 1]], ["Preprocess the Coinbase/Bitstamp BTC data and forecast the next hour's close with an RNN (tf.data pipeline), then blog about it"]);
  set("supervised_learning/0x0F-word_embeddings", {
    quiz: [["What is a bag-of-words representation?", ["Word order preserved", "A vector of word counts for each document", "A neural network", "A dictionary"], 1], ["What does word2vec learn?", ["Grammar rules", "Dense vectors where similar words are close", "Translations", "Word counts"], 1], ["What's TF-IDF?", ["A neural model", "Term frequency weighted by how rare the word is across documents", "Text formatting", "A tokenizer"], 1]],
    tasks: [
      py("Bag Of Words", "0-bag_of_words.py", "<p>Write <code>def bag_of_words(sentences, vocab=None):</code> (no sklearn). Lowercase, remove possessive <code>'s</code>, keep only words made of letters. If vocab is None, use all words in the sentences, <strong>sorted</strong>. Return <code>embeddings</code> (numpy array (s, f) of counts) and <code>features</code> (the list of words).</p>", head + '"""Bag of words"""\nimport re\nimport numpy as np\n',
        head + '"""Bag of words"""\nimport re\nimport numpy as np\n\n\ndef bag_of_words(sentences, vocab=None):\n    """Counts of each vocab word in each sentence"""\n    tokens = [re.findall(r"[a-z]+", re.sub(r"\'s\\b", "", s.lower())) for s in sentences]\n    if vocab is None:\n        vocab = sorted({w for t in tokens for w in t})\n    index = {w: i for i, w in enumerate(vocab)}\n    emb = np.zeros((len(sentences), len(vocab)), dtype=int)\n    for i, t in enumerate(tokens):\n        for w in t:\n            if w in index:\n                emb[i, index[w]] += 1\n    return emb, list(vocab)\n',
        [{ main: 'f = __import__("0-bag_of_words").bag_of_words\nsentences = ["Holberton school is Awesome!", "Machine learning is awesome", "NLP is the future!", "The children are our future", "Our children\'s children are our grandchildren", "Holberton school is the best!"]\nE, F = f(sentences)\nprint(F)\nprint(E)\nE2, F2 = f(sentences, ["awesome", "future"])\nprint(E2[:, 0], E2[:, 1])\n', out: "['are', 'awesome', 'best', 'children', 'future', 'grandchildren', 'holberton', 'is', 'learning', 'machine', 'nlp', 'our', 'school', 'the']\n[[0 1 0 0 0 0 1 1 0 0 0 0 1 0]\n [0 1 0 0 0 0 0 1 1 1 0 0 0 0]\n [0 0 0 0 1 0 0 1 0 0 1 0 0 1]\n [1 0 0 1 1 0 0 0 0 0 0 1 0 1]\n [1 0 0 2 0 1 0 0 0 0 0 2 0 0]\n [0 0 1 0 0 0 1 1 0 0 0 0 1 1]]\n[1 1 0 0 0 0] [0 0 1 1 0 0]\n" }], np),
    ],
  });
  set("supervised_learning/0x10-nlp_metrics", {
    quiz: [["What does BLEU measure?", ["Grammar correctness", "N-gram overlap between a candidate translation and references", "Perplexity", "Speed"], 1], ["What is the brevity penalty in BLEU for?", ["Long sentences", "Penalizing candidates shorter than the references", "Rare words", "Punctuation"], 1]],
    tasks: [
      py("Unigram BLEU score", "0-uni_bleu.py", "<p>Write <code>def uni_bleu(references, sentence):</code> computing the unigram BLEU score: clipped unigram precision times the brevity penalty (BP = 1 if c &gt; r else exp(1 − r/c), where r is the reference length closest to the sentence length c).</p>", head + '"""Unigram BLEU"""\nimport math\n',
        head + '"""Unigram BLEU"""\nimport math\n\n\ndef uni_bleu(references, sentence):\n    """Unigram BLEU score"""\n    c = len(sentence)\n    counts = {}\n    for w in sentence:\n        counts[w] = counts.get(w, 0) + 1\n    clipped = 0\n    for w, n in counts.items():\n        clipped += min(n, max(ref.count(w) for ref in references))\n    precision = clipped / c\n    r = min((abs(len(ref) - c), len(ref)) for ref in references)[1]\n    bp = 1 if c > r else math.exp(1 - r / c)\n    return bp * precision\n',
        [{ main: 'f = __import__("0-uni_bleu").uni_bleu\nrefs = [["the", "cat", "is", "on", "the", "mat"], ["there", "is", "a", "cat", "on", "the", "mat"]]\nprint(round(f(refs, ["there", "is", "a", "cat", "here"]), 10))\nprint(round(f(refs, ["the", "the", "the", "the", "the", "the"]), 10))\n', out: "0.6549846025\n0.3333333333\n" }]),
    ],
  });
  set("supervised_learning/0x11-attention", {
    quiz: [["What does attention let a decoder do?", ["Skip training", "Look at (weigh) all encoder states when producing each output", "Use fewer layers", "Avoid embeddings"], 1], ["In scaled dot-product attention, why divide by √dk?", ["Style", "To keep dot products from growing large and saturating softmax", "To normalize labels", "To speed up"], 1], ["Why do Transformers need positional encodings?", ["They don't", "Self-attention has no notion of order by itself", "To reduce size", "For tokenization"], 1]],
    tasks: [
      py("Positional Encoding", "4-positional_encoding.py", "<p>Write <code>def positional_encoding(max_seq_len, dm):</code> returning a numpy array (max_seq_len, dm) with the sinusoidal encodings: PE[pos, 2i] = sin(pos / 10000^(2i/dm)), PE[pos, 2i+1] = cos(pos / 10000^(2i/dm)).</p>", head + '"""Positional encoding"""\nimport numpy as np\n',
        head + '"""Positional encoding"""\nimport numpy as np\n\n\ndef positional_encoding(max_seq_len, dm):\n    """Sinusoidal positional encodings"""\n    pos = np.arange(max_seq_len)[:, None]\n    i = np.arange(dm)[None, :]\n    angles = pos / np.power(10000, (2 * (i // 2)) / dm)\n    pe = np.zeros((max_seq_len, dm))\n    pe[:, 0::2] = np.sin(angles[:, 0::2])\n    pe[:, 1::2] = np.cos(angles[:, 1::2])\n    return pe\n',
        [{ main: 'import numpy as np\nf = __import__("4-positional_encoding").positional_encoding\nPE = f(30, 512)\nprint(PE.shape)\nprint(np.round(PE[1, :4], 6))\nprint(np.round(PE[0, :4], 6))\n', out: "(30, 512)\n[0.841471 0.540302 0.821856 0.569695]\n[0. 1. 0. 1.]\n" }], np),
    ],
    manual: ["Implement the RNN encoder/decoder with attention, multi-head attention and the full Transformer in Keras"],
  });
  quizOnly("supervised_learning/0x12-transformer_apps", [["What does a tokenizer do?", ["Translates text", "Splits text into tokens (subwords) and maps them to ids", "Encrypts text", "Removes stop words only"], 1], ["What is teacher forcing?", ["A training schedule", "Feeding the true previous token to the decoder during training", "A dropout method", "Data augmentation"], 1]], ["Build the TF Datasets pipeline for the Portuguese→English dataset and train the Transformer"]);
  quizOnly("supervised_learning/0x13-qa_bot", [["What does BERT's question answering output?", ["A new answer text", "Start and end positions of the answer span in the reference text", "A yes/no", "A summary"], 1], ["What is semantic search?", ["Keyword matching", "Finding documents whose embeddings are closest in meaning to the query", "Regex search", "Sorting by date"], 1]], ["Build the QA loop with a pretrained BERT, semantic search over a corpus with sentence embeddings, and the final multi-reference QA bot"]);

  /* ---------------- unsupervised / RL / pipeline ---------------- */
  quizOnly("unsupervised_learning/0x00-dimensionality_reduction", [["What does PCA find?", ["Clusters", "Directions of maximum variance (principal components)", "Labels", "Outliers"], 1], ["What is t-SNE mostly used for?", ["Classification", "Visualizing high-dimensional data in 2D/3D", "Regression", "Compression for storage"], 1]], ["Implement PCA with SVD (keep 95% variance) and t-SNE step by step"]);
  quizOnly("unsupervised_learning/0x01-clustering", [["What does K-means minimize?", ["The number of clusters", "The sum of squared distances to the nearest centroid", "The variance between clusters", "Entropy"], 1], ["What's a GMM's advantage over K-means?", ["Faster", "Soft assignments and elliptical clusters with probabilities", "No parameters", "Works without data"], 1], ["What is BIC used for?", ["Training", "Choosing the number of clusters, penalizing complexity", "Normalizing data", "Plotting"], 1]], ["Implement K-means (initialize, kmeans, variance, optimum_k) and a GMM with EM and BIC"]);
  set("unsupervised_learning/0x02-hmm", {
    quiz: [["What's the Markov property?", ["The future depends on all the past", "The next state depends only on the current state", "States are independent", "States never repeat"], 1], ["What does the Viterbi algorithm find?", ["The probability of observations", "The most likely sequence of hidden states", "The transition matrix", "The number of states"], 1]],
    tasks: [
      py("Markov Chain", "0-markov_chain.py", "<p>Write <code>def markov_chain(P, s, t=1):</code> returning the probability of being in each state after t iterations. P is the (n, n) transition matrix and s the (1, n) starting probabilities. Return None on failure.</p>", head + '"""Markov chain"""\nimport numpy as np\n',
        head + '"""Markov chain"""\nimport numpy as np\n\n\ndef markov_chain(P, s, t=1):\n    """Probabilities after t transitions"""\n    if not isinstance(P, np.ndarray) or P.ndim != 2 or P.shape[0] != P.shape[1] or not isinstance(s, np.ndarray) or s.shape != (1, P.shape[0]) or not isinstance(t, int) or t < 1:\n        return None\n    return s @ np.linalg.matrix_power(P, t)\n',
        [{ main: 'import numpy as np\nf = __import__("0-markov_chain").markov_chain\nP = np.array([[0.25, 0.2, 0.25, 0.3], [0.2, 0.25, 0.2, 0.35], [0.25, 0.25, 0.2, 0.3], [0.3, 0.3, 0.1, 0.3]])\ns = np.array([[1, 0, 0, 0]])\nprint(np.round(f(P, s, 300), 8))\nprint(f(P, np.array([1, 0]), 2))\n', out: "[[0.25298329 0.25298329 0.18138425 0.31264916]]\nNone\n" }], np),
    ],
    manual: ["Implement regular/absorbing chain checks, the forward, Viterbi, backward and Baum-Welch algorithms"],
  });
  quizOnly("unsupervised_learning/0x03-hyperparameter_tuning", [["What is a Gaussian process?", ["A neural network", "A distribution over functions, giving a mean and uncertainty at each point", "A clustering method", "An optimizer"], 1], ["What does an acquisition function (e.g. Expected Improvement) choose?", ["The best model", "The next hyperparameters to try, balancing exploration and exploitation", "The dataset", "The loss"], 1]], ["Implement a 1D GP and Bayesian optimization, then tune a model with GPyOpt"]);
  quizOnly("unsupervised_learning/0x04-autoencoders", [["What does an autoencoder learn?", ["Labels", "To compress (encode) data and reconstruct (decode) it", "Clusters", "Rewards"], 1], ["What makes a VAE different from a vanilla autoencoder?", ["No decoder", "The latent space is a probability distribution (mean & variance) you can sample from", "It's supervised", "No training"], 1]], ["Build vanilla, sparse, convolutional and variational autoencoders in Keras on MNIST"]);
  set("reinforcement_learning/0x00-q_learning", {
    quiz: [["What's in a Q-table?", ["Rewards", "Expected future return for each (state, action) pair", "States only", "The policy gradient"], 1], ["What does epsilon-greedy balance?", ["Speed and memory", "Exploration (random actions) and exploitation (best known action)", "Rewards and penalties", "Training and testing"], 1], ["In the Q-learning update, what does γ (gamma) control?", ["Learning rate", "How much future rewards count (discount)", "Exploration", "Batch size"], 1]],
    tasks: [
      py("Epsilon Greedy", "2-epsilon_greedy.py", "<p>Write <code>def epsilon_greedy(Q, state, epsilon):</code>. Sample <code>p = np.random.uniform(0, 1)</code>: if p &lt; epsilon, explore — pick a random action with <code>np.random.randint(0, number_of_actions)</code>; otherwise exploit — pick the best action from the Q-table. Return the action index.</p>", head + '"""Epsilon greedy"""\nimport numpy as np\n',
        head + '"""Epsilon greedy"""\nimport numpy as np\n\n\ndef epsilon_greedy(Q, state, epsilon):\n    """Chooses the next action"""\n    p = np.random.uniform(0, 1)\n    if p < epsilon:\n        return np.random.randint(0, Q.shape[1])\n    return int(np.argmax(Q[state]))\n',
        [{ main: 'import numpy as np\nf = __import__("2-epsilon_greedy").epsilon_greedy\nQ = np.zeros((16, 4))\nQ[7] = [0.1, 0.9, 0.3, 0.2]\nprint(int(f(Q, 7, 0.0)))\nnp.random.seed(0)\nacts = [int(f(Q, 7, 1.0)) for _ in range(5)]\nprint(all(0 <= a < 4 for a in acts), len(set(acts)) > 1)\n', out: "1\nTrue True\n" }], np),
    ],
    manual: ["Train a Q-learning agent on FrozenLake (Gymnasium) and play it"],
  });
  quizOnly("reinforcement_learning/0x01-deep_q_learning", [["Why use experience replay in DQN?", ["To save memory", "To break correlation between consecutive samples and reuse data", "To speed up inference", "To explore"], 1], ["What is the target network for?", ["Faster training", "Stable targets — a slowly updated copy of the Q-network", "Exploration", "Logging"], 1]], ["Train a DQN agent to play Atari Breakout with keras-rl2 and Gymnasium"]);
  quizOnly("pipeline/0x01-apis", [["What does HTTP status 429 mean?", ["Not found", "Too many requests (rate limited)", "Server error", "Unauthorized"], 1], ["How do APIs usually paginate?", ["They don't", "With page/limit params or a 'next' URL/token", "With cookies only", "Using WebSockets"], 1]], ["Use the SWAPI and GitHub APIs: ships that can hold N passengers, sentient planets, user location with rate-limit handling, SpaceX launch stats"]);
  quizOnly("pipeline/0x02-databases", [["Which query language does MongoDB use?", ["SQL", "A JSON-like query API", "GraphQL only", "Cypher"], 1], ["When would you pick a relational DB over a document DB?", ["Never", "When data is highly structured with relations and you need joins/transactions", "For images", "For logs only"], 1]], ["Do the MySQL tasks (indexes, triggers, procedures, views) and the MongoDB tasks with pymongo"]);
  quizOnly("pipeline/0x03-data_augmentation", [["Why augment image data?", ["To shrink the dataset", "To create more varied training examples and reduce overfitting", "To label data", "To speed up inference"], 1], ["Which is NOT a typical image augmentation?", ["Flip", "Crop", "Rotate", "Changing the label"], 3]], ["Write flip_image, crop_image, rotate_image, shear, change_brightness and change_hue with tf.image"]);
})();
