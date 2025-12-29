import mongoose from 'mongoose';

const SummarySchema = new mongoose.Schema({
    originalText: {
        type: String,
        required: true,
    },
    summaryText: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Summary', SummarySchema);
