import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface StoreAttrs {
  name: string;
  collection_price: number;
}

interface StoreModel extends mongoose.Model<StoreDoc> {
  build(attrs: StoreAttrs): StoreDoc;
}

export interface StoreDoc extends mongoose.Document {
  name: string;
  collection_price: number;
  version: number;
}

const StoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome da Loja',
    },
    collection_price: {
      type: Number,
      required: false,
      description: 'Valor do Arcevo',
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
  return new Store(attrs);
};

const Store = mongoose.model<StoreDoc, StoreModel>('Store', StoreSchema);

export { Store };
