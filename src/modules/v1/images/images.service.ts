import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateImageUseCase } from './use-cases/createImage.usecase';
import { DataSource, Repository } from 'typeorm';
import { ImageEntity } from 'src/database/entities/images.entyty';
import { InjectRepository } from '@nestjs/typeorm';
import { FindAllImagesUseCase } from './use-cases/findAllImages.usecase';
import { FindImagesByIdUseCase } from './use-cases/findImagesById.usecase';
import { DeleteImagesByIdUseCase } from './use-cases/deleteImagesById.usecase';
import { UpdateImagesByIdUseCase } from './use-cases/updateImagesById.usecase';
import { CheckImageDataConsistencyUseCase } from './use-cases/checkImageDataConsistency.usecase';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ImagesService {
    constructor(
        private readonly userSerivce: UserService,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        private readonly dataSource: DataSource

    ) { }

    create = new CreateImageUseCase(
        this.userSerivce,
        this.cloudinaryService,
        this.imageRepository,
        this.dataSource
    );

    findAll = new FindAllImagesUseCase(this.imageRepository);

    findById = new FindImagesByIdUseCase(this.imageRepository);

    deleteById = new DeleteImagesByIdUseCase(
        this.cloudinaryService,
        this.dataSource
    );

    updateById = new UpdateImagesByIdUseCase(
        this.imageRepository,
        this.cloudinaryService,
        this.dataSource,
    );

    CheckImageDataConsistency = new CheckImageDataConsistencyUseCase(this.imageRepository, this.cloudinaryService);

    // verifica a consistência dos dados de imagens diariamente
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleCronCheckImageDataConsistency() {
        this.CheckImageDataConsistency.execute();
    }

}
