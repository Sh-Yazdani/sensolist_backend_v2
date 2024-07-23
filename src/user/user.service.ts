import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { DataResponse, MessageResponseDTO } from 'src/dto/response.dto';
import { UserDetailDTO } from './dto/user-list.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

  async create(data: CreateUserDto): Promise<MessageResponseDTO> {
    const passwordHash = "" //TODO hashing password

    const newUser = new this.userModel({
      passwordHash, ...data
    })

    await newUser.save()

    return {
      status: 201,
      message: "user was created"
    }
  }

  async findAll(): Promise<UserDetailDTO[]> {
    const data = await this.userModel.find({}, { passwordHash: -1, creator: -1 }).exec()
    return data.map(u => { return { id: u._id, firstname: u.firstname, lastname: u.lastname, phonenumber: u.phonenumber } })
  }

  findOne(id: ObjectId): UserDetailDTO {
    const user = this.userModel.findById(id, { passwordHash: -1, creator: -1 }).exec()

    return { id: user._id, firstname: user.firstname, lastname: user.lastname, phonenumber: user.phonenumber }
  }

  async update(id: ObjectId, data: UpdateUserDto): Promise<MessageResponseDTO> {
    const user = await this.userModel.findById(id).exec()

    if (user == undefined)
      throw new NotFoundException("id is not found")

    await user.updateOne(data).exec()

    return {
      status: 200,
      message: "user was updated"
    }
  }

  remove(id: ObjectId) {
    this.userModel.deleteOne({ _id: id }).exec()
  }
}
