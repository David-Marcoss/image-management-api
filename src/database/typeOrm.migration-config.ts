import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ImageEntity } from './entities/images.entyty';

config(); // Carrega as variáveis do arquivo .env

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST, 
  port: parseInt(process.env.DB_PORT, 10), 
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity,ImageEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false, 
};

export default new DataSource(dataSourceOptions);
