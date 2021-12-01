import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTableOptionValueVariant1637178708206 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "option_value_variant",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "variantId",
            type: "int",
          },
          {
            name: "optionValueId",
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
    const foreignKeyOptionValue = new TableForeignKey({
      columnNames: ["optionValueId"],
      referencedColumnNames: ["id"],
      referencedTableName: "option_value",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("option_value_variant", foreignKeyOptionValue);
    queryRunner.clearSqlMemory();
    const foreignKeyVariant = new TableForeignKey({
      columnNames: ["variantId"],
      referencedColumnNames: ["id"],
      referencedTableName: "variant",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("option_value_variant", foreignKeyVariant);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("option_value_variant");
  }
}
