import { MigrationInterface, QueryRunner } from "typeorm";

export class addDeviceIdForUser1635782638797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN IF EXISTS deviceId;`);
    await queryRunner.query(`ALTER TABLE user ADD COLUMN deviceId varchar(200);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE user DROP COLUMN deviceId`);
  }
}
