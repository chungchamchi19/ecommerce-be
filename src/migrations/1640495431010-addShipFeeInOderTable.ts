import {MigrationInterface, QueryRunner} from "typeorm";

export class addShipFeeInOderTable1640495431010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` ADD COLUMN shipFee int DEFAULT 0;');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` DROP COLUMN shipFee');
    }

}
