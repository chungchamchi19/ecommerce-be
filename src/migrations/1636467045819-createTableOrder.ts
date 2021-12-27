import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTableOrder1636467045819 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "order",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "userId",
            type: "int",
          },
          {
            name: "totalPrice",
            type: "int",
          },
          {
            name: "totalComparePrice",
            type: "int",
          },

          {
            name: "customerName",
            type: "varchar",
          },
          {
            name: "customerEmail",
            type: "varchar",
          },
          {
            name: "customerPhone",
            type: "varchar",
          },
          {
            name: "customerAddress",
            type: "varchar",
          },
          {
            name: "paymentMethod",
            type: "varchar",
          },

          {
            name: "status",
            type: "varchar",
          },

          {
            name: "deliveryMethod",
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
    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("order");
  }
}
