import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class addForeignKeyProduct1638329609861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["productId"],
      referencedColumnNames: ["id"],
      referencedTableName: "product",
    });
    await queryRunner.createForeignKey("product_collection", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_74939f2405997a66eab143bf3dc");
  }
}
