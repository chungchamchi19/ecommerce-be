import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createWard1640407340969 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "ward",
        columns: [
          {
            name: "id",
            type: "varchar(5)",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "districtId",
            type: "varchar(5)",
          },
        ],
      }),
      true,
    );
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["districtId"],
      referencedColumnNames: ["id"],
      referencedTableName: "district",
    });
    await queryRunner.createForeignKey("ward", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("ward");
  }
}
