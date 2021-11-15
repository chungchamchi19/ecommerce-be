import { MigrationInterface, QueryRunner } from "typeorm";

export class alterMediaTableChangeField1636945309070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE media DROP COLUMN targetId, DROP COLUMN targetType");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE media ADD COLUMN targetId int, ADD COLUMN targetType varchar(255)");
  }
}
