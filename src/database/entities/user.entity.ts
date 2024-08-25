import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ImageEntity } from './images.entyty'; // Certifique-se de ajustar o caminho correto para a entidade Image

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToMany(() => ImageEntity, image => image.user)
  images: ImageEntity[];
}
