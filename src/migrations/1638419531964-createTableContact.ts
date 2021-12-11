import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTableContact1638419531964 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "contact",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              {
                name: "customerName",
                type: "varchar",
              },
              {
                name: "customerPhone",
                type: "varchar",
              },
              {
                name: "customerEmail",
                type: "varchar",
              },
              {
                name: "message",
                type: "text",
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
      }
        

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("contact");
    }

}
