---
comments: true
difficulty: 中等

tags:
    - 深度优先搜索
    - 广度优先搜索
    - 并查集
    - 数组
    - 矩阵
---

<script setup>
// 方法一（Flood fill / DFS）可视化：3×3 网格，2 个岛屿
// grid: 1=陆地，0=水；DFS 每访问一格即置 '0'；格内 vN 为全局访问顺序，dfs 指针指向当前递归栈顶
const islandDfsSteps = [
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        note: "初始网格（1=陆地，0=水）。外层循环从 (0,0) 扫描，遇到 grid[0][0]=='1'，岛屿数 ans 从 0 记为 1，调用 dfs(0,0)。",
    },
    {
        grid: { values: [[0, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }],
        gridPointers: [{ r: 0, c: 0, label: 'dfs' }],
        note: "dfs(0,0)（访问序 v1）：先将 grid[0][0] 置 '0'（标记已访问）。按 dirs=[-1,0,1,0,-1]（上右下左）依次检查邻居。",
    },
    {
        grid: { values: [[0, 0, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }],
        gridPointers: [{ r: 0, c: 1, label: 'dfs' }],
        note: "dfs(0,0) 检查右邻 grid[0][1]=='1'，递归 dfs(0,1)（访问序 v2），将 grid[0][1] 置 '0'。",
    },
    {
        grid: { values: [[0, 0, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }],
        note: "dfs(0,1)：四个邻居（上越界、grid[0][2]=0、grid[1][1]=0、grid[0][0]=0）均非陆地，回溯到 dfs(0,0)。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }],
        gridPointers: [{ r: 1, c: 0, label: 'dfs' }],
        note: "dfs(0,0) 继续检查下邻 grid[1][0]=='1'，递归 dfs(1,0)（访问序 v3），将 grid[1][0] 置 '0'。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }],
        note: "dfs(1,0)：邻居（grid[0][0]、grid[1][1] 为 0，其余越界）均非陆地，回溯。第 1 个岛屿（左上 3 格）遍历完成，dfs(0,0) 返回。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 2, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 2, text: 'v4' }],
        gridPointers: [{ r: 1, c: 2, label: 'dfs' }],
        note: "继续外层扫描，跳过已置 '0' 的格子。扫描到 grid[1][2]=='1'，岛屿数 ans 增至 2，调用 dfs(1,2)（访问序 v4）。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 2, c: 2, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 2, text: 'v4' }, { r: 2, c: 2, text: 'v5' }],
        gridPointers: [{ r: 2, c: 2, label: 'dfs' }],
        note: "dfs(1,2)（访问序 v4）检查下邻 grid[2][2]=='1'，递归 dfs(2,2)（访问序 v5），将 grid[2][2] 置 '0'。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 1, 0]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 2, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 1, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 2, text: 'v4' }, { r: 2, c: 2, text: 'v5' }, { r: 2, c: 1, text: 'v6' }],
        gridPointers: [{ r: 2, c: 1, label: 'dfs' }],
        note: "dfs(2,2) 检查左邻 grid[2][1]=='1'，递归 dfs(2,1)（访问序 v6），将 grid[2][1] 置 '0'。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' },
            { r: 1, c: 2, state: 'done' }, { r: 2, c: 2, state: 'done' }, { r: 2, c: 1, state: 'done' },
        ],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 2, text: 'v4' }, { r: 2, c: 2, text: 'v5' }, { r: 2, c: 1, text: 'v6' }],
        note: "dfs(2,1)：邻居均非陆地，回溯。第 2 个岛屿（右下 3 格）遍历完成。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' },
            { r: 1, c: 2, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' },
        ],
        note: "外层扫描结束。共有 2 个岛屿：左上 {(0,0),(0,1),(1,0)} 与右下 {(1,2),(2,1),(2,2)}，返回 ans=2 ✅。",
    },
]
// 方法二（BFS）可视化：3×3 网格，2 个岛屿
// q 为队列，p 指向当前出队元素；格内 vN 为全局访问顺序
const islandBfsSteps = [
    {
        grid: { values: [[1, 1, 0], [1, 1, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        note: "初始网格（1=陆地，0=水）。外层扫描到 grid[0][0]=='1'，岛屿数 ans 记为 1，调用 bfs(0,0)。",
    },
    {
        grid: { values: [[0, 1, 0], [1, 1, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }],
        gridPointers: [{ r: 0, c: 0, label: 'q' }],
        note: "bfs(0,0)：将 grid[0][0] 置 '0' 并加入队列 q=[[0,0]]，作为本岛屿的起点（图中 q 指向队内起点）。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 1, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'cur' }, { r: 1, c: 0, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }],
        gridPointers: [{ r: 0, c: 0, label: 'p' }],
        note: "出队 q 头部 (0,0)（访问序 v1，p 指向当前出队元素）。检查四邻：grid[0][1] 与 grid[1][0] 为陆地，置 '0' 并入队，q=[[0,1],[1,0]]。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 1, text: 'v4' }],
        gridPointers: [{ r: 0, c: 1, label: 'p' }],
        note: "出队 (0,1)（访问序 v2）。其下邻 grid[1][1] 为陆地，置 '0' 并入队，q=[[1,0],[1,1]]。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 1, text: 'v4' }],
        gridPointers: [{ r: 1, c: 0, label: 'p' }],
        note: "出队 (1,0)（访问序 v3）。四个邻居均已访问或越界，无新入队，q=[[1,1]]。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 1, text: 'v4' }],
        gridPointers: [{ r: 1, c: 1, label: 'p' }],
        note: "出队 (1,1)（访问序 v4）。邻居均非陆地，q 变空。第 1 个岛屿（左上 2×2）遍历完成。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 1, text: 'v4' }, { r: 2, c: 2, text: 'v5' }],
        note: "继续外层扫描，跳过已访问格子。扫描到 grid[2][2]=='1'，岛屿数 ans 增至 2，调用 bfs(2,2)（访问序 v5）。",
    },
    {
        grid: { values: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: 'v1' }, { r: 0, c: 1, text: 'v2' }, { r: 1, c: 0, text: 'v3' }, { r: 1, c: 1, text: 'v4' }, { r: 2, c: 2, text: 'v5' }],
        gridPointers: [{ r: 2, c: 2, label: 'p' }],
        note: "bfs(2,2)（访问序 v5）：置 grid[2][2]='0' 并入队后出队，四个邻居均非陆地，q 变空。第 2 个岛屿只有 1 格。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 1, 0], [0, 0, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 1, state: 'done' },
            { r: 2, c: 2, state: 'done' },
        ],
        note: "扫描结束。共 2 个岛屿：左上 2×2 连通块 {(0,0),(0,1),(1,0),(1,1)} 与右下单格 {(2,2)}，返回 ans=2 ✅。",
    },
]
// 方法三（并查集）可视化：3×3 网格，2 个岛屿
// 格内数字为该格所属集合的根编号；dirs=[1,0,1] 只检查「下方」「右方」邻居
const islandUnionSteps = [
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }],
        note: "并查集初始化：p[i]=i，每个陆地格子自成一个集合。为每个格子编号 id=i*3+j（如 (0,1)→1、(1,2)→5）。扫描时只检查「下方」与「右方」邻居（dirs=[1,0,1]），避免重复合并。从 (0,0) 开始。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'cur' }, { r: 1, c: 0, state: 'hl' }],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '1' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '5' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '8' }],
        note: "处理 (0,0)：下方 grid[1][0]=='1'，合并 union(3, 0)：p[find(3)]=find(0)，即 p[3]=0。(1,0) 的根更新为 0（与 (0,0) 同属一个集合）。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'hl' }, { r: 1, c: 0, state: 'done' }],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '0' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '5' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '8' }],
        note: "继续处理 (0,0) 的右邻 grid[0][1]=='1'，union(1, 0)：p[find(1)]=find(0)，即 p[1]=0。左上 3 格 (0,0),(0,1),(1,0) 同属根 0。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [{ r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'cur' }],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '0' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '5' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '8' }],
        note: "处理 (0,1) 与 (1,0)：其下方/右方邻居 grid[1][1]=0、grid[0][2]=0、grid[2][0]=0 均非陆地，无需合并。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' },
            { r: 1, c: 2, state: 'cur' }, { r: 2, c: 2, state: 'hl' },
        ],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '0' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '5' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '5' }],
        note: "处理 (1,2)：下方 grid[2][2]=='1'，union(8, 5)：p[find(8)]=find(5)，即 p[8]=5。(2,2) 并入根 5。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 2, state: 'done' },
            { r: 2, c: 1, state: 'cur' }, { r: 2, c: 2, state: 'hl' },
        ],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '0' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '7' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '7' }],
        note: "处理 (2,1)：右方 grid[2][2]=='1'，union(8, 7)：find(8)=5（经路径压缩），故 p[5]=find(7)=7。右下 3 格 (1,2),(2,1),(2,2) 同属根 7。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'mark' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' }, { r: 1, c: 2, state: 'done' },
            { r: 2, c: 1, state: 'mark' }, { r: 2, c: 2, state: 'done' },
        ],
        gridTexts: [{ r: 0, c: 0, text: '0' }, { r: 0, c: 1, text: '0' }, { r: 1, c: 0, text: '0' }, { r: 1, c: 2, text: '7' }, { r: 2, c: 1, text: '7' }, { r: 2, c: 2, text: '7' }],
        note: "统计阶段：遍历陆地格子，统计满足 find(id)==id 的根。find(0)=0 → (0,0) 是根，ans 计 1；(0,1)、(1,0) 根为 0；(1,2)、(2,2) 根为 7；find(7)=7 → (2,1) 是根，ans 计 2。故 ans=2。",
    },
    {
        grid: { values: [[1, 1, 0], [1, 0, 1], [0, 1, 1]], rowLabels: ['0', '1', '2'], colLabels: ['0', '1', '2'] },
        gridStates: [
            { r: 0, c: 0, state: 'done' }, { r: 0, c: 1, state: 'done' }, { r: 1, c: 0, state: 'done' },
            { r: 1, c: 2, state: 'done' }, { r: 2, c: 1, state: 'done' }, { r: 2, c: 2, state: 'done' },
        ],
        note: "最终答案：网格中岛屿数量为 2，即并查集中根节点的个数 ✅。",
    },
]
</script>

<!-- problem:start -->

# [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands)

## 题目描述

<!-- description:start -->

<p>给你一个由 <code>'1'</code>（陆地）和 <code>'0'</code>（水）组成的的二维网格，请你计算网格中岛屿的数量。</p>

<p>岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。</p>

<p>此外，你可以假设该网格的四条边均被水包围。</p>

<p> </p>

<p><strong>示例 1：</strong></p>

<pre>
<strong>输入：</strong>grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
<strong>输出：</strong>1
</pre>

<p><strong>示例 2：</strong></p>

<pre>
<strong>输入：</strong>grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
<strong>输出：</strong>3
</pre>

<p> </p>

<p><strong>提示：</strong></p>

<ul>
	<li><code>m == grid.length</code></li>
	<li><code>n == grid[i].length</code></li>
	<li><code>1 <= m, n <= 300</code></li>
	<li><code>grid[i][j]</code> 的值为 <code>'0'</code> 或 <code>'1'</code></li>
</ul>

<!-- description:end -->



<!-- solution:start -->

## 方法一：Flood fill 算法

Flood fill 算法是从一个区域中提取若干个连通的点与其他相邻区域区分开（或分别染成不同颜色）的经典算法。因为其思路类似洪水从一个区域扩散到所有能到达的区域而得名。

最简单的实现方法是采用 DFS 的递归方法，也可以采用 BFS 的迭代来实现。

时间复杂度 $O(m\times n)$，空间复杂度 $O(m\times n)$。其中 $m$ 和 $n$ 分别为网格的行数和列数。

### 可视化演示

> 以 `grid = [[1,1,0],[1,0,1],[0,1,1]]` 为例，演示 DFS（深度优先搜索）Flood fill 遍历：遇到陆地 `1` 即递归访问并置 `0`。蓝色为当前递归格，绿色为已访问，格内 `vN` 为全局访问顺序，`dfs` 指针指向当前递归栈顶。点击 ▶ 播放，或逐步操作。

<DpViz :steps="islandDfsSteps" />

<div class="viz-jump"><a href="#code-1">跳过可视化，直接看代码 ↓</a></div>

<a id="code-1"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private char[][] grid;
    private int m;
    private int n;

    public int numIslands(char[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    dfs(i, j);
                    ++ans;
                }
            }
        }
        return ans;
    }

    private void dfs(int i, int j) {
        grid[i][j] = '0';
        int[] dirs = {-1, 0, 1, 0, -1};
        for (int k = 0; k < 4; ++k) {
            int x = i + dirs[k];
            int y = j + dirs[k + 1];
            if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == '1') {
                dfs(x, y);
            }
        }
    }
}
```



```cpp [C++]
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        int ans = 0;
        int dirs[5] = {-1, 0, 1, 0, -1};
        function<void(int, int)> dfs = [&](int i, int j) {
            grid[i][j] = '0';
            for (int k = 0; k < 4; ++k) {
                int x = i + dirs[k], y = j + dirs[k + 1];
                if (x >= 0 && x < grid.size() && y >= 0 && y < grid[0].size() && grid[x][y] == '1') {
                    dfs(x, y);
                }
            }
        };
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    dfs(i, j);
                    ++ans;
                }
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function numIslands(grid: string[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    let ans = 0;
    const dfs = (i: number, j: number) => {
        if (grid[i]?.[j] !== '1') {
            return;
        }
        grid[i][j] = '0';
        dfs(i + 1, j);
        dfs(i - 1, j);
        dfs(i, j + 1);
        dfs(i, j - 1);
    };
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            if (grid[i][j] === '1') {
                dfs(i, j);
                ++ans;
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        def dfs(i, j):
            grid[i][j] = '0'
            for a, b in pairwise(dirs):
                x, y = i + a, j + b
                if 0 <= x < m and 0 <= y < n and grid[x][y] == '1':
                    dfs(x, y)

        ans = 0
        dirs = (-1, 0, 1, 0, -1)
        m, n = len(grid), len(grid[0])
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    dfs(i, j)
                    ans += 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法二：广度优先搜索

我们也可以用广度优先搜索（BFS）来遍历岛屿。

遍历整个网格，当遇到一个值为 `1` 的格子时，说明发现了一个新的岛屿，答案加 `1`。然后用队列 `q` 进行广度优先搜索：先将当前格子置为 `0`（标记为已访问）并入队，再从队首出队一个格子，检查其上、下、左、右四个方向（`dirs` 数组）的邻居，若为 `1` 则同样置 `0` 并入队。直到队列为空，这一整片岛屿的所有格子就都被标记为已访问。

时间复杂度 $O(m \times n)$，其中 $m$ 和 $n$ 分别为网格的行数和列数。每个格子至多入队、出队一次。空间复杂度 $O(m \times n)$，队列最坏情况下容纳整个岛屿。

### 可视化演示

> 以 `grid = [[1,1,0],[1,1,0],[0,0,1]]` 为例，演示 BFS（广度优先搜索）遍历岛屿：`q` 为队列，`p` 指向当前出队的元素，蓝色为当前处理，绿色为已访问，格内 `vN` 为全局访问顺序。点击 ▶ 播放，或逐步操作。

<DpViz :steps="islandBfsSteps" />

<div class="viz-jump"><a href="#code-2">跳过可视化，直接看代码 ↓</a></div>

<a id="code-2"></a>

<!-- tabs:start -->
::: code-group


```java [Java]
class Solution {
    private char[][] grid;
    private int m;
    private int n;

    public int numIslands(char[][] grid) {
        m = grid.length;
        n = grid[0].length;
        this.grid = grid;
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    bfs(i, j);
                    ++ans;
                }
            }
        }
        return ans;
    }

    private void bfs(int i, int j) {
        grid[i][j] = '0';
        Deque<int[]> q = new ArrayDeque<>();
        q.offer(new int[] {i, j});
        int[] dirs = {-1, 0, 1, 0, -1};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            for (int k = 0; k < 4; ++k) {
                int x = p[0] + dirs[k];
                int y = p[1] + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == '1') {
                    q.offer(new int[] {x, y});
                    grid[x][y] = '0';
                }
            }
        }
    }
}
```



```cpp [C++]
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        int ans = 0;
        int dirs[5] = {-1, 0, 1, 0, -1};
        function<void(int, int)> bfs = [&](int i, int j) {
            grid[i][j] = '0';
            queue<pair<int, int>> q;
            q.push({i, j});
            vector<int> dirs = {-1, 0, 1, 0, -1};
            while (!q.empty()) {
                auto [a, b] = q.front();
                q.pop();
                for (int k = 0; k < 4; ++k) {
                    int x = a + dirs[k];
                    int y = b + dirs[k + 1];
                    if (x >= 0 && x < grid.size() && y >= 0 && y < grid[0].size() && grid[x][y] == '1') {
                        q.push({x, y});
                        grid[x][y] = '0';
                    }
                }
            }
        };
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    bfs(i, j);
                    ++ans;
                }
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function numIslands(grid: string[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    let ans = 0;
    function bfs(i, j) {
        grid[i][j] = '0';
        let q = [[i, j]];
        const dirs = [-1, 0, 1, 0, -1];
        while (q.length) {
            [i, j] = q.shift();
            for (let k = 0; k < 4; ++k) {
                const x = i + dirs[k];
                const y = j + dirs[k + 1];
                if (x >= 0 && x < m && y >= 0 && y < n && grid[x][y] == '1') {
                    q.push([x, y]);
                    grid[x][y] = '0';
                }
            }
        }
    }
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            if (grid[i][j] == '1') {
                bfs(i, j);
                ++ans;
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        def bfs(i, j):
            grid[i][j] = '0'
            q = deque([(i, j)])
            while q:
                i, j = q.popleft()
                for a, b in pairwise(dirs):
                    x, y = i + a, j + b
                    if 0 <= x < m and 0 <= y < n and grid[x][y] == '1':
                        q.append((x, y))
                        grid[x][y] = 0

        ans = 0
        dirs = (-1, 0, 1, 0, -1)
        m, n = len(grid), len(grid[0])
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    bfs(i, j)
                    ans += 1
        return ans
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- solution:start -->

## 方法三

### 可视化演示

> 以 `grid = [[1,1,0],[1,0,1],[0,1,1]]` 为例，演示并查集合并过程：格内数字为该格所属集合的根编号（`id = i*3+j`），蓝色为当前处理，黄色为被合并的邻居，绿色为已合并，红色为集合根节点（用于统计答案）。点击 ▶ 播放，或逐步操作。

<DpViz :steps="islandUnionSteps" />

<div class="viz-jump"><a href="#code-3">跳过可视化，直接看代码 ↓</a></div>

<a id="code-3"></a>

<!-- tabs:start -->
::: code-group

```java [Java]
class Solution {
    private int[] p;

    public int numIslands(char[][] grid) {
        int m = grid.length;
        int n = grid[0].length;
        p = new int[m * n];
        for (int i = 0; i < p.length; ++i) {
            p[i] = i;
        }
        int[] dirs = {1, 0, 1};
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    for (int k = 0; k < 2; ++k) {
                        int x = i + dirs[k];
                        int y = j + dirs[k + 1];
                        if (x < m && y < n && grid[x][y] == '1') {
                            p[find(x * n + y)] = find(i * n + j);
                        }
                    }
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1' && i * n + j == find(i * n + j)) {
                    ++ans;
                }
            }
        }
        return ans;
    }

    private int find(int x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
}
```

```cpp [C++]
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        vector<int> p(m * n);
        iota(p.begin(), p.end(), 0);
        function<int(int)> find = [&](int x) -> int {
            if (p[x] != x) {
                p[x] = find(p[x]);
            }
            return p[x];
        };
        int dirs[3] = {1, 0, 1};
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    for (int k = 0; k < 2; ++k) {
                        int x = i + dirs[k];
                        int y = j + dirs[k + 1];
                        if (x < m && y < n && grid[x][y] == '1') {
                            p[find(x * n + y)] = find(i * n + j);
                        }
                    }
                }
            }
        }
        int ans = 0;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                ans += grid[i][j] == '1' && i * n + j == find(i * n + j);
            }
        }
        return ans;
    }
};
```

```ts [TypeScript]
function numIslands(grid: string[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    let p = [];
    for (let i = 0; i < m * n; ++i) {
        p.push(i);
    }
    function find(x) {
        if (p[x] != x) {
            p[x] = find(p[x]);
        }
        return p[x];
    }
    const dirs = [1, 0, 1];
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            if (grid[i][j] == '1') {
                for (let k = 0; k < 2; ++k) {
                    const x = i + dirs[k];
                    const y = j + dirs[k + 1];
                    if (x < m && y < n && grid[x][y] == '1') {
                        p[find(i * n + j)] = find(x * n + y);
                    }
                }
            }
        }
    }
    let ans = 0;
    for (let i = 0; i < m; ++i) {
        for (let j = 0; j < n; ++j) {
            if (grid[i][j] == '1' && i * n + j == find(i * n + j)) {
                ++ans;
            }
        }
    }
    return ans;
}
```

```python [Python]
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        def find(x):
            if p[x] != x:
                p[x] = find(p[x])
            return p[x]

        dirs = (0, 1, 0)
        m, n = len(grid), len(grid[0])
        p = list(range(m * n))
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    for a, b in pairwise(dirs):
                        x, y = i + a, j + b
                        if x < m and y < n and grid[x][y] == '1':
                            p[find(i * n + j)] = find(x * n + y)
        return sum(
            grid[i][j] == '1' and i * n + j == find(i * n + j)
            for i in range(m)
            for j in range(n)
        )
```

:::
<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->