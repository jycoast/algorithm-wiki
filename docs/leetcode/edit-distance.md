---
comments: true
difficulty: 中等
tags:
  - 字符串
  - 动态规划
entry: minDistance
testcases:
  - input:
      - horse
      - ros
    output: 3
  - input:
      - intention
      - execution
    output: 5
---


<script setup>
// 方法一（动态规划）可视化：word1 = "horse"，word2 = "ros"
// f[i][j] 表示将 word1 前 i 个字符转为 word2 前 j 个字符的最少操作数
// 行标题 = word1 字符（h/o/r/s/e），列标题 = word2 字符（r/o/s）
// 空串：f[0][j] = j（第 0 行），f[i][0] = i（第 0 列）
const editDistanceSteps = [
  { grid: { values: [[0, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'cur' }], note: '初始化：f[0][0] = 0（空串转空串，0 次操作）。第 0 行表示 word2 为空，第 0 列表示 word1 为空。' },
  { grid: { values: [[0, 1, 2, 3], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 0, c: 2, state: 'cur' }, { r: 0, c: 3, state: 'cur' }], note: '第 0 行：f[0][j] = j。将空串转为 "r"、"ro"、"ros" 分别需要 1、2、3 次插入。' },
  { grid: { values: [[0, 1, 2, 3], [1, null, null, null], [2, null, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'cur' }, { r: 2, c: 0, state: 'cur' }, { r: 3, c: 0, state: 'cur' }, { r: 4, c: 0, state: 'cur' }, { r: 5, c: 0, state: 'cur' }], note: '第 0 列：f[i][0] = i。将 "h"、"ho"、…、"horse" 转为空串分别需要 1、2、3、4、5 次删除。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, null, null], [2, null, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'cur' }], note: 'f[1][1]：word1[0]="h" ≠ word2[0]="r"。f[1][1] = min(f[0][1], f[1][0], f[0][0]) + 1 = min(1, 1, 0) + 1 = 1（把 h 替换为 r）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, null], [2, null, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'cur' }], note: 'f[1][2]：word1[0]="h" ≠ word2[1]="o"。f[1][2] = min(f[0][2], f[1][1], f[0][1]) + 1 = min(2, 1, 1) + 1 = 2（"h"→"ro"：先插 r 再插 o，或 h→r 替换再插 o）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, null, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'cur' }], note: 'f[1][3]：word1[0]="h" ≠ word2[2]="s"。f[1][3] = min(f[0][3], f[1][2], f[0][2]) + 1 = min(3, 2, 2) + 1 = 3。第 1 行完成（仅看 word1 第一个字符 "h" 的情况）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, null, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'cur' }], note: 'f[2][1]：word1[1]="o" ≠ word2[0]="r"。f[2][1] = min(f[1][1], f[2][0], f[1][0]) + 1 = min(1, 2, 1) + 1 = 2（"ho"→"r"：删 o 得 "h"，再把 h→r）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, null], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'cur' }], note: 'f[2][2]：word1[1]="o" = word2[1]="o"，相等！f[2][2] = f[1][1] = 1（"ho"→"ro"：h→r 替换，o 匹配）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, null, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'cur' }], note: 'f[2][3]：word1[1]="o" ≠ word2[2]="s"。f[2][3] = min(f[1][3], f[2][2], f[1][2]) + 1 = min(3, 1, 2) + 1 = 2（"ho"→"ros"：h→r 替换、o 匹配、插入 s）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, null, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'cur' }], note: 'f[3][1]：word1[2]="r" = word2[0]="r"，相等！f[3][1] = f[2][0] = 2（"hor"→"r"：删 h、删 o，r 匹配）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, null], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'cur' }], note: 'f[3][2]：word1[2]="r" ≠ word2[1]="o"。f[3][2] = min(f[2][2], f[3][1], f[2][1]) + 1 = min(1, 2, 2) + 1 = 2（"hor"→"ro"：h→r 替换、o 匹配、删 r）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, null, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'cur' }], note: 'f[3][3]：word1[2]="r" ≠ word2[2]="s"。f[3][3] = min(f[2][3], f[3][2], f[2][2]) + 1 = min(2, 2, 1) + 1 = 2（"hor"→"ros"：h→r 替换、o 匹配、r→s 替换）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, null, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'cur' }], note: 'f[4][1]：word1[3]="s" ≠ word2[0]="r"。f[4][1] = min(f[3][1], f[4][0], f[3][0]) + 1 = min(2, 4, 3) + 1 = 3。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, null], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'cur' }], note: 'f[4][2]：word1[3]="s" ≠ word2[1]="o"。f[4][2] = min(f[3][2], f[4][1], f[3][1]) + 1 = min(2, 3, 2) + 1 = 3。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, null, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'cur' }], note: 'f[4][3]：word1[3]="s" = word2[2]="s"，相等！f[4][3] = f[3][2] = 2（"hors"→"ros"：h→r 替换、o 匹配、r→s 替换、s 匹配）。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, 4, null, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 5, c: 1, state: 'cur' }], note: 'f[5][1]：word1[4]="e" ≠ word2[0]="r"。f[5][1] = min(f[4][1], f[5][0], f[4][0]) + 1 = min(3, 5, 4) + 1 = 4。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, 4, 4, null]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 5, c: 1, state: 'done' }, { r: 5, c: 2, state: 'cur' }], note: 'f[5][2]：word1[4]="e" ≠ word2[1]="o"。f[5][2] = min(f[4][2], f[5][1], f[4][1]) + 1 = min(3, 4, 3) + 1 = 4。' },
  { grid: { values: [[0, 1, 2, 3], [1, 1, 2, 3], [2, 2, 1, 2], [3, 2, 2, 2], [4, 3, 3, 2], [5, 4, 4, 3]], rowLabels: ['', 'h', 'o', 'r', 's', 'e'], colLabels: ['', 'r', 'o', 's'] }, gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 0, c: 2, state: 'done' }, { r: 0, c: 3, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 1, c: 3, state: 'done' }, { r: 2, c: 0, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 3, state: 'done' }, { r: 3, c: 0, state: 'done' }, { r: 3, c: 1, state: 'done' }, { r: 3, c: 2, state: 'done' }, { r: 3, c: 3, state: 'done' }, { r: 4, c: 0, state: 'done' }, { r: 4, c: 1, state: 'done' }, { r: 4, c: 2, state: 'done' }, { r: 4, c: 3, state: 'done' }, { r: 5, c: 0, state: 'done' }, { r: 5, c: 1, state: 'done' }, { r: 5, c: 2, state: 'done' }, { r: 5, c: 3, state: 'mark' }], note: 'f[5][3]：word1[4]="e" ≠ word2[2]="s"。f[5][3] = min(f[4][3], f[5][2], f[4][2]) + 1 = min(2, 4, 3) + 1 = 3。答案 f[5][3] = 3 ✅（horse→ros：h→r 替换、o 匹配、r→s 替换、s 匹配、删 e）。' },
]
</script>

<!-- problem:start -->

# [72. 编辑距离](https://leetcode.cn/problems/edit-distance)

## 题目描述

<!-- description:start -->

<p>给你两个单词&nbsp;<code>word1</code> 和&nbsp;<code>word2</code>， <em>请返回将&nbsp;<code>word1</code>&nbsp;转换成&nbsp;<code>word2</code> 所使用的最少操作数</em> &nbsp;。</p>

<p>你可以对一个单词进行如下三种操作：</p>

<ul>
	<li>插入一个字符</li>
	<li>删除一个字符</li>
	<li>替换一个字符</li>
</ul>

<p>&nbsp;</p>

<p><strong>示例&nbsp;1：</strong></p>

<pre>
<strong>输入：</strong>word1 = "horse", word2 = "ros"
<strong>输出：</strong>3
<strong>解释：</strong>
horse -&gt; rorse (将 'h' 替换为 'r')
rorse -&gt; rose (删除 'r')
rose -&gt; ros (删除 'e')
</pre>

<p><strong>示例&nbsp;2：</strong></p>

<pre>
<strong>输入：</strong>word1 = "intention", word2 = "execution"
<strong>输出：</strong>5
<strong>解释：</strong>
intention -&gt; inention (删除 't')
inention -&gt; enention (将 'i' 替换为 'e')
enention -&gt; exention (将 'n' 替换为 'x')
exention -&gt; exection (将 'n' 替换为 'c')
exection -&gt; execution (插入 'u')
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>0 &lt;= word1.length, word2.length &lt;= 500</code></li>
	<li><code>word1</code> 和 <code>word2</code> 由小写英文字母组成</li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：动态规划

我们定义 $f[i][j]$ 表示将 $word1$ 的前 $i$ 个字符转换成 $word2$ 的前 $j$ 个字符所使用的最少操作数。初始时 $f[i][0] = i$, $f[0][j] = j$。其中 $i \in [1, m], j \in [0, n]$。

考虑 $f[i][j]$：

-   如果 $word1[i - 1] = word2[j - 1]$，那么我们只需要考虑将 $word1$ 的前 $i - 1$ 个字符转换成 $word2$ 的前 $j - 1$ 个字符所使用的最少操作数，因此 $f[i][j] = f[i - 1][j - 1]$；
-   否则，我们可以考虑插入、删除、替换操作，那么 $f[i][j] = \min(f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]) + 1$。

综上，我们可以得到状态转移方程：

$$
f[i][j] = \begin{cases}
i, & \textit{if } j = 0 \\
j, & \textit{if } i = 0 \\
f[i - 1][j - 1], & \textit{if } word1[i - 1] = word2[j - 1] \\
\min(f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]) + 1, & \textit{otherwise}
\end{cases}
$$

最后，我们返回 $f[m][n]$ 即可。

时间复杂度 $O(m \times n)$，空间复杂度 $O(m \times n)$。其中 $m$ 和 $n$ 分别是 $word1$ 和 $word2$ 的长度。

### 可视化演示

> 以 `word1 = "horse"`、`word2 = "ros"` 为例，演示动态规划填表：`f[i][j]` 为将 `word1` 前 `i` 个字符转为 `word2` 前 `j` 个字符的最少操作数。字符相等取左上，否则取左、上、左上三者最小值 +1。行标题为 `word1` 字符，列标题为 `word2` 字符，蓝色为当前计算格子，绿色为已完成，红色为最终答案。点击 ▶ 播放，或逐步操作。

<DpViz :steps="editDistanceSteps" />

<div class="viz-jump"><a href="#code">跳过可视化，直接看代码 ↓</a></div>

<a id="code"></a>
<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] f = new int[m + 1][n + 1];
        for (int j = 1; j <= n; ++j) {
            f[0][j] = j;
        }
        for (int i = 1; i <= m; ++i) {
            f[i][0] = i;
            for (int j = 1; j <= n; ++j) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    f[i][j] = f[i - 1][j - 1];
                } else {
                    f[i][j] = Math.min(f[i - 1][j], Math.min(f[i][j - 1], f[i - 1][j - 1])) + 1;
                }
            }
        }
        return f[m][n];
    }
}
```

```cpp [C++]
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        int f[m + 1][n + 1];
        for (int j = 0; j <= n; ++j) {
            f[0][j] = j;
        }
        for (int i = 1; i <= m; ++i) {
            f[i][0] = i;
            for (int j = 1; j <= n; ++j) {
                if (word1[i - 1] == word2[j - 1]) {
                    f[i][j] = f[i - 1][j - 1];
                } else {
                    f[i][j] = min({f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]}) + 1;
                }
            }
        }
        return f[m][n];
    }
};
```

```ts [TypeScript]
function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;
    const f: number[][] = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0));
    for (let j = 1; j <= n; ++j) {
        f[0][j] = j;
    }
    for (let i = 1; i <= m; ++i) {
        f[i][0] = i;
        for (let j = 1; j <= n; ++j) {
            if (word1[i - 1] === word2[j - 1]) {
                f[i][j] = f[i - 1][j - 1];
            } else {
                f[i][j] = Math.min(f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]) + 1;
            }
        }
    }
    return f[m][n];
}
```

```python [Python]
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        f = [[0] * (n + 1) for _ in range(m + 1)]
        for j in range(1, n + 1):
            f[0][j] = j
        for i, a in enumerate(word1, 1):
            f[i][0] = i
            for j, b in enumerate(word2, 1):
                if a == b:
                    f[i][j] = f[i - 1][j - 1]
                else:
                    f[i][j] = min(f[i - 1][j], f[i][j - 1], f[i - 1][j - 1]) + 1
        return f[m][n]
```
:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->