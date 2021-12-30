import { MigrationInterface, QueryRunner } from "typeorm";

export class alterDescriptionTypeInProduct1640881206525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE product MODIFY COLUMN description LONGTEXT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE product MODIFY COLUMN description VARCHAR`);
  }
}
