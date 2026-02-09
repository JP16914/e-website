"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const products_service_1 = require("../products/products.service");
const users_service_1 = require("../users/users.service");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
try {
    fs.writeFileSync('seed_log.txt', 'Script loaded.\n');
}
catch (e) {
}
async function bootstrap() {
    var _a;
    console.log('Connecting to database...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    console.log('Database connected.');
    const productsService = app.get(products_service_1.ProductsService);
    const usersService = app.get(users_service_1.UsersService);
    console.log('Seeding started...');
    function parseCSVLine(text) {
        const result = [];
        let start = 0;
        let index = 0;
        let inQuote = false;
        for (index = 0; index < text.length; index++) {
            const char = text[index];
            if (char === '"') {
                inQuote = !inQuote;
            }
            else if (char === ',' && !inQuote) {
                let field = text.substring(start, index);
                if (field.startsWith('"') && field.endsWith('"')) {
                    field = field.slice(1, -1);
                    field = field.replace(/""/g, '"');
                }
                result.push(field);
                start = index + 1;
            }
        }
        let field = text.substring(start);
        if (field.startsWith('"') && field.endsWith('"')) {
            field = field.slice(1, -1).replace(/""/g, '"');
        }
        result.push(field);
        return result;
    }
    try {
        const productsPath = path.join(process.cwd(), 'data', 'products.csv');
        if (fs.existsSync(productsPath)) {
            console.log('Reading products.csv...');
            const fileContent = fs.readFileSync(productsPath, 'utf-8');
            const lines = fileContent.split(/\r?\n/);
            console.log(`Found ${lines.length - 1} product lines.`);
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim())
                    continue;
                const cols = parseCSVLine(lines[i]);
                if (cols.length < 10)
                    continue;
                const p = {
                    name: cols[1],
                    main_category: cols[2],
                    sub_category: cols[3],
                    image: cols[4],
                    ratings: cols[6],
                    no_of_ratings: cols[7],
                    discount_price: cols[8],
                    actual_price: cols[9]
                };
                const discountPriceCents = parsePrice(p.discount_price);
                const actualPriceCents = parsePrice(p.actual_price);
                const rating = parseFloat(p.ratings) || 0;
                const reviewCount = parseInt((_a = p.no_of_ratings) === null || _a === void 0 ? void 0 : _a.replace(/,/g, ''), 10) || 0;
                const productDto = {
                    name: p.name,
                    description: p.name,
                    mainCategory: p.main_category,
                    subCategory: p.sub_category,
                    actualPriceCents,
                    discountPriceCents,
                    stock: 100,
                    status: 'ACTIVE',
                    images: [p.image],
                    rating,
                    reviewCount,
                };
                try {
                    await productsService.create(productDto);
                }
                catch (e) {
                }
            }
        }
    }
    catch (e) {
        console.error('Error processing products:', e);
        fs.writeFileSync('seed_error.txt', `Products Error: ${e}\n`);
    }
    try {
        const usersPath = path.join(process.cwd(), 'data', 'users.csv');
        if (fs.existsSync(usersPath)) {
            console.log('Reading users.csv...');
            const fileContent = fs.readFileSync(usersPath, 'utf-8');
            const lines = fileContent.split(/\r?\n/);
            console.log(`Found ${lines.length - 1} user lines.`);
            const defaultPasswordHash = await bcrypt.hash('password123', 10);
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim())
                    continue;
                const cols = parseCSVLine(lines[i]);
                if (cols.length < 10)
                    continue;
                const u = {
                    firstName: cols[2],
                    lastName: cols[3],
                    phone: cols[7],
                    email: cols[9]
                };
                const userDto = {
                    email: u.email,
                    passwordHash: defaultPasswordHash,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    phone: u.phone,
                    role: 'USER',
                    status: 'ACTIVE',
                };
                try {
                    const existing = await usersService.findByEmail(u.email);
                    if (!existing) {
                        await usersService.create(userDto);
                    }
                }
                catch (e) {
                }
            }
        }
    }
    catch (e) {
        console.error('Error processing users:', e);
        fs.writeFileSync('seed_error.txt', `Users Error: ${e}\n${fs.readFileSync('seed_error.txt') || ''}`);
    }
    console.log('Seeding completed.');
    fs.writeFileSync('seed_status.txt', 'SEED_COMPLETE');
    await app.close();
}
function parsePrice(priceStr) {
    if (!priceStr)
        return 0;
    const cleanStr = priceStr.replace(/[₹,]/g, '').trim();
    const price = parseFloat(cleanStr);
    return isNaN(price) ? 0 : Math.round(price * 100);
}
bootstrap();
//# sourceMappingURL=seed.js.map