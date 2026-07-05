const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Please add a slug'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft'
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  featuredImage: {
    type: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
