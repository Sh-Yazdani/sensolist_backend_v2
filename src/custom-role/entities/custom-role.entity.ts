import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"
import { Factory } from "nestjs-seeder"

@Schema({ timestamps: true })
export class CustomRole {

    @Factory('role')
    @Prop({type:String, required: true })
    name: String

    @Factory(faker => faker.lorem.paragraph({min:1, max:3}))
    @Prop({type:String, required: true })
    description: String

}


export const CustomRoleSchema = SchemaFactory.createForClass(CustomRole)

