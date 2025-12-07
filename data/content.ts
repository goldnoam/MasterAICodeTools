import { ContentData, Language, ToolId } from '../types';

export const GLOSSARY: Record<string, string> = {
  "GoogleGenAI": "The main class (SDK) used to connect to Google's Gemini API.",
  "process.env": "A global variable that securely accesses environment variables (like API keys) on the server.",
  "systemInstruction": "A prompt that defines the AI's persona, role, and rules before the conversation starts.",
  "temperature": "A setting (0.0 - 2.0) that controls randomness. 0 is logical/deterministic, 1+ is creative.",
  "topK": "Limits the AI's word choices to the top 'K' most probable next words.",
  "responseSchema": "Forces the AI to return data in a strict structure (like JSON) instead of free text.",
  "responseMimeType": "Tells the AI what format to output, such as 'application/json'.",
  "Cmd+K": "The magic shortcut in Cursor/VS Code to open the AI edit bar.",
  "@Codebase": "A context tag that allows the AI to read your entire project's files to answer questions.",
  "pandas": "A popular Python library for data manipulation and analysis.",
  "matplotlib": "A Python library used for creating charts and visualizations.",
  "jest": "A JavaScript testing framework.",
  "mockResolvedValue": "Used in testing to fake an API response so you don't hit the real server.",
  "useEffect": "A React Hook that runs code when a component loads or updates.",
  "Type.ARRAY": "Specifies that the expected output should be a list/array.",
  "Type.OBJECT": "Specifies that the expected output should be a complex object with properties.",
  "Type.STRING": "Specifies that the output field must be text.",
  "generateContent": "Sends a request to the model to generate a response (text, image, etc).",
  "sendMessage": "Sends a message to a chat session, maintaining the conversation history.",
  "models": "The namespace in the SDK for accessing Gemini models and their capabilities.",
  "contents": "The payload sent to the AI, which can include text strings or multi-modal parts.",
  "#file": "A context variable in GitHub Copilot Chat to specifically reference a file's content.",
  "describe": "Jest: Creates a block that groups together several related tests.",
  "it": "Jest: Defines a single test case description and body.",
  "expect": "Jest: An assertion function to check if a value meets a specific condition.",
  "read_csv": "Pandas: A function to read a comma-separated values (CSV) file into a DataFrame.",
  "groupby": "Pandas: A method to group data based on specific categories for aggregation.",
  "plot": "Pandas/Matplotlib: A method to generate visualizations like charts from data.",
  "LangChain": "A framework for developing applications powered by language models through composability.",
  "Chain": "A sequence of calls (to an LLM, tool, or data processor) linked together.",
  "Agent": "An AI system that uses an LLM to decide what actions/tools to take and in what order.",
  "PromptTemplate": "A structured way to create prompts with dynamic input variables.",
  "Runnable": "The standard interface in LangChain (LCEL) that defines how chains are invoked.",
  "LCEL": "LangChain Expression Language: A declarative way to chain LangChain components.",
  "RAG": "Retrieval Augmented Generation: Injecting external data into a prompt to improve accuracy.",
  "VectorStore": "A database optimized for storing and searching vector embeddings of text.",
  "Embeddings": "Numerical representations of text that capture semantic meaning.",
  "Composer": "Cursor's multi-file editing mode (Cmd+I) that can create or modify multiple files at once.",
  "@Docs": "Cursor context tag to index and reference external documentation URLs."
};

// Helper to create placeholder content for other languages
const createMockTutorial = (lang: string, toolName: string, id: ToolId): any => ({
  id: id,
  name: toolName,
  description: `Mastering ${toolName} (${lang}).`,
  sections: [
    {
      title: "Introduction",
      content: `Welcome to the ${toolName} guide. This tool is essential for modern AI-assisted development.`,
      code: "echo 'Hello World'",
      codeLanguage: "bash"
    },
    {
      title: "Basic Usage",
      content: "Learn the core commands and shortcuts to boost your productivity immediately.",
      code: "// Example code placeholder\nconst start = () => {\n  console.log('Started');\n}",
      codeLanguage: "javascript"
    }
  ]
});

export const DATA: ContentData = {
  [Language.EN]: {
    ui: {
      selectTool: "Select a Tool",
      language: "Language",
      theme: "Theme",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "Send Feedback",
      toc: "Table of Contents",
      welcomeTitle: "Master AI Coding Tools",
      welcomeSubtitle: "Select a tool from the sidebar to begin your journey into AI-assisted development.",
      searchPlaceholder: "Search tools...",
      aboutTool: "About this tool",
      popularTools: "Popular Tools"
    },
    tutorials: {
      aistudio: {
        id: 'aistudio',
        name: 'Google AI Studio',
        description: 'Rapid prototyping and API integration with Gemini models.',
        sections: [
          {
            title: "Initialization & Configuration",
            content: "To start using the Gemini API, initialize the GoogleGenAI client. It is best practice to use environment variables for your API key. We also configure the model with 'systemInstruction' to define its persona.",
            code: `import { GoogleGenAI } from "@google/genai";

// Initialize with your secure API Key from process.env
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Configure the model request
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash", 
  contents: "Explain how a binary search tree works.",
  config: {
    // Define the persona or rules for the model
    systemInstruction: "You are a Computer Science professor. Use analogies.",
    temperature: 0.7, // Creativity (0.0 - 2.0)
    topK: 40,
  },
});

console.log(response.text);`,
            codeLanguage: "typescript"
          },
          {
            title: "Structured Output (JSON)",
            content: "For integrating AI into apps, you often need JSON output rather than unstructured text. Use 'responseSchema' to enforce a strict format.",
            code: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "List 3 popular sorting algorithms.",
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          complexity: { type: Type.STRING },
        }
      }
    }
  }
});

// Output will be a valid JSON string
const algorithms = JSON.parse(response.text);
console.log(algorithms);`,
            codeLanguage: "typescript"
          },
          {
            title: "Multimodal Inputs (Vision)",
            content: "Gemini is multimodal native. You can send images (encoded as Base64) along with text to analyze diagrams, UI screenshots, or photos.",
            code: `import { GoogleGenAI } from "@google/genai";
import { fs } from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Read image file and convert to base64 (Node.js example)
const imageBase64 = fs.readFileSync('diagram.png').toString('base64');

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: {
    parts: [
      { inlineData: { mimeType: "image/png", data: imageBase64 } },
      { text: "Analyze this architecture diagram. What are the security risks?" }
    ]
  }
});

console.log(response.text);`,
            codeLanguage: "typescript"
          },
          {
            title: "Chat Sessions",
            content: "For interactive applications, use `chats.create` to maintain history automatically. The SDK manages the context window for you.",
            code: `const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: "You are a helpful travel assistant.",
  }
});

// First message
let response = await chat.sendMessage({ message: "I want to visit Tokyo." });
console.log(response.text); 

// Second message (AI remembers context)
response = await chat.sendMessage({ message: "What is the weather like there in March?" });
console.log(response.text); // Will discuss Tokyo's weather`,
            codeLanguage: "typescript"
          }
        ]
      },
      cursor: {
        id: 'cursor',
        name: 'Cursor IDE',
        description: 'The AI-first code editor fork of VS Code.',
        sections: [
          {
            title: "Refactoring with Cmd+K",
            content: "Cursor's primary feature is inline editing. Highlight a block of code and press Cmd+K (Mac) or Ctrl+K (Windows). You don't need to write code—just describe the change.",
            code: `// 1. Highlight a function with complex 'if/else' logic.
// 2. Press Cmd+K
// 3. Type prompt: "Refactor this to use a switch statement and handle error cases."

// Cursor will rewrite the code in-place.`,
            codeLanguage: "text"
          },
          {
            title: "Chat with Codebase (@Codebase)",
            content: "In the chat sidebar (Cmd+L), you can reference your entire project. This is powerful for architectural questions or finding where logic resides.",
            code: `User: "@Codebase where is the user authentication logic handled?"

Cursor: "I found authentication references in:
1. /src/auth/AuthProvider.tsx
2. /src/api/middleware.ts
3. /src/components/Login.tsx

The main logic seems to be in AuthProvider.tsx using JWT tokens..."`,
            codeLanguage: "markdown"
          },
          {
            title: "Composer Mode (Cmd+I)",
            content: "Composer is a powerful mode for multi-file edits. Press Cmd+I to open the Composer window. You can ask it to build entire features that span multiple files.",
            code: `User (Cmd+I): "Create a new 'Blog' feature. 
1. Add a BlogPost model in schema.prisma.
2. Create an API route in /app/api/blog/route.ts.
3. Create a frontend component in /components/BlogList.tsx."

// Composer will generate plans for all 3 files and apply them sequentially.`,
            codeLanguage: "text"
          },
          {
            title: "Documentation Context (@Docs)",
            content: "Cursor can index external documentation. Type '@Docs' in chat, paste a URL (like the React or Stripe docs), and Cursor will learn it to provide up-to-date answers.",
            code: `User: "@Docs (React Router 6) How do I use the new data loaders?"

// Cursor reads the indexed docs and explains the specific API 
// instead of hallucinating older versions.`,
            codeLanguage: "text"
          },
          {
            title: "Fixing Terminal Errors",
            content: "When a command fails in the Cursor terminal, a 'Auto Debug' button often appears. Clicking it sends the error log to the AI model, which analyzes the stack trace and suggests a fix command.",
            code: `Error: Module not found: Can't resolve './utils/helper'

// Click "Auto Debug"
// Cursor suggests:
// "It looks like the file path is incorrect. Try importing from '../utils/helper' instead."`,
            codeLanguage: "bash"
          }
        ]
      },
      claude: {
        id: 'claude',
        name: 'Claude Code',
        description: 'Using Anthropic\'s Claude 3.5 Sonnet for advanced logic.',
        sections: [
          {
            title: "Complex Refactoring Prompts",
            content: "Claude 3.5 Sonnet excels at following complex instructions. When pasting a large file into the context, use XML tags to delineate sections.",
            code: `You are an expert React developer.
Here is my current component in <current_code> tags.
I want to migrate this from Redux to React Context.

<current_code>
... paste 200 lines of code ...
</current_code>

Requirements:
1. Create a new Context provider.
2. Replace all useSelector hooks with useContext.
3. Ensure types are preserved.`,
            codeLanguage: "markdown"
          },
          {
            title: "Style Guidelines",
            content: "When asking Claude to write code, it helps to provide a <style_guide> block to ensure the output matches your team's conventions.",
            code: `<style_guide>
- Use TypeScript with strict mode.
- Prefer functional components over classes.
- Use Tailwind CSS for styling.
- Use 'zod' for validation.
</style_guide>

Task: Create a registration form component.`,
            codeLanguage: "markdown"
          },
          {
            title: "Explaining Legacy Code",
            content: "Claude has a large context window (200k tokens). You can paste entire legacy files and ask for a summary or logic explanation.",
            code: `Prompt: "I have pasted a 2000-line legacy Perl script below. 
Please explain the high-level data flow and identify any potential security vulnerabilities in the input handling."

<script>
... (legacy code) ...
</script>`,
            codeLanguage: "text"
          }
        ]
      },
      chatgpt: {
        id: 'chatgpt',
        name: 'ChatGPT Codex',
        description: 'Using OpenAI for data analysis and logic generation.',
        sections: [
          {
            title: "Data Analysis (Python)",
            content: "You can upload a CSV file to ChatGPT and ask it to write Python code to analyze it. This is often more reliable than asking for the answer directly.",
            code: `Prompt: "I have uploaded 'sales_data.csv'. Write a Python script using pandas to:
1. Load the CSV.
2. Group sales by 'Region'.
3. Calculate the total profit for each region.
4. Plot a bar chart."

// ChatGPT generates and executes:
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('/mnt/data/sales_data.csv')
regional_profit = df.groupby('Region')['Profit'].sum()
regional_profit.plot(kind='bar')`,
            codeLanguage: "python"
          },
          {
            title: "SQL Query Generation",
            content: "ChatGPT is excellent at converting natural language to complex SQL queries. Just provide your schema structure.",
            code: `Prompt: "Given a table 'Orders' (id, user_id, amount, created_at) and 'Users' (id, email, country), 
write a PostgreSQL query to find the top 5 users by total spend in 2024 who are from France."

-- Output
SELECT u.email, SUM(o.amount) as total_spend
FROM Users u
JOIN Orders o ON u.id = o.user_id
WHERE u.country = 'France' 
  AND o.created_at >= '2024-01-01' 
  AND o.created_at < '2025-01-01'
GROUP BY u.id
ORDER BY total_spend DESC
LIMIT 5;`,
            codeLanguage: "sql"
          },
          {
            title: "Language Conversion",
            content: "Easily translate code logic from one language to another, for example, porting a Python script to TypeScript.",
            code: `Prompt: "Convert this Python dictionary logic to a TypeScript interface and object."

Python:
user = {
  "name": "Noam",
  "meta": { "login_count": 5, "active": True }
}

TypeScript Output:
interface UserMeta {
  login_count: number;
  active: boolean;
}

interface User {
  name: string;
  meta: UserMeta;
}

const user: User = {
  name: "Noam",
  meta: { login_count: 5, active: true }
};`,
            codeLanguage: "typescript"
          }
        ]
      },
      vscode: {
        id: 'vscode',
        name: 'VS Code Copilot',
        description: 'Microsoft\'s official AI integration for VS Code.',
        sections: [
          {
            title: "Workspace Context Variables",
            content: "In the GitHub Copilot Chat extension, you can specific variables to give the AI context. Use '#' to trigger these variables.",
            code: `Prompt: "Explain how #file:App.tsx interacts with #file:types.ts"

// This explicitly forces Copilot to read those two specific files 
// before answering, reducing hallucinations.`,
            codeLanguage: "text"
          },
          {
            title: "Inline Suggestions (Ghost Text)",
            content: "As you type, Copilot reads your cursor position and surrounding files. It is most effective when you provide clear function names and JSDoc comments.",
            code: `/**
 * Calculate the haversine distance between two coordinates
 * @param {number} lat1 
 * @param {number} lon1 
 */
// Copilot will autocomplete the function body here...`,
            codeLanguage: "javascript"
          },
          {
            title: "Slash Commands",
            content: "In the chat window, use slash commands to quickly perform common tasks without typing long prompts.",
            code: `/fix - Analyze the selected code for bugs and propose a fix.
/explain - Explain how the selected code works in plain English.
/tests - Generate unit tests for the selected function.
/doc - Generate documentation comments for the symbol.`,
            codeLanguage: "text"
          },
          {
            title: "Smart Commit Messages",
            content: "In the Source Control tab, click the 'Sparkle' icon next to the commit message box. Copilot analyzes your staged changes and generates a descriptive commit message.",
            code: `// Copilot generates:
"feat(auth): implement JWT token refresh logic and update login schema"`,
            codeLanguage: "text"
          }
        ]
      },
      copilot: {
        id: 'copilot',
        name: 'GitHub Copilot',
        description: 'AI Pair Programmer for faster development cycles.',
        sections: [
          {
            title: "Comment Driven Development",
            content: "Write a comment describing logic, and let Copilot generate the implementation. This is excellent for utility functions and regex.",
            code: `// Validate email address using regex
const isValidEmail = (email) => {
  // Copilot Suggestion:
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};`,
            codeLanguage: "javascript"
          },
          {
            title: "Generating Tests",
            content: "Highlight a function and use the /tests slash command in Copilot Chat, or just start writing a test file.",
            code: `// In a new file: user.test.ts
import { getUser } from './user';

describe('getUser', () => {
  // Copilot often autocompletes the entire test suite
  it('should return user data when found', async () => {
    const mockUser = { id: 1, name: 'Noam' };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUser
    });
    
    const result = await getUser(1);
    expect(result).toEqual(mockUser);
  });
});`,
            codeLanguage: "typescript"
          },
          {
            title: "CLI Assistant",
            content: "GitHub Copilot CLI helps you write complex shell commands. If you forget a `ffmpeg` or `git` command, ask the CLI.",
            code: `$ gh copilot suggest "Convert video.mp4 to a gif with 10fps"

# Suggestion:
ffmpeg -i video.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" -c:v gif output.gif

# Options:
# [E]xecute command
# [R]evise command
# [C]opy command`,
            codeLanguage: "bash"
          },
          {
            title: "Docstring Generation",
            content: "Copilot can generate JSDoc or Python docstrings automatically. Start typing `/**` above a function, or use the Chat command `/doc`.",
            code: `/**
 * Retries an async operation with exponential backoff.
 * @param {Function} fn - The async function to retry.
 * @param {number} retries - Max number of retries.
 * @returns {Promise<any>}
 */
async function retry(fn, retries = 3) { ... }`,
            codeLanguage: "javascript"
          }
        ]
      },
      langchain: {
        id: 'langchain',
        name: 'LangChain',
        description: 'Building applications with LLMs through composability.',
        sections: [
          {
            title: "Introduction",
            content: "LangChain is a framework for developing applications powered by language models. It enables you to connect LLMs to other sources of data.",
            code: `import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ 
  modelName: "gpt-4",
  temperature: 0.9 
});

const response = await model.invoke([
  new HumanMessage("What is a good name for a company that makes colorful socks?")
]);

console.log(response.content);`,
            codeLanguage: "typescript"
          },
          {
            title: "Chains (LCEL)",
            content: "LCEL (LangChain Expression Language) allows you to compose chains declaratively. A 'Chain' connects a prompt, a model, and an output parser.",
            code: `import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate("Tell me a joke about {topic}");
const outputParser = new StringOutputParser();

// Create the Chain
const chain = prompt.pipe(model).pipe(outputParser);

// Run the Chain
const result = await chain.invoke({ topic: "bears" });
console.log(result);`,
            codeLanguage: "typescript"
          },
          {
            title: "RAG (Retrieval Augmented Generation)",
            content: "RAG allows the LLM to answer questions about your private data. You load documents, split them, embed them, and store them in a VectorStore.",
            code: `import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

// 1. Create Vector Store from texts
const vectorStore = await MemoryVectorStore.fromTexts(
  ["Noam's favorite color is blue.", "The project deadline is Friday."],
  [{ id: 1 }, { id: 2 }],
  new OpenAIEmbeddings()
);

// 2. Create a Retriever
const retriever = vectorStore.asRetriever();

// 3. Chain retrieval with generation
const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough()
  },
  prompt,
  model,
  new StringOutputParser()
]);

await chain.invoke("What is Noam's favorite color?");`,
            codeLanguage: "typescript"
          },
          {
            title: "Conversation Memory",
            content: "Standard LLM calls are stateless. To build a chatbot, you need to manage Memory (History) and pass it back to the model with every new question.",
            code: `import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

await chain.call({ input: "Hi! I'm Noam." });
const res = await chain.call({ input: "What's my name?" });
console.log(res.response); // "Your name is Noam."`,
            codeLanguage: "typescript"
          },
          {
            title: "Agents",
            content: "An Agent uses an LLM to decide what actions to take and in what order. An agent can use tools like search engines or calculators.",
            code: `// Pseudo-code example of Agent initialization
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";

const tools = [searchTool, calculatorTool];
const agent = await createOpenAIFunctionsAgent({
  llm: model,
  tools,
  prompt: agentPrompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

await agentExecutor.invoke({ input: "What is the population of Paris squared?" });`,
            codeLanguage: "typescript"
          }
        ]
      }
    }
  },
  [Language.HE]: {
    ui: {
      selectTool: "בחר כלי",
      language: "שפה",
      theme: "ערכת נושא",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "שלח משוב",
      toc: "תוכן עניינים",
      welcomeTitle: "למד כלי פיתוח AI",
      welcomeSubtitle: "בחר כלי מהתפריט כדי להתחיל.",
      searchPlaceholder: "חפש כלים...",
      aboutTool: "אודות הכלי",
      popularTools: "כלים פופולריים"
    },
    tutorials: {
      aistudio: createMockTutorial("עברית", "AI Studio", 'aistudio'),
      cursor: createMockTutorial("עברית", "Cursor IDE", 'cursor'),
      claude: createMockTutorial("עברית", "Claude Code", 'claude'),
      chatgpt: createMockTutorial("עברית", "ChatGPT Codex", 'chatgpt'),
      vscode: createMockTutorial("עברית", "VS Code Copilot", 'vscode'),
      copilot: createMockTutorial("עברית", "GitHub Copilot", 'copilot'),
      langchain: createMockTutorial("עברית", "LangChain", 'langchain'),
    }
  },
  [Language.ZH]: {
    ui: {
      selectTool: "选择工具",
      language: "语言",
      theme: "主题",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "发送反馈",
      toc: "目录",
      welcomeTitle: "掌握 AI 编程工具",
      welcomeSubtitle: "从侧边栏选择一个工具开始学习。",
      searchPlaceholder: "搜索工具...",
      aboutTool: "关于此工具",
      popularTools: "热门工具"
    },
    tutorials: {
      aistudio: createMockTutorial("中文", "AI Studio", 'aistudio'),
      cursor: createMockTutorial("中文", "Cursor IDE", 'cursor'),
      claude: createMockTutorial("中文", "Claude Code", 'claude'),
      chatgpt: createMockTutorial("中文", "ChatGPT Codex", 'chatgpt'),
      vscode: createMockTutorial("中文", "VS Code Copilot", 'vscode'),
      copilot: createMockTutorial("中文", "GitHub Copilot", 'copilot'),
      langchain: createMockTutorial("中文", "LangChain", 'langchain'),
    }
  },
  [Language.HI]: {
    ui: {
      selectTool: "उपकरण चुनें",
      language: "भाषा",
      theme: "थीम",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "प्रतिक्रिया भेजें",
      toc: "विषय सूची",
      welcomeTitle: "AI कोडिंग टूल्स सीखें",
      welcomeSubtitle: "शुरू करने के लिए साइडबार से एक टूल चुनें।",
      searchPlaceholder: "उपकरण खोजें...",
      aboutTool: "इस उपकरण के बारे में",
      popularTools: "लोकप्रिय उपकरण"
    },
    tutorials: {
      aistudio: createMockTutorial("हिन्दी", "AI Studio", 'aistudio'),
      cursor: createMockTutorial("हिन्दी", "Cursor IDE", 'cursor'),
      claude: createMockTutorial("हिन्दी", "Claude Code", 'claude'),
      chatgpt: createMockTutorial("हिन्दी", "ChatGPT Codex", 'chatgpt'),
      vscode: createMockTutorial("हिन्दी", "VS Code Copilot", 'vscode'),
      copilot: createMockTutorial("हिन्दी", "GitHub Copilot", 'copilot'),
      langchain: createMockTutorial("हिन्दी", "LangChain", 'langchain'),
    }
  },
  [Language.ES]: {
    ui: {
      selectTool: "Seleccionar Herramienta",
      language: "Idioma",
      theme: "Tema",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "Enviar Comentarios",
      toc: "Tabla de Contenidos",
      welcomeTitle: "Domina las herramientas de IA",
      welcomeSubtitle: "Selecciona una herramienta de la barra lateral para comenzar.",
      searchPlaceholder: "Buscar herramientas...",
      aboutTool: "Sobre esta herramienta",
      popularTools: "Herramientas populares"
    },
    tutorials: {
      aistudio: createMockTutorial("Español", "AI Studio", 'aistudio'),
      cursor: createMockTutorial("Español", "Cursor IDE", 'cursor'),
      claude: createMockTutorial("Español", "Claude Code", 'claude'),
      chatgpt: createMockTutorial("Español", "ChatGPT Codex", 'chatgpt'),
      vscode: createMockTutorial("Español", "VS Code Copilot", 'vscode'),
      copilot: createMockTutorial("Español", "GitHub Copilot", 'copilot'),
      langchain: createMockTutorial("Español", "LangChain", 'langchain'),
    }
  },
  [Language.RU]: {
    ui: {
      selectTool: "Выберите инструмент",
      language: "Язык",
      theme: "Тема",
      footerRights: "(C) Noam Gold AI 2025",
      sendFeedback: "Отправить отзыв",
      toc: "Содержание",
      welcomeTitle: "Изучайте ИИ инструменты",
      welcomeSubtitle: "Выберите инструмент из меню, чтобы начать.",
      searchPlaceholder: "Поиск инструментов...",
      aboutTool: "Об инструменте",
      popularTools: "Популярные инструменты"
    },
    tutorials: {
      aistudio: createMockTutorial("Русский", "AI Studio", 'aistudio'),
      cursor: createMockTutorial("Русский", "Cursor IDE", 'cursor'),
      claude: createMockTutorial("Русский", "Claude Code", 'claude'),
      chatgpt: createMockTutorial("Русский", "ChatGPT Codex", 'chatgpt'),
      vscode: createMockTutorial("Русский", "VS Code Copilot", 'vscode'),
      copilot: createMockTutorial("Русский", "GitHub Copilot", 'copilot'),
      langchain: createMockTutorial("Русский", "LangChain", 'langchain'),
    }
  }
};