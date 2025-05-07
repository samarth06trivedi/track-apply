# visit the live website at : https://track-apply-omega.vercel.app/
# 📌 TrackApply – Job Application Tracker

TrackApply is a full-stack web application that helps users manage and monitor their job applications through distinct pipelines — In Progress, Offers, and Rejections. With an intuitive dashboard and smooth form-based UI, users can add, edit, and organize job application data efficiently.

---

## 🔧 Features

- 📋 Add and track job applications by company, role, job type, and status
- ✅ Move applications to “Offers” or “Rejections” sections with proper context
- ✏️ Edit existing offers and rejections with detailed info (e.g., stipend, CTC, stage, reason, remarks)
- 🌗 Fully responsive UI with dark mode support
- ⚡ Fast interactions with smooth API-based updates
- 🧠 Intelligent filtering and categorization

---

## 🖼️ Dashboard Preview

```
In Progress | Offers | Rejections
+-----------+--------+-----------+
| Company   | Role   | Status    |
| --------- | ------ | --------- |
| Google    | SDE    | Applied   |
```

---

## 🏗️ Tech Stack

| Tech       | Purpose                     |
|------------|-----------------------------|
| Next.js    | Full-stack framework        |
| TypeScript | Static typing               |
| Tailwind   | UI styling                  |
| MongoDB    | Database                    |
| AWS Textract (optional) | Resume parsing |
| OpenRouter + DeepSeek | JD parsing logic |
| Shadcn/UI  | Beautiful UI components     |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/track-apply.git
cd track-apply
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with:
```env
DATABASE_URL=mongodb+srv://...
NEXTAUTH_SECRET=your_secret
OPENROUTER_API_KEY=your_openrouter_key
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### 4. Run the App
```bash
npm run dev
```

---

## ✨ Folder Structure

```
src/
├── app/
│   └── dashboard/         → Main dashboard UI
├── components/
│   ├── offer-form/        → Form to add/edit offers
│   ├── rejection-form/    → Form to add/edit rejections
│   └── context-menu/      → Custom context menu
├── lib/                   → Utility functions
├── pages/                 → Next.js pages (if applicable)
```

---

## 🛠️ Future Enhancements

- 🔍 Resume/job description parsing with AI match %
- 📈 Analytics dashboard with success/failure trends
- 📥 Application import from LinkedIn, Glassdoor
- 🔔 Notification reminders for follow-ups

---

## 🧑‍💻 Author

**Samarth Trivedi**  
Feel free to reach out or contribute!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
