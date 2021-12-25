import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProvide1640407303930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "province",
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("province");
  }
}
