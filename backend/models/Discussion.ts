import mongoose, { Schema, Document } from "mongoose";

export interface IDiscussion extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  courseCode: string;
  replies: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    likes: mongoose.Types.ObjectId[];
  }[];
  likes: mongoose.Types.ObjectId[];
  tags: string[];
  createdAt: Date;
}

const discussionSchema = new Schema<IDiscussion>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseCode: {
    type: String,
    required: true
  },
  replies: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Discussion = mongoose.model<IDiscussion>("Discussion", discussionSchema);
