import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";


export class createTableOrderItem1636468887437 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'order_item',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'orderId',
                        type: 'int',
                    },
                    {
                        name: 'variantId',
                        type: 'int',
                    },
                    {
                        name: 'price',
                        type: 'int',
                    },
                    {
                        name: 'comparePrice',
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
            'order_item',
            new TableForeignKey({
                columnNames: ['orderId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
                // onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'order_item',
            new TableForeignKey({
                columnNames: ['variantId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'variant',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order_item");
    }

}

