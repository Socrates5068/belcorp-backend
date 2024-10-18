import mongoose, { Schema, Document as docs } from "mongoose";

export interface ICampaign extends docs {
  name: string;
  startDate: Date;
  endDate: Date;
}

const campaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Campaign = mongoose.model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
