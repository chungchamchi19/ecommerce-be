import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTableOption1636992855771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "option",
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
            name: "productId",
            type: "int",
          },
          {
            name: "position",
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
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["productId"],
      referencedColumnNames: ["id"],
      referencedTableName: "product",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("option", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("option");
  }
}
