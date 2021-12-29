import {MigrationInterface, QueryRunner} from "typeorm";

export class addInfoinShopInfo1640774366022 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE shop_infor ADD COLUMN address text DEFAULT  NULL;`);
        await queryRunner.query(`ALTER TABLE shop_infor ADD COLUMN instagram text DEFAULT  NULL;`);
        await queryRunner.query(`ALTER TABLE shop_infor ADD COLUMN youtube text DEFAULT  NULL;`);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE shop_infor DROP COLUMN address`);
        await queryRunner.query(`ALTER TABLE shop_infor DROP COLUMN instagram`);
        await queryRunner.query(`ALTER TABLE shop_infor DROP COLUMN youtube`);
      }
}
