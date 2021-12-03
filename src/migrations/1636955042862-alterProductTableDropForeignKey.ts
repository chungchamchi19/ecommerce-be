import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class alterProductTableDropForeignKey1636955042862 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE product DROP FOREIGN KEY FK_77800490a869025cf330026fb00, DROP KEY FK_77800490a869025cf330026fb00;",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.clearSqlMemory();
    const foreignKey = new TableForeignKey({
      columnNames: ["featureImageId"],
      referencedColumnNames: ["id"],
      referencedTableName: "media",
      onDelete: "CASCADE",
    });
    await queryRunner.createForeignKey("product", foreignKey);
  }
}
