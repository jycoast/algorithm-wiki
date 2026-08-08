/**
 * Java 判题 harness（CheerpJ）。
 *
 * 流程（两个 cheerpjRunMain 步骤，参考 SimpleJavaRunner 的显式 javac 调用）：
 *   A. 编译 Main.java + SolutionStub（空的 class Solution {}，让 Main 能通过编译）
 *   B. 运行 Main：内部先用 com.sun.tools.javac.Main.compile 编译用户 /str/Solution.java
 *      （System.out/err 已重定向），失败则写 compile-error 标记 + 错误文本；
 *      成功则逐用例调用 sol.<entry>(*args)，把用户 print 写入 /files/stdout.txt、
 *      判题结果 JSON 写入 /files/result.json。
 * JS 端用 cjFileBlob 读回这两个文件。
 *
 * 判题结果不经过 stdout，用户 System.out 独立收集，避免污染结果解析。
 */

import { compareOutput } from './compare.ts'
import type { RunReport, TestCase } from './types.ts'
import { getCheerpJ, type CheerpJLike } from './cheerpjLoader.ts'

const IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/
const STUB = 'class Solution {}\n'

/** 把 JS 字符串转成 Java 字符串字面量源码（引号/反斜杠/换行转义） */
function javaEsc(s: string): string {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '') + '"'
}

/** 把 testcase 的 input 元素序列化为 Java 字面量表达式 */
function toJavaLiteral(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return String(v)
  if (typeof v === 'string') return javaEsc(v)
  if (Array.isArray(v)) {
    if (v.length === 0) return 'new Object[]{}'
    const elems = v.map(toJavaLiteral).join(', ')
    if (v.every((x) => typeof x === 'number' && Number.isInteger(x))) return `new int[]{${elems}}`
    if (v.every((x) => typeof x === 'number')) return `new double[]{${elems}}`
    if (v.every((x) => typeof x === 'string')) return `new String[]{${elems}}`
    if (v.every((x) => typeof x === 'boolean')) return `new boolean[]{${elems}}`
    return `new Object[]{${elems}}`
  }
  return 'null'
}

/** 数组输入 → Java 数组类型名（用于 void 模式声明被原地修改的数组） */
function javaArrayType(v: unknown[]): string {
  if (v.every((x) => typeof x === 'number' && Number.isInteger(x))) return 'int[]'
  if (v.every((x) => typeof x === 'number')) return 'double[]'
  if (v.every((x) => typeof x === 'string')) return 'String[]'
  if (v.every((x) => typeof x === 'boolean')) return 'boolean[]'
  return 'Object[]'
}

/** 单个用例的 try/catch 代码块 */
function caseBlock(entry: string, tc: TestCase, mode: 'void-first-arg' | undefined): string {
  const args = tc.input.map(toJavaLiteral).join(', ')
  let call: string
  let capture: string
  if (mode === 'void-first-arg') {
    // 原地修改类题目（如 moveZeroes）：把第一个数组参数声明成变量，判它修改后的值
    const first = tc.input[0]
    if (Array.isArray(first)) {
      const rest = tc.input.slice(1).map(toJavaLiteral).join(', ')
      const callArgs = '__a0' + (rest ? ', ' + rest : '')
      const type = javaArrayType(first)
      call = `            ${type} __a0 = ${toJavaLiteral(first)};\n            sol.${entry}(${callArgs});`
      capture = `            __res.add("{\\"actual\\":" + Main.json(__a0) + "}");`
    } else {
      call = `            sol.${entry}(${args});`
      capture = `            __res.add("{\\"actual\\":null});`
    }
  } else {
    call = `            Object __r = sol.${entry}(${args});`
    capture = `            __res.add("{\\"actual\\":" + Main.json(__r) + "}");`
  }
  return [
    '        try {',
    call,
    capture,
    '        } catch (Throwable __e) {',
    '            __res.add("{\\"error\\":" + Main.jstr(String.valueOf(__e)) + "}");',
    '        }',
  ].join('\n')
}

export function buildJavaMain(entry: string, testcases: TestCase[], mode: 'void-first-arg' | undefined): string {
  const jstrReplace =
    `s.replace(${javaEsc('\\')}, ${javaEsc('\\\\')}).replace(${javaEsc('"')}, ${javaEsc('\\"')})`

  const skeleton = `import java.io.*;
import java.util.*;

public class Main {

    static String jstr(String s) {
        if (s == null) return "null";
        return ${javaEsc('"')} + ${jstrReplace} + ${javaEsc('"')};
    }

    static String json(Object o) {
        if (o == null) return "null";
        if (o instanceof int[]) { int[] a = (int[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof long[]) { long[] a = (long[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof double[]) { double[] a = (double[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof boolean[]) { boolean[] a = (boolean[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); } return b.append(']').toString(); }
        if (o instanceof char[]) { char[] a = (char[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(jstr(String.valueOf(a[i]))); } return b.append(']').toString(); }
        if (o instanceof String[]) { String[] a = (String[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(json(a[i])); } return b.append(']').toString(); }
        if (o instanceof Object[]) { Object[] a = (Object[]) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(json(a[i])); } return b.append(']').toString(); }
        if (o instanceof List<?>) { List<?> l = (List<?>) o; StringBuilder b = new StringBuilder("["); for (int i = 0; i < l.size(); i++) { if (i > 0) b.append(','); b.append(json(l.get(i))); } return b.append(']').toString(); }
        if (o instanceof Map<?, ?>) { Map<?, ?> m = (Map<?, ?>) o; StringBuilder b = new StringBuilder("{"); boolean f = true; for (Map.Entry<?, ?> e : m.entrySet()) { if (!f) b.append(','); f = false; b.append(jstr(String.valueOf(e.getKey()))).append(':').append(json(e.getValue())); } return b.append('}').toString(); }
        if (o instanceof Boolean) return o.toString();
        if (o instanceof Number) return o.toString();
        if (o instanceof Character) return jstr(String.valueOf(o));
        if (o instanceof String) return jstr((String) o);
        return jstr(String.valueOf(o));
    }

    static void write(String path, String content) throws Exception {
        try (PrintWriter w = new PrintWriter(new OutputStreamWriter(new FileOutputStream(path), "UTF-8"))) {
            w.print(content);
        }
    }

    public static void main(String[] args) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintStream ps = new PrintStream(baos, true, "UTF-8");
        PrintStream oout = System.out;
        PrintStream oerr = System.err;
        System.setOut(ps);
        System.setErr(ps);

        int c = com.sun.tools.javac.Main.compile(new String[] {"-encoding", "UTF-8", "-d", "/files/", "/str/Solution.java"});
        if (c != 0) {
            String errs = baos.toString("UTF-8");
            System.setOut(oout);
            System.setErr(oerr);
            write("/files/stdout.txt", errs);
            write("/files/compile-error", "1");
            return;
        }

        Solution sol = new Solution();
        List<String> __res = new ArrayList<String>();

__CASES__

        System.setOut(oout);
        System.setErr(oerr);

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < __res.size(); i++) { if (i > 0) sb.append(','); sb.append(__res.get(i)); }
        sb.append(']');
        write("/files/result.json", sb.toString());
        write("/files/stdout.txt", baos.toString("UTF-8"));
        System.out.println(sb.toString());
    }
}
`
  const cases = testcases.map((tc) => caseBlock(entry, tc, mode)).join('\n\n')
  return skeleton.replace('__CASES__', cases)
}

/** 从 CheerpJ 虚拟文件系统读文件；不存在则返回 null */
async function readFile(cj: CheerpJLike, path: string): Promise<string | null> {
  try {
    const blob = await cj.cjFileBlob(path)
    return await blob.text()
  } catch {
    return null
  }
}

export async function runJava(
  code: string,
  entry: string,
  testcases: TestCase[],
  mode?: 'void-first-arg',
): Promise<RunReport> {
  const total = testcases.length
  if (!IDENT.test(entry)) {
    return { results: [], passed: 0, total, compileError: `非法的入口方法名：${entry}` }
  }
  if (!testcases.length) {
    return { results: [], passed: 0, total: 0 }
  }

  let cj: CheerpJLike
  try {
    cj = await getCheerpJ()
  } catch (e) {
    return { results: [], passed: 0, total, compileError: `加载 Java 运行时失败：${(e as Error).message}` }
  }

  const CP = '/app/tools.jar:/files/'
  cj.cheerpOSAddStringFile('/str/Solution.java', code)
  cj.cheerpOSAddStringFile('/str/SolutionStub.java', STUB)
  cj.cheerpOSAddStringFile('/str/Main.java', buildJavaMain(entry, testcases, mode))

  // A. 编译 Main.java + 空 Solution 桩（让 Main 通过编译）
  let exitA: number
  try {
    exitA = await cj.cheerpjRunMain(
      'com.sun.tools.javac.Main',
      CP,
      '/str/SolutionStub.java',
      '/str/Main.java',
      '-d',
      '/files/',
    )
  } catch (e) {
    return { results: [], passed: 0, total, compileError: `CheerpJ 执行失败：${(e as Error).message}` }
  }
  if (exitA !== 0) {
    return { results: [], passed: 0, total, compileError: '判题框架生成失败（内部错误），请反馈给站点维护者' }
  }

  // B. 运行 Main：内部编译用户 Solution 并逐用例判题
  try {
    await cj.cheerpjRunMain('Main', CP)
  } catch (e) {
    return { results: [], passed: 0, total, compileError: `运行失败：${(e as Error).message}` }
  }

  // 编译错误：compile-error 标记存在 → stdout.txt 即 javac 错误文本
  const compileError = await readFile(cj, '/files/compile-error')
  if (compileError !== null) {
    const errs = (await readFile(cj, '/files/stdout.txt')) ?? '编译失败'
    return { results: [], passed: 0, total, compileError: errs }
  }

  const resultRaw = await readFile(cj, '/files/result.json')
  if (resultRaw === null) {
    return { results: [], passed: 0, total, compileError: '判题未产生结果（内部错误）' }
  }

  let items: Array<{ actual?: unknown; error?: string }>
  try {
    items = JSON.parse(resultRaw) as Array<{ actual?: unknown; error?: string }>
  } catch {
    return { results: [], passed: 0, total, compileError: '判题结果解析失败（内部错误）' }
  }

  const results = items.map((item, i) => {
    const base = { index: i + 1, expected: testcases[i]?.output }
    if (item.error) return { ...base, ok: false, error: item.error }
    return { ...base, ok: compareOutput(item.actual, testcases[i]?.output), actual: item.actual }
  })
  const passed = results.filter((r) => r.ok).length

  const report: RunReport = { results, passed, total: results.length }
  const stdout = (await readFile(cj, '/files/stdout.txt'))?.trim()
  if (stdout) report.stdout = stdout
  return report
}
