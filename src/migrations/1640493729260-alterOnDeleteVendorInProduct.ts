import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class alterOnDeleteVendorInProduct1640493729260 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product DROP FOREIGN KEY FK_921582066aa70b502e78ea92012");
    await queryRunner.clearSqlMemory();
    const foreignKeyVendor = new TableForeignKey({
      columnNames: ["vendorId"],
      referencedColumnNames: ["id"],
      referencedTableName: "vendor",
      onDelete: "SET NULL",
    });
    await queryRunner.createForeignKey("product", foreignKeyVendor);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product DROP FOREIGN KEY FK_921582066aa70b502e78ea92012");
    await queryRunner.clearSqlMemory();
    const foreignKeyVendor = new TableForeignKey({
      columnNames: ["vendorId"],
      referencedColumnNames: ["id"],
      referencedTableName: "vendor",
    });
    await queryRunner.createForeignKey("product", foreignKeyVendor);
  }
}
