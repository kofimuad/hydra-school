/* Practice for Foundations – SQL, HTTP/APIs, JavaScript, jQuery and the rest of the AirBnB clone. */
(function () {
  const EX = (window.EX = window.EX || {});
  const sql = (t, file, p, sol, extra) => Object.assign({ t, lang: "sql", file, p, start: "-- write your query here\n", sol, tests: [{}] }, extra || {});
  const js = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "js", file, p, start, sol, tests }, extra || {});
  const py = (t, file, p, start, sol, tests, extra) => Object.assign({ t, lang: "python", file, p, start, sol, tests }, extra || {});
  const head = "#!/usr/bin/python3\n";
  const node = "#!/usr/bin/node\n";
  const JQ = '<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>';

  /* ---------------- SQL introduction ---------------- */
  const T1 = "CREATE TABLE first_table (id INT, name VARCHAR(256));\nINSERT INTO first_table VALUES (89, 'Best School'), (2, 'Holberton'), (89, 'Again'), (5, 'ALX');\n" +
    "CREATE TABLE second_table (id INT, name VARCHAR(256), score INT);\nINSERT INTO second_table VALUES (1, 'John', 10), (2, 'Alex', 3), (3, 'Bob', 14), (4, 'George', 8), (5, NULL, 4), (6, 'Aria', 18), (7, NULL, 12), (8, 'Lily', 8), (9, 'Mia', 8);\n";
  EX["hl-0D"] = {
    quiz: [
      ["What does SQL stand for?", ["Simple Query Language", "Structured Query Language", "Server Query Logic", "Sequential Query List"], 1],
      ["Which statement adds a new row?", ["ADD", "INSERT INTO", "UPDATE", "CREATE ROW"], 1],
      ["Which keyword filters <em>groups</em> after GROUP BY?", ["WHERE", "HAVING", "ORDER BY", "FILTER"], 1],
      ["What does <code>SELECT COUNT(*) FROM t;</code> return?", ["All rows", "The number of rows", "The number of columns", "The first row"], 1],
      ["What's the difference between DDL and DML?", ["None", "DDL defines structure (CREATE, ALTER, DROP); DML manipulates data (SELECT, INSERT, UPDATE, DELETE)", "DML defines structure", "DDL is only for MySQL"], 1],
    ],
    tasks: [
      sql("List all rows", "6-list_values.sql", "<p>List all rows of the table <code>first_table</code>, all fields.</p>", "SELECT * FROM first_table;", { setup: T1 }),
      sql("First add", "7-insert_value.sql", "<p>Insert a new row in <code>first_table</code>: <code>id = 89</code>, <code>name = Best School</code>.</p>", "INSERT INTO first_table (id, name) VALUES (89, 'Best School');", { setup: T1, check: "SELECT * FROM first_table;" }),
      sql("Count 89", "8-count_89.sql", "<p>Display the number of records with <code>id = 89</code> in <code>first_table</code>.</p>", "SELECT COUNT(*) FROM first_table WHERE id = 89;", { setup: T1 }),
      sql("List by best", "10-top_score.sql", "<p>List all records of <code>second_table</code>: display the <code>score</code> and the <code>name</code> (in this order), ordered by score, top first.</p>", "SELECT score, name FROM second_table ORDER BY score DESC;", { setup: T1, ordered: true }),
      sql("Select the best", "11-best_score.sql", "<p>List records with a <code>score &gt;= 10</code> in <code>second_table</code>: score and name, ordered by score (top first).</p>", "SELECT score, name FROM second_table WHERE score >= 10 ORDER BY score DESC;", { setup: T1, ordered: true }),
      sql("Cheating is bad", "12-no_cheating.sql", "<p>Update the score of Bob to 10 in <code>second_table</code>, using the name (not the id).</p>", "UPDATE second_table SET score = 10 WHERE name = 'Bob';", { setup: T1, check: "SELECT * FROM second_table;" }),
      sql("Score too low", "13-change_class.sql", "<p>Remove all records with a <code>score &lt;= 5</code> in <code>second_table</code>.</p>", "DELETE FROM second_table WHERE score <= 5;", { setup: T1, check: "SELECT * FROM second_table;" }),
      sql("Average", "14-average.sql", "<p>Compute the score average of all records in <code>second_table</code>. The result column name should be <code>average</code>.</p>", "SELECT AVG(score) AS average FROM second_table;", { setup: T1 }),
      sql("Number by score", "15-groups.sql", "<p>List the number of records with the same score: display the <code>score</code> and the number of records for it, with the label <code>number</code>, sorted by number (descending), then by score.</p>", "SELECT score, COUNT(*) AS number FROM second_table GROUP BY score ORDER BY number DESC, score DESC;", { setup: T1, ordered: true }),
      sql("Say my name", "16-no_link.sql", "<p>List all records of <code>second_table</code> with a <code>name</code> (don't list rows without a name): score and name, ordered by descending score.</p>", "SELECT score, name FROM second_table WHERE name IS NOT NULL ORDER BY score DESC, name;", { setup: T1, ordered: false }),
    ],
    manual: ["Install MySQL 8 locally (or use Docker) and run these same queries with <code>cat file.sql | mysql -uroot -p db</code>"],
  };

  /* ---------------- SQL more queries ---------------- */
  const TV = "CREATE TABLE tv_genres (id INT PRIMARY KEY, name VARCHAR(256));\nINSERT INTO tv_genres VALUES (1, 'Drama'), (2, 'Mystery'), (3, 'Adventure'), (4, 'Suspense'), (5, 'Thriller'), (6, 'Comedy');\n" +
    "CREATE TABLE tv_shows (id INT PRIMARY KEY, title VARCHAR(256));\nINSERT INTO tv_shows VALUES (1, 'House'), (2, 'Game of Thrones'), (3, 'The Big Bang Theory'), (4, 'New Girl'), (5, 'Silicon Valley'), (6, 'Breaking Bad'), (7, 'Better Call Saul'), (8, 'Dexter'), (9, 'Better Things');\n" +
    "CREATE TABLE tv_show_genres (show_id INT, genre_id INT);\nINSERT INTO tv_show_genres VALUES (1, 1), (1, 2), (2, 1), (2, 3), (3, 6), (4, 6), (5, 6), (6, 1), (6, 4), (6, 5), (7, 1), (7, 4), (8, 1), (8, 2), (8, 4), (8, 5);\n";
  EX["hl-0E"] = {
    quiz: [
      ["What does a PRIMARY KEY guarantee?", ["The column is indexed only", "Each value is unique and not NULL", "The column is a foreign key", "Values are sorted"], 1],
      ["What does a FOREIGN KEY do?", ["Encrypts a column", "Links a column to the primary key of another table", "Makes a column unique", "Deletes rows"], 1],
      ["Which JOIN keeps all rows of the left table even without a match?", ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "RIGHT JOIN"], 1],
      ["Which statement gives a MySQL user all privileges on a database?", ["GRANT ALL PRIVILEGES ON db.* TO 'user'@'localhost';", "ALLOW ALL ON db", "SET PRIVILEGES user", "CREATE PRIVILEGE"], 0],
      ["What does a subquery do?", ["A query inside another query", "A query that runs twice", "An index", "A stored procedure"], 0],
    ],
    tasks: [
      sql("Not null", "2-create_read_user.sql", "<p>Create the table <code>id_not_null</code> with <code>id INT</code> with the default value 1, and <code>name VARCHAR(256)</code>. (If the table already exists, don't fail.) The checker then inserts a row with only a name.</p>", "CREATE TABLE IF NOT EXISTS id_not_null (id INT DEFAULT 1, name VARCHAR(256));", { check: "INSERT INTO id_not_null (name) VALUES ('x'); SELECT * FROM id_not_null;", file: "4-never_empty.sql" }),
      sql("Unique ID", "5-unique_id.sql", "<p>Create the table <code>unique_id</code>: <code>id INT</code> with default 1 that must be unique, and <code>name VARCHAR(256)</code>.</p>", "CREATE TABLE IF NOT EXISTS unique_id (id INT DEFAULT 1 UNIQUE, name VARCHAR(256));", { check: "INSERT INTO unique_id (id, name) VALUES (1, 'a'); INSERT OR IGNORE INTO unique_id (id, name) VALUES (1, 'b'); SELECT COUNT(*) FROM unique_id;" }),
      sql("Genre ID by show", "10-genre_id_by_show.sql", "<p>List all shows contained in the database that have at least one genre linked. Display <code>tv_shows.title</code> - <code>tv_show_genres.genre_id</code>, sorted by title and genre_id. Use only one SELECT.</p>", "SELECT tv_shows.title, tv_show_genres.genre_id FROM tv_shows JOIN tv_show_genres ON tv_shows.id = tv_show_genres.show_id ORDER BY tv_shows.title, tv_show_genres.genre_id;", { setup: TV, ordered: true }),
      sql("Genre ID for all shows", "11-genre_id_all_shows.sql", "<p>List <strong>all</strong> shows, even those without a genre: <code>title</code> and <code>genre_id</code> (NULL if none), sorted by title and genre_id.</p>", "SELECT tv_shows.title, tv_show_genres.genre_id FROM tv_shows LEFT JOIN tv_show_genres ON tv_shows.id = tv_show_genres.show_id ORDER BY tv_shows.title, tv_show_genres.genre_id;", { setup: TV, ordered: true }),
      sql("No genre", "12-no_genre.sql", "<p>List all shows that don't have any genre linked: <code>title</code> and <code>genre_id</code>, sorted by title.</p>", "SELECT tv_shows.title, tv_show_genres.genre_id FROM tv_shows LEFT JOIN tv_show_genres ON tv_shows.id = tv_show_genres.show_id WHERE tv_show_genres.genre_id IS NULL ORDER BY tv_shows.title;", { setup: TV, ordered: true }),
      sql("Number of shows by genre", "13-count_shows_by_genre.sql", "<p>List all genres and the number of shows linked to each: columns <code>genre</code> and <code>number_of_shows</code>. Don't display genres without shows. Sort by number of shows (descending), then genre.</p>", "SELECT tv_genres.name AS genre, COUNT(*) AS number_of_shows FROM tv_genres JOIN tv_show_genres ON tv_genres.id = tv_show_genres.genre_id GROUP BY tv_genres.name ORDER BY number_of_shows DESC, genre;", { setup: TV, ordered: true }),
      sql("My genres", "14-my_genres.sql", "<p>List all genres of the show <code>Dexter</code>: column <code>name</code>, sorted by genre name. You can use a maximum of two SELECT statements.</p>", "SELECT tv_genres.name FROM tv_genres JOIN tv_show_genres ON tv_genres.id = tv_show_genres.genre_id JOIN tv_shows ON tv_shows.id = tv_show_genres.show_id WHERE tv_shows.title = 'Dexter' ORDER BY tv_genres.name;", { setup: TV, ordered: true }),
    ],
    manual: ["Create a MySQL user <code>user_0d_1</code> with all privileges and check with <code>SHOW GRANTS</code>"],
  };

  /* ---------------- ORM ---------------- */
  EX["hl-0F"] = {
    quiz: [
      ["What's an ORM?", ["A database engine", "A layer that maps classes/objects to database tables/rows", "A SQL dialect", "A web framework"], 1],
      ["Why is <code>\"SELECT * FROM states WHERE name = '{}'\".format(user_input)</code> dangerous?", ["It's slow", "SQL injection: input can change the query", "It doesn't work in MySQL", "format() is deprecated"], 1],
      ["How should you pass user values with MySQLdb?", ["String formatting", "As parameters: cursor.execute(\"… WHERE name = %s\", (name,))", "With eval()", "With f-strings"], 1],
      ["In SQLAlchemy, what creates the tables from your models?", ["Base.metadata.create_all(engine)", "session.commit()", "engine.connect()", "Base.create()"], 0],
      ["What does <code>session.commit()</code> do?", ["Discards changes", "Writes pending changes to the database", "Closes the connection", "Creates a table"], 1],
    ],
    tasks: [
      py("Safe query (parameters instead of format)", "safe_filter.py", "<p>Using Python's built-in <code>sqlite3</code> (same idea as MySQLdb), write <code>def states_named(cursor, name):</code> that returns all rows <code>(id, name)</code> of the table <code>states</code> whose name equals <code>name</code>, sorted by id. You <strong>must</strong> pass <code>name</code> as a query parameter (<code>?</code>) — the checker tries an SQL injection.</p>",
        head + 'def states_named(cursor, name):\n    """Returns states with this exact name"""\n    pass\n',
        head + 'def states_named(cursor, name):\n    """Returns states with this exact name"""\n    cursor.execute("SELECT id, name FROM states WHERE name = ? ORDER BY id", (name,))\n    return cursor.fetchall()\n',
        [{ main: 'import sqlite3\nf = __import__("safe_filter").states_named\nc = sqlite3.connect(":memory:").cursor()\nc.execute("CREATE TABLE states (id INTEGER PRIMARY KEY, name TEXT)")\nc.executemany("INSERT INTO states (name) VALUES (?)", [("California",), ("Arizona",), ("Texas",), ("Nevada",)])\nprint(f(c, "Arizona"))\nprint(f(c, "Arizona\' OR \'1\'=\'1"))\nprint(f(c, "Nope"))\n', out: "[(2, 'Arizona')]\n[]\n[]\n" }], { packages: ["sqlite3"] }),
    ],
    manual: ["Install MySQLdb (mysqlclient) and SQLAlchemy, and write <code>model_state.py</code> with a <code>State</code> class mapped to the <code>states</code> table", "Write scripts that list, filter, add, update and delete states with SQLAlchemy"],
  };

  /* ---------------- AirBnB v2 ---------------- */
  EX["airbnb-2"] = {
    quiz: [
      ["Why use environment variables for DB credentials?", ["They're faster", "So secrets aren't hard-coded and each environment can differ", "MySQL requires them", "To make them public"], 1],
      ["In SQLAlchemy, how do you declare a many-to-many relationship?", ["Two foreign keys in one table + a secondary association table", "With a list column", "With JSON", "It's impossible"], 0],
      ["What's the benefit of a storage abstraction (FileStorage vs DBStorage)?", ["None", "The rest of the code doesn't care where data is stored", "It's required by Python", "It makes JSON faster"], 1],
    ],
    tasks: [],
    manual: ["Add <code>DBStorage</code> (SQLAlchemy + MySQL) and switch with the <code>HBNB_TYPE_STORAGE</code> env variable", "Map State, City, User, Place, Review and Amenity to tables (with relationships)", "Make the console's <code>create</code> accept parameters like <code>name=\"California\"</code>"],
  };
  EX["airbnb-2b"] = {
    quiz: [
      ["What is Fabric used for?", ["Styling web pages", "Running shell commands locally and on remote servers from Python (deployment)", "Load balancing", "Databases"], 1],
      ["Why deploy by switching a symlink (<code>/data/web_static/current</code>)?", ["It's prettier", "Atomic switch between releases and easy rollback", "Nginx requires symlinks", "To save disk"], 1],
      ["Which command creates a .tgz archive of a folder?", ["tar -cvzf archive.tgz folder", "zip folder", "gzip folder", "tar -x folder"], 0],
    ],
    tasks: [
      py("Archive name", "archive_name.py", "<p>Fabric scripts name archives <code>web_static_&lt;year&gt;&lt;month&gt;&lt;day&gt;&lt;hour&gt;&lt;minute&gt;&lt;second&gt;.tgz</code>. Write <code>def archive_name(dt):</code> that returns the path <code>versions/web_static_YYYYMMDDHHMMSS.tgz</code> for a datetime <code>dt</code>.</p>",
        head + 'def archive_name(dt):\n    """Returns the archive path for a datetime"""\n    pass\n',
        head + 'def archive_name(dt):\n    """Returns the archive path for a datetime"""\n    return "versions/web_static_{}.tgz".format(dt.strftime("%Y%m%d%H%M%S"))\n',
        [{ main: 'from datetime import datetime\nf = __import__("archive_name").archive_name\nprint(f(datetime(2017, 3, 15, 13, 46, 59)))\nprint(f(datetime(2024, 1, 2, 3, 4, 5)))\n', out: "versions/web_static_20170315134659.tgz\nversions/web_static_20240102030405.tgz\n" }]),
    ],
    manual: ["Write <code>0-setup_web_static.sh</code> to prepare your servers (folders + Nginx alias <code>/hbnb_static</code>)", "Write <code>1-pack_web_static.py</code>, <code>2-do_deploy_web_static.py</code> and <code>3-deploy_web_static.py</code> with Fabric"],
  };
  EX["airbnb-2c"] = {
    quiz: [
      ["How do you declare a Flask route with a variable?", ["@app.route('/c/<text>')", "@app.route('/c/{text}')", "@app.get('/c/:text')", "route('/c', text)"], 0],
      ["What does <code>strict_slashes=False</code> do?", ["Allows /hbnb and /hbnb/ to both work", "Forbids slashes", "Escapes slashes", "Nothing"], 0],
      ["Which function renders a Jinja template?", ["render_template('file.html', **vars)", "jinja.render()", "flask.html()", "template()"], 0],
      ["Why close the SQLAlchemy session after each request (teardown_appcontext)?", ["To speed up Flask", "To release resources and get fresh data on the next request", "It's optional cosmetics", "To log users out"], 1],
    ],
    tasks: [
      py("Text routes (logic)", "routes_text.py", "<p>In the Flask project, <code>/c/&lt;text&gt;</code> displays <code>C </code> followed by the text, with underscores replaced by spaces, and <code>/python/(&lt;text&gt;)</code> does the same with <code>Python </code> (default text: <code>is cool</code>). Write the two view functions <code>c_text(text)</code> and <code>python_text(text=\"is cool\")</code> returning those strings (Flask itself isn't available here, so just the logic).</p>",
        head + 'def c_text(text):\n    pass\n\n\ndef python_text(text="is cool"):\n    pass\n',
        head + 'def c_text(text):\n    """Displays C followed by text"""\n    return "C {}".format(text.replace("_", " "))\n\n\ndef python_text(text="is cool"):\n    """Displays Python followed by text"""\n    return "Python {}".format(text.replace("_", " "))\n',
        [{ main: 'm = __import__("routes_text")\nprint(m.c_text("is_fun"))\nprint(m.python_text())\nprint(m.python_text("is_magic"))\n', out: "C is fun\nPython is cool\nPython is magic\n" }]),
    ],
    manual: ["Write <code>web_flask/0-hello_route.py</code> … <code>6-number_odd_or_even.py</code> (routes, variables, templates)", "Display states and cities from storage in HTML (<code>7-states_list.py</code> … <code>10-hbnb_filters.py</code>)"],
  };
  EX["airbnb-3"] = {
    quiz: [
      ["Which HTTP method creates a resource in a REST API?", ["GET", "POST", "PUT", "DELETE"], 1],
      ["Which status code should a successful creation return?", ["200", "201", "204", "404"], 1],
      ["What does a Flask Blueprint help with?", ["Database migrations", "Organising routes into modules", "CSS", "Authentication only"], 1],
      ["What is CORS?", ["A database", "A browser rule controlling which origins may call your API", "A Python library for JSON", "A caching layer"], 1],
      ["Which status code for \"not found\"?", ["400", "401", "404", "500"], 2],
    ],
    tasks: [],
    manual: ["Create <code>api/v1/app.py</code> with <code>/status</code> and <code>/stats</code> and a JSON 404 handler", "Add CRUD endpoints for State, City, Amenity, User, Place, Review (with correct status codes)", "Add <code>count()</code> and <code>get()</code> to both storage engines, with unittests"],
  };
  EX["airbnb-4"] = {
    quiz: [
      ["What does AJAX let a page do?", ["Reload faster", "Request data from a server in the background and update part of the page", "Use Python in the browser", "Style elements"], 1],
      ["Which jQuery call sends a POST with JSON?", ["$.ajax({ type: 'POST', contentType: 'application/json', data: JSON.stringify(body) })", "$.post(body)", "$.get(url, 'POST')", "$.json(url)"], 0],
      ["Why add a cache_id query string to CSS/JS links?", ["Security", "To force the browser to fetch the new version (cache busting)", "SEO", "It's required by Flask"], 1],
    ],
    tasks: [],
    manual: ["Make the amenities checkboxes update an <code>h4</code> with the selected names (jQuery)", "Check the API status and colour the circle red when it's OK", "Load places dynamically from <code>POST /api/v1/places_search</code> and filter by amenities"],
  };

  /* ---------------- HTTP & APIs ---------------- */
  EX["hl-10"] = {
    quiz: [
      ["Which part of an HTTP request says what action to take?", ["The header Host", "The method (GET, POST…)", "The body", "The status code"], 1],
      ["Which curl option shows only the response headers?", ["-s", "-I", "-X", "-d"], 1],
      ["Which curl option sends a POST body?", ["-d", "-H", "-L", "-o"], 0],
      ["What does status 301 mean?", ["OK", "Moved permanently (redirect)", "Not found", "Server error"], 1],
      ["Which curl option follows redirects?", ["-L", "-R", "-F", "-v"], 0],
    ],
    tasks: [
      { t: "Cat a URL… body size", lang: "shell", file: "0-body_size.sh", p: "<p>Write a Bash script that takes a URL, sends a request to it, and displays the size of the body of the response (use the <code>content-length</code> header, or the body bytes).</p>", start: "#!/bin/bash\n", sol: "#!/bin/bash\ncurl -sI \"$1\" | grep -i Content-Length | cut -d ' ' -f 2", answers: [String.raw`curl -sI "?\$1"? \| grep -i ["']?Content-Length["']? \| cut -d ["']? ["']? -f ?2`, String.raw`curl -s "?\$1"? \| wc -c`, String.raw`curl -s(?:o /dev/null)? -w ["']?%\{size_download\}["']? "?\$1"?(?: -o /dev/null)?`] },
      { t: "Only GET", lang: "shell", file: "1-body.sh", p: "<p>Take a URL, send a GET request, and display the body of the response — only for 200 status code responses.</p>", start: "#!/bin/bash\n", sol: "#!/bin/bash\ncurl -sfL \"$1\"", answers: [String.raw`curl -s(?:f|L|fL|Lf) "?\$1"?`, String.raw`curl -sL? "?\$1"?`] },
      { t: "DELETE request", lang: "shell", file: "2-delete.sh", p: "<p>Send a DELETE request to the URL passed as the first argument and display the body of the response.</p>", start: "#!/bin/bash\n", sol: "#!/bin/bash\ncurl -sX DELETE \"$1\"", answers: [String.raw`curl -s ?-X ?DELETE "?\$1"?`, String.raw`curl -sX ?DELETE "?\$1"?`, String.raw`curl -X ?DELETE -s "?\$1"?`] },
      { t: "Custom header", lang: "shell", file: "4-header.sh", p: "<p>Send a GET request to the URL, with a header variable <code>X-School-User-Id</code> set to <code>98</code>, and display the body.</p>", start: "#!/bin/bash\n", sol: "#!/bin/bash\ncurl -sH \"X-School-User-Id: 98\" \"$1\"", answers: [String.raw`curl -s ?-?H ?["']X-School-User-Id: ?98["'] "?\$1"?`, String.raw`curl -s "?\$1"? -H ["']X-School-User-Id: ?98["']`] },
      { t: "POST params", lang: "shell", file: "5-post_params.sh", p: "<p>Send a POST request to the URL, with the variables <code>email</code> = <code>test@gmail.com</code> and <code>subject</code> = <code>I will always be here for PLD</code>, and display the body.</p>", start: "#!/bin/bash\n", sol: "#!/bin/bash\ncurl -s -X POST -d \"email=test@gmail.com&subject=I will always be here for PLD\" \"$1\"", answers: [String.raw`curl -s(?: -X ?POST)? -d ["']email=test@gmail\.com&subject=I will always be here for PLD["'] "?\$1"?`, String.raw`curl -s(?: -X ?POST)? -d ["']?email=test@gmail\.com["']? -d ["']subject=I will always be here for PLD["'] "?\$1"?`] },
    ],
  };
  const TODOS = JSON.stringify([
    { userId: 1, id: 1, title: "delectus aut autem", completed: false }, { userId: 1, id: 2, title: "quis ut nam facilis", completed: true },
    { userId: 1, id: 3, title: "fugiat veniam minus", completed: true }, { userId: 2, id: 4, title: "et porro tempora", completed: true },
    { userId: 1, id: 5, title: "laboriosam mollitia", completed: false },
  ]);
  const USERS = JSON.stringify([{ id: 1, name: "Leanne Graham", username: "Bret" }, { id: 2, name: "Ervin Howell", username: "Antonette" }]);
  EX["hl-11"] = {
    quiz: [
      ["Which Python package is the usual way to make HTTP requests?", ["urllib only", "requests", "http.server", "socket"], 1],
      ["How do you read JSON from a requests response?", ["r.text()", "r.json()", "json(r)", "r.body"], 1],
      ["What does <code>r.status_code &gt;= 400</code> mean?", ["Success", "Client or server error", "Redirect", "Informational"], 1],
      ["Which header tells the server the body is JSON?", ["Accept: text/html", "Content-Type: application/json", "Host: json", "User-Agent: json"], 1],
    ],
    tasks: [
      py("Employee TODO progress (offline data)", "0-gather_data_from_an_API.py", "<p>Real ALX version: call <code>https://jsonplaceholder.typicode.com</code>. Here the data is in local files <code>todos.json</code> and <code>users.json</code> (same format). For the employee ID given as argument, print:</p><pre class=\"code\">Employee EMPLOYEE_NAME is done with tasks(NUMBER_OF_DONE_TASKS/TOTAL_NUMBER_OF_TASKS):\n\t TASK_TITLE</pre><p>(one line per completed task, each starting with a tab and a space).</p>",
        head + '"""Gathers TODO progress for an employee"""\nimport json\nimport sys\n\nif __name__ == "__main__":\n    pass\n',
        head + '"""Gathers TODO progress for an employee"""\nimport json\nimport sys\n\nif __name__ == "__main__":\n    uid = int(sys.argv[1])\n    with open("users.json") as f:\n        user = [u for u in json.load(f) if u["id"] == uid][0]\n    with open("todos.json") as f:\n        todos = [t for t in json.load(f) if t["userId"] == uid]\n    done = [t for t in todos if t["completed"]]\n    print("Employee {} is done with tasks({}/{}):".format(user["name"], len(done), len(todos)))\n    for t in done:\n        print("\\t {}".format(t["title"]))\n',
        [{ args: ["1"], out: "Employee Leanne Graham is done with tasks(2/4):\n\t quis ut nam facilis\n\t fugiat veniam minus\n" }, { args: ["2"], out: "Employee Ervin Howell is done with tasks(1/1):\n\t et porro tempora\n" }],
        { extraFiles: { "todos.json": TODOS, "users.json": USERS } }),
    ],
    manual: ["Write the real scripts with <code>urllib</code> and <code>requests</code> (fetch status, headers, POST email, error codes, GitHub API)"],
  };
  EX["se-15"] = {
    quiz: [["What's a REST API?", ["A database", "An HTTP interface where URLs are resources and methods are actions", "A Python library", "A file format"], 1], ["What's CSV?", ["A compressed format", "Comma-separated values: a plain-text table", "A JSON variant", "A database"], 1], ["What does <code>json.dump(obj, f)</code> do?", ["Reads JSON from f", "Writes obj as JSON into the file f", "Prints JSON", "Validates JSON"], 1]],
    tasks: [
      py("Export to CSV (offline data)", "1-export_to_CSV.py", "<p>Using the local <code>todos.json</code> / <code>users.json</code> (same data as the API), write all tasks of the employee (ID as argument) to <code>USER_ID.csv</code>, format <code>\"USER_ID\",\"USERNAME\",\"TASK_COMPLETED_STATUS\",\"TASK_TITLE\"</code> (all fields quoted). The checker prints the file.</p>",
        head + '"""Exports an employee\'s tasks to CSV"""\nimport csv\nimport json\nimport sys\n\nif __name__ == "__main__":\n    pass\n',
        head + '"""Exports an employee\'s tasks to CSV"""\nimport csv\nimport json\nimport sys\n\nif __name__ == "__main__":\n    uid = int(sys.argv[1])\n    with open("users.json") as f:\n        user = [u for u in json.load(f) if u["id"] == uid][0]\n    with open("todos.json") as f:\n        todos = [t for t in json.load(f) if t["userId"] == uid]\n    with open("{}.csv".format(uid), "w", newline="") as f:\n        w = csv.writer(f, quoting=csv.QUOTE_ALL)\n        for t in todos:\n            w.writerow([uid, user["username"], t["completed"], t["title"]])\n',
        [{ main: 'import sys, runpy\nsys.argv = ["1-export_to_CSV.py", "2"]\nrunpy.run_path("1-export_to_CSV.py", run_name="__main__")\nprint(open("2.csv").read(), end="")\n', out: '"2","Antonette","True","et porro tempora"\n' }],
        { extraFiles: { "todos.json": TODOS, "users.json": USERS } }),
    ],
    manual: ["Do the real version against <code>jsonplaceholder.typicode.com</code> with <code>requests</code> (also export to JSON)"],
  };
  EX["se-16"] = { quiz: [["Why set a custom User-Agent when calling the Reddit API?", ["For speed", "Reddit blocks/limits generic clients; it's required by their rules", "To log in", "It's optional"], 1], ["How does Reddit paginate listings?", ["page=2", "With an <code>after</code> token", "With offsets only", "It doesn't"], 1], ["What should <code>allow_redirects=False</code> help you detect?", ["Timeouts", "An invalid subreddit (Reddit redirects to search)", "JSON errors", "Rate limits"], 1]], tasks: [], manual: ["Write <code>number_of_subscribers(subreddit)</code>, <code>top_ten(subreddit)</code>, a recursive <code>recurse(subreddit, hot_list=[])</code> and <code>count_words</code> using the Reddit API"] };

  /* ---------------- JavaScript warm up ---------------- */
  EX["hl-12"] = {
    quiz: [
      ["What's the difference between <code>let</code> and <code>const</code>?", ["None", "const can't be reassigned", "let is global", "const is faster"], 1],
      ["What does <code>process.argv[2]</code> contain when you run <code>./script.js hello</code>?", ["\"./script.js\"", "\"hello\"", "undefined", "\"node\""], 1],
      ["What is <code>typeof null</code>?", ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], 1],
      ["What does <code>'5' + 3</code> give in JavaScript?", ["8", "\"53\"", "NaN", "Error"], 1],
      ["Which style tool does ALX use for JavaScript?", ["pycodestyle", "semistandard", "betty", "prettier only"], 1],
    ],
    tasks: [
      js("First constant, first print", "0-javascript_is_amazing.js", "<p>Create a constant <code>myVar</code> with the value <code>JavaScript is amazing</code> and print it with <code>console.log</code>.</p>", node, node + "const myVar = 'JavaScript is amazing';\nconsole.log(myVar);\n",
        [{ out: "JavaScript is amazing\n" }]),
      js("Arguments?", "2-arguments.js", "<p>Print a message depending on the number of arguments passed: no argument → <code>No argument</code>; 1 → <code>Argument found</code>; otherwise → <code>Arguments found</code>. Use <code>process.argv</code>.</p>", node,
        node + "const n = process.argv.length - 2;\nif (n === 0) {\n  console.log('No argument');\n} else if (n === 1) {\n  console.log('Argument found');\n} else {\n  console.log('Arguments found');\n}\n",
        [{ args: [], out: "No argument\n" }, { args: ["Best"], out: "Argument found\n" }, { args: ["Best", "School"], out: "Arguments found\n" }]),
      js("Concat arguments", "4-concat.js", "<p>Print two arguments passed to it, in the following format: <code>&lt;first&gt; is &lt;second&gt;</code>.</p>", node, node + "console.log(`${process.argv[2]} is ${process.argv[3]}`);\n",
        [{ args: ["c", "cool"], out: "c is cool\n" }, { args: ["c"], out: "c is undefined\n" }]),
      js("Convert to integer", "5-to_integer.js", "<p>Print <code>My number: &lt;first argument converted in integer&gt;</code> if the first argument can be converted to an integer, otherwise <code>Not a number</code>.</p>", node,
        node + "const n = parseInt(process.argv[2]);\nconsole.log(isNaN(n) ? 'Not a number' : `My number: ${n}`);\n",
        [{ args: ["89"], out: "My number: 89\n" }, { args: ["-98"], out: "My number: -98\n" }, { args: ["12.3"], out: "My number: 12\n" }, { args: ["School"], out: "Not a number\n" }, { args: [], out: "Not a number\n" }]),
      js("Factorial", "10-factorial.js", "<p>Compute and print a factorial, recursively. The first argument is an integer; factorial of NaN is 1.</p>", node,
        node + "function factorial (n) {\n  if (isNaN(n) || n <= 1) return 1;\n  return n * factorial(n - 1);\n}\nconsole.log(factorial(parseInt(process.argv[2])));\n",
        [{ args: ["3"], out: "6\n" }, { args: ["5"], out: "120\n" }, { args: [], out: "1\n" }]),
      js("Second biggest!", "11-second_biggest.js", "<p>Find the second biggest integer in the list of arguments. If no argument or only one, print <code>0</code>.</p>", node,
        node + "const nums = process.argv.slice(2).map(Number).sort((a, b) => b - a);\nconsole.log(nums.length < 2 ? 0 : nums[1]);\n",
        [{ args: [], out: "0\n" }, { args: ["4"], out: "0\n" }, { args: ["4", "2", "5", "3", "0", "-3"], out: "4\n" }]),
    ],
  };

  /* ---------------- JS objects, scopes, closures ---------------- */
  const RJS = "#!/usr/bin/node\nmodule.exports = class Rectangle {\n  constructor (w, h) {\n    if (w > 0 && h > 0) {\n      this.width = w;\n      this.height = h;\n    }\n  }\n\n  print () {\n    for (let i = 0; i < this.height; i++) console.log('X'.repeat(this.width));\n  }\n\n  rotate () {\n    [this.width, this.height] = [this.height, this.width];\n  }\n\n  double () {\n    this.width *= 2;\n    this.height *= 2;\n  }\n};\n";
  EX["hl-13"] = {
    quiz: [
      ["What does <code>this</code> refer to inside a class method called as <code>obj.method()</code>?", ["The class", "obj", "The global object", "undefined"], 1],
      ["What's a closure?", ["A closed file", "A function that remembers variables from the scope where it was created", "A finished promise", "A class"], 1],
      ["How do you export a class from a file in Node (CommonJS)?", ["export class X", "module.exports = class X {…}", "exports(X)", "require(X)"], 1],
      ["What does <code>class Square extends Rectangle</code> do?", ["Copies Rectangle", "Makes Square inherit from Rectangle", "Merges them", "Nothing"], 1],
    ],
    tasks: [
      js("Rectangle #2 (validated)", "2-rectangle.js", "<p>Write a class <code>Rectangle</code> that defines a rectangle: constructor takes <code>w</code> and <code>h</code>; initialise <code>width</code> and <code>height</code> only if both are positive integers, otherwise create an empty object. Export it with <code>module.exports</code>.</p>", node + "module.exports = class Rectangle {\n};\n",
        node + "module.exports = class Rectangle {\n  constructor (w, h) {\n    if (w > 0 && h > 0) {\n      this.width = w;\n      this.height = h;\n    }\n  }\n};\n",
        [{ main: "const Rectangle = require('./2-rectangle');\nconsole.log(new Rectangle(2, 3));\nconsole.log(new Rectangle(2, -3));\nconsole.log(new Rectangle(2));\nconsole.log(new Rectangle(0, 3));\n", out: "Rectangle { width: 2, height: 3 }\nRectangle {}\nRectangle {}\nRectangle {}\n" }]),
      js("Rectangle #3–4 (print, rotate, double)", "4-rectangle.js", "<p>Same class, plus: <code>print()</code> prints the rectangle using the character <code>X</code>; <code>rotate()</code> swaps width and height; <code>double()</code> multiplies width and height by 2.</p>", node + "module.exports = class Rectangle {\n};\n", RJS,
        [{ main: "const Rectangle = require('./4-rectangle');\nconst r = new Rectangle(2, 3);\nr.print();\nr.rotate();\nr.print();\nr.double();\nr.print();\n", out: "XX\nXX\nXX\nXXX\nXXX\nXXXXXX\nXXXXXX\nXXXXXX\nXXXXXX\n" }]),
      js("Square (inheritance)", "6-square.js", "<p>Write a class <code>Square</code> that extends <code>Rectangle</code> (imported from <code>./4-rectangle</code>). Constructor takes <code>size</code> and calls the parent constructor with <code>super()</code>. Add <code>charPrint(c)</code> that prints the square using <code>c</code>, or <code>X</code> if c is undefined.</p>",
        node + "const Rectangle = require('./4-rectangle');\n",
        node + "const Rectangle = require('./4-rectangle');\n\nmodule.exports = class Square extends Rectangle {\n  constructor (size) {\n    super(size, size);\n  }\n\n  charPrint (c) {\n    if (c === undefined) c = 'X';\n    for (let i = 0; i < this.height; i++) console.log(c.repeat(this.width));\n  }\n};\n",
        [{ main: "const Square = require('./6-square');\nconst s = new Square(3);\ns.charPrint();\ns.charPrint('C');\ns.double();\nconsole.log(s.width, s.height);\n", out: "XXX\nXXX\nXXX\nCCC\nCCC\nCCC\n6 6\n" }],
        { extraFiles: { "4-rectangle.js": RJS } }),
      js("Number of arguments (closure)", "9-logme.js", "<p>Write a function that prints the number of arguments already printed and the new argument value: <code>&lt;number arguments already printed&gt;: &lt;current argument value&gt;</code>. Prototype: <code>exports.logMe = function (item)</code>. Use a closure or a module-level counter.</p>", node + "exports.logMe = function (item) {\n};\n",
        node + "let count = 0;\nexports.logMe = function (item) {\n  console.log(`${count}: ${item}`);\n  count++;\n};\n",
        [{ main: "const logMe = require('./9-logme').logMe;\nlogMe('Hello');\nlogMe('Best');\nlogMe('School');\n", out: "0: Hello\n1: Best\n2: School\n" }]),
      js("Converter (closure)", "10-converter.js", "<p>Write <code>exports.converter = function (base)</code> that returns a function converting a number from base 10 to <code>base</code>. Don't import anything.</p>", node + "exports.converter = function (base) {\n};\n",
        node + "exports.converter = function (base) {\n  return function (n) {\n    return n.toString(base);\n  };\n};\n",
        [{ main: "const converter = require('./10-converter').converter;\nlet my = converter(10);\nconsole.log(my(12));\nconsole.log(my(89));\nmy = converter(16);\nconsole.log(my(12));\nconsole.log(my(89));\n", out: "12\n89\nc\n59\n" }]),
    ],
  };

  /* ---------------- JS web scraping ---------------- */
  EX["hl-14"] = {
    quiz: [
      ["Which Node module reads files?", ["http", "fs", "path", "os"], 1],
      ["What's the error-first callback convention?", ["callback(result, err)", "callback(err, result)", "callback() only", "throw on error"], 1],
      ["What does <code>JSON.parse('{\"a\": 1}').a</code> return?", ["\"1\"", "1", "undefined", "Error"], 1],
      ["Why are file reads in Node usually asynchronous?", ["They're forbidden otherwise", "So the program isn't blocked while waiting for I/O", "To use less memory", "Because JSON requires it"], 1],
    ],
    tasks: [
      js("Readme", "0-readme.js", "<p>Read and print the content of a file (UTF-8). The first argument is the file path. If an error occurs, print the error object.</p>", node + "const fs = require('fs');\n",
        node + "const fs = require('fs');\n\nfs.readFile(process.argv[2], 'utf-8', (err, data) => {\n  if (err) {\n    console.log(err);\n  } else {\n    process.stdout.write(data);\n  }\n});\n",
        [{ args: ["cisfun"], out: "C is super fun!\n" }],
        { extraFiles: { cisfun: "C is super fun!\n" } }),
      js("Write me", "1-writeme.js", "<p>Write a string to a file. Argument 1: file path; argument 2: the string to write. Content in UTF-8. If an error occurs, print the error object. (The checker reads the file back.)</p>", node + "const fs = require('fs');\n",
        node + "const fs = require('fs');\n\nfs.writeFile(process.argv[2], process.argv[3], 'utf-8', (err) => {\n  if (err) console.log(err);\n});\n",
        [{ main: "const fs = require('fs');\nprocess.argv[2] = 'my_file.txt';\nprocess.argv[3] = 'Python is cool';\nrequire('./1-writeme.js');\nsetTimeout(() => console.log(fs.readFileSync('my_file.txt', 'utf-8')), 50);\n", out: "Python is cool\n" }]),
      js("Count films with Wedge Antilles (offline data)", "4-starwars_count.js", "<p>Real ALX version: call the Star Wars API. Here the API response is in the local file <code>films.json</code> (same format: <code>{ results: [ { characters: [url, …] }, … ] }</code>). Print the number of films where the character with id 18 (Wedge Antilles) is present. A character URL looks like <code>https://swapi-api.alx-tools.com/api/people/18/</code>.</p>", node + "const fs = require('fs');\n",
        node + "const fs = require('fs');\n\nconst data = JSON.parse(fs.readFileSync('films.json', 'utf-8'));\nconst count = data.results.filter((f) => f.characters.some((c) => /\\/people\\/18\\/?$/.test(c))).length;\nconsole.log(count);\n",
        [{ out: "3\n" }],
        { extraFiles: { "films.json": JSON.stringify({ results: [1, 2, 3, 4, 5, 6, 7].map((i) => ({ title: "Film " + i, characters: ["https://swapi-api.alx-tools.com/api/people/1/", ...(i === 2 || i === 3 || i === 5 ? ["https://swapi-api.alx-tools.com/api/people/18/"] : []), "https://swapi-api.alx-tools.com/api/people/181/"] })) }) } }),
    ],
    manual: ["Write the real versions with the <code>request</code> module: status code, film title by id, Star Wars characters in order, TODO completion by user"],
  };

  /* ---------------- jQuery ---------------- */
  const page = (body) => `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Holberton School</title>\n    ${JQ}\n  </head>\n  <body>\n${body}\n  </body>\n</html>\n`;
  EX["hl-15"] = {
    quiz: [
      ["What does <code>$('#red_header')</code> select?", ["All elements with class red_header", "The element with id red_header", "All header tags", "Nothing"], 1],
      ["Why put scripts at the end of body or wait for <code>$(document).ready</code>?", ["Speed only", "So the elements exist before your code queries them", "jQuery requires it", "For styling"], 1],
      ["Which jQuery method makes a GET request and parses JSON?", ["$.getJSON / $.get", "$.fetch", "$.json", "$.load"], 0],
      ["How do you add a class with jQuery?", [".addClass('red')", ".class('red')", ".css('red')", ".setClass('red')"], 0],
    ],
    tasks: [
      { t: "Colorize me", lang: "html", file: "0-script.html", p: "<p>Update the text color of the <code>&lt;header&gt;</code> element to red (<code>#FF0000</code>) using <code>document.querySelector</code> (no jQuery for this one). Put your script at the end of the body.</p>",
        start: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Holberton School</title>\n  </head>\n  <body>\n    <header>\n      First HTML page\n    </header>\n    <footer>\n      Holberton School - 2017\n    </footer>\n  </body>\n</html>\n`,
        sol: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>Holberton School</title>\n  </head>\n  <body>\n    <header>\n      First HTML page\n    </header>\n    <footer>\n      Holberton School - 2017\n    </footer>\n    <script>document.querySelector('header').style.color = '#FF0000';</script>\n  </body>\n</html>\n`,
        checks: [["The header text is red", "return w.getComputedStyle(d.querySelector('header')).color === 'rgb(255, 0, 0)';"], ["The footer is unchanged", "return w.getComputedStyle(d.querySelector('footer')).color !== 'rgb(255, 0, 0)';"]] },
      { t: "Click and turn red", lang: "html", file: "2-script.html", p: "<p>Using jQuery (already included), update the text color of the <code>&lt;header&gt;</code> to red when the user clicks on the tag <code>DIV#red_header</code>.</p>",
        start: page('    <header>\n      First HTML page\n    </header>\n    <div id="red_header">Red header</div>\n    <footer>\n      Holberton School - 2017\n    </footer>\n    <script>\n    </script>'),
        sol: page('    <header>\n      First HTML page\n    </header>\n    <div id="red_header">Red header</div>\n    <footer>\n      Holberton School - 2017\n    </footer>\n    <script>\n      $(\'DIV#red_header\').click(function () {\n        $(\'header\').css(\'color\', \'#FF0000\');\n      });\n    </script>'),
        checks: [["The header isn't red before the click", "return w.getComputedStyle(d.querySelector('header')).color !== 'rgb(255, 0, 0)';"], ["After clicking DIV#red_header, the header is red", "d.querySelector('#red_header').click(); await wait(50); return w.getComputedStyle(d.querySelector('header')).color === 'rgb(255, 0, 0)';"]] },
      { t: "List of elements", lang: "html", file: "6-script.html", p: "<p>Using jQuery, add a <code>&lt;li&gt;Item&lt;/li&gt;</code> to the list <code>UL.my_list</code> each time the user clicks on <code>DIV#add_item</code>.</p>",
        start: page('    <div id="add_item">Add item</div>\n    <ul class="my_list">\n      <li>Item</li>\n    </ul>\n    <script>\n    </script>'),
        sol: page('    <div id="add_item">Add item</div>\n    <ul class="my_list">\n      <li>Item</li>\n    </ul>\n    <script>\n      $(\'DIV#add_item\').click(function () {\n        $(\'UL.my_list\').append(\'<li>Item</li>\');\n      });\n    </script>'),
        checks: [["The list starts with 1 item", "return d.querySelectorAll('ul.my_list li').length === 1;"], ["Two clicks add two <li>Item</li>", "d.querySelector('#add_item').click(); d.querySelector('#add_item').click(); await wait(50); const li = d.querySelectorAll('ul.my_list li'); return li.length === 3 && li[2].textContent === 'Item';"]] },
      { t: "Toggle a class", lang: "html", file: "5-script.html", p: "<p>Using jQuery, toggle the class of <code>&lt;header&gt;</code> between <code>red</code> and <code>green</code> each time the user clicks on <code>DIV#toggle_header</code>. The header starts with the class <code>red</code>.</p>",
        start: page('    <style>\n      .red { color: #FF0000; }\n      .green { color: #00FF00; }\n    </style>\n    <header class="red">\n      First HTML page\n    </header>\n    <div id="toggle_header">Toggle header</div>\n    <script>\n    </script>'),
        sol: page('    <style>\n      .red { color: #FF0000; }\n      .green { color: #00FF00; }\n    </style>\n    <header class="red">\n      First HTML page\n    </header>\n    <div id="toggle_header">Toggle header</div>\n    <script>\n      $(\'DIV#toggle_header\').click(function () {\n        $(\'header\').toggleClass(\'red green\');\n      });\n    </script>'),
        checks: [["One click: header is green (and not red)", "d.querySelector('#toggle_header').click(); await wait(30); const h = d.querySelector('header'); return h.classList.contains('green') && !h.classList.contains('red');"], ["Second click: back to red", "d.querySelector('#toggle_header').click(); await wait(30); const h = d.querySelector('header'); return h.classList.contains('red') && !h.classList.contains('green');"]] },
    ],
    manual: ["Fetch the Star Wars API with <code>$.get</code> and display a character name and the list of movies", "Translate \"hello\" with the fourtonfish API based on a language code input"],
  };

  /* ---------------- Portfolio ---------------- */
  EX["portfolio"] = {
    quiz: [
      ["What is an MVP?", ["Most valuable player", "Minimum viable product: the smallest version that delivers real value", "A design pattern", "A database"], 1],
      ["What belongs in a good project README?", ["Only the license", "What it is, how to install/run it, how to use it, screenshots, authors", "Your passwords", "Nothing — code speaks for itself"], 1],
      ["Why write a landing page for your project?", ["It's mandatory for Git", "To explain and show it to people (recruiters!) in seconds", "For SEO only", "To host the code"], 1],
    ],
    tasks: [],
    manual: ["Write a 1-page proposal: problem, users, MVP features, architecture, risks", "Build the MVP and deploy it online", "Write a README and a landing page with screenshots or a GIF", "Record a short demo and write a blog post about what you learned"],
  };
})();
