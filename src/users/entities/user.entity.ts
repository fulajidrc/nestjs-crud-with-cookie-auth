import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
  })
export class User {
    @ApiProperty({ example: 'Test Name', description: 'The name of the User' })
    @Prop()
    name: string;

    @ApiProperty({ example: 'xyz@gmail.com', description: 'The email of the User' })
    @Prop()
    email: string;

    @ApiProperty({ example: 'xyz@123', description: 'The password of the User' })
    @Prop()
    password: string;

    @Prop()
    username: string;

    @ApiProperty({ example: '6406c55608d1a02e2face41b', description: 'The id of the User' })
    _id?: string;

    sub?: string;

}

const UserSchema = SchemaFactory.createForClass(User);


UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user',
});


export { UserSchema };

export class UserListSuccessResponse {

  @ApiProperty({
      description: 'status',
  })
  message?: string;

  @ApiProperty({
      description: 'could contain some info',  
      type: [User]      
  })
  data?: [User];
}



export class UserBedResponse {

  @ApiProperty({
      description: 'status',
  })
  message?: string;
}

