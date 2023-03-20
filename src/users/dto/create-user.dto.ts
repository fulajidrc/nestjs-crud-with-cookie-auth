import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { User } from "../entities/user.entity";


class Languages{
    @ApiProperty({
        description: '564564446',
    })
    id?: string;

    @ApiProperty({
        description: '1',
    })
    type?: string;
}

export class CreateUserDto {
    @ApiProperty({ example: 'Test name', description: 'The name of the User' })
    @IsNotEmpty()
    name: string;


    @ApiProperty({ example: 'test@gmail.com', description: 'The email of the User' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'xyz@123', description: 'The password of the User' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'could contain some info',  
        type: [Languages]      
    })
    languages?:[Languages]
}
