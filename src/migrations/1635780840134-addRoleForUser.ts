import { MigrationInterface, QueryRunner } from "typeorm";

export class addRoleForUser1635780840134 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN IF EXISTS role;`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN role varchar(200) DEFAULT 'user';`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN role`);
  }
}
