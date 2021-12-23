import { MigrationInterface, QueryRunner } from "typeorm";

export class addTimeForVendor1640272619685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vendor ADD COLUMN createdAt datetime DEFAULT CURRENT_TIMESTAMP(6);`);
    await queryRunner.query(
      `ALTER TABLE vendor ADD COLUMN updatedAt datetime DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vendor DROP COLUMN createdAt`);
    await queryRunner.query(`ALTER TABLE vendor DROP COLUMN updatedAt`);
  }
}
