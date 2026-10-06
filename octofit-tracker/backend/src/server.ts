import express from 'express';
import { connectDatabase } from './config/database.js';
import { Activity } from './models/activity.js';
import { Leaderboard } from './models/leaderboard.js';
import { Team } from './models/team.js';
import { User } from './models/user.js';
import { Workout } from './models/workout.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().select('-passwordHash').populate('team', 'name'));
});
app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().populate('members', 'name email'));
});
app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().populate('user', 'name'));
});
app.get('/api/leaderboard/', async (_request, response) => {
  response.json(
    await Leaderboard.find()
      .sort({ rank: 1 })
      .populate('user', 'name')
      .populate('team', 'name'),
  );
});
app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find());
});

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('API request failed:', error);
    response.status(500).json({ error: 'Internal server error' });
  },
);

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`OctoFit Tracker API listening at ${apiBaseUrl}`);
    });
  } catch (error) {
    console.error('Unable to start OctoFit Tracker API:', error);
    process.exitCode = 1;
  }
}

await startServer();
