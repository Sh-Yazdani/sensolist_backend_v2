import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose"

@Schema({ timestamps: true })
export class CustomRole {

    @Prop()
    name: String

    @Prop()
    description: String

}


export const CustomRoleSchema = SchemaFactory.createForClass(CustomRole)

