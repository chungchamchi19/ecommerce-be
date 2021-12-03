import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class addForeignKeyForVendorIdInProduct1638542700781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["vendorId"],
      referencedColumnNames: ["id"],
      referencedTableName: "vendor",
    });
    await queryRunner.createForeignKey("product", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product DROP FOREIGN KEY FK_921582066aa70b502e78ea92012");
  }
}
