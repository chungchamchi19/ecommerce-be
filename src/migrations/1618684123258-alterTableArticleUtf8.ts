import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableArticleUtf81618684123258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE article MODIFY COLUMN content varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content varchar`);
  }
}
