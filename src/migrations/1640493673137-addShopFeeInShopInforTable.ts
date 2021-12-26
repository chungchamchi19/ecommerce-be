import { MigrationInterface, QueryRunner } from "typeorm";

export class addShopFeeInShopInforTable1640493673137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE shop_infor ADD COLUMN shipFee int DEFAULT 0;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE shop_infor DROP COLUMN shipFee`);
  }
}
