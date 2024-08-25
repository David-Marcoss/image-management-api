import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ImageEntity } from "src/database/entities/images.entyty";
import { Repository, DataSource } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class DeleteImagesByIdUseCase {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly cloudinaryService: CloudinaryService,
        private readonly dataSource: DataSource
    ) { }

    async execute(imageId: string, userLoggedId: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const image = await queryRunner.manager.findOne(ImageEntity, {
                where: {
                    userId: userLoggedId,
                    id: imageId
                }
            });

            if (!image) {
                throw new NotFoundException('Image not found');
            }

            await queryRunner.manager.delete(ImageEntity, imageId);
            await this.cloudinaryService.deleteImage(image.cloudinaryId);
            await queryRunner.commitTransaction();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error.message);

            if(error.message.includes('Image not found')) throw new NotFoundException('Image not found');

            throw new InternalServerErrorException('Error to delete image');
        
        } finally {
            await queryRunner.release();
        }
    }
}
