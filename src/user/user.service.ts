import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { hash } from "bcrypt"
import { MessageResponseDTO } from '../dto/response.dto';
import { UserListResponseDTO } from './dto/user-list.dto';
import { UserEntityDTO, UserEntityResponseDTO } from './dto/user-entity.dto';
import { CustomRole } from '../custom-role/entities/custom-role.entity';
import { SystemRoles } from '../enums/role.enum';

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

  async findAll(page: number): Promise<UserListResponseDTO> {
    const users = await this.userModel.find().paginate({ page: page })
    const mappedUsers: UserEntityDTO[] = []

    for (let user of users.docs) {
      const role = await this.customeRoleModel.findById(user.customRoleId)
      mappedUsers.push({
        id: user._id,
        username: user.customID,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        customRole: role?.name ?? "unknown"

      })
    }

    return {
      statusCode: 200,
      page: page,
      pageCount: users.totalPages,
      list: mappedUsers
    }

  }

  async findOne(id: ObjectId): Promise<UserEntityResponseDTO> {
    const user = await this.userModel.findById(id).exec()

    if (!user)
      throw new NotFoundException("user is not exists")

    const role = await this.customeRoleModel.findById(user.customRoleId)

    return {
      statusCode: 200,
      user: {
        id: user._id,
        username: user.customID,
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        customRole: role?.name ?? "unknown"

      }
    }
  }

  async userIsExists(userId: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ _id: userId }).select({ _id: 1 }).exec()
      return user != undefined
    }
    catch {
      return false
    }

  }

  async update(id: ObjectId, data: UpdateUserDto): Promise<MessageResponseDTO> {
    const user = await this.userModel.findById(id).exec()

    if (user == undefined)
      throw new NotFoundException("id is not found")

    await user.updateOne({ ...data }).exec()

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

  async getRefreshToksnHash(phonenumber: string): Promise<[string, SystemRoles] | undefined> {
    const user = await this.userModel.findOne({ phonenumber: phonenumber }).exec()
    if (!user)
      return undefined

    return [user.refreshTokenHash, user.systemRole]
  }

  async getSystemRole(phonenumber: string): Promise<SystemRoles> {
    return (await this.userModel.findOne({ phonenumber: phonenumber }).exec()).systemRole
  }

  async getUserIdByPhonunmber(phonenumber: string): Promise<Types.ObjectId | undefined> {
    const user = await this.userModel.findOne({ phonenumber: phonenumber }, { _id: 1 }).exec()
    return user?._id
  }

}
