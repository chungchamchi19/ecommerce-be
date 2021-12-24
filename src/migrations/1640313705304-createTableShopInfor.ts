import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableShopInfor1640313705304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: "shop_infor",
              columns: [
                {
                  name: "id",
                  type: "int",
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: "increment",
                },
                {
                  name: "facebook",
                  type: "varchar",
                },
                {
                    name: "zalo",
                    type: "varchar",
                },
                {
                    name: "bossName",
                    type: "varchar",
                },
                {
                    name: "email",
                    type:"varchar"
                },
                {
                    name: "phone",
                    type:"varchar"
                },
                {
                    name: "bankAccountId",
                    type:"varchar"
                },
              ],
            }),
            true,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("ship_infor");
    }

}
