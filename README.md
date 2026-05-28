# 🐷🐟 番茄宠物 (Pomodoro Pet)

可爱的二次元桌面番茄钟 —— 一只猪鱼宠物陪你专注工作！

基于 **Electron + React + TypeScript** 构建的桌面番茄钟应用，拥有粉色系二次元风格的界面和一只可爱的"猪鱼"宠物，让番茄工作法不再枯燥。

## ✨ 特性

- **🍅 番茄工作法计时** — 25 分钟专注 + 5 分钟短休息 + 15 分钟长休息，可自定义时长
- **🐷 桌面宠物** — 一只萌萌的猪鱼在桌面上陪你工作，会根据状态做出不同反应（工作流汗、完成开心、休息打盹）
- **💬 气泡对话** — 宠物会随机和你说话，用可爱的台词给你加油打气
- **🪟 迷你窗口** — 始终置顶的迷你计时器，方便随时查看剩余时间
- **📋 任务管理** — 添加任务、关联番茄、追踪每个任务的完成进度
- **📊 统计面板** — 今日/本周/累计的番茄数量和专注时长可视化
- **🔔 系统通知** — 番茄完成时弹出系统通知提醒
- **🎵 提示音效** — 使用 Web Audio API 合成的完成音效
- **🖥️ 无边框窗口** — 粉色透明圆角窗口，可拖拽、最小化、关闭到托盘

## 📸 界面预览

应用共有三个窗口：

| 窗口 | 说明 |
|------|------|
| **主窗口** (420×680) | 计时器 + 任务 + 统计，四标签切换 |
| **宠物窗口** (180×200) | 桌面宠物悬浮窗，始终置顶 |
| **迷你窗口** (200×80) | 迷你计时条，始终置顶 |

## 🛠️ 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Electron 28 |
| 前端 | React 18 + TypeScript 5 |
| 状态管理 | Zustand 4 |
| 构建 | Vite 5 + vite-plugin-electron |
| 持久化 | electron-store |
| 打包 | electron-builder (NSIS) |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 9+

### 安装

```bash
git clone https://github.com/k0s0k/PigFish_Pomodoro.git
cd PigFish_Pomodoro
npm install
```

### 开发

```bash
# 启动 Vite + Electron 开发模式
npm run electron:dev

# 仅启动 Vite 前端开发服务器
npm run dev
```

### 构建

```bash
# 构建生产版本（输出到 dist/ 和 dist-electron/）
npm run build

# 构建并打包为 Windows 安装包（输出到 release/）
npm run electron:build
```

## 📁 项目结构

```
pomodoro-pet/
├── electron/             # Electron 主进程
│   ├── main.ts           # 窗口管理、IPC、托盘
│   └── preload.ts        # contextBridge 通信桥接
├── src/                  # React 渲染进程
│   ├── main.tsx          # 入口
│   ├── App.tsx           # 根组件，页面路由 + 数据同步
│   ├── components/
│   │   ├── Timer/        # 计时器圆环 + 控制按钮
│   │   ├── Pet/          # 桌面宠物（猪鱼）
│   │   ├── Tasks/        # 任务列表
│   │   ├── Stats/        # 统计面板
│   │   ├── MiniWindow/   # 迷你计时器
│   │   └── common/       # 标题栏 + 设置面板
│   ├── hooks/
│   │   └── useTimer.ts   # 计时器核心逻辑 + 音效
│   ├── store/
│   │   └── appStore.ts   # Zustand 全局状态
│   ├── types/
│   │   └── index.ts      # TypeScript 类型定义
│   └── styles/
│       ├── global.css    # 全局样式 + CSS 变量
│       └── pet-animations.css  # 宠物动画
├── resources/            # 应用图标等资源
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 🎮 使用说明

1. **开始专注** — 点击"开始专注 ✨"按钮进入 25 分钟工作计时
2. **添加任务** — 切换到"📋 任务"标签，添加当前要完成的任务，点击圆圈将其设为当前任务
3. **休息** — 番茄完成后自动进入短休息，每 4 个番茄后进入长休息
4. **统计** — 切换到"📊 统计"标签查看今日/本周/累计数据
5. **设置** — 点击标题栏 ⚙ 图标自定义时长
6. **迷你窗口** — 在托盘菜单中打开迷你窗口，始终置顶显示计时进度

## 📄 License

MIT
