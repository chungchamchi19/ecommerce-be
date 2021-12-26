import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class alterOnDeleteWithMediaForeignKey1640494304842 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE variant DROP FOREIGN KEY FK_5557d37257cfe237754e191a34f");
    await queryRunner.query("ALTER TABLE collection DROP FOREIGN KEY FK_e4fab05bf9fbbd1d9e40e838d88");
    await queryRunner.query("ALTER TABLE variant MODIFY COLUMN featureImageId INT NULL");
    await queryRunner.clearSqlMemory();
    const foreignKeyMediaVariant = new TableForeignKey({
      columnNames: ["featureImageId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
      onDelete: "SET NULL",
    });
    await queryRunner.createForeignKey("variant", foreignKeyMediaVariant);
    const foreignKeyMediaCollection = new TableForeignKey({
      columnNames: ["thumbnailId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
      onDelete: "SET NULL",
    });
    await queryRunner.createForeignKey("collection", foreignKeyMediaCollection);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE variant DROP FOREIGN KEY FK_5557d37257cfe237754e191a34f");
    await queryRunner.query("ALTER TABLE collection DROP FOREIGN KEY FK_e4fab05bf9fbbd1d9e40e838d88");
    await queryRunner.query("ALTER TABLE variant MODIFY COLUMN featureImageId INT NOT NULL");
    await queryRunner.clearSqlMemory();
    const foreignKeyMediaVariant = new TableForeignKey({
      columnNames: ["featureImageId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
    });
    await queryRunner.createForeignKey("variant", foreignKeyMediaVariant);
    const foreignKeyMediaCollection = new TableForeignKey({
      columnNames: ["thumbnailId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
    });
    await queryRunner.createForeignKey("collection", foreignKeyMediaCollection);
  }
}
