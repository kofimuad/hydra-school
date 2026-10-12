/* Practice for the Low-level & Algorithms specialization (holbertonschool-system_linux / system_algorithms). */
(function () {
  const EX = (window.EX = window.EX || {});
  const c = (t, file, header, p, start, sol, tests, extra) => Object.assign({ t, lang: "c", file, header, p, start, sol, tests }, extra || {});
  const quizOnly = (pid, quiz, manual) => { EX[pid] = { quiz, tasks: [], manual }; };

  /* ---------------- ls ---------------- */
  EX["sl-00"] = {
    quiz: [
      ["Which call gives you the metadata of a file without following symlinks?", ["stat", "lstat", "fstat", "readdir"], 1],
      ["Which macro checks if a mode is a directory?", ["S_ISREG(mode)", "S_ISDIR(mode)", "IS_DIR(mode)", "mode & DIR"], 1],
      ["What does <code>ls -A</code> show compared to <code>ls -a</code>?", ["Nothing", "Hidden files but not . and ..", "Only directories", "Long format"], 1],
      ["Which function turns a uid into a user name?", ["getuid", "getpwuid", "getlogin", "uidname"], 1],
    ],
    tasks: [
      c("Permissions string", "perms.c", "#include <sys/stat.h>\nvoid print_perms(mode_t mode);\n",
        "<p>Write <code>void print_perms(mode_t mode);</code> that prints the 10-character permission string <code>ls -l</code> shows, followed by a new line: the type (<code>d</code> directory, <code>l</code> symlink, <code>-</code> regular file) then <code>rwx</code> for user, group and others (<code>-</code> when a bit is missing). Use the <code>S_IS*</code> macros and <code>S_IRUSR</code>… constants.</p>",
        "#include <stdio.h>\n#include <sys/stat.h>\n\n/**\n * print_perms - prints an ls-style permission string\n * @mode: file mode\n */\nvoid print_perms(mode_t mode)\n{\n\n}\n",
        "#include <stdio.h>\n#include <sys/stat.h>\n\n/**\n * print_perms - prints an ls-style permission string\n * @mode: file mode\n */\nvoid print_perms(mode_t mode)\n{\n\tchar s[11];\n\n\ts[0] = S_ISDIR(mode) ? 'd' : S_ISLNK(mode) ? 'l' : '-';\n\ts[1] = mode & S_IRUSR ? 'r' : '-';\n\ts[2] = mode & S_IWUSR ? 'w' : '-';\n\ts[3] = mode & S_IXUSR ? 'x' : '-';\n\ts[4] = mode & S_IRGRP ? 'r' : '-';\n\ts[5] = mode & S_IWGRP ? 'w' : '-';\n\ts[6] = mode & S_IXGRP ? 'x' : '-';\n\ts[7] = mode & S_IROTH ? 'r' : '-';\n\ts[8] = mode & S_IWOTH ? 'w' : '-';\n\ts[9] = mode & S_IXOTH ? 'x' : '-';\n\ts[10] = '\\0';\n\tprintf(\"%s\\n\", s);\n}\n",
        [{ main: "int main(void)\n{\n\tprint_perms(S_IFDIR | 0755);\n\tprint_perms(S_IFREG | 0644);\n\tprint_perms(S_IFLNK | 0777);\n\tprint_perms(S_IFREG | 0);\n\treturn (0);\n}\n", out: "drwxr-xr-x\n-rw-r--r--\nlrwxrwxrwx\n----------\n" }], { noPutchar: true }),
    ],
    manual: ["Build <code>hls</code>: list directories with opendir/readdir, handle errors like ls, then options -1 -a -A -l (then -r -S -t -R)"],
  };

  /* ---------------- getline ---------------- */
  EX["sl-01"] = {
    quiz: [
      ["What's special about a <code>static</code> local variable?", ["It's read-only", "It keeps its value between calls", "It's on the stack", "It's global to all files"], 1],
      ["What does <code>read(fd, buf, n)</code> return at end of file?", ["-1", "0", "n", "EOF"], 1],
      ["Why read in big chunks (READ_SIZE) instead of byte by byte?", ["It's required", "Fewer system calls = much faster", "To support Unicode", "To avoid malloc"], 1],
    ],
    tasks: [
      c("_getline", "_getline.c", "#define READ_SIZE 1024\nchar *_getline(const int fd);\n",
        "<p>Write <code>char *_getline(const int fd);</code> that returns the next line from a file descriptor (without the <code>\\n</code>), as a newly allocated string, or NULL when there are no more lines. Use <code>read</code> with a static buffer of <code>READ_SIZE</code> bytes; you can't read more than READ_SIZE at a time. (The test reads from standard input, fd 0.)</p>",
        "#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include \"_getline.h\"\n\n/**\n * _getline - reads the next line from a file descriptor\n * @fd: file descriptor\n *\n * Return: the line (without newline), or NULL\n */\nchar *_getline(const int fd)\n{\n\n}\n",
        "#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include \"_getline.h\"\n\n/**\n * _getline - reads the next line from a file descriptor\n * @fd: file descriptor\n *\n * Return: the line (without newline), or NULL\n */\nchar *_getline(const int fd)\n{\n\tstatic char buf[READ_SIZE];\n\tstatic ssize_t len, pos;\n\tchar *line = NULL, *tmp;\n\tsize_t n = 0;\n\n\twhile (1)\n\t{\n\t\tif (pos >= len)\n\t\t{\n\t\t\tlen = read(fd, buf, READ_SIZE);\n\t\t\tpos = 0;\n\t\t\tif (len <= 0)\n\t\t\t{\n\t\t\t\tlen = 0;\n\t\t\t\treturn (line);\n\t\t\t}\n\t\t}\n\t\ttmp = realloc(line, n + 2);\n\t\tif (tmp == NULL)\n\t\t{\n\t\t\tfree(line);\n\t\t\treturn (NULL);\n\t\t}\n\t\tline = tmp;\n\t\tif (buf[pos] == '\\n')\n\t\t{\n\t\t\tpos++;\n\t\t\tline[n] = '\\0';\n\t\t\treturn (line);\n\t\t}\n\t\tline[n++] = buf[pos++];\n\t\tline[n] = '\\0';\n\t}\n}\n",
        [{ main: "int main(void)\n{\n\tchar *line;\n\tint n = 0;\n\n\twhile ((line = _getline(0)))\n\t{\n\t\tprintf(\"%d: [%s]\\n\", ++n, line);\n\t\tfree(line);\n\t}\n\treturn (0);\n}\n", stdin: "Holberton\nSchool\n\nlast line without newline", out: "1: [Holberton]\n2: [School]\n3: []\n4: [last line without newline]\n" }], { noPutchar: true }),
    ],
  };

  quizOnly("sl-02", [["Which system call duplicates a file descriptor onto a specific number (used for redirections)?", ["dup", "dup2", "pipe", "fcntl"], 1], ["What does <code>pipe(fds)</code> give you?", ["Two files", "A read end fds[0] and a write end fds[1]", "A socket", "A child process"], 1], ["In <code>ls | wc -l</code>, which process's stdout goes to the pipe?", ["wc", "ls", "Both", "The shell"], 1]], ["Extend your shell: <code>&gt;</code>, <code>&gt;&gt;</code>, <code>&lt;</code>, <code>&lt;&lt;</code> (heredoc), pipes <code>|</code>, <code>;</code>, <code>&amp;&amp;</code>, <code>||</code>, env and aliases"]);
  quizOnly("sl-03", [["What does /proc/[pid]/maps show?", ["Open files", "The memory regions of a process (heap, stack, libraries) and their permissions", "Environment variables", "CPU usage"], 1], ["Which file lets you read/write a process's memory (with permissions)?", ["/proc/[pid]/mem", "/proc/[pid]/status", "/proc/[pid]/fd", "/dev/mem only"], 0]], ["Write <code>read_write_heap.py</code> that finds a string in the heap of a running process and replaces it"]);

  /* ---------------- ELF ---------------- */
  EX["sl-04"] = {
    quiz: [
      ["What are the first 4 bytes of every ELF file?", ["MZ..", "0x7f 'E' 'L' 'F'", "ELF0", "#!/b"], 1],
      ["Which byte of e_ident tells 32-bit vs 64-bit?", ["EI_MAG0", "EI_CLASS (index 4)", "EI_DATA", "EI_VERSION"], 1],
      ["Which byte tells the endianness?", ["EI_CLASS", "EI_DATA (index 5)", "EI_OSABI", "EI_PAD"], 1],
      ["What do section headers describe vs program headers?", ["The same thing", "Sections (for linking) vs segments (for loading at runtime)", "Only debug info", "Only symbols"], 1],
    ],
    tasks: [
      c("ELF header: magic, class and data", "elf_ident.c", "int print_elf_ident(const unsigned char *ident);\n",
        "<p>Write <code>int print_elf_ident(const unsigned char *ident);</code> that receives the 16 <code>e_ident</code> bytes of an ELF header. If the first 4 bytes aren't <code>0x7f 'E' 'L' 'F'</code>, print <code>Not an ELF file</code> and return 1. Otherwise print, like readelf:</p><pre class=\"code\">  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 \n  Class:                             ELF64\n  Data:                              2's complement, little endian</pre><p>(Class: <code>ELF32</code> for 1, <code>ELF64</code> for 2; Data: <code>little endian</code> for 1, <code>big endian</code> for 2.) Return 0.</p>",
        "#include <stdio.h>\n\n/**\n * print_elf_ident - prints the ELF magic, class and data\n * @ident: the 16 e_ident bytes\n *\n * Return: 0 on success, 1 if not ELF\n */\nint print_elf_ident(const unsigned char *ident)\n{\n\n}\n",
        "#include <stdio.h>\n\n/**\n * print_elf_ident - prints the ELF magic, class and data\n * @ident: the 16 e_ident bytes\n *\n * Return: 0 on success, 1 if not ELF\n */\nint print_elf_ident(const unsigned char *ident)\n{\n\tint i;\n\n\tif (ident[0] != 0x7f || ident[1] != 'E' || ident[2] != 'L' || ident[3] != 'F')\n\t{\n\t\tprintf(\"Not an ELF file\\n\");\n\t\treturn (1);\n\t}\n\tprintf(\"  Magic:   \");\n\tfor (i = 0; i < 16; i++)\n\t\tprintf(\"%02x \", ident[i]);\n\tprintf(\"\\n  Class:                             %s\\n\", ident[4] == 1 ? \"ELF32\" : \"ELF64\");\n\tprintf(\"  Data:                              2's complement, %s endian\\n\", ident[5] == 1 ? \"little\" : \"big\");\n\treturn (0);\n}\n",
        [{ main: "int main(void)\n{\n\tunsigned char a[16] = {0x7f, 'E', 'L', 'F', 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0};\n\tunsigned char b[16] = {0x7f, 'E', 'L', 'F', 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0};\n\tunsigned char c[16] = {'#', '!', '/', 'b', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};\n\tint r;\n\n\tprint_elf_ident(a);\n\tprint_elf_ident(b);\n\tr = print_elf_ident(c);\n\tprintf(\"%d\\n\", r);\n\treturn (0);\n}\n", out: "  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 \n  Class:                             ELF64\n  Data:                              2's complement, little endian\n  Magic:   7f 45 4c 46 01 02 01 00 00 00 00 00 00 00 00 00 \n  Class:                             ELF32\n  Data:                              2's complement, big endian\nNot an ELF file\n1\n" }], { noPutchar: true }),
    ],
    manual: ["Build <code>0-hreadelf</code> (file header), then section headers (-S), program headers (-l) and symbols (-s) for 32/64-bit, both endiannesses"],
  };
  quizOnly("sl-05", [["In the System V x86-64 calling convention, where is the first integer argument?", ["rax", "rdi", "rsi", "the stack"], 1], ["Which register holds the return value?", ["rdi", "rax", "rbx", "rsp"], 1], ["Which registers must a function preserve (callee-saved)?", ["rax, rcx", "rbx, rbp, r12–r15", "rdi, rsi", "All of them"], 1]], ["Write <code>asm_strlen</code>, <code>asm_strcmp</code>, <code>asm_strncmp</code>, <code>asm_strchr</code>, <code>asm_strstr</code>, <code>asm_memcpy</code> in x86-64 NASM"]);

  /* ---------------- signals ---------------- */
  EX["sl-06"] = {
    quiz: [
      ["Why prefer sigaction over signal?", ["It's shorter", "Its behaviour is well-defined and portable (flags, masks)", "signal doesn't exist", "sigaction is faster"], 1],
      ["Which signal number is SIGINT?", ["9", "2", "15", "11"], 1],
      ["Which functions are safe to call inside a signal handler?", ["Any function", "Only async-signal-safe ones (e.g. write)", "Only printf", "None"], 1],
    ],
    tasks: [
      c("Handle the signal", "0-handle_signal.c", "#include <signal.h>\nint handle_signal(void);\n",
        "<p>Write <code>int handle_signal(void);</code> that sets a handler for <code>SIGINT</code>. When it's received, the handler prints <code>Gotcha! [&lt;signum&gt;]</code> followed by a new line (and flushes). Return 0 on success, -1 on error. Use <code>signal</code> (sigaction comes next).</p>",
        "#include <stdio.h>\n#include <signal.h>\n\n/**\n * handle_signal - sets a SIGINT handler\n *\n * Return: 0 on success, -1 on error\n */\nint handle_signal(void)\n{\n\n}\n",
        "#include <stdio.h>\n#include <signal.h>\n\n/**\n * gotcha - SIGINT handler\n * @signum: signal number\n */\nvoid gotcha(int signum)\n{\n\tprintf(\"Gotcha! [%d]\\n\", signum);\n\tfflush(stdout);\n}\n\n/**\n * handle_signal - sets a SIGINT handler\n *\n * Return: 0 on success, -1 on error\n */\nint handle_signal(void)\n{\n\treturn (signal(SIGINT, gotcha) == SIG_ERR ? -1 : 0);\n}\n",
        [{ main: "int main(void)\n{\n\tif (handle_signal() == -1)\n\t{\n\t\tprintf(\"Failure\\n\");\n\t\treturn (1);\n\t}\n\traise(SIGINT);\n\traise(SIGINT);\n\tprintf(\"Still alive\\n\");\n\treturn (0);\n}\n", out: "Gotcha! [2]\nGotcha! [2]\nStill alive\n" }], { noPutchar: true }),
      c("Describe a signal", "6-describe_signal.c", "#include <signal.h>\nvoid describe_signal(int signum);\n",
        "<p>Write <code>void describe_signal(int signum);</code> printing <code>&lt;signum&gt;: &lt;description&gt;</code> using <code>strsignal</code> (include <code>&lt;string.h&gt;</code>).</p>",
        "#include <stdio.h>\n#include <string.h>\n\n/**\n * describe_signal - prints a signal description\n * @signum: signal number\n */\nvoid describe_signal(int signum)\n{\n\n}\n",
        "#include <stdio.h>\n#include <string.h>\n\n/**\n * describe_signal - prints a signal description\n * @signum: signal number\n */\nvoid describe_signal(int signum)\n{\n\tprintf(\"%d: %s\\n\", signum, strsignal(signum));\n}\n",
        [{ main: "int main(void)\n{\n\tdescribe_signal(SIGINT);\n\tdescribe_signal(SIGKILL);\n\tdescribe_signal(SIGSEGV);\n\treturn (0);\n}\n", out: "2: Interrupt\n9: Killed\n11: Segmentation fault\n" }], { noPutchar: true }),
    ],
    manual: ["Write the sigaction versions, <code>trace_signal_sender</code> (SA_SIGINFO), <code>pid_exist</code> with kill(pid, 0), and a program that sends SIGINT to another process"],
  };
  quizOnly("sl-07", [["What does <code>nm</code> list?", ["Sections", "Symbols of object files (with their type letters: T, U, D…)", "Strings", "Dependencies"], 1], ["What does symbol type U mean in nm?", ["Unused", "Undefined (defined elsewhere, resolved at link time)", "Uppercase", "Uninitialized data"], 1]], ["Clone <code>nm -p</code> (<code>hnm</code>) and <code>objdump -sf</code> (<code>hobjdump</code>) for 32/64-bit ELF files"]);
  quizOnly("sl-08", [["What is a PyObject?", ["A Python file", "The C struct every Python object starts with (refcount + type)", "A module", "A bytecode"], 1], ["How does CPython store small ints like 5?", ["As C ints", "As PyLongObject with digits (and caches -5..256)", "As strings", "As floats"], 1]], ["From C (ctypes), print information about Python lists, bytes, floats, strings and ints by walking their CPython structures"]);
  quizOnly("sl-09", [["Which system call lets one process trace another?", ["fork", "ptrace", "wait", "trace"], 1], ["In x86-64, which register holds the syscall number at the syscall instruction?", ["rdi", "rax (orig_rax in user_regs)", "rsp", "rip"], 1]], ["Build <code>strace_0</code> … <code>strace_6</code>: print syscall numbers, names, return values and decoded arguments"]);
  quizOnly("sl-0A", [["What is a race condition?", ["A fast program", "Results depend on the unpredictable timing of threads accessing shared data", "A deadlock", "A thread crash"], 1], ["What protects a critical section?", ["A signal", "A mutex (pthread_mutex_lock/unlock)", "A semaphore of 0", "sleep()"], 1], ["What's a deadlock?", ["A slow thread", "Threads waiting on each other forever", "A crashed mutex", "A finished thread"], 1]], ["Write a thread entry, a blur filter split across threads, a thread-safe prime factorization with a task queue (pthreads)"]);

  /* ---------------- malloc ---------------- */
  EX["sl-0B"] = {
    quiz: [
      ["What does <code>sbrk(n)</code> do?", ["Frees memory", "Moves the program break by n bytes and returns the old break", "Maps a file", "Allocates on the stack"], 1],
      ["Why align allocations (e.g. to 8 or 16 bytes)?", ["Style", "CPUs access aligned data faster/safely", "To waste memory", "malloc requires 1-byte alignment"], 1],
      ["Why store a header before each block?", ["For debugging only", "To remember the block's size (and free status) for free/realloc", "To align", "It's not needed"], 1],
    ],
    tasks: [
      c("Naive malloc", "naive_malloc.c", "void *naive_malloc(size_t size);\n",
        "<p>Write <code>void *naive_malloc(size_t size);</code> using <code>sbrk</code>: extend the break by a header (store the size in a <code>size_t</code>) plus the size rounded up to a multiple of 8, and return the address right after the header. Return NULL on failure.</p>",
        "#include <unistd.h>\n#include <stddef.h>\n\n/**\n * naive_malloc - allocates memory with sbrk\n * @size: bytes\n *\n * Return: pointer to the memory, or NULL\n */\nvoid *naive_malloc(size_t size)\n{\n\n}\n",
        "#include <unistd.h>\n#include <stddef.h>\n\n/**\n * naive_malloc - allocates memory with sbrk\n * @size: bytes\n *\n * Return: pointer to the memory, or NULL\n */\nvoid *naive_malloc(size_t size)\n{\n\tsize_t aligned = (size + 7) & ~(size_t)7;\n\tchar *p = sbrk(sizeof(size_t) + aligned);\n\n\tif (p == (void *)-1)\n\t\treturn (NULL);\n\t*(size_t *)p = aligned;\n\treturn (p + sizeof(size_t));\n}\n",
        [{ main: "int main(void)\n{\n\tchar *a, *b;\n\tint i;\n\n\ta = naive_malloc(10);\n\tb = naive_malloc(3);\n\tif (a == NULL || b == NULL)\n\t\treturn (1);\n\tfor (i = 0; i < 9; i++)\n\t\ta[i] = 'A' + i;\n\ta[9] = '\\0';\n\tb[0] = 'o';\n\tb[1] = 'k';\n\tb[2] = '\\0';\n\tprintf(\"%s %s\\n\", a, b);\n\tprintf(\"%lu %lu\\n\", (unsigned long)((size_t *)a)[-1], (unsigned long)((size_t *)b)[-1]);\n\tprintf(\"%d\\n\", (int)(b - a) == 16 + (int)sizeof(size_t));\n\treturn (0);\n}\n", out: "ABCDEFGHI ok\n16 8\n1\n" }], { noPutchar: true }),
    ],
    manual: ["Implement <code>_malloc</code> reusing freed chunks, <code>_free</code>, <code>_calloc</code>, <code>_realloc</code>, aligned on the page/arch"],
  };

  /* ---------------- sockets ---------------- */
  EX["sl-0C"] = {
    quiz: [
      ["What's the order of calls for a TCP server?", ["connect → accept → listen", "socket → bind → listen → accept", "bind → socket → connect", "listen → socket → bind"], 1],
      ["What does htons do?", ["Opens a socket", "Converts a 16-bit value (e.g. a port) to network byte order", "Resolves hostnames", "Closes a socket"], 1],
      ["How does an HTTP request line look?", ["GET HTTP/1.1 /path", "GET /path HTTP/1.1", "/path GET", "HTTP GET /path"], 1],
    ],
    tasks: [
      c("Parse an HTTP request line", "parse_request.c", "int parse_request_line(const char *line, char *method, char *path, char *version);\n",
        "<p>Write <code>int parse_request_line(const char *line, char *method, char *path, char *version);</code> that splits an HTTP request line like <code>GET /test?value=1 HTTP/1.1</code> into its three parts (copy them into the given buffers). Return 1 on success, 0 if the line doesn't have exactly three space-separated parts.</p>",
        "#include <string.h>\n\n/**\n * parse_request_line - splits an HTTP request line\n * @line: the request line\n * @method: output method\n * @path: output path\n * @version: output version\n *\n * Return: 1 on success, 0 on failure\n */\nint parse_request_line(const char *line, char *method, char *path, char *version)\n{\n\n}\n",
        "#include <string.h>\n#include <stdio.h>\n\n/**\n * parse_request_line - splits an HTTP request line\n * @line: the request line\n * @method: output method\n * @path: output path\n * @version: output version\n *\n * Return: 1 on success, 0 on failure\n */\nint parse_request_line(const char *line, char *method, char *path, char *version)\n{\n\tchar extra[2];\n\n\treturn (sscanf(line, \"%31s %255s %15s %1s\", method, path, version, extra) == 3);\n}\n",
        [{ main: "int main(void)\n{\n\tchar m[32], p[256], v[16];\n\n\tprintf(\"%d \", parse_request_line(\"GET /test?value=1 HTTP/1.1\", m, p, v));\n\tprintf(\"[%s] [%s] [%s]\\n\", m, p, v);\n\tprintf(\"%d\\n\", parse_request_line(\"GET /\", m, p, v));\n\tprintf(\"%d\\n\", parse_request_line(\"GET / HTTP/1.1 extra\", m, p, v));\n\treturn (0);\n}\n", out: "1 [GET] [/test?value=1] [HTTP/1.1]\n0\n0\n" }], { noPutchar: true }),
    ],
    manual: ["Write a TCP server that listens on port 12345, then one that prints raw HTTP requests, then a small REST todo API in C"],
  };

  /* ---------------- algorithms ---------------- */
  const RB_H = "typedef enum rb_color_e { RED = 0, BLACK, DOUBLE_BLACK } rb_color_t;\ntypedef struct rb_tree_s\n{\n\tint n;\n\trb_color_t color;\n\tstruct rb_tree_s *parent;\n\tstruct rb_tree_s *left;\n\tstruct rb_tree_s *right;\n} rb_tree_t;\nrb_tree_t *rb_tree_node(rb_tree_t *parent, int value, rb_color_t color);\nint rb_tree_is_valid(const rb_tree_t *tree);\n";
  const RB_NODE = "/**\n * rb_tree_node - creates a red-black tree node\n * @parent: parent node\n * @value: value\n * @color: color\n *\n * Return: the new node or NULL\n */\nrb_tree_t *rb_tree_node(rb_tree_t *parent, int value, rb_color_t color)\n{\n\trb_tree_t *n = malloc(sizeof(*n));\n\n\tif (n == NULL)\n\t\treturn (NULL);\n\tn->n = value;\n\tn->color = color;\n\tn->parent = parent;\n\tn->left = NULL;\n\tn->right = NULL;\n\treturn (n);\n}\n";
  EX["sa-00"] = {
    quiz: [
      ["Which is NOT a red-black tree property?", ["The root is black", "A red node has no red child", "Every path from a node to its NULL leaves has the same number of black nodes", "Every left child is red"], 3],
      ["What's the height bound of a red-black tree with n nodes?", ["O(n)", "O(log n) (at most 2·log₂(n+1))", "O(1)", "O(n log n)"], 1],
      ["What operations restore the properties after insertion?", ["Sorting", "Recolouring and rotations", "Rebuilding the tree", "Deleting the root"], 1],
    ],
    tasks: [
      c("Red-Black - Is RB?", "1-rb_tree_is_valid.c", RB_H,
        "<p>Using the struct in the header, write <code>rb_tree_node</code> (allocate a node) and <code>int rb_tree_is_valid(const rb_tree_t *tree);</code> returning 1 if the tree is a valid red-black tree (BST ordering, colours are RED/BLACK, black root, no red node with a red child, same black height on every path), 0 otherwise. NULL is not valid.</p>",
        "#include <stdlib.h>\n#include \"rb_trees.h\"\n\n/* rb_tree_node and rb_tree_is_valid here */\n",
        "#include <stdlib.h>\n#include <limits.h>\n#include \"rb_trees.h\"\n\n" + RB_NODE + "\n/**\n * black_height - checks a subtree\n * @t: subtree\n * @lo: lower bound (exclusive)\n * @hi: upper bound (exclusive)\n *\n * Return: black height, or -1 if invalid\n */\nint black_height(const rb_tree_t *t, long lo, long hi)\n{\n\tint l, r;\n\n\tif (t == NULL)\n\t\treturn (1);\n\tif (t->n <= lo || t->n >= hi || (t->color != RED && t->color != BLACK))\n\t\treturn (-1);\n\tif (t->color == RED && ((t->left && t->left->color == RED) || (t->right && t->right->color == RED)))\n\t\treturn (-1);\n\tl = black_height(t->left, lo, t->n);\n\tr = black_height(t->right, t->n, hi);\n\tif (l == -1 || r == -1 || l != r)\n\t\treturn (-1);\n\treturn (l + (t->color == BLACK));\n}\n\n/**\n * rb_tree_is_valid - validates a red-black tree\n * @tree: root\n *\n * Return: 1 if valid, 0 otherwise\n */\nint rb_tree_is_valid(const rb_tree_t *tree)\n{\n\tif (tree == NULL || tree->color != BLACK)\n\t\treturn (0);\n\treturn (black_height(tree, (long)INT_MIN - 1, (long)INT_MAX + 1) != -1);\n}\n",
        [{ main: "int main(void)\n{\n\trb_tree_t *root;\n\n\troot = rb_tree_node(NULL, 98, BLACK);\n\troot->left = rb_tree_node(root, 90, RED);\n\troot->right = rb_tree_node(root, 120, RED);\n\troot->left->left = rb_tree_node(root->left, 79, BLACK);\n\troot->left->right = rb_tree_node(root->left, 95, BLACK);\n\troot->right->left = rb_tree_node(root->right, 110, BLACK);\n\troot->right->right = rb_tree_node(root->right, 130, BLACK);\n\tprintf(\"%d\\n\", rb_tree_is_valid(root));\n\troot->right->right->color = RED;\n\tprintf(\"%d\\n\", rb_tree_is_valid(root));\n\troot->right->right->color = BLACK;\n\troot->right->left->n = 99;\n\tprintf(\"%d\\n\", rb_tree_is_valid(root));\n\troot->right->left->n = 110;\n\troot->color = RED;\n\tprintf(\"%d\\n\", rb_tree_is_valid(root));\n\tprintf(\"%d\\n\", rb_tree_is_valid(NULL));\n\treturn (0);\n}\n", out: "1\n0\n1\n0\n0\n" }], { noPutchar: true }),
    ],
    manual: ["Implement insert (with rotations and recolouring), array_to_rb_tree, and remove"],
  };
  EX["sa-01"] = {
    quiz: [
      ["What's the space complexity of an adjacency matrix for V vertices?", ["O(V)", "O(V²)", "O(E)", "O(V + E)"], 1],
      ["Which data structure does BFS use?", ["A stack", "A queue", "A heap", "A tree"], 1],
      ["Which traversal finds the shortest path (fewest edges) in an unweighted graph?", ["DFS", "BFS", "Inorder", "Random walk"], 1],
    ],
    tasks: [
      c("Reachable vertices (DFS)", "dfs_count.c", "int dfs_count(const int *adj, int n, int start);\n",
        "<p>Write <code>int dfs_count(const int *adj, int n, int start);</code>. <code>adj</code> is an n×n adjacency matrix stored row by row (<code>adj[i * n + j]</code> is 1 if there's an edge i → j). Return the number of vertices reachable from <code>start</code> (including start) using a depth-first search. n ≤ 64.</p>",
        "/**\n * dfs_count - counts reachable vertices\n * @adj: adjacency matrix (n x n, row major)\n * @n: number of vertices\n * @start: start vertex\n *\n * Return: number of reachable vertices\n */\nint dfs_count(const int *adj, int n, int start)\n{\n\n}\n",
        "/**\n * dfs - marks reachable vertices\n * @adj: adjacency matrix\n * @n: size\n * @v: current vertex\n * @seen: visited flags\n *\n * Return: number newly visited\n */\nint dfs(const int *adj, int n, int v, char *seen)\n{\n\tint j, count = 1;\n\n\tseen[v] = 1;\n\tfor (j = 0; j < n; j++)\n\t\tif (adj[v * n + j] && !seen[j])\n\t\t\tcount += dfs(adj, n, j, seen);\n\treturn (count);\n}\n\n/**\n * dfs_count - counts reachable vertices\n * @adj: adjacency matrix (n x n, row major)\n * @n: number of vertices\n * @start: start vertex\n *\n * Return: number of reachable vertices\n */\nint dfs_count(const int *adj, int n, int start)\n{\n\tchar seen[64] = {0};\n\n\treturn (dfs(adj, n, start, seen));\n}\n",
        [{ main: "int main(void)\n{\n\tint g[5 * 5] = {0};\n\n\tg[0 * 5 + 1] = 1;\n\tg[1 * 5 + 2] = 1;\n\tg[2 * 5 + 0] = 1;\n\tg[3 * 5 + 4] = 1;\n\tprintf(\"%d %d %d %d\\n\", dfs_count(g, 5, 0), dfs_count(g, 5, 3), dfs_count(g, 5, 4), dfs_count(g, 5, 2));\n\treturn (0);\n}\n", out: "3 2 1 3\n" }], { noPutchar: true }),
    ],
    manual: ["Implement the ALX graph structure: graph_create, graph_add_vertex, graph_add_edge, graph_delete, depth_first_traverse, breadth_first_traverse"],
  };
  EX["sa-02"] = {
    quiz: [
      ["In a min-heap stored in an array, where are the children of index i?", ["i+1 and i+2", "2i+1 and 2i+2", "i/2", "2i and 2i-1"], 1],
      ["What's the cost of inserting into a binary heap?", ["O(1)", "O(log n)", "O(n)", "O(n log n)"], 1],
      ["How does Huffman coding build its tree?", ["Alphabetically", "Repeatedly merging the two least frequent nodes", "By depth", "Randomly"], 1],
    ],
    tasks: [
      c("Min-heap push and pop", "heap.c", "void heap_push(int *heap, int *size, int value);\nint heap_pop(int *heap, int *size);\n",
        "<p>Implement a min-heap stored in an array: <code>void heap_push(int *heap, int *size, int value);</code> (insert and sift up) and <code>int heap_pop(int *heap, int *size);</code> (remove and return the minimum, then sift down). <code>*size</code> is the number of elements.</p>",
        "/**\n * heap_push - inserts into a min-heap\n * @heap: array\n * @size: number of elements\n * @value: value to insert\n */\nvoid heap_push(int *heap, int *size, int value)\n{\n\n}\n",
        "/**\n * heap_push - inserts into a min-heap\n * @heap: array\n * @size: number of elements\n * @value: value to insert\n */\nvoid heap_push(int *heap, int *size, int value)\n{\n\tint i = (*size)++, p, t;\n\n\theap[i] = value;\n\twhile (i > 0)\n\t{\n\t\tp = (i - 1) / 2;\n\t\tif (heap[p] <= heap[i])\n\t\t\tbreak;\n\t\tt = heap[p];\n\t\theap[p] = heap[i];\n\t\theap[i] = t;\n\t\ti = p;\n\t}\n}\n\n/**\n * heap_pop - removes the minimum of a min-heap\n * @heap: array\n * @size: number of elements\n *\n * Return: the minimum\n */\nint heap_pop(int *heap, int *size)\n{\n\tint min = heap[0], i = 0, c, t;\n\n\theap[0] = heap[--(*size)];\n\twhile (1)\n\t{\n\t\tc = 2 * i + 1;\n\t\tif (c >= *size)\n\t\t\tbreak;\n\t\tif (c + 1 < *size && heap[c + 1] < heap[c])\n\t\t\tc++;\n\t\tif (heap[i] <= heap[c])\n\t\t\tbreak;\n\t\tt = heap[i];\n\t\theap[i] = heap[c];\n\t\theap[c] = t;\n\t\ti = c;\n\t}\n\treturn (min);\n}\n",
        [{ main: "int main(void)\n{\n\tint h[32], size = 0, i;\n\tint v[] = {98, 402, -3, 7, 1024, 0, 7, 42};\n\n\tfor (i = 0; i < 8; i++)\n\t\theap_push(h, &size, v[i]);\n\tprintf(\"min=%d size=%d\\n\", h[0], size);\n\twhile (size)\n\t\tprintf(\"%d \", heap_pop(h, &size));\n\tprintf(\"\\n\");\n\treturn (0);\n}\n", out: "min=-3 size=8\n-3 0 7 7 42 98 402 1024 \n" }], { noPutchar: true }),
    ],
    manual: ["Build the generic binary heap, the priority queue of symbols, the Huffman tree and codes, then a file compressor"],
  };
  EX["sa-03"] = {
    quiz: [
      ["What is backtracking?", ["Undoing git commits", "Exploring choices recursively and undoing them when they lead to a dead end", "Sorting in reverse", "A greedy algorithm"], 1],
      ["Dijkstra's algorithm doesn't work with…", ["Directed graphs", "Negative edge weights", "Cycles", "Large graphs"], 1],
      ["What does A* add to Dijkstra?", ["Negative weights", "A heuristic estimating the remaining distance, to explore promising nodes first", "Random choices", "Nothing"], 1],
    ],
    tasks: [
      c("Backtracking: is there a path?", "backtracking.c", "int path_exists(char **map, int rows, int cols, int x, int y, int tx, int ty);\n",
        "<p>Write <code>int path_exists(char **map, int rows, int cols, int x, int y, int tx, int ty);</code>. <code>map[y][x]</code> is <code>'0'</code> for a free cell and <code>'1'</code> for a wall. Starting at (x, y), moving right, down, left or up, return 1 if (tx, ty) can be reached and 0 otherwise. Use backtracking: mark cells as visited (you may modify the map, e.g. set them to <code>'2'</code>).</p>",
        "/**\n * path_exists - backtracking search in a grid\n * @map: grid of '0' (free) and '1' (wall)\n * @rows: number of rows\n * @cols: number of columns\n * @x: current column\n * @y: current row\n * @tx: target column\n * @ty: target row\n *\n * Return: 1 if reachable, 0 otherwise\n */\nint path_exists(char **map, int rows, int cols, int x, int y, int tx, int ty)\n{\n\n}\n",
        "/**\n * path_exists - backtracking search in a grid\n * @map: grid of '0' (free) and '1' (wall)\n * @rows: number of rows\n * @cols: number of columns\n * @x: current column\n * @y: current row\n * @tx: target column\n * @ty: target row\n *\n * Return: 1 if reachable, 0 otherwise\n */\nint path_exists(char **map, int rows, int cols, int x, int y, int tx, int ty)\n{\n\tif (x < 0 || y < 0 || x >= cols || y >= rows || map[y][x] != '0')\n\t\treturn (0);\n\tif (x == tx && y == ty)\n\t\treturn (1);\n\tmap[y][x] = '2';\n\treturn (path_exists(map, rows, cols, x + 1, y, tx, ty) ||\n\t\tpath_exists(map, rows, cols, x, y + 1, tx, ty) ||\n\t\tpath_exists(map, rows, cols, x - 1, y, tx, ty) ||\n\t\tpath_exists(map, rows, cols, x, y - 1, tx, ty));\n}\n",
        [{ main: "int main(void)\n{\n\tchar r0[] = \"0010\", r1[] = \"0110\", r2[] = \"0000\", r3[] = \"1110\";\n\tchar w0[] = \"0010\", w1[] = \"0110\", w2[] = \"1100\", w3[] = \"1110\";\n\tchar *a[4], *b[4];\n\n\ta[0] = r0;\n\ta[1] = r1;\n\ta[2] = r2;\n\ta[3] = r3;\n\tb[0] = w0;\n\tb[1] = w1;\n\tb[2] = w2;\n\tb[3] = w3;\n\tprintf(\"%d\\n\", path_exists(a, 4, 4, 0, 0, 3, 3));\n\tprintf(\"%d\\n\", path_exists(b, 4, 4, 0, 0, 3, 3));\n\treturn (0);\n}\n", out: "1\n0\n" }], { noPutchar: true }),
    ],
    manual: ["Implement backtracking_array, backtracking_graph, dijkstra_graph and a_star_graph with the ALX graph structures"],
  };
  quizOnly("sa-04", [["What's an N-ary tree?", ["A tree with at most 2 children", "A tree where each node can have any number of children", "A sorted array", "A heap"], 1], ["How do you usually store children in C?", ["A fixed array of 2", "A linked list via first_child / next sibling pointers", "A hash table", "A string"], 1], ["What's the diameter of a tree?", ["Its height", "The number of nodes on the longest path between any two nodes", "Its number of leaves", "Its width"], 1]], ["Implement nary_tree_insert, nary_tree_delete, nary_tree_traverse, nary_tree_diameter and path_exists"]);
})();
