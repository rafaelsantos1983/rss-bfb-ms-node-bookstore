import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { StoreDoc } from './store';

interface BookAttrs {
  name: string;
  price: number;
  store: StoreDoc;
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

export interface BookDoc extends mongoose.Document {
  name: string;
  price: number;
  version: number;
  store: StoreDoc;
}

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      description: 'Nome do Livro',
    },
    price: {
      type: Number,
      required: true,
      description: 'Preços do Livro',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
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

BookSchema.set('versionKey', 'version');
BookSchema.plugin(updateIfCurrentPlugin);

BookSchema.statics.build = (attrs: BookAttrs) => {
  return new Book(attrs);
};

const Book = mongoose.model<BookDoc, BookModel>('Book', BookSchema);

export { Book };
