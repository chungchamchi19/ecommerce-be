import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createDistrict1640407330797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "district",
        columns: [
          {
            name: "id",
            type: "varchar(5)",
            isPrimary: true,
            isGenerated: true,
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
            name: "provinceId",
            type: "varchar(5)",
          },
        ],
      }),
      true,
    );
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["provinceId"],
      referencedColumnNames: ["id"],
      referencedTableName: "province",
    });
    await queryRunner.createForeignKey("district", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("district");
  }
}
