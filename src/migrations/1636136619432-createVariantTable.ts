import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class createVariantTable1636136619432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "variant",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "option1",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "option2",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "option3",
                type: "varchar",
                isNullable: true,
              },
              {
                name: "price",
                type: "int",
                default: 0,
              },
              {
                name: "comparePrice",
                type: "int",
                default: 0,
              },
              {
                name: "featureImageId",
                type: "int",
              },
              {
                name: "availableNumber",
                type: "int"
              },
              {
                name: "productId",
                type: "int",
              },
           
            ],
          }),
          true,
        );
        queryRunner.clearSqlMemory();
        await queryRunner.createForeignKey(
          'variant',
          new TableForeignKey({
            columnNames: ['productId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'product',
            onDelete: 'CASCADE',
          }),
        );
        await queryRunner.createForeignKey(
          'variant',
          new TableForeignKey({
            columnNames: ['featureImageId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'media',
            onDelete: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("variant");
      }

}
