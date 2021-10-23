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
exports.createTableArticleTag1624782963335 = void 0;
const typeorm_1 = require("typeorm");
class createTableArticleTag1624782963335 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'article_tag',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'tagId',
                        type: 'int',
                    },
                    {
                        name: 'articleId',
                        type: 'int',
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
                ],
            }), true);
            queryRunner.clearSqlMemory();
            yield queryRunner.createForeignKey('article_tag', new typeorm_1.TableForeignKey({
                columnNames: ['tagId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tag',
                onDelete: 'CASCADE',
            }));
            yield queryRunner.createForeignKey('article_tag', new typeorm_1.TableForeignKey({
                columnNames: ['articleId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'article',
                onDelete: 'CASCADE',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable('article_tag');
        });
    }
}
exports.createTableArticleTag1624782963335 = createTableArticleTag1624782963335;
