const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const serverSchema = new mongoose.Schema({
  serverId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['creating', 'running', 'stopped', 'suspended', 'error', 'deleted'],
    default: 'creating'
  },
  minecraftVersion: {
    type: String,
    required: true,
    default: '1.20.1'
  },
  serverType: {
    type: String,
    enum: ['vanilla', 'bukkit', 'spigot', 'paper', 'forge', 'fabric'],
    default: 'vanilla'
  },
  port: {
    type: Number,
    unique: true,
    sparse: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  containerId: {
    type: String,
    default: null
  },
  configuration: {
    maxPlayers: {
      type: Number,
      default: 20
    },
    difficulty: {
      type: String,
      enum: ['peaceful', 'easy', 'normal', 'hard'],
      default: 'normal'
    },
    gameMode: {
      type: String,
      enum: ['survival', 'creative', 'adventure', 'spectator'],
      default: 'survival'
    },
    pvp: {
      type: Boolean,
      default: true
    },
    whitelist: {
      type: Boolean,
      default: false
    },
    motd: {
      type: String,
      default: 'A Minecraft Server'
    }
  },
  stats: {
    playersOnline: {
      type: Number,
      default: 0
    },
    maxPlayersReached: {
      type: Number,
      default: 0
    },
    totalPlaytime: {
      type: Number,
      default: 0 // in minutes
    },
    uptime: {
      type: Number,
      default: 0 // in minutes
    },
    lastPlayerActivity: {
      type: Date,
      default: null
    }
  },
  backups: [{
    name: String,
    size: Number,
    createdAt: {
      type: Date,
      default: Date.now
    },
    downloadUrl: String
  }],
  plugins: [{
    name: String,
    version: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  playerWhitelist: [String],
  playerBanlist: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastStarted: {
    type: Date,
    default: null
  },
  lastStopped: {
    type: Date,
    default: null
  }
});

serverSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique port number
serverSchema.statics.generatePort = async function() {
  const minPort = 25565;
  const maxPort = 30000;
  
  let port;
  let isUnique = false;
  
  while (!isUnique) {
    port = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
    const existingServer = await this.findOne({ port });
    if (!existingServer) {
      isUnique = true;
    }
  }
  
  return port;
};

// Check if server is expired
serverSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

module.exports = mongoose.model('Server', serverSchema);