import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";


export class createCartItemTable1636279230048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'cart_item',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                  name: 'cartId',
                  type: 'int',
                },
                {
                  name: 'variantId',
                  type: 'int',
                },
                {
                  name: 'quantity',
                  type: 'int',
                },
               
              ],
            }),
            true,
          );
          queryRunner.clearSqlMemory();
          await queryRunner.createForeignKey(
            'cart_item',
            new TableForeignKey({
              columnNames: ['cartId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'cart',
              onDelete: 'CASCADE',
            }),
          );
          await queryRunner.createForeignKey(
            'cart_item',
            new TableForeignKey({
              columnNames: ['variantId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'variant',
              onDelete: 'CASCADE',
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart_item");
    }

}

