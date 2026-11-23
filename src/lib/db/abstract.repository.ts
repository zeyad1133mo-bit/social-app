import {Model, QueryFilter, QueryOptions,HydratedDocument, DeleteResult, UpdateQuery}from 'mongoose';


export abstract class AbstractRepository<T> {

    protected constructor(private readonly model: Model<T>) {

    }
    async create(data:T): Promise<HydratedDocument<T>>{
          return  this.model.create(data);
      }

      async getOne(filter:QueryFilter<T>): Promise<HydratedDocument<T> | null>{
          return this.model.findOne(filter);
      }
  
  
      async update(filter:QueryFilter<T>, newData: UpdateQuery<T>, options: QueryOptions<T>): Promise<HydratedDocument<T> | null>{
          return this.model.findOneAndUpdate(filter, newData, options);
      }     
     async delete(filter:QueryFilter<T>): Promise<DeleteResult | null >{
          return this.model.findOneAndDelete(filter);
      }
  } 
