import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "../../../../database/entities/images.entyty";


@Injectable()
export class CheckImageDataConsistencyUseCase {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }
    
    private readonly logger = new Logger("CheckImageDataConsistencyUseCase");

    async execute(): Promise<void> {
        try {
            this.logger.debug("Data consistency check started");
            
            const imagesDataDB = await this.imageRepository.find();
            const imagesDataCloudinary = await this.cloudinaryService.getAllImages();

            console.log("tamanho imagesDataDB", imagesDataDB.length);
            console.log("tamanho imagesDataCloudinary", imagesDataCloudinary.length);

            // Verificar inconsistências no banco de dados (imagens no DB que não existem no Cloudinary)
            const deleteImagePromises = imagesDataDB.map(async (image) => {

                const isImageExists = await this.cloudinaryService.imageExists(image.cloudinaryId);

                if (!isImageExists) {
                    return this.imageRepository.delete(image.id);
                }
            });

            // Verificar inconsistências no Cloudinary (imagens no Cloudinary que não existem no DB)
            const deleteCloudinaryImagePromises = imagesDataCloudinary.map(async (image) => {
                const isImageExists = await this.imageRepository.findOne({
                    where: { cloudinaryId: image.public_id }
                });

                if (!isImageExists) {
                    return this.cloudinaryService.deleteImage(image.public_id);
                }
            });

            // Executar todas as exclusões em paralelo
            await Promise.all([...deleteImagePromises, ...deleteCloudinaryImagePromises]);

            this.logger.debug("Data consistency check completed");

        } catch (error) {
            // this.logger.debug(error)

            console.error("Error checking data consistency:", error.message);
            throw new InternalServerErrorException('Error checking data consistency');
        }
    }
}
