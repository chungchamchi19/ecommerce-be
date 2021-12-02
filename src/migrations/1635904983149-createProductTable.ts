import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createProductTable1635904983149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "status",
            type: "varchar",
          },
          {
            name: "vendorId",
            type: "int",
            isNullable: true,
          },
          {
            name: "price",
            type: "int",
            default: 0,
          },
          {
            name: "comparePrice",
            type: "int",
            default: 0,
          },
          {
            name: "featureImageId",
            type: "int",
          },
          {
            name: "url",
            type: "varchar",
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
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["featureImageId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("product", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product");
  }
}
