# 🤝 Contributing to NeerKavach

Thank you for your interest in contributing to NeerKavach! We welcome contributions from developers, researchers, and public health enthusiasts.

---

## 📜 Code of Conduct

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing. We are committed to providing a welcoming and inclusive environment.

---

## 🐛 Reporting Bugs

Create a GitHub issue and include:

- **Title**: Clear, concise description
- **Environment**: Browser, OS, Node version
- **Steps to reproduce**: Numbered list of actions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Error logs**: Console/network errors

---

## 💡 Suggesting Features

Open an issue labeled `enhancement` with:

- **Feature description**: What you want to add
- **Use case**: Why it's needed
- **Proposed implementation**: Technical approach (optional)

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Git

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/NeerKavach.git
cd NeerKavach
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
ML_API_URL=http://localhost:5001/predict
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

Start server:
```bash
npm run dev
```

### 3. ML Model Setup
```bash
cd model
pip install -r Requirment.txt
uvicorn app:app --host 127.0.0.1 --port 5001
```

### 4. Frontend Setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GROQ_API_KEY=your_groq_key
```

Start frontend:
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
NeerKavach/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
├── model/           # Python ML service (FastAPI)
└── docs/            # Documentation
```

---

## 📝 Coding Standards

### JavaScript/React
- Follow ESLint rules (run `npm run lint`)
- Use functional components with hooks
- Use meaningful variable/function names
- Add comments for complex logic

### Python
- Follow PEP 8 guidelines
- Use type hints
- Document functions with docstrings

### General
- Keep functions small and focused
- Write self-documenting code
- Handle errors gracefully

---

## 🌿 Branch Naming

```
feature/add-multilingual-support
bugfix/fix-login-redirect
docs/update-api-docs
refactor/improve-prediction-logic
test/add-unit-tests
```

---

## 💬 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add geolocation-based risk assessment
fix: correct dashboard chart rendering
docs: update installation guide
style: format code with prettier
refactor: optimize prediction pipeline
test: add auth controller tests
chore: update dependencies
```

---

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages
6. **Push** to your fork
7. **Open** a Pull Request

### PR Checklist:
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings introduced
- [ ] Tests pass locally

---

## 🏷️ Good First Issues

Look for issues labeled:

- `good first issue` - Simple tasks for beginners
- `help wanted` - Community help needed
- `documentation` - Docs improvements
- `bug` - Bug fixes

---

## 🎯 Priority Areas

We especially need help with:

1. **ML Model Improvement** - Better accuracy, new features
2. **Mobile App Development** - React Native / Flutter
3. **Multilingual Support** - Regional Indian languages
4. **IoT Integration** - Sensor data pipeline
5. **Testing** - Unit and integration tests
6. **Documentation** - API docs, tutorials

---

## 📞 Getting Help

- Open a [GitHub Discussion](https://github.com/Aniketdhar810/NeerKavach/discussions)
- Review existing issues and PRs
- Check the [README](README.md) and [ROADMAP](ROADMAP.md)

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make clean water accessible to more communities. Together, we can build a healthier future.

**💧 Safer water. 🏥 Healthier communities.**