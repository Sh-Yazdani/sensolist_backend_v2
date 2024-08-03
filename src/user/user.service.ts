import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { hash } from "bcrypt"
import { UserEntityDTO } from './dto/user-entity.dto';
import { CustomRole } from '../custom-role/entities/custom-role.entity';
import { SystemRoles } from '../enums/role.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CustomRole.name) private readonly customeRoleModel: Model<CustomRole>,
  ) { }

  async create(user: CreateUserDto, passHash: string): Promise<void> {
    const customID = `U${(new Date()).getTime()}`

    const newUser = new this.userModel({
      customID, passHash, ...user
    })

    await newUser.save()
  }

  async findAll(page: number): Promise<{ list: UserEntityDTO[], totalPages: number }> {
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
      totalPages: users.totalPages,
      list: mappedUsers
    }

  }

  async findOne(id: ObjectId): Promise<UserEntityDTO | undefined> {
    const user = await this.userModel.findById(id).exec()

    if (!user)
      return undefined

    const role = await this.customeRoleModel.findById(user.customRoleId)

    return {
      id: user._id,
      username: user.customID,
      firstname: user.firstname,
      lastname: user.lastname,
      phonenumber: user.phonenumber,
      customRole: role?.name ?? "unknown"
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

  async update(id: ObjectId, data: UpdateUserDto): Promise<boolean> {
    const user = await this.userModel.findById(id).exec()

    if (!user)
      return false

    await user.updateOne({ ...data }).exec()

    return true
  }

  async remove(id: ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec()
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
