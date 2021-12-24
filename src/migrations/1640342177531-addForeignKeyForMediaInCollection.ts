import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class addForeignKeyForMediaInCollection1640342177531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["thumbnailId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
    });
    await queryRunner.createForeignKey("collection", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE collection DROP FOREIGN KEY FK_e4fab05bf9fbbd1d9e40e838d88");
  }
}
