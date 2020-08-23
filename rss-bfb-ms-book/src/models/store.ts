import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StoreAttrs {
  id: string;
  name: string;
}

interface StoreModel extends mongoose.Model<StoreDoc> {
  build(attrs: StoreAttrs): StoreDoc;
}

export interface StoreDoc extends mongoose.Document {
  name: string;
  version: number;
}

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome da Loja',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

StoreSchema.set('versionKey', 'version');
StoreSchema.plugin(updateIfCurrentPlugin);

StoreSchema.statics.build = (attrs: StoreAttrs) => {
  return new Store({
    _id: attrs.id,
    name: attrs.name,
  });
};

const Store = mongoose.model<StoreDoc, StoreModel>('Store', StoreSchema);

export { Store };
