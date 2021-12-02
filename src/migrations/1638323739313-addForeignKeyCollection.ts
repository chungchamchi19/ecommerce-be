import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class addForeignKeyCollection1638323739313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["collectionId"],
      referencedColumnNames: ["id"],
      referencedTableName: "collection",
    });
    await queryRunner.createForeignKey("product_collection", foreignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE product_collection DROP FOREIGN KEY FK_962b750e1401fa3ce379cec9a59");
  }
}
