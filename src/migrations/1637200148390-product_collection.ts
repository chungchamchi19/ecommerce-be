import { MigrationInterface, QueryRunner, Table, TreeLevelColumn } from "typeorm";

export class productCollection1637200148390 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_collection",
        columns: [
          {
            name: " id",
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_collection");
  }
}
