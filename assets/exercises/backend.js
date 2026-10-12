/* Practice for the Backend specialization (alx-backend-python/javascript/storage/user-data, alx-backend, interview prep). */
(function () {
  const EX = (window.EX = window.EX || {});
  const py = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "python", file, p, start, sol, tests }, extra || {});
  const js = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "js", file, p, start, sol, tests }, extra || {});
  const sql = (t, file, p, sol, extra) => Object.assign({ t, lang: "sql", file, p, start: "-- write your SQL here\n", sol, tests: [{}] }, extra || {});
  const head = "#!/usr/bin/env python3\n";

  /* ================= alx-backend-python ================= */
  EX["bp-00"] = {
    quiz: [
      ["Are type annotations enforced by Python at runtime?", ["Yes, always", "No — they're hints, checked by tools like mypy", "Only for ints", "Only in classes"], 1],
      ["How do you annotate a function returning a list of floats?", ["def f() -> List[float]:", "def f(): List[float]", "def f() => float[]", "def f() as list"], 0],
      ["What is duck typing?", ["Typing with annotations", "If it has the methods you need, you can use it — whatever its class", "A typing module", "Strict type checking"], 1],
      ["Where are a function's annotations stored?", ["f.__doc__", "f.__annotations__", "f.__types__", "Nowhere"], 1],
    ],
    tasks: [
      py("Basic annotations - add", "0-add.py", "<p>Write a type-annotated function <code>add</code> that takes a float <code>a</code> and a float <code>b</code> as arguments and returns their sum as a float.</p>", head + '"""Basic annotations"""\n',
        head + '"""Basic annotations"""\n\n\ndef add(a: float, b: float) -> float:\n    """Adds two floats"""\n    return a + b\n',
        [{ main: 'add = __import__("0-add").add\nprint(add(1.11, 2.22) == 1.11 + 2.22)\nprint(add.__annotations__)\n', out: "True\n{'a': <class 'float'>, 'b': <class 'float'>, 'return': <class 'float'>}\n" }]),
      py("Complex types - list of floats", "5-sum_list.py", "<p>Write a type-annotated function <code>sum_list</code> which takes a list <code>input_list</code> of floats and returns their sum as a float.</p>", head + '"""Complex types"""\nfrom typing import List\n',
        head + '"""Complex types"""\nfrom typing import List\n\n\ndef sum_list(input_list: List[float]) -> float:\n    """Sums a list of floats"""\n    return float(sum(input_list))\n',
        [{ main: 'sum_list = __import__("5-sum_list").sum_list\nprint(sum_list([3.14, 1.11, 2.22]) == 3.14 + 1.11 + 2.22)\nprint(sum_list.__annotations__)\n', out: "True\n{'input_list': typing.List[float], 'return': <class 'float'>}\n" }]),
      py("Complex types - string and int/float to tuple", "7-to_kv.py", "<p>Write a type-annotated function <code>to_kv</code> that takes a string <code>k</code> and an int OR float <code>v</code> and returns a tuple: the string k, and the square of v as a float.</p>", head + '"""Complex types"""\nfrom typing import Tuple, Union\n',
        head + '"""Complex types"""\nfrom typing import Tuple, Union\n\n\ndef to_kv(k: str, v: Union[int, float]) -> Tuple[str, float]:\n    """Returns (k, v squared)"""\n    return (k, float(v ** 2))\n',
        [{ main: 'to_kv = __import__("7-to_kv").to_kv\nprint(to_kv("eggs", 3))\nprint(to_kv("school", 0.02))\nprint(to_kv.__annotations__["return"])\n', out: "('eggs', 9.0)\n('school', 0.0004)\ntyping.Tuple[str, float]\n" }]),
      py("Complex types - functions", "8-make_multiplier.py", "<p>Write a type-annotated function <code>make_multiplier</code> that takes a float <code>multiplier</code> and returns a function that multiplies a float by <code>multiplier</code>.</p>", head + '"""Complex types"""\nfrom typing import Callable\n',
        head + '"""Complex types"""\nfrom typing import Callable\n\n\ndef make_multiplier(multiplier: float) -> Callable[[float], float]:\n    """Returns a multiplier function"""\n    def f(x: float) -> float:\n        return x * multiplier\n    return f\n',
        [{ main: 'mm = __import__("8-make_multiplier").make_multiplier\nfun = mm(2.22)\nprint(fun(2.22) == 2.22 * 2.22)\nprint(mm.__annotations__["return"])\n', out: "True\ntyping.Callable[[float], float]\n" }]),
    ],
  };
  EX["bp-01"] = {
    quiz: [
      ["What does <code>await</code> do?", ["Blocks the whole program", "Pauses the coroutine until the awaited thing finishes, letting others run", "Creates a thread", "Sleeps exactly 1s"], 1],
      ["What does <code>asyncio.gather(*coros)</code> do?", ["Runs them one after another", "Runs them concurrently and returns all results", "Cancels them", "Returns the first result"], 1],
      ["What's the difference between a coroutine and a Task?", ["None", "A Task wraps a coroutine and schedules it on the event loop", "Tasks are threads", "Coroutines are faster"], 1],
      ["Which function generates a random float between a and b?", ["random.randint(a, b)", "random.uniform(a, b)", "random.choice(a, b)", "random.float(a, b)"], 1],
    ],
    tasks: [],
    manual: ["Write <code>wait_random(max_delay=10)</code> with <code>asyncio.sleep</code> and <code>random.uniform</code>", "Write <code>wait_n(n, max_delay)</code> returning delays in ascending order without sort()", "Measure the runtime with <code>time.perf_counter</code> and convert to tasks with <code>asyncio.create_task</code>"],
  };
  EX["bp-02"] = {
    quiz: [
      ["What is an async generator?", ["A generator that uses threads", "An async def function that yields values (consumed with async for)", "A normal generator", "A list"], 1],
      ["How do you consume an async generator in a comprehension?", ["[x for x in gen()]", "[x async for x in gen()]", "await [gen()]", "async [x for x in gen()]"], 1],
    ],
    tasks: [],
    manual: ["Write <code>async_generator</code> yielding 10 random numbers with a 1s sleep", "Write <code>async_comprehension</code> and measure four parallel runs (~10s, not 40s)"],
  };
  const UTILS_SOL = head + '"""Generic utilities"""\nfrom functools import wraps\nfrom typing import Mapping, Sequence, Any\n\n\ndef access_nested_map(nested_map: Mapping, path: Sequence) -> Any:\n    """Access a nested map with a sequence of keys"""\n    for key in path:\n        if not isinstance(nested_map, Mapping):\n            raise KeyError(key)\n        nested_map = nested_map[key]\n    return nested_map\n\n\ndef memoize(fn):\n    """Caches a method\'s result as a property"""\n    attr = "_{}".format(fn.__name__)\n\n    @wraps(fn)\n    def memoized(self):\n        if not hasattr(self, attr):\n            setattr(self, attr, fn(self))\n        return getattr(self, attr)\n    return property(memoized)\n';
  EX["bp-03"] = {
    quiz: [
      ["What's the difference between unit and integration tests?", ["None", "Unit tests test one piece in isolation; integration tests test pieces working together", "Integration tests are faster", "Unit tests need a database"], 1],
      ["Why mock an HTTP call in a unit test?", ["To make it slower", "So the test is fast, deterministic and doesn't depend on the network", "Mocks are required by unittest", "To test the network"], 1],
      ["What does <code>@patch('client.get_json')</code> do?", ["Deletes get_json", "Replaces get_json with a Mock during the test", "Calls get_json twice", "Logs calls"], 1],
      ["What's memoization?", ["Writing memos", "Caching a function's result so it's computed once", "A test fixture", "A database index"], 1],
    ],
    tasks: [
      py("access_nested_map", "utils.py", "<p>Write <code>access_nested_map(nested_map, path)</code>: follow the keys in <code>path</code> through nested dicts and return the value. If a key is missing (or you try to index something that isn't a mapping), raise <code>KeyError</code> with that key.</p>", head + '"""Generic utilities"""\nfrom typing import Mapping, Sequence, Any\n',
        UTILS_SOL,
        [{ main: 'from utils import access_nested_map as a\nprint(a({"a": 1}, ("a",)))\nprint(a({"a": {"b": 2}}, ("a",)))\nprint(a({"a": {"b": 2}}, ("a", "b")))\nfor m, p in [({}, ("a",)), ({"a": 1}, ("a", "b"))]:\n    try:\n        a(m, p)\n    except KeyError as e:\n        print("KeyError", e)\n', out: "1\n{'b': 2}\n2\nKeyError 'a'\nKeyError 'b'\n" }]),
      py("memoize", "utils.py", "<p>Add to <code>utils.py</code> a decorator <code>memoize(fn)</code> that turns a method into a property computed only once (cache it on the instance).</p>", head + '"""Generic utilities"""\nfrom functools import wraps\n',
        UTILS_SOL,
        [{ main: 'from utils import memoize\n\n\nclass T:\n    calls = 0\n\n    def a_method(self):\n        T.calls += 1\n        return 42\n\n    @memoize\n    def a_property(self):\n        return self.a_method()\n\n\nt = T()\nprint(t.a_property, t.a_property, T.calls)\n', out: "42 42 1\n" }]),
    ],
    manual: ["Write <code>test_utils.py</code> with <code>parameterized.expand</code> and <code>unittest.mock.patch</code>", "Write <code>test_client.py</code> unit + integration tests for <code>GithubOrgClient</code> with fixtures"],
  };

  /* ================= alx-backend-javascript ================= */
  EX["bj-00"] = {
    quiz: [
      ["What's wrong with <code>var</code> compared with <code>let</code>?", ["Nothing", "var is function-scoped and hoisted; let is block-scoped", "var is faster", "var can't be reassigned"], 1],
      ["What does <code>(...args) =&gt; args.length</code> return for f(1, 2, 3)?", ["1", "3", "[1, 2, 3]", "undefined"], 1],
      ["What does <code>[...'ab', ...[1]]</code> produce?", ["['ab', 1]", "['a', 'b', 1]", "Error", "'ab1'"], 1],
      ["What does an arrow function NOT have its own of?", ["Parameters", "this", "Return value", "Body"], 1],
    ],
    tasks: [
      js("Const or let?", "0-constants.js", "<p>Modify <code>taskFirst</code> to instantiate variables using <code>const</code>, and <code>taskNext</code> using <code>let</code>, so the functions return the right strings.</p>",
        "export function taskFirst() {\n  var task = 'I prefer const when I can.';\n  return task;\n}\n\nexport function getLast() {\n  return ' is okay';\n}\n\nexport function taskNext() {\n  var combination = 'But sometimes let';\n  combination += getLast();\n\n  return combination;\n}\n",
        "export function taskFirst() {\n  const task = 'I prefer const when I can.';\n  return task;\n}\n\nexport function getLast() {\n  return ' is okay';\n}\n\nexport function taskNext() {\n  let combination = 'But sometimes let';\n  combination += getLast();\n\n  return combination;\n}\n",
        [{ main: "import { taskFirst, taskNext } from './0-constants';\n\nconsole.log(`${taskFirst()} ${taskNext()}`);\n", out: "I prefer const when I can. But sometimes let is okay\n" }]),
      js("Arrow functions", "2-arrow.js", "<p>Rewrite <code>add</code> inside <code>getNeighborhoodsList</code> to use an arrow function (so <code>this</code> works).</p>",
        "export default function getNeighborhoodsList() {\n  this.sanFranciscoNeighborhoods = ['SOMA', 'Union Square'];\n\n  const self = this;\n  this.addNeighborhood = function add(newNeighborhood) {\n    self.sanFranciscoNeighborhoods.push(newNeighborhood);\n    return self.sanFranciscoNeighborhoods;\n  };\n}\n",
        "export default function getNeighborhoodsList() {\n  this.sanFranciscoNeighborhoods = ['SOMA', 'Union Square'];\n\n  this.addNeighborhood = (newNeighborhood) => {\n    this.sanFranciscoNeighborhoods.push(newNeighborhood);\n    return this.sanFranciscoNeighborhoods;\n  };\n}\n",
        [{ main: "import getNeighborhoodsList from './2-arrow';\n\nconst neighborhoodsList = new getNeighborhoodsList();\nconst res = neighborhoodsList.addNeighborhood('Noe Valley');\nconsole.log(res);\n", out: "[ 'SOMA', 'Union Square', 'Noe Valley' ]\n" }]),
      js("Parameter defaults", "3-default-parameter.js", "<p>Condense the function to use default parameter values: <code>expansion1989 = 89</code>, <code>expansion2019 = 19</code>.</p>",
        "export default function getSumOfHoods(initialNumber, expansion1989, expansion2019) {\n  if (expansion1989 === undefined) {\n    expansion1989 = 89;\n  }\n\n  if (expansion2019 === undefined) {\n    expansion2019 = 19;\n  }\n  return initialNumber + expansion1989 + expansion2019;\n}\n",
        "export default function getSumOfHoods(initialNumber, expansion1989 = 89, expansion2019 = 19) {\n  return initialNumber + expansion1989 + expansion2019;\n}\n",
        [{ main: "import getSumOfHoods from './3-default-parameter';\n\nconsole.log(getSumOfHoods(34));\nconsole.log(getSumOfHoods(34, 3));\nconsole.log(getSumOfHoods(34, 3, 4));\n", out: "142\n56\n41\n" }]),
      js("Rest parameter syntax", "4-rest-parameter.js", "<p>Modify <code>returnHowManyArguments</code> to return the number of arguments passed to it, using the rest parameter syntax.</p>", "export default function returnHowManyArguments() {\n}\n",
        "export default function returnHowManyArguments(...args) {\n  return args.length;\n}\n",
        [{ main: "import returnHowManyArguments from './4-rest-parameter';\n\nconsole.log(returnHowManyArguments('Hello', 'Holberton', 2020));\nconsole.log(returnHowManyArguments());\n", out: "3\n0\n" }]),
      js("The wonders of spread syntax", "5-spread-operator.js", "<p>Using spread syntax, concatenate 2 arrays and each character of a string. Prototype: <code>concatArrays(array1, array2, string)</code>. One line, no Array.concat.</p>", "export default function concatArrays(array1, array2, string) {\n}\n",
        "export default function concatArrays(array1, array2, string) {\n  return [...array1, ...array2, ...string];\n}\n",
        [{ main: "import concatArrays from './5-spread-operator';\n\nconsole.log(JSON.stringify(concatArrays(['a', 'b'], ['c', 'd'], 'Hello')));\n", out: "[\"a\",\"b\",\"c\",\"d\",\"H\",\"e\",\"l\",\"l\",\"o\"]\n" }]),
      js("For...of loops", "8-for-of.js", "<p>Rewrite the function using ES6's <code>for...of</code>: return a new array with <code>appendString</code> prepended to each value.</p>", "export default function appendToEachArrayValue(array, appendString) {\n  for (var idx in array) {\n    var value = array[idx];\n    array[idx] = appendString + value;\n  }\n\n  return array;\n}\n",
        "export default function appendToEachArrayValue(array, appendString) {\n  const result = [];\n  for (const value of array) {\n    result.push(appendString + value);\n  }\n\n  return result;\n}\n",
        [{ main: "import appendToEachArrayValue from './8-for-of';\n\nconsole.log(appendToEachArrayValue(['appended', 'fixed', 'displayed'], 'correctly-'));\n", out: "[ 'correctly-appended', 'correctly-fixed', 'correctly-displayed' ]\n" }]),
    ],
  };
  EX["bj-01"] = {
    quiz: [
      ["What are the three states of a Promise?", ["start, run, end", "pending, fulfilled, rejected", "open, closed, error", "sync, async, await"], 1],
      ["What does <code>Promise.all</code> do if one promise rejects?", ["Ignores it", "Rejects immediately with that reason", "Waits for all and returns errors", "Resolves with undefined"], 1],
      ["What does <code>Promise.allSettled</code> return?", ["Only fulfilled values", "An array of {status, value|reason} for every promise", "The first result", "Nothing"], 1],
      ["What does <code>Promise.race</code> resolve/reject with?", ["The last promise", "The first promise to settle", "All values", "undefined"], 1],
    ],
    tasks: [
      js("Keep every promise you make", "0-promise.js", "<p>Return a Promise from <code>getResponseFromAPI()</code>.</p>", "export default function getResponseFromAPI() {\n}\n",
        "export default function getResponseFromAPI() {\n  return Promise.resolve();\n}\n",
        [{ main: "import getResponseFromAPI from './0-promise';\n\nconst response = getResponseFromAPI();\nconsole.log(response instanceof Promise);\n", out: "true\n" }]),
      js("Don't make a promise if you know you can't keep it", "1-promise.js", "<p>Write <code>getFullResponseFromAPI(success)</code> returning a Promise: if success is true, resolve with <code>{ status: 200, body: 'Success' }</code>; otherwise reject with an Error <code>The fake API is not working currently</code>.</p>", "export default function getFullResponseFromAPI(success) {\n}\n",
        "export default function getFullResponseFromAPI(success) {\n  return new Promise((resolve, reject) => {\n    if (success) {\n      resolve({ status: 200, body: 'Success' });\n    } else {\n      reject(new Error('The fake API is not working currently'));\n    }\n  });\n}\n",
        [{ main: "import getFullResponseFromAPI from './1-promise';\n\ngetFullResponseFromAPI(true).then((r) => console.log(r));\ngetFullResponseFromAPI(false).catch((e) => console.log(e.message));\n", out: "{ status: 200, body: 'Success' }\nThe fake API is not working currently\n" }]),
      js("Catch me if you can!", "2-then.js", "<p>Write <code>handleResponseFromAPI(promise)</code>: append handlers so that on resolve it returns <code>{ status: 200, body: 'success' }</code>, on reject it returns an empty Error, and in every case it logs <code>Got a response from the API</code>.</p>", "export default function handleResponseFromAPI(promise) {\n}\n",
        "export default function handleResponseFromAPI(promise) {\n  return promise\n    .then(() => ({ status: 200, body: 'success' }))\n    .catch(() => new Error())\n    .finally(() => console.log('Got a response from the API'));\n}\n",
        [{ main: "import handleResponseFromAPI from './2-then';\n\nhandleResponseFromAPI(Promise.resolve()).then((r) => console.log(r));\n", out: "Got a response from the API\n{ status: 200, body: 'success' }\n" }]),
      js("Load balancer", "7-load_balancer.js", "<p>Write <code>loadBalancer(chinaDownload, USDownload)</code> returning the value returned by whichever promise resolves first.</p>", "export default function loadBalancer(chinaDownload, USDownload) {\n}\n",
        "export default function loadBalancer(chinaDownload, USDownload) {\n  return Promise.race([chinaDownload, USDownload]);\n}\n",
        [{ main: "import loadBalancer from './7-load_balancer';\n\nconst ukSuccess = 'Downloading from UK is faster';\nconst frSuccess = 'Downloading from FR is faster';\nconst promiseUK = new Promise((resolve) => setTimeout(resolve, 100, ukSuccess));\nconst promiseFR = new Promise((resolve) => setTimeout(resolve, 50, frSuccess));\nloadBalancer(promiseUK, promiseFR).then((value) => console.log(value));\n", out: "Downloading from FR is faster\n" }]),
      js("Throw error / try catch", "9-try.js", "<p>Write <code>guardrail(mathFunction)</code>: create an array <code>queue</code>; try to call mathFunction and push its result, or push the error message on failure; always push <code>Guardrail was processed</code>. Return the queue.</p>", "export default function guardrail(mathFunction) {\n}\n",
        "export default function guardrail(mathFunction) {\n  const queue = [];\n  try {\n    queue.push(mathFunction());\n  } catch (err) {\n    queue.push(`Error: ${err.message}`);\n  } finally {\n    queue.push('Guardrail was processed');\n  }\n  return queue;\n}\n",
        [{ main: "import guardrail from './9-try';\n\nconsole.log(guardrail(() => 5 / 1));\nconsole.log(guardrail(() => { throw new Error('cannot divide by 0'); }));\n", out: "[ 5, 'Guardrail was processed' ]\n[ 'Error: cannot divide by 0', 'Guardrail was processed' ]\n" }]),
    ],
  };
  EX["bj-02"] = {
    quiz: [
      ["How do you define a getter in an ES6 class?", ["get name() { … }", "getter name() { … }", "function get name()", "name: get"], 0],
      ["What does <code>static</code> mean on a method?", ["It can't change", "It's called on the class, not on instances", "It's private", "It runs once"], 1],
      ["How can a class prevent direct instantiation (abstract class)?", ["Using abstract keyword", "Throwing in the constructor when new.target === ThatClass", "Making the constructor private", "You can't"], 1],
    ],
    tasks: [
      js("You used to attend a place like this at some point", "0-classroom.js", "<p>Implement a class <code>ClassRoom</code> whose constructor takes <code>maxStudentsSize</code> and stores it in <code>_maxStudentsSize</code>.</p>", "export default class ClassRoom {\n}\n",
        "export default class ClassRoom {\n  constructor(maxStudentsSize) {\n    this._maxStudentsSize = maxStudentsSize;\n  }\n}\n",
        [{ main: "import ClassRoom from './0-classroom';\n\nconst room = new ClassRoom(10);\nconsole.log(room._maxStudentsSize);\n", out: "10\n" }]),
      js("A Course, Getters, and Setters", "2-hbtn_course.js", "<p>Implement <code>HolbertonCourse</code>: constructor(name String, length Number, students Array of Strings), stored with an underscore prefix. Add getters and setters for each attribute and verify types — throw <code>TypeError</code> with <code>Name must be a string</code>, <code>Length must be a number</code>, <code>Students must be an array of strings</code>.</p>", "export default class HolbertonCourse {\n}\n",
        "export default class HolbertonCourse {\n  constructor(name, length, students) {\n    this.name = name;\n    this.length = length;\n    this.students = students;\n  }\n\n  get name() {\n    return this._name;\n  }\n\n  set name(value) {\n    if (typeof value !== 'string') throw new TypeError('Name must be a string');\n    this._name = value;\n  }\n\n  get length() {\n    return this._length;\n  }\n\n  set length(value) {\n    if (typeof value !== 'number') throw new TypeError('Length must be a number');\n    this._length = value;\n  }\n\n  get students() {\n    return this._students;\n  }\n\n  set students(value) {\n    if (!Array.isArray(value) || !value.every((s) => typeof s === 'string')) {\n      throw new TypeError('Students must be an array of strings');\n    }\n    this._students = value;\n  }\n}\n",
        [{ main: "import HolbertonCourse from './2-hbtn_course';\n\nconst c1 = new HolbertonCourse('ES6', 1, ['Bob', 'Jane']);\nconsole.log(c1.name);\nc1.name = 'Python 101';\nconsole.log(c1.name, c1.length, c1.students, Object.keys(c1));\ntry {\n  c1.name = 12;\n} catch (err) {\n  console.log(err.message);\n}\ntry {\n  new HolbertonCourse('ES6', '1', ['Bob', 'Jane']);\n} catch (err) {\n  console.log(err.message);\n}\n", out: "ES6\nPython 101 1 [ 'Bob', 'Jane' ] [ '_name', '_length', '_students' ]\nName must be a string\nLength must be a number\n" }]),
      js("Methods, static methods, computed methods names..... MONEY", "3-currency.js", "<p>Implement <code>Currency</code> with attributes <code>code</code> and <code>name</code> (getters/setters, stored with underscore) and a method <code>displayFullCurrency()</code> returning <code>name (code)</code>.</p>", "export default class Currency {\n}\n",
        "export default class Currency {\n  constructor(code, name) {\n    this._code = code;\n    this._name = name;\n  }\n\n  get code() {\n    return this._code;\n  }\n\n  set code(value) {\n    this._code = value;\n  }\n\n  get name() {\n    return this._name;\n  }\n\n  set name(value) {\n    this._name = value;\n  }\n\n  displayFullCurrency() {\n    return `${this._name} (${this._code})`;\n  }\n}\n",
        [{ main: "import Currency from './3-currency';\n\nconst dollar = new Currency('$', 'Dollars');\nconsole.log(dollar.displayFullCurrency());\n", out: "Dollars ($)\n" }]),
      js("Abstract (Building)", "5-building.js", "<p>Implement <code>Building</code> with attribute <code>sqft</code> (number, getter). It's an abstract class: subclasses must implement <code>evacuationWarningMessage</code>; if a subclass doesn't, throw <code>Error('Class extending Building must override evacuationWarningMessage')</code> when it's constructed.</p>", "export default class Building {\n}\n",
        "export default class Building {\n  constructor(sqft) {\n    this._sqft = sqft;\n    if (this.constructor !== Building && typeof this.evacuationWarningMessage !== 'function') {\n      throw new Error('Class extending Building must override evacuationWarningMessage');\n    }\n  }\n\n  get sqft() {\n    return this._sqft;\n  }\n}\n",
        [{ main: "import Building from './5-building';\n\nconst b = new Building(100);\nconsole.log(b);\n\nclass TestBuilding extends Building {}\n\ntry {\n  new TestBuilding(200);\n} catch (err) {\n  console.log(err.message);\n}\n", out: "Building { _sqft: 100 }\nClass extending Building must override evacuationWarningMessage\n" }]),
    ],
  };
  const STUDENTS = "export default function getListStudents() {\n  return [\n    { id: 1, firstName: 'Guillaume', location: 'San Francisco' },\n    { id: 2, firstName: 'James', location: 'Columbia' },\n    { id: 5, firstName: 'Serena', location: 'San Francisco' },\n  ];\n}\n";
  EX["bj-03"] = {
    quiz: [
      ["What does <code>.map</code> return?", ["The same array", "A new array with each element transformed", "A single value", "A boolean"], 1],
      ["What's the difference between a Map and a plain object for keys?", ["None", "Map keys can be any type (objects too) and keep insertion order", "Object keys can be anything", "Maps can't be iterated"], 1],
      ["What is a WeakMap's key restriction?", ["Strings only", "Keys must be objects (held weakly)", "Numbers only", "No restriction"], 1],
      ["What does <code>new Set([1, 1, 2]).size</code> return?", ["3", "2", "1", "undefined"], 1],
    ],
    tasks: [
      js("Basic list of objects", "0-get_list_students.js", "<p>Return an array of objects with <code>id</code>, <code>firstName</code>, <code>location</code>: Guillaume (1, San Francisco), James (2, Columbia), Serena (5, San Francisco).</p>", "export default function getListStudents() {\n}\n", STUDENTS,
        [{ main: "import getListStudents from './0-get_list_students';\n\nconst s = getListStudents();\nconsole.log(s.length, s[0].firstName, s[1].location, s[2].id);\n", out: "3 Guillaume Columbia 5\n" }]),
      js("More mapping", "1-get_list_student_ids.js", "<p>Return an array of ids from a list of objects using <code>map</code>. If the argument isn't an array, return an empty array.</p>", "export default function getListStudentIds(students) {\n}\n",
        "export default function getListStudentIds(students) {\n  if (!Array.isArray(students)) return [];\n  return students.map((s) => s.id);\n}\n",
        [{ main: "import getListStudentIds from './1-get_list_student_ids';\nimport getListStudents from './0-get_list_students';\n\nconsole.log(getListStudentIds('hello'));\nconsole.log(getListStudentIds(getListStudents()));\n", out: "[]\n[ 1, 2, 5 ]\n" }],
        { extraFiles: { "0-get_list_students.js": STUDENTS } }),
      js("Filter", "2-get_students_by_loc.js", "<p>Return the students in a given city using <code>filter</code>. Prototype: <code>getStudentsByLocation(students, city)</code>.</p>", "export default function getStudentsByLocation(students, city) {\n}\n",
        "export default function getStudentsByLocation(students, city) {\n  return students.filter((s) => s.location === city);\n}\n",
        [{ main: "import getListStudents from './0-get_list_students';\nimport getStudentsByLocation from './2-get_students_by_loc';\n\nconsole.log(getStudentsByLocation(getListStudents(), 'San Francisco').map((s) => s.firstName));\n", out: "[ 'Guillaume', 'Serena' ]\n" }],
        { extraFiles: { "0-get_list_students.js": STUDENTS } }),
      js("Reduce", "3-get_ids_sum.js", "<p>Return the sum of all the student ids using <code>reduce</code>. Prototype: <code>getStudentIdsSum(students)</code>.</p>", "export default function getStudentIdsSum(students) {\n}\n",
        "export default function getStudentIdsSum(students) {\n  return students.reduce((sum, s) => sum + s.id, 0);\n}\n",
        [{ main: "import getListStudents from './0-get_list_students';\nimport getStudentIdsSum from './3-get_ids_sum';\n\nconsole.log(getStudentIdsSum(getListStudents()));\n", out: "8\n" }],
        { extraFiles: { "0-get_list_students.js": STUDENTS } }),
      js("Using Sets", "8-clean_set.js", "<p>Write <code>cleanSet(set, startString)</code> returning a string of all the set values that start with <code>startString</code>, with that prefix removed, joined by <code>-</code>. If startString is empty or not a string, return an empty string.</p>", "export default function cleanSet(set, startString) {\n}\n",
        "export default function cleanSet(set, startString) {\n  if (!startString || typeof startString !== 'string') return '';\n  const parts = [];\n  for (const value of set) {\n    if (typeof value === 'string' && value.startsWith(startString)) {\n      parts.push(value.slice(startString.length));\n    }\n  }\n  return parts.join('-');\n}\n",
        [{ main: "import cleanSet from './8-clean_set';\n\nconsole.log(cleanSet(new Set(['bonjovi', 'bonaparte', 'bonappetit', 'banana']), 'bon'));\nconsole.log(cleanSet(new Set(['bonjovi', 'bonaparte', 'bonappetit', 'banana']), ''));\n", out: "jovi-aparte-appetit\n\n" }]),
      js("Map data structure", "9-groceries_list.js", "<p>Write <code>groceriesList()</code> returning a <code>Map</code>: Apples 10, Tomatoes 10, Pasta 1, Rice 1, Banana 5.</p>", "export default function groceriesList() {\n}\n",
        "export default function groceriesList() {\n  return new Map([\n    ['Apples', 10],\n    ['Tomatoes', 10],\n    ['Pasta', 1],\n    ['Rice', 1],\n    ['Banana', 5],\n  ]);\n}\n",
        [{ main: "import groceriesList from './9-groceries_list';\n\nconst m = groceriesList();\nconsole.log(m instanceof Map, m.size, m.get('Banana'));\n", out: "true 5 5\n" }]),
    ],
  };
  EX["bj-04"] = {
    quiz: [
      ["What does TypeScript add to JavaScript?", ["A runtime", "Static types checked at compile time", "New browser APIs", "Multithreading"], 1],
      ["How do you declare an interface for an object with a string name?", ["interface P { name: string; }", "type P = name string", "class P: string", "interface P(name)"], 0],
      ["What does a generic like <code>function id&lt;T&gt;(x: T): T</code> mean?", ["T is a type parameter: the same type goes in and out", "T is a string", "It returns any", "It's a template string"], 0],
      ["What does <code>tsc</code> do?", ["Runs tests", "Compiles TypeScript to JavaScript", "Formats code", "Bundles CSS"], 1],
    ],
    tasks: [],
    manual: ["Set up a project with webpack + ts-loader and write interfaces <code>Student</code> and <code>Teacher</code>", "Use namespaces, declaration merging and branded types like in the ALX tasks"],
  };
  const DB_CSV = "firstname,lastname,age,field\nJohann,Kerbrou,30,CS\nGuillaume,Salou,30,SWE\nArielle,Salou,20,CS\nJonathan,Benou,30,CS\nEmmanuel,Turlou,40,CS\nGuillaume,Plessous,35,CS\nJoseph,Crisou,34,SWE\nPaul,Schneider,60,SWE\nTommy,Schoul,32,SWE\nKatie,Shirou,21,CS\n\n";
  const COUNT_SOL = "const fs = require('fs');\n\nfunction countStudents(path) {\n  let data;\n  try {\n    data = fs.readFileSync(path, 'utf-8');\n  } catch (err) {\n    throw new Error('Cannot load the database');\n  }\n  const lines = data.split('\\n').filter((l) => l.trim() !== '').slice(1);\n  console.log(`Number of students: ${lines.length}`);\n  const fields = {};\n  for (const line of lines) {\n    const parts = line.split(',');\n    const field = parts[3];\n    if (!fields[field]) fields[field] = [];\n    fields[field].push(parts[0]);\n  }\n  for (const field of Object.keys(fields)) {\n    console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);\n  }\n}\n\nmodule.exports = countStudents;\n";
  EX["bj-05"] = {
    quiz: [
      ["How do you read a file synchronously in Node?", ["fs.readFile", "fs.readFileSync", "fs.open", "require(file)"], 1],
      ["What does Express do?", ["Compiles JavaScript", "A minimal web framework for routing HTTP requests", "A database", "A test runner"], 1],
      ["Which object gives access to command-line arguments in Node?", ["window.args", "process.argv", "node.args", "global.argv"], 1],
      ["What's nodemon for?", ["Debugging", "Restarting the server automatically when files change", "Deploying", "Linting"], 1],
    ],
    tasks: [
      js("Executing basic javascript with Node JS", "0-console.js", "<p>Create a function <code>displayMessage</code> that prints in STDOUT the string argument. Export it with <code>module.exports</code>.</p>", "",
        "function displayMessage(message) {\n  console.log(message);\n}\n\nmodule.exports = displayMessage;\n",
        [{ main: "const displayMessage = require('./0-console');\n\ndisplayMessage('Hello Holberton School!');\n", out: "Hello Holberton School!\n" }]),
      js("Reading a file synchronously with Node JS", "2-read_file.js", "<p>Create <code>countStudents(path)</code>: read the CSV database synchronously; if it isn't available throw <code>Error('Cannot load the database')</code>. Otherwise log <code>Number of students: N</code>, then for each field <code>Number of students in FIELD: 6. List: LIST_OF_FIRSTNAMES</code>. Ignore empty lines.</p>", "const fs = require('fs');\n", COUNT_SOL,
        [{ main: "const countStudents = require('./2-read_file');\n\ntry {\n  countStudents('nope.csv');\n} catch (err) {\n  console.log(err.message);\n}\ncountStudents('database.csv');\n", out: "Cannot load the database\nNumber of students: 10\nNumber of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie\nNumber of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy\n" }],
        { extraFiles: { "database.csv": DB_CSV } }),
    ],
    manual: ["Write <code>1-stdin.js</code> (interactive input)", "Write a small HTTP server with the <code>http</code> module, then the same with Express (routes <code>/</code> and <code>/students</code>)"],
  };
  EX["bj-06"] = {
    quiz: [
      ["What does Mocha provide?", ["Assertions only", "A test runner (describe/it, hooks)", "Mocks", "HTTP requests"], 1],
      ["What is a Sinon spy?", ["A stub that returns fixed values", "A wrapper that records how a function was called", "A fake server", "An assertion"], 1],
      ["What's the difference between a spy and a stub?", ["None", "A stub also replaces the behaviour (e.g. fixed return value)", "Spies replace behaviour", "Stubs only count calls"], 1],
      ["Which hook runs before each test in Mocha?", ["before", "beforeEach", "setup", "init"], 1],
    ],
    tasks: [
      js("Basic test with Mocha and Node assertion library", "0-calcul.js", "<p>Create <code>calculateNumber(a, b)</code> that rounds a and b and returns their sum. Export it with <code>module.exports</code>.</p>", "",
        "function calculateNumber(a, b) {\n  return Math.round(a) + Math.round(b);\n}\n\nmodule.exports = calculateNumber;\n",
        [{ main: "const calculateNumber = require('./0-calcul');\n\nconsole.log(calculateNumber(1, 3));\nconsole.log(calculateNumber(1, 3.7));\nconsole.log(calculateNumber(1.2, 3.7));\nconsole.log(calculateNumber(1.5, 3.7));\n", out: "4\n5\n5\n6\n" }]),
      js("Combining descriptions", "1-calcul.js", "<p>Upgrade the function to <code>calculateNumber(type, a, b)</code> where type is <code>SUM</code>, <code>SUBTRACT</code> or <code>DIVIDE</code>; round a and b first. For DIVIDE, return the string <code>Error</code> if the rounded b is 0.</p>", "",
        "function calculateNumber(type, a, b) {\n  const x = Math.round(a);\n  const y = Math.round(b);\n  if (type === 'SUM') return x + y;\n  if (type === 'SUBTRACT') return x - y;\n  if (type === 'DIVIDE') return y === 0 ? 'Error' : x / y;\n  return undefined;\n}\n\nmodule.exports = calculateNumber;\n",
        [{ main: "const calculateNumber = require('./1-calcul');\n\nconsole.log(calculateNumber('SUM', 1.4, 4.5));\nconsole.log(calculateNumber('SUBTRACT', 1.4, 4.5));\nconsole.log(calculateNumber('DIVIDE', 1.4, 4.5));\nconsole.log(calculateNumber('DIVIDE', 1.4, 0));\n", out: "6\n-4\n0.2\nError\n" }]),
    ],
    manual: ["Write the Mocha tests (<code>0-calcul.test.js</code> …) and run them with <code>npm test</code>", "Use Sinon spies/stubs, hooks, async tests and an Express integration test"],
  };

  /* ================= alx-backend-storage ================= */
  const FANS = "CREATE TABLE metal_bands (id INTEGER PRIMARY KEY, band_name TEXT, fans INTEGER, formed INTEGER, split INTEGER, origin TEXT, style TEXT);\nINSERT INTO metal_bands (band_name, fans, formed, split, origin, style) VALUES ('Iron Maiden', 4195, 1975, NULL, 'United Kingdom', 'New wave of british heavy,Heavy'), ('Opeth', 4165, 1990, NULL, 'Sweden', 'Extreme progressive,Progressive rock,Progressive'), ('Metallica', 3712, 1981, NULL, 'USA', 'Heavy,Bay area thrash'), ('Alice Cooper', 1500, 1968, NULL, 'USA', 'Glam rock,Hard rock,Heavy,Shock rock'), ('Mötley Crüe', 1200, 1981, 2015, 'USA', 'Glam rock,Heavy,Hard rock'), ('Kiss', 1300, 1973, NULL, 'USA', 'Glam rock,Hard rock,Heavy'), ('Ghost', 900, 2008, NULL, 'Sweden', 'Heavy,Doom'), ('Sweet', 800, 1968, 1981, 'United Kingdom', 'Glam rock');\n";
  const STORE = "CREATE TABLE items (name TEXT, quantity INTEGER DEFAULT 10);\nCREATE TABLE orders (item_name TEXT, number INTEGER);\nINSERT INTO items (name) VALUES ('apple'), ('pineapple'), ('pear');\n";
  EX["bs-00"] = {
    quiz: [
      ["What does an index speed up?", ["Inserts", "Lookups (WHERE, JOIN, ORDER BY) at some cost to writes", "Deletes only", "Nothing"], 1],
      ["What is a trigger?", ["A scheduled job", "SQL that runs automatically on INSERT/UPDATE/DELETE of a table", "A foreign key", "A view"], 1],
      ["What is a view?", ["A copy of a table", "A saved query you can SELECT from like a table", "An index", "A backup"], 1],
      ["What's a stored procedure?", ["A trigger", "Named SQL code stored in the database that you CALL", "A table", "A user"], 1],
    ],
    tasks: [
      sql("We are all unique!", "0-uniq_users.sql", "<p>Create a table <code>users</code> with: <code>id</code> integer, never null, auto increment and primary key; <code>email</code> string (255), never null and unique; <code>name</code> string (255). If the table already exists, don't fail. <em>(Here: SQLite syntax — <code>INTEGER PRIMARY KEY AUTOINCREMENT</code>; ALX uses MySQL's <code>INT NOT NULL AUTO_INCREMENT PRIMARY KEY</code>.)</em></p>",
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255));",
        { check: "INSERT INTO users (email, name) VALUES ('bob@dylan.com', 'Bob'); INSERT INTO users (email, name) VALUES ('sylvie@dylan.com', 'Sylvie'); INSERT OR IGNORE INTO users (email, name) VALUES ('bob@dylan.com', 'Jean'); SELECT id, email, name FROM users;" }),
      sql("Best band ever!", "2-fans.sql", "<p>Rank country origins of bands, ordered by the number of (non-unique) fans. Column names must be <code>origin</code> and <code>nb_fans</code>.</p>", "SELECT origin, SUM(fans) AS nb_fans FROM metal_bands GROUP BY origin ORDER BY nb_fans DESC;", { setup: FANS, ordered: true }),
      sql("Old school band", "3-glam_rock.sql", "<p>List all bands with <code>Glam rock</code> as their main style, ranked by their longevity. Columns: <code>band_name</code> and <code>lifespan</code> (in years until 2022 — use 2022 instead of NULL for <code>split</code>).</p>", "SELECT band_name, COALESCE(split, 2022) - formed AS lifespan FROM metal_bands WHERE style LIKE '%Glam rock%' ORDER BY lifespan DESC;", { setup: FANS, ordered: true }),
      sql("Buy buy buy (trigger)", "4-store.sql", "<p>Create a trigger that decreases the quantity of an item after adding a new order (table <code>orders</code>: <code>item_name</code>, <code>number</code>). <em>SQLite syntax: <code>CREATE TRIGGER … AFTER INSERT ON orders FOR EACH ROW BEGIN … END;</code></em></p>",
        "CREATE TRIGGER decrease_items AFTER INSERT ON orders FOR EACH ROW BEGIN UPDATE items SET quantity = quantity - NEW.number WHERE name = NEW.item_name; END;",
        { setup: STORE, check: "INSERT INTO orders (item_name, number) VALUES ('apple', 1); INSERT INTO orders (item_name, number) VALUES ('apple', 3); INSERT INTO orders (item_name, number) VALUES ('pear', 2); SELECT * FROM items;" }),
    ],
    manual: ["Do the same tasks in MySQL 8 (procedures <code>AddBonus</code>, <code>ComputeAverageScoreForUser</code>, functions <code>SafeDiv</code>, views <code>need_meeting</code>)"],
  };
  const FAKE_MONGO = '"""A tiny in-memory stand-in for a pymongo collection"""\nimport itertools\n\n_ids = itertools.count(1)\n\n\nclass InsertResult:\n    def __init__(self, inserted_id):\n        self.inserted_id = inserted_id\n\n\nclass FakeCollection:\n    def __init__(self, docs=None):\n        self.docs = []\n        for d in docs or []:\n            self.insert_one(d)\n\n    @staticmethod\n    def _match(doc, query):\n        for k, v in (query or {}).items():\n            value = doc.get(k)\n            if isinstance(value, list):\n                if v not in value:\n                    return False\n            elif value != v:\n                return False\n        return True\n\n    def find(self, query=None):\n        return [dict(d) for d in self.docs if self._match(d, query)]\n\n    def insert_one(self, doc):\n        doc = dict(doc)\n        doc.setdefault("_id", next(_ids))\n        self.docs.append(doc)\n        return InsertResult(doc["_id"])\n\n    def update_many(self, query, update):\n        for d in self.docs:\n            if self._match(d, query):\n                d.update(update.get("$set", {}))\n';
  EX["bs-01"] = {
    quiz: [
      ["What does NoSQL generally mean?", ["No queries", "Non-relational databases (document, key-value, graph…)", "SQL without joins", "Old SQL"], 1],
      ["What does ACID stand for?", ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Async, Cache, Index, Document", "None of these"], 0],
      ["In MongoDB, what is a document?", ["A table", "A JSON-like record (BSON)", "A query", "An index"], 1],
      ["Which method inserts one document with pymongo?", ["collection.add()", "collection.insert_one(doc)", "collection.put(doc)", "collection.create(doc)"], 1],
    ],
    tasks: [
      py("List all documents in Python", "8-all.py", "<p>Write <code>list_all(mongo_collection)</code> that lists all documents in a collection (return an empty list if there are none). (The checker passes an in-memory collection with pymongo's <code>find()</code> / <code>insert_one()</code> / <code>update_many()</code> methods.)</p>", head + '"""List all documents"""\n',
        head + '"""List all documents"""\n\n\ndef list_all(mongo_collection):\n    """Returns all documents in the collection"""\n    return [doc for doc in mongo_collection.find()]\n',
        [{ main: 'from fake_mongo import FakeCollection\nlist_all = __import__("8-all").list_all\nprint(list_all(FakeCollection()))\nschools = FakeCollection([{"name": "Holberton school"}, {"name": "UCSD"}])\nprint([s["name"] for s in list_all(schools)])\n', out: "[]\n['Holberton school', 'UCSD']\n" }],
        { extraFiles: { "fake_mongo.py": FAKE_MONGO } }),
      py("Insert a document in Python", "9-insert_school.py", "<p>Write <code>insert_school(mongo_collection, **kwargs)</code> that inserts a new document based on kwargs and returns the new <code>_id</code>.</p>", head + '"""Insert a document"""\n',
        head + '"""Insert a document"""\n\n\ndef insert_school(mongo_collection, **kwargs):\n    """Inserts a document and returns its id"""\n    return mongo_collection.insert_one(kwargs).inserted_id\n',
        [{ main: 'from fake_mongo import FakeCollection\ninsert_school = __import__("9-insert_school").insert_school\nc = FakeCollection()\nnew_id = insert_school(c, name="UCSF", address="505 Parnassus Ave")\nprint(new_id is not None, [d["name"] for d in c.find({"_id": new_id})])\n', out: "True ['UCSF']\n" }],
        { extraFiles: { "fake_mongo.py": FAKE_MONGO } }),
      py("Change school topics", "10-update_topics.py", "<p>Write <code>update_topics(mongo_collection, name, topics)</code> that changes all topics of a school document based on the name.</p>", head + '"""Update topics"""\n',
        head + '"""Update topics"""\n\n\ndef update_topics(mongo_collection, name, topics):\n    """Sets the topics of the schools with this name"""\n    mongo_collection.update_many({"name": name}, {"$set": {"topics": topics}})\n',
        [{ main: 'from fake_mongo import FakeCollection\nupdate_topics = __import__("10-update_topics").update_topics\nc = FakeCollection([{"name": "Holberton school"}, {"name": "UCSD"}])\nupdate_topics(c, "Holberton school", ["Sys admin", "AI", "Algorithm"])\nfor s in c.find():\n    print(s["name"], s.get("topics", ""))\n', out: "Holberton school ['Sys admin', 'AI', 'Algorithm']\nUCSD \n" }],
        { extraFiles: { "fake_mongo.py": FAKE_MONGO } }),
      py("Where can I learn Python?", "11-schools_by_topic.py", "<p>Write <code>schools_by_topic(mongo_collection, topic)</code> returning the list of schools having a specific topic (topics is a list field).</p>", head + '"""Schools by topic"""\n',
        head + '"""Schools by topic"""\n\n\ndef schools_by_topic(mongo_collection, topic):\n    """Returns schools having this topic"""\n    return list(mongo_collection.find({"topics": topic}))\n',
        [{ main: 'from fake_mongo import FakeCollection\nf = __import__("11-schools_by_topic").schools_by_topic\nc = FakeCollection([{"name": "Holberton school", "topics": ["Algo", "C", "Python", "React"]}, {"name": "UCSF", "topics": ["Algo", "MongoDB"]}, {"name": "UCLA", "topics": ["C", "Python"]}])\nprint([s["name"] for s in f(c, "Python")])\n', out: "['Holberton school', 'UCLA']\n" }],
        { extraFiles: { "fake_mongo.py": FAKE_MONGO } }),
    ],
    manual: ["Install MongoDB and run the shell tasks (<code>show dbs</code>, inserts, updates, deletes)", "Write <code>12-log_stats.py</code> on the real Nginx logs collection"],
  };
  const FAKE_REDIS = '"""A tiny in-memory stand-in for the redis package (just what the tasks use)"""\n\n\nclass Redis:\n    _store = {}\n\n    def __init__(self, *args, **kwargs):\n        pass\n\n    def flushdb(self):\n        Redis._store.clear()\n\n    def set(self, key, value):\n        if isinstance(value, str):\n            value = value.encode()\n        elif isinstance(value, (int, float)):\n            value = str(value).encode()\n        Redis._store[key] = value\n\n    def get(self, key):\n        return Redis._store.get(key)\n\n    def incr(self, key):\n        n = int(Redis._store.get(key, b"0")) + 1\n        Redis._store[key] = str(n).encode()\n        return n\n\n    def rpush(self, key, value):\n        if not isinstance(value, bytes):\n            value = str(value).encode()\n        Redis._store.setdefault(key, []).append(value)\n\n    def lrange(self, key, start, end):\n        items = Redis._store.get(key, [])\n        return items[start:] if end == -1 else items[start:end + 1]\n';
  const CACHE_BASE = head + '"""Redis cache"""\nimport uuid\nfrom functools import wraps\nfrom typing import Callable, Optional, Union\n\nimport redis\n';
  const CACHE_SOL = CACHE_BASE + '\n\ndef count_calls(method: Callable) -> Callable:\n    """Counts how many times a method is called"""\n    @wraps(method)\n    def wrapper(self, *args, **kwargs):\n        self._redis.incr(method.__qualname__)\n        return method(self, *args, **kwargs)\n    return wrapper\n\n\nclass Cache:\n    """Stores data in Redis"""\n\n    def __init__(self):\n        self._redis = redis.Redis()\n        self._redis.flushdb()\n\n    @count_calls\n    def store(self, data: Union[str, bytes, int, float]) -> str:\n        """Stores data under a random key"""\n        key = str(uuid.uuid4())\n        self._redis.set(key, data)\n        return key\n\n    def get(self, key: str, fn: Optional[Callable] = None):\n        """Gets data and optionally converts it"""\n        value = self._redis.get(key)\n        if value is None or fn is None:\n            return value\n        return fn(value)\n\n    def get_str(self, key: str) -> str:\n        return self.get(key, lambda d: d.decode("utf-8"))\n\n    def get_int(self, key: str) -> int:\n        return self.get(key, int)\n';
  EX["bs-02"] = {
    quiz: [
      ["What kind of database is Redis?", ["Relational", "In-memory key-value store", "Graph", "Document only"], 1],
      ["What type does redis-py return for <code>get</code>?", ["str", "bytes", "int", "dict"], 1],
      ["Which Redis command increments a counter atomically?", ["ADD", "INCR", "PLUS", "SETINC"], 1],
      ["Why use Redis as a cache?", ["It's durable", "It's very fast (in memory), so repeated work can be skipped", "It has SQL", "It encrypts data"], 1],
    ],
    tasks: [
      py("Writing strings to Redis", "exercise.py", "<p>Create a <code>Cache</code> class. In <code>__init__</code>, store an instance of the Redis client as a private variable <code>_redis</code> and flush the instance. Create a <code>store</code> method that takes a <code>data</code> argument (str, bytes, int or float), generates a random key with <code>uuid</code>, stores the data under it and returns the key.</p>", CACHE_BASE, CACHE_SOL,
        [{ main: 'import redis\nCache = __import__("exercise").Cache\ncache = Cache()\nkey = cache.store(b"hello")\nprint(type(key).__name__, len(key))\nprint(redis.Redis().get(key))\n', out: "str 36\nb'hello'\n" }],
        { extraFiles: { "redis.py": FAKE_REDIS } }),
      py("Reading from Redis and recovering original type", "exercise.py", "<p>Add <code>get(self, key, fn=None)</code> that uses the optional callable <code>fn</code> to convert the data back, plus <code>get_str</code> and <code>get_int</code>.</p>", CACHE_BASE, CACHE_SOL,
        [{ main: 'Cache = __import__("exercise").Cache\ncache = Cache()\nfor value, fn in [(b"foo", None), (123, int), ("bar", lambda d: d.decode("utf-8"))]:\n    key = cache.store(value)\n    print(repr(cache.get(key, fn=fn)))\nprint(repr(cache.get_str(cache.store("hi"))), repr(cache.get_int(cache.store(7))))\n', out: "b'foo'\n123\n'bar'\n'hi' 7\n" }],
        { extraFiles: { "redis.py": FAKE_REDIS } }),
      py("Incrementing values", "exercise.py", "<p>Implement a decorator <code>count_calls</code> that takes a single method argument and returns a callable that increments the count for that key every time the method is called. Use the method's <code>__qualname__</code> as the key, and decorate <code>Cache.store</code>.</p>", CACHE_BASE, CACHE_SOL,
        [{ main: 'Cache = __import__("exercise").Cache\ncache = Cache()\ncache.store(b"first")\nprint(cache.get(cache.store.__qualname__))\ncache.store(b"second")\ncache.store(b"third")\nprint(cache.get(cache.store.__qualname__))\n', out: "b'1'\nb'3'\n" }],
        { extraFiles: { "redis.py": FAKE_REDIS } }),
    ],
    manual: ["Install Redis + redis-py and run your Cache against a real server", "Add <code>call_history</code> and <code>replay</code>, and the expiring web cache (advanced)"],
  };

  /* ================= alx-backend-user-data ================= */
  const FILTER_SOL = head + '"""Filtered logger"""\nimport logging\nimport re\nfrom typing import List\n\n\ndef filter_datum(fields: List[str], redaction: str, message: str, separator: str) -> str:\n    """Obfuscates the given fields in a log message"""\n    return re.sub(r"({})=[^{}]*".format("|".join(fields), separator), lambda m: m.group(1) + "=" + redaction, message)\n\n\nclass RedactingFormatter(logging.Formatter):\n    """Redacting Formatter class"""\n\n    REDACTION = "***"\n    FORMAT = "[HOLBERTON] %(name)s %(levelname)s %(asctime)-15s: %(message)s"\n    SEPARATOR = ";"\n\n    def __init__(self, fields: List[str]):\n        super(RedactingFormatter, self).__init__(self.FORMAT)\n        self.fields = fields\n\n    def format(self, record: logging.LogRecord) -> str:\n        """Filters values in incoming log records"""\n        record.msg = filter_datum(self.fields, self.REDACTION, record.getMessage(), self.SEPARATOR)\n        record.args = ()\n        return super().format(record)\n';
  EX["bu-00"] = {
    quiz: [
      ["What is PII?", ["A Python library", "Personally Identifiable Information (name, email, SSN…)", "A log level", "An encryption algorithm"], 1],
      ["Why hash passwords instead of encrypting them?", ["Hashes are reversible", "A one-way hash can't be decrypted if the database leaks", "Encryption is too slow", "It's the same"], 1],
      ["What does a salt protect against?", ["Typos", "Precomputed (rainbow table) attacks and identical hashes for identical passwords", "SQL injection", "XSS"], 1],
      ["Which function from bcrypt checks a password against a hash?", ["bcrypt.verify", "bcrypt.checkpw", "bcrypt.compare", "bcrypt.match"], 1],
    ],
    tasks: [
      py("Regex-ing", "filtered_logger.py", "<p>Write <code>filter_datum(fields, redaction, message, separator)</code> that returns the log message obfuscated: every value of a field in <code>fields</code> is replaced by <code>redaction</code>. Use a regex (<code>re.sub</code>) — one statement is enough.</p>", head + '"""Filtered logger"""\nimport re\nfrom typing import List\n', FILTER_SOL,
        [{ main: 'filter_datum = __import__("filtered_logger").filter_datum\nfields = ["password", "date_of_birth"]\nmessages = ["name=egg;email=eggmin@eggsample.com;password=eggcellent;date_of_birth=12/12/1986;", "name=bob;email=bob@dylan.com;password=bobbycool;date_of_birth=03/04/1993;"]\nfor m in messages:\n    print(filter_datum(fields, "xxx", m, ";"))\n', out: "name=egg;email=eggmin@eggsample.com;password=xxx;date_of_birth=xxx;\nname=bob;email=bob@dylan.com;password=xxx;date_of_birth=xxx;\n" }]),
      py("Log formatter", "filtered_logger.py", "<p>Implement <code>RedactingFormatter(logging.Formatter)</code> (REDACTION <code>***</code>, FORMAT <code>[HOLBERTON] %(name)s %(levelname)s %(asctime)-15s: %(message)s</code>, SEPARATOR <code>;</code>). Its constructor takes a list of fields; its <code>format</code> method filters the values using <code>filter_datum</code>.</p>", head + '"""Filtered logger"""\nimport logging\nimport re\nfrom typing import List\n', FILTER_SOL,
        [{ main: 'import logging\nRedactingFormatter = __import__("filtered_logger").RedactingFormatter\nmessage = "name=Bob;email=bob@dylan.com;ssn=000-123-0000;password=bobby2019;"\nlog_record = logging.LogRecord("my_logger", logging.INFO, None, None, message, None, None)\nformatter = RedactingFormatter(fields=("email", "ssn", "password"))\nout = formatter.format(log_record)\nprint(out.startswith("[HOLBERTON] my_logger INFO "))\nprint(out.split(": ", 1)[1])\n', out: "True\nname=Bob;email=***;ssn=***;password=***;\n" }]),
    ],
    manual: ["Create a logger that reads users from MySQL with env-var credentials and logs them redacted", "Hash and validate passwords with bcrypt"],
  };
  const BASIC_SOL = head + '"""Basic auth"""\nimport base64\n\n\nclass BasicAuth:\n    """Basic authentication helpers"""\n\n    def extract_base64_authorization_header(self, authorization_header: str) -> str:\n        """Returns the Base64 part of the header"""\n        if not isinstance(authorization_header, str) or not authorization_header.startswith("Basic "):\n            return None\n        return authorization_header[len("Basic "):]\n\n    def decode_base64_authorization_header(self, base64_authorization_header: str) -> str:\n        """Decodes the Base64 string as UTF-8"""\n        if not isinstance(base64_authorization_header, str):\n            return None\n        try:\n            return base64.b64decode(base64_authorization_header, validate=True).decode("utf-8")\n        except Exception:\n            return None\n\n    def extract_user_credentials(self, decoded_base64_authorization_header: str) -> (str, str):\n        """Returns (email, password)"""\n        h = decoded_base64_authorization_header\n        if not isinstance(h, str) or ":" not in h:\n            return (None, None)\n        email, password = h.split(":", 1)\n        return (email, password)\n';
  EX["bu-01"] = {
    quiz: [
      ["What's the difference between authentication and authorization?", ["None", "Authentication = who you are; authorization = what you may do", "Authorization = who you are", "Both mean login"], 1],
      ["Is Base64 encryption?", ["Yes", "No — it's an encoding anyone can reverse", "Only with a key", "Yes, AES-based"], 1],
      ["Which header carries Basic auth credentials?", ["Cookie", "Authorization: Basic &lt;base64(email:password)&gt;", "X-Auth", "Set-Cookie"], 1],
      ["Which status code means \"not authenticated\"?", ["401", "403", "404", "500"], 0],
    ],
    tasks: [
      py("Basic - Base64 part", "basic_auth.py", "<p>In class <code>BasicAuth</code>, add <code>extract_base64_authorization_header(self, authorization_header)</code> returning the Base64 part of the header. Return None if the header is None, not a string, or doesn't start with <code>Basic </code> (with a space).</p>", head + '"""Basic auth"""\nimport base64\n\n\nclass BasicAuth:\n    """Basic authentication helpers"""\n', BASIC_SOL,
        [{ main: 'a = __import__("basic_auth").BasicAuth()\nfor h in [None, 89, "Holberton", "Basic Holberton", "Basic SG9sYmVydG9u", "Basic SG9sYmVydG9uIFNjaG9vbA==", "Basic1234"]:\n    print(a.extract_base64_authorization_header(h))\n', out: "None\nNone\nNone\nHolberton\nSG9sYmVydG9u\nSG9sYmVydG9uIFNjaG9vbA==\nNone\n" }]),
      py("Basic - Base64 decode", "basic_auth.py", "<p>Add <code>decode_base64_authorization_header(self, base64_authorization_header)</code> returning the decoded value as a UTF-8 string. Return None if it's None, not a string, or not valid Base64.</p>", head + '"""Basic auth"""\nimport base64\n', BASIC_SOL,
        [{ main: 'a = __import__("basic_auth").BasicAuth()\nfor h in [None, 89, "Holberton", "SG9sYmVydG9u", "SG9sYmVydG9uIFNjaG9vbA==", a.extract_base64_authorization_header("Basic SG9sYmVydG9uIFNjaG9vbA==")]:\n    print(a.decode_base64_authorization_header(h))\n', out: "None\nNone\nNone\nHolberton\nHolberton School\nHolberton School\n" }]),
      py("Basic - User credentials", "basic_auth.py", "<p>Add <code>extract_user_credentials(self, decoded_base64_authorization_header)</code> returning the user email and password from the decoded value (<code>email:password</code>). Return <code>(None, None)</code> if it's None, not a string, or doesn't contain <code>:</code>.</p>", head + '"""Basic auth"""\nimport base64\n', BASIC_SOL,
        [{ main: 'a = __import__("basic_auth").BasicAuth()\nfor h in [None, 89, "Holberton School", "Holberton:School", "bob@gmail.com:toto1234", "bob@gmail.com:pass:word"]:\n    print(a.extract_user_credentials(h))\n', out: "(None, None)\n(None, None)\n(None, None)\n('Holberton', 'School')\n('bob@gmail.com', 'toto1234')\n('bob@gmail.com', 'pass:word')\n" }]),
    ],
    manual: ["Build the Flask API with <code>Auth</code>/<code>BasicAuth</code> classes, <code>require_auth</code> path matching and 401/403 handlers"],
  };
  EX["bu-02"] = {
    quiz: [
      ["What is a session ID?", ["The user's password", "A random token that maps to a logged-in user on the server", "The user id", "A cookie name"], 1],
      ["Where does the browser usually keep the session ID?", ["In a cookie", "In the URL only", "In localStorage only", "Nowhere"], 0],
      ["Why add an expiration to sessions?", ["To save disk", "To limit the damage if a session ID is stolen", "Browsers require it", "To log errors"], 1],
    ],
    tasks: [
      py("Create a session", "session_auth.py", "<p>Write class <code>SessionAuth</code> with a class attribute <code>user_id_by_session_id = {}</code>, a method <code>create_session(self, user_id=None)</code> that creates a Session ID (uuid4 string) for a user_id (None if user_id is None or not a string), and <code>user_id_for_session_id(self, session_id=None)</code> returning the user ID for a Session ID (None if not found or not a string).</p>", head + '"""Session auth"""\nimport uuid\n\n\nclass SessionAuth:\n    """Session authentication"""\n',
        head + '"""Session auth"""\nimport uuid\n\n\nclass SessionAuth:\n    """Session authentication"""\n    user_id_by_session_id = {}\n\n    def create_session(self, user_id: str = None) -> str:\n        """Creates a session id for user_id"""\n        if not isinstance(user_id, str):\n            return None\n        session_id = str(uuid.uuid4())\n        self.user_id_by_session_id[session_id] = user_id\n        return session_id\n\n    def user_id_for_session_id(self, session_id: str = None) -> str:\n        """Returns the user id for a session id"""\n        if not isinstance(session_id, str):\n            return None\n        return self.user_id_by_session_id.get(session_id)\n',
        [{ main: 'SessionAuth = __import__("session_auth").SessionAuth\nsa = SessionAuth()\nprint(sa.create_session(), sa.create_session(89))\nsid = sa.create_session("abcde")\nprint(len(sid), sa.user_id_for_session_id(sid))\nsid2 = sa.create_session("fghij")\nprint(sid2 != sid, sa.user_id_for_session_id(sid2))\nprint(sa.user_id_for_session_id(None), sa.user_id_for_session_id(89), sa.user_id_for_session_id("nope"))\n', out: "None None\n36 abcde\nTrue fghij\nNone None None\n" }]),
    ],
    manual: ["Add the session cookie, <code>/auth_session/login</code> and logout routes, expiration and DB-stored sessions"],
  };
  EX["bu-03"] = {
    quiz: [
      ["Which SQLAlchemy method finds the first row matching filters?", ["session.query(User).filter_by(**kw).first()", "User.find(**kw)", "session.get_first(User)", "User.select(**kw)"], 0],
      ["What should a password reset flow use?", ["The user's password", "A random, single-use reset token", "The email address as token", "The user id"], 1],
      ["Which status code for a forbidden action (logged in but not allowed)?", ["401", "403", "400", "302"], 1],
    ],
    tasks: [],
    manual: ["Build the user authentication service: SQLAlchemy User model, DB class, Auth class with bcrypt, Flask routes (users, sessions, profile, reset_password)", "Write an end-to-end integration test with <code>requests</code>"],
  };

  /* ================= alx-backend ================= */
  const BABY = "Year of Birth,Gender,Ethnicity,Child's First Name,Count,Rank\n" + Array.from({ length: 30 }, (_, i) => `2016,FEMALE,ASIAN AND PACIFIC ISLANDER,Name${i + 1},${100 - i},${i + 1}`).join("\n") + "\n";
  const PAGE_SOL = head + '"""Simple pagination"""\nimport csv\nimport math\nfrom typing import List, Tuple\n\n\ndef index_range(page: int, page_size: int) -> Tuple[int, int]:\n    """Returns the start and end index for a page"""\n    start = (page - 1) * page_size\n    return (start, start + page_size)\n\n\nclass Server:\n    """Server class to paginate a database of popular baby names."""\n    DATA_FILE = "Popular_Baby_Names.csv"\n\n    def __init__(self):\n        self.__dataset = None\n\n    def dataset(self) -> List[List]:\n        """Cached dataset"""\n        if self.__dataset is None:\n            with open(self.DATA_FILE) as f:\n                reader = csv.reader(f)\n                dataset = [row for row in reader]\n            self.__dataset = dataset[1:]\n        return self.__dataset\n\n    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:\n        """Returns one page of the dataset"""\n        assert isinstance(page, int) and page > 0\n        assert isinstance(page_size, int) and page_size > 0\n        start, end = index_range(page, page_size)\n        return self.dataset()[start:end]\n\n    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:\n        """Returns hypermedia pagination info"""\n        data = self.get_page(page, page_size)\n        total_pages = math.ceil(len(self.dataset()) / page_size)\n        return {"page_size": len(data), "page": page, "data": data,\n                "next_page": page + 1 if page < total_pages else None,\n                "prev_page": page - 1 if page > 1 else None,\n                "total_pages": total_pages}\n';
  EX["bb-00"] = {
    quiz: [
      ["For page 3 with page_size 15, what is the start index?", ["30", "45", "15", "3"], 0],
      ["What is hypermedia pagination?", ["Paginating images", "Including links/info like next_page and total_pages in the response", "Infinite scroll", "Server-side rendering"], 1],
      ["What problem does deletion-resilient pagination solve?", ["Slow queries", "Rows skipped or repeated when data is deleted between page requests", "Sorting", "Caching"], 1],
    ],
    tasks: [
      py("Simple helper function", "0-simple_helper_function.py", "<p>Write <code>index_range(page, page_size)</code> that returns a tuple of size two: a start index and an end index for those pagination parameters (pages are 1-indexed).</p>", head + '"""Pagination helper"""\nfrom typing import Tuple\n',
        head + '"""Pagination helper"""\nfrom typing import Tuple\n\n\ndef index_range(page: int, page_size: int) -> Tuple[int, int]:\n    """Returns the start and end index for a page"""\n    start = (page - 1) * page_size\n    return (start, start + page_size)\n',
        [{ main: 'index_range = __import__("0-simple_helper_function").index_range\nprint(index_range(1, 7))\nprint(index_range(page=3, page_size=15))\n', out: "(0, 7)\n(30, 45)\n" }]),
      py("Simple pagination", "1-simple_pagination.py", "<p>Implement <code>Server.get_page(page=1, page_size=10)</code>: assert both are integers &gt; 0, then use <code>index_range</code> to return the right page of the dataset (an empty list if out of range). The CSV file is provided.</p>", head + '"""Simple pagination"""\nimport csv\nimport math\nfrom typing import List, Tuple\n', PAGE_SOL,
        [{ main: 'Server = __import__("1-simple_pagination").Server\ns = Server()\nfor args in [(1, 3), (3, 2), (300, 20)]:\n    print([r[3] for r in s.get_page(*args)])\nfor bad in [(-10, 2), (0, 0), (2, "Bob")]:\n    try:\n        s.get_page(*bad)\n    except AssertionError:\n        print("AssertionError raised with", bad)\n', out: "['Name1', 'Name2', 'Name3']\n['Name5', 'Name6']\n[]\nAssertionError raised with (-10, 2)\nAssertionError raised with (0, 0)\nAssertionError raised with (2, 'Bob')\n" }],
        { extraFiles: { "Popular_Baby_Names.csv": BABY } }),
      py("Hypermedia pagination", "2-hypermedia_pagination.py", "<p>Add <code>get_hyper(page=1, page_size=10)</code> returning a dict with <code>page_size</code> (length of the returned page), <code>page</code>, <code>data</code>, <code>next_page</code> (None if none), <code>prev_page</code> (None if none) and <code>total_pages</code>.</p>", head + '"""Hypermedia pagination"""\nimport csv\nimport math\nfrom typing import List, Tuple\n', PAGE_SOL,
        [{ main: 'Server = __import__("2-hypermedia_pagination").Server\ns = Server()\nfor args in [(1, 2), (2, 10), (3, 15), (100, 3)]:\n    h = s.get_hyper(*args)\n    print(h["page"], h["page_size"], h["next_page"], h["prev_page"], h["total_pages"])\n', out: "1 2 2 None 15\n2 10 3 1 3\n3 0 None 2 2\n100 0 None 99 10\n" }],
        { extraFiles: { "Popular_Baby_Names.csv": BABY } }),
    ],
  };
  const BASECACHE = head + '"""BaseCaching module"""\n\n\nclass BaseCaching():\n    """BaseCaching defines constants and a print method"""\n    MAX_ITEMS = 4\n\n    def __init__(self):\n        self.cache_data = {}\n\n    def print_cache(self):\n        """Print the cache"""\n        print("Current cache:")\n        for key in sorted(self.cache_data.keys()):\n            print("{}: {}".format(key, self.cache_data.get(key)))\n\n    def put(self, key, item):\n        raise NotImplementedError("put must be implemented in your cache class")\n\n    def get(self, key):\n        raise NotImplementedError("get must be implemented in your cache class")\n';
  const CACHE_MAIN = (mod, cls) => `${cls} = __import__("${mod}").${cls}\nc = ${cls}()\nfor k, v in [("A", "Hello"), ("B", "World"), ("C", "Holberton"), ("D", "School")]:\n    c.put(k, v)\nprint(c.get("B"))\nc.put("E", "Battery")\nc.print_cache()\nc.put("C", "Street")\nprint(c.get("A"))\nc.put("F", "Mission")\nc.print_cache()\nc.put(None, "x")\nprint(c.get(None), c.get("Z"))\n`;
  const cacheTask = (title, mod, cls, rule, sol, out) => py(title, mod + ".py", `<p>Create a class <code>${cls}</code> that inherits from <code>BaseCaching</code> (provided in <code>base_caching.py</code>). <code>put(key, item)</code> assigns <code>self.cache_data[key] = item</code> (do nothing if key or item is None). If the number of items is higher than <code>BaseCaching.MAX_ITEMS</code>, ${rule} and print <code>DISCARD: &lt;key&gt;</code>. <code>get(key)</code> returns the value or None.</p>`,
    head + `"""${cls} module"""\nBaseCaching = __import__("base_caching").BaseCaching\n`, sol, [{ main: CACHE_MAIN(mod, cls), out }], { extraFiles: { "base_caching.py": BASECACHE } });
  EX["bb-01"] = {
    quiz: [
      ["Which item does a FIFO cache evict?", ["The newest", "The first one put in", "The least recently used", "The most used"], 1],
      ["Which item does an LRU cache evict?", ["The least recently used (read or written)", "The oldest inserted", "A random one", "The biggest"], 0],
      ["What's the main limit of any cache?", ["It's always slower", "Its size — and the risk of serving stale data", "It needs SQL", "It can't store strings"], 1],
    ],
    tasks: [
      cacheTask("FIFO caching", "1-fifo_cache", "FIFOCache", "discard the <strong>first</strong> item put in the cache (FIFO)",
        head + '"""FIFOCache module"""\nBaseCaching = __import__("base_caching").BaseCaching\n\n\nclass FIFOCache(BaseCaching):\n    """FIFO cache"""\n\n    def __init__(self):\n        super().__init__()\n        self.order = []\n\n    def put(self, key, item):\n        """Adds an item"""\n        if key is None or item is None:\n            return\n        if key not in self.cache_data:\n            self.order.append(key)\n        self.cache_data[key] = item\n        if len(self.cache_data) > BaseCaching.MAX_ITEMS:\n            first = self.order.pop(0)\n            del self.cache_data[first]\n            print("DISCARD: {}".format(first))\n\n    def get(self, key):\n        """Gets an item"""\n        return self.cache_data.get(key)\n',
        "World\nDISCARD: A\nCurrent cache:\nB: World\nC: Holberton\nD: School\nE: Battery\nNone\nDISCARD: B\nCurrent cache:\nC: Street\nD: School\nE: Battery\nF: Mission\nNone None\n"),
      cacheTask("LRU Caching", "3-lru_cache", "LRUCache", "discard the <strong>least recently used</strong> item (LRU) — both <code>get</code> and <code>put</code> count as a use",
        head + '"""LRUCache module"""\nBaseCaching = __import__("base_caching").BaseCaching\n\n\nclass LRUCache(BaseCaching):\n    """LRU cache"""\n\n    def __init__(self):\n        super().__init__()\n        self.order = []\n\n    def _touch(self, key):\n        if key in self.order:\n            self.order.remove(key)\n        self.order.append(key)\n\n    def put(self, key, item):\n        """Adds an item"""\n        if key is None or item is None:\n            return\n        self.cache_data[key] = item\n        self._touch(key)\n        if len(self.cache_data) > BaseCaching.MAX_ITEMS:\n            lru = self.order.pop(0)\n            del self.cache_data[lru]\n            print("DISCARD: {}".format(lru))\n\n    def get(self, key):\n        """Gets an item"""\n        if key in self.cache_data:\n            self._touch(key)\n        return self.cache_data.get(key)\n',
        "World\nDISCARD: A\nCurrent cache:\nB: World\nC: Holberton\nD: School\nE: Battery\nNone\nDISCARD: D\nCurrent cache:\nB: World\nC: Street\nE: Battery\nF: Mission\nNone None\n"),
    ],
    manual: ["Also implement <code>BasicCache</code>, <code>LIFOCache</code>, <code>MRUCache</code> and <code>LFUCache</code>"],
  };
  EX["bb-02"] = { quiz: [["What does i18n stand for?", ["Internet 18 networks", "Internationalization (18 letters between i and n)", "A Python version", "Index 18"], 1], ["Which Flask extension handles translations?", ["Flask-Babel", "Flask-Login", "Flask-CORS", "Flask-I18n"], 0], ["Which request header tells you the user's preferred languages?", ["Accept-Language", "Content-Language", "Locale", "X-Lang"], 0]], tasks: [], manual: ["Set up Flask-Babel, a locale selector (URL param, user setting, header) and translated templates", "Display the current time in the user's time zone"] };
  EX["bb-03"] = { quiz: [["What is a message queue for?", ["Storing files", "Processing jobs asynchronously in the background", "Rendering HTML", "Routing HTTP"], 1], ["What does Redis pub/sub do?", ["Stores lists", "Publishers send messages to channels; subscribers receive them", "Encrypts messages", "Sorts sets"], 1]], tasks: [], manual: ["Use node-redis (set/get, hashes, pub/sub)", "Create Kue job creators and processors, with progress and errors", "Build the in-stock Express app with Redis reservations"] };
  EX["files_manager"] = { quiz: [["How does the API know who is calling after login?", ["IP address", "A token (X-Token) mapped to the user id in Redis", "The email in the URL", "A cookie only"], 1], ["Why process thumbnails in a background queue (Bull)?", ["It's prettier", "Image work is slow; the API can answer immediately", "Bull is required by Express", "To save memory"], 1], ["What is SHA1 used for in this project?", ["Encrypting files", "Hashing passwords (as specified)", "Generating ids", "Compressing images"], 1]], tasks: [], manual: ["Create Redis and MongoDB utility classes", "Endpoints: /status, /stats, POST /users, /connect, /disconnect, /users/me", "Upload files (folders, files, images), list with pagination, publish/unpublish, get data", "Generate image thumbnails with a Bull worker, and write tests"] };

  /* ================= interview prep (alx-interview) ================= */
  const ip = (t, file, p, sig, sol, tests, extra) => py(t, file, p, head + `"""${t}"""\n\n\ndef ${sig}:\n    pass\n`, sol, tests, extra);
  EX["int-00"] = { quiz: [["What's Pascal's triangle row 4 (starting at row 0)?", ["1 4 6 4 1", "1 3 3 1", "1 5 10 10 5 1", "1 4 4 1"], 0]], tasks: [ip("Pascal's Triangle", "0-pascal_triangle.py", "<p>Create <code>def pascal_triangle(n):</code> that returns a list of lists of integers representing Pascal's triangle of n. Return an empty list if n &lt;= 0.</p>", "pascal_triangle(n)",
    head + '"""Pascal\'s triangle"""\n\n\ndef pascal_triangle(n):\n    """Returns Pascal\'s triangle of n"""\n    rows = []\n    for i in range(n):\n        row = [1] * (i + 1)\n        for j in range(1, i):\n            row[j] = rows[-1][j - 1] + rows[-1][j]\n        rows.append(row)\n    return rows\n',
    [{ main: 'f = __import__("0-pascal_triangle").pascal_triangle\nfor r in f(5):\n    print("[{}]".format(",".join(str(x) for x in r)))\nprint(f(0))\n', out: "[1]\n[1,1]\n[1,2,1]\n[1,3,3,1]\n[1,4,6,4,1]\n[]\n" }])] };
  EX["int-01"] = { quiz: [["Lockboxes is really a…", ["Sorting problem", "Graph reachability problem (BFS/DFS from box 0)", "Dynamic programming problem", "String problem"], 1]], tasks: [ip("Lockboxes", "0-lockboxes.py", "<p>You have n locked boxes numbered 0 to n-1; each box may contain keys (box numbers). Box 0 is unlocked. Write <code>def canUnlockAll(boxes):</code> returning True if all boxes can be opened.</p>", "canUnlockAll(boxes)",
    head + '"""Lockboxes"""\n\n\ndef canUnlockAll(boxes):\n    """Returns True if all boxes can be opened"""\n    opened = {0}\n    stack = [0]\n    while stack:\n        for key in boxes[stack.pop()]:\n            if 0 <= key < len(boxes) and key not in opened:\n                opened.add(key)\n                stack.append(key)\n    return len(opened) == len(boxes)\n',
    [{ main: 'f = __import__("0-lockboxes").canUnlockAll\nprint(f([[1], [2], [3], [4], []]))\nprint(f([[1, 4, 6], [2], [0, 4, 1], [5, 6, 2], [3], [4, 1], [6]]))\nprint(f([[1, 4], [2], [0, 4, 1], [3], [], [4, 1], [5, 6]]))\n', out: "True\nTrue\nFalse\n" }])] };
  EX["int-02"] = { quiz: [["Why does the answer relate to prime factors?", ["It doesn't", "Copy All + Paste k times multiplies by k+1, so the cost is the sum of prime factors of n", "Because of binary", "Because n is even"], 1]], tasks: [ip("Minimum Operations", "0-minoperations.py", "<p>A text file has a single character <code>H</code>. Your editor can only do Copy All and Paste. Given n, write <code>def minOperations(n):</code> returning the fewest operations needed to get exactly n H characters (0 if impossible).</p>", "minOperations(n)",
    head + '"""Minimum operations"""\n\n\ndef minOperations(n):\n    """Sum of the prime factors of n"""\n    if not isinstance(n, int) or n < 2:\n        return 0\n    ops, d = 0, 2\n    while n > 1:\n        while n % d == 0:\n            ops += d\n            n //= d\n        d += 1\n    return ops\n',
    [{ main: 'f = __import__("0-minoperations").minOperations\nprint(f(4), f(12), f(9), f(1), f(0))\n', out: "4 7 6 0 0\n" }])] };
  EX["int-03"] = { quiz: [["How do you read stdin line by line in Python?", ["for line in sys.stdin:", "input.lines()", "sys.read()", "open(0).lines"], 0]], tasks: [py("Log parsing", "0-stats.py", "<p>Read stdin line by line. Lines look like <code>&lt;IP&gt; - [&lt;date&gt;] \"GET /projects/260 HTTP/1.1\" &lt;status code&gt; &lt;file size&gt;</code> (skip lines with another format). After every 10 lines and at the end, print <code>File size: &lt;total size&gt;</code> then, for each status code in ascending order (200, 301, 400, 401, 403, 404, 405, 500 only, and only if seen), <code>&lt;status code&gt;: &lt;number&gt;</code>.</p>", head + '"""Log parsing"""\nimport sys\n',
    head + '"""Log parsing"""\nimport sys\n\nCODES = ["200", "301", "400", "401", "403", "404", "405", "500"]\n\n\ndef report(size, counts):\n    print("File size: {}".format(size))\n    for code in CODES:\n        if counts.get(code):\n            print("{}: {}".format(code, counts[code]))\n\n\nif __name__ == "__main__":\n    size, counts, n = 0, {}, 0\n    try:\n        for line in sys.stdin:\n            parts = line.split()\n            if len(parts) < 2:\n                continue\n            n += 1\n            try:\n                size += int(parts[-1])\n            except ValueError:\n                pass\n            if parts[-2] in CODES:\n                counts[parts[-2]] = counts.get(parts[-2], 0) + 1\n            if n % 10 == 0:\n                report(size, counts)\n    except KeyboardInterrupt:\n        report(size, counts)\n        raise\n    report(size, counts)\n',
    [{ stdin: Array.from({ length: 12 }, (_, i) => `1.2.3.${i} - [2017-02-05 23:31:22] "GET /projects/260 HTTP/1.1" ${["200", "404", "200", "500", "301"][i % 5]} ${100 + i}`).join("\n") + "\n", out: "File size: 1045\n200: 4\n301: 2\n404: 2\n500: 2\nFile size: 1266\n200: 5\n301: 2\n404: 3\n500: 2\n" }])] };
  EX["int-04"] = { quiz: [["How many bytes can a UTF-8 character use?", ["1 only", "1 to 4", "2", "8"], 1], ["What does the leading byte 110xxxxx mean?", ["A 1-byte character", "Start of a 2-byte character", "A continuation byte", "Invalid"], 1]], tasks: [ip("UTF-8 Validation", "0-validate_utf8.py", "<p>Write <code>def validUTF8(data):</code> that determines if a list of integers (each representing 1 byte; only the 8 least significant bits matter) is a valid UTF-8 encoding.</p>", "validUTF8(data)",
    head + '"""UTF-8 validation"""\n\n\ndef validUTF8(data):\n    """Returns True if data is valid UTF-8"""\n    remaining = 0\n    for byte in data:\n        b = byte & 0xFF\n        if remaining:\n            if b >> 6 != 0b10:\n                return False\n            remaining -= 1\n        elif b >> 7 == 0:\n            continue\n        elif b >> 5 == 0b110:\n            remaining = 1\n        elif b >> 4 == 0b1110:\n            remaining = 2\n        elif b >> 3 == 0b11110:\n            remaining = 3\n        else:\n            return False\n    return remaining == 0\n',
    [{ main: 'f = __import__("0-validate_utf8").validUTF8\nprint(f([65]))\nprint(f([80, 121, 116, 104, 111, 110, 32, 105, 115, 32, 99, 111, 111, 108, 33]))\nprint(f([229, 65, 127, 256]))\nprint(f([197, 130, 1]))\nprint(f([235, 140]))\n', out: "True\nTrue\nFalse\nTrue\nFalse\n" }])] };
  EX["int-05"] = { quiz: [["What technique solves N queens?", ["Greedy", "Backtracking", "Sorting", "Hashing"], 1]], tasks: [py("N queens", "0-nqueens.py", "<p>Usage: <code>nqueens N</code>. If the number of arguments is wrong, print <code>Usage: nqueens N</code> and exit 1. If N isn't an integer, print <code>N must be a number</code>; if N &lt; 4, print <code>N must be at least 4</code> (exit 1). Otherwise print every solution, one per line, as a list of <code>[row, col]</code> pairs, in the order found by trying columns left to right row by row.</p>", head + '"""N queens"""\nimport sys\n',
    head + '"""N queens"""\nimport sys\n\n\ndef solve(n, row, cols, out):\n    if row == n:\n        out.append([[r, c] for r, c in enumerate(cols)])\n        return\n    for c in range(n):\n        if all(c != pc and abs(c - pc) != row - pr for pr, pc in enumerate(cols)):\n            solve(n, row + 1, cols + [c], out)\n\n\nif __name__ == "__main__":\n    if len(sys.argv) != 2:\n        print("Usage: nqueens N")\n        sys.exit(1)\n    try:\n        n = int(sys.argv[1])\n    except ValueError:\n        print("N must be a number")\n        sys.exit(1)\n    if n < 4:\n        print("N must be at least 4")\n        sys.exit(1)\n    sols = []\n    solve(n, 0, [], sols)\n    for s in sols:\n        print(s)\n',
    [{ args: ["4"], out: "[[0, 1], [1, 3], [2, 0], [3, 2]]\n[[0, 2], [1, 0], [2, 3], [3, 1]]\n" }, { args: ["3"], out: "N must be at least 4\n", code: 1 }, { args: ["x"], out: "N must be a number\n", code: 1 }, { args: [], out: "Usage: nqueens N\n", code: 1 }])] };
  EX["int-06"] = { quiz: [["How do you keep API results in the original order when requests are async?", ["Hope", "Chain them (await each in order) or Promise.all on the ordered list", "Use setTimeout", "Sort alphabetically"], 1]], tasks: [], manual: ["Write <code>0-starwars_characters.js</code>: print all characters of a Star Wars movie, in order, using the <code>request</code> module"] };
  EX["int-07"] = { quiz: [["Rotating a matrix 90° clockwise equals…", ["Transpose then reverse each row", "Reverse rows only", "Transpose only", "Sort it"], 0]], tasks: [ip("Rotate 2D Matrix", "0-rotate_2d_matrix.py", "<p>Given an n x n 2D matrix, rotate it 90 degrees clockwise <strong>in place</strong>. Prototype: <code>def rotate_2d_matrix(matrix):</code> (return nothing).</p>", "rotate_2d_matrix(matrix)",
    head + '"""Rotate 2D matrix"""\n\n\ndef rotate_2d_matrix(matrix):\n    """Rotates an n x n matrix 90 degrees clockwise in place"""\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for row in matrix:\n        row.reverse()\n',
    [{ main: 'f = __import__("0-rotate_2d_matrix").rotate_2d_matrix\nm = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nr = f(m)\nprint(m, r)\n', out: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]] None\n" }])] };
  EX["int-08"] = { quiz: [["Why doesn't the greedy algorithm always work for coin change?", ["It's too slow", "With some coin sets, taking the biggest coin first isn't optimal (e.g. 1, 3, 4 for 6)", "Coins can't be negative", "It always works"], 1]], tasks: [ip("Change comes from within", "0-making_change.py", "<p>Write <code>def makeChange(coins, total):</code> returning the fewest number of coins needed to meet <code>total</code>. If total is 0 or less, return 0; if it can't be met, return -1.</p>", "makeChange(coins, total)",
    head + '"""Making change"""\n\n\ndef makeChange(coins, total):\n    """Fewest coins to make total (-1 if impossible)"""\n    if total <= 0:\n        return 0\n    INF = total + 1\n    best = [0] + [INF] * total\n    for amount in range(1, total + 1):\n        for c in coins:\n            if c <= amount and best[amount - c] + 1 < best[amount]:\n                best[amount] = best[amount - c] + 1\n    return best[total] if best[total] != INF else -1\n',
    [{ main: 'f = __import__("0-making_change").makeChange\nprint(f([1, 2, 25], 37))\nprint(f([1256, 54, 48, 16, 102], 1453))\nprint(f([1, 3, 4], 6))\nprint(f([2], 0))\n', out: "7\n-1\n2\n0\n" }])] };
  EX["int-09"] = { quiz: [["Each land cell contributes 4 to the perimeter minus…", ["1 per neighbour that is also land", "2 per neighbour that is also land", "Nothing", "Its row number"], 0]], tasks: [ip("Island Perimeter", "0-island_perimeter.py", "<p>Write <code>def island_perimeter(grid):</code> returning the perimeter of the island described in grid (0 = water, 1 = land; one island, no lakes; cells are connected horizontally/vertically).</p>", "island_perimeter(grid)",
    head + '"""Island perimeter"""\n\n\ndef island_perimeter(grid):\n    """Returns the perimeter of the island"""\n    p = 0\n    for i, row in enumerate(grid):\n        for j, cell in enumerate(row):\n            if cell:\n                p += 4\n                if i > 0 and grid[i - 1][j]:\n                    p -= 2\n                if j > 0 and row[j - 1]:\n                    p -= 2\n    return p\n',
    [{ main: 'f = __import__("0-island_perimeter").island_perimeter\ngrid = [[0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0]]\nprint(f(grid))\nprint(f([[1]]))\n', out: "12\n4\n" }])] };
  EX["int-0A"] = { quiz: [["What's the efficient way to count primes up to n many times?", ["Trial division each time", "A Sieve of Eratosthenes computed once", "Random testing", "Recursion"], 1]], tasks: [ip("Prime Game", "0-prime_game.py", "<p>Maria and Ben play x rounds; in each round they have the integers 1..n. Players alternately pick a prime from the set and remove it and all its multiples; Maria starts. The player who can't move loses. Write <code>def isWinner(x, nums):</code> returning the name of the player who won the most rounds (<code>\"Maria\"</code> or <code>\"Ben\"</code>), or None if it's a tie.</p>", "isWinner(x, nums)",
    head + '"""Prime game"""\n\n\ndef isWinner(x, nums):\n    """Returns the overall winner"""\n    if not nums or x < 1:\n        return None\n    n = max(nums)\n    sieve = [True] * (n + 1)\n    sieve[0:2] = [False, False][:n + 1]\n    for i in range(2, int(n ** 0.5) + 1):\n        if sieve[i]:\n            for j in range(i * i, n + 1, i):\n                sieve[j] = False\n    count, primes = [0] * (n + 1), 0\n    for i in range(n + 1):\n        if sieve[i]:\n            primes += 1\n        count[i] = primes\n    maria = sum(1 for k in nums[:x] if count[k] % 2 == 1)\n    ben = min(x, len(nums)) - maria\n    if maria == ben:\n        return None\n    return "Maria" if maria > ben else "Ben"\n',
    [{ main: 'f = __import__("0-prime_game").isWinner\nprint("Winner: {}".format(f(5, [2, 5, 1, 4, 3])))\nprint("Winner: {}".format(f(1, [1])))\nprint("Winner: {}".format(f(2, [2, 1])))\n', out: "Winner: Ben\nWinner: Ben\nWinner: None\n" }])] };
})();
