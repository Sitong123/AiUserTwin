## AIUserTwin · 用户映像

A decentralized protocol for cognitive data.  
Forge, manage, and monetize your digital twin.

---

### English Overview

**AIUserTwin** is an innovative AI platform that helps enterprises build **digital twins** based on real user behaviors and perceptions. It enables cost‑effective, high‑efficiency user research while continuously creating value for individual users.

Through a **consent‑based authorization mechanism**, AIUserTwin converts users’ perceptions, preferences, and behaviors into accessible **digital assets**, under strict privacy protection. This dramatically improves data quality and research efficiency.

The project focuses on three core objectives:

- **User‑side**: Provide tools for users to manage and authorize their digital twins, so they can earn long‑term returns without repeatedly taking part in research.
- **Enterprise‑side**: Equip enterprises with efficient research tools that generate high‑value insights grounded in authentic, fine‑grained user profiles.
- **Data governance**: Establish an authorization‑based data usage mechanism that safeguards users’ rights to know, choose, and benefit from their own data.

As a new model with strong long‑term potential, AIUserTwin helps enterprises **cut costs, boost efficiency, run large‑scale segmented simulations, and reduce disruptions to real users**. For individuals, it turns research participation into **sustained income and data control**, while feeding AI systems with real cognitive data for more personalized and refined feedback.

---

### 中文简介

**「用户映像（AIUserTwin）」** 是一款创新型人工智能平台，旨在为企业提供基于真实用户行为与认知的 **数字分身（Digital Twin）**，帮助企业以更低成本、更高效率开展用户调研，同时为用户创造可持续收益。

平台依托 **授权式的数据使用机制**，在保障隐私前提下，将用户的认知、偏好与行为转化为可调用的 **数字资产**，显著提升数据质量与调研效率：

- **面向用户**：提供数字分身的管理与授权工具，用户无需反复填写问卷或频繁参与访谈，即可通过授权数字分身参与企业研究，获得长期收益。
- **面向企业**：为企业提供高效的调研与仿真工具，基于真实且细颗粒度的用户画像生成高价值洞察，支持多场景、多行业的策略测试。
- **面向数据治理**：构建以授权为核心的数据流通机制，保障用户对自身数据的 **知情权、选择权与收益权**。

作为一种极具长期价值与发展潜力的模式，「用户映像」一方面帮助企业 **显著降本增效、开展大规模细分仿真、减少对真实用户的打扰**；另一方面让用户可以 **掌握数据主权，将参与调研转化为持续收益**。同时，平台为 AI 系统提供来源于真实个体的认知数据，推动更加个性化、精细化的用户反馈与产品迭代，最终构建 **用户–企业–平台三方共赢** 的新型研究生态。

---

## Core Features · 核心特性

- **Dual‑role Experience · 双角色入口**
  - `PERSONAL` 模式：面向个体用户，管理自己的数字分身与收益情况。
  - `ENTERPRISE` 模式：面向企业用户，配置目标人群、发起认知仿真与研究任务。

- **Digital Twin Modeling Wizard · 数字分身建模向导**
  - 多步骤向导（身份信息、生活方式问卷、认知画像等）。
  - 通过 Gemini 生成 **虚拟商户节点**，自动模拟用户与不同品牌之间的问答交互。
  - 完成建模后，将 Twin 成熟度提升为 100%，并回写到用户仪表盘。

- **User Dashboard · 用户控制面板**
  - 展示 Twin 成熟度、收益曲线和基础身份信息。
  - 以「Command Center」的风格可视化 Twin 与企业查询请求的交互频率和数据可信度。

- **Enterprise Simulation & Research Center · 企业侧仿真与研究**
  - 在 `Research Center` 中输入目标人群描述（如 “20 多岁、科技敏感的一线城市从业者”），自动生成一组 **合成数字人群（synthetic cohort）**。
  - 针对某个研究问题发起模拟访谈，对每个 persona 生成回答，并进一步调用 Gemini 进行 **综合分析报告**（executive summary、behavioral insights、strategic recommendations 等）。

- **Visual Asset Studio · 视觉资产工作室**
  - 基于 Gemini 图像模型，为数字分身生成或编辑头像与视觉标识。
  - 支持上传用户图片、输入自然语言指令，对视觉风格进行编辑并导出为新资产。

- **Consent‑based Data Governance · 授权式数据治理（概念层设计）**
  - 以「授权」为前提设计界面与数据流，强调用户对数据的控制与收益。
  - 为未来接入链上验证、收益分配等机制预留概念空间（如 “Verified On‑Chain”、“Yield Balance” 等 UI 元素）。

---

## Tech Stack · 技术栈

- **Frontend**: React 19 + React Router
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI & Icons**: 自定义样式 + `lucide-react`
- **Charts**: `recharts`（用于收益与指标可视化）
- **AI Runtime**: `@google/genai`  
  - Gemini 3 Flash（行为与对话类）
  - Gemini 3 Pro（研究报告综合分析 + Google Search Grounding）
  - Gemini 2.5 Flash Image（头像生成与图片编辑）

---

## Project Structure · 项目结构

```text
aiusertwin/
├── App.tsx                 # 应用入口与路由、导航栏和角色切换
├── index.tsx              # React 挂载入口
├── views/
│   ├── LandingPage.tsx        # 登陆/首页，模式选择与产品概念介绍
│   ├── UserDashboard.tsx      # 用户仪表盘：Twin 状态与收益视图
│   ├── EnterpriseDashboard.tsx# 企业总览：Simulation Sandbox
│   ├── ResearchCenter.tsx     # 研究控制台：人群合成 + 仿真 + 报告
│   ├── ModelingWizard.tsx     # 数字分身建模多步骤向导
│   └── ImageStudio.tsx        # 视觉资产工作室
├── services/
│   └── geminiService.ts   # 与 Google Gemini 的所有交互封装
├── types.ts               # 领域模型类型定义（UserProfile、SynthesisReport 等）
├── vite.config.ts
├── tsconfig.json
├── metadata.json          # AI Studio / Frame 权限等元信息
└── README.md
```

---

## Getting Started · 本地运行

### 1. Prerequisites · 环境要求

- Node.js（建议 18+）
- npm 或 pnpm / yarn

### 2. Install Dependencies · 安装依赖

```bash
npm install
```

### 3. Configure Environment · 配置环境变量

在项目根目录创建 `.env.local` 文件，写入你的 Gemini API Key（命名可根据你实际部署环境调整）：

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> 提示：在生产环境中，请通过安全的方式注入 API Key，不要直接提交 `.env.local` 到 GitHub。

### 4. Run Dev Server · 启动本地开发服务器

```bash
npm run dev
```

然后在浏览器中访问终端输出的本地地址（一般为 `http://localhost:5173`）。

---

## Usage Walkthrough · 体验流程

### Personal Mode · 个人用户路径

- 在首页选择 **PERSONAL** 模式。
- 通过 `Modeling Wizard` 依次完成：
  - 基本身份信息填写
  - 生活方式与消费习惯问卷
  - 生成数字分身头像（可使用默认或调用 Gemini 图像模型）
  - 与虚拟商户节点进行一次端到端的市场仿真交互（Q&A Log）
- 完成后进入 `User Dashboard`，查看：
  - Twin 成熟度（Maturity）
  - 收益曲线（模拟数据）
  - 行为与价值观描述等。

### Enterprise Mode · 企业用户路径

- 在首页选择 **ENTERPRISE** 模式。
- 在 `EnterpriseDashboard` 浏览当前仿真实验列表与网络规模指标。
- 进入 `ResearchCenter`：
  - 描述目标人群（如地域、年龄段、兴趣偏好等）。
  - 一键生成一组合成数字人群（Synthetic Cohort）。
  - 输入研究问题（如产品定价策略、功能优先级、品牌感知等）。
  - 执行仿真，查看：
    - 各 persona 的原始回答（Raw Cognitive Data）
    - 由 Gemini 生成的综合研究报告和策略建议（Synthesis Report）。

---

## Roadmap · 未来规划

- **真实身份与账户体系接入**：绑定钱包或账号体系，实现真实收益结算。
- **细粒度授权中心**：支持按行业、场景、时间窗口等维度对 Twin 授权。
- **链上验证与收益分配**：将「Verified On‑Chain」从 UI 概念升级为真实链上记录。
- **可配置问卷与研究模板**：让企业可以自定义问卷、研究流程与指标看板。
- **协作与导出**：支持导出报告为 PDF / Markdown，并与团队共享。

---

## License · 许可协议

You can add your preferred license here (for example, MIT).  
请根据你的实际需求补充或修改 License 信息。
