import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class createTableMediaMap1636945826950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "media_map",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "mediaId",
            type: "int",
          },
          {
            name: "targetId",
            type: "int",
          },
          {
            name: "targetType",
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
      columnNames: ["mediaId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("media_map", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("media_map");
  }
}
