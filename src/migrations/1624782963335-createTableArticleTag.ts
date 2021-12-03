import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createTableArticleTag1624782963335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );
    queryRunner.clearSqlMemory();
    await queryRunner.createForeignKey(
      'article_tag',
      new TableForeignKey({
        columnNames: ['tagId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tag',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'article_tag',
      new TableForeignKey({
        columnNames: ['articleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'article',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('article_tag');
  }
}
