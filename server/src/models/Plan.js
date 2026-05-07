import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		details: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			default: "Personal",
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High"],
			default: "Medium",
		},
		dueDate: {
			type: Date,
			required: true,
		},
		alarmAt: Date,
		status: {
			type: String,
			enum: ["active", "completed"],
			default: "active",
		},
		inputType: {
			type: String,
			enum: ["text", "voice", "video"],
			default: "text",
		},
		textContent: String,
		voiceUrl: String,
		videoUrl: String,
		lastReminderSentAt: Date,
	},
	{ timestamps: true },
);

planSchema.virtual("derivedStatus").get(function deriveStatus() {
	if (this.status === "completed") {
		return "completed";
	}

	return this.dueDate && this.dueDate.getTime() < Date.now()
		? "overdue"
		: "active";
});

planSchema.set("toJSON", { virtuals: true });
planSchema.set("toObject", { virtuals: true });

export const Plan = mongoose.model("Plan", planSchema);
