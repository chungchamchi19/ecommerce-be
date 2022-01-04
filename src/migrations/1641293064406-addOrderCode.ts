import {MigrationInterface, QueryRunner} from "typeorm";

export class addOrderCode1641293064406 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` ADD COLUMN code varchar(500) unique");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN code");
    }


}
