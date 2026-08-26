---
comments: true
difficulty: 中等
tags:
  - 字符串
  - 回溯
entry: restoreIpAddresses
testcases:
  - input:
      - '25525511135'
    output:
      - 255.255.11.135
      - 255.255.111.35
  - input:
      - '0000'
    output:
      - 0.0.0.0
  - input:
      - '101023'
    output:
      - 1.0.10.23
      - 1.0.102.3
      - 10.1.0.23
      - 10.10.2.3
      - 101.0.2.3
---


<script setup>
// 方法一（DFS）可视化：s="12345"
// rows 两行：row0=s 的字符，row1=t（已切分的 IP 段）
const restoreIp1Steps = [
  { rows: [['1', '2', '3', '4', '5'], []], rowPointers: [{ row: 0, col: 0, label: 'i' }, { row: 0, col: 0, label: 'j' }], note: 's="12345"，n=5。调用 dfs(0)：从第 i 位开始切分 IP 的下一段，每段取 1~3 位。' },
  { rows: [['1', '2', '3', '4', '5'], ['1']], rowPointers: [{ row: 0, col: 0, label: 'i' }, { row: 0, col: 0, label: 'j' }], rowHighlight: [{ row: 0, cols: [0] }, { row: 1, cols: [0] }], note: 'j=0：x=1（≤255），切出第 1 段 "1"，t=["1"]，递归 dfs(1)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2']], rowPointers: [{ row: 0, col: 1, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 0, cols: [1] }, { row: 1, cols: [1] }], note: 'dfs(1)：i=1，j=1，x=2，切出第 2 段 "2"，t=["1","2"]，递归 dfs(2)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 0, cols: [2] }, { row: 1, cols: [2] }], note: 'dfs(2)：i=2，j=2，x=3，切出第 3 段 "3"，t=["1","2","3"]，递归 dfs(3)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3', '4']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [3] }], note: 'dfs(3)：i=3，j=3，x=4，切出第 4 段 "4"，t=["1","2","3","4"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3', '4']], note: 'dfs(4)：i=4 < n=5 但 t.size()=4 ≥ 4，无法继续切分，return（回溯）。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3', '45']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [3, 4] }, { row: 1, cols: [3] }], note: '回到 dfs(3)：撤销 "4"，j=4，x=45（≤255），切出第 4 段 "45"，t=["1","2","3","45"]，递归 dfs(5)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3', '45']], rowHighlight: [{ row: 1, cols: [0, 1, 2, 3] }], note: 'dfs(5)：i=5 ≥ n 且 t.size()=4，拼出 "1.2.3.45" 加入 ans。ans=["1.2.3.45"]。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '3']], note: '回溯：撤销 "45" → t=["1","2","3"]，dfs(3) 循环结束，回到 dfs(2)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '34']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [2, 3] }, { row: 1, cols: [2] }], note: 'dfs(2)：撤销 "3"，j=3，x=34（≤255），切出第 3 段 "34"，t=["1","2","34"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2', '34', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [3] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 4 段 "5"，t=["1","2","34","5"]，dfs(5)：记录 "1.2.34.5"。ans 增为 2 个。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '2']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 4, label: 'j' }], note: '回溯：撤销 "5"、"34" → t=["1","2"]。dfs(2)：j=4，x=34*10+5=345 > 255，break 剪枝。dfs(2) 结束，回到 dfs(1)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '23']], rowPointers: [{ row: 0, col: 1, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 0, cols: [1, 2] }, { row: 1, cols: [1] }], note: 'dfs(1)：撤销 "2"，j=2，x=23（≤255），切出第 2 段 "23"，t=["1","23"]，递归 dfs(3)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '23', '4']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [2] }], note: 'dfs(3)：i=3，j=3，x=4，切出第 3 段 "4"，t=["1","23","4"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '23', '4', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [3] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 4 段 "5"，t=["1","23","4","5"]，dfs(5)：记录 "1.23.4.5"。ans 增为 3 个。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '23', '4']], note: '回溯：撤销 "5" → t=["1","23","4"]，dfs(4) 结束，回到 dfs(3)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '23', '45']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [3, 4] }, { row: 1, cols: [2] }], note: 'dfs(3)：j=4，x=45，切出第 3 段 "45"，t=["1","23","45"]，dfs(5)：i=5≥n 但只有 3 段（≠4），return。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '234']], rowPointers: [{ row: 0, col: 1, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [1, 2, 3] }, { row: 1, cols: [1] }], note: '回溯：撤销 "45"、"23" → t=["1"]。dfs(1)：j=3，x=234（≤255），切出第 2 段 "234"，t=["1","234"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['1', '234', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [2] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 3 段 "5"，t=["1","234","5"]，dfs(5)：只有 3 段，return。' },
  { rows: [['1', '2', '3', '4', '5'], ['12']], rowPointers: [{ row: 0, col: 0, label: 'i' }, { row: 0, col: 1, label: 'j' }], rowHighlight: [{ row: 0, cols: [0, 1] }, { row: 1, cols: [0] }], note: '回溯：撤销 "5"、"234"、"1" → t=[]，dfs(1) 结束，回到 dfs(0)。j=1，x=12，切出第 1 段 "12"，t=["12"]，递归 dfs(2)。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '3']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 0, cols: [2] }, { row: 1, cols: [1] }], note: 'dfs(2)：i=2，j=2，x=3，切出第 2 段 "3"，t=["12","3"]，递归 dfs(3)。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '3', '4']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [2] }], note: 'dfs(3)：i=3，j=3，x=4，切出第 3 段 "4"，t=["12","3","4"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '3', '4', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [3] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 4 段 "5"，t=["12","3","4","5"]，dfs(5)：记录 "12.3.4.5"。ans 增为 4 个。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '3', '45']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [3, 4] }, { row: 1, cols: [2] }], note: '回溯：撤销 "5"、"4" → t=["12","3"]。dfs(3)：j=4，x=45，切出第 3 段 "45"，dfs(5)：3 段 return。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '34']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [2, 3] }, { row: 1, cols: [1] }], note: '回溯：撤销 "45"、"3" → t=["12"]。dfs(2)：j=3，x=34，切出第 2 段 "34"，t=["12","34"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['12', '34', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [2] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 3 段 "5"，dfs(5)：3 段 return。' },
  { rows: [['1', '2', '3', '4', '5'], ['12']], rowPointers: [{ row: 0, col: 2, label: 'i' }, { row: 0, col: 4, label: 'j' }], note: '回溯：撤销 "5"、"34" → t=["12"]。dfs(2)：j=4，x=345 > 255，break 剪枝。dfs(2) 结束。' },
  { rows: [['1', '2', '3', '4', '5'], ['123']], rowPointers: [{ row: 0, col: 0, label: 'i' }, { row: 0, col: 2, label: 'j' }], rowHighlight: [{ row: 0, cols: [0, 1, 2] }, { row: 1, cols: [0] }], note: '回到 dfs(0)：撤销 "12" → t=[]。j=2，x=123（≤255），切出第 1 段 "123"，t=["123"]，递归 dfs(3)。' },
  { rows: [['1', '2', '3', '4', '5'], ['123', '4']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 3, label: 'j' }], rowHighlight: [{ row: 0, cols: [3] }, { row: 1, cols: [1] }], note: 'dfs(3)：i=3，j=3，x=4，切出第 2 段 "4"，t=["123","4"]，递归 dfs(4)。' },
  { rows: [['1', '2', '3', '4', '5'], ['123', '4', '5']], rowPointers: [{ row: 0, col: 4, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [4] }, { row: 1, cols: [2] }], note: 'dfs(4)：i=4，j=4，x=5，切出第 3 段 "5"，dfs(5)：只有 3 段，return。' },
  { rows: [['1', '2', '3', '4', '5'], ['123', '45']], rowPointers: [{ row: 0, col: 3, label: 'i' }, { row: 0, col: 4, label: 'j' }], rowHighlight: [{ row: 0, cols: [3, 4] }, { row: 1, cols: [1] }], note: '回溯：撤销 "5"、"4" → t=["123"]。dfs(3)：j=4，x=45，切出第 2 段 "45"，dfs(5)：2 段 return。' },
  { rows: [['1', '2', '3', '4', '5'], []], note: '回溯：撤销 "45"、"123" → t=[]，dfs(0) 遍历完毕。有效 IP 共 4 个：["1.2.3.45","1.2.34.5","1.23.4.5","12.3.4.5"] ✅。' },
]

// 方法二（回溯法，直接插入逗点）可视化：s="12345"
// 用单数组展示当前字符串 s（含 "."），指针 startIndex/i 指向当前检查的位置
const restoreIp2Steps = [
  { array: ['1', '2', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 0 }, { label: 'i', index: 0 }], note: 's="12345"，pointNum=0。调用 dfs(s, 0, 0)：若 pointNum==3 检查第 4 段；否则在 startIndex 处枚举第 1 段的结束位置 i，插入 "."。' },
  { array: ['1', '.', '2', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 2 }, { label: 'i', index: 2 }], highlight: [1], note: 'i=0：check(0,0)，段 "1"=1≤255 合法。在 i=0 后插入 "." → s="1.2345"，pointNum=1，递归 dfs(s, 2, 1)。' },
  { array: ['1', '.', '2', '.', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 4 }, { label: 'i', index: 4 }], highlight: [3], note: 'dfs(s,2,1)：i=2，段 "2"=2 合法。插入 "." → s="1.2.345"，pointNum=2，递归 dfs(s, 4, 2)。' },
  { array: ['1', '.', '2', '.', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 6 }, { label: 'i', index: 6 }], highlight: [5], note: 'dfs(s,4,2)：i=4，段 "3"=3 合法。插入 "." → s="1.2.3.45"，pointNum=3，递归 dfs(s, 6, 3)。' },
  { array: ['1', '.', '2', '.', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 6 }], highlight: [6, 7], note: 'dfs(s,6,3)：pointNum=3，检查最后一段 s[6..7]="45"，45≤255 合法 → ans.add("1.2.3.45")。' },
  { array: ['1', '.', '2', '.', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 4 }, { label: 'i', index: 5 }], note: '回溯：pointNum-- → 2，删除 "." → s="1.2.345"，回到 dfs(s,4,2) 的循环，i=5。' },
  { array: ['1', '.', '2', '.', '3', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }, { label: 'i', index: 7 }], highlight: [6], note: 'i=5：check(4,5)，段 "34"=34 合法。插入 "." → s="1.2.34.5"，pointNum=3，递归 dfs(s, 7, 3)。' },
  { array: ['1', '.', '2', '.', '3', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }], highlight: [7], note: 'dfs(s,7,3)：最后一段 s[7]="5"，5≤255 合法 → ans.add("1.2.34.5")。' },
  { array: ['1', '.', '2', '.', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 4 }, { label: 'i', index: 6 }], note: '回溯 → s="1.2.345"，pointNum=2。i=6：check(4,6)，段 "345"=345 > 255，break 剪枝。dfs(s,4,2) 结束。' },
  { array: ['1', '.', '2', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 5 }, { label: 'i', index: 5 }], highlight: [3], note: '回到 dfs("1.2345",2,1)：删除点 → s="1.2345"，pointNum=1。i=3：段 "23"=23 合法。插入 "." → s="1.23.45"，pointNum=2，递归 dfs(s, 5, 2)。' },
  { array: ['1', '.', '2', '3', '.', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }, { label: 'i', index: 7 }], highlight: [6], note: 'dfs(s,5,2)：i=5，段 "4"=4 合法。插入 "." → s="1.23.4.5"，pointNum=3，递归 dfs(s, 7, 3)。' },
  { array: ['1', '.', '2', '3', '.', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }], highlight: [7], note: 'dfs(s,7,3)：最后一段 s[7]="5"，5≤255 合法 → ans.add("1.23.4.5")。' },
  { array: ['1', '.', '2', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }, { label: 'i', index: 8 }], highlight: [7], note: '回溯 → s="1.23.45"，pointNum=2。i=6：段 "45"=45 合法。插入 "." → s="1.23.45."，pointNum=3，递归 dfs(s, 8, 3)。' },
  { array: ['1', '.', '2', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }], note: 'dfs(s,8,3)：startIndex=8 > s.length()-1=7，最后一段为空，check 返回 false，不记录。' },
  { array: ['1', '.', '2', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 5 }, { label: 'i', index: 7 }], note: '回溯 → s="1.23.45"，pointNum=2。i=7：段 "45." 含非数字，check false，break。dfs(s,5,2) 结束。' },
  { array: ['1', '2', '.', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 3 }, { label: 'i', index: 3 }], highlight: [2], note: '回到 dfs("12345",0,0)：中间层 dfs("1.2345",2,1) 剩余分支（"1.234.5" 无法凑足 4 段、"2345">255）均无结果，回溯删除点 → s="12345"，pointNum=0。i=1：段 "12"=12 合法，插入 "." → s="12.345"，pointNum=1，递归 dfs(s, 3, 1)。' },
  { array: ['1', '2', '.', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 5 }, { label: 'i', index: 5 }], highlight: [4], note: 'dfs(s,3,1)：i=3，段 "3"=3 合法。插入 "." → s="12.3.45"，pointNum=2，递归 dfs(s, 5, 2)。' },
  { array: ['1', '2', '.', '3', '.', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }, { label: 'i', index: 7 }], highlight: [6], note: 'dfs(s,5,2)：i=5，段 "4"=4 合法。插入 "." → s="12.3.4.5"，pointNum=3，递归 dfs(s, 7, 3)。' },
  { array: ['1', '2', '.', '3', '.', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 7 }], highlight: [7], note: 'dfs(s,7,3)：最后一段 s[7]="5"，5≤255 合法 → ans.add("12.3.4.5")。' },
  { array: ['1', '2', '.', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }, { label: 'i', index: 8 }], highlight: [7], note: '回溯 → s="12.3.45"，pointNum=2。i=6：段 "45"=45 合法。插入 "." → s="12.3.45."，pointNum=3，递归 dfs(s, 8, 3)。' },
  { array: ['1', '2', '.', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }], note: 'dfs(s,8,3)：最后一段为空，check false，不记录。' },
  { array: ['1', '2', '.', '3', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 6 }, { label: 'i', index: 6 }], highlight: [5], note: '回溯 → s="12.345"，pointNum=1。i=4：段 "34"=34 合法。插入 "." → s="12.34.5"，pointNum=2，递归 dfs(s, 6, 2)。' },
  { array: ['1', '2', '.', '3', '4', '.', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }, { label: 'i', index: 8 }], highlight: [7], note: 'dfs(s,6,2)：i=6，段 "5"=5 合法。插入 "." → s="12.34.5."，pointNum=3，递归 dfs(s, 8, 3)。' },
  { array: ['1', '2', '.', '3', '4', '.', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }], note: 'dfs(s,8,3)：最后一段为空，check false，不记录。' },
  { array: ['1', '2', '.', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 3 }, { label: 'i', index: 5 }], note: '回溯 → s="12.345"，pointNum=1。i=5：段 "345"=345 > 255，break。dfs(s,3,1) 结束，回到 dfs("12345",0,0)。' },
  { array: ['1', '2', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 4 }, { label: 'i', index: 4 }], highlight: [3], note: '回到 dfs("12345",0,0)：删除点 → s="12345"，pointNum=0。i=2：段 "123"=123 合法。插入 "." → s="123.45"，pointNum=1，递归 dfs(s, 4, 1)。' },
  { array: ['1', '2', '3', '.', '4', '.', '5'], pointers: [{ label: 'startIndex', index: 6 }, { label: 'i', index: 6 }], highlight: [5], note: 'dfs(s,4,1)：i=4，段 "4"=4 合法。插入 "." → s="123.4.5"，pointNum=2，递归 dfs(s, 6, 2)。' },
  { array: ['1', '2', '3', '.', '4', '.', '5', '.'], pointers: [{ label: 'startIndex', index: 8 }, { label: 'i', index: 8 }], highlight: [7], note: 'dfs(s,6,2)：i=6，段 "5"=5 合法。插入 "." → s="123.4.5."，pointNum=3，递归 dfs(s, 8, 3)：最后一段为空，不记录。' },
  { array: ['1', '2', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 7 }, { label: 'i', index: 7 }], highlight: [6], note: '回溯 → s="123.45"，pointNum=1。i=5：段 "45"=45 合法。插入 "." → s="123.45."，pointNum=2，递归 dfs(s, 7, 2)。' },
  { array: ['1', '2', '3', '.', '4', '5', '.'], pointers: [{ label: 'startIndex', index: 7 }], note: 'dfs(s,7,2)：pointNum=2（还没到 3），但 startIndex=7 = s.length，循环不执行，return。' },
  { array: ['1', '2', '3', '.', '4', '5'], pointers: [{ label: 'startIndex', index: 4 }, { label: 'i', index: 6 }], note: '回溯 → s="123.45"，pointNum=1。i=6：段 "45." 含 "."，check false，break。dfs(s,4,1) 结束。' },
  { array: ['1', '2', '3', '4', '5'], pointers: [{ label: 'startIndex', index: 0 }, { label: 'i', index: 3 }], note: '回到 dfs("12345",0,0)：删除点 → s="12345"，pointNum=0。i=3：段 "1234"=1234 > 255，break。全部遍历完毕 ✅。' },
  { array: ['1', '2', '3', '4', '5'], note: '得到全部有效 IP：["1.2.3.45","1.2.34.5","1.23.4.5","12.3.4.5"] ✅。' },
]
</script>

<!-- problem:start -->

# [93. 复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses)

## 题目描述

<!-- description:start -->

<p><strong>有效 IP 地址</strong> 正好由四个整数（每个整数位于 <code>0</code> 到 <code>255</code> 之间组成，且不能含有前导 <code>0</code>），整数之间用 <code>'.'</code> 分隔。</p>

<ul>
	<li>例如：<code>"0.1.2.201"</code> 和<code> "192.168.1.1"</code> 是 <strong>有效</strong> IP 地址，但是 <code>"0.011.255.245"</code>、<code>"192.168.1.312"</code> 和 <code>"192.168@1.1"</code> 是 <strong>无效</strong> IP 地址。</li>
</ul>

<p>给定一个只包含数字的字符串 <code>s</code> ，用以表示一个 IP 地址，返回所有可能的<strong>有效 IP 地址</strong>，这些地址可以通过在 <code>s</code> 中插入&nbsp;<code>'.'</code> 来形成。你 <strong>不能</strong>&nbsp;重新排序或删除 <code>s</code> 中的任何数字。你可以按 <strong>任何</strong> 顺序返回答案。</p>

<p>&nbsp;</p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>s = "25525511135"
<strong>输出：</strong>["255.255.11.135","255.255.111.35"]
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>s = "0000"
<strong>输出：</strong>["0.0.0.0"]
</pre>

<p><strong>示例 3：</strong></p>

<pre>
<strong>输入：</strong>s = "101023"
<strong>输出：</strong>["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
</pre>

<p>&nbsp;</p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>1 &lt;= s.length &lt;= 20</code></li>
	<li><code>s</code> 仅由数字组成</li>
</ul>

<!-- description:end -->

<!-- solution:start -->

## 方法一：DFS

我们定义一个函数 $dfs(i)$，表示从字符串 $s$ 的第 $i$ 位开始，搜索能够组成的 IP 地址列表。

函数 $dfs(i)$ 的执行步骤如下：

如果 $i$ 大于等于字符串 $s$ 的长度，说明已经完成了四段 IP 地址的拼接，判断是否满足四段 IP 地址的要求，如果满足则将当前 $IP$ 加入答案。

如果 $i$ 小于字符串 $s$ 的长度，此时还需要拼接 $IP$ 地址的一段，此时需要确定这一段 $IP$ 地址的值。如果该值大于 $255$，或者当前位置 $i$ 为 $0$ 且 $i$ 之后的若干位的数值大于 $0$，则说明不满足要求，直接返回。否则，将其加入 $IP$ 地址列表，并继续搜索下一段 $IP$ 地址。

时间复杂度 $O(n \times 3^4)$，空间复杂度 $O(n)$。其中 $n$ 为字符串 $s$ 的长度。

### 可视化演示

> 以 `s = "12345"` 为例，用两行展示字符串 `s` 的字符与已切分的 IP 段 `t`。指针 `i`/`j` 表示当前切分段在 `s` 中的起止下标；黄色高亮表示正在切分的字符或刚加入 `t` 的段。

<ArrayViz :steps="restoreIp1Steps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>
<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int n;
    private String s;
    private List<String> ans = new ArrayList<>();
    private List<String> t = new ArrayList<>();

    public List<String> restoreIpAddresses(String s) {
        n = s.length();
        this.s = s;
        dfs(0);
        return ans;
    }

    private void dfs(int i) {
        if (i >= n && t.size() == 4) {
            ans.add(String.join(".", t));
            return;
        }
        if (i >= n || t.size() >= 4) {
            return;
        }
        int x = 0;
        for (int j = i; j < Math.min(i + 3, n); ++j) {
            x = x * 10 + s.charAt(j) - '0';
            if (x > 255 || (s.charAt(i) == '0' && i != j)) {
                break;
            }
            t.add(s.substring(i, j + 1));
            dfs(j + 1);
            t.remove(t.size() - 1);
        }
    }
}
```

```cpp [C++]
class Solution {
public:
    vector<string> restoreIpAddresses(string s) {
        int n = s.size();
        vector<string> ans;
        vector<string> t;
        function<void(int)> dfs = [&](int i) {
            if (i >= n && t.size() == 4) {
                ans.push_back(t[0] + "." + t[1] + "." + t[2] + "." + t[3]);
                return;
            }
            if (i >= n || t.size() >= 4) {
                return;
            }
            int x = 0;
            for (int j = i; j < min(n, i + 3); ++j) {
                x = x * 10 + s[j] - '0';
                if (x > 255 || (j > i && s[i] == '0')) {
                    break;
                }
                t.push_back(s.substr(i, j - i + 1));
                dfs(j + 1);
                t.pop_back();
            }
        };
        dfs(0);
        return ans;
    }
};
```

```ts [TypeScript]
function restoreIpAddresses(s: string): string[] {
    const n = s.length;
    const ans: string[] = [];
    const t: string[] = [];
    const dfs = (i: number): void => {
        if (i >= n && t.length === 4) {
            ans.push(t.join('.'));
            return;
        }
        if (i >= n || t.length === 4) {
            return;
        }
        let x = 0;
        for (let j = i; j < i + 3 && j < n; ++j) {
            x = x * 10 + s[j].charCodeAt(0) - '0'.charCodeAt(0);
            if (x > 255 || (j > i && s[i] === '0')) {
                break;
            }
            t.push(x.toString());
            dfs(j + 1);
            t.pop();
        }
    };
    dfs(0);
    return ans;
}
```

```python [Python]
class Solution:
    def restoreIpAddresses(self, s: str) -> List[str]:
        def check(i: int, j: int) -> int:
            if s[i] == "0" and i != j:
                return False
            return 0 <= int(s[i : j + 1]) <= 255

        def dfs(i: int):
            if i >= n and len(t) == 4:
                ans.append(".".join(t))
                return
            if i >= n or len(t) >= 4:
                return
            for j in range(i, min(i + 3, n)):
                if check(i, j):
                    t.append(s[i : j + 1])
                    dfs(j + 1)
                    t.pop()

        n = len(s)
        ans = []
        t = []
        dfs(0)
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

## 方法二：回溯法

本题和 [131.分割回文串](https://leetcode.cn/problems/palindrome-partitioning/) 的解法类似。

### 可视化演示

> 以 `s = "12345"` 为例，用单数组展示当前字符串 `s`（已插入的 `.` 也会显示），指针 `startIndex`/`i` 指向当前检查的位置。黄色高亮表示刚插入的 `.` 或正在检查的段。

<ArrayViz :steps="restoreIp2Steps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>
::: code-group

```java [Java]
class Solution {

    private List<List<String>> ans = new ArrayList<>();

    private List<String> path = new ArrayList<>();

    public List<List<String>> partition(String s) {
        dfs(s, 0);
        return ans;
    }

    private void dfs(String s, int startIndex) {
        if (startIndex >= s.length()) {
            ans.add(new ArrayList<>(path));
            return;
        }

        for (int i = startIndex; i < s.length(); i++) {
            if (check(s, startIndex, i)) {
                String str = s.substring(startIndex, i + 1);
                path.add(str);
                dfs(s, i + 1);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean check(String s, int start, int end) {
        while (start < end) {
            if (s.charAt(start) != s.charAt(end)) {
                return false;
            }
            start++;
            end--;
        }
        return true;
    }
}
```

:::

本题的解法：

::: code-group

```java [Java]
class Solution {

    private List<String> ans = new ArrayList<>();

    public List<String> restoreIpAddresses(String s) {
        dfs(s, 0, 0);
        return ans;
    }

    private void dfs(String s, int startIndex, int pointNum) {
        if (pointNum == 3) {
            // 检查第四段是否合法
            if (check(s, startIndex, s.length() - 1)) {
                ans.add(s);
            }
            return;
        }

        for (int i = startIndex; i < s.length(); i++) {
            if (!check(s, startIndex, i)) {
                break;
            }
            // 在str的后⾯插⼊⼀个逗点
            s = s.substring(0, i + 1) + "." + s.substring(i + 1);
            pointNum++;
            dfs(s, i + 2, pointNum);
            pointNum--;
            // 回溯删掉逗点
            s = s.substring(0, i + 1) + s.substring(i + 2);
        }
    }

    private boolean check(String s, int start, int end) {
        if (start > end) {
            return false;
        }
        if (s.charAt(start) == '0' && start != end) { // 0开头的数字不合法
            return false;
        }
        int num = 0;
        for (int i = start; i <= end; i++) {
            if (s.charAt(i) > '9' || s.charAt(i) < '0') { // 遇到⾮数字字符不合法
                return false;
            }
            num = num * 10 + (s.charAt(i) - '0');
            if (num > 255) { // 如果⼤于255了不合法
                return false;
            }
        }
        return true;
    }
}
```

:::

<!-- problem:end -->