import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const adminUser = await this.insertUsers();

    await this.inserNewProductos(adminUser);

    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.productService.deleteAllProduct();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {

    const seedUsers = initialData.user;

    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    })

    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];
  }

  private async inserNewProductos(user: User) {
    await this.productService.deleteAllProduct();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    const results = await Promise.all(insertPromises);

    return true;
  }
}
