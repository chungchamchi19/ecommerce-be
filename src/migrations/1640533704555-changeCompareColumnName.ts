import {MigrationInterface, QueryRunner} from "typeorm";

export class changeCompareColumnName1640533704555 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` CHANGE subTotal totalComparePrice int(11)'); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE `order` CHANGE totalComparePrice subTotal int(11)'); 
    }

}
