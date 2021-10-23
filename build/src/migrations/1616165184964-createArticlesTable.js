"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArticlesTable1616165184964 = void 0;
const typeorm_1 = require("typeorm");
class createArticlesTable1616165184964 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'article',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'content',
                        type: 'varchar',
                    },
                    {
                        name: 'avatar',
                        type: 'varchar',
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                    },
                    {
                        name: 'isDeleted',
                        type: 'boolean',
                    },
                    {
                        name: 'userId',
                        type: 'int',
                    },
                ],
            }), true);
            queryRunner.clearSqlMemory();
            const foreignKey = new typeorm_1.TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            });
            yield queryRunner.createForeignKey('article', foreignKey);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('article');
        });
    }
}
exports.createArticlesTable1616165184964 = createArticlesTable1616165184964;
