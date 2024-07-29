import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId } from 'mongoose';
import { hash } from "bcrypt"
import { MessageResponseDTO } from '../dto/response.dto';
import { UserListResponseDTO } from './dto/user-list.dto';
import { UserEntityDTO, UserEntityResponseDTO } from './dto/user-entity.dto';
import { CustomRole } from '../custom-role/entities/custom-role.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CustomRole.name) private readonly customeRoleModel: Model<CustomRole>,
  ) { }

  async create(data: CreateUserDto): Promise<MessageResponseDTO> {
    const passwordHash = await this.hashData(data.password)

    const customID = `U${(new Date()).getTime()}`

    const newUser = new this.userModel({
      customID, passwordHash, ...data
    })

    await newUser.save()

    return {
      statusCode: 201,
      message: "user was created"
    }
  }

  async findAll(): Promise<UserListResponseDTO> {
    const users = await this.userModel.find().exec()
    const mappedUsers: UserEntityDTO[] = []

    for (let user of users) {
      const role = await this.customeRoleModel.findById(user.customRoleId)
      mappedUsers.push({
        id: user.customID,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        customRole: role.name

      })
    }

    return {
      statusCode: 200,
      list: mappedUsers
    }

  }

  async findOne(id: ObjectId): Promise<UserEntityResponseDTO> {
    const user = await this.userModel.findById(id).exec()
    const role = await this.customeRoleModel.findById(user.customRoleId)

    return {
      statusCode: 200,
      user: {
        id: user.customID,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        customRole: role.name

      }
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

  async remove(id: ObjectId): Promise<MessageResponseDTO> {
    await this.userModel.deleteOne({ _id: id }).exec()

    return {
      statusCode: 200,
      message: "user was deleted"
    }
  }

  async getPasswordHash(phonenumber: string): Promise<string> {

    const user = await this.userModel.findOne({ phonenumber: phonenumber }).exec()

    if (!user)
      throw new NotFoundException("user not exists")

    return user.passwordHash

  }

  async hashData(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
  }

  async storeRefreshToken(token: string, phonenumber: string) {
    const tokenHash = await this.hashData(token)
    await this.userModel.updateOne({ phonenumber: phonenumber }, { refreshTokenHash: tokenHash })

  }

  async getRefreshToksnHash(phonenumber: string): Promise<string | undefined> {
    return (await this.userModel.findOne({ phonenumber: phonenumber }, { refreshTokenHash: 1 }).exec()).refreshTokenHash
  }

}
