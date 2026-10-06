import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
