import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTableAuth1641186688167 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN avatar`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN avatar INT`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN phone VARCHAR(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user MODIFY COLUMN avatar VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE user DROP COLUMN phone`);
  }
}
