import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTableArticleLongText1618684492775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content LONGTEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content varchar`);
  }
}
