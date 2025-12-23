import { Schema, models, model } from 'mongoose';

const BuildingSchema = new Schema({
  // Core building information
  name: { type: String, required: true },
  type: { type: String },
  location: { type: String },
  description: { type: String },
  price: { type: Number },
  
  // Like system
  likes: {
    type: [String], // Array of visitorIds (browser fingerprints)
    default: []
  },
  likeCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  // This ensures that when converting to JSON, virtuals are included
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster lookups
BuildingSchema.index({ _id: 1 });

// Pre-save hook to update likeCount based on likes array length
BuildingSchema.pre('save', function(next) {
  this.likeCount = this.likes.length;
  this.updatedAt = new Date();
  next();
});

const Building = models.Building || model('Building', BuildingSchema);

export default Building;
