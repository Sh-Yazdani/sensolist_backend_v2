import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { hash } from "bcrypt"
import { MessageResponseDTO } from 'src/dto/response.dto';
import { UserListResponseDTO } from './dto/user-list.dto';
import { UserEntityResponseDTO } from './dto/user-entity.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(data: CreateUserDto): Promise<MessageResponseDTO> {
    const passwordHash = this.hashPassword(data.password)

    const newUser = new this.userModel({
      passwordHash, ...data
    })

    await newUser.save()

    return {
      statusCode: 201,
      message: "user was created"
    }
  }

  async findAll(): Promise<UserListResponseDTO> {
    const data = await this.userModel.find({}, { passwordHash: -1, creator: -1 }).exec()

    return {
      statusCode: 200,
      list: data.map(u =>
        ({ id: u._id, firstname: u.firstname, lastname: u.lastname, phonenumber: u.phonenumber })
      )
    }

  }

  async findOne(id: ObjectId): Promise<UserEntityResponseDTO> {
    const user = await this.userModel.findById(id, { passwordHash: -1, creator: -1 }).exec()

    return {
      statusCode: 200,
      user: { id: user._id, firstname: user.firstname, lastname: user.lastname, phonenumber: user.phonenumber }
    }
  }

  async update(id: ObjectId, data: UpdateUserDto): Promise<MessageResponseDTO> {
    const user = await this.userModel.findById(id).exec()

    if (user == undefined)
      throw new NotFoundException("id is not found")

    await user.updateOne(data).exec()

    return {
      statusCode: 200,
      message: "user was updated"
    }
  }

  async remove(id: ObjectId):Promise<MessageResponseDTO> {
    await this.userModel.deleteOne({ _id: id }).exec()

    return {
      statusCode: 200,
      message: "user was deleted"
    }
  }

  async getPasswordHash(phonenumber: string): Promise<string> {

    const user = await this.userModel.findOne({ phonenumber: phonenumber }, { passwordhash: 1 }).exec()

    if (!user)
      throw new NotFoundException("user not exists")

    return user.passwordHash

  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
  }

}
