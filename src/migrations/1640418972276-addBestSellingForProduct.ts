import { MigrationInterface, QueryRunner } from "typeorm";

export class addBestSellingForProduct1640418972276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product ADD COLUMN bestSelling boolean DEFAULT false");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product DROP COLUMN bestSelling");
  }
}
