# AI Tools - Garbage Sorting Assistant

An AI-powered platform for waste classification and energy analysis, featuring user authentication and a points system.

## Features

- 🗑️ Garbage sorting with AI
- ⚡ Energy analysis tools
- 🔒 User authentication
- 💡 Modern UI/UX
- 📸 Image-based waste classification using Google Gemini AI
- 🔄 Points system with daily resets
- 🔓 PRO features unlock system

## Getting Started

### Prerequisites
1. Node.js and npm installed
2. Supabase account
3. Google Cloud account (for Gemini API)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new project in Supabase
   - Run the SQL commands provided in `database/schema.sql` to create the required tables
   - Enable Google Auth in Authentication settings
   - Add your domain to the allowed URLs in Authentication settings

5. Start the development server:
```bash
npm run dev
```

### Deployment
1. Create a Vercel account and link your repository
2. Add the following environment variables in Vercel:
   - `VITE_GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy your application

## Technologies Used

- React + TypeScript
- Vite
- Tailwind CSS
- Google Gemini AI
- Supabase Auth
- React Router

## Contributing

Feel free to open issues and pull requests for any improvements.

## License
This project is licensed under the MIT License. 