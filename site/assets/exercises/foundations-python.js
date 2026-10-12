/* Practice for Foundations – Python (higher-level programming) and the AirBnB console. */
(function () {
  const EX = (window.EX = window.EX || {});
  const py = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "python", file, p, start, sol, tests }, extra || {});
  const head = "#!/usr/bin/python3\n";
  const fn = (sig, doc) => `${head}def ${sig}:\n    """${doc}"""\n    pass\n`;

  /* ---------------- 0x00 hello world ---------------- */
  EX["hl-00"] = {
    quiz: [
      ["Which line makes a Python file executable as a script on Linux?", ["#!/usr/bin/python3", "#include <python>", "import python3", "// python3"], 0],
      ["What does <code>\"Holberton\"[2:4]</code> return?", ["\"ol\"", "\"lb\"", "\"olb\"", "\"Ho\""], 1],
      ["What does <code>print(\"a\" * 3)</code> print?", ["a3", "aaa", "Error", "a a a"], 1],
      ["What does <code>f\"{9.8765:.2f}\"</code> give?", ["9.87", "9.88", "9.8765", "10"], 1],
      ["Which tool checks Python style at ALX?", ["betty", "pycodestyle", "shellcheck", "semistandard"], 1],
    ],
    tasks: [
      py("Run Python file / Print", "2-print.py", "<p>Write a Python script that prints exactly <code>\"Programming is like building a multilingual puzzle</code>, followed by a new line. Use <code>print</code>.</p>", head, head + 'print("\\"Programming is like building a multilingual puzzle")\n',
        [{ out: '"Programming is like building a multilingual puzzle\n' }]),
      py("Print integer", "3-print_number.py", "<p>Complete the source code to print the integer stored in <code>number</code>, followed by <code>Battery street</code>, then a new line. Use an f-string.</p>", head + "number = 98\n", head + 'number = 98\nprint(f"{number} Battery street")\n',
        [{ out: "98 Battery street\n" }]),
      py("Print float", "4-print_float.py", "<p>Print the float stored in <code>number</code> with a precision of 2 digits, preceded by <code>Float: </code>.</p>", head + "number = 3.14159\n", head + 'number = 3.14159\nprint(f"Float: {number:.2f}")\n',
        [{ out: "Float: 3.14\n" }]),
      py("Print string", "5-print_string.py", "<p>Print 3 times the string stored in <code>str</code>, followed by its first 9 characters, each on its own line.</p>", head + 'str = "Holberton School"\n', head + 'str = "Holberton School"\nprint(str * 3)\nprint(str[:9])\n',
        [{ out: "Holberton SchoolHolberton SchoolHolberton School\nHolberton\n" }]),
      py("Play with strings", "6-concat.py", "<p>Print <code>Welcome to Holberton School!</code> using the variables <code>str1</code> and <code>str2</code> (one line of code, no literal text).</p>", head + 'str1 = "Holberton"\nstr2 = "School"\n', head + 'str1 = "Holberton"\nstr2 = "School"\nstr1 = str1 + " " + str2\nprint(f"Welcome to {str1}!")\n',
        [{ out: "Welcome to Holberton School!\n" }]),
      py("Slicing", "7-edges.py", "<p>Complete the code so that <code>word_first_3</code> holds the first 3 letters of <code>word</code>, <code>word_last_2</code> the last 2, and <code>middle_word</code> everything without the first and last letters.</p>",
        head + 'word = "Holberton"\nword_first_3 = \nword_last_2 = \nmiddle_word = \nprint(f"First 3 letters: {word_first_3}")\nprint(f"Last 2 letters: {word_last_2}")\nprint(f"Middle word: {middle_word}")\n',
        head + 'word = "Holberton"\nword_first_3 = word[:3]\nword_last_2 = word[-2:]\nmiddle_word = word[1:-1]\nprint(f"First 3 letters: {word_first_3}")\nprint(f"Last 2 letters: {word_last_2}")\nprint(f"Middle word: {middle_word}")\n',
        [{ out: "First 3 letters: Hol\nLast 2 letters: on\nMiddle word: olberto\n" }]),
    ],
  };

  /* ---------------- 0x01 if/else, loops, functions ---------------- */
  EX["hl-01"] = {
    quiz: [
      ["How does Python mark a block of code?", ["Braces { }", "Indentation", "begin / end", "Semicolons"], 1],
      ["What does <code>range(2, 10, 3)</code> produce?", ["2, 5, 8", "2, 3, 4, … 9", "2, 5, 8, 11", "3, 6, 9"], 0],
      ["What does <code>-98 % 10</code> evaluate to in Python?", ["-8", "2", "8", "-2"], 1, "Python's % takes the sign of the divisor, so -98 % 10 is 2. Use abs() first when you want the last digit."],
      ["What is printed by <code>print(\"{:d}\".format(7), end=\"\")</code>?", ["7 followed by a new line", "7 with no new line", "{:d}", "Error"], 1],
      ["What does a function return if it has no return statement?", ["0", "None", "False", "An empty string"], 1],
    ],
    tasks: [
      py("islower", "7-islower.py", "<p>Write a function that checks for a lowercase character. Prototype: <code>def islower(c):</code> Return True if c is lowercase, False otherwise. You are not allowed to import any module, or use <code>str.upper()</code> / <code>str.isupper()</code>. Tip: <code>ord()</code>.</p>", fn("islower(c)", "Checks for lowercase"),
        head + 'def islower(c):\n    """Checks for lowercase"""\n    return ord("a") <= ord(c) <= ord("z")\n',
        [{ main: 'islower = __import__("7-islower").islower\nprint("a is {}".format("lower" if islower("a") else "upper"))\nprint("H is {}".format("lower" if islower("H") else "upper"))\nprint("A is {}".format("lower" if islower("A") else "upper"))\nprint("3 is {}".format("lower" if islower("3") else "upper"))\nprint("g is {}".format("lower" if islower("g") else "upper"))\n', out: "a is lower\nH is upper\nA is upper\n3 is upper\ng is lower\n" }]),
      py("To uppercase", "8-uppercase.py", "<p>Write a function that prints a string in uppercase followed by a new line. Prototype: <code>def uppercase(str):</code> You can only use <code>print</code> once (hint: <code>end=\"\"</code> isn't printing once…), and no <code>str.upper()</code>.</p>", fn("uppercase(str)", "Prints a string in uppercase"),
        head + 'def uppercase(str):\n    """Prints a string in uppercase"""\n    result = ""\n    for c in str:\n        if ord("a") <= ord(c) <= ord("z"):\n            c = chr(ord(c) - 32)\n        result += c\n    print("{}".format(result))\n',
        [{ main: 'uppercase = __import__("8-uppercase").uppercase\nuppercase("best")\nuppercase("Best School 98 Battery street")\n', out: "BEST\nBEST SCHOOL 98 BATTERY STREET\n" }]),
      py("There are only 3 colours, 10 digits, and 7 notes", "9-print_last_digit.py", "<p>Write a function that prints the last digit of a number and returns it. Prototype: <code>def print_last_digit(number):</code> (No new line.)</p>", fn("print_last_digit(number)", "Prints and returns the last digit"),
        head + 'def print_last_digit(number):\n    """Prints and returns the last digit"""\n    d = abs(number) % 10\n    print(d, end="")\n    return d\n',
        [{ main: 'f = __import__("9-print_last_digit").print_last_digit\nf(98)\nf(0)\nr = f(-1024)\nprint(r)\n', out: "8044\n" }]),
      py("a + b", "10-add.py", "<p>Prototype: <code>def add(a, b):</code> Return the value of a + b.</p>", fn("add(a, b)", "Adds two integers"),
        head + 'def add(a, b):\n    """Adds two integers"""\n    return a + b\n',
        [{ main: 'add = __import__("10-add").add\nprint(add(1, 2))\nprint(add(98, 0))\nprint(add(100, -2))\n', out: "3\n98\n98\n" }]),
      py("a ^ b", "11-pow.py", "<p>Prototype: <code>def pow(a, b):</code> Return a to the power b. No imports.</p>", fn("pow(a, b)", "Computes a to the power b"),
        head + 'def pow(a, b):\n    """Computes a to the power b"""\n    return a ** b\n',
        [{ main: 'pow = __import__("11-pow").pow\nprint(pow(2, 2))\nprint(pow(98, 2))\nprint(pow(98, -2))\nprint(pow(-98, -2))\n', out: "4\n9604\n0.00010412328196584757\n0.00010412328196584757\n" }]),
      py("Fizz Buzz", "12-fizzbuzz.py", "<p>Prototype: <code>def fizzbuzz():</code> Print the numbers from 1 to 100 separated by a space. Multiples of three: <code>Fizz</code>; of five: <code>Buzz</code>; of both: <code>FizzBuzz</code>. Each element is followed by a space (including the last one), and no new line at the end.</p>", fn("fizzbuzz()", "Prints FizzBuzz from 1 to 100"),
        head + 'def fizzbuzz():\n    """Prints FizzBuzz from 1 to 100"""\n    for i in range(1, 101):\n        if i % 15 == 0:\n            print("FizzBuzz", end=" ")\n        elif i % 3 == 0:\n            print("Fizz", end=" ")\n        elif i % 5 == 0:\n            print("Buzz", end=" ")\n        else:\n            print(i, end=" ")\n',
        [{ main: 'fizzbuzz = __import__("12-fizzbuzz").fizzbuzz\nfizzbuzz()\nprint("")\n', out: Array.from({ length: 100 }, (_, k) => { const i = k + 1; return i % 15 === 0 ? "FizzBuzz" : i % 3 === 0 ? "Fizz" : i % 5 === 0 ? "Buzz" : String(i); }).join(" ") + " \n" }]),
      py("Remove at position", "101-remove_char_at.py", "<p>Prototype: <code>def remove_char_at(str, n):</code> Return a copy of the string without the character at position <code>n</code> (not the Python way, i.e. no <code>str[:n] + str[n+1:]</code>... well, any way works — try a loop!). If n is out of range, return the string unchanged.</p>", fn("remove_char_at(str, n)", "Removes the character at position n"),
        head + 'def remove_char_at(str, n):\n    """Removes the character at position n"""\n    copy = ""\n    for i, c in enumerate(str):\n        if i != n:\n            copy += c\n    return copy\n',
        [{ main: 'f = __import__("101-remove_char_at").remove_char_at\nprint(f("Best School", 3))\nprint(f("Chicago", 2))\nprint(f("C is fun!", 0))\nprint(f("School", 10))\nprint(f("Python", -2))\n', out: "Bes School\nChcago\n is fun!\nSchool\nPython\n" }]),
    ],
  };

  /* ---------------- 0x02 import & modules ---------------- */
  EX["hl-02"] = {
    quiz: [
      ["What does <code>if __name__ == \"__main__\":</code> protect?", ["Code that should only run when the file is executed directly, not imported", "Private variables", "Imports", "Nothing"], 0],
      ["What's in <code>sys.argv[0]</code>?", ["The first argument", "The script name", "The number of arguments", "Python's path"], 1],
      ["Which import style should you avoid in ALX projects?", ["import os", "from os import path", "from module import *", "import sys as s"], 2],
      ["What does <code>dir(module)</code> return?", ["Its file path", "A list of names defined in it", "Its size", "Its docstring"], 1],
    ],
    tasks: [
      py("Import a simple function from a simple file", "0-add.py", "<p>Write a program that imports the function <code>add(a, b)</code> from the file <code>add_0.py</code> and prints the result of the addition <code>1 + 2 = 3</code>. Use the variables <code>a = 1</code> and <code>b = 2</code>, and format with <code>\"{} + {} = {}\"</code>. Your code should not be executed when imported.</p>",
        head + 'if __name__ == "__main__":\n    a = 1\n    b = 2\n',
        head + 'if __name__ == "__main__":\n    from add_0 import add\n    a = 1\n    b = 2\n    print("{} + {} = {}".format(a, b, add(a, b)))\n',
        [{ out: "1 + 2 = 3\n" }, { main: 'import importlib\nimportlib.import_module("0-add")\nprint("import printed nothing")\n', out: "import printed nothing\n" }],
        { extraFiles: { "add_0.py": "#!/usr/bin/python3\ndef add(a, b):\n    return (a + b)\n" } }),
      py("How to make a script dynamic!", "2-args.py", "<p>Print the number of and the list of its arguments. Format: <code>Number of argument(s)</code> followed by <code>.</code> (if no arguments) or <code>:</code>; then one line per argument: <code>position: value</code>. Use <code>argument</code> for 1 argument and <code>arguments</code> otherwise.</p>",
        head + 'if __name__ == "__main__":\n    import sys\n',
        head + 'if __name__ == "__main__":\n    import sys\n    n = len(sys.argv) - 1\n    print("{} argument{}{}".format(n, "" if n == 1 else "s", ":" if n else "."))\n    for i in range(1, n + 1):\n        print("{}: {}".format(i, sys.argv[i]))\n',
        [{ args: [], out: "0 arguments.\n" }, { args: ["Hello"], out: "1 argument:\n1: Hello\n" }, { args: ["Hello", "Welcome", "To", "The", "Best", "School"], out: "6 arguments:\n1: Hello\n2: Welcome\n3: To\n4: The\n5: Best\n6: School\n" }]),
      py("Infinite addition", "3-infinite_add.py", "<p>Print the result of the addition of all arguments (all integers), followed by a new line.</p>",
        head + 'if __name__ == "__main__":\n    import sys\n',
        head + 'if __name__ == "__main__":\n    import sys\n    print(sum(int(x) for x in sys.argv[1:]))\n',
        [{ args: [], out: "0\n" }, { args: ["79", "10"], out: "89\n" }, { args: ["79", "10", "-40", "-300", "89"], out: "-162\n" }]),
      py("Calculator", "100-my_calculator.py", "<p>Import <code>add, sub, mul, div</code> from <code>calculator_1.py</code>. Usage: <code>./100-my_calculator.py a operator b</code>. If the number of arguments isn't 3, print <code>Usage: ./100-my_calculator.py &lt;a&gt; &lt;operator&gt; &lt;b&gt;</code> and exit with status 1. If the operator isn't one of <code>+ - * /</code>, print <code>Unknown operator. Available operators: +, -, * and /</code> and exit 1. Otherwise print <code>a operator b = result</code>.</p>",
        head + 'if __name__ == "__main__":\n    import sys\n',
        head + 'if __name__ == "__main__":\n    import sys\n    from calculator_1 import add, sub, mul, div\n    if len(sys.argv) != 4:\n        print("Usage: ./100-my_calculator.py <a> <operator> <b>")\n        sys.exit(1)\n    ops = {"+": add, "-": sub, "*": mul, "/": div}\n    a, op, b = int(sys.argv[1]), sys.argv[2], int(sys.argv[3])\n    if op not in ops:\n        print("Unknown operator. Available operators: +, -, * and /")\n        sys.exit(1)\n    print("{} {} {} = {}".format(a, op, b, ops[op](a, b)))\n',
        [{ args: ["3", "+", "5"], out: "3 + 5 = 8\n", code: 0 }, { args: ["3", "*", "5"], out: "3 * 5 = 15\n" }, { args: ["3", "/", "2"], out: "3 / 2 = 1\n" }, { args: ["3", "H", "5"], out: "Unknown operator. Available operators: +, -, * and /\n", code: 1 }, { args: ["3"], out: "Usage: ./100-my_calculator.py <a> <operator> <b>\n", code: 1 }],
        { extraFiles: { "calculator_1.py": "#!/usr/bin/python3\ndef add(a, b):\n    return (a + b)\n\n\ndef sub(a, b):\n    return (a - b)\n\n\ndef mul(a, b):\n    return (a * b)\n\n\ndef div(a, b):\n    return int(a / b)\n" } }),
    ],
  };

  /* ---------------- 0x03 data structures ---------------- */
  EX["hl-03"] = {
    quiz: [
      ["What's the difference between a list and a tuple?", ["None", "Lists are mutable, tuples are immutable", "Tuples are faster to modify", "Lists can't hold strings"], 1],
      ["What does <code>[x * 2 for x in range(3)]</code> produce?", ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2, 0, 1, 2]", "(0, 2, 4)"], 0],
      ["What does <code>a, b = b, a</code> do?", ["Error", "Swaps a and b", "Creates a tuple", "Copies a into b"], 1],
      ["What does <code>my_list[-1]</code> return?", ["The first element", "The last element", "An error", "-1"], 1],
      ["How do you use a list as a stack?", ["append() and pop()", "insert(0) and pop()", "append() and pop(0)", "add() and remove()"], 0],
    ],
    tasks: [
      py("Print a list of integers", "0-print_list_integer.py", "<p>Prototype: <code>def print_list_integer(my_list=[]):</code> Print all integers of a list, one per line, using <code>str.format()</code>.</p>", fn("print_list_integer(my_list=[])", "Prints all integers of a list"),
        head + 'def print_list_integer(my_list=[]):\n    """Prints all integers of a list"""\n    for n in my_list:\n        print("{:d}".format(n))\n',
        [{ main: 'f = __import__("0-print_list_integer").print_list_integer\nf([1, 2, 3, 4, 5])\nf([])\n', out: "1\n2\n3\n4\n5\n" }]),
      py("Secure access to an element in a list", "1-element_at.py", "<p>Prototype: <code>def element_at(my_list, idx):</code> Return the element at <code>idx</code>, or <code>None</code> if idx is negative or out of range. Don't use try/except.</p>", fn("element_at(my_list, idx)", "Retrieves an element safely"),
        head + 'def element_at(my_list, idx):\n    """Retrieves an element safely"""\n    if idx < 0 or idx >= len(my_list):\n        return None\n    return my_list[idx]\n',
        [{ main: 'f = __import__("1-element_at").element_at\nl = [1, 2, 3, 4, 5]\nprint(f(l, 3))\nprint(f(l, -1))\nprint(f(l, 5))\nprint(f(l, 0))\n', out: "4\nNone\nNone\n1\n" }]),
      py("Can you C me now?", "5-no_c.py", "<p>Prototype: <code>def no_c(my_string):</code> Return a copy of the string with all <code>c</code> and <code>C</code> removed. No imports, no <code>str.replace()</code>.</p>", fn("no_c(my_string)", "Removes all c and C characters"),
        head + 'def no_c(my_string):\n    """Removes all c and C characters"""\n    return "".join(ch for ch in my_string if ch not in "cC")\n',
        [{ main: 'no_c = __import__("5-no_c").no_c\nprint(no_c("Best School"))\nprint(no_c("Chicago"))\nprint(no_c("C is fun!"))\n', out: "Best Shool\nhiago\n is fun!\n" }]),
      py("Lists of lists = Matrix", "6-print_matrix_integer.py", "<p>Prototype: <code>def print_matrix_integer(matrix=[[]]):</code> Print a matrix of integers: numbers on a row separated by a space, one row per line. Use <code>str.format()</code>.</p>", fn("print_matrix_integer(matrix=[[]])", "Prints a matrix of integers"),
        head + 'def print_matrix_integer(matrix=[[]]):\n    """Prints a matrix of integers"""\n    for row in matrix:\n        print(" ".join("{:d}".format(n) for n in row))\n',
        [{ main: 'f = __import__("6-print_matrix_integer").print_matrix_integer\nf([[1, 2, 3], [4, 5, 6], [7, 8, 9]])\nprint("--")\nf()\n', out: "1 2 3\n4 5 6\n7 8 9\n--\n\n" }]),
      py("Find the max", "9-max_integer.py", "<p>Prototype: <code>def max_integer(my_list=[]):</code> Return the biggest integer, or <code>None</code> if the list is empty. Don't use <code>max()</code>.</p>", fn("max_integer(my_list=[])", "Finds the biggest integer"),
        head + 'def max_integer(my_list=[]):\n    """Finds the biggest integer"""\n    if not my_list:\n        return None\n    best = my_list[0]\n    for n in my_list:\n        if n > best:\n            best = n\n    return best\n',
        [{ main: 'f = __import__("9-max_integer").max_integer\nprint(f([1, 90, 2, 13, 34, 5, -13, 3]))\nprint(f([]))\nprint(f([-5, -2, -9]))\n', out: "90\nNone\n-2\n" }]),
      py("Only by 2", "10-divisible_by_2.py", "<p>Prototype: <code>def divisible_by_2(my_list=[]):</code> Return a new list of True/False saying whether each integer is a multiple of 2.</p>", fn("divisible_by_2(my_list=[])", "Finds multiples of 2"),
        head + 'def divisible_by_2(my_list=[]):\n    """Finds multiples of 2"""\n    return [n % 2 == 0 for n in my_list]\n',
        [{ main: 'f = __import__("10-divisible_by_2").divisible_by_2\nprint(f([0, 1, 2, 3, 4, 5, 6]))\n', out: "[True, False, True, False, True, False, True]\n" }]),
    ],
  };

  /* ---------------- 0x04 more data structures ---------------- */
  EX["hl-04"] = {
    quiz: [
      ["Which of these can be a dictionary key?", ["A list", "A tuple of ints", "A dict", "A set"], 1, "Keys must be hashable (immutable)."],
      ["What does <code>set([1, 2, 2, 3])</code> produce?", ["{1, 2, 2, 3}", "{1, 2, 3}", "[1, 2, 3]", "Error"], 1],
      ["What does <code>list(map(lambda x: x * 2, [1, 2]))</code> return?", ["[1, 2, 1, 2]", "[2, 4]", "[1, 4]", "map object"], 1],
      ["How do you iterate over keys and values of dict d?", ["for k, v in d:", "for k, v in d.items():", "for k in d.values():", "for (k, v) of d:"], 1],
      ["What does <code>d.get(\"x\", 0)</code> return if \"x\" isn't a key?", ["None", "0", "KeyError", "\"x\""], 1],
    ],
    tasks: [
      py("Squared simple", "0-square_matrix_simple.py", "<p>Prototype: <code>def square_matrix_simple(matrix=[]):</code> Return a new matrix with each value squared. Don't modify the original.</p>", fn("square_matrix_simple(matrix=[])", "Squares every value of a matrix"),
        head + 'def square_matrix_simple(matrix=[]):\n    """Squares every value of a matrix"""\n    return [[x ** 2 for x in row] for row in matrix]\n',
        [{ main: 'f = __import__("0-square_matrix_simple").square_matrix_simple\nm = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nprint(f(m))\nprint(m)\n', out: "[[1, 4, 9], [16, 25, 36], [49, 64, 81]]\n[[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n" }]),
      py("Search and replace", "1-search_replace.py", "<p>Prototype: <code>def search_replace(my_list, search, replace):</code> Return a new list with all occurrences of an element replaced.</p>", fn("search_replace(my_list, search, replace)", "Replaces all occurrences in a new list"),
        head + 'def search_replace(my_list, search, replace):\n    """Replaces all occurrences in a new list"""\n    return [replace if x == search else x for x in my_list]\n',
        [{ main: 'f = __import__("1-search_replace").search_replace\nl = [1, 2, 3, 4, 5, 4, 2, 1, 1, 4, 89]\nprint(f(l, 2, 89))\nprint(l)\n', out: "[1, 89, 3, 4, 5, 4, 89, 1, 1, 4, 89]\n[1, 2, 3, 4, 5, 4, 2, 1, 1, 4, 89]\n" }]),
      py("Unique addition", "2-uniq_add.py", "<p>Prototype: <code>def uniq_add(my_list=[]):</code> Return the sum of all <em>unique</em> integers in a list (each integer counted once).</p>", fn("uniq_add(my_list=[])", "Adds unique integers"),
        head + 'def uniq_add(my_list=[]):\n    """Adds unique integers"""\n    return sum(set(my_list))\n',
        [{ main: 'f = __import__("2-uniq_add").uniq_add\nprint(f([1, 2, 3, 1, 4, 2, 5]))\nprint(f([]))\n', out: "15\n0\n" }]),
      py("Sorted dictionary", "6-print_sorted_dictionary.py", "<p>Prototype: <code>def print_sorted_dictionary(a_dictionary):</code> Print a dictionary by ordered keys (one level), as <code>key: value</code>.</p>", fn("print_sorted_dictionary(a_dictionary)", "Prints a dictionary by sorted keys"),
        head + 'def print_sorted_dictionary(a_dictionary):\n    """Prints a dictionary by sorted keys"""\n    for k in sorted(a_dictionary):\n        print("{}: {}".format(k, a_dictionary[k]))\n',
        [{ main: 'f = __import__("6-print_sorted_dictionary").print_sorted_dictionary\nf({"language": "C", "Number": 89, "track": "Low level", "ids": [1, 2, 3]})\n', out: "Number: 89\nids: [1, 2, 3]\nlanguage: C\ntrack: Low level\n" }]),
      py("Best score", "10-best_score.py", "<p>Prototype: <code>def best_score(a_dictionary):</code> Return the key with the biggest integer value. Return <code>None</code> if the dictionary is empty or None.</p>", fn("best_score(a_dictionary)", "Returns the key with the best score"),
        head + 'def best_score(a_dictionary):\n    """Returns the key with the best score"""\n    if not a_dictionary:\n        return None\n    return max(a_dictionary, key=a_dictionary.get)\n',
        [{ main: 'f = __import__("10-best_score").best_score\nprint(f({"John": 12, "Bob": 14, "Mike": 14, "Molly": 16, "Adam": 10}))\nprint(f(None))\nprint(f({}))\n', out: "Molly\nNone\nNone\n" }]),
      py("Roman to Integer", "12-roman_to_int.py", "<p>Prototype: <code>def roman_to_int(roman_string):</code> Convert a Roman numeral to an integer (1 to 3999). If <code>roman_string</code> isn't a string or is None, return 0.</p>", fn("roman_to_int(roman_string)", "Converts a Roman numeral to an integer"),
        head + 'def roman_to_int(roman_string):\n    """Converts a Roman numeral to an integer"""\n    if not isinstance(roman_string, str):\n        return 0\n    v = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}\n    total = 0\n    for i, ch in enumerate(roman_string):\n        n = v.get(ch, 0)\n        if i + 1 < len(roman_string) and v.get(roman_string[i + 1], 0) > n:\n            total -= n\n        else:\n            total += n\n    return total\n',
        [{ main: 'f = __import__("12-roman_to_int").roman_to_int\nfor r in ["X", "VII", "IX", "LXXXVII", "DCCVII", "MCMXCIV", None]:\n    print(r, "=", f(r))\n', out: "X = 10\nVII = 7\nIX = 9\nLXXXVII = 87\nDCCVII = 707\nMCMXCIV = 1994\nNone = 0\n" }]),
    ],
  };

  /* ---------------- 0x05 exceptions ---------------- */
  EX["hl-05"] = {
    quiz: [
      ["When does the <code>else</code> block of a try statement run?", ["Always", "When no exception was raised in try", "When an exception was raised", "Never"], 1],
      ["When does <code>finally</code> run?", ["Only on success", "Only on error", "Always, whether or not there was an exception", "Never if there's a return"], 2],
      ["Which exception does <code>int(\"abc\")</code> raise?", ["TypeError", "ValueError", "NameError", "KeyError"], 1],
      ["Which exception does <code>[1, 2][5]</code> raise?", ["KeyError", "IndexError", "ValueError", "StopIteration"], 1],
    ],
    tasks: [
      py("Safe list printing", "0-safe_print_list.py", "<p>Prototype: <code>def safe_print_list(my_list=[], x=0):</code> Print <code>x</code> elements of a list on the same line, then a new line. Return the real number of elements printed. <code>x</code> can be bigger than the length of the list. Use try/except, not <code>len()</code>.</p>", fn("safe_print_list(my_list=[], x=0)", "Prints x elements of a list"),
        head + 'def safe_print_list(my_list=[], x=0):\n    """Prints x elements of a list"""\n    count = 0\n    for i in range(x):\n        try:\n            print(my_list[i], end="")\n            count += 1\n        except IndexError:\n            break\n    print()\n    return count\n',
        [{ main: 'f = __import__("0-safe_print_list").safe_print_list\nl = [1, 2, 3, 4, 5]\nn = f(l, 2)\nprint("nb_print: {:d}".format(n))\nn = f(l, len(l))\nprint("nb_print: {:d}".format(n))\nn = f(l, len(l) + 2)\nprint("nb_print: {:d}".format(n))\n', out: "12\nnb_print: 2\n12345\nnb_print: 5\n12345\nnb_print: 5\n" }]),
      py("Safe printing of an integer", "1-safe_print_integer.py", "<p>Prototype: <code>def safe_print_integer(value):</code> Print an integer with <code>\"{:d}\".format()</code> and return True; if value isn't an integer, return False (print nothing).</p>", fn("safe_print_integer(value)", "Prints an integer safely"),
        head + 'def safe_print_integer(value):\n    """Prints an integer safely"""\n    try:\n        print("{:d}".format(value))\n        return True\n    except (ValueError, TypeError):\n        return False\n',
        [{ main: 'f = __import__("1-safe_print_integer").safe_print_integer\nfor v in [89, -89, "School", 3.5]:\n    if not f(v):\n        print("{} is not an integer".format(v))\n', out: "89\n-89\nSchool is not an integer\n3.5 is not an integer\n" }]),
      py("Integers division with debug", "3-safe_print_division.py", "<p>Prototype: <code>def safe_print_division(a, b):</code> Divide 2 integers and print the result. Return the result, or None on error. Use try/except/finally; the result is printed in <code>finally</code>: <code>Inside result: {}</code>.</p>", fn("safe_print_division(a, b)", "Divides two integers safely"),
        head + 'def safe_print_division(a, b):\n    """Divides two integers safely"""\n    result = None\n    try:\n        result = a / b\n    except (ZeroDivisionError, TypeError):\n        result = None\n    finally:\n        print("Inside result: {}".format(result))\n    return result\n',
        [{ main: 'f = __import__("3-safe_print_division").safe_print_division\nr = f(12, 2)\nprint("{:d} / {:d} = {}".format(12, 2, r))\nr = f(12, 0)\nprint("{:d} / {:d} = {}".format(12, 0, r))\n', out: "Inside result: 6.0\n12 / 2 = 6.0\nInside result: None\n12 / 0 = None\n" }]),
      py("Raise exception", "5-raise_exception.py", "<p>Prototype: <code>def raise_exception():</code> Raise a type exception (<code>TypeError</code>).</p>", fn("raise_exception()", "Raises a TypeError"),
        head + 'def raise_exception():\n    """Raises a TypeError"""\n    raise TypeError\n',
        [{ main: 'f = __import__("5-raise_exception").raise_exception\ntry:\n    f()\nexcept TypeError:\n    print("Exception raised")\n', out: "Exception raised\n" }]),
      py("Raise a message", "6-raise_exception_msg.py", "<p>Prototype: <code>def raise_exception_msg(message=\"\"):</code> Raise a <code>NameError</code> with a message.</p>", fn('raise_exception_msg(message="")', "Raises a NameError with a message"),
        head + 'def raise_exception_msg(message=""):\n    """Raises a NameError with a message"""\n    raise NameError(message)\n',
        [{ main: 'f = __import__("6-raise_exception_msg").raise_exception_msg\ntry:\n    f("C is fun")\nexcept NameError as ne:\n    print(ne)\n', out: "C is fun\n" }]),
    ],
  };

  /* ---------------- 0x06 classes ---------------- */
  const SQ = (n, body) => `${head}"""Square module"""\n\n\nclass Square:\n    """Defines a square"""\n${body}`;
  EX["hl-06"] = {
    quiz: [
      ["What is <code>self</code> in a method?", ["A keyword for the class", "The instance the method is called on", "A global variable", "The parent class"], 1],
      ["What does a leading double underscore (<code>self.__size</code>) do?", ["Makes it truly private", "Triggers name mangling so it's harder to access from outside", "Makes it a class attribute", "Nothing"], 1],
      ["What is <code>__init__</code>?", ["The destructor", "The method that initialises a new instance", "A static method", "The module's main"], 1],
      ["What does <code>@property</code> let you do?", ["Make a method static", "Access a method like an attribute (getter), with an optional setter", "Inherit", "Make a constant"], 1],
      ["What is the difference between a class and an object?", ["None", "A class is the blueprint; an object is an instance of it", "Objects define classes", "Classes are instances"], 1],
    ],
    tasks: [
      py("My first square", "0-square.py", "<p>Write an empty class <code>Square</code> that defines a square.</p>", `${head}"""Square module"""\n`, SQ(0, "    pass\n"),
        [{ main: 'Square = __import__("0-square").Square\nmy_square = Square()\nprint(type(my_square))\nprint(my_square.__dict__)\n', out: "<class '0-square.Square'>\n{}\n" }]),
      py("Square with size", "1-square.py", "<p>Write a class <code>Square</code> with a private instance attribute <code>size</code> (no type/value validation). Instantiation with size (no default).</p>", `${head}"""Square module"""\n`,
        SQ(1, "    def __init__(self, size):\n        \"\"\"Initializes the square\"\"\"\n        self.__size = size\n"),
        [{ main: 'Square = __import__("1-square").Square\nmy_square = Square(3)\nprint(type(my_square))\nprint(my_square.__dict__)\ntry:\n    print(my_square.size)\nexcept Exception as e:\n    print(e)\n', out: "<class '1-square.Square'>\n{'_Square__size': 3}\n'Square' object has no attribute 'size'\n" }]),
      py("Size validation", "2-square.py", "<p>Add validation: optional size (default 0). If size isn't an integer, raise <code>TypeError(\"size must be an integer\")</code>; if size &lt; 0, raise <code>ValueError(\"size must be &gt;= 0\")</code>.</p>", `${head}"""Square module"""\n`,
        SQ(2, "    def __init__(self, size=0):\n        \"\"\"Initializes the square\"\"\"\n        if not isinstance(size, int):\n            raise TypeError(\"size must be an integer\")\n        if size < 0:\n            raise ValueError(\"size must be >= 0\")\n        self.__size = size\n"),
        [{ main: 'Square = __import__("2-square").Square\nprint(Square(3).__dict__)\nprint(Square().__dict__)\nfor bad in ["3", -1]:\n    try:\n        Square(bad)\n    except Exception as e:\n        print(type(e).__name__, e)\n', out: "{'_Square__size': 3}\n{'_Square__size': 0}\nTypeError size must be an integer\nValueError size must be >= 0\n" }]),
      py("Area and getter/setter", "4-square.py", "<p>Add a <code>size</code> property (getter + setter with the same validation as before) and a public method <code>area()</code> that returns the current square area.</p>", `${head}"""Square module"""\n`,
        SQ(4, "    def __init__(self, size=0):\n        \"\"\"Initializes the square\"\"\"\n        self.size = size\n\n    @property\n    def size(self):\n        \"\"\"Gets the size\"\"\"\n        return self.__size\n\n    @size.setter\n    def size(self, value):\n        \"\"\"Sets the size\"\"\"\n        if not isinstance(value, int):\n            raise TypeError(\"size must be an integer\")\n        if value < 0:\n            raise ValueError(\"size must be >= 0\")\n        self.__size = value\n\n    def area(self):\n        \"\"\"Returns the area\"\"\"\n        return self.__size ** 2\n"),
        [{ main: 'Square = __import__("4-square").Square\ns = Square(89)\nprint("Area: {} for size: {}".format(s.area(), s.size))\ns.size = 3\nprint("Area: {} for size: {}".format(s.area(), s.size))\ntry:\n    s.size = "5 feet"\nexcept Exception as e:\n    print(e)\n', out: "Area: 7921 for size: 89\nArea: 9 for size: 3\nsize must be an integer\n" }]),
      py("Printing a square", "5-square.py", "<p>Add <code>my_print()</code>, which prints the square with the character <code>#</code>. If size is 0, print an empty line.</p>", `${head}"""Square module"""\n`,
        SQ(5, "    def __init__(self, size=0):\n        \"\"\"Initializes the square\"\"\"\n        self.size = size\n\n    @property\n    def size(self):\n        \"\"\"Gets the size\"\"\"\n        return self.__size\n\n    @size.setter\n    def size(self, value):\n        \"\"\"Sets the size\"\"\"\n        if not isinstance(value, int):\n            raise TypeError(\"size must be an integer\")\n        if value < 0:\n            raise ValueError(\"size must be >= 0\")\n        self.__size = value\n\n    def area(self):\n        \"\"\"Returns the area\"\"\"\n        return self.__size ** 2\n\n    def my_print(self):\n        \"\"\"Prints the square with #\"\"\"\n        if self.__size == 0:\n            print()\n        for _ in range(self.__size):\n            print(\"#\" * self.__size)\n"),
        [{ main: 'Square = __import__("5-square").Square\nSquare(3).my_print()\nprint("--")\nSquare(0).my_print()\nprint("--")\n', out: "###\n###\n###\n--\n\n--\n" }]),
    ],
  };

  /* ---------------- 0x07 TDD ---------------- */
  EX["hl-07"] = {
    quiz: [
      ["Where do doctests live?", ["In a separate .c file", "In docstrings, as interactive examples (>>> …)", "In comments with #", "In main.py only"], 1],
      ["How do you run the doctests of a file?", ["python3 -m doctest -v file.txt", "python3 doctest file", "pytest --doctest", "betty file"], 0],
      ["What's the TDD cycle?", ["Code, ship, test", "Write a failing test, make it pass, refactor", "Refactor, test, code", "Test only at the end"], 1],
      ["Which method of unittest.TestCase checks that an exception is raised?", ["assertRaises", "assertError", "assertException", "assertFails"], 0],
    ],
    tasks: [
      py("Integers addition", "0-add_integer.py", "<p>Prototype: <code>def add_integer(a, b=98):</code> Add 2 integers. a and b must be integers or floats, otherwise raise a <code>TypeError</code> with the message <code>a must be an integer</code> or <code>b must be an integer</code>. Floats are cast to int first. Return a + b as an int.</p>", fn("add_integer(a, b=98)", "Adds two integers"),
        head + '"""Module that adds two integers"""\n\n\ndef add_integer(a, b=98):\n    """Adds two integers or floats (cast to int)"""\n    if not isinstance(a, (int, float)):\n        raise TypeError("a must be an integer")\n    if not isinstance(b, (int, float)):\n        raise TypeError("b must be an integer")\n    return int(a) + int(b)\n',
        [{ main: 'f = __import__("0-add_integer").add_integer\nprint(f(1, 2))\nprint(f(100, -2))\nprint(f(2))\nprint(f(100.3, -2))\nfor args in [(4, "School"), (None,)]:\n    try:\n        print(f(*args))\n    except Exception as e:\n        print(e)\n', out: "3\n98\n100\n98\nb must be an integer\na must be an integer\n" }]),
      py("Say my name", "3-say_my_name.py", "<p>Prototype: <code>def say_my_name(first_name, last_name=\"\"):</code> Print <code>My name is &lt;first name&gt; &lt;last name&gt;</code>. Both must be strings, otherwise raise TypeError <code>first_name must be a string</code> or <code>last_name must be a string</code>.</p>", fn('say_my_name(first_name, last_name="")', "Prints My name is ..."),
        head + '"""Say my name module"""\n\n\ndef say_my_name(first_name, last_name=""):\n    """Prints My name is <first> <last>"""\n    if not isinstance(first_name, str):\n        raise TypeError("first_name must be a string")\n    if not isinstance(last_name, str):\n        raise TypeError("last_name must be a string")\n    print("My name is {} {}".format(first_name, last_name))\n',
        [{ main: 'f = __import__("3-say_my_name").say_my_name\nf("John", "Smith")\nf("Walter", "White")\nf("Bob")\ntry:\n    f(12, "White")\nexcept Exception as e:\n    print(e)\n', out: "My name is John Smith\nMy name is Walter White\nMy name is Bob \nfirst_name must be a string\n" }]),
      py("Max integer — write the unittests", "tests/6-max_integer_test.py", "<p>Here the tables turn: the function exists (<code>6-max_integer.py</code>, see below), you write the <strong>unittest</strong> for it. Your test module must define a <code>TestMaxInteger(unittest.TestCase)</code> with at least 5 test methods (empty list, one element, max at the beginning, max in the middle, negative numbers…). The checker runs your tests against the correct function (all must pass) and against a buggy one (at least one must fail).</p><pre class=\"code\">def max_integer(list=[]):\n    if len(list) == 0:\n        return None\n    result = list[0]\n    i = 1\n    while i &lt; len(list):\n        if list[i] &gt; result:\n            result = list[i]\n        i += 1\n    return result</pre>",
        '#!/usr/bin/python3\n"""Unittest for max_integer([..])"""\nimport unittest\nmax_integer = __import__(\'6-max_integer\').max_integer\n\n\nclass TestMaxInteger(unittest.TestCase):\n    """Tests for max_integer"""\n\n    def test_ordered(self):\n        self.assertEqual(max_integer([1, 2, 3, 4]), 4)\n',
        '#!/usr/bin/python3\n"""Unittest for max_integer([..])"""\nimport unittest\nmax_integer = __import__(\'6-max_integer\').max_integer\n\n\nclass TestMaxInteger(unittest.TestCase):\n    """Tests for max_integer"""\n\n    def test_ordered(self):\n        self.assertEqual(max_integer([1, 2, 3, 4]), 4)\n\n    def test_max_first(self):\n        self.assertEqual(max_integer([4, 3, 2, 1]), 4)\n\n    def test_max_middle(self):\n        self.assertEqual(max_integer([1, 3, 4, 2]), 4)\n\n    def test_one(self):\n        self.assertEqual(max_integer([7]), 7)\n\n    def test_empty(self):\n        self.assertIsNone(max_integer([]))\n\n    def test_negative(self):\n        self.assertEqual(max_integer([-3, -1, -7]), -1)\n',
        [{ label: "Your tests pass on the correct function", main: 'import sys, unittest, io\nsys.path.insert(0, "tests")\nimport importlib\nm = importlib.import_module("6-max_integer_test")\nsuite = unittest.defaultTestLoader.loadTestsFromModule(m)\nr = unittest.TextTestRunner(stream=io.StringIO()).run(suite)\nprint("tests:", "enough" if r.testsRun >= 5 else "need at least 5")\nprint("all pass" if r.wasSuccessful() else "some fail")\n', out: "tests: enough\nall pass\n" },
         { label: "Your tests catch a buggy max_integer", main: 'import sys, unittest, io, importlib\nsys.path.insert(0, "tests")\nbuggy = type(sys)("6-max_integer")\nbuggy.max_integer = lambda l=[]: (None if not l else l[-1])\nsys.modules["6-max_integer"] = buggy\nm = importlib.import_module("6-max_integer_test")\nsuite = unittest.defaultTestLoader.loadTestsFromModule(m)\nr = unittest.TextTestRunner(stream=io.StringIO()).run(suite)\nprint("bug caught" if not r.wasSuccessful() else "bug NOT caught")\n', out: "bug caught\n" }],
        { extraFiles: { "6-max_integer.py": "#!/usr/bin/python3\n\"\"\"Module to find the max integer in a list\"\"\"\n\n\ndef max_integer(list=[]):\n    \"\"\"Function to find and return the max integer in a list of integers\"\"\"\n    if len(list) == 0:\n        return None\n    result = list[0]\n    i = 1\n    while i < len(list):\n        if list[i] > result:\n            result = list[i]\n        i += 1\n    return result\n" } }),
    ],
  };

  /* ---------------- 0x08 more classes ---------------- */
  const RECT = (extra) => `${head}"""Rectangle module"""\n\n\nclass Rectangle:\n    """Defines a rectangle"""\n${extra.cls || ""}\n    def __init__(self, width=0, height=0):\n        """Initializes the rectangle"""\n        self.width = width\n        self.height = height\n${extra.init || ""}\n    @property\n    def width(self):\n        """Gets the width"""\n        return self.__width\n\n    @width.setter\n    def width(self, value):\n        """Sets the width"""\n        if not isinstance(value, int):\n            raise TypeError("width must be an integer")\n        if value < 0:\n            raise ValueError("width must be >= 0")\n        self.__width = value\n\n    @property\n    def height(self):\n        """Gets the height"""\n        return self.__height\n\n    @height.setter\n    def height(self, value):\n        """Sets the height"""\n        if not isinstance(value, int):\n            raise TypeError("height must be an integer")\n        if value < 0:\n            raise ValueError("height must be >= 0")\n        self.__height = value\n\n    def area(self):\n        """Returns the area"""\n        return self.__width * self.__height\n\n    def perimeter(self):\n        """Returns the perimeter"""\n        if self.__width == 0 or self.__height == 0:\n            return 0\n        return 2 * (self.__width + self.__height)\n${extra.more || ""}`;
  const STR = `\n    def __str__(self):\n        """Returns the rectangle drawn with #"""\n        if self.width == 0 or self.height == 0:\n            return ""\n        return "\\n".join(["#" * self.width] * self.height)\n`;
  EX["hl-08"] = {
    quiz: [
      ["What's the difference between <code>__str__</code> and <code>__repr__</code>?", ["None", "__str__ is for users (print); __repr__ is unambiguous, ideally eval()-able", "__repr__ is for print", "__str__ must return a list"], 1],
      ["What's a class attribute?", ["An attribute defined on the class, shared by all instances", "An attribute of one instance", "A private attribute", "A method"], 0],
      ["What does <code>@classmethod</code> receive as first argument?", ["self", "cls (the class)", "Nothing", "The module"], 1],
      ["When is <code>__del__</code> called?", ["When the object is created", "When the object is about to be destroyed", "On print", "Never"], 1],
    ],
    tasks: [
      py("Area and perimeter", "2-rectangle.py", "<p>Write a class <code>Rectangle</code> with private <code>width</code> and <code>height</code> (properties with validation: TypeError <code>width must be an integer</code>, ValueError <code>width must be &gt;= 0</code>, same for height), <code>area()</code> and <code>perimeter()</code> (0 if width or height is 0).</p>", `${head}"""Rectangle module"""\n`, RECT({}),
        [{ main: 'Rectangle = __import__("2-rectangle").Rectangle\nr = Rectangle(2, 4)\nprint("Area: {} - Perimeter: {}".format(r.area(), r.perimeter()))\nr = Rectangle(0, 4)\nprint("Area: {} - Perimeter: {}".format(r.area(), r.perimeter()))\ntry:\n    Rectangle(-1, 2)\nexcept ValueError as e:\n    print(e)\ntry:\n    Rectangle(1, "2")\nexcept TypeError as e:\n    print(e)\n', out: "Area: 8 - Perimeter: 12\nArea: 0 - Perimeter: 0\nwidth must be >= 0\nheight must be an integer\n" }]),
      py("String representation", "4-rectangle.py", "<p>Add <code>__str__</code> (draw the rectangle with <code>#</code>; empty string if width or height is 0) and <code>__repr__</code> returning a string that can recreate it with <code>eval()</code>: <code>Rectangle(2, 4)</code>.</p>", `${head}"""Rectangle module"""\n`,
        RECT({ more: STR + `\n    def __repr__(self):\n        """Returns a string to recreate the rectangle"""\n        return "Rectangle({}, {})".format(self.width, self.height)\n` }),
        [{ main: 'Rectangle = __import__("4-rectangle").Rectangle\nr = Rectangle(2, 4)\nprint(str(r))\nprint(repr(r))\nr2 = eval(repr(r))\nprint(r2.area(), r2 is r)\nprint("[{}]".format(Rectangle(0, 3)))\n', out: "##\n##\n##\n##\nRectangle(2, 4)\n8 False\n[]\n" }]),
      py("Instances counter and bye", "6-rectangle.py", "<p>Add a public class attribute <code>number_of_instances</code> (incremented on creation, decremented on deletion) and <code>__del__</code> printing <code>Bye rectangle...</code>.</p>", `${head}"""Rectangle module"""\n`,
        RECT({ cls: "    number_of_instances = 0\n", init: "        Rectangle.number_of_instances += 1\n", more: `\n    def __del__(self):\n        """Says bye and updates the counter"""\n        Rectangle.number_of_instances -= 1\n        print("Bye rectangle...")\n` }),
        [{ main: 'Rectangle = __import__("6-rectangle").Rectangle\na = Rectangle(2, 4)\nb = Rectangle(2, 4)\nprint("{:d} instances".format(Rectangle.number_of_instances))\ndel a\nprint("{:d} instances".format(Rectangle.number_of_instances))\ndel b\nprint("{:d} instances".format(Rectangle.number_of_instances))\n', out: "2 instances\nBye rectangle...\n1 instances\nBye rectangle...\n0 instances\n" }]),
      py("Compare rectangles & a square", "9-rectangle.py", "<p>Add a static method <code>bigger_or_equal(rect_1, rect_2)</code> returning the biggest rectangle by area (rect_1 if equal; TypeError <code>rect_1 must be an instance of Rectangle</code> / <code>rect_2 …</code>), and a class method <code>square(cls, size=0)</code> returning a new Rectangle with width == height == size.</p>", `${head}"""Rectangle module"""\n`,
        RECT({ more: `\n    @staticmethod\n    def bigger_or_equal(rect_1, rect_2):\n        """Returns the bigger rectangle"""\n        if not isinstance(rect_1, Rectangle):\n            raise TypeError("rect_1 must be an instance of Rectangle")\n        if not isinstance(rect_2, Rectangle):\n            raise TypeError("rect_2 must be an instance of Rectangle")\n        return rect_1 if rect_1.area() >= rect_2.area() else rect_2\n\n    @classmethod\n    def square(cls, size=0):\n        """Creates a square rectangle"""\n        return cls(size, size)\n` }),
        [{ main: 'Rectangle = __import__("9-rectangle").Rectangle\na = Rectangle(3, 4)\nb = Rectangle(2, 6)\nprint(Rectangle.bigger_or_equal(a, b) is a)\nc = Rectangle(10, 1)\nprint(Rectangle.bigger_or_equal(a, c) is a)\ns = Rectangle.square(5)\nprint(s.width, s.height, s.area())\ntry:\n    Rectangle.bigger_or_equal(a, 3)\nexcept TypeError as e:\n    print(e)\n', out: "True\nTrue\n5 5 25\nrect_2 must be an instance of Rectangle\n" }]),
    ],
  };

  /* ---------------- 0x09 everything is object ---------------- */
  EX["hl-09"] = {
    quiz: [
      ["After <code>a = [1, 2]; b = a; b.append(3)</code>, what is <code>a</code>?", ["[1, 2]", "[1, 2, 3]", "Error", "[3]"], 1],
      ["After <code>a = 89; b = a + 1</code>, does a change?", ["Yes, a is 90", "No, ints are immutable", "It's undefined", "a becomes None"], 1],
      ["What does <code>a is b</code> test?", ["Equal values", "Same object (identity)", "Same type", "Both are None"], 1],
      ["Which of these is mutable?", ["tuple", "str", "frozenset", "list"], 3],
      ["What's printed?<pre class=\"code\">def inc(n):\n    n += 1\na = 1\ninc(a)\nprint(a)</pre>", ["1", "2", "None", "Error"], 0],
      ["What does <code>()</code> vs <code>(1,)</code> vs <code>(1)</code> give?", ["three tuples", "empty tuple, a tuple of one, an int", "all ints", "all errors"], 1],
    ],
    tasks: [
      py("Clone a list symbol", "19-copy_list.py", "<p>Prototype: <code>def copy_list(l):</code> Return a <em>copy</em> of a list (a new object).</p>", fn("copy_list(l)", "Returns a copy of a list"),
        head + 'def copy_list(l):\n    """Returns a copy of a list"""\n    return l[:]\n',
        [{ main: 'f = __import__("19-copy_list").copy_list\nl = [1, 2, 3]\nc = f(l)\nprint(c, c == l, c is l)\n', out: "[1, 2, 3] True False\n" }]),
    ],
  };

  /* ---------------- 0x0A inheritance ---------------- */
  const BG = `${head}"""BaseGeometry module"""\n\n\nclass BaseGeometry:\n    """Base geometry"""\n\n    def area(self):\n        """Not implemented"""\n        raise Exception("area() is not implemented")\n\n    def integer_validator(self, name, value):\n        """Validates value"""\n        if type(value) is not int:\n            raise TypeError("{} must be an integer".format(name))\n        if value <= 0:\n            raise ValueError("{} must be greater than 0".format(name))\n`;
  EX["hl-0A"] = {
    quiz: [
      ["What does <code>super().__init__()</code> do?", ["Calls the parent class's __init__", "Creates a superclass", "Deletes the object", "Calls __init__ twice"], 0],
      ["What's the difference between <code>isinstance(obj, A)</code> and <code>type(obj) is A</code>?", ["None", "isinstance also accepts subclasses", "type also accepts subclasses", "isinstance only works for builtins"], 1],
      ["Every class in Python 3 implicitly inherits from…", ["type", "object", "Base", "nothing"], 1],
      ["What does overriding a method mean?", ["Calling it twice", "Defining a method with the same name in a subclass to replace the parent's behaviour", "Deleting it", "Making it private"], 1],
    ],
    tasks: [
      py("Same class or inherit from", "3-is_kind_of_class.py", "<p>Prototype: <code>def is_kind_of_class(obj, a_class):</code> Return True if the object is an instance of, or of a class that inherited from, the specified class; otherwise False.</p>", fn("is_kind_of_class(obj, a_class)", "Checks instance or inherited instance"),
        head + 'def is_kind_of_class(obj, a_class):\n    """Checks instance or inherited instance"""\n    return isinstance(obj, a_class)\n',
        [{ main: 'f = __import__("3-is_kind_of_class").is_kind_of_class\nprint(f(1, int), f(1, object), f(True, int), f(1, float))\n', out: "True True True False\n" }]),
      py("Only sub class of", "4-inherits_from.py", "<p>Prototype: <code>def inherits_from(obj, a_class):</code> Return True only if the object is an instance of a class that inherited (directly or indirectly) from the specified class — not the class itself.</p>", fn("inherits_from(obj, a_class)", "Checks strict inheritance"),
        head + 'def inherits_from(obj, a_class):\n    """Checks strict inheritance"""\n    return isinstance(obj, a_class) and type(obj) is not a_class\n',
        [{ main: 'f = __import__("4-inherits_from").inherits_from\nprint(f(True, int), f(1, int), f(True, object), f(1, float))\n', out: "True False True False\n" }]),
      py("Integer validator", "7-base_geometry.py", "<p>Write a class <code>BaseGeometry</code> with <code>area()</code> raising <code>Exception(\"area() is not implemented\")</code> and <code>integer_validator(self, name, value)</code>: if value isn't an int raise <code>TypeError(\"&lt;name&gt; must be an integer\")</code>; if value &lt;= 0 raise <code>ValueError(\"&lt;name&gt; must be greater than 0\")</code>.</p>", `${head}"""BaseGeometry module"""\n`, BG,
        [{ main: 'BaseGeometry = __import__("7-base_geometry").BaseGeometry\nbg = BaseGeometry()\nbg.integer_validator("my_int", 12)\nfor name, v in [("name", "John"), ("age", 0), ("distance", -4)]:\n    try:\n        bg.integer_validator(name, v)\n    except Exception as e:\n        print("[{}] {}".format(e.__class__.__name__, e))\ntry:\n    bg.area()\nexcept Exception as e:\n    print(e)\n', out: "[TypeError] name must be an integer\n[ValueError] age must be greater than 0\n[ValueError] distance must be greater than 0\narea() is not implemented\n" }]),
      py("Full rectangle", "9-rectangle.py", "<p>Write a class <code>Rectangle</code> that inherits from <code>BaseGeometry</code> (in <code>7-base_geometry.py</code>, provided). Private width and height validated by <code>integer_validator</code>; implement <code>area()</code> and <code>__str__</code> returning <code>[Rectangle] &lt;width&gt;/&lt;height&gt;</code>.</p>",
        `${head}"""Rectangle module"""\nBaseGeometry = __import__('7-base_geometry').BaseGeometry\n`,
        `${head}"""Rectangle module"""\nBaseGeometry = __import__('7-base_geometry').BaseGeometry\n\n\nclass Rectangle(BaseGeometry):\n    """Rectangle from BaseGeometry"""\n\n    def __init__(self, width, height):\n        """Initializes with validated sizes"""\n        self.integer_validator("width", width)\n        self.integer_validator("height", height)\n        self.__width = width\n        self.__height = height\n\n    def area(self):\n        """Returns the area"""\n        return self.__width * self.__height\n\n    def __str__(self):\n        """Returns [Rectangle] w/h"""\n        return "[Rectangle] {}/{}".format(self.__width, self.__height)\n`,
        [{ main: 'Rectangle = __import__("9-rectangle").Rectangle\nr = Rectangle(3, 5)\nprint(r)\nprint(r.area())\nprint(issubclass(Rectangle, __import__("7-base_geometry").BaseGeometry))\ntry:\n    Rectangle(4, True)\nexcept Exception as e:\n    print(e)\n', out: "[Rectangle] 3/5\n15\nTrue\nheight must be an integer\n" }],
        { extraFiles: { "7-base_geometry.py": BG } }),
    ],
  };

  /* ---------------- 0x0B input/output ---------------- */
  EX["hl-0B"] = {
    quiz: [
      ["Why use <code>with open(...) as f:</code>?", ["It's faster", "The file is closed automatically, even on errors", "It opens in binary mode", "It's required for writing"], 1],
      ["Which mode appends to a file?", ["\"r\"", "\"w\"", "\"a\"", "\"x\""], 2],
      ["What does <code>json.dumps([1, \"a\"])</code> return?", ["[1, \"a\"] as a list", "the string '[1, \"a\"]'", "bytes", "Error"], 1],
      ["What's serialization?", ["Sorting data", "Turning an object into a storable/transmittable format (e.g. JSON)", "Compressing files", "Encrypting data"], 1],
    ],
    tasks: [
      py("Read file", "0-read_file.py", "<p>Prototype: <code>def read_file(filename=\"\"):</code> Read a text file (UTF8) and print it to stdout. Use <code>with</code>.</p>", fn('read_file(filename="")', "Reads and prints a text file"),
        head + 'def read_file(filename=""):\n    """Reads and prints a text file"""\n    with open(filename, encoding="utf-8") as f:\n        print(f.read(), end="")\n',
        [{ main: 'f = __import__("0-read_file").read_file\nf("my_file_0.txt")\n', out: "We offer a truly innovative approach to education:\nfocus on building reliable applications and scalable systems.\n" }],
        { extraFiles: { "my_file_0.txt": "We offer a truly innovative approach to education:\nfocus on building reliable applications and scalable systems.\n" } }),
      py("Write to a file", "1-write_file.py", "<p>Prototype: <code>def write_file(filename=\"\", text=\"\"):</code> Write a string to a text file (UTF8), overwriting it, and return the number of characters written.</p>", fn('write_file(filename="", text="")', "Writes text to a file"),
        head + 'def write_file(filename="", text=""):\n    """Writes text to a file"""\n    with open(filename, "w", encoding="utf-8") as f:\n        return f.write(text)\n',
        [{ main: 'f = __import__("1-write_file").write_file\nprint(f("my_first_file.txt", "This School is so cool!\\n"))\nwith open("my_first_file.txt") as fh:\n    print(fh.read(), end="")\n', out: "24\nThis School is so cool!\n" }]),
      py("To JSON string", "3-to_json_string.py", "<p>Prototype: <code>def to_json_string(my_obj):</code> Return the JSON representation of an object (string).</p>", fn("to_json_string(my_obj)", "Returns the JSON string of an object"),
        head + 'import json\n\n\ndef to_json_string(my_obj):\n    """Returns the JSON string of an object"""\n    return json.dumps(my_obj)\n',
        [{ main: 'f = __import__("3-to_json_string").to_json_string\nprint(f([1, 2, 3]))\nprint(f({"id": 12, "name": "John", "places": ["San Francisco", "Tokyo"], "is_active": True, "info": {"age": 36, "average": 3.14}}))\nprint(type(f(True)).__name__, f(None))\n', out: '[1, 2, 3]\n{"id": 12, "name": "John", "places": ["San Francisco", "Tokyo"], "is_active": true, "info": {"age": 36, "average": 3.14}}\nstr null\n' }]),
      py("Student to JSON with filter", "10-student.py", "<p>Write a class <code>Student</code> with public attributes <code>first_name</code>, <code>last_name</code>, <code>age</code>, and <code>to_json(self, attrs=None)</code> returning a dict of the instance. If <code>attrs</code> is a list of strings, only those attribute names that exist are included.</p>", `${head}"""Student module"""\n`,
        `${head}"""Student module"""\n\n\nclass Student:\n    """A student"""\n\n    def __init__(self, first_name, last_name, age):\n        """Initializes the student"""\n        self.first_name = first_name\n        self.last_name = last_name\n        self.age = age\n\n    def to_json(self, attrs=None):\n        """Returns a dict representation"""\n        if isinstance(attrs, list) and all(isinstance(a, str) for a in attrs):\n            return {a: getattr(self, a) for a in attrs if hasattr(self, a)}\n        return self.__dict__\n`,
        [{ main: 'Student = __import__("10-student").Student\ns = Student("John", "Doe", 23)\nprint(sorted(s.to_json().items()))\nprint(s.to_json(["first_name", "age"]))\nprint(s.to_json(["middle_name", "age"]))\n', out: "[('age', 23), ('first_name', 'John'), ('last_name', 'Doe')]\n{'first_name': 'John', 'age': 23}\n{'age': 23}\n" }]),
      py("Pascal's Triangle", "12-pascal_triangle.py", "<p>Prototype: <code>def pascal_triangle(n):</code> Return a list of lists of integers representing Pascal's triangle of n. Return an empty list if n &lt;= 0.</p>", fn("pascal_triangle(n)", "Returns Pascal's triangle of n"),
        head + 'def pascal_triangle(n):\n    """Returns Pascal\'s triangle of n"""\n    rows = []\n    for i in range(n):\n        row = [1] * (i + 1)\n        for j in range(1, i):\n            row[j] = rows[i - 1][j - 1] + rows[i - 1][j]\n        rows.append(row)\n    return rows\n',
        [{ main: 'f = __import__("12-pascal_triangle").pascal_triangle\nfor row in f(5):\n    print("[{}]".format(",".join([str(x) for x in row])))\nprint(f(0))\n', out: "[1]\n[1,1]\n[1,2,1]\n[1,3,3,1]\n[1,4,6,4,1]\n[]\n" }]),
    ],
  };

  /* ---------------- 0x0C almost a circle ---------------- */
  const BASE = `${head}"""Base module"""\nimport json\n\n\nclass Base:\n    """Base class managing ids"""\n    __nb_objects = 0\n\n    def __init__(self, id=None):\n        """Initializes the id"""\n        if id is not None:\n            self.id = id\n        else:\n            Base.__nb_objects += 1\n            self.id = Base.__nb_objects\n\n    @staticmethod\n    def to_json_string(list_dictionaries):\n        """Returns the JSON string of a list of dicts"""\n        if not list_dictionaries:\n            return "[]"\n        return json.dumps(list_dictionaries)\n`;
  const RECT_AC = `${head}"""Rectangle module"""\nfrom models.base import Base\n\n\nclass Rectangle(Base):\n    """Rectangle that inherits from Base"""\n\n    def __init__(self, width, height, x=0, y=0, id=None):\n        """Initializes the rectangle"""\n        super().__init__(id)\n        self.width = width\n        self.height = height\n        self.x = x\n        self.y = y\n\n    @staticmethod\n    def _check(name, value, positive):\n        if type(value) is not int:\n            raise TypeError("{} must be an integer".format(name))\n        if positive and value <= 0:\n            raise ValueError("{} must be > 0".format(name))\n        if not positive and value < 0:\n            raise ValueError("{} must be >= 0".format(name))\n\n    @property\n    def width(self):\n        """width"""\n        return self.__width\n\n    @width.setter\n    def width(self, value):\n        self._check("width", value, True)\n        self.__width = value\n\n    @property\n    def height(self):\n        """height"""\n        return self.__height\n\n    @height.setter\n    def height(self, value):\n        self._check("height", value, True)\n        self.__height = value\n\n    @property\n    def x(self):\n        """x"""\n        return self.__x\n\n    @x.setter\n    def x(self, value):\n        self._check("x", value, False)\n        self.__x = value\n\n    @property\n    def y(self):\n        """y"""\n        return self.__y\n\n    @y.setter\n    def y(self, value):\n        self._check("y", value, False)\n        self.__y = value\n\n    def area(self):\n        """Returns the area"""\n        return self.width * self.height\n\n    def __str__(self):\n        """[Rectangle] (<id>) <x>/<y> - <width>/<height>"""\n        return "[Rectangle] ({}) {}/{} - {}/{}".format(self.id, self.x, self.y, self.width, self.height)\n\n    def update(self, *args, **kwargs):\n        """Updates attributes"""\n        names = ["id", "width", "height", "x", "y"]\n        if args:\n            for name, value in zip(names, args):\n                setattr(self, name, value)\n        else:\n            for name, value in kwargs.items():\n                if name in names:\n                    setattr(self, name, value)\n\n    def to_dictionary(self):\n        """Returns the dict representation"""\n        return {"id": self.id, "width": self.width, "height": self.height, "x": self.x, "y": self.y}\n`;
  EX["hl-0C"] = {
    quiz: [
      ["What does <code>*args</code> collect?", ["Keyword arguments in a dict", "Extra positional arguments in a tuple", "Only strings", "Nothing"], 1],
      ["What does <code>**kwargs</code> collect?", ["Extra keyword arguments in a dict", "Positional arguments", "A list", "Default values"], 0],
      ["Why put an <code>__init__.py</code> file in a folder?", ["To make it a Python package (importable)", "To run tests", "It's a config file", "To hide the folder"], 0],
      ["How do you run all unittests in a <code>tests</code> folder?", ["python3 -m unittest discover tests", "python3 tests", "pytest -run", "make test"], 0],
    ],
    tasks: [
      py("Base class", "models/base.py", "<p>Write <code>models/base.py</code> with a class <code>Base</code>: private class attribute <code>__nb_objects = 0</code>; <code>__init__(self, id=None)</code> — if id isn't None, assign it to the public attribute <code>id</code>, otherwise increment <code>__nb_objects</code> and use it. Also add the static method <code>to_json_string(list_dictionaries)</code> (returns <code>\"[]\"</code> for None or empty).</p>", `${head}"""Base module"""\n`, BASE,
        [{ main: 'from models.base import Base\nprint(Base().id)\nprint(Base().id)\nprint(Base(12).id)\nprint(Base().id)\nprint(Base.to_json_string(None))\nprint(Base.to_json_string([{"id": 12}]))\n', out: "1\n2\n12\n3\n[]\n[{\"id\": 12}]\n" }],
        { extraFiles: { "models/__init__.py": "" } }),
      py("Rectangle (validation, update, to_dictionary)", "models/rectangle.py", "<p>Write <code>models/rectangle.py</code>: class <code>Rectangle(Base)</code> with private <code>width, height, x, y</code> (properties), <code>__init__(self, width, height, x=0, y=0, id=None)</code> calling <code>super().__init__(id)</code>. Validation: TypeError <code>&lt;attr&gt; must be an integer</code>; width/height ValueError <code>&lt;attr&gt; must be &gt; 0</code>; x/y ValueError <code>&lt;attr&gt; must be &gt;= 0</code>. Add <code>area()</code>, <code>__str__</code> → <code>[Rectangle] (&lt;id&gt;) &lt;x&gt;/&lt;y&gt; - &lt;width&gt;/&lt;height&gt;</code>, <code>update(*args, **kwargs)</code> (order: id, width, height, x, y; kwargs only if no args) and <code>to_dictionary()</code>.</p>",
        `${head}"""Rectangle module"""\nfrom models.base import Base\n`, RECT_AC,
        [{ main: 'from models.rectangle import Rectangle\nr = Rectangle(10, 2)\nprint(r.id, r.area())\nr = Rectangle(4, 6, 2, 1, 12)\nprint(r)\nr.update(89, 2)\nprint(r)\nr.update(y=7, width=3)\nprint(r)\nprint(sorted(r.to_dictionary().items()))\nfor args in [(10, "2"), (10, 2, -1), (0, 2)]:\n    try:\n        Rectangle(*args)\n    except Exception as e:\n        print("[{}] {}".format(type(e).__name__, e))\n', out: "1 20\n[Rectangle] (12) 2/1 - 4/6\n[Rectangle] (89) 2/1 - 2/6\n[Rectangle] (89) 2/7 - 3/6\n[('height', 6), ('id', 89), ('width', 3), ('x', 2), ('y', 7)]\n[TypeError] height must be an integer\n[ValueError] x must be >= 0\n[ValueError] width must be > 0\n" }],
        { extraFiles: { "models/__init__.py": "", "models/base.py": BASE } }),
      py("And now, the Square!", "models/square.py", "<p>Write <code>models/square.py</code>: class <code>Square(Rectangle)</code> with <code>__init__(self, size, x=0, y=0, id=None)</code>, a <code>size</code> property (sets width and height, same validation as width), <code>__str__</code> → <code>[Square] (&lt;id&gt;) &lt;x&gt;/&lt;y&gt; - &lt;size&gt;</code>, <code>update(*args, **kwargs)</code> (order: id, size, x, y) and <code>to_dictionary()</code> with keys id, size, x, y.</p>",
        `${head}"""Square module"""\nfrom models.rectangle import Rectangle\n`,
        `${head}"""Square module"""\nfrom models.rectangle import Rectangle\n\n\nclass Square(Rectangle):\n    """Square"""\n\n    def __init__(self, size, x=0, y=0, id=None):\n        """Initializes the square"""\n        super().__init__(size, size, x, y, id)\n\n    @property\n    def size(self):\n        """size"""\n        return self.width\n\n    @size.setter\n    def size(self, value):\n        self.width = value\n        self.height = value\n\n    def __str__(self):\n        return "[Square] ({}) {}/{} - {}".format(self.id, self.x, self.y, self.width)\n\n    def update(self, *args, **kwargs):\n        """Updates attributes"""\n        names = ["id", "size", "x", "y"]\n        if args:\n            for name, value in zip(names, args):\n                setattr(self, name, value)\n        else:\n            for name, value in kwargs.items():\n                if name in names:\n                    setattr(self, name, value)\n\n    def to_dictionary(self):\n        """Returns the dict representation"""\n        return {"id": self.id, "size": self.size, "x": self.x, "y": self.y}\n`,
        [{ main: 'from models.square import Square\ns = Square(5, id=1)\nprint(s)\nprint(s.area())\ns.size = 10\nprint(s)\ns.update(10, 2, 3, 4)\nprint(s)\ns.update(x=12, size=7)\nprint(s)\nprint(sorted(s.to_dictionary().items()))\ntry:\n    s.size = "9"\nexcept TypeError as e:\n    print(e)\n', out: "[Square] (1) 0/0 - 5\n25\n[Square] (1) 0/0 - 10\n[Square] (10) 3/4 - 2\n[Square] (10) 12/4 - 7\n[('id', 10), ('size', 7), ('x', 12), ('y', 4)]\nwidth must be an integer\n" }],
        { extraFiles: { "models/__init__.py": "", "models/base.py": BASE, "models/rectangle.py": RECT_AC } }),
    ],
    manual: ["Write unittests for every class in <code>tests/test_models/</code> and run them with <code>python3 -m unittest discover tests</code>", "Add JSON/CSV save and load class methods (<code>save_to_file</code>, <code>load_from_file</code>)"],
  };

  /* ---------------- AirBnB console ---------------- */
  const BASEMODEL = `${head}"""BaseModel module"""\nimport uuid\nfrom datetime import datetime\n\n\nclass BaseModel:\n    """Defines common attributes/methods for other classes"""\n\n    def __init__(self, *args, **kwargs):\n        """Initializes from scratch or from a dictionary"""\n        if kwargs:\n            for key, value in kwargs.items():\n                if key == "__class__":\n                    continue\n                if key in ("created_at", "updated_at"):\n                    value = datetime.fromisoformat(value)\n                setattr(self, key, value)\n        else:\n            self.id = str(uuid.uuid4())\n            self.created_at = datetime.now()\n            self.updated_at = self.created_at\n\n    def __str__(self):\n        """[<class name>] (<self.id>) <self.__dict__>"""\n        return "[{}] ({}) {}".format(type(self).__name__, self.id, self.__dict__)\n\n    def save(self):\n        """Updates updated_at"""\n        self.updated_at = datetime.now()\n\n    def to_dict(self):\n        """Returns a dict with __class__ and ISO dates"""\n        d = dict(self.__dict__)\n        d["__class__"] = type(self).__name__\n        d["created_at"] = self.created_at.isoformat()\n        d["updated_at"] = self.updated_at.isoformat()\n        return d\n`;
  EX["airbnb-1"] = {
    quiz: [
      ["What does the <code>cmd</code> module help you build?", ["Web servers", "Line-oriented command interpreters (shells)", "Databases", "Unit tests"], 1],
      ["In <code>cmd.Cmd</code>, which method handles the command <code>create</code>?", ["create()", "do_create()", "cmd_create()", "on_create()"], 1],
      ["What does <code>uuid.uuid4()</code> generate?", ["A sequential id", "A random unique identifier", "A timestamp", "A hash of the object"], 1],
      ["Why serialize instances to JSON in a file (FileStorage)?", ["To make them faster", "So objects persist between program runs", "To encrypt them", "Because classes require it"], 1],
      ["What does <code>datetime.isoformat()</code> return?", ["A tuple", "A string like 2017-06-14T22:31:03.285259", "A timestamp float", "A datetime"], 1],
    ],
    tasks: [
      py("BaseModel", "models/base_model.py", "<p>Write <code>models/base_model.py</code> with class <code>BaseModel</code>:</p><ul><li><code>id</code>: string uuid4, <code>created_at</code> / <code>updated_at</code>: datetime when created</li><li><code>__str__</code>: <code>[&lt;class name&gt;] (&lt;self.id&gt;) &lt;self.__dict__&gt;</code></li><li><code>save()</code> updates <code>updated_at</code>; <code>to_dict()</code> returns <code>__dict__</code> plus <code>__class__</code>, with dates as ISO strings</li><li><code>__init__(self, *args, **kwargs)</code>: if kwargs are given, rebuild the instance from them (ignore <code>__class__</code>, convert the date strings back to datetime)</li></ul>",
        `${head}"""BaseModel module"""\nimport uuid\nfrom datetime import datetime\n`, BASEMODEL,
        [{ main: 'from datetime import datetime\nfrom models.base_model import BaseModel\nm = BaseModel()\nm.name = "My First Model"\nprint(type(m.id).__name__, len(m.id), isinstance(m.created_at, datetime))\nprint(str(m).startswith("[BaseModel] (" + m.id + ")"))\nold = m.updated_at\nm.save()\nprint(m.updated_at >= old)\nd = m.to_dict()\nprint(d["__class__"], type(d["created_at"]).__name__, d["name"])\nm2 = BaseModel(**d)\nprint(m2.id == m.id, m2 is m, isinstance(m2.created_at, datetime), "__class__" in m2.__dict__)\n', out: "str 36 True\nTrue\nTrue\nBaseModel str My First Model\nTrue False True False\n" }],
        { extraFiles: { "models/__init__.py": "" } }),
      py("FileStorage", "models/engine/file_storage.py", "<p>Write <code>models/engine/file_storage.py</code> with class <code>FileStorage</code>: private class attributes <code>__file_path</code> (<code>\"file.json\"</code>) and <code>__objects</code> (dict). Methods: <code>all()</code> returns the dict; <code>new(obj)</code> stores it under the key <code>&lt;class name&gt;.id</code>; <code>save()</code> serializes <code>__objects</code> (using <code>to_dict()</code>) to the JSON file; <code>reload()</code> loads it back into BaseModel instances if the file exists (no error otherwise).</p>",
        `${head}"""FileStorage module"""\nimport json\nimport os\n`,
        `${head}"""FileStorage module"""\nimport json\nimport os\nfrom models.base_model import BaseModel\n\n\nclass FileStorage:\n    """Serializes instances to a JSON file and back"""\n    __file_path = "file.json"\n    __objects = {}\n\n    def all(self):\n        """Returns the objects dictionary"""\n        return FileStorage.__objects\n\n    def new(self, obj):\n        """Adds obj with key <class>.id"""\n        FileStorage.__objects["{}.{}".format(type(obj).__name__, obj.id)] = obj\n\n    def save(self):\n        """Serializes __objects to the JSON file"""\n        with open(FileStorage.__file_path, "w") as f:\n            json.dump({k: v.to_dict() for k, v in FileStorage.__objects.items()}, f)\n\n    def reload(self):\n        """Deserializes the JSON file if it exists"""\n        if not os.path.exists(FileStorage.__file_path):\n            return\n        with open(FileStorage.__file_path) as f:\n            data = json.load(f)\n        classes = {"BaseModel": BaseModel}\n        for key, d in data.items():\n            FileStorage.__objects[key] = classes[d["__class__"]](**d)\n`,
        [{ main: 'import os, json\nfrom models.base_model import BaseModel\nfrom models.engine.file_storage import FileStorage\ns = FileStorage()\ns.reload()\nprint(len(s.all()))\nm = BaseModel()\ns.new(m)\nkey = "BaseModel." + m.id\nprint(key in s.all())\ns.save()\nwith open("file.json") as f:\n    data = json.load(f)\nprint(data[key]["__class__"], data[key]["id"] == m.id)\ns.all().clear()\ns.reload()\nprint(type(s.all()[key]).__name__, s.all()[key].id == m.id)\n', out: "0\nTrue\nBaseModel True\nBaseModel True\n" }],
        { extraFiles: { "models/__init__.py": "", "models/engine/__init__.py": "", "models/base_model.py": BASEMODEL } }),
    ],
    manual: ["Build <code>console.py</code> with <code>cmd.Cmd</code>: quit, EOF, create, show, destroy, all, update", "Add User, State, City, Amenity, Place, Review classes and support <code>&lt;class&gt;.all()</code> syntax", "Write unittests for every class and the console"],
  };
})();
