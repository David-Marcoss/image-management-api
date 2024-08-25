import { MigrationInterface, QueryRunner } from "typeorm";

export class ImagesTable1724510646127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(
          `CREATE TABLE "images" (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            cloudinary_id varchar(256) NOT NULL,
            url varchar(256) NOT NULL,
            user_id uuid NOT NULL,
            CONSTRAINT images_pk_id PRIMARY KEY (id),
            CONSTRAINT images_fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "images";`);
    }
}
