import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'userAgentSafety',
  timestamps: true,
})
export class UserAgentSafety extends Document {
  @Prop({ type: String, required: true, unique: true, index: true })
  userAgent!: string;

  @Prop({ type: Boolean, required: true })
  safe!: boolean;
}

export const UserAgentSafetySchema = SchemaFactory.createForClass(UserAgentSafety);

UserAgentSafetySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
