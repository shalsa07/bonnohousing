
import { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  image: { type: String },
  role: { type: String, enum: ['user', 'client', 'admin'], default: 'user' },
});

// If the user is the admin, set their role to 'admin'
UserSchema.pre('save', function (next) {
  if (this.email === 'victorchelemu@gmail.com') {
    this.role = 'admin';
  }
  next();
});

const User = models.User || model('User', UserSchema);
export default User;
