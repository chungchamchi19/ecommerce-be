import { MigrationInterface, QueryRunner } from "typeorm";

export class addThumbnailForCollection1640340451937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE collection ADD COLUMN thumbnailId int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE collection DROP COLUMN thumbnailId`);
  }
}
