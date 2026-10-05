const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Import Mongoose Models
const UserModel = require('../models/User');
const CourseModel = require('../models/Course');
const EnrollmentModel = require('../models/Enrollment');
const FeedbackModel = require('../models/Feedback');
const RoadmapModel = require('../models/Roadmap');
const CareerModel = require('../models/Career');
const ChatHistoryModel = require('../models/ChatHistory');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

let isMongoConnected = false;
let memoryStore = {
  users: [],
  courses: [],
  enrollments: [],
  feedback: [],
  roadmaps: [],
  careers: [],
  chathistories: []
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadFileStore() {
  ensureDataDir();
  if (fs.existsSync(STORE_FILE)) {
    try {
      const content = fs.readFileSync(STORE_FILE, 'utf8');
      memoryStore = JSON.parse(content);
    } catch (e) {
      console.warn('[DataStore] Could not parse existing store.json, initializing fresh store.');
    }
  }
}

function saveFileStore() {
  ensureDataDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
}

// Immediately load on startup
loadFileStore();

// Generate simple unique IDs for fallback store
function genId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Emulated Collection Wrapper that behaves identically to Mongoose Model
class FallbackCollection {
  constructor(name) {
    this.name = name;
  }

  get items() {
    return memoryStore[this.name] || [];
  }

  set items(val) {
    memoryStore[this.name] = val;
  }

  async find(query = {}) {
    let results = this.items.filter(item => {
      for (const [key, val] of Object.entries(query)) {
        if (key === '$or' && Array.isArray(val)) {
          const matchOr = val.some(subQuery => {
            return Object.entries(subQuery).every(([k, v]) => {
              if (v instanceof RegExp) return v.test(item[k]);
              return item[k] === v;
            });
          });
          if (!matchOr) return false;
          continue;
        }
        if (val instanceof RegExp) {
          if (!val.test(item[key])) return false;
        } else if (typeof val === 'object' && val !== null) {
          if (val.$in && !val.$in.includes(item[key])) return false;
          if (val.$gte !== undefined && item[key] < val.$gte) return false;
          if (val.$lte !== undefined && item[key] > val.$lte) return false;
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });

    // Provide query builder chainable functions (sort, limit, skip, select, lean)
    const chainable = {
      _sort: null,
      _limit: null,
      _skip: 0,
      sort(sortObj) {
        chainable._sort = sortObj;
        return chainable;
      },
      limit(n) {
        chainable._limit = n;
        return chainable;
      },
      skip(n) {
        chainable._skip = n;
        return chainable;
      },
      select() {
        return chainable;
      },
      lean() {
        return chainable;
      },
      then(resolve, reject) {
        let sorted = [...results];
        if (chainable._sort) {
          const [field, order] = Object.entries(chainable._sort)[0];
          sorted.sort((a, b) => {
            if (a[field] < b[field]) return order === 1 ? -1 : 1;
            if (a[field] > b[field]) return order === 1 ? 1 : -1;
            return 0;
          });
        }
        if (chainable._skip > 0) {
          sorted = sorted.slice(chainable._skip);
        }
        if (chainable._limit) {
          sorted = sorted.slice(0, chainable._limit);
        }
        return Promise.resolve(sorted).then(resolve, reject);
      }
    };
    return chainable;
  }

  async findOne(query = {}) {
    const res = await this.find(query);
    return res[0] || null;
  }

  async findById(id) {
    return this.findOne({ _id: String(id) });
  }

  async create(doc) {
    const newDoc = {
      _id: doc._id ? String(doc._id) : genId(),
      ...doc,
      createdAt: doc.createdAt || new Date(),
      updatedAt: new Date()
    };
    this.items.push(newDoc);
    saveFileStore();
    return newDoc;
  }

  async insertMany(docs) {
    const inserted = docs.map(d => ({
      _id: d._id ? String(d._id) : genId(),
      ...d,
      createdAt: d.createdAt || new Date(),
      updatedAt: new Date()
    }));
    this.items.push(...inserted);
    saveFileStore();
    return inserted;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (idx === -1) return null;
    
    // Support $set operator or direct object
    const payload = update.$set || update;
    this.items[idx] = {
      ...this.items[idx],
      ...payload,
      updatedAt: new Date()
    };
    saveFileStore();
    return this.items[idx];
  }

  async findOneAndUpdate(query, update, options = {}) {
    const existing = await this.findOne(query);
    if (!existing) {
      if (options.upsert) {
        return this.create({ ...query, ...(update.$set || update) });
      }
      return null;
    }
    return this.findByIdAndUpdate(existing._id, update, options);
  }

  async findByIdAndDelete(id) {
    const idx = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (idx === -1) return null;
    const removed = this.items.splice(idx, 1)[0];
    saveFileStore();
    return removed;
  }

  async countDocuments(query = {}) {
    const res = await this.find(query);
    return res.length;
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      const count = this.items.length;
      this.items = [];
      saveFileStore();
      return { deletedCount: count };
    }
    const before = this.items.length;
    this.items = this.items.filter(item => {
      for (const [k, v] of Object.entries(query)) {
        if (item[k] === v) return false;
      }
      return true;
    });
    saveFileStore();
    return { deletedCount: before - this.items.length };
  }
}

// Proxies for Collections
const fallbackDB = {
  User: new FallbackCollection('users'),
  Course: new FallbackCollection('courses'),
  Enrollment: new FallbackCollection('enrollments'),
  Feedback: new FallbackCollection('feedback'),
  Roadmap: new FallbackCollection('roadmaps'),
  Career: new FallbackCollection('careers'),
  ChatHistory: new FallbackCollection('chathistories')
};

async function initDatabase() {
  loadFileStore();
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/course_rec_db';

  try {
    mongoose.set('strictQuery', false);
    // Timeout quickly so local execution never hangs
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log(`[Database] Connected successfully to MongoDB at ${uri}`);
  } catch (err) {
    isMongoConnected = false;
    console.log('[Database] MongoDB connection bypassed/unavailable. Running on High-Performance Resilient DataStore (store.json).');
  }

  // Ensure initial seed is loaded if empty
  const CourseRepo = getModel('Course');
  const count = await CourseRepo.countDocuments();
  if (count === 0) {
    console.log('[Database] Store is empty. Running initial dataset seed...');
    const seed = require('./seed');
    await seed.runSeed();
  }
}

function getModel(name) {
  if (isMongoConnected) {
    switch (name) {
      case 'User': return UserModel;
      case 'Course': return CourseModel;
      case 'Enrollment': return EnrollmentModel;
      case 'Feedback': return FeedbackModel;
      case 'Roadmap': return RoadmapModel;
      case 'Career': return CareerModel;
      case 'ChatHistory': return ChatHistoryModel;
    }
  }
  return fallbackDB[name];
}

module.exports = {
  initDatabase,
  get User() { return getModel('User'); },
  get Course() { return getModel('Course'); },
  get Enrollment() { return getModel('Enrollment'); },
  get Feedback() { return getModel('Feedback'); },
  get Roadmap() { return getModel('Roadmap'); },
  get Career() { return getModel('Career'); },
  get ChatHistory() { return getModel('ChatHistory'); },
  isMongoConnected: () => isMongoConnected
};
