import {MigrationInterface, QueryRunner} from "typeorm";

export class addDetailAdressandCommentInOderTable1640503820488 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` ADD COLUMN detailCustomerAddress varchar(1000) DEFAULT NULL;');
        await queryRunner.query('ALTER TABLE `order` ADD COLUMN comment varchar(1000) DEFAULT NULL')    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` DROP COLUMN detailCustomerAddress');
        await queryRunner.query('ALTER TABLE `order` DROP COLUMN comment');
    }

}
