# ApexSolve AI

[![Live application](https://img.shields.io/badge/Live%20app-ApexSolve-5B4BFF?style=for-the-badge)](https://apex-solve.vercel.app/)
[![Source code](https://img.shields.io/badge/GitHub-Source%20code-181717?style=for-the-badge&logo=github)](https://github.com/Thanooz45/ApexSolve)

**ApexSolve AI** is a full-stack, multi-modal academic doubt solver. Students can ask questions in their own words, upload a textbook image or diagram, or record a voice question, then receive clear, step-by-step guidance from an AI tutor. Each student has a private learning space with saved conversations and progress statistics.

**Live demo:** [apex-solve.vercel.app](https://apex-solve.vercel.app/)
**Repository:** [github.com/Thanooz45/ApexSolve](https://github.com/Thanooz45/ApexSolve)

## Highlights

- Secure registration and sign-in with JWT-based authentication.
- Personal learning profiles with grade and subject preferences.
- Text questions powered by Groq Llama 3.3 70B.
- Image-based doubt solving for equations, diagrams, and textbook pages via Llama 4 Scout Vision.
- Voice questions transcribed by AssemblyAI before they are answered.
- Step-by-step Markdown answers with syntax-highlighted code blocks.
- Private, persistent chat history stored per user in MongoDB.
- Dashboard with total doubts solved, learning threads, and subject activity.
- Navbar reflects authentication state: the student name appears only while signed in and is removed immediately on sign-out or session expiry.

## How it works

```text
Student question
  ├─ Text  ─────────────────────────────► Groq Llama 3.3 ─┐
  ├─ Image ─► Base64 image input ───────► Llama 4 Scout ──┼─► Saved answer in MongoDB
  └─ Voice ─► AssemblyAI transcription ─► Groq Llama 3.3 ─┘
                                                        │
                                                        └─► Private student dashboard
```

## Technology

| Area | Tools |
| --- | --- |
| Client | React, Vite, React Router, Axios |
| UI | CSS, Lucide React, React Hot Toast |
| Answer rendering | React Markdown, Remark GFM, React Syntax Highlighter |
| Server | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| AI | Groq SDK — Llama 3.3 70B and Llama 4 Scout Vision |
| Speech to text | AssemblyAI |
| Uploads & security | Multer, Helmet, CORS, express-rate-limit |

## Features

### Student accounts

Students can create an account with a name, email, password, grade, and preferred subjects. Passwords are hashed before storage. Protected routes require a bearer token, and chat data is always scoped to the authenticated student.

Visitors and users on the sign-in page see no username in the navbar. Once authentication succeeds, the signed-in student’s name, Dashboard link, and Sign out control appear. Signing out—or receiving a `401` for an expired session—clears the saved session and removes the name from the navbar.

### Three ways to ask

1. **Text** — Type an academic question naturally.
2. **Image** — Upload a JPG, PNG, or WEBP image up to 10 MB.
3. **Voice** — Record a question in the browser; the audio is transcribed before it is sent to the tutor.

Answers are saved alongside the original prompt, media reference, detected subject, and timestamp, allowing students to continue prior learning threads.

## Project structure

```text
ApexSolve/
├── client/                         # React + Vite application
│   └── src/
│       ├── api/                    # Axios instance and auth headers
│       ├── components/             # Navbar, chat UI, shared controls
│       ├── context/                # Authentication state
│       └── pages/                  # Landing, auth, dashboard, chat views
├── server/                         # Express API
│   ├── config/                     # MongoDB connection
│   ├── controllers/                # Auth and chat logic
│   ├── middleware/                 # JWT protection and Multer uploads
│   ├── models/                     # User and Chat schemas
│   ├── routes/                     # API routes
│   └── services/                   # Groq and AssemblyAI integrations
└── README.md
```

## Run locally

### Prerequisites

- Node.js 18 or later
- MongoDB locally or a MongoDB Atlas connection string
- A [Groq API key](https://console.groq.com/)
- An [AssemblyAI API key](https://www.assemblyai.com/)

### 1. Clone and install

```bash
git clone https://github.com/Thanooz45/ApexSolve.git
cd ApexSolve

cd server
npm install

cd ../client
npm install
```

### 2. Configure the server

Create `server/.env` from this template. Do not commit this file or real keys.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/apexsolve-ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
GROQ_API_KEY=gsk_your_groq_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
MAX_FILE_SIZE=10485760

# Optional: comma-separated frontend origins permitted to call the API
CLIENT_URL=http://localhost:5173
```

For a separately deployed frontend, create `client/.env` with the public API URL:

```env
VITE_API_URL=https://your-api-domain.example/api
```

### 3. Start the application

Open two terminals from the project root:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Then open the address printed by Vite (normally `http://localhost:5173`). The API health endpoint is available at `http://localhost:5000/api/health`.

## API overview

All chat endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and receive a token |
| `POST` | `/api/auth/login` | Sign in and receive a token |
| `GET` | `/api/auth/me` | Get the current profile |
| `GET` | `/api/chats` | List the current student’s chats |
| `POST` | `/api/chats` | Start a learning thread |
| `GET` | `/api/chats/stats` | Get dashboard statistics |
| `GET` | `/api/chats/:id` | Get a chat and its messages |
| `DELETE` | `/api/chats/:id` | Delete a chat |
| `POST` | `/api/chats/:id/text` | Submit a text doubt |
| `POST` | `/api/chats/:id/image` | Submit an image doubt |
| `POST` | `/api/chats/:id/voice` | Submit a voice doubt |

## Deployment notes

- Build the client with `npm run build` inside `client/` and deploy the generated static application to Vercel or a comparable host.
- Deploy `server/` to a Node.js-capable service and set all server environment variables there.
- Set `VITE_API_URL` in the client deployment to `<server-url>/api`.
- Add the deployed client URL to `CLIENT_URL` on the server so CORS permits it.
- Use a production MongoDB connection string and a strong unique `JWT_SECRET`.
- Uploaded media is stored on the server filesystem. For durable, multi-instance production deployments, move uploads to object storage.

## Security and privacy

- Passwords are hashed with bcryptjs.
- JWTs protect profile and chat endpoints.
- Each chat query is restricted to its owning user.
- Helmet, CORS allow-listing, request-size limits, and rate limits protect the API.
- Media uploads validate accepted MIME types and file size.

## Contributing

Contributions are welcome. Please open an issue to discuss a substantial change, then submit a focused pull request with a clear description and tested behavior.

## License

No license has been specified for this repository. Add a license file before redistributing or reusing the project beyond the permissions granted by its owner.
