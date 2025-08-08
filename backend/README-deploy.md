Backend deployment notes:

Env variables required (Render/Railway):
- PORT=5001
- MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
- JWT_SECRET=change-me
- FRONTEND_URL=https://your-site.netlify.app
- SEED_DB=false

Start command: npm start
Root directory: backend

