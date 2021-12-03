import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTableProductCollection1638542367797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_collection",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "productId",
            type: "int",
          },
          {
            name: "collectionId",
            type: "int",
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP(6)",
          },
          {
            name: "updatedAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP(6)",
            onUpdate: "CURRENT_TIMESTAMP(6)",
          },
        ],
      }),
      true,
    );
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_collection");
  }
}
