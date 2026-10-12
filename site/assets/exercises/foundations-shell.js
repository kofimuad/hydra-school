/* Practice for Foundations – shell, Git, editors, regex, networking, sysadmin/DevOps. */
(function () {
  const EX = (window.EX = window.EX || {});
  const R = String.raw;
  // Shell task helper: answers are regexes matched against your script with comments/shebang removed and spaces collapsed.
  const sh = (t, file, p, sol, answers, extra) => Object.assign({ t, lang: "shell", file, p, start: "#!/bin/bash\n", sol: "#!/bin/bash\n" + sol, answers }, extra || {});
  const cmd = (t, file, p, sol, answers, extra) => Object.assign({ t, lang: "shell", file, p, start: "", sol, answers, shebang: false }, extra || {});

  /* ---------------- 0x00 shell basics ---------------- */
  EX["se-00"] = {
    quiz: [
      ["Which command prints the absolute path of the current working directory?", ["cd", "pwd", "ls", "whoami"], 1],
      ["Which command shows hidden files too?", ["ls -h", "ls -a", "ls -l", "ls -R"], 1],
      ["What does <code>cd -</code> do?", ["Goes to the root directory", "Goes to the previous working directory", "Goes up one level", "Goes home"], 1],
      ["What is the difference between <code>rm</code> and <code>rmdir</code>?", ["None", "rmdir only removes empty directories", "rm only removes directories", "rmdir removes files"], 1],
      ["Which path is absolute?", ["../school", "./school", "/tmp/school", "school/"], 2],
      ["What does the <code>file</code> command tell you?", ["The size of a file", "The type of a file", "The owner of a file", "Where a file is"], 1],
    ],
    tasks: [
      sh("Where am I?", "0-current_working_directory", "<p>Write a script that prints the absolute path name of the current working directory.</p>", "pwd", ["pwd"]),
      sh("What's in there?", "1-listit", "<p>Display the contents list of your current directory.</p>", "ls", ["ls"]),
      sh("There is no place like home", "2-bring_me_home", "<p>Write a script that changes the working directory to the user's home directory. You are not allowed to use any shell variables.</p>", "cd", ["cd(?: ~)?"], { bad: ["#!/bin/bash\ncd $HOME"] }),
      sh("The long format", "3-listfiles", "<p>Display current directory contents in a long format.</p>", "ls -l", ["ls -l"]),
      sh("Hidden files", "4-listmorefiles", "<p>Display current directory contents, including hidden files (starting with <code>.</code>). Use the long format.</p>", "ls -la", ["ls (?:-la|-al|-l -a|-a -l)"]),
      sh("I love numbers", "5-listfilesdigitonly", "<p>Display current directory contents: long format, with hidden files, and display user and group IDs <em>numerically</em>.</p>", "ls -lan", ["ls -(?:lan|lna|aln|anl|nla|nal)"], { bad: ["#!/bin/bash\nls -l"] }),
      sh("Welcome", "6-firstdirectory", "<p>Create a directory named <code>my_first_directory</code> in the <code>/tmp/</code> directory.</p>", "mkdir /tmp/my_first_directory", ["mkdir (?:-p )?/tmp/my_first_directory/?"]),
      sh("Betty in my first directory", "7-movethatfile", "<p>Move the file <code>betty</code> from <code>/tmp/</code> to <code>/tmp/my_first_directory</code>.</p>", "mv /tmp/betty /tmp/my_first_directory/", ["mv /tmp/betty /tmp/my_first_directory/?"]),
      sh("Bye bye Betty", "8-firstdelete", "<p>Delete the file <code>betty</code>, which is in <code>/tmp/my_first_directory</code>.</p>", "rm /tmp/my_first_directory/betty", ["rm (?:-f )?/tmp/my_first_directory/betty"]),
      sh("Bye bye My first directory", "9-firstdirdeletion", "<p>Delete the directory <code>my_first_directory</code> that is in <code>/tmp</code>.</p>", "rmdir /tmp/my_first_directory", ["rmdir /tmp/my_first_directory/?", "rm -r(?:f)? /tmp/my_first_directory/?"]),
      sh("Back to the future", "10-back", "<p>Change the working directory to the previous one.</p>", "cd -", ["cd -", "cd \"?\\$OLDPWD\"?"]),
      sh("Lots of lists", "11-lists", "<p>List all files (even hidden ones) in the current directory and the parent of the working directory and the <code>/boot</code> directory (in this order), in long format.</p>", "ls -la . .. /boot", ["ls (?:-la|-al) \\. \\.\\. /boot"]),
      sh("File type", "12-file_type", "<p>Print the type of the file named <code>iamafile</code>. The file is in the <code>/tmp</code> directory.</p>", "file /tmp/iamafile", ["file /tmp/iamafile"]),
      sh("We are going, Rhoooooooooo!", "13-symbolic_link", "<p>Create a symbolic link to <code>/bin/ls</code>, named <code>__ls__</code>, in the current working directory.</p>", "ln -s /bin/ls __ls__", ["ln -s(?:f)? /bin/ls (?:\\./)?__ls__"]),
      sh("Copy HTML files", "14-copy_html", "<p>Copy all the HTML files from the current directory to the parent of the working directory, but only those that don't exist in the parent or are newer than the versions in the parent.</p>", "cp -u *.html ..", ["cp -u \\*\\.html \\.\\./?", "cp --update \\*\\.html \\.\\./?"]),
    ],
  };

  /* ---------------- 0x01 shell permissions ---------------- */
  EX["se-01"] = {
    quiz: [
      ["In <code>-rwxr-x---</code>, what can members of the group do?", ["Read, write and execute", "Read and execute", "Nothing", "Only read"], 1],
      ["What is <code>chmod 754</code> in symbolic form?", ["rwxr-xr--", "rwxrw-r--", "rwxr--r-x", "rw-r-xr--"], 0],
      ["Which command changes the owner of a file?", ["chmod", "chgrp", "chown", "su"], 2],
      ["What does the <code>x</code> permission mean on a <em>directory</em>?", ["You can run it", "You can enter it (cd) and access files inside", "You can list it", "You can delete it"], 1],
      ["Which command runs a command as another user (default root)?", ["su", "sudo", "whoami", "chown"], 1],
    ],
    tasks: [
      sh("Who am I", "1-who_am_i", "<p>Print the effective username of the current user.</p>", "whoami", ["whoami", "id -un"]),
      sh("Groups", "2-groups", "<p>Print all the groups the current user is part of.</p>", "groups", ["groups", "id -Gn"]),
      sh("New owner", "3-new_owner", "<p>Change the owner of the file <code>hello</code> to the user <code>betty</code>.</p>", "chown betty hello", ["chown betty hello"]),
      sh("Empty!", "4-empty", "<p>Create an empty file called <code>hello</code>.</p>", "touch hello", ["touch hello"]),
      sh("Execute", "5-execute", "<p>Add execute permission to the owner of the file <code>hello</code>.</p>", "chmod u+x hello", ["chmod u\\+x hello"]),
      sh("Multiple permissions", "6-multiple_permissions", "<p>Add execute permission to the owner and the group owner, and read permission to other users, to the file <code>hello</code>.</p>", "chmod ug+x,o+r hello", ["chmod (?:ug\\+x,o\\+r|o\\+r,ug\\+x|gu\\+x,o\\+r|u\\+x,g\\+x,o\\+r) hello"]),
      sh("Everybody!", "7-everybody", "<p>Add execution permission to the owner, the group owner and the other users, to the file <code>hello</code>.</p>", "chmod ugo+x hello", ["chmod (?:ugo|a|)\\+x hello"]),
      sh("James Bond", "8-James_Bond", "<p>Set the permission to the file <code>hello</code>: owner and group have no permission at all, other users have all the permissions.</p>", "chmod 007 hello", ["chmod 0?007 hello", "chmod u=,g=,o=rwx hello"]),
      sh("John Doe", "9-John_Doe", "<p>Set the mode of the file <code>hello</code> to <code>-rwxr-x-wx</code>.</p>", "chmod 753 hello", ["chmod 0?753 hello", "chmod u=rwx,g=rx,o=wx hello"]),
      sh("Look in the mirror", "10-mirror_permissions", "<p>Set the mode of the file <code>hello</code> the same as <code>olleh</code>'s mode.</p>", "chmod --reference=olleh hello", ["chmod --reference=olleh hello"]),
      sh("Directories", "11-directories_permissions", "<p>Add execute permission to all subdirectories of the current directory for the owner, group owner and all other users. Regular files should not be changed.</p>", "chmod -R +X .", ["chmod -R (?:a|ugo)?\\+X \\.", "chmod (?:a|ugo)?\\+X \\*/?", "find \\. -mindepth 1 -type d -exec chmod (?:a|ugo)?\\+x \\{\\} \\\\?[;+]"]),
      sh("More directories", "12-directory_permissions", "<p>Create a directory called <code>my_dir</code> with permissions 751 in the working directory.</p>", "mkdir -m 751 my_dir", ["mkdir -m ?751 my_dir", "mkdir --mode=751 my_dir"]),
      sh("Change group", "13-change_group", "<p>Change the group owner to <code>school</code> for the file <code>hello</code>.</p>", "chgrp school hello", ["chgrp school hello", "chown :school hello"]),
    ],
  };

  /* ---------------- Git ---------------- */
  EX["zd-git"] = {
    quiz: [
      ["What does <code>git add file.c</code> do?", ["Commits the file", "Stages the file for the next commit", "Pushes the file", "Creates the file"], 1],
      ["Which command shows which files are modified, staged or untracked?", ["git log", "git status", "git diff --stat", "git show"], 1],
      ["What does <code>git pull</code> do?", ["Uploads your commits", "Fetches remote changes and merges them into your branch", "Deletes local changes", "Creates a branch"], 1],
      ["What's a merge conflict?", ["A bug in git", "Two branches changed the same lines differently, so git needs you to choose", "When you forget to commit", "A failed push because of the network"], 1],
      ["What is <code>.gitignore</code> for?", ["Listing files git should not track", "Hiding the repo", "Ignoring commits", "Ignoring branches"], 0],
    ],
    tasks: [
      cmd("Create and switch branch", "terminal", "<p>Type the single git command that creates a new branch named <code>update_script</code> and switches to it.</p>", "git checkout -b update_script", ["git (?:checkout -b|switch -c|switch --create) update_script"]),
      cmd("Stage and commit", "terminal", "<p>Type the two commands (one per line) to stage <em>all</em> changes in the current directory and commit them with the message <code>My first commit</code>.</p>", "git add .\ngit commit -m \"My first commit\"", ["git add (?:\\.|-A|--all)\\ngit commit -m [\"']My first commit[\"']"]),
      cmd("Push a new branch", "terminal", "<p>Push your local branch <code>update_script</code> to the remote <code>origin</code> and set it as upstream.</p>", "git push -u origin update_script", ["git push (?:-u|--set-upstream) origin update_script"]),
    ],
    manual: ["Create a GitHub account, an SSH key, and add it to GitHub", "Create a repo <code>alx-zero_day</code>, clone it, add a README.md, commit and push", "Make a merge conflict on purpose (two branches edit one line) and resolve it"],
  };

  /* ---------------- Emacs & Vi ---------------- */
  EX["zd-editors"] = {
    quiz: [
      ["In vi, how do you save and quit?", [":wq", ":q!", "Ctrl-x Ctrl-s", ":save"], 0],
      ["In vi, which key enters insert mode before the cursor?", ["a", "i", "o", "v"], 1],
      ["In vi, how do you quit without saving?", [":q!", ":wq", ":x", "ZZ"], 0],
      ["In emacs, which keys save the file?", ["C-x C-s", "C-x C-c", "C-s", "M-x save"], 0],
      ["In emacs, which keys exit?", ["C-x C-c", "C-c C-x", "C-q", "ESC :q"], 0],
      ["In vi, what does <code>dd</code> do?", ["Duplicates a line", "Deletes the current line", "Goes down two lines", "Undo"], 1],
    ],
    tasks: [],
    manual: ["Complete <code>vimtutor</code> (about 30 minutes)", "Open emacs and do the built-in tutorial (C-h t)", "Edit and save a file in your chosen editor without touching the mouse"],
  };

  /* ---------------- 0x02 redirections & filters ---------------- */
  EX["se-02"] = {
    quiz: [
      ["What's the difference between <code>&gt;</code> and <code>&gt;&gt;</code>?", ["None", "&gt; overwrites the file, &gt;&gt; appends", "&gt;&gt; overwrites, &gt; appends", "&gt;&gt; redirects stderr"], 1],
      ["What does <code>2&gt;&amp;1</code> do?", ["Redirects stdout to stderr", "Sends stderr to wherever stdout goes", "Runs two commands", "Nothing"], 1],
      ["What does <code>ls | wc -l</code> print?", ["The number of lines in ls's output (≈ number of entries)", "The size of the directory", "An error", "The word count of all files"], 0],
      ["Which command removes duplicate <em>adjacent</em> lines?", ["sort", "uniq", "tr", "cut"], 1],
      ["How many file descriptors are open by default, and what are they?", ["1: stdout", "3: stdin, stdout, stderr", "2: stdin, stdout", "0"], 1],
    ],
    tasks: [
      sh("Hello World", "0-hello_world", "<p>Print <code>Hello, World</code>, followed by a new line, to the standard output.</p>", "echo \"Hello, World\"", ["echo [\"']?Hello, World[\"']?", "printf [\"']Hello, World\\\\n[\"']"]),
      sh("Confused smiley", "1-confused_smiley", "<p>Display a confused smiley <code>\"(Ôo)'</code>.</p>", "echo \"\\\"(Ôo)'\"", ["echo \"\\\\\"\\(Ôo\\)'\"", "echo \\\\\"\\\\\\(Ôo\\\\\\)\\\\'", "echo '\"\\(Ôo\\)'\"'\"'"]),
      sh("Let's display a file", "2-hellofile", "<p>Display the content of the <code>/etc/passwd</code> file.</p>", "cat /etc/passwd", ["cat /etc/passwd"]),
      sh("What about 2?", "3-twofiles", "<p>Display the content of <code>/etc/passwd</code> and <code>/etc/hosts</code>.</p>", "cat /etc/passwd /etc/hosts", ["cat /etc/passwd /etc/hosts"]),
      sh("Last lines of a file", "4-lastlines", "<p>Display the last 10 lines of <code>/etc/passwd</code>.</p>", "tail /etc/passwd", ["tail(?: -n ?10| -10)? /etc/passwd"]),
      sh("I'd prefer the first ones actually", "5-firstlines", "<p>Display the first 10 lines of <code>/etc/passwd</code>.</p>", "head /etc/passwd", ["head(?: -n ?10| -10)? /etc/passwd"]),
      sh("Line #2", "6-third_line", "<p>Display the third line of the file <code>iacta</code>. The file is in the working directory.</p>", "head -n 3 iacta | tail -n 1", ["head -n ?3 iacta \\| tail -n ?1", "head -3 iacta \\| tail -1", "sed -n '?3p'? iacta", "tail -n \\+3 iacta \\| head -n ?1"]),
      sh("Save current state of directory", "8-cwd_state", "<p>Write into the file <code>ls_cwd_content</code> the result of the command <code>ls -la</code>. If the file exists it should be overwritten.</p>", "ls -la > ls_cwd_content", ["ls (?:-la|-al) ?> ?ls_cwd_content"]),
      sh("Duplicate last line", "9-duplicate_last_line", "<p>Duplicate the last line of the file <code>iacta</code>.</p>", "tail -n 1 iacta >> iacta", ["tail (?:-n ?1|-1) iacta ?>> ?iacta"]),
      sh("No more JavaScript", "10-no_more_js", "<p>Delete all the regular files (not the directories) with a <code>.js</code> extension in the current directory and all its subfolders.</p>", "find . -type f -name \"*.js\" -delete", ["find \\. (?:-type f -name [\"']?\\*\\.js[\"']?|-name [\"']?\\*\\.js[\"']? -type f) (?:-delete|-exec rm (?:-f )?\\{\\} \\\\?[;+])"]),
      sh("Don't just count your directories, make your directories count", "11-directories", "<p>Count the number of directories and sub-directories in the current directory. The current and parent directories should not be counted; hidden directories should be.</p>", "find . -mindepth 1 -type d | wc -l", ["find \\. -mindepth 1 -type d \\| wc -l", "find \\. -type d -mindepth 1 \\| wc -l", "find \\. -type d \\| tail -n \\+2 \\| wc -l"]),
      sh("What's new", "12-newest_files", "<p>Display the 10 newest files in the current directory, one per line, sorted from the newest to the oldest.</p>", "ls -t | head -n 10", ["ls -1?t1? \\| head(?: -n ?10| -10)?", "ls -t -1 \\| head(?: -n ?10| -10)?"]),
      sh("Being unique is better than being perfect", "13-unique", "<p>Take a list of words as input (stdin) and print only words that appear exactly once.</p>", "sort | uniq -u", ["sort \\| uniq -u"]),
      sh("It is a good file that cuts iron without making a noise", "14-findthatword", "<p>Display lines containing the pattern <code>root</code> from the file <code>/etc/passwd</code>.</p>", "grep root /etc/passwd", ["grep [\"']?root[\"']? /etc/passwd"]),
      sh("Count that word", "15-countthatword", "<p>Display the number of lines that contain the pattern <code>bin</code> in <code>/etc/passwd</code>.</p>", "grep -c bin /etc/passwd", ["grep -c [\"']?bin[\"']? /etc/passwd", "grep [\"']?bin[\"']? /etc/passwd \\| wc -l"]),
      sh("What's next?", "16-whatsnext", "<p>Display lines containing the pattern <code>root</code> and 3 lines after them in <code>/etc/passwd</code>.</p>", "grep -A 3 root /etc/passwd", ["grep -A ?3 [\"']?root[\"']? /etc/passwd", "grep [\"']?root[\"']? -A ?3 /etc/passwd"]),
      sh("I hate bins", "17-hidethisword", "<p>Display all the lines in <code>/etc/passwd</code> that do <strong>not</strong> contain the pattern <code>bin</code>.</p>", "grep -v bin /etc/passwd", ["grep -v [\"']?bin[\"']? /etc/passwd"]),
      sh("Letters only please", "18-letteronly", "<p>Display all lines of <code>/etc/ssh/sshd_config</code> starting with a letter (upper or lower case).</p>", "grep ^[[:alpha:]] /etc/ssh/sshd_config", ["grep [\"']?\\^\\[(?:\\[:alpha:\\]|A-Za-z|a-zA-Z)\\][\"']? /etc/ssh/sshd_config", "grep -i [\"']?\\^\\[a-z\\][\"']? /etc/ssh/sshd_config"]),
      sh("A to Z", "19-AZ", "<p>Replace all characters <code>A</code> and <code>c</code> from input to <code>Z</code> and <code>e</code> respectively.</p>", "tr \"Ac\" \"Ze\"", ["tr [\"']?Ac[\"']? [\"']?Ze[\"']?"]),
      sh("Without C, you would live in hiago", "20-hiago", "<p>Remove all letters <code>c</code> and <code>C</code> from input.</p>", "tr -d \"cC\"", ["tr -d [\"']?(?:cC|Cc)[\"']?"]),
      sh("esreveR", "21-reverse", "<p>Reverse its input.</p>", "rev", ["rev"]),
      sh("DJ Cut Killer", "22-users_and_homes", "<p>Display all users and their home directories, sorted by users. Based on <code>/etc/passwd</code>.</p>", "cut -d ':' -f 1,6 /etc/passwd | sort", ["cut -d ?[\"']?:[\"']? -f ?1,6 /etc/passwd \\| sort", "sort /etc/passwd \\| cut -d ?[\"']?:[\"']? -f ?1,6"]),
    ],
  };

  /* ---------------- 0x03 variables & expansions ---------------- */
  EX["se-03"] = {
    quiz: [
      ["What's the difference between <code>NAME=x</code> and <code>export NAME=x</code>?", ["None", "export makes it available to child processes (environment variable)", "export makes it read-only", "export deletes it"], 1],
      ["What does <code>$((5 * 3))</code> expand to?", ["5 * 3", "15", "$15", "An error"], 1],
      ["Which file is read by interactive non-login bash shells?", ["~/.bashrc", "/etc/hosts", "~/.ssh/config", "/etc/passwd"], 0],
      ["What does <code>echo '$HOME'</code> print?", ["Your home directory", "$HOME", "Nothing", "An error"], 1, "Single quotes prevent all expansion."],
      ["What does <code>$(pwd)</code> do?", ["Arithmetic", "Command substitution — runs pwd and inserts its output", "Defines a variable", "Prints $(pwd)"], 1],
    ],
    tasks: [
      sh("<3 UNIX", "0-alias", "<p>Create an alias. Name: <code>ls</code>. Value: <code>rm *</code>.</p>", "alias ls=\"rm *\"", ["alias ls=[\"']rm \\*[\"']"]),
      sh("Hello you", "1-hello_you", "<p>Print <code>hello user</code>, where <code>user</code> is the current Linux user.</p>", "echo \"hello $USER\"", ["echo [\"']?hello \\$(?:USER|\\{USER\\}|\\(whoami\\))[\"']?"]),
      sh("The path to success is to take massive, determined action", "2-path", "<p>Add <code>/action</code> to the <code>PATH</code>. <code>/action</code> should be the last directory the shell looks into.</p>", "export PATH=$PATH:/action", ["(?:export )?PATH=[\"']?\\$(?:PATH|\\{PATH\\}):/action[\"']?"]),
      sh("If the path be beautiful, let us not ask where it leads", "3-paths", "<p>Count the number of directories in the <code>PATH</code>.</p>", "echo \"$PATH\" | tr ':' '\\n' | wc -l", ["echo [\"']?\\$PATH[\"']? \\| tr [\"']?:[\"']? [\"']?\\\\n[\"']? \\| wc -l"]),
      sh("Global variables", "4-global_variables", "<p>List environment variables.</p>", "printenv", ["printenv", "env", "export -p"]),
      sh("Local variables", "5-local_variables", "<p>List all local variables and environment variables, and functions.</p>", "set", ["set"]),
      sh("Local variable", "6-create_local_variable", "<p>Create a new local variable. Name: <code>BEST</code>, value: <code>School</code>.</p>", "BEST=\"School\"", ["BEST=[\"']?School[\"']?"]),
      sh("Global variable", "7-create_global_variable", "<p>Create a new global variable. Name: <code>BEST</code>, value: <code>School</code>.</p>", "export BEST=\"School\"", ["export BEST=[\"']?School[\"']?"]),
      sh("Every addition to true knowledge is an addition to human power", "8-true_knowledge", "<p>Print the result of the addition of 128 with the value stored in the environment variable <code>TRUEKNOWLEDGE</code>, followed by a new line.</p>", "echo $((128 + TRUEKNOWLEDGE))", ["echo \"?\\$\\(\\( ?(?:128 ?\\+ ?\\$?TRUEKNOWLEDGE|\\$?TRUEKNOWLEDGE ?\\+ ?128) ?\\)\\)\"?"]),
      sh("Divide and rule", "9-divide_and_rule", "<p>Print the result of <code>POWER</code> divided by <code>DIVIDE</code>, followed by a new line.</p>", "echo $((POWER / DIVIDE))", ["echo \"?\\$\\(\\( ?\\$?POWER ?/ ?\\$?DIVIDE ?\\)\\)\"?"]),
      sh("Love is anterior to life, posterior to death…", "10-love_exponent_breath", "<p>Display the result of <code>BREATH</code> to the power <code>LOVE</code>.</p>", "echo $((BREATH ** LOVE))", ["echo \"?\\$\\(\\( ?\\$?BREATH ?\\*\\* ?\\$?LOVE ?\\)\\)\"?"]),
      sh("There are 10 types of people in the world…", "11-binary_to_decimal", "<p>Convert a number from base 2 to base 10. The number is in the environment variable <code>BINARY</code>.</p>", "echo $((2#$BINARY))", ["echo \"?\\$\\(\\( ?2#\\$BINARY ?\\)\\)\"?", "echo \"?\\$\\(\\( ?2#\\$\\{BINARY\\} ?\\)\\)\"?"]),
      sh("Floats", "13-print_float", "<p>Print a number with two decimal places, followed by a new line. The number is in the environment variable <code>NUM</code>.</p>", "printf \"%.2f\\n\" $NUM", ["printf [\"']%\\.2f\\\\n[\"'] \"?\\$(?:NUM|\\{NUM\\})\"?"]),
    ],
  };

  /* ---------------- 0x04 loops, conditions, parsing ---------------- */
  const FOR10 = R`for (\w+) in \{1\.\.10\}(?:; |\n)do\necho "?Best School"?\ndone|for \(\( ?(\w+) ?= ?[01] ?; ?\w+ ?<=? ?1?[01]0? ?; ?\w+\+\+ ?\)\)(?:; |\n)do\necho "?Best School"?\ndone`;
  EX["se-04"] = {
    quiz: [
      ["Which line must be the first line of every Bash script at ALX?", ["#!/bin/bash", "#!/bin/sh", "# bash", "#include <bash>"], 0],
      ["How do you write \"if $i equals 4\" in Bash?", ["if [ $i -eq 4 ]", "if ($i == 4)", "if [$i = 4]", "if i == 4 then"], 0, "Spaces inside the brackets are required."],
      ["Which tool checks Bash scripts for common mistakes?", ["betty", "shellcheck", "pycodestyle", "gcc"], 1],
      ["How do you read a file line by line in Bash?", ["for line in file", "while read -r line; do …; done &lt; file", "cat file | for", "readfile file"], 1],
      ["What does <code>cut -d: -f1</code> do?", ["Deletes field 1", "Prints the first :-separated field of each line", "Counts fields", "Cuts the first character"], 1],
    ],
    tasks: [
      sh("For Best School loop", "1-for_best_school", "<p>Display <code>Best School</code> 10 times, using a <strong>for</strong> loop.</p>", "for i in {1..10}\ndo\n\techo \"Best School\"\ndone", [FOR10]),
      sh("While Best School loop", "2-while_best_school", "<p>Display <code>Best School</code> 10 times, using a <strong>while</strong> loop.</p>", "i=0\nwhile [ $i -lt 10 ]\ndo\n\techo \"Best School\"\n\t((i++))\ndone",
        [R`(\w+)=0\nwhile \[ \$\1 -lt 10 \](?:; |\n)do\necho "?Best School"?\n(?:\(\(\1\+\+\)\)|\1=\$\(\(\1 ?\+ ?1\)\)|let \1\+\+|\(\( ?\1 ?\+= ?1 ?\)\))\ndone`, R`(\w+)=1\nwhile \[ \$\1 -le 10 \](?:; |\n)do\necho "?Best School"?\n(?:\(\(\1\+\+\)\)|\1=\$\(\(\1 ?\+ ?1\)\)|let \1\+\+|\(\( ?\1 ?\+= ?1 ?\)\))\ndone`]),
      sh("4 bad luck, 8 is your chance", "5-4_bad_luck_8_is_your_chance", "<p>Loop from 1 to 10 and display <code>bad luck</code> for the 4th iteration, <code>good luck</code> for the 8th iteration, and <code>Best School</code> for the other iterations. Use a <code>while</code> loop and <code>if, elif, else</code>.</p>",
        "i=1\nwhile [ $i -le 10 ]\ndo\n\tif [ $i -eq 4 ]\n\tthen\n\t\techo \"bad luck\"\n\telif [ $i -eq 8 ]\n\tthen\n\t\techo \"good luck\"\n\telse\n\t\techo \"Best School\"\n\tfi\n\t((i++))\ndone",
        [R`(\w+)=1\nwhile \[ \$\1 -le 10 \](?:; |\n)do\nif \[ \$\1 -eq 4 \](?:; |\n)then\necho "?bad luck"?\nelif \[ \$\1 -eq 8 \](?:; |\n)then\necho "?good luck"?\nelse\necho "?Best School"?\nfi\n(?:\(\(\1\+\+\)\)|\1=\$\(\(\1 ?\+ ?1\)\)|let \1\+\+|\(\( ?\1 ?\+= ?1 ?\)\))\ndone`]),
      sh("Read and cut", "100-read_and_cut", "<p>Display the content of <code>/etc/passwd</code>, but only: username, user id, home directory path. Use a <code>while</code> loop.</p>",
        "while read -r line\ndo\n\techo \"$line\" | cut -d ':' -f 1,3,6\ndone < /etc/passwd",
        [R`while (?:IFS= )?read (?:-r )?(\w+)(?:; |\n)do\necho "?\$\1"? \| cut -d ?["']?:["']? -f ?1,3,6\ndone ?< ?/etc/passwd`]),
    ],
  };

  /* ---------------- 0x05 processes and signals ---------------- */
  EX["se-05"] = {
    quiz: [
      ["Which special variable holds the PID of the current shell?", ["$?", "$$", "$!", "$0"], 1],
      ["Which signal cannot be caught or ignored?", ["SIGTERM", "SIGINT", "SIGKILL", "SIGHUP"], 2],
      ["What signal does <code>kill PID</code> send by default?", ["SIGKILL (9)", "SIGTERM (15)", "SIGINT (2)", "SIGSTOP"], 1],
      ["What does Ctrl-C send to the foreground process?", ["SIGTERM", "SIGINT", "SIGQUIT", "SIGKILL"], 1],
      ["What is a zombie process?", ["A process using 100% CPU", "A finished child whose parent hasn't called wait() yet", "A process owned by root", "A stopped process"], 1],
    ],
    tasks: [
      sh("What is my PID", "0-what-is-my-pid", "<p>Display its own PID.</p>", "echo $$", ["echo \"?\\$\\$\"?"]),
      sh("List your processes", "1-list_your_processes", "<p>Display a list of currently running processes: all processes, for all users, including those without a TTY, in a hierarchy (user-oriented format).</p>", "ps auxf", ["ps -?auxf", "ps -?aux --forest", "ps -ef --forest"]),
      sh("Show your Bash PID made easy", "3-show_your_bash_pid_made_easy", "<p>Display the PID, along with the process name, of processes whose name contain the word <code>bash</code>. You are not allowed to use <code>ps</code>.</p>", "pgrep -l bash", ["pgrep -l [\"']?bash[\"']?", "pgrep [\"']?bash[\"']? -l", "pgrep -a [\"']?bash[\"']?"]),
      sh("To infinity and beyond", "4-to_infinity_and_beyond", "<p>Display <code>To infinity and beyond</code> indefinitely, with a <code>sleep 2</code> between each iteration.</p>", "while true\ndo\n\techo \"To infinity and beyond\"\n\tsleep 2\ndone", [R`while (?:true|:|\[ 1 \])(?:; |\n)do\necho "?To infinity and beyond"?\nsleep 2\ndone`]),
      sh("Don't stop me now!", "5-dont_stop_me_now", "<p>Stop the <code>4-to_infinity_and_beyond</code> process using <code>kill</code> (you may use pgrep to find its PID).</p>", "kill \"$(pgrep -f 4-to_infinity_and_beyond)\"", [R`kill "?\$\(pgrep -f ["']?4-to_infinity_and_beyond["']?\)"?`, R`kill -(?:15|SIGTERM|TERM) "?\$\(pgrep -f ["']?4-to_infinity_and_beyond["']?\)"?`]),
      sh("Stop me if you can", "6-stop_me_if_you_can", "<p>Stop the <code>4-to_infinity_and_beyond</code> process without using <code>kill</code> or <code>killall</code>.</p>", "pkill -f 4-to_infinity_and_beyond", [R`pkill -f ["']?4-to_infinity_and_beyond["']?`]),
      sh("Highlander", "7-highlander", "<p>Display <code>To infinity and beyond</code> indefinitely with a <code>sleep 2</code>, and display <code>I am invincible!!!</code> when receiving a SIGTERM signal.</p>",
        "trap 'echo \"I am invincible!!!\"' SIGTERM\nwhile true\ndo\n\techo \"To infinity and beyond\"\n\tsleep 2\ndone",
        [R`trap ["']echo "?I am invincible!!!"?["'] (?:SIGTERM|TERM|15)\nwhile (?:true|:)(?:; |\n)do\necho "?To infinity and beyond"?\nsleep 2\ndone`]),
    ],
  };

  EX["se-cmd"] = {
    quiz: [
      ["Which command finds files by name recursively?", ["grep -r", "find . -name", "ls -R | name", "locate -r"], 1],
      ["What does <code>xargs</code> do?", ["Prints its arguments", "Builds and runs commands from standard input", "Counts arguments", "Sorts arguments"], 1],
      ["Which sed command replaces every <code>foo</code> with <code>bar</code>?", ["sed 's/foo/bar/'", "sed 's/foo/bar/g'", "sed 'r/foo/bar/'", "sed -d foo"], 1],
    ],
    tasks: [],
    manual: ["Complete the first 9 levels of <a href=\"https://cmdchallenge.com\" target=\"_blank\" rel=\"noopener\">CMD Challenge</a> and save screenshots", "Push the screenshots to <code>command_line_for_the_win/</code> with scp, then to GitHub"],
  };

  /* ---------------- 0x06 regex ---------------- */
  const rx = (t, file, p, sol, cases, bad) => ({ t, lang: "regex", file, p, start: "", sol, cases, bad });
  EX["se-06"] = {
    quiz: [
      ["What does <code>^</code> mean at the start of a regex?", ["Not", "Start of the string/line", "Any character", "Power"], 1],
      ["Which regex matches one or more digits?", ["\\d*", "\\d+", "\\d?", "[0-9]{0}"], 1],
      ["What does <code>hbt{2,5}n</code> match?", ["hbtn only", "h b, 2 to 5 t's, then n", "hbt2,5n", "Any 2–5 characters"], 1],
      ["What does <code>.</code> match in a regex?", ["A literal dot", "Any single character (except newline)", "End of string", "Nothing"], 1],
    ],
    tasks: [
      rx("Simply matching School", "0-simply_match_school.rb", "<p>Write the regular expression that matches <code>School</code>. (Write only the regex, e.g. <code>abc</code>.)</p>", "School",
        [["School", "School"], ["Best School", "School"], ["School Best School", "SchoolSchool"], ["Grace Hopper", ""]]),
      rx("Repetition Token #0", "1-repetition_token_0.rb", "<p>Find the regex that matches <code>hbttn</code>, <code>hbtttn</code>, <code>hbttttn</code>, <code>hbtttttn</code> — but not <code>hbn</code>, <code>hbtn</code> or <code>hbttttttn</code>.</p>", "hbt{2,5}n",
        [["hbn", ""], ["hbtn", ""], ["hbttn", "hbttn"], ["hbtttn", "hbtttn"], ["hbttttn", "hbttttn"], ["hbtttttn", "hbtttttn"], ["hbttttttn", ""]], ["hbt+n"]),
      rx("Repetition Token #1", "2-repetition_token_1.rb", "<p>Match <code>htn</code> and <code>hbtn</code>, but not <code>hbbtn</code>.</p>", "hb?tn",
        [["htn", "htn"], ["hbtn", "hbtn"], ["hbbtn", ""], ["hbbbtn", ""]], ["h.*tn"]),
      rx("Repetition Token #2", "3-repetition_token_2.rb", "<p>Match <code>hbtn</code>, <code>hbttn</code>, <code>hbtttn</code>… (one or more t), not <code>hbn</code>.</p>", "hbt+n",
        [["hbn", ""], ["hbtn", "hbtn"], ["hbttn", "hbttn"], ["hbttttttttn", "hbttttttttn"]]),
      rx("Repetition Token #3", "4-repetition_token_3.rb", "<p>Match <code>hbn</code>, <code>hbtn</code>, <code>hbttn</code>… (zero or more t). Don't use square brackets.</p>", "hbt*n",
        [["hbn", "hbn"], ["hbtn", "hbtn"], ["hbtttn", "hbtttn"], ["hbon", ""]]),
      rx("Not quite HBTN yet", "5-beginning_and_end.rb", "<p>Match a string that starts with <code>h</code>, ends with <code>n</code> and has any single character in between.</p>", "^h.n$",
        [["hbn", "hbn"], ["h8n", "h8n"], ["hbtn", ""], ["xhbn", ""], ["h n", "h n"]]),
      rx("Call me maybe", "6-phone_number.rb", "<p>Match a 10-digit phone number (and nothing else).</p>", "^\\d{10}$",
        [["4155049898", "4155049898"], ["415 504 9898", ""], ["415-504-9898", ""], ["41550498989", ""]]),
      rx("OMG WHY ARE YOU SHOUTING?", "7-OMG_WHY_ARE_YOU_SHOUTING.rb", "<p>Match only capital letters (so scan + join keeps just the capitals).</p>", "[A-Z]",
        [["I realLy hOpe VancouvEr posseSs Yummy Soft vAnilla Dupper Mint Ice Nutella cream", "ILOVESYSADMIN"], ["WHAT do you SAY?", "WHATSAY"]]),
    ],
  };

  /* ---------------- networking ---------------- */
  EX["se-07"] = {
    quiz: [
      ["How many layers does the OSI model have?", ["4", "5", "7", "9"], 2],
      ["Which protocol is connection-oriented and guarantees delivery order?", ["UDP", "TCP", "IP", "ICMP"], 1],
      ["What is the default port of HTTP? HTTPS? SSH?", ["80, 443, 22", "8080, 443, 21", "80, 8443, 23", "443, 80, 22"], 0],
      ["What's a LAN?", ["The internet", "A network in a limited area (home, office)", "A type of cable", "A protocol"], 1],
      ["Which command sends ICMP echo requests to test reachability?", ["ping", "curl", "netcat", "traceroute -p"], 0],
    ],
    tasks: [
      sh("Ping", "5-is_the_host_on_the_network", "<p>Ping an IP address passed as an argument 5 times. If no argument is given, print <code>Usage: 5-is_the_host_on_the_network {IP_ADDRESS}</code>.</p>",
        "if [ -z \"$1\" ]\nthen\n\techo \"Usage: 5-is_the_host_on_the_network {IP_ADDRESS}\"\nelse\n\tping -c 5 \"$1\"\nfi",
        [R`if \[ -z "?\$1"? \](?:; |\n)then\necho "?Usage: (?:5-is_the_host_on_the_network|\$0|\$\(basename "?\$0"?\)) \{IP_ADDRESS\}"?\nelse\nping -c ?5 "?\$1"?\nfi`, R`if \[ \$# -(?:eq|lt) [01] \](?:; |\n)then\necho "?Usage: (?:5-is_the_host_on_the_network|\$0|\$\(basename "?\$0"?\)) \{IP_ADDRESS\}"?\nelse\nping -c ?5 "?\$1"?\nfi`]),
    ],
  };
  EX["se-08"] = {
    quiz: [
      ["What is <code>localhost</code>?", ["Your router", "A hostname that refers to this computer (127.0.0.1)", "The DNS server", "A public IP"], 1],
      ["What does <code>0.0.0.0</code> mean for a server listening on it?", ["Nowhere", "All network interfaces of the machine", "Only localhost", "The gateway"], 1],
      ["Which file maps hostnames to IPs locally?", ["/etc/hosts", "/etc/passwd", "/etc/resolv.conf only", "~/.bashrc"], 0],
      ["Which tool can listen on a port: <code>nc -l 98</code>?", ["netcat", "ping", "ifconfig", "dig"], 0],
    ],
    tasks: [
      sh("Show active IPv4 IPs", "100-show_active_ipv4", "<p>Display all active IPv4 addresses on the machine (one per line, address only).</p>", "ifconfig | grep -Eo \"inet (addr:)?([0-9]*\\.){3}[0-9]*\" | cut -d ' ' -f 2", ["ifconfig \\| grep .*inet.*", "ip -4 (?:-o )?a(?:ddr)?(?: show)?(?: \\|.*)?", "hostname -I(?: \\|.*)?"]),
      sh("Listening on port 98", "101-netcat_th_best_school", "<p>Listen on port 98 on localhost.</p>", "nc -l localhost 98", ["nc -l(?:k)? (?:localhost )?(?:-p )?98", "nc -l(?:k)?p ?98"]),
    ],
  };

  /* ---------------- sysadmin / DevOps (mostly practical) ---------------- */
  EX["se-09"] = {
    quiz: [
      ["What is a single point of failure (SPOF)?", ["A slow server", "A component whose failure takes the whole system down", "A firewall rule", "A database index"], 1],
      ["Which DNS record maps a domain to an IPv4 address?", ["CNAME", "A", "MX", "TXT"], 1],
      ["What's the role of a load balancer?", ["Store data", "Distribute traffic across several servers", "Encrypt traffic", "Resolve domain names"], 1],
      ["What's the difference between a web server and an application server?", ["None", "Web server serves static content/proxies; app server runs your code (dynamic content)", "App servers serve images", "Web servers run databases"], 1],
      ["In a primary-replica database setup, where should writes go?", ["To any replica", "To the primary", "To the load balancer", "Nowhere"], 1],
    ],
    tasks: [],
    manual: ["Draw a one-server web infrastructure for www.foobar.com (server, Nginx, app server, code, MySQL, DNS) and explain each part", "Draw a distributed three-server design with a load balancer, and list its SPOFs", "Draw a secured and monitored design (firewalls, HTTPS, monitoring)"],
  };
  EX["se-0A"] = {
    quiz: [
      ["What problem does configuration management (Puppet, Ansible…) solve?", ["Writing C code", "Making server setup repeatable and automatic", "Monitoring CPU", "Compiling code"], 1],
      ["Which Puppet resource type ensures a package is installed?", ["file", "package", "exec", "service"], 1],
      ["Which command applies a Puppet manifest locally?", ["puppet apply file.pp", "puppet run file.pp", "puppet-lint file.pp", "ruby file.pp"], 0],
    ],
    tasks: [
      cmd("Create a file", "0-create_a_file.pp", "<p>Write a Puppet manifest that creates a file at <code>/tmp/school</code> with permission <code>0744</code>, owner <code>www-data</code>, group <code>www-data</code> and content <code>I love Puppet</code>.</p>",
        "file { '/tmp/school':\n  ensure  => file,\n  mode    => '0744',\n  owner   => 'www-data',\n  group   => 'www-data',\n  content => 'I love Puppet',\n}",
        [R`file \{ ?['"]/tmp/school['"] ?:(?:\n(?:ensure => ['"]?(?:file|present)['"]?|mode => ['"]0744['"]|owner => ['"]www-data['"]|group => ['"]www-data['"]|content => ['"]I love Puppet['"]),?){5,6}\n\}`]),
      cmd("Install a package", "1-install_a_package.pp", "<p>Using Puppet, install <code>flask</code> version <code>2.1.0</code> from pip3.</p>",
        "package { 'flask':\n  ensure   => '2.1.0',\n  provider => 'pip3',\n}",
        [R`package \{ ?['"]flask['"] ?:(?:\n(?:ensure => ['"]2\.1\.0['"]|provider => ['"]?pip3['"]?),?){2}\n\}`]),
    ],
    manual: ["Install Puppet and puppet-lint on Ubuntu, and apply your manifests"],
  };
  EX["se-0B"] = {
    quiz: [
      ["What file do you put your <em>public</em> key in on the server?", ["~/.ssh/id_rsa", "~/.ssh/authorized_keys", "/etc/passwd", "~/.ssh/config"], 1],
      ["Which command creates an RSA key pair called <code>school</code> with passphrase <code>betty</code>?", ["ssh-keygen -t rsa -b 4096 -f school -N betty", "ssh -keygen school", "ssh-add school betty", "openssl rsa school"], 0],
      ["Should you ever share your private key?", ["Yes, with your team", "No, never", "Only by email", "Only on GitHub"], 1],
    ],
    tasks: [
      sh("Use a private key", "0-use_a_private_key", "<p>Connect to your server (IP <code>8.8.8.8</code>) as the user <code>ubuntu</code> using the private key <code>~/.ssh/school</code>, with <code>ssh</code>.</p>", "ssh -i ~/.ssh/school ubuntu@8.8.8.8", [R`ssh -i ~/\.ssh/school ubuntu@8\.8\.8\.8`, R`ssh ubuntu@8\.8\.8\.8 -i ~/\.ssh/school`]),
      sh("Create an SSH key pair", "1-create_ssh_key_pair", "<p>Create an RSA key pair: private key name <code>school</code>, 4096 bits, protected by the passphrase <code>betty</code>.</p>", "ssh-keygen -t rsa -b 4096 -f school -N betty", [R`ssh-keygen(?: (?:-t rsa|-b 4096|-f school|-N ["']?betty["']?)){4}`]),
    ],
    manual: ["Get a server (or a local VM / WSL), add your public key, and log in without a password", "Create <code>~/.ssh/config</code> so <code>ssh myserver</code> just works"],
  };
  EX["se-0C"] = {
    quiz: [
      ["Which HTTP status code means a permanent redirect?", ["200", "301", "404", "500"], 1],
      ["Which command reloads Nginx after changing its config (Ubuntu)?", ["service nginx restart / reload", "nginx --start", "apt reload nginx", "systemctl nginx"], 0],
      ["Which DNS record type points www.example.com to another hostname?", ["A", "CNAME", "MX", "SOA"], 1],
      ["What does <code>curl -sI localhost</code> show?", ["The HTML body", "Only the response headers", "Nothing", "The server's IP"], 1],
    ],
    tasks: [
      sh("Transfer a file to your server", "0-transfer_file", "<p>Transfer a file from your client to a server with <code>scp</code>. Accept 4 parameters: path to file, server IP, username, path to the SSH private key. Display <code>Usage: 0-transfer_file PATH_TO_FILE IP USERNAME PATH_TO_SSH_KEY</code> if less than 3 parameters are passed. Transfer to the user's home directory <code>~/</code> and disable strict host key checking.</p>",
        "if [ $# -lt 3 ]\nthen\n\techo \"Usage: 0-transfer_file PATH_TO_FILE IP USERNAME PATH_TO_SSH_KEY\"\nelse\n\tscp -o StrictHostKeyChecking=no -i \"$4\" \"$1\" \"$3@$2\":~/\nfi",
        [R`if \[ \$# -lt 3 \](?:; |\n)then\necho "?Usage: 0-transfer_file PATH_TO_FILE IP USERNAME PATH_TO_SSH_KEY"?\nelse\nscp (?:-o StrictHostKeyChecking=no -i "?\$4"?|-i "?\$4"? -o StrictHostKeyChecking=no) "?\$1"? "?\$3@\$2"?:~/?\nfi`]),
    ],
    manual: ["Install Nginx with a Bash script and serve <code>Hello World!</code> on port 80", "Get a free domain (or use your server IP) and configure DNS", "Add a 301 redirect at <code>/redirect_me</code> and a custom 404 page containing <code>Ceci n'est pas une page</code>"],
  };
  EX["se-0D"] = { quiz: [["What's the first step when a web stack is broken?", ["Reinstall everything", "Reproduce the problem and read the logs / error output", "Restart the computer", "Change the port"], 1], ["Which command shows which process is listening on a port?", ["ss -tlnp (or netstat -tlnp)", "ps -port", "ls /ports", "ping -p"], 0], ["What does <code>docker ps</code> show?", ["Images", "Running containers", "Networks", "Volumes"], 1]], tasks: [], manual: ["Run the debugging container from the project, find why Apache returns an empty response, and fix it with a one-line script"] };
  EX["se-0E"] = { quiz: [["Nginx isn't answering on port 80. Where do you look first?", ["The site's sites-enabled config and whether nginx is running", "The /etc/passwd file", "The kernel version", "The DNS"], 0], ["What does <code>ln -sf</code> do?", ["Creates or replaces a symbolic link", "Deletes a link", "Copies a file", "Compresses a file"], 0]], tasks: [], manual: ["Fix Nginx to listen on port 80 in the debugging container, using a script of 5 lines or less"] };
  EX["se-0F"] = {
    quiz: [["What does round-robin load balancing do?", ["Sends every request to the fastest server", "Sends requests to each server in turn", "Sends requests randomly", "Sends all traffic to one server"], 1], ["Which tool is used as a load balancer in this project?", ["HAProxy", "Apache", "MySQL", "Puppet"], 0], ["Why add a custom header like <code>X-Served-By</code>?", ["Security", "To see which backend server answered", "To speed things up", "It's required by HTTP"], 1]],
    tasks: [], manual: ["Configure a second web server identical to the first (Nginx + custom header X-Served-By with the hostname)", "Install HAProxy on your load-balancer server and balance traffic with round-robin between web-01 and web-02"],
  };
  EX["se-10"] = { quiz: [["What does SSL termination mean?", ["Disabling HTTPS", "The load balancer decrypts HTTPS and forwards plain HTTP to backends", "Revoking certificates", "Encrypting the database"], 1], ["Which free authority issues TLS certificates automatically?", ["Let's Encrypt", "VeriSign", "GoDaddy", "ICANN"], 0], ["Which port does HTTPS use by default?", ["80", "443", "22", "8443"], 1]], tasks: [], manual: ["Create a certificate with certbot for your domain", "Configure HAProxy to accept HTTPS and redirect HTTP → HTTPS (301)"] };
  EX["se-11"] = { quiz: [["What happens first when you type google.com and press Enter?", ["The TCP connection", "A DNS lookup to find the IP address", "The TLS handshake", "The HTTP response"], 1], ["Which comes first: TCP handshake or TLS handshake?", ["TLS", "TCP", "At the same time", "Neither is used"], 1]], tasks: [], manual: ["Write a blog post explaining the whole path: DNS, TCP/IP, firewall, HTTPS/SSL, load balancer, web server, application server, database", "Draw a diagram of it and add it to the post"] };
  EX["se-12"] = { quiz: [["How do you run a command as another user?", ["sudo -u user command", "su command user", "run-as user", "chown user command"], 0], ["Why shouldn't Nginx's worker run as root?", ["It's slower", "A compromise would give the attacker full control of the machine", "Root can't open ports", "It can't read files"], 1]], tasks: [sh("Run software as another user", "0-iamsomeoneelse", "<p>Run the <code>whoami</code> command under the user passed as an argument.</p>", "sudo -u \"$1\" whoami", [R`sudo -u "?\$1"? whoami`, R`su "?\$1"? -c ["']?whoami["']?`])], manual: ["Fix the container so Nginx runs as the <code>nginx</code> user and listens on port 8080"] };
  EX["se-13"] = { quiz: [["What does a firewall do?", ["Speeds up the network", "Filters network traffic according to rules", "Encrypts disks", "Balances load"], 1], ["Which ufw command allows SSH?", ["ufw allow 22/tcp", "ufw open ssh", "ufw enable 22", "ufw permit ssh"], 0], ["What's the safest default policy for incoming traffic?", ["Allow all", "Deny all, then allow what you need", "Allow only UDP", "No policy"], 1]], tasks: [sh("Block all incoming traffic but", "0-block_all_incoming_traffic_but", "<p>(Write the commands, one per line.) Install ufw, deny all incoming by default, allow outgoing, then allow ports 22, 443 and 80 (TCP), and enable ufw.</p>", "sudo apt-get install ufw\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 22/tcp\nsudo ufw allow 443/tcp\nsudo ufw allow 80/tcp\nsudo ufw enable",
    [R`(?:sudo )?apt(?:-get)? (?:-y )?install (?:-y )?ufw(?: -y)?\n(?:sudo )?ufw default deny incoming\n(?:sudo )?ufw default allow outgoing\n(?:(?:sudo )?ufw allow (?:22|443|80)(?:/tcp)?\n){3}(?:sudo )?ufw (?:--force )?enable`])], manual: ["Apply the firewall on web-01 (not the load balancer) and check you can still SSH in"] };
  EX["se-14"] = { quiz: [["What's a database replica for?", ["Faster writes only", "Redundancy and spreading read load", "Encryption", "Indexing"], 1], ["Which command backs up all MySQL databases to a file?", ["mysqldump --all-databases > backup.sql", "mysql --backup", "cp /var/lib/mysql backup", "mysqlbackup all"], 0]], tasks: [], manual: ["Install MySQL 5.7/8 on web-01 and web-02", "Set up primary-replica replication between them", "Write a script that creates a compressed MySQL dump named <code>day-month-year.tar.gz</code>"] };
  EX["se-17"] = { quiz: [["What does strace show?", ["CPU usage", "The system calls a process makes", "Network packets", "Source code"], 1], ["Apache returns a 500 error. Which tool helps find the failing file access?", ["strace", "ping", "dig", "nano"], 0]], tasks: [], manual: ["Use strace on the Apache process to find why WordPress returns 500, then fix it with a Puppet manifest (<code>0-strace_is_your_friend.pp</code>)"] };
  EX["se-18"] = { quiz: [["What's the difference between application and server monitoring?", ["None", "Application monitoring watches your app's behaviour; server monitoring watches CPU, RAM, disk…", "Server monitoring is for apps", "Application monitoring is only for databases"], 1], ["Name two key metrics to monitor on a web server.", ["Requests per second and error rate", "Number of files and folders", "Kernel version and uptime only", "Git commits and branches"], 0]], tasks: [], manual: ["Sign up to Datadog (free) and install the agent on web-01", "Create a monitor for disk read requests and one for write requests", "Create a dashboard with 4 widgets"] };
  EX["se-19"] = { quiz: [["What does a good postmortem focus on?", ["Who to blame", "Timeline, root cause, impact and corrective actions", "Only the fix", "Marketing"], 1], ["Why are postmortems \"blameless\"?", ["To protect managers", "So people share the truth and the system gets fixed", "Because nobody makes mistakes", "It's a legal requirement"], 1]], tasks: [], manual: ["Write a postmortem (issue summary, timeline, root cause, resolution, corrective measures) for one outage from your web stack debugging projects", "Make it attractive: a diagram or a funny touch"] };
  EX["se-1A"] = { quiz: [["What does Gunicorn do?", ["Serves static files", "Runs your Python WSGI app (application server)", "Load balances", "Manages DNS"], 1], ["How does Nginx talk to Gunicorn?", ["It proxies requests to it (proxy_pass)", "It runs Python itself", "Through MySQL", "It doesn't"], 0], ["Why use a systemd service for Gunicorn?", ["To start it on boot and restart it if it crashes", "To make it faster", "For HTTPS", "To compile Python"], 0]], tasks: [], manual: ["Serve your AirBnB Flask app with Gunicorn on port 5000", "Configure Nginx to proxy <code>/airbnb-onepage/</code> to Gunicorn", "Create a systemd unit file for Gunicorn and make it start on boot"] };
  EX["se-1B"] = { quiz: [["What does ApacheBench (<code>ab</code>) do?", ["Benchmarks a web server by sending many requests", "Builds Apache", "Backs up Apache", "Monitors logs"], 0], ["\"Too many open files\" — which limit do you raise?", ["ulimit -n (nofile)", "ulimit -u", "The disk size", "The swap"], 0]], tasks: [], manual: ["Benchmark the container with <code>ab -c 100 -n 2000</code>, find the failing requests, and fix them with Puppet"] };

  /* ---------------- Makefiles ---------------- */
  EX["ll-1C"] = {
    quiz: [
      ["What runs when you type <code>make</code> with no target?", ["Every rule", "The first rule (target) in the Makefile", "make clean", "Nothing"], 1],
      ["Which character must start every recipe line in a Makefile?", ["A space", "A tab", "A dash", "Anything"], 1],
      ["What is <code>$(CC)</code> conventionally?", ["The C compiler (e.g. gcc)", "The current directory", "The output file", "Compiler flags"], 0],
      ["What's a .PHONY target?", ["A target that isn't a file, e.g. clean", "A fake file", "A compiled object", "An error"], 0],
    ],
    tasks: [
      cmd("make -f 0-Makefile", "0-Makefile", "<p>Create your first Makefile. Name of the executable: <code>school</code>. Rule <code>all</code> builds the executable from <code>main.c school.c</code> with gcc. (Use a tab before the recipe line — tabs and spaces are both accepted by this checker.)</p>",
        "all: main.c school.c\n\tgcc main.c school.c -o school",
        [R`all:(?: main\.c school\.c)?\ngcc main\.c school\.c -o school`]),
      cmd("make -f 1-Makefile", "1-Makefile", "<p>Same as before, but with variables: <code>CC</code> = the compiler, <code>SRC</code> = the .c files. Rule: <code>all</code>.</p>",
        "CC = gcc\nSRC = main.c school.c\n\nall: $(SRC)\n\t$(CC) $(SRC) -o school",
        [R`CC ?= ?gcc\nSRC ?= ?main\.c school\.c\nall:(?: \$\(SRC\))?\n\$\(CC\) \$\(SRC\) -o school`]),
    ],
  };
})();
