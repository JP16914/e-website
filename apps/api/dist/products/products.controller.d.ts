import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    findRelated(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
