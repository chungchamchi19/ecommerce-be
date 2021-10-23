"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleTag = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const article_1 = require("../article");
const tag_1 = require("../tag");
let ArticleTag = class ArticleTag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ArticleTag.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ArticleTag.prototype, "tagId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ArticleTag.prototype, "articleId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ArticleTag.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ArticleTag.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], ArticleTag.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.ManyToOne(() => article_1.Article, (article) => article.id, { cascade: true }),
    typeorm_1.JoinColumn({ name: 'articleId', referencedColumnName: 'id' }),
    __metadata("design:type", article_1.Article)
], ArticleTag.prototype, "article", void 0);
__decorate([
    typeorm_1.ManyToOne(() => tag_1.Tag, (tag) => tag.id, { cascade: true }),
    typeorm_1.JoinColumn({ name: 'tagId', referencedColumnName: 'id' }),
    __metadata("design:type", tag_1.Tag)
], ArticleTag.prototype, "tag", void 0);
ArticleTag = __decorate([
    typeorm_1.Entity()
], ArticleTag);
exports.ArticleTag = ArticleTag;
