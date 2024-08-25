import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1724461544403 implements MigrationInterface {

   
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(
      `CREATE TABLE "users" (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            name varchar(256),
            email varchar(256) NOT NULL,
            password varchar(256) NOT NULL,
            CONSTRAINT users_pk_id PRIMARY KEY (id),
            CONSTRAINT users_un_email UNIQUE (email)
        );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }

}
