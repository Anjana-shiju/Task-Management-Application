const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  taskType: { 
    type: String, 
    enum: ["today", "daily", "weekly"], // ഈ മൂന്ന് വാല്യൂസ് മാത്രമേ സ്വീകരിക്കൂ
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["pending", "done"],
    default: "pending" 
  },
  lastCompletedAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true }); // createdAt, updatedAt എന്നിവ താനേ വരാൻ

// ⚠️ സ്കീമയെ മോഡലാക്കി മാറ്റി എക്സ്പോർട്ട് ചെയ്യുന്നു
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;






