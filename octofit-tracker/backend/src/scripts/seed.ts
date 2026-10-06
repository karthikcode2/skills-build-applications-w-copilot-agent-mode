import mongoose from 'mongoose';
import { Activity } from '../models/activity.js';
import { Leaderboard } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      User.deleteMany({}),
      Team.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [trailBlazers, cityCyclers] = await Team.insertMany([
      { name: 'Trail Blazers', description: 'Outdoor running and hiking enthusiasts.' },
      { name: 'City Cyclers', description: 'Cyclists building strength and endurance together.' },
    ]);

    const [maya, noah, ava, liam] = await User.insertMany([
      {
        name: 'Maya Chen',
        email: 'maya.chen@example.com',
        passwordHash: 'seeded-password-hash-maya',
        team: trailBlazers._id,
      },
      {
        name: 'Noah Williams',
        email: 'noah.williams@example.com',
        passwordHash: 'seeded-password-hash-noah',
        team: trailBlazers._id,
      },
      {
        name: 'Ava Patel',
        email: 'ava.patel@example.com',
        passwordHash: 'seeded-password-hash-ava',
        team: cityCyclers._id,
      },
      {
        name: 'Liam Garcia',
        email: 'liam.garcia@example.com',
        passwordHash: 'seeded-password-hash-liam',
        team: cityCyclers._id,
      },
    ]);

    await Promise.all([
      Team.updateOne(
        { _id: trailBlazers._id },
        { $set: { members: [maya._id, noah._id] } },
      ),
      Team.updateOne(
        { _id: cityCyclers._id },
        { $set: { members: [ava._id, liam._id] } },
      ),
    ]);

    await Activity.insertMany([
      {
        user: maya._id,
        type: 'running',
        durationMinutes: 38,
        distanceKm: 6.2,
        completedAt: new Date('2026-10-01T07:30:00Z'),
      },
      {
        user: noah._id,
        type: 'walking',
        durationMinutes: 52,
        distanceKm: 4.8,
        completedAt: new Date('2026-10-02T08:00:00Z'),
      },
      {
        user: ava._id,
        type: 'cycling',
        durationMinutes: 64,
        distanceKm: 21.5,
        completedAt: new Date('2026-10-03T06:45:00Z'),
      },
      {
        user: liam._id,
        type: 'strength',
        durationMinutes: 45,
        completedAt: new Date('2026-10-04T17:15:00Z'),
      },
      {
        user: maya._id,
        type: 'running',
        durationMinutes: 42,
        distanceKm: 7.1,
        completedAt: new Date('2026-10-05T07:20:00Z'),
      },
    ]);

    await Leaderboard.insertMany([
      { user: maya._id, team: trailBlazers._id, points: 420, rank: 1 },
      { user: ava._id, team: cityCyclers._id, points: 390, rank: 2 },
      { user: noah._id, team: trailBlazers._id, points: 340, rank: 3 },
      { user: liam._id, team: cityCyclers._id, points: 315, rank: 4 },
    ]);

    await Workout.insertMany([
      {
        title: 'Steady Trail Run',
        description: 'Build aerobic endurance with a comfortable-paced outdoor run.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 30,
        targetActivities: ['running'],
      },
      {
        title: 'Tempo Ride',
        description: 'Alternate steady cycling with short, challenging tempo intervals.',
        category: 'cardio',
        difficulty: 'intermediate',
        durationMinutes: 45,
        targetActivities: ['cycling'],
      },
      {
        title: 'Full-Body Strength',
        description: 'A balanced strength session using controlled, compound movements.',
        category: 'strength',
        difficulty: 'intermediate',
        durationMinutes: 40,
        targetActivities: ['strength'],
      },
      {
        title: 'Recovery Walk',
        description: 'An easy walk to support active recovery and daily movement.',
        category: 'recovery',
        difficulty: 'beginner',
        durationMinutes: 25,
        targetActivities: ['walking'],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedDatabase();
