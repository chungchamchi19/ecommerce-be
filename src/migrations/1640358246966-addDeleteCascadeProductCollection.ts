import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class addDeleteCascadeProductCollection1640358246966 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_962b750e1401fa3ce379cec9a59");
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_74939f2405997a66eab143bf3dc");
    await queryRunner.clearSqlMemory();
    const foreignKeyCollection = new TableForeignKey({
      columnNames: ["collectionId"],
      referencedColumnNames: ["id"],
      referencedTableName: "collection",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("product_collection", foreignKeyCollection);
    const foreignKeyProduct = new TableForeignKey({
      columnNames: ["productId"],
      referencedColumnNames: ["id"],
      referencedTableName: "product",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("product_collection", foreignKeyProduct);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_962b750e1401fa3ce379cec9a59");
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_74939f2405997a66eab143bf3dc");
    await queryRunner.clearSqlMemory();
    const foreignKeyCollection = new TableForeignKey({
      columnNames: ["collectionId"],
      referencedColumnNames: ["id"],
      referencedTableName: "collection",
    });
    await queryRunner.createForeignKey("product_collection", foreignKeyCollection);
    const foreignKeyProduct = new TableForeignKey({
      columnNames: ["productId"],
      referencedColumnNames: ["id"],
      referencedTableName: "product",
    });
    await queryRunner.createForeignKey("product_collection", foreignKeyProduct);
  }
}
