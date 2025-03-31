import mongoose, { Schema, Document } from "mongoose";

export interface IMaterial extends Document {
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  faculty: string;
  department: string;
  courseCode: string;
  courseName: string;
  year: number;
  semester: number;
  uploadedBy: mongoose.Types.ObjectId;
  downloads: number;
  ratings: {
    userId: mongoose.Types.ObjectId;
    rating: number;
  }[];
  comments: {
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  tags: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const materialSchema = new Schema<IMaterial>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  downloads: {
    type: Number,
    default: 0
  },
  ratings: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  comments: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Material = mongoose.model<IMaterial>("Material", materialSchema);
