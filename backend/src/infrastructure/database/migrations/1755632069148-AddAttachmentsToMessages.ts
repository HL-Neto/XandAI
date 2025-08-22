import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttachmentsToMessages1755632069148 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "chat_messages" 
            ADD COLUMN "attachments" TEXT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "chat_messages" 
            DROP COLUMN "attachments"
        `);
    }

}
