import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTableVariant1637179060848 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE variant DROP COLUMN option1, DROP COLUMN option2, DROP COLUMN option3;");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE variant ADD COLUMN option1 varchar(255), ADD COLUMN option2 varchar(255), ADD COLUMN option3 varchar(255);",
    );
  }
}
