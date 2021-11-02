import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMediaTable1635868577004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "media",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "targetId",
            type: "int",
            isNullable: true,
          },
          {
            name: "targetType",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "link",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "datetime",
          },
          {
            name: "updatedAt",
            type: "datetime",
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
    await queryRunner.dropTable("media");
  }
}
